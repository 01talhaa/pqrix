import { ObjectId } from 'mongodb'

export interface InsightAuthor {
  name: string
  role: string
  avatar?: string
  bio?: string
}

export interface InsightDocument {
  _id?: ObjectId
  id: string
  title: string
  slug: string
  excerpt: string
  content: string // Rich text HTML content
  
  // Classification
  category: 'Market Analysis' | 'Investment Tips' | 'Industry News' | 'Trends' | 'Regulations' | 'Case Study'
  tags: string[]
  
  // Media
  featuredImage: string
  gallery?: string[]
  
  // Author & Attribution
  author: InsightAuthor
  
  // SEO
  seoTitle?: string
  seoDescription?: string
  
  // Engagement
  views?: number
  readTime?: number // in minutes
  
  // Publishing
  publishDate: Date
  featured?: boolean
  isPublished: boolean
  
  // Metadata
  createdAt?: Date
  updatedAt?: Date
  createdBy?: string
}

export const INSIGHTS_COLLECTION = 'insights'

// Database indexes for optimal query performance
export const INSIGHT_INDEXES = [
  { key: { slug: 1 }, unique: true },
  { key: { category: 1 } },
  { key: { featured: 1 } },
  { key: { isPublished: 1 } },
  { key: { publishDate: -1 } },
  { key: { views: -1 } },
  { key: { createdAt: -1 } },
  // Compound indexes for common queries
  { key: { isPublished: 1, featured: -1, publishDate: -1 } },
  { key: { category: 1, isPublished: 1, publishDate: -1 } },
  // Text index for search
  { key: { title: 'text', excerpt: 'text', content: 'text', tags: 'text' } },
]
