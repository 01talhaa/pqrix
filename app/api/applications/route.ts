import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { JobApplicationDocument, JOB_APPLICATIONS_COLLECTION, CreateJobApplicationInput } from "@/lib/models/JobApplication"
import { JOB_POSTINGS_COLLECTION, JobPostingDocument } from "@/lib/models/JobPosting"

// GET /api/applications - Get all applications (admin) or user's applications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const jobId = searchParams.get("jobId")
    const status = searchParams.get("status")
    const admin = searchParams.get("admin") === "true"

    const { db } = await connectToDatabase()
    const collection = db.collection<JobApplicationDocument>(JOB_APPLICATIONS_COLLECTION)

    let query: any = {}

    // Filter by user
    if (userId && !admin) {
      query.userId = userId
    }

    // Filter by job
    if (jobId) {
      query.jobId = jobId
    }

    // Filter by status
    if (status) {
      query.status = status
    }

    const applications = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray()

    // Fetch job details for each application
    const jobsCollection = db.collection<JobPostingDocument>(JOB_POSTINGS_COLLECTION)
    const enrichedApplications = await Promise.all(
      applications.map(async (app) => {
        const job = await jobsCollection.findOne({ id: app.jobId })
        return {
          ...app,
          job: job ? {
            title: job.title,
            department: job.department,
            location: job.location,
            type: job.type,
          } : null,
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: enrichedApplications,
      count: enrichedApplications.length,
    })
  } catch (error) {
    console.error("Error fetching applications:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch applications" },
      { status: 500 }
    )
  }
}

// POST /api/applications - Submit new application
export async function POST(request: NextRequest) {
  try {
    const body: CreateJobApplicationInput = await request.json()

    // Validation
    if (!body.jobId || !body.userId || !body.applicantName || !body.applicantEmail || !body.applicantPhone || !body.resumeUrl || !body.coverLetter || body.yearsOfExperience === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const collection = db.collection<JobApplicationDocument>(JOB_APPLICATIONS_COLLECTION)

    // Check if user already applied for this job
    const existing = await collection.findOne({
      jobId: body.jobId,
      userId: body.userId,
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: "You have already applied for this position" },
        { status: 400 }
      )
    }

    const now = new Date()
    const application: JobApplicationDocument = {
      id: `app-${Date.now()}`,
      ...body,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    }

    await collection.insertOne(application)

    // Increment application count on job posting
    const jobsCollection = db.collection<JobPostingDocument>(JOB_POSTINGS_COLLECTION)
    await jobsCollection.updateOne(
      { id: body.jobId },
      { $inc: { applicationsCount: 1 } }
    )

    return NextResponse.json({
      success: true,
      data: application,
      message: "Application submitted successfully!",
    })
  } catch (error) {
    console.error("Error creating application:", error)
    return NextResponse.json(
      { success: false, error: "Failed to submit application" },
      { status: 500 }
    )
  }
}
