import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { CreateAdInput, AdDocument } from "@/lib/models/Ad"

/**
 * GET /api/ads
 * Fetch all ads
 * - Returns only published ads for public
 * - Returns all ads (draft + published) for admin with ?admin=true
 */
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()
    const searchParams = request.nextUrl.searchParams
    const isAdmin = searchParams.get("admin") === "true"

    // Filter based on user type
    const filter = isAdmin ? {} : { status: "published" }

    const ads = await db
      .collection("ads")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray()

    const formattedAds = ads.map((ad) => ({
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
    }))

    return NextResponse.json({
      success: true,
      data: formattedAds,
    })
  } catch (error) {
    console.error("Error fetching ads:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch ads" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/ads?admin=true
 * Create a new ad (Admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const isAdmin = searchParams.get("admin") === "true"

    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body: CreateAdInput = await request.json()

    // Validation
    if (!body.title?.trim()) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      )
    }

    if (!body.images || body.images.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one image is required" },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()

    const newAd = {
      title: body.title.trim(),
      description: body.description?.trim() || "",
      images: body.images,
      link: body.link?.trim() || "",
      status: body.status || "draft",
      displayDuration: body.displayDuration || 5,
      createdAt: new Date().toISOString(),
      publishedAt:
        body.status === "published" ? new Date().toISOString() : null,
    }

    const result = await db.collection("ads").insertOne(newAd)

    const createdAd: AdDocument = {
      id: result.insertedId.toString(),
      title: newAd.title,
      description: newAd.description,
      images: newAd.images,
      link: newAd.link,
      status: newAd.status,
      displayDuration: newAd.displayDuration,
      createdAt: newAd.createdAt,
      publishedAt: newAd.publishedAt || undefined,
    }

    // Dispatch event if published
    if (newAd.status === "published") {
      // Event will be handled client-side
    }

    return NextResponse.json({
      success: true,
      data: createdAd,
    })
  } catch (error) {
    console.error("Error creating ad:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create ad" },
      { status: 500 }
    )
  }
}
