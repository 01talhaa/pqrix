import { ObjectId } from "mongodb"

export interface BookingTimeline {
  phase: string
  status: "Pending" | "In Progress" | "Completed"
  date?: string
  description?: string
}

export interface ServiceBookingDocument {
  _id?: ObjectId
  id: string
  clientId: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  serviceId: string
  serviceTitle: string
  packageName: string
  packagePrice: string
  status: "Inquired" | "Pending" | "Paid" | "Started" | "In Progress" | "Completed" | "Cancelled"
  progress: number // 0-100
  timeline: BookingTimeline[]
  whatsappMessageSent: boolean
  whatsappMessage?: string
  invoiceId?: string // Link to invoice
  startDate?: string
  estimatedCompletion?: string
  notes?: string
  adminNotes?: string
  createdAt: string
  updatedAt: string
}

export const ServiceBookingSchema = {
  name: "serviceBookings",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id", "clientId", "clientEmail", "serviceId", "packageName", "status", "createdAt"],
      properties: {
        id: { bsonType: "string" },
        clientId: { bsonType: "string" },
        clientName: { bsonType: "string" },
        clientEmail: { bsonType: "string" },
        clientPhone: { bsonType: "string" },
        serviceId: { bsonType: "string" },
        serviceTitle: { bsonType: "string" },
        packageName: { bsonType: "string" },
        packagePrice: { bsonType: "string" },
        status: {
          enum: ["Inquired", "Pending", "Paid", "Started", "In Progress", "Completed", "Cancelled"],
        },
        progress: { bsonType: "int" },
        timeline: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              phase: { bsonType: "string" },
              status: { enum: ["Pending", "In Progress", "Completed"] },
              date: { bsonType: "string" },
              description: { bsonType: "string" },
            },
          },
        },
        whatsappMessageSent: { bsonType: "bool" },
        whatsappMessage: { bsonType: "string" },
        invoiceId: { bsonType: "string" },
        startDate: { bsonType: "string" },
        estimatedCompletion: { bsonType: "string" },
        notes: { bsonType: "string" },
        adminNotes: { bsonType: "string" },
        createdAt: { bsonType: "string" },
        updatedAt: { bsonType: "string" },
      },
    },
  },
}
