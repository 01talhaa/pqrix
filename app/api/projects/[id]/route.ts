import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { PROJECTS_COLLECTION } from '@/lib/models/Project'
import { ObjectId } from 'mongodb'
import { deleteFromCloudinary, extractPublicId } from '@/lib/cloudinary'

// GET /api/projects/[id] - Get a single project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { db } = await connectToDatabase()
    
    // Try to find by custom id field first, then fall back to _id
    let project = await db
      .collection(PROJECTS_COLLECTION)
      .findOne({ id })

    // If not found by id field, try _id (for MongoDB ObjectId)
    if (!project && ObjectId.isValid(id)) {
      project = await db
        .collection(PROJECTS_COLLECTION)
        .findOne({ _id: new ObjectId(id) })
    }

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: project })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

// PUT /api/projects/[id] - Update a project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { db } = await connectToDatabase()

    // Update project document
    const updateData = {
      ...body,
      updatedAt: new Date(),
    }

    // Remove _id from update data if present
    delete updateData._id

    const result = await db
      .collection(PROJECTS_COLLECTION)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      )

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { db } = await connectToDatabase()

    // First, get the project to delete images from Cloudinary
    const project = await db
      .collection(PROJECTS_COLLECTION)
      .findOne({ _id: new ObjectId(id) })

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }

    // Delete images from Cloudinary
    if (project.images && Array.isArray(project.images)) {
      for (const imageUrl of project.images) {
        try {
          const publicId = extractPublicId(imageUrl)
          if (publicId) {
            await deleteFromCloudinary(publicId)
          }
        } catch (error) {
          console.error('Error deleting image from Cloudinary:', error)
          // Continue even if image deletion fails
        }
      }
    }

    // Delete the project from database
    const result = await db
      .collection(PROJECTS_COLLECTION)
      .deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete project' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
