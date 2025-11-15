/**
 * Job Posting Data Model
 * Represents career opportunities
 */

export const JOB_POSTINGS_COLLECTION = "job_postings"

export interface SalaryRange {
  min: number
  max: number
  currency: string
}

export interface JobPostingDocument {
  id: string
  title: string
  department: string
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'internship'
  experience: string
  description: string
  requirements: string[]
  responsibilities: string[]
  niceToHave: string[]
  benefits: string[]
  salaryRange?: SalaryRange
  applicationDeadline?: Date
  status: 'active' | 'closed' | 'draft'
  featured: boolean
  remote: boolean
  applicationsCount: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateJobPostingInput {
  title: string
  department: string
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'internship'
  experience: string
  description: string
  requirements: string[]
  responsibilities: string[]
  niceToHave?: string[]
  benefits?: string[]
  salaryRange?: SalaryRange
  applicationDeadline?: Date
  status?: 'active' | 'closed' | 'draft'
  featured?: boolean
  remote?: boolean
}
