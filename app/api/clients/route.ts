import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ClientDocument } from "@/lib/models/Client"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const collection = db.collection<ClientDocument>("clients")

    const clients = await collection
      .find({})
      .project({ password: 0, refreshToken: 0 }) // Exclude sensitive fields
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(
      {
        success: true,
        data: clients,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error fetching clients:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch clients" },
      { status: 500 }
    )
  }
}
