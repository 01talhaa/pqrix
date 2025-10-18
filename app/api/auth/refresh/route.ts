import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ClientDocument } from "@/lib/models/Client"
import { generateAccessToken, verifyRefreshToken } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookie
    const refreshToken = request.cookies.get("refreshToken")?.value

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: "No refresh token provided" },
        { status: 401 }
      )
    }

    // Verify refresh token
    const payload = await verifyRefreshToken(refreshToken)
    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Invalid refresh token" },
        { status: 401 }
      )
    }

    // Verify token exists in database
    const { db } = await connectToDatabase()
    const collection = db.collection<ClientDocument>("clients")

    const client = await collection.findOne({ 
      id: payload.id,
      refreshToken 
    })

    if (!client) {
      return NextResponse.json(
        { success: false, error: "Invalid refresh token" },
        { status: 401 }
      )
    }

    // Generate new access token
    const accessToken = await generateAccessToken({
      id: client.id,
      email: client.email,
      name: client.name,
    })

    return NextResponse.json(
      {
        success: true,
        data: { accessToken },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Refresh token error:", error)
    return NextResponse.json(
      { success: false, error: "Token refresh failed" },
      { status: 500 }
    )
  }
}
