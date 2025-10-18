import { ObjectId } from "mongodb"

export interface ClientProject {
  projectId: string
  projectTitle: string
  status: "Pending" | "In Progress" | "Completed" | "On Hold"
  progress: number // 0-100
  bookedDate: string
  startDate?: string
  estimatedCompletion?: string
  timeline: {
    phase: string
    status: "Pending" | "In Progress" | "Completed"
    date?: string
  }[]
  notes?: string
}

export interface ClientDocument {
  _id?: ObjectId
  id: string
  email: string
  password: string // hashed
  name: string
  image?: string // Cloudinary URL
  phone?: string
  company?: string
  refreshToken?: string
  projects: ClientProject[]
  createdAt: string
  updatedAt: string
}

export const ClientSchema = {
  name: "clients",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id", "email", "password", "name", "createdAt"],
      properties: {
        id: { bsonType: "string" },
        email: { bsonType: "string" },
        password: { bsonType: "string" },
        name: { bsonType: "string" },
        image: { bsonType: "string" },
        phone: { bsonType: "string" },
        company: { bsonType: "string" },
        refreshToken: { bsonType: "string" },
        projects: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              projectId: { bsonType: "string" },
              projectTitle: { bsonType: "string" },
              status: { enum: ["Pending", "In Progress", "Completed", "On Hold"] },
              progress: { bsonType: "int" },
              bookedDate: { bsonType: "string" },
              startDate: { bsonType: "string" },
              estimatedCompletion: { bsonType: "string" },
              timeline: { bsonType: "array" },
              notes: { bsonType: "string" },
            },
          },
        },
        createdAt: { bsonType: "string" },
        updatedAt: { bsonType: "string" },
      },
    },
  },
}
