import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { verifyAccessToken } from "@/lib/jwt"
import type { BlogDocument, CreateBlogInput, generateSlug } from "@/lib/models/Blog"
import { generateSlug as createSlug } from "@/lib/models/Blog"

// GET - Fetch all blogs (published only for public, all for admin)
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

    // If admin, return all blogs; otherwise only published
    const filter = isAdmin ? {} : { status: 'published' }
    
    console.log("Fetching blogs with filter:", filter, "isAdmin:", isAdmin)
    
    const blogs = await db
      .collection("blogs")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray()

    console.log("Found blogs from DB:", blogs.length)

    const formattedBlogs: BlogDocument[] = blogs.map((doc) => ({
      id: doc._id.toString(),
      title: doc.title,
      slug: doc.slug,
      excerpt: doc.excerpt,
      content: doc.content,
      coverImage: doc.coverImage,
      images: doc.images || [],
      author: doc.author,
      status: doc.status,
      tags: doc.tags || [],
      views: doc.views || 0,
      publishedAt: doc.publishedAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }))

    console.log("Returning formatted blogs:", formattedBlogs.length)

    return NextResponse.json({
      success: true,
      data: formattedBlogs,
    })
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch blogs" },
      { status: 500 }
    )
  }
}

// POST - Create new blog
export async function POST(request: NextRequest) {
  try {
    // Check if admin is requesting
    const { searchParams } = new URL(request.url)
    const isAdminRequest = searchParams.get('admin') === 'true'
    
    const token = request.cookies.get("token")?.value
    let isAdmin = isAdminRequest
    
    if (!isAdmin && token) {
      const verified = await verifyAccessToken(token)
      isAdmin = verified !== null
    }

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized to create blogs" },
        { status: 401 }
      )
    }

    const body: CreateBlogInput = await request.json()

    // Validate required fields
    if (!body.title || !body.excerpt || !body.content) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: title, excerpt, content" },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db("pqrix")

    // Generate slug from title if not provided
    const slug = body.slug || createSlug(body.title)

    // Check if slug already exists
    const existingBlog = await db.collection("blogs").findOne({ slug })
    if (existingBlog) {
      // Append timestamp to make it unique
      const uniqueSlug = `${slug}-${Date.now()}`
      console.log(`Slug ${slug} exists, using ${uniqueSlug}`)
      body.slug = uniqueSlug
    } else {
      body.slug = slug
    }

    const now = new Date().toISOString()
    
    const newBlog = {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      coverImage: body.coverImage,
      images: body.images || [],
      author: body.author,
      status: body.status || 'draft',
      tags: body.tags || [],
      views: 0,
      publishedAt: body.status === 'published' ? now : undefined,
      createdAt: now,
    }

    console.log("Creating new blog:", newBlog.title, "Status:", newBlog.status)

    const result = await db.collection("blogs").insertOne(newBlog)

    const blog: BlogDocument = {
      id: result.insertedId.toString(),
      ...newBlog,
    }

    return NextResponse.json({
      success: true,
      data: blog,
    })
  } catch (error) {
    console.error("Error creating blog:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create blog" },
      { status: 500 }
    )
  }
}
