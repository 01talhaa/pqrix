/**
 * Blog Post Data Model
 * Represents a blog post with rich content, images, and metadata
 */

export interface BlogDocument {
  id: string
  title: string
  slug: string // URL-friendly version of title
  excerpt: string // Short description for previews
  content: string // Full blog content (supports HTML/Markdown)
  coverImage?: string // Main cover image URL from Cloudinary
  images?: string[] // Additional images in the blog
  author: {
    name: string
    email?: string
    image?: string
  }
  status: 'draft' | 'published'
  tags?: string[] // Categories/tags for filtering
  views?: number // View count
  publishedAt?: string // When it was published
  createdAt: string
  updatedAt?: string
}

export interface CreateBlogInput {
  title: string
  slug?: string // Auto-generated if not provided
  excerpt: string
  content: string
  coverImage?: string
  images?: string[]
  author: {
    name: string
    email?: string
    image?: string
  }
  status: 'draft' | 'published'
  tags?: string[]
}

export interface UpdateBlogInput {
  title?: string
  slug?: string
  excerpt?: string
  content?: string
  coverImage?: string
  images?: string[]
  author?: {
    name?: string
    email?: string
    image?: string
  }
  status?: 'draft' | 'published'
  tags?: string[]
}

/**
 * Utility function to generate URL-friendly slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
}
