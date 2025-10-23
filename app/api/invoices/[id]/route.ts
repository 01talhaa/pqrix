import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { InvoiceDocument, INVOICES_COLLECTION } from "@/lib/models/Invoice"

// Update invoice (including milestone updates)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    const { db } = await connectToDatabase()
    const collection = db.collection<InvoiceDocument>(INVOICES_COLLECTION)

    // Get existing invoice
    const existingInvoice = await collection.findOne({ id })

    if (!existingInvoice) {
      return NextResponse.json(
        { success: false, error: "Invoice not found" },
        { status: 404 }
      )
    }

    // Calculate updated totals if milestones are provided
    let updateData: Partial<InvoiceDocument> = {
      ...body,
      updatedAt: new Date().toISOString(),
    }

    if (body.milestones) {
      // Calculate new paid amount from milestones
      const paidAmount = body.milestones.reduce(
        (sum: number, milestone: any) => sum + (milestone.paidAmount || 0),
        0
      )
      const remainingAmount = existingInvoice.totalAmount - paidAmount

      // Determine status
      let status: "Unpaid" | "Partial" | "Paid" | "Overdue" | "Cancelled" = "Unpaid"
      if (paidAmount >= existingInvoice.totalAmount) {
        status = "Paid"
      } else if (paidAmount > 0) {
        status = "Partial"
      }

      updateData = {
        ...updateData,
        paidAmount,
        remainingAmount,
        status,
        paidDate: status === "Paid" ? new Date().toISOString() : existingInvoice.paidDate,
      }
    }

    // Update invoice
    const result = await collection.updateOne(
      { id },
      { $set: updateData }
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Failed to update invoice" },
        { status: 500 }
      )
    }

    // Get updated invoice
    const updatedInvoice = await collection.findOne({ id })

    return NextResponse.json(
      { success: true, data: updatedInvoice },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error updating invoice:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Get single invoice by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const { db } = await connectToDatabase()
    const collection = db.collection<InvoiceDocument>(INVOICES_COLLECTION)

    const invoice = await collection.findOne({ id })

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: "Invoice not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: true, data: invoice },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error fetching invoice:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
