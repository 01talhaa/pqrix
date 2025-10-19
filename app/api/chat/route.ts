import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { connectToDatabase } from "@/lib/mongodb"

/**
 * POST /api/chat
 * Handles chatbot conversations with context about Pqrix
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

    // Use provided context or fetch fresh data
    const pqrixContext = context || await getPqrixContext()
    console.log("✅ Context loaded, length:", pqrixContext.length)

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey)
    console.log("✅ GoogleGenerativeAI initialized")

    // Build conversation context
    const systemPrompt = `You are Pqrix AI Assistant, a helpful and professional chatbot for Pqrix - a leading software development company in Bangladesh.

IMPORTANT GUIDELINES:
1. Only answer questions about Pqrix, its services, projects, team, testimonials, and blogs
2. Be professional, friendly, and concise
3. If asked about topics outside of Pqrix, politely redirect to Pqrix-related topics
4. Use the provided data below to give accurate information
5. Personalize responses based on user queries
6. Suggest relevant services or projects when appropriate
7. Provide contact information when users show interest

PQRIX COMPANY INFORMATION:
${pqrixContext}

CONTACT INFORMATION:
- Website: https://www.pqrix.com
- WhatsApp: https://wa.link/65mf3i
- Location: Bangladesh
- Services: Custom software development, web apps, mobile apps, 3D web experiences, desktop applications

Remember: Stay focused on Pqrix. Be helpful, professional, and encourage users to contact us for their software needs.`

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
    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: {
          temperature: 0.8,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 4096,
        }
      })
      console.log("✅ Gemini model initialized successfully")

      console.log("📤 Sending request to Gemini API...")
      console.log("🔑 Using model: gemini-2.5-flash")
      console.log("📏 Prompt length:", fullPrompt.length, "characters")
      
      // Try SDK first, then fallback to direct HTTP if it fails
      let result
      try {
        result = await model.generateContent(fullPrompt)
      } catch (sdkError: any) {
        console.error("📤 SDK API call failed:", sdkError?.message)
        console.log("🔄 Trying direct HTTP request...")
        result = await directAPICall(apiKey, fullPrompt)
      }
      
      console.log("📥 Received response from Gemini API")
      
      const response = await result.response
      const text = response.text()
      
      console.log("✅ Response generated successfully, length:", text.length)
      console.log("💬 Response preview (first 200 chars):", text.substring(0, 200))

      return NextResponse.json({
        success: true,
        message: text,
      })
    } catch (geminiError: any) {
      console.error("❌ Gemini-specific error:", geminiError)
      console.error("❌ Gemini error details:", {
        message: geminiError?.message,
        stack: geminiError?.stack,
        status: geminiError?.status,
        statusText: geminiError?.statusText
      })
      
      // Check if it's a specific API error
      if (geminiError?.message?.includes('API key')) {
        console.error("🔑 API Key issue detected")
        return NextResponse.json(
          { 
            success: false,
            message: "AI service authentication failed. Please contact support via WhatsApp at https://wa.link/65mf3i"
          },
          { status: 500 }
        )
      }
      
      if (geminiError?.message?.includes('quota') || geminiError?.message?.includes('limit')) {
        console.error("⚠️ API quota/limit issue detected")
        return NextResponse.json(
          { 
            success: false,
            message: "AI service is temporarily at capacity. Please try again in a moment or contact us via WhatsApp."
          },
          { status: 503 }
        )
      }
      
      // For model not found errors, return fallback immediately
      if (geminiError?.status === 404 || geminiError?.message?.includes('not found')) {
        console.log("🔄 Model not found - using fallback response...")
        const fallbackResponse = generatePqrixFallbackResponse(message)
        
        return NextResponse.json(
          { 
            success: true,
            message: fallbackResponse,
            fallback: true
          },
          { status: 200 }
        )
      }
      
      // Try fallback response
      console.log("🔄 Generating fallback response...")
      const fallbackResponse = generatePqrixFallbackResponse(message)
      
      return NextResponse.json(
        { 
          success: true,
          message: fallbackResponse,
          fallback: true
        },
        { status: 200 }
      )
    }
  } catch (error: any) {
    console.error("Gemini API error:", error)
    console.error("Error details:", {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
    })
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to get response. Please try again.",
        message: "I'm having trouble connecting right now. Please try asking your question again, or contact us directly via WhatsApp.",
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    )
  }
}

/**
 * Direct HTTP call to Gemini API as fallback when SDK fails
 */
async function directAPICall(apiKey: string, prompt: string): Promise<any> {
  const https = await import('https')
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`
  
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
 * Fetch Pqrix data to provide context to AI
 */
async function getPqrixContext(): Promise<string> {
  try {
    const { db } = await connectToDatabase()

    // Fetch all relevant data
    const [services, projects, team, testimonials, blogs] = await Promise.all([
      db.collection("services").find({}).limit(20).toArray(),
      db.collection("projects").find({}).limit(20).toArray(),
      db.collection("team").find({}).limit(20).toArray(),
      db.collection("testimonials").find({ approved: true }).limit(10).toArray(),
      db.collection("blogs").find({ status: "published" }).limit(10).toArray(),
    ])

    // Format services
    const servicesText = services.map(s => 
      `- ${s.title}: ${s.description} (Pricing: ${s.pricing})`
    ).join("\n")

    // Format projects
    const projectsText = projects.map(p => 
      `- ${p.title} (${p.category}): ${p.description} for ${p.client}`
    ).join("\n")

    // Format team
    const teamText = team.map(t => 
      `- ${t.name} - ${t.role}: ${t.bio || 'Team member at Pqrix'}`
    ).join("\n")

    // Format testimonials
    const testimonialsText = testimonials.map(t => 
      `- ${t.name} (${t.company || 'Client'}): "${t.message}"`
    ).join("\n")

    // Format blogs
    const blogsText = blogs.map(b => 
      `- ${b.title}: ${b.excerpt}`
    ).join("\n")

    return `
SERVICES WE OFFER:
${servicesText || 'No services data available'}

OUR PROJECTS:
${projectsText || 'No projects data available'}

OUR TEAM:
${teamText || 'No team data available'}

CLIENT TESTIMONIALS:
${testimonialsText || 'No testimonials available'}

RECENT BLOG POSTS:
${blogsText || 'No blog posts available'}
`.trim()
  } catch (error) {
    console.error("Error fetching Pqrix context:", error)
    return `
Pqrix is a leading software development company in Bangladesh offering:
- Discovery & Strategy
- Web & SaaS Development
- Mobile App Development
- 3D Web & XR Development
- Desktop Applications

We have successfully delivered numerous projects for clients and have a skilled team of developers and designers.
`.trim()
  }
}

/**
 * Generates a fallback response when Gemini API is unavailable
 */
function generatePqrixFallbackResponse(userMessage: string): string {
  console.log("🤖 Generating Pqrix fallback response...")
  
  const message = userMessage.toLowerCase()
  
  if (message.includes('service') || message.includes('offer') || message.includes('what do you do')) {
    return `🌟 **Pqrix Services**\n\nWe offer comprehensive software development services:\n\n💼 **Discovery & Strategy** - Technical planning and project roadmapping\n🌐 **Web & SaaS Development** - Custom web applications, CRM, ERP solutions\n📱 **Mobile App Development** - iOS, Android, and cross-platform apps\n🎮 **3D Web & XR Development** - Immersive 3D experiences and virtual reality\n💻 **Desktop Applications** - Windows, macOS, and Linux software\n\nWould you like to know more about a specific service? Contact us on WhatsApp: https://wa.link/65mf3i`
  }
  
  if (message.includes('project') || message.includes('portfolio') || message.includes('work')) {
    return `📂 **Pqrix Projects**\n\nWe've successfully delivered numerous projects across various industries:\n\n✅ Web applications and SaaS platforms\n✅ Mobile apps for iOS and Android\n✅ E-commerce solutions\n✅ Business management systems\n✅ 3D interactive experiences\n\nOur projects showcase cutting-edge technology and user-centric design. Visit our projects page or contact us to see our full portfolio!\n\nWhatsApp: https://wa.link/65mf3i`
  }
  
  if (message.includes('team') || message.includes('developer') || message.includes('who')) {
    return `👥 **Pqrix Team**\n\nWe're a talented team of software developers, designers, and tech enthusiasts based in Bangladesh.\n\n🎯 **Our Expertise:**\n• Full-stack development\n• UI/UX design\n• Mobile app development\n• 3D graphics and XR\n• Cloud architecture\n\nOur team is passionate about building innovative solutions that help businesses grow. Learn more about our team on our website or reach out via WhatsApp!\n\nWhatsApp: https://wa.link/65mf3i`
  }
  
  if (message.includes('price') || message.includes('cost') || message.includes('pricing') || message.includes('how much')) {
    return `💰 **Pqrix Pricing**\n\nOur pricing is transparent and tailored to your needs:\n\n📋 **Discovery & Strategy** - Project planning and technical blueprints\n🌐 **Web Development** - Custom web applications and SaaS platforms\n📱 **Mobile Apps** - iOS and Android application development\n🎮 **3D/XR Development** - Immersive experiences\n💻 **Desktop Apps** - Cross-platform desktop software\n\nFor a detailed quote based on your specific requirements, please contact us:\n\nWhatsApp: https://wa.link/65mf3i\nWebsite: https://www.pqrix.com`
  }
  
  if (message.includes('contact') || message.includes('reach') || message.includes('talk') || message.includes('discuss')) {
    return `📞 **Contact Pqrix**\n\nWe'd love to hear from you!\n\n💬 **WhatsApp:** https://wa.link/65mf3i\n🌐 **Website:** https://www.pqrix.com\n📍 **Location:** Bangladesh\n\nOur team is ready to discuss your project requirements and provide expert guidance. Feel free to reach out anytime!`
  }
  
  if (message.includes('testimonial') || message.includes('review') || message.includes('client') || message.includes('feedback')) {
    return `⭐ **Client Testimonials**\n\nOur clients trust us for quality software development:\n\n💬 Businesses across Bangladesh and beyond have benefited from our expertise in web development, mobile apps, and custom software solutions.\n\n✨ We pride ourselves on:\n• Timely delivery\n• Quality code\n• Excellent communication\n• Post-launch support\n\nSee what our clients say about us on our website or start your own success story by contacting us!\n\nWhatsApp: https://wa.link/65mf3i`
  }
  
  if (message.includes('blog') || message.includes('article') || message.includes('post') || message.includes('read')) {
    return `📝 **Pqrix Blog**\n\nStay updated with our latest insights on technology and software development!\n\n🔍 **Topics we cover:**\n• Web development trends\n• Mobile app best practices\n• Software architecture\n• Tech industry insights\n• Project case studies\n\nVisit our blog section to read our latest articles and stay informed about the tech world!\n\nWebsite: https://www.pqrix.com`
  }
  
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return `👋 **Welcome to Pqrix!**\n\nI'm your AI assistant, here to help you learn about Pqrix - Bangladesh's innovative software development company.\n\n🚀 **What we do:**\n• Custom software development\n• Web & mobile applications\n• 3D experiences & XR\n• SaaS platforms\n• Desktop applications\n\nHow can I help you today? Feel free to ask about our services, projects, team, or anything else!\n\nFor immediate assistance: https://wa.link/65mf3i`
  }
  
  // Default response
  return `🤖 **Pqrix AI Assistant**\n\nI'm currently running in offline mode, but I'm here to help!\n\n**About Pqrix:**\nWe're a leading software development company in Bangladesh, specializing in:\n\n✅ Web & SaaS Development\n✅ Mobile App Development\n✅ 3D Web & XR Experiences\n✅ Desktop Applications\n✅ Discovery & Strategy\n\n💡 **Ask me about:**\n• Our services and pricing\n• Previous projects\n• Our team\n• Client testimonials\n• Technology insights\n\n📞 **Contact us directly:**\nWhatsApp: https://wa.link/65mf3i\nWebsite: https://www.pqrix.com\n\nHow can I assist you today?`
}
// Force recompile
