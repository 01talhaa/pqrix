import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ClientDocument } from "@/lib/models/Client"
import { verifyAccessToken } from "@/lib/jwt"

export async function GET(request: NextRequest) {
  try {
    // Get access token from header
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No token provided" },
        { status: 401 }
      )
    }

    // Verify token
    const payload = await verifyAccessToken(token)
    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      )
    }

    // Get client from database
    const { db } = await connectToDatabase()
    const collection = db.collection<ClientDocument>("clients")

    const client = await collection.findOne({ id: payload.id })
    if (!client) {
      return NextResponse.json(
        { success: false, error: "Client not found" },
        { status: 404 }
      )
    }

    // Remove sensitive data
    const { password: _, refreshToken: __, ...clientData } = client

    return NextResponse.json(
      {
        success: true,
        data: clientData,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Get client error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to get client data" },
      { status: 500 }
    )
  }
}
