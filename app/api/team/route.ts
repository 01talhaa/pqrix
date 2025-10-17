import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { TEAM_COLLECTION, TeamMemberDocument } from '@/lib/models/TeamMember'

// GET all team members
export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const teamMembers = await db
      .collection(TEAM_COLLECTION)
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({
      success: true,
      data: teamMembers,
    })
  } catch (error) {
    console.error('Error fetching team members:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team members' },
      { status: 500 }
    )
  }
}

// POST create new team member
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { db } = await connectToDatabase()

    const teamMember: TeamMemberDocument = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection(TEAM_COLLECTION).insertOne(teamMember)

    return NextResponse.json({
      success: true,
      data: { ...teamMember, _id: result.insertedId },
    })
  } catch (error) {
    console.error('Error creating team member:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create team member' },
      { status: 500 }
    )
  }
}
