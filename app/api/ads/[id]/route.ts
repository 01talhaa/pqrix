import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { UpdateAdInput, AdDocument } from "@/lib/models/Ad"

/**
 * GET /api/ads/[id]
 * Fetch a single ad by ID
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid ad ID" },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const ad = await db.collection("ads").findOne({ _id: new ObjectId(id) })

    if (!ad) {
      return NextResponse.json(
        { success: false, error: "Ad not found" },
        { status: 404 }
      )
    }

    const formattedAd: AdDocument = {
      id: ad._id.toString(),
      title: ad.title,
      description: ad.description,
      images: ad.images || [],
      link: ad.link,
      status: ad.status,
      displayDuration: ad.displayDuration || 5,
      createdAt: ad.createdAt,
      updatedAt: ad.updatedAt,
      publishedAt: ad.publishedAt,
    }

    return NextResponse.json({
      success: true,
      data: formattedAd,
    })
  } catch (error) {
    console.error("Error fetching ad:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch ad" },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/ads/[id]?admin=true
 * Update an existing ad (Admin only)
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const searchParams = request.nextUrl.searchParams
    const isAdmin = searchParams.get("admin") === "true"

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid ad ID" },
        { status: 400 }
      )
    }

    const body: UpdateAdInput = await request.json()
    const { db } = await connectToDatabase()

    // Check if ad exists
    const existingAd = await db
      .collection("ads")
      .findOne({ _id: new ObjectId(id) })

    if (!existingAd) {
      return NextResponse.json(
        { success: false, error: "Ad not found" },
        { status: 404 }
      )
    }

    // Build update object
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    }

    if (body.title !== undefined) updateData.title = body.title.trim()
    if (body.description !== undefined)
      updateData.description = body.description.trim()
    if (body.images !== undefined) updateData.images = body.images
    if (body.link !== undefined) updateData.link = body.link.trim()
    if (body.displayDuration !== undefined)
      updateData.displayDuration = body.displayDuration

    // Handle status change to published
    if (body.status !== undefined) {
      updateData.status = body.status
      if (body.status === "published" && existingAd.status !== "published") {
        updateData.publishedAt = new Date().toISOString()
      }
    }

    // Validation
    if (updateData.images && updateData.images.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one image is required" },
        { status: 400 }
      )
    }

    await db
      .collection("ads")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    // Fetch updated ad
    const updatedAd = await db
      .collection("ads")
      .findOne({ _id: new ObjectId(id) })

    const formattedAd: AdDocument = {
      id: updatedAd!._id.toString(),
      title: updatedAd!.title,
      description: updatedAd!.description,
      images: updatedAd!.images || [],
      link: updatedAd!.link,
      status: updatedAd!.status,
      displayDuration: updatedAd!.displayDuration || 5,
      createdAt: updatedAd!.createdAt,
      updatedAt: updatedAd!.updatedAt,
      publishedAt: updatedAd!.publishedAt,
    }

    return NextResponse.json({
      success: true,
      data: formattedAd,
    })
  } catch (error) {
    console.error("Error updating ad:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update ad" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/ads/[id]?admin=true
 * Delete an ad (Admin only)
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const searchParams = request.nextUrl.searchParams
    const isAdmin = searchParams.get("admin") === "true"

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid ad ID" },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const result = await db
      .collection("ads")
      .deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Ad not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Ad deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting ad:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete ad" },
      { status: 500 }
    )
  }
}
