import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { InvoiceDocument, INVOICES_COLLECTION } from "@/lib/models/Invoice"
import { ServiceBookingDocument } from "@/lib/models/ServiceBooking"
import { ServiceDocument } from "@/lib/models/Service"
import { verifyAccessToken } from "@/lib/jwt"
import {
  PAYMENT_METHODS,
  DEFAULT_INVOICE_TERMS,
  generateInvoiceNumber,
  calculateDueDate,
  parsePriceToNumber,
} from "@/lib/payment-config"

// Get invoices
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get("clientId")
    const bookingId = searchParams.get("bookingId")
    const invoiceId = searchParams.get("id")
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    const { db } = await connectToDatabase()
    const collection = db.collection<InvoiceDocument>(INVOICES_COLLECTION)

    let invoices

    if (invoiceId) {
      // Get specific invoice
      const invoice = await collection.findOne({ id: invoiceId })
      return NextResponse.json(
        { success: true, data: invoice },
        { status: 200 }
      )
    } else if (bookingId) {
      // Get invoice for specific booking
      const invoice = await collection.findOne({ bookingId })
      return NextResponse.json(
        { success: true, data: invoice },
        { status: 200 }
      )
    } else if (clientId) {
      // Get invoices for specific client
      invoices = await collection
        .find({ clientId })
        .sort({ createdAt: -1 })
        .toArray()
    } else if (token) {
      // Verify if admin
      const payload = await verifyAccessToken(token)
      if (payload) {
        // Get all invoices for admin
        invoices = await collection.find({}).sort({ createdAt: -1 }).toArray()
      } else {
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 401 }
        )
      }
    } else {
      return NextResponse.json(
        { success: false, error: "Missing required parameters" },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, data: invoices }, { status: 200 })
  } catch (error) {
    console.error("Get invoices error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to get invoices" },
      { status: 500 }
    )
  }
}

// Create invoice
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookingId, serviceId } = body

    if (!bookingId || !serviceId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: bookingId, serviceId" },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()

    // Get booking details
    const bookingsCollection = db.collection<ServiceBookingDocument>("serviceBookings")
    const booking = await bookingsCollection.findOne({ id: bookingId })

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      )
    }

    // Get service details to fetch process steps
    const servicesCollection = db.collection<ServiceDocument>("services")
    const service = await servicesCollection.findOne({ id: serviceId })

    if (!service) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      )
    }

    // Parse total amount from package price
    const totalAmount = parsePriceToNumber(booking.packagePrice)

    // Create milestones based on service process steps
    const milestones = service.process
      ? service.process.map((step, index) => {
          const percentage = 100 / service.process!.length
          const amount = (totalAmount * percentage) / 100

          return {
            id: `milestone-${index + 1}`,
            name: step.step,
            description: step.description,
            amount: parseFloat(amount.toFixed(2)),
            percentage: parseFloat(percentage.toFixed(2)),
            status: "Pending" as const,
            paymentStatus: "Unpaid" as const,
            paidAmount: 0,
          }
        })
      : [
          {
            id: "milestone-1",
            name: "Full Payment",
            description: "Complete payment for the service",
            amount: totalAmount,
            percentage: 100,
            status: "Pending" as const,
            paymentStatus: "Unpaid" as const,
            paidAmount: 0,
          },
        ]

    // Generate invoice
    const invoiceId = `invoice-${Date.now()}-${Math.random().toString(36).substring(7)}`
    const invoiceNumber = generateInvoiceNumber()

    const newInvoice: InvoiceDocument = {
      id: invoiceId,
      invoiceNumber,
      bookingId: booking.id,
      clientId: booking.clientId,
      clientName: booking.clientName,
      clientEmail: booking.clientEmail,
      clientPhone: booking.clientPhone,
      serviceId: booking.serviceId,
      serviceName: booking.serviceTitle,
      packageName: booking.packageName,
      packagePrice: booking.packagePrice,
      totalAmount,
      paidAmount: 0,
      remainingAmount: totalAmount,
      currency: "USD", // You can make this dynamic based on package price format
      status: "Unpaid",
      paymentType: milestones.length > 1 ? "Milestone" : "Full",
      milestones,
      payments: [],
      paymentMethods: PAYMENT_METHODS,
      issueDate: new Date().toISOString(),
      dueDate: calculateDueDate(),
      termsAndConditions: DEFAULT_INVOICE_TERMS,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const invoicesCollection = db.collection<InvoiceDocument>(INVOICES_COLLECTION)
    await invoicesCollection.insertOne(newInvoice)

    // Update booking with invoice ID
    await bookingsCollection.updateOne(
      { id: bookingId },
      {
        $set: {
          invoiceId: invoiceId,
          updatedAt: new Date().toISOString(),
        },
      }
    )

    return NextResponse.json(
      { success: true, data: newInvoice },
      { status: 201 }
    )
  } catch (error) {
    console.error("Create invoice error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create invoice" },
      { status: 500 }
    )
  }
}
