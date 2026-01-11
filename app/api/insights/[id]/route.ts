import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { InsightDocument, INSIGHTS_COLLECTION } from "@/lib/models/Insight"

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

// GET /api/insights/[id] - Fetch single insight (by ID or slug)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { db } = await connectToDatabase()
    const collection = db.collection<InsightDocument>(INSIGHTS_COLLECTION)

    // Try to find by ID first, then by slug
    let insight = await collection.findOne({ id: id })
    
    if (!insight) {
      insight = await collection.findOne({ slug: id })
    }

    if (!insight) {
      return NextResponse.json(
        { success: false, error: "Insight not found" },
        { status: 404 }
      )
    }

    // Increment view count
    await collection.updateOne(
      { _id: insight._id },
      { $inc: { views: 1 } }
    )

    return NextResponse.json({
      success: true,
      data: insight
    })
  } catch (error) {
    console.error("Error fetching insight:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch insight" },
      { status: 500 }
    )
  }
}

// PUT /api/insights/[id] - Update insight
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const { db } = await connectToDatabase()
    const collection = db.collection<InsightDocument>(INSIGHTS_COLLECTION)

    // Find existing insight
    let existing = await collection.findOne({ id: id })
    
    if (!existing) {
      existing = await collection.findOne({ slug: id })
    }

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Insight not found" },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: any = {}

    // Update all fields provided in body
    if (body.title !== undefined) {
      updateData.title = body.title
      // Regenerate slug if title changed
      if (body.title !== existing.title) {
        const newSlug = generateSlug(body.title)
        const slugExists = await collection.findOne({ 
          slug: newSlug, 
          _id: { $ne: existing._id } 
        })
        updateData.slug = slugExists ? `${newSlug}-${Date.now()}` : newSlug
      }
    }

    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt
    if (body.content !== undefined) {
      updateData.content = body.content
      // Recalculate read time
      const wordCount = body.content.split(/\s+/).length
      updateData.readTime = Math.ceil(wordCount / 200)
    }
    if (body.category !== undefined) updateData.category = body.category
    if (body.tags !== undefined) updateData.tags = body.tags
    if (body.featuredImage !== undefined) updateData.featuredImage = body.featuredImage
    if (body.gallery !== undefined) updateData.gallery = body.gallery
    if (body.author !== undefined) updateData.author = body.author
    if (body.seoTitle !== undefined) updateData.seoTitle = body.seoTitle
    if (body.seoDescription !== undefined) updateData.seoDescription = body.seoDescription
    if (body.featured !== undefined) updateData.featured = body.featured
    if (body.isPublished !== undefined) {
      updateData.isPublished = body.isPublished
      // Update publishDate when publishing
      if (body.isPublished && !existing.isPublished) {
        updateData.publishDate = new Date()
      }
    }

    updateData.updatedAt = new Date()

    const result = await collection.updateOne(
      { _id: existing._id },
      { $set: updateData }
    )

    if (result.modifiedCount === 0 && result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Failed to update insight" },
        { status: 500 }
      )
    }

    const updated = await collection.findOne({ _id: existing._id })

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Insight updated successfully"
    })
  } catch (error) {
    console.error("Error updating insight:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update insight" },
      { status: 500 }
    )
  }
}

// DELETE /api/insights/[id] - Delete insight
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { db } = await connectToDatabase()
    const collection = db.collection<InsightDocument>(INSIGHTS_COLLECTION)

    // Try to find by ID first, then by slug
    let insight = await collection.findOne({ id: id })
    
    if (!insight) {
      insight = await collection.findOne({ slug: id })
    }

    if (!insight) {
      return NextResponse.json(
        { success: false, error: "Insight not found" },
        { status: 404 }
      )
    }

    const result = await collection.deleteOne({ _id: insight._id })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Failed to delete insight" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Insight deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting insight:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete insight" },
      { status: 500 }
    )
  }
}
