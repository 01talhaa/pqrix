import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { BannerDocument, BANNERS_COLLECTION, UpdateBannerInput } from "@/lib/models/Banner"

// GET single banner
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { db } = await connectToDatabase()
    const collection = db.collection<BannerDocument>(BANNERS_COLLECTION)

    const banner = await collection.findOne({ id })

    if (!banner) {
      return NextResponse.json(
        { success: false, error: "Banner not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: true, data: banner },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error fetching banner:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch banner" },
      { status: 500 }
    )
  }
}

// PUT - Update banner
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { searchParams } = new URL(request.url)
    const isAdmin = searchParams.get("admin") === "true"

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body: UpdateBannerInput = await request.json()

    const { db } = await connectToDatabase()
    const collection = db.collection<BannerDocument>(BANNERS_COLLECTION)

    const updateData: any = {
      ...body,
      updatedAt: new Date().toISOString(),
    }

    // Set publishedAt if status changes to published
    if (body.status === "published") {
      const existingBanner = await collection.findOne({ id })
      if (existingBanner && existingBanner.status !== "published") {
        updateData.publishedAt = new Date().toISOString()
      }
    }

    const result = await collection.updateOne(
      { id },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Banner not found" },
        { status: 404 }
      )
    }

    const updatedBanner = await collection.findOne({ id })

    return NextResponse.json(
      { success: true, data: updatedBanner },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error updating banner:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update banner" },
      { status: 500 }
    )
  }
}

// DELETE banner
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { searchParams } = new URL(request.url)
    const isAdmin = searchParams.get("admin") === "true"

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { db } = await connectToDatabase()
    const collection = db.collection<BannerDocument>(BANNERS_COLLECTION)

    const result = await collection.deleteOne({ id })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Banner not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: true, message: "Banner deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error deleting banner:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete banner" },
      { status: 500 }
    )
  }
}
