import { NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import { verifyAccessToken } from "@/lib/jwt"
import type { BlogDocument, UpdateBlogInput } from "@/lib/models/Blog"
import { generateSlug } from "@/lib/models/Blog"

// GET - Fetch single blog by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const client = await clientPromise
    const db = client.db("pqrix")

    // Try to find by ObjectId first, then by slug
    let blog
    if (ObjectId.isValid(id)) {
      blog = await db.collection("blogs").findOne({ _id: new ObjectId(id) })
    }
    
    if (!blog) {
      blog = await db.collection("blogs").findOne({ slug: id })
    }

    if (!blog) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      )
    }

    // Increment view count
    await db.collection("blogs").updateOne(
      { _id: blog._id },
      { $inc: { views: 1 } }
    )

    const formattedBlog: BlogDocument = {
      id: blog._id.toString(),
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      coverImage: blog.coverImage,
      images: blog.images || [],
      author: blog.author,
      status: blog.status,
      tags: blog.tags || [],
      views: (blog.views || 0) + 1,
      publishedAt: blog.publishedAt,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    }

    return NextResponse.json({
      success: true,
      data: formattedBlog,
    })
  } catch (error) {
    console.error("Error fetching blog:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog" },
      { status: 500 }
    )
  }
}

// PUT - Update blog (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body: UpdateBlogInput = await request.json()

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
        { success: false, error: "Unauthorized to update blogs" },
        { status: 401 }
      )
    }

    console.log("PUT blog - isAdmin:", isAdmin, "id:", id)

    const client = await clientPromise
    const db = client.db("pqrix")

    const updateData: any = {
      updatedAt: new Date().toISOString(),
    }

    if (body.title) {
      updateData.title = body.title
      // Auto-update slug if title changes and slug not explicitly provided
      if (!body.slug) {
        updateData.slug = generateSlug(body.title)
      }
    }
    
    if (body.slug) updateData.slug = body.slug
    if (body.excerpt) updateData.excerpt = body.excerpt
    if (body.content) updateData.content = body.content
    if (body.coverImage !== undefined) updateData.coverImage = body.coverImage
    if (body.images !== undefined) updateData.images = body.images
    if (body.author) updateData.author = body.author
    if (body.tags !== undefined) updateData.tags = body.tags
    
    // Handle status change
    if (body.status) {
      updateData.status = body.status
      
      // Set publishedAt when publishing for the first time
      if (body.status === 'published') {
        const currentBlog = await db.collection("blogs").findOne({ _id: new ObjectId(id) })
        if (currentBlog && !currentBlog.publishedAt) {
          updateData.publishedAt = new Date().toISOString()
        }
      }
    }

    console.log("Updating blog with data:", updateData)

    const result = await db.collection("blogs").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    )

    console.log("Update result:", result ? "Success" : "Not found")

    if (!result) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      )
    }

    const updatedBlog: BlogDocument = {
      id: result._id.toString(),
      title: result.title,
      slug: result.slug,
      excerpt: result.excerpt,
      content: result.content,
      coverImage: result.coverImage,
      images: result.images || [],
      author: result.author,
      status: result.status,
      tags: result.tags || [],
      views: result.views || 0,
      publishedAt: result.publishedAt,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    }

    return NextResponse.json({
      success: true,
      data: updatedBlog,
    })
  } catch (error) {
    console.error("Error updating blog:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update blog" },
      { status: 500 }
    )
  }
}

// DELETE - Delete blog (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
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
        { success: false, error: "Unauthorized to delete blogs" },
        { status: 401 }
      )
    }

    console.log("DELETE blog - id:", id)

    const client = await clientPromise
    const db = client.db("pqrix")

    const result = await db.collection("blogs").deleteOne({
      _id: new ObjectId(id),
    })

    console.log("Delete result - deletedCount:", result.deletedCount)

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Blog not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting blog:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete blog" },
      { status: 500 }
    )
  }
}
