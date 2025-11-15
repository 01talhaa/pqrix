import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { JobApplicationDocument, JOB_APPLICATIONS_COLLECTION } from "@/lib/models/JobApplication"

// GET /api/applications/[id] - Get single application
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase()
    const collection = db.collection<JobApplicationDocument>(JOB_APPLICATIONS_COLLECTION)

    const application = await collection.findOne({ id: params.id })

    if (!application) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: application,
    })
  } catch (error) {
    console.error("Error fetching application:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch application" },
      { status: 500 }
    )
  }
}

// PUT /api/applications/[id] - Update application status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase()
    const collection = db.collection<JobApplicationDocument>(JOB_APPLICATIONS_COLLECTION)

    const existing = await collection.findOne({ id: params.id })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      )
    }

    const updates = await request.json()

    const result = await collection.updateOne(
      { id: params.id },
      {
        $set: {
          ...updates,
          reviewedAt: new Date(),
          updatedAt: new Date(),
        },
      }
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Failed to update application" },
        { status: 500 }
      )
    }

    const updated = await collection.findOne({ id: params.id })

    return NextResponse.json({
      success: true,
      data: updated,
    })
  } catch (error) {
    console.error("Error updating application:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update application" },
      { status: 500 }
    )
  }
}

// DELETE /api/applications/[id] - Delete application
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { db } = await connectToDatabase()
    const collection = db.collection<JobApplicationDocument>(JOB_APPLICATIONS_COLLECTION)

    const result = await collection.deleteOne({ id: params.id })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Application not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Application deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting application:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete application" },
      { status: 500 }
    )
  }
}
