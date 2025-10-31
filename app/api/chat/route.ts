import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { connectToDatabase } from "@/lib/mongodb"

/**
 * POST /api/chat
 * Handles chatbot conversations with context about Pqrix
 * Multi-model fallback: tries gemini-2.0-flash-exp, 1.5-flash, 1.5-flash-latest, gemini-pro
 */
export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory, context } = await request.json()

    console.log("🤖 Chat request received:", { 
      message: message?.substring(0, 50),
      hasContext: !!context,
      historyLength: conversationHistory?.length || 0
    })

    if (!message?.trim()) {
      return NextResponse.json(
        { success: false, error: "Message is required" },
        { status: 400 }
      )
    }

    // Check API key
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.error("❌ GEMINI_API_KEY is not set in environment variables")
      return NextResponse.json(
        { 
          success: false, 
          message: "AI service is not configured. Please contact support via WhatsApp."
        },
        { status: 500 }
      )
    }

    console.log("✅ API Key found, length:", apiKey.length)

    // Use provided context or fetch fresh data (with caching)
    const pqrixContext = context || await getPqrixContextCached()
    console.log("✅ Context loaded, length:", pqrixContext.length)

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey)
    console.log("✅ GoogleGenerativeAI initialized")

    // Build conversation context
    const systemPrompt = `You are Pqrix AI Assistant, a helpful and professional chatbot for Pqrix - a leading software development company in Bangladesh.

CRITICAL INSTRUCTIONS:
1. **ALWAYS USE THE REAL-TIME DATABASE DATA PROVIDED BELOW** - Never make up information
2. When asked about services, mention EXACT service names, prices, and features from the database
3. When asked about projects, reference ACTUAL project names, clients, and technologies from the database
4. When asked about team, mention REAL team member names, roles, and expertise from the database
5. When asked about testimonials, quote ACTUAL client testimonials from the database
6. When asked about blogs/insights, reference REAL blog post titles and content from the database
7. If asked about something not in the database, say "Let me check with our team" and provide contact info
8. Be professional, friendly, and conversational
9. Use specific names, numbers, and details from the data below
10. Suggest relevant services or projects based on user needs

=== REAL-TIME DATABASE DATA (Updated every 30 seconds) ===
${pqrixContext}

CONTACT INFORMATION:
- Website: https://www.pqrix.com
- WhatsApp: +880 1878-377992 or +880 1401-658685
- Email: Available on website
- Location: Bangladesh

RESPONSE GUIDELINES:
✅ DO: Use exact names, prices, and details from the database above
✅ DO: Reference specific projects, team members, and services by name
✅ DO: Quote actual testimonials and blog posts
✅ DO: Provide accurate pricing from the database
❌ DON'T: Make up information not in the database
❌ DON'T: Give generic responses without using the data above
❌ DON'T: Ignore the real-time data provided

Remember: You have access to LIVE database information above. Use it to give accurate, specific answers!`

    // Build conversation string from history
    let conversationString = ''
    if (conversationHistory && conversationHistory.length > 0) {
      conversationString = conversationHistory.map((msg: any) => 
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n') + '\n\n'
    }

    // Create the full prompt
    const fullPrompt = `${systemPrompt}\n\nCONVERSATION HISTORY:\n${conversationString}\n\nUSER QUESTION: ${message}\n\nPQRIX AI ASSISTANT RESPONSE:`

    console.log("📝 Full prompt preview (first 500 chars):", fullPrompt.substring(0, 500))
    console.log("📊 Pqrix context preview (first 300 chars):", pqrixContext.substring(0, 300))

    // Initialize Gemini model with proper configuration
    // Try multiple models in order of preference
    const modelsToTry = [
      "gemini-2.0-flash-exp",
      "gemini-1.5-flash", 
      "gemini-1.5-flash-latest",
      "gemini-pro"
    ]
    
    let lastError: any = null
    
    for (const modelName of modelsToTry) {
      try {
        console.log(`🔄 Trying model: ${modelName}`)
        
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: {
            temperature: 0.7,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
          }
        })
        console.log(`✅ Model ${modelName} initialized`)

        console.log("📤 Sending request to Gemini API...")
        console.log("📏 Prompt length:", fullPrompt.length, "characters")
        
        const result = await model.generateContent(fullPrompt)
        console.log(" Received response from Gemini API")
        
        const response = await result.response
        const text = response.text()
        
        console.log(`✅ Success with ${modelName}! Response length:`, text.length)
        console.log("💬 Response preview (first 200 chars):", text.substring(0, 200))

        return NextResponse.json({
          success: true,
          message: text,
        })
      } catch (modelError: any) {
        console.error(`❌ Model ${modelName} failed:`, modelError?.message)
        lastError = modelError
        // Continue to next model
        continue
      }
    }
    
    // If all models failed, throw the last error
    if (lastError) {
      throw lastError
    }
  } catch (error: any) {
      console.error("❌ Gemini API error:", error)
      console.error("❌ Error details:", {
        message: error?.message,
        stack: error?.stack,
        status: error?.status,
        statusText: error?.statusText
      })
      
      // Check if it's a specific API error
      if (error?.message?.includes('API key')) {
        console.error("🔑 API Key issue detected")
        return NextResponse.json(
          { 
            success: false,
            message: "AI service authentication failed. Please contact support via WhatsApp at https://wa.me/8801401658685"
          },
          { status: 500 }
        )
      }
      
      if (error?.message?.includes('quota') || error?.message?.includes('limit')) {
        console.error("⚠️ API quota/limit issue detected")
        return NextResponse.json(
          { 
            success: false,
            message: "AI service is temporarily at capacity. Please try again in a moment or contact us via WhatsApp."
          },
          { status: 503 }
        )
      }
      
      // For model not found errors, return error - NO FALLBACK
      if (error?.status === 404 || error?.message?.includes('not found')) {
        console.error("❌ Model not found error")
        return NextResponse.json(
          { 
            success: false,
            message: "AI service is currently unavailable. Please contact us directly via WhatsApp for assistance: https://wa.me/8801401658685"
          },
          { status: 503 }
        )
      }
      
      // Return error instead of fallback to ensure real-time data
      console.error("❌ All models failed - returning error response")
      return NextResponse.json(
        { 
          success: false,
          message: "I'm having trouble connecting to the AI service. Please try again or contact us via WhatsApp: https://wa.me/8801401658685"
        },
        { status: 503 }
      )
    }
}

/**
 * Direct HTTP call to Gemini API as fallback when SDK fails
 */
async function directAPICall(apiKey: string, prompt: string): Promise<any> {
  const https = await import('https')
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`
  
  const data = JSON.stringify({
    contents: [{
      parts: [{
        text: prompt
      }]
    }],
    generationConfig: {
      temperature: 0.8,
      topK: 40,
      topP: 0.9,
      maxOutputTokens: 4096,
    }
  })

  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      },
      timeout: 30000
    }, (res) => {
      let responseData = ''
      
      res.on('data', (chunk) => {
        responseData += chunk.toString()
      })
      
      res.on('end', () => {
        try {
          console.log("📥 Direct API response:", responseData.substring(0, 500))
          const response = JSON.parse(responseData)
          
          // Check for error in response
          if (response.error) {
            console.log("❌ Direct API error:", response.error)
            reject(new Error(`Gemini API error: ${response.error.message}`))
            return
          }
          
          if (response.candidates && response.candidates[0] && response.candidates[0].content) {
            console.log("✅ Direct API call successful")
            resolve({
              response: {
                text: () => response.candidates[0].content.parts[0].text
              }
            })
          } else {
            console.log("❌ Invalid response structure:", JSON.stringify(response).substring(0, 200))
            reject(new Error('Invalid response format from direct API call'))
          }
        } catch (error) {
          console.log("❌ Parse error:", error)
          console.log("Raw response:", responseData.substring(0, 300))
          reject(new Error('Failed to parse response from direct API call'))
        }
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    req.on('timeout', () => {
      req.destroy()
      reject(new Error('Direct API call timeout'))
    })

    req.write(data)
    req.end()
  })
}

/**
 * Cached Pqrix context - refresh every 30 seconds for real-time data
 */
let cachedContext: string | null = null
let cacheTimestamp = 0
const CONTEXT_CACHE_TTL = 30 * 1000 // 30 seconds for real-time updates

async function getPqrixContextCached(): Promise<string> {
  const now = Date.now()
  
  // Return cached context if still fresh (within 30 seconds)
  if (cachedContext && (now - cacheTimestamp) < CONTEXT_CACHE_TTL) {
    console.log('✅ Using cached Pqrix context (age: ' + Math.round((now - cacheTimestamp) / 1000) + 's)')
    return cachedContext
  }
  
  console.log('🔄 Fetching fresh real-time Pqrix context from database...')
  try {
    cachedContext = await getPqrixContext()
    cacheTimestamp = now
    console.log('✅ Fresh context cached successfully')
    return cachedContext
  } catch (error) {
    console.error('❌ Failed to fetch context:', error)
    // If cache exists, use it even if expired
    if (cachedContext) {
      console.log('⚠️ Using expired cache as fallback')
      return cachedContext
    }
    throw error
  }
}

/**
 * Fetch Pqrix data to provide context to AI
 */
async function getPqrixContext(): Promise<string> {
  try {
    const { db } = await connectToDatabase()

    console.log('🔍 Fetching real-time data from database...')

    // Fetch all relevant data with complete information
    const [services, projects, team, testimonials, blogs, ads] = await Promise.all([
      db.collection("services").find({}).sort({ order: 1 }).toArray(),
      db.collection("projects").find({}).sort({ year: -1 }).toArray(),
      db.collection("team").find({}).sort({ order: 1 }).toArray(),
      db.collection("testimonials").find({ approved: true }).sort({ createdAt: -1 }).toArray(),
      db.collection("blogs").find({ status: "published" }).sort({ published: -1 }).toArray(),
      db.collection("ads").find({ active: true }).toArray(),
    ])

    console.log(`✅ Fetched: ${services.length} services, ${projects.length} projects, ${team.length} team members, ${testimonials.length} testimonials, ${blogs.length} blogs`)

    // Format services with detailed information
    const servicesText = services.map(s => {
      const features = s.features ? `\n  Features: ${s.features.join(', ')}` : ''
      const packages = s.packages ? `\n  Packages: ${s.packages.map((p: any) => `${p.name} (${p.price})`).join(', ')}` : ''
      return `📦 ${s.title}
  Category: ${s.category || 'General'}
  Description: ${s.description}
  Starting Price: ${s.pricing || 'Contact for pricing'}${features}${packages}
  ID: ${s.id}`
    }).join("\n\n")

    // Format projects with detailed information
    const projectsText = projects.map(p => {
      const tech = p.technologies ? `\n  Technologies: ${p.technologies.join(', ')}` : ''
      const tags = p.tags ? `\n  Tags: ${p.tags.join(', ')}` : ''
      return `🎯 ${p.title}
  Client: ${p.client}
  Category: ${p.category}
  Year: ${p.year}
  Status: ${p.status}
  Description: ${p.description}${tech}${tags}
  ID: ${p.id}`
    }).join("\n\n")

    // Format team with detailed information
    const teamText = team.map(t => {
      const expertise = t.expertise ? `\n  Expertise: ${t.expertise.join(', ')}` : ''
      const department = t.department ? `\n  Department: ${t.department}` : ''
      return `👤 ${t.name}
  Role: ${t.role}${department}
  Bio: ${t.bio || 'Experienced professional at Pqrix'}${expertise}
  ID: ${t.id}`
    }).join("\n\n")

    // Format testimonials
    const testimonialsText = testimonials.map(t => {
      const rating = t.rating ? ` (${t.rating}⭐)` : ''
      return `💬 ${t.name}${rating}
  Company: ${t.company || 'Valued Client'}
  Project: ${t.projectName || 'Various projects'}
  Testimonial: "${t.message}"`
    }).join("\n\n")

    // Format blogs/insights
    const blogsText = blogs.map(b => {
      const author = b.author ? ` by ${b.author}` : ''
      const date = b.published ? ` (${new Date(b.published).toLocaleDateString()})` : ''
      const category = b.category ? `\n  Category: ${b.category}` : ''
      return `📝 ${b.title}${author}${date}${category}
  Excerpt: ${b.excerpt}
  Slug: ${b.slug}`
    }).join("\n\n")

    // Format ads/promotions
    const adsText = ads.length > 0 ? ads.map(a => 
      `🎉 ${a.title}
  Description: ${a.description}
  CTA: ${a.ctaText || 'Learn More'}`
    ).join("\n\n") : ''

    const contextData = `
=== PQRIX COMPANY REAL-TIME DATA (From Database) ===

📋 SERVICES WE OFFER (${services.length} total):
${servicesText || 'No services available'}

🎯 OUR PROJECTS (${projects.length} total):
${projectsText || 'No projects available'}

👥 OUR TEAM (${team.length} members):
${teamText || 'No team data available'}

💬 CLIENT TESTIMONIALS (${testimonials.length} testimonials):
${testimonialsText || 'No testimonials available'}

📝 BLOG POSTS & INSIGHTS (${blogs.length} posts):
${blogsText || 'No blog posts available'}

${adsText ? `🎉 CURRENT PROMOTIONS:\n${adsText}\n` : ''}

=== IMPORTANT NOTES ===
- All data above is REAL-TIME from the database
- Always reference specific services, projects, team members, or testimonials when answering
- Use IDs, names, and specific details from above
- If asked about pricing, refer to the exact prices mentioned
- If asked about team, mention actual team members and their roles
- If asked about projects, mention actual project names and clients
`.trim()

    console.log('✅ Context prepared with real-time data')
    return contextData
  } catch (error) {
    console.error("❌ Error fetching Pqrix context:", error)
    throw error // Don't use fallback, throw error to force retry
  }
}

/**
 * Generates a fallback response when Gemini API is unavailable
 */
function generatePqrixFallbackResponse(userMessage: string): string {
  console.log("🤖 Generating Pqrix fallback response...")
  
  const message = userMessage.toLowerCase()
  
  if (message.includes('service') || message.includes('offer') || message.includes('what do you do')) {
    return `🌟 **Pqrix Services**\n\nWe offer comprehensive software development services:\n\n💼 **Discovery & Strategy** - Technical planning and project roadmapping\n🌐 **Web & SaaS Development** - Custom web applications, CRM, ERP solutions\n📱 **Mobile App Development** - iOS, Android, and cross-platform apps\n🎮 **3D Web & XR Development** - Immersive 3D experiences and virtual reality\n💻 **Desktop Applications** - Windows, macOS, and Linux software\n\nWould you like to know more about a specific service? Contact us on WhatsApp: https://wa.me/8801401658685`
  }
  
  if (message.includes('project') || message.includes('portfolio') || message.includes('work')) {
    return `📂 **Pqrix Projects**\n\nWe've successfully delivered numerous projects across various industries:\n\n✅ Web applications and SaaS platforms\n✅ Mobile apps for iOS and Android\n✅ E-commerce solutions\n✅ Business management systems\n✅ 3D interactive experiences\n\nOur projects showcase cutting-edge technology and user-centric design. Visit our projects page or contact us to see our full portfolio!\n\nWhatsApp: https://wa.me/8801401658685`
  }
  
  if (message.includes('team') || message.includes('developer') || message.includes('who')) {
    return `👥 **Pqrix Team**\n\nWe're a talented team of software developers, designers, and tech enthusiasts based in Bangladesh.\n\n🎯 **Our Expertise:**\n• Full-stack development\n• UI/UX design\n• Mobile app development\n• 3D graphics and XR\n• Cloud architecture\n\nOur team is passionate about building innovative solutions that help businesses grow. Learn more about our team on our website or reach out via WhatsApp!\n\nWhatsApp: https://wa.me/8801401658685`
  }
  
  if (message.includes('price') || message.includes('cost') || message.includes('pricing') || message.includes('how much')) {
    return `💰 **Pqrix Pricing**\n\nOur pricing is transparent and tailored to your needs:\n\n📋 **Discovery & Strategy** - Project planning and technical blueprints\n🌐 **Web Development** - Custom web applications and SaaS platforms\n📱 **Mobile Apps** - iOS and Android application development\n🎮 **3D/XR Development** - Immersive experiences\n💻 **Desktop Apps** - Cross-platform desktop software\n\nFor a detailed quote based on your specific requirements, please contact us:\n\nWhatsApp: https://wa.me/8801401658685\nWebsite: https://www.pqrix.com`
  }
  
  if (message.includes('contact') || message.includes('reach') || message.includes('talk') || message.includes('discuss')) {
    return `📞 **Contact Pqrix**\n\nWe'd love to hear from you!\n\n💬 **WhatsApp:** https://wa.me/8801401658685\n🌐 **Website:** https://www.pqrix.com\n📍 **Location:** Bangladesh\n\nOur team is ready to discuss your project requirements and provide expert guidance. Feel free to reach out anytime!`
  }
  
  if (message.includes('testimonial') || message.includes('review') || message.includes('client') || message.includes('feedback')) {
    return `⭐ **Client Testimonials**\n\nOur clients trust us for quality software development:\n\n💬 Businesses across Bangladesh and beyond have benefited from our expertise in web development, mobile apps, and custom software solutions.\n\n✨ We pride ourselves on:\n• Timely delivery\n• Quality code\n• Excellent communication\n• Post-launch support\n\nSee what our clients say about us on our website or start your own success story by contacting us!\n\nWhatsApp: https://wa.me/8801401658685`
  }
  
  if (message.includes('blog') || message.includes('article') || message.includes('post') || message.includes('read')) {
    return `📝 **Pqrix Blog**\n\nStay updated with our latest insights on technology and software development!\n\n🔍 **Topics we cover:**\n• Web development trends\n• Mobile app best practices\n• Software architecture\n• Tech industry insights\n• Project case studies\n\nVisit our blog section to read our latest articles and stay informed about the tech world!\n\nWebsite: https://www.pqrix.com`
  }
  
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return `👋 **Welcome to Pqrix!**\n\nI'm your AI assistant, here to help you learn about Pqrix - Bangladesh's innovative software development company.\n\n🚀 **What we do:**\n• Custom software development\n• Web & mobile applications\n• 3D experiences & XR\n• SaaS platforms\n• Desktop applications\n\nHow can I help you today? Feel free to ask about our services, projects, team, or anything else!\n\nFor immediate assistance: https://wa.me/8801401658685`
  }
  
  // Default response
  return `🤖 **Pqrix AI Assistant**\n\nI'm currently running in offline mode, but I'm here to help!\n\n**About Pqrix:**\nWe're a leading software development company in Bangladesh, specializing in:\n\n✅ Web & SaaS Development\n✅ Mobile App Development\n✅ 3D Web & XR Experiences\n✅ Desktop Applications\n✅ Discovery & Strategy\n\n💡 **Ask me about:**\n• Our services and pricing\n• Previous projects\n• Our team\n• Client testimonials\n• Technology insights\n\n📞 **Contact us directly:**\nWhatsApp: https://wa.me/8801401658685\nWebsite: https://www.pqrix.com\n\nHow can I assist you today?`
}
// Force recompile
