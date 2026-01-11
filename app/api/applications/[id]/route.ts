/**
 * Job Applications API - Individual Application Management
 * 
 * Features:
 * - GET: Retrieve single application details
 * - PUT: Update application status (with automatic team member creation on accept)
 * - DELETE: Remove application
 * 
 * Special Behavior:
 * When an application status is changed to "accepted", the system automatically:
 * 1. Creates a new team member record in the team collection
 * 2. Populates team member data from application details
 * 3. Makes the new hire visible on the public team page
 * 4. Adds a note to the application tracking this action
 */

import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { JobApplicationDocument, JOB_APPLICATIONS_COLLECTION } from "@/lib/models/JobApplication"
import { TEAM_COLLECTION, TeamMemberDocument } from "@/lib/models/TeamMember"
import { JOB_POSTINGS_COLLECTION, JobPostingDocument } from "@/lib/models/JobPosting"
import { nanoid } from "nanoid"

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

    // If status is being changed to "accepted", create a team member
    if (updates.status === "accepted" && existing.status !== "accepted") {
      try {
        // Get the job posting details for the role
        const jobsCollection = db.collection<JobPostingDocument>(JOB_POSTINGS_COLLECTION)
        const jobPosting = await jobsCollection.findOne({ id: existing.jobId })

        // Create team member from application data
        const teamCollection = db.collection<TeamMemberDocument>(TEAM_COLLECTION)
        
        const teamMember: TeamMemberDocument = {
          id: nanoid(),
          name: existing.applicantName,
          role: jobPosting?.title || "Team Member",
          department: jobPosting?.department || "General",
          bio: existing.coverLetter.substring(0, 200) + "...", // Use first 200 chars of cover letter as short bio
          image: `https://ui-avatars.com/api/?name=${encodeURIComponent(existing.applicantName)}&size=400&background=22c55e&color=fff`, // Auto-generated avatar
          linkedin: existing.linkedinUrl || "",
          twitter: "",
          email: existing.applicantEmail,
          fullBio: existing.coverLetter,
          expertise: jobPosting?.requirements || [],
          experience: existing.currentCompany ? [{
            title: jobPosting?.title || "Professional",
            company: existing.currentCompany,
            period: `${existing.yearsOfExperience} years`,
            description: ""
          }] : [],
          education: [],
          awards: [],
          projects: existing.portfolioUrl ? [existing.portfolioUrl] : [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        await teamCollection.insertOne(teamMember)

        // Add a note to the application about team member creation
        updates.notes = (updates.notes || "") + `\n\nAutomatically added to team section as ${teamMember.role} on ${new Date().toLocaleString()}.`
      } catch (teamError) {
        console.error("Error creating team member:", teamError)
        // Don't fail the application update if team creation fails
        updates.notes = (updates.notes || "") + `\n\nNote: Failed to automatically add to team section. Please add manually.`
      }
    }

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
      teamMemberCreated: updates.status === "accepted",
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
