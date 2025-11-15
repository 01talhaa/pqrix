import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { InsightDocument, INSIGHTS_COLLECTION } from "@/lib/models/Insight"

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/--+/g, '-')     // Replace multiple hyphens
    .trim()
}

// GET /api/insights - Fetch Insights with filters, search, and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Filters
    const status = searchParams.get("status")
    const category = searchParams.get("category")
    const tag = searchParams.get("tag")
    const featured = searchParams.get("featured")
    const search = searchParams.get("search")
    
    // Pagination
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const { db } = await connectToDatabase()
    const collection = db.collection<InsightDocument>(INSIGHTS_COLLECTION)

    // Build query
    let query: any = {}

    // Filter by status
    if (status) {
      query.isPublished = status === "published"
    }

    // Filter by category
    if (category && category !== "all") {
      query.category = category
    }

    // Filter by tag
    if (tag) {
      query.tags = tag
    }

    // Filter by featured
    if (featured === "true") {
      query.featured = true
    }

    // Full-text search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ]
    }

    // Execute query with pagination
    const [insights, total] = await Promise.all([
      collection
        .find(query)
        .sort({ publishDate: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(query)
    ])

    return NextResponse.json({
      success: true,
      data: insights,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching insights:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch insights" },
      { status: 500 }
    )
  }
}

// POST /api/insights - Create new insight
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validation
    const requiredFields = ['title', 'excerpt', 'content', 'category', 'featuredImage', 'author']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validate author has required fields
    if (!body.author.name || !body.author.role) {
      return NextResponse.json(
        { success: false, error: "Author must have name and role" },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const collection = db.collection<InsightDocument>(INSIGHTS_COLLECTION)

    // Generate slug from title
    const slug = generateSlug(body.title)

    // Check if slug already exists
    const existingSlug = await collection.findOne({ slug })
    if (existingSlug) {
      // Add timestamp to make it unique
      const uniqueSlug = `${slug}-${Date.now()}`
      body.slug = uniqueSlug
    } else {
      body.slug = slug
    }

    // Calculate read time (average 200 words per minute)
    const wordCount = body.content.split(/\s+/).length
    const readTime = Math.ceil(wordCount / 200)

    const now = new Date()
    
    const insight: InsightDocument = {
      id: `insight-${Date.now()}`,
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      
      // Classification
      category: body.category,
      tags: body.tags || [],
      
      // Media (Cloudinary URLs)
      featuredImage: body.featuredImage,
      gallery: body.gallery || [],
      
      // Author
      author: {
        name: body.author.name,
        role: body.author.role,
        avatar: body.author.avatar || undefined,
        bio: body.author.bio || undefined
      },
      
      // SEO
      seoTitle: body.seoTitle || body.title,
      seoDescription: body.seoDescription || body.excerpt,
      
      // Engagement
      views: 0,
      readTime,
      
      // Publishing
      publishDate: body.isPublished ? now : new Date(0), // Epoch for drafts
      featured: body.featured || false,
      isPublished: body.isPublished || false,
      
      // Metadata
      createdAt: now,
      updatedAt: now,
      createdBy: body.createdBy || undefined
    }

    await collection.insertOne(insight as any)

    return NextResponse.json({
      success: true,
      data: insight,
      message: "Insight created successfully"
    })
  } catch (error) {
    console.error("Error creating insight:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create insight" },
      { status: 500 }
    )
  }
}
