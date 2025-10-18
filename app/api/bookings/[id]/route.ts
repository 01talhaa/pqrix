import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ServiceBookingDocument } from "@/lib/models/ServiceBooking"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { db } = await connectToDatabase()
    const collection = db.collection<ServiceBookingDocument>("serviceBookings")

    const booking = await collection.findOne({ id })

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: true, data: booking },
      { status: 200 }
    )
  } catch (error) {
    console.error("Get booking error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to get booking" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, progress, timeline, startDate, estimatedCompletion, notes, adminNotes } = body

    const { db } = await connectToDatabase()
    const collection = db.collection<ServiceBookingDocument>("serviceBookings")

    const updateData: any = {
      updatedAt: new Date().toISOString(),
    }

    if (status !== undefined) updateData.status = status
    if (progress !== undefined) updateData.progress = progress
    if (timeline !== undefined) updateData.timeline = timeline
    if (startDate !== undefined) updateData.startDate = startDate
    if (estimatedCompletion !== undefined) updateData.estimatedCompletion = estimatedCompletion
    if (notes !== undefined) updateData.notes = notes
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes

    const result = await collection.updateOne(
      { id },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      )
    }

    const updatedBooking = await collection.findOne({ id })

    return NextResponse.json(
      { success: true, data: updatedBooking },
      { status: 200 }
    )
  } catch (error) {
    console.error("Update booking error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update booking" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { db } = await connectToDatabase()
    const collection = db.collection<ServiceBookingDocument>("serviceBookings")

    const result = await collection.deleteOne({ id })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: true, message: "Booking deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Delete booking error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete booking" },
      { status: 500 }
    )
  }
}
