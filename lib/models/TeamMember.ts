import { ObjectId } from 'mongodb'

export const TEAM_COLLECTION = 'team'

export interface Experience {
  title: string
  company: string
  period: string
  description: string
}

export interface Education {
  degree: string
  school: string
  year: string
}

export interface TeamMemberDocument {
  _id?: ObjectId
  id: string
  name: string
  role: string
  department: string
  bio: string
  image: string
  linkedin: string
  twitter: string
  email: string
  fullBio?: string
  expertise?: string[]
  experience?: Experience[]
  education?: Education[]
  awards?: string[]
  projects?: string[]
  createdAt?: Date
  updatedAt?: Date
}
