/**
 * Ad/Offer Data Model
 * Represents promotional ads and special offers
 */

export interface AdDocument {
  id: string
  title: string
  description?: string // Optional description for the ad
  images: string[] // Array of Cloudinary URLs (at least 1 required)
  link?: string // Optional link when user clicks the ad
  status: 'draft' | 'published'
  displayDuration?: number // Duration in seconds (default: 5)
  createdAt: string
  updatedAt?: string
  publishedAt?: string
}

export interface CreateAdInput {
  title: string
  description?: string
  images: string[] // Minimum 1 image required
  link?: string
  status: 'draft' | 'published'
  displayDuration?: number
}

export interface UpdateAdInput {
  title?: string
  description?: string
  images?: string[]
  link?: string
  status?: 'draft' | 'published'
  displayDuration?: number
}
