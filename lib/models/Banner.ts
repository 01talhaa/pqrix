/**
 * Banner Data Model
 * Represents hero section banners with images/videos
 */

export interface BannerMedia {
  url: string              // Cloudinary URL
  type: 'image' | 'video'
  posterUrl?: string       // Thumbnail for videos
}

export interface BannerDocument {
  id: string
  title: string
  subtitle: string
  tone: string // e.g., "results", "speed", "social", "standout", "premium"
  media: BannerMedia[]     // Support multiple media items
  displayStyle: 'autoplay' | 'slider' | 'static' // Display options
  status: 'draft' | 'published'
  order: number // Display order in hero section
  gradient?: string // CSS gradient for background
  createdAt: string
  updatedAt?: string
  publishedAt?: string
}

export interface CreateBannerInput {
  title: string
  subtitle: string
  tone: string
  media: BannerMedia[]
  displayStyle: 'autoplay' | 'slider' | 'static'
  status: 'draft' | 'published'
  order: number
  gradient?: string
}

export interface UpdateBannerInput {
  title?: string
  subtitle?: string
  tone?: string
  media?: BannerMedia[]
  displayStyle?: 'autoplay' | 'slider' | 'static'
  status?: 'draft' | 'published'
  order?: number
  gradient?: string
}

export const BANNERS_COLLECTION = "banners"

export const DISPLAY_STYLES = {
  autoplay: {
    label: "Auto Play Video",
    description: "Video plays automatically on loop",
    icon: "Play",
  },
  slider: {
    label: "Slider/Carousel",
    description: "Swipeable banner carousel",
    icon: "Layers",
  },
  static: {
    label: "Static Display",
    description: "Fixed image or video",
    icon: "Image",
  },
}

export const TONE_OPTIONS = [
  { value: "results", label: "Results", color: "lime" },
  { value: "speed", label: "Speed", color: "green" },
  { value: "social", label: "Social", color: "blue" },
  { value: "standout", label: "Standout", color: "purple" },
  { value: "premium", label: "Premium", color: "gold" },
  { value: "creative", label: "Creative", color: "pink" },
  { value: "professional", label: "Professional", color: "gray" },
]

export const GRADIENT_PRESETS = [
  { name: "Dark Blue", value: "from-[#0b0b0b] via-[#0f172a] to-[#020617]" },
  { name: "Dark Green", value: "from-[#0b1a0b] via-[#052e16] to-[#022c22]" },
  { name: "Ocean Blue", value: "from-[#001028] via-[#0b355e] to-[#052e5e]" },
  { name: "Slate Gray", value: "from-[#0b0b0b] via-[#1f2937] to-[#0b1220]" },
  { name: "Forest", value: "from-[#0b0b0b] via-[#111827] to-[#052e16]" },
  { name: "Purple Haze", value: "from-[#0b0b0b] via-[#1e1b4b] to-[#312e81]" },
  { name: "Crimson", value: "from-[#0b0b0b] via-[#450a0a] to-[#7f1d1d]" },
]
