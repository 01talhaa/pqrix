import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { JobPostingDocument, JOB_POSTINGS_COLLECTION, CreateJobPostingInput } from "@/lib/models/JobPosting"

// GET /api/careers - Get all job postings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const department = searchParams.get("department")
    const type = searchParams.get("type")
    const featured = searchParams.get("featured")
    const admin = searchParams.get("admin") === "true"

    const { db } = await connectToDatabase()
    const collection = db.collection<JobPostingDocument>(JOB_POSTINGS_COLLECTION)

    let query: any = {}

    // If not admin view, only show active jobs
    if (!admin) {
      query.status = "active"
    } else if (status) {
      query.status = status
    }

    // Filter by department
    if (department && department !== "all") {
      query.department = department
    }

    // Filter by type
    if (type && type !== "all") {
      query.type = type
    }

    // Filter by featured
    if (featured === "true") {
      query.featured = true
    }

    const jobs = await collection
      .find(query)
      .sort({ featured: -1, createdAt: -1 })
      .toArray()

    return NextResponse.json({
      success: true,
      data: jobs,
      count: jobs.length,
    })
  } catch (error) {
    console.error("Error fetching job postings:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch job postings" },
      { status: 500 }
    )
  }
}

// POST /api/careers - Create new job posting
export async function POST(request: NextRequest) {
  try {
    const body: any = await request.json()

    // Validation
    if (!body.title || !body.department || !body.location || !body.type || !body.experience || !body.description || !body.requirements || !body.responsibilities) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const collection = db.collection<JobPostingDocument>(JOB_POSTINGS_COLLECTION)

    const now = new Date()
    const jobPosting: JobPostingDocument = {
      id: `job-${Date.now()}`,
      title: body.title,
      department: body.department,
      location: body.location,
      type: body.type,
      experience: body.experience,
      description: body.description,
      requirements: body.requirements,
      responsibilities: body.responsibilities,
      niceToHave: body.niceToHave || [],
      benefits: body.benefits || [],
      status: body.active ? "active" : "draft",
      featured: body.featured || false,
      remote: body.remote || false,
      applicationsCount: 0,
      createdAt: now,
      updatedAt: now,
    }

    await collection.insertOne(jobPosting)

    return NextResponse.json({
      success: true,
      data: jobPosting,
    })
  } catch (error) {
    console.error("Error creating job posting:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create job posting" },
      { status: 500 }
    )
  }
}
