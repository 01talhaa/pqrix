import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ServiceBookingDocument } from "@/lib/models/ServiceBooking"
import { verifyAccessToken } from "@/lib/jwt"

// Get all bookings (admin) or client's bookings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get("clientId")
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    const { db } = await connectToDatabase()
    const collection = db.collection<ServiceBookingDocument>("serviceBookings")

    let bookings

    if (clientId) {
      // Get bookings for specific client
      bookings = await collection.find({ clientId }).sort({ createdAt: -1 }).toArray()
    } else if (token) {
      // Verify if admin
      const payload = await verifyAccessToken(token)
      if (payload) {
        // Get all bookings for admin
        bookings = await collection.find({}).sort({ createdAt: -1 }).toArray()
      } else {
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 401 }
        )
      }
    } else {
      // Public endpoint for client bookings
      bookings = await collection.find({}).sort({ createdAt: -1 }).toArray()
    }

    return NextResponse.json(
      { success: true, data: bookings },
      { status: 200 }
    )
  } catch (error) {
    console.error("Get bookings error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to get bookings" },
      { status: 500 }
    )
  }
}

// Create new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      clientId,
      clientName,
      clientEmail,
      clientPhone,
      serviceId,
      serviceTitle,
      packageName,
      packagePrice,
      whatsappMessage,
    } = body

    // Validation
    if (!clientId || !clientEmail || !serviceId || !packageName) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const collection = db.collection<ServiceBookingDocument>("serviceBookings")

    // Generate unique ID
    const id = `booking-${Date.now()}-${Math.random().toString(36).substring(7)}`

    const newBooking: ServiceBookingDocument = {
      id,
      clientId,
      clientName: clientName || "Unknown",
      clientEmail,
      clientPhone,
      serviceId,
      serviceTitle: serviceTitle || "Service",
      packageName,
      packagePrice: packagePrice || "N/A",
      status: "Inquired",
      progress: 0,
      timeline: [
        {
          phase: "Inquiry Sent",
          status: "Completed",
          date: new Date().toISOString(),
          description: "Client sent inquiry via WhatsApp",
        },
      ],
      whatsappMessageSent: true,
      whatsappMessage,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await collection.insertOne(newBooking)

    return NextResponse.json(
      { success: true, data: newBooking },
      { status: 201 }
    )
  } catch (error) {
    console.error("Create booking error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create booking" },
      { status: 500 }
    )
  }
}
