import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { BannerDocument, BANNERS_COLLECTION, CreateBannerInput } from "@/lib/models/Banner"

// GET all banners
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const admin = searchParams.get("admin") === "true"
    const status = searchParams.get("status")

    const { db } = await connectToDatabase()
    const collection = db.collection<BannerDocument>(BANNERS_COLLECTION)

    let query: any = {}

    // If not admin view, only show published banners
    if (!admin) {
      query.status = "published"
    } else if (status) {
      query.status = status
    }

    const banners = await collection
      .find(query)
      .sort({ order: 1, createdAt: -1 })
      .toArray()

    return NextResponse.json(
      { success: true, data: banners },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error fetching banners:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch banners" },
      { status: 500 }
    )
  }
}

// POST - Create new banner
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const isAdmin = searchParams.get("admin") === "true"

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body: CreateBannerInput = await request.json()

    // Validation
    if (!body.title || !body.subtitle || !body.tone || !body.media || !Array.isArray(body.media) || body.media.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing required fields or invalid media array" },
        { status: 400 }
      )
    }

    // Validate each media item
    for (const mediaItem of body.media) {
      if (!mediaItem.url || !mediaItem.type) {
        return NextResponse.json(
          { success: false, error: "Invalid media item: missing url or type" },
          { status: 400 }
        )
      }
      if (mediaItem.type !== 'image' && mediaItem.type !== 'video') {
        return NextResponse.json(
          { success: false, error: "Invalid media type: must be 'image' or 'video'" },
          { status: 400 }
        )
      }
      // Videos must have a poster
      if (mediaItem.type === 'video' && !mediaItem.posterUrl) {
        return NextResponse.json(
          { success: false, error: "Video media items must have a posterUrl" },
          { status: 400 }
        )
      }
    }

    const { db } = await connectToDatabase()
    const collection = db.collection<BannerDocument>(BANNERS_COLLECTION)

    // Get the highest order number
    const lastBanner = await collection
      .find({})
      .sort({ order: -1 })
      .limit(1)
      .toArray()

    const newOrder = lastBanner.length > 0 ? lastBanner[0].order + 1 : 1

    const newBanner: BannerDocument = {
      id: `banner-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: body.title,
      subtitle: body.subtitle,
      tone: body.tone,
      media: body.media,
      displayStyle: body.displayStyle || "autoplay",
      status: body.status || "draft",
      order: body.order || newOrder,
      gradient: body.gradient || "from-[#0b0b0b] via-[#1f2937] to-[#0b1220]",
      createdAt: new Date().toISOString(),
      publishedAt: body.status === "published" ? new Date().toISOString() : undefined,
    }

    await collection.insertOne(newBanner as any)

    return NextResponse.json(
      { success: true, data: newBanner },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating banner:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create banner" },
      { status: 500 }
    )
  }
}
