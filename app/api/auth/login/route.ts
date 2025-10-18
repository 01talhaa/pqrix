import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ClientDocument } from "@/lib/models/Client"
import bcrypt from "bcryptjs"
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const collection = db.collection<ClientDocument>("clients")

    // Find client by email
    const client = await collection.findOne({ email })
    if (!client) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, client.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      )
    }

    // Generate tokens
    const tokenPayload = { id: client.id, email: client.email, name: client.name }
    const accessToken = await generateAccessToken(tokenPayload)
    const refreshToken = await generateRefreshToken(tokenPayload)

    // Update refresh token in database
    await collection.updateOne(
      { email },
      { 
        $set: { 
          refreshToken,
          updatedAt: new Date().toISOString()
        } 
      }
    )

    // Remove sensitive data
    const { password: _, refreshToken: __, ...clientData } = client

    const response = NextResponse.json(
      {
        success: true,
        data: {
          client: clientData,
          accessToken,
        },
      },
      { status: 200 }
    )

    // Set refresh token as httpOnly cookie
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 500 }
    )
  }
}
