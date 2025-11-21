import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { PROJECTS_COLLECTION } from '@/lib/models/Project'
import { ObjectId } from 'mongodb'
import cache, { getOrSet, cacheKeys, CACHE_TTL } from '@/lib/cache'

// GET /api/projects - List all projects (with caching)
export async function GET() {
  try {
    const projects = await getOrSet(
      cacheKeys.projects.all(),
      async () => {
        const { db } = await connectToDatabase()
        return await db
          .collection(PROJECTS_COLLECTION)
          .find({})
          .sort({ year: -1, createdAt: -1 })
          .toArray()
      },
      CACHE_TTL.MEDIUM // Cache for 1 minute
    )

    return NextResponse.json(
      { success: true, data: projects },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { db } = await connectToDatabase()

    // Clean serviceCategory to prevent empty strings
    if (body.serviceCategory === "" || body.serviceCategory === null) {
      delete body.serviceCategory
    }

    // Create project document
    const projectData = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection(PROJECTS_COLLECTION).insertOne(projectData)

    // Invalidate cache after creating new project
    cache.invalidatePattern('projects:')

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...projectData },
    })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
