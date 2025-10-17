import { ObjectId } from 'mongodb'

export interface ServicePackage {
  name: string
  price: string
  duration: string
  revisions: string
  features: string[]
  popular?: boolean
}

export interface ProcessStep {
  step: string
  description: string
}

export interface ServiceStat {
  icon: string  // Store as string, will map to Lucide icon on frontend
  label: string
  value: string
}

export interface ServiceDocument {
  _id?: ObjectId
  id: string  // URL-friendly ID (e.g., "discovery-strategy-bd")
  icon: string  // Store as string (e.g., "Zap", "Code")
  title: string
  tagline: string
  description: string
  longDescription?: string
  features: string[]
  process?: ProcessStep[]
  packages?: ServicePackage[]
  stats?: ServiceStat[]
  pricing?: string
  color: string  // Tailwind gradient classes
  image: string
  createdAt?: Date
  updatedAt?: Date
}

export const SERVICES_COLLECTION = 'services'
