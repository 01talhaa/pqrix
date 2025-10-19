import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

/**
 * GET /api/chat/context
 * Fetches all Pqrix data for chatbot context
 * This is called when the chatbot loads to preload context
 */
export async function GET() {
  console.log("Context endpoint called")
  try {
    console.log("Connecting to database...")
    const { db } = await connectToDatabase()
    console.log("Database connected successfully")

    // Fetch all relevant data
    console.log("Fetching data from collections...")
    const [services, projects, team, testimonials, blogs] = await Promise.all([
      db.collection("services").find({}).limit(20).toArray(),
      db.collection("projects").find({}).limit(20).toArray(),
      db.collection("team").find({}).limit(20).toArray(),
      db.collection("testimonials").find({ approved: true }).limit(10).toArray(),
      db.collection("blogs").find({ status: "published" }).limit(10).toArray(),
    ])

    console.log("Data fetched:", {
      services: services.length,
      projects: projects.length,
      team: team.length,
      testimonials: testimonials.length,
      blogs: blogs.length
    })

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

    const contextText = `
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

    return NextResponse.json({
      success: true,
      context: contextText,
      data: {
        services,
        projects,
        team,
        testimonials,
        blogs,
      }
    })
  } catch (error: any) {
    console.error("Error fetching Pqrix context:", error)
    console.error("Error details:", {
      message: error?.message,
      stack: error?.stack,
    })
    
    // Return fallback context
    const fallbackContext = `
Pqrix is a leading software development company in Bangladesh offering:
- Discovery & Strategy
- Web & SaaS Development
- Mobile App Development
- 3D Web & XR Development
- Desktop Applications

We have successfully delivered numerous projects for clients and have a skilled team of developers and designers.
`.trim()

    return NextResponse.json({
      success: true,
      context: fallbackContext,
      data: {
        services: [],
        projects: [],
        team: [],
        testimonials: [],
        blogs: [],
      }
    })
  }
}
