import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { verifyAccessToken } from "@/lib/jwt"
import type { TestimonialDocument, CreateTestimonialInput } from "@/lib/models/Testimonial"

// GET - Fetch all testimonials (approved only for public, all for admin)
export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("pqrix")
    
    // Check if admin is requesting (has token or admin=true query param)
    const { searchParams } = new URL(request.url)
    const isAdminRequest = searchParams.get('admin') === 'true'
    
    const token = request.cookies.get("token")?.value
    let isAdmin = isAdminRequest
    
    if (!isAdmin && token) {
      try {
        const verified = await verifyAccessToken(token)
        isAdmin = verified !== null
      } catch {
        isAdmin = false
      }
    }

    // If admin, return all testimonials; otherwise only approved
    const filter = isAdmin ? {} : { approved: true }
    
    console.log("Fetching testimonials with filter:", filter, "isAdmin:", isAdmin)
    
    const testimonials = await db
      .collection("testimonials")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray()

    console.log("Found testimonials from DB:", testimonials.length)

    const formattedTestimonials: TestimonialDocument[] = testimonials.map((doc) => ({
      id: doc._id.toString(),
      clientId: doc.clientId,
      clientName: doc.clientName,
      clientEmail: doc.clientEmail,
      clientImage: doc.clientImage,
      images: doc.images || [],
      rating: doc.rating,
      review: doc.review,
      approved: doc.approved ?? false,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }))

    console.log("Returning formatted testimonials:", formattedTestimonials.length)

    return NextResponse.json({
      success: true,
      data: formattedTestimonials,
    })
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch testimonials" },
      { status: 500 }
    )
  }
}

// POST - Create new testimonial
export async function POST(request: NextRequest) {
  try {
    const body: CreateTestimonialInput = await request.json()

    // Validate required fields
    if (!body.clientName || !body.clientEmail || !body.review || !body.rating) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate rating
    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 1 and 5" },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db("pqrix")

    const newTestimonial = {
      clientId: body.clientId,
      clientName: body.clientName,
      clientEmail: body.clientEmail,
      clientImage: body.clientImage,
      images: body.images || [],
      rating: body.rating,
      review: body.review,
      approved: false, // Requires admin approval
      createdAt: new Date().toISOString(),
    }

    const result = await db.collection("testimonials").insertOne(newTestimonial)

    const testimonial: TestimonialDocument = {
      id: result.insertedId.toString(),
      ...newTestimonial,
    }

    return NextResponse.json({
      success: true,
      data: testimonial,
    })
  } catch (error) {
    console.error("Error creating testimonial:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create testimonial" },
      { status: 500 }
    )
  }
}
