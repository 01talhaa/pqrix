import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ClientDocument } from "@/lib/models/Client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clientId, image } = body

    if (!clientId || !image) {
      return NextResponse.json(
        { success: false, error: "Client ID and image URL are required" },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const collection = db.collection<ClientDocument>("clients")

    const result = await collection.updateOne(
      { id: clientId },
      { 
        $set: { 
          image,
          updatedAt: new Date().toISOString()
        } 
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Client not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: true, message: "Image updated successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Update image error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update image" },
      { status: 500 }
    )
  }
}
