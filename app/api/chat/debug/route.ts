import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

/**
 * GET /api/chat/debug - Debug endpoint to check database data
 * This helps verify what data the AI has access to
 */
export async function GET() {
  try {
    const { db } = await connectToDatabase()

    console.log('🔍 Fetching database statistics...')

    // Get counts and sample data
    const [
      servicesCount,
      projectsCount,
      teamCount,
      testimonialsCount,
      blogsCount,
      adsCount,
      sampleServices,
      sampleProjects,
      sampleTeam
    ] = await Promise.all([
      db.collection("services").countDocuments(),
      db.collection("projects").countDocuments(),
      db.collection("team").countDocuments(),
      db.collection("testimonials").countDocuments({ approved: true }),
      db.collection("blogs").countDocuments({ status: "published" }),
      db.collection("ads").countDocuments({ active: true }),
      db.collection("services").find({}).limit(3).toArray(),
      db.collection("projects").find({}).limit(3).toArray(),
      db.collection("team").find({}).limit(3).toArray(),
    ])

    const stats = {
      timestamp: new Date().toISOString(),
      counts: {
        services: servicesCount,
        projects: projectsCount,
        team: teamCount,
        testimonials: testimonialsCount,
        blogs: blogsCount,
        ads: adsCount
      },
      samples: {
        services: sampleServices.map(s => ({
          id: s.id,
          title: s.title,
          pricing: s.pricing
        })),
        projects: sampleProjects.map(p => ({
          id: p.id,
          title: p.title,
          client: p.client
        })),
        team: sampleTeam.map(t => ({
          id: t.id,
          name: t.name,
          role: t.role
        }))
      }
    }

    return NextResponse.json({
      success: true,
      message: "Database is accessible and AI can fetch real-time data",
      data: stats
    })
  } catch (error) {
    console.error("Error fetching debug data:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch database stats",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
