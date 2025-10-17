import { ObjectId } from 'mongodb'

export interface ProjectDocument {
  _id?: ObjectId
  id: string
  title: string
  client: string
  category: string
  description: string
  longDescription?: string
  image: string
  images?: string[]
  video?: string
  tags: string[]
  year: string
  duration?: string
  budget?: string
  status?: "Completed" | "In Progress" | "On Hold"
  teamMembers?: string[]
  deliverables?: string[]
  results?: string[]
  metrics?: {
    label: string
    value: string
  }[]
  challenges?: string[]
  solutions?: string[]
  technologies?: string[]
  timeline?: {
    phase: string
    duration: string
    description: string
  }[]
  testimonial?: {
    quote: string
    author: string
    role: string
    avatar?: string
  }
  awards?: string[]
  links?: {
    label: string
    url: string
  }[]
  createdAt?: Date
  updatedAt?: Date
}

export const PROJECTS_COLLECTION = 'projects'
