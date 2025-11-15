/**
 * Job Application Data Model
 * Represents user applications to job postings
 */

export const JOB_APPLICATIONS_COLLECTION = "job_applications"

export interface JobApplicationDocument {
  id: string
  jobId: string
  userId: string
  applicantName: string
  applicantEmail: string
  applicantPhone: string
  resumeUrl: string
  coverLetter: string
  portfolioUrl?: string
  linkedinUrl?: string
  githubUrl?: string
  yearsOfExperience: number
  currentCompany?: string
  expectedSalary?: number
  noticePeriod?: string
  status: 'pending' | 'reviewing' | 'shortlisted' | 'interview-scheduled' | 'rejected' | 'accepted'
  notes?: string
  reviewedBy?: string
  reviewedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface CreateJobApplicationInput {
  jobId: string
  userId: string
  applicantName: string
  applicantEmail: string
  applicantPhone: string
  resumeUrl: string
  coverLetter: string
  portfolioUrl?: string
  linkedinUrl?: string
  githubUrl?: string
  yearsOfExperience: number
  currentCompany?: string
  expectedSalary?: number
  noticePeriod?: string
}
