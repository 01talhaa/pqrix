import { ObjectId } from "mongodb"

export interface PaymentMethod {
  type: "bKash" | "Nagad" | "Bank"
  accountName: string
  accountNumber: string
  accountType?: string // For bank: "Savings" | "Current"
  bankName?: string
  branchName?: string
  routingNumber?: string
}

export interface InvoiceMilestone {
  id: string
  name: string
  description: string
  amount: number
  percentage: number // Percentage of total amount
  status: "Pending" | "In Progress" | "Completed"
  dueDate?: string
  completedDate?: string
  paymentStatus: "Unpaid" | "Paid"
  paidAmount: number
  paidDate?: string
}

export interface PaymentRecord {
  id: string
  amount: number
  method: "bKash" | "Nagad" | "Bank" | "Other"
  transactionId?: string
  milestoneId?: string // If payment is for specific milestone
  paymentDate: string
  notes?: string
  verifiedBy?: string
  verificationDate?: string
}

export interface InvoiceDocument {
  _id?: ObjectId
  id: string
  invoiceNumber: string // Format: INV-YYYY-MM-XXXXX
  bookingId: string
  
  // Client Information
  clientId: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  clientCompany?: string
  
  // Service Information
  serviceId: string
  serviceName: string
  packageName: string
  packagePrice: string
  
  // Pricing
  totalAmount: number
  paidAmount: number
  remainingAmount: number
  currency: string // "USD" | "BDT"
  
  // Payment Status
  status: "Unpaid" | "Partial" | "Paid" | "Overdue" | "Cancelled"
  paymentType: "Full" | "Milestone" // Full payment or milestone-based
  
  // Milestones (for milestone-based payments)
  milestones: InvoiceMilestone[]
  
  // Payment History
  payments: PaymentRecord[]
  
  // Payment Methods Available
  paymentMethods: PaymentMethod[]
  
  // Dates
  issueDate: string
  dueDate?: string
  paidDate?: string
  
  // Additional Info
  notes?: string
  termsAndConditions?: string
  
  // Metadata
  createdAt: string
  updatedAt: string
  createdBy?: string
  lastModifiedBy?: string
}

export const InvoiceSchema = {
  name: "invoices",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "id",
        "invoiceNumber",
        "bookingId",
        "clientId",
        "clientEmail",
        "serviceId",
        "serviceName",
        "totalAmount",
        "status",
        "createdAt"
      ],
      properties: {
        id: { bsonType: "string" },
        invoiceNumber: { bsonType: "string" },
        bookingId: { bsonType: "string" },
        clientId: { bsonType: "string" },
        clientName: { bsonType: "string" },
        clientEmail: { bsonType: "string" },
        clientPhone: { bsonType: "string" },
        clientCompany: { bsonType: "string" },
        serviceId: { bsonType: "string" },
        serviceName: { bsonType: "string" },
        packageName: { bsonType: "string" },
        packagePrice: { bsonType: "string" },
        totalAmount: { bsonType: "number" },
        paidAmount: { bsonType: "number" },
        remainingAmount: { bsonType: "number" },
        currency: { bsonType: "string" },
        status: {
          enum: ["Unpaid", "Partial", "Paid", "Overdue", "Cancelled"]
        },
        paymentType: {
          enum: ["Full", "Milestone"]
        },
        milestones: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              id: { bsonType: "string" },
              name: { bsonType: "string" },
              description: { bsonType: "string" },
              amount: { bsonType: "number" },
              percentage: { bsonType: "number" },
              status: { enum: ["Pending", "In Progress", "Completed"] },
              dueDate: { bsonType: "string" },
              completedDate: { bsonType: "string" },
              paymentStatus: { enum: ["Unpaid", "Paid"] },
              paidAmount: { bsonType: "number" },
              paidDate: { bsonType: "string" }
            }
          }
        },
        payments: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              id: { bsonType: "string" },
              amount: { bsonType: "number" },
              method: { enum: ["bKash", "Nagad", "Bank", "Other"] },
              transactionId: { bsonType: "string" },
              milestoneId: { bsonType: "string" },
              paymentDate: { bsonType: "string" },
              notes: { bsonType: "string" },
              verifiedBy: { bsonType: "string" },
              verificationDate: { bsonType: "string" }
            }
          }
        },
        paymentMethods: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              type: { enum: ["bKash", "Nagad", "Bank"] },
              accountName: { bsonType: "string" },
              accountNumber: { bsonType: "string" },
              accountType: { bsonType: "string" },
              bankName: { bsonType: "string" },
              branchName: { bsonType: "string" },
              routingNumber: { bsonType: "string" }
            }
          }
        },
        issueDate: { bsonType: "string" },
        dueDate: { bsonType: "string" },
        paidDate: { bsonType: "string" },
        notes: { bsonType: "string" },
        termsAndConditions: { bsonType: "string" },
        createdAt: { bsonType: "string" },
        updatedAt: { bsonType: "string" },
        createdBy: { bsonType: "string" },
        lastModifiedBy: { bsonType: "string" }
      }
    }
  }
}

export const INVOICES_COLLECTION = "invoices"
