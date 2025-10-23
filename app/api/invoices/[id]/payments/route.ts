import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { InvoiceDocument, INVOICES_COLLECTION, PaymentRecord } from "@/lib/models/Invoice"
import { ServiceBookingDocument } from "@/lib/models/ServiceBooking"
import { verifyAccessToken } from "@/lib/jwt"

// Record a payment for an invoice
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: invoiceId } = await params
    const body = await request.json()
    const {
      amount,
      method,
      transactionId,
      milestoneId,
      notes,
      verifiedBy,
    } = body

    // Validation
    if (!amount || !method) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: amount, method" },
        { status: 400 }
      )
    }

    // Verify admin token (only admins should record payments)
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")
    
    if (token) {
      const payload = await verifyAccessToken(token)
      if (!payload) {
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 401 }
        )
      }
    }

    const { db } = await connectToDatabase()
    const collection = db.collection<InvoiceDocument>(INVOICES_COLLECTION)

    // Get invoice
    const invoice = await collection.findOne({ id: invoiceId })

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: "Invoice not found" },
        { status: 404 }
      )
    }

    // Create payment record
    const paymentId = `payment-${Date.now()}-${Math.random().toString(36).substring(7)}`
    const payment: PaymentRecord = {
      id: paymentId,
      amount: parseFloat(amount),
      method,
      transactionId,
      milestoneId,
      paymentDate: new Date().toISOString(),
      notes,
      verifiedBy,
      verificationDate: verifiedBy ? new Date().toISOString() : undefined,
    }

    // Update invoice
    const newPaidAmount = invoice.paidAmount + parseFloat(amount)
    const newRemainingAmount = invoice.totalAmount - newPaidAmount

    // Determine new status
    let newStatus: InvoiceDocument["status"]
    if (newPaidAmount >= invoice.totalAmount) {
      newStatus = "Paid"
    } else if (newPaidAmount > 0) {
      newStatus = "Partial"
    } else {
      newStatus = invoice.status
    }

    // Update milestone if specified
    const updatedMilestones = invoice.milestones.map((milestone) => {
      if (milestoneId && milestone.id === milestoneId) {
        const milestonePaidAmount = milestone.paidAmount + parseFloat(amount)
        return {
          ...milestone,
          paidAmount: milestonePaidAmount,
          paymentStatus: milestonePaidAmount >= milestone.amount ? ("Paid" as const) : ("Unpaid" as const),
          paidDate: milestonePaidAmount >= milestone.amount ? new Date().toISOString() : milestone.paidDate,
        }
      }
      return milestone
    })

    // Update invoice in database
    await collection.updateOne(
      { id: invoiceId },
      {
        $set: {
          paidAmount: newPaidAmount,
          remainingAmount: newRemainingAmount,
          status: newStatus,
          paidDate: newStatus === "Paid" ? new Date().toISOString() : invoice.paidDate,
          milestones: updatedMilestones,
          updatedAt: new Date().toISOString(),
          lastModifiedBy: verifiedBy,
        },
        $push: {
          payments: payment,
        },
      }
    )

    // Update booking status if invoice is paid
    if (newStatus === "Paid") {
      const bookingsCollection = db.collection<ServiceBookingDocument>("serviceBookings")
      await bookingsCollection.updateOne(
        { id: invoice.bookingId },
        {
          $set: {
            status: "Paid",
            updatedAt: new Date().toISOString(),
          },
          $push: {
            timeline: {
              phase: "Payment Received",
              status: "Completed",
              date: new Date().toISOString(),
              description: `Full payment of ${invoice.currency} ${invoice.totalAmount} received`,
            },
          },
        }
      )
    } else if (newStatus === "Partial" && milestoneId) {
      // Update booking timeline for milestone payment
      const milestone = updatedMilestones.find((m) => m.id === milestoneId)
      if (milestone && milestone.paymentStatus === "Paid") {
        const bookingsCollection = db.collection<ServiceBookingDocument>("serviceBookings")
        await bookingsCollection.updateOne(
          { id: invoice.bookingId },
          {
            $set: {
              updatedAt: new Date().toISOString(),
            },
            $push: {
              timeline: {
                phase: `${milestone.name} - Payment Received`,
                status: "Completed",
                date: new Date().toISOString(),
                description: `Milestone payment of ${invoice.currency} ${milestone.amount} received`,
              },
            },
          }
        )
      }
    }

    // Get updated invoice
    const updatedInvoice = await collection.findOne({ id: invoiceId })

    return NextResponse.json(
      {
        success: true,
        data: updatedInvoice,
        message: "Payment recorded successfully",
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Record payment error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to record payment" },
      { status: 500 }
    )
  }
}

// Get payment history for an invoice
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: invoiceId } = await params

    const { db } = await connectToDatabase()
    const collection = db.collection<InvoiceDocument>(INVOICES_COLLECTION)

    const invoice = await collection.findOne({ id: invoiceId })

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: "Invoice not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: true, data: invoice.payments },
      { status: 200 }
    )
  } catch (error) {
    console.error("Get payment history error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to get payment history" },
      { status: 500 }
    )
  }
}
