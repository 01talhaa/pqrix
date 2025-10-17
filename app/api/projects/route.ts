import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { PROJECTS_COLLECTION } from '@/lib/models/Project'
import { ObjectId } from 'mongodb'

// GET /api/projects - List all projects
export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const projects = await db
      .collection(PROJECTS_COLLECTION)
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({ success: true, data: projects })
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

    // Create project document
    const projectData = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection(PROJECTS_COLLECTION).insertOne(projectData)

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
