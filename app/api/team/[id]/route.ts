import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { TEAM_COLLECTION } from '@/lib/models/TeamMember'
import { ObjectId } from 'mongodb'

// GET single team member
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { db } = await connectToDatabase()

    const teamMember = await db.collection(TEAM_COLLECTION).findOne({ id })

    if (!teamMember) {
      return NextResponse.json(
        { success: false, error: 'Team member not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: teamMember,
    })
  } catch (error) {
    console.error('Error fetching team member:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team member' },
      { status: 500 }
    )
  }
}

// PUT update team member
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { db } = await connectToDatabase()

    const updateData = {
      ...body,
      updatedAt: new Date(),
    }

    const result = await db.collection(TEAM_COLLECTION).updateOne(
      { id },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Team member not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updateData,
    })
  } catch (error) {
    console.error('Error updating team member:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update team member' },
      { status: 500 }
    )
  }
}

// DELETE team member
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { db } = await connectToDatabase()

    const result = await db.collection(TEAM_COLLECTION).deleteOne({ id })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Team member not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Team member deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting team member:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete team member' },
      { status: 500 }
    )
  }
}
