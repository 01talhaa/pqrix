export interface TestimonialDocument {
  id: string
  clientId?: string
  clientName: string
  clientEmail: string
  clientImage?: string // Cloudinary URL (deprecated - use images array)
  images?: string[] // Array of Cloudinary URLs for multiple images
  rating: number // 1-5 stars
  review: string
  approved: boolean
  createdAt: string
  updatedAt?: string
}

export interface CreateTestimonialInput {
  clientId?: string
  clientName: string
  clientEmail: string
  clientImage?: string
  images?: string[]
  rating: number
  review: string
}

export interface UpdateTestimonialInput {
  clientName?: string
  clientImage?: string
  images?: string[]
  rating?: number
  review?: string
  approved?: boolean
}
