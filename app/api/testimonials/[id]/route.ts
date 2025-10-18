import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import { verifyAccessToken } from "@/lib/jwt"
import type { TestimonialDocument, UpdateTestimonialInput } from "@/lib/models/Testimonial"

// GET - Fetch single testimonial
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const client = await clientPromise
    const db = client.db("pqrix")

    const testimonial = await db.collection("testimonials").findOne({
      _id: new ObjectId(id),
    })

    if (!testimonial) {
      return NextResponse.json(
        { success: false, error: "Testimonial not found" },
        { status: 404 }
      )
    }

    const formattedTestimonial: TestimonialDocument = {
      id: testimonial._id.toString(),
      clientId: testimonial.clientId,
      clientName: testimonial.clientName,
      clientEmail: testimonial.clientEmail,
      clientImage: testimonial.clientImage,
      images: testimonial.images || [],
      rating: testimonial.rating,
      review: testimonial.review,
      approved: testimonial.approved ?? false,
      createdAt: testimonial.createdAt,
      updatedAt: testimonial.updatedAt,
    }

    return NextResponse.json({
      success: true,
      data: formattedTestimonial,
    })
  } catch (error) {
    console.error("Error fetching testimonial:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch testimonial" },
      { status: 500 }
    )
  }
}

// PUT - Update testimonial (admin can approve, client can edit their own)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body: UpdateTestimonialInput = await request.json()

    // Check if admin is requesting (query param or token)
    const { searchParams } = new URL(request.url)
    const isAdminRequest = searchParams.get('admin') === 'true'
    
    // Verify admin token for approval
    const token = request.cookies.get("token")?.value
    let isAdmin = isAdminRequest
    
    if (!isAdmin && token) {
      const verified = await verifyAccessToken(token)
      isAdmin = verified !== null
    }

    console.log("PUT testimonial - isAdmin:", isAdmin, "body:", body)

    const client = await clientPromise
    const db = client.db("pqrix")

    const updateData: any = {
      updatedAt: new Date().toISOString(),
    }

    // Only admin can approve
    if (body.approved !== undefined && isAdmin) {
      updateData.approved = body.approved
      console.log("Setting approved to:", body.approved)
    } else if (body.approved !== undefined && !isAdmin) {
      console.log("Not admin, cannot approve")
      return NextResponse.json(
        { success: false, error: "Unauthorized to approve testimonials" },
        { status: 403 }
      )
    }

    if (body.clientName) updateData.clientName = body.clientName
    if (body.clientImage !== undefined) updateData.clientImage = body.clientImage
    if (body.images !== undefined) updateData.images = body.images
    if (body.rating) updateData.rating = body.rating
    if (body.review) updateData.review = body.review

    console.log("Updating testimonial with data:", updateData)

    const result = await db.collection("testimonials").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    )

    console.log("Update result:", result ? "Success" : "Not found")

    if (!result) {
      return NextResponse.json(
        { success: false, error: "Testimonial not found" },
        { status: 404 }
      )
    }

    const updatedTestimonial: TestimonialDocument = {
      id: result._id.toString(),
      clientId: result.clientId,
      clientName: result.clientName,
      clientEmail: result.clientEmail,
      clientImage: result.clientImage,
      images: result.images || [],
      rating: result.rating,
      review: result.review,
      approved: result.approved ?? false,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    }

    return NextResponse.json({
      success: true,
      data: updatedTestimonial,
    })
  } catch (error) {
    console.error("Error updating testimonial:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update testimonial" },
      { status: 500 }
    )
  }
}

// DELETE - Delete testimonial (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Check if admin is requesting (query param or token)
    const { searchParams } = new URL(request.url)
    const isAdminRequest = searchParams.get('admin') === 'true'
    
    // Verify admin token
    const token = request.cookies.get("token")?.value
    let isAdmin = isAdminRequest
    
    if (!isAdmin && token) {
      const verified = await verifyAccessToken(token)
      isAdmin = verified !== null
    }

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized to delete testimonials" },
        { status: 401 }
      )
    }

    console.log("DELETE testimonial - id:", id)

    const client = await clientPromise
    const db = client.db("pqrix")

    const result = await db.collection("testimonials").deleteOne({
      _id: new ObjectId(id),
    })

    console.log("Delete result - deletedCount:", result.deletedCount)

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Testimonial not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Testimonial deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting testimonial:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete testimonial" },
      { status: 500 }
    )
  }
}
