import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { JobPostingDocument, JOB_POSTINGS_COLLECTION } from "@/lib/models/JobPosting"

// GET /api/careers/[id] - Get single job posting
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { db } = await connectToDatabase()
    const collection = db.collection<JobPostingDocument>(JOB_POSTINGS_COLLECTION)

    const job = await collection.findOne({ id: id })

    if (!job) {
      return NextResponse.json(
        { success: false, error: "Job posting not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: job,
    })
  } catch (error) {
    console.error("Error fetching job posting:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch job posting" },
      { status: 500 }
    )
  }
}

// PUT /api/careers/[id] - Update job posting
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { db } = await connectToDatabase()
    const collection = db.collection<JobPostingDocument>(JOB_POSTINGS_COLLECTION)

    const existing = await collection.findOne({ id: id })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Job posting not found" },
        { status: 404 }
      )
    }

    const updates: any = await request.json()
    
    // Convert active to status
    const updateData: any = { ...updates }
    if (updates.hasOwnProperty('active')) {
      updateData.status = updates.active ? "active" : "draft"
      delete updateData.active
    }

    const result = await collection.updateOne(
      { id: id },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      }
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Failed to update job posting" },
        { status: 500 }
      )
    }

    const updated = await collection.findOne({ id: id })

    return NextResponse.json({
      success: true,
      data: updated,
    })
  } catch (error) {
    console.error("Error updating job posting:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update job posting" },
      { status: 500 }
    )
  }
}

// DELETE /api/careers/[id] - Delete job posting
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { db } = await connectToDatabase()
    const collection = db.collection<JobPostingDocument>(JOB_POSTINGS_COLLECTION)

    const result = await collection.deleteOne({ id: id })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Job posting not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Job posting deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting job posting:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete job posting" },
      { status: 500 }
    )
  }
}
