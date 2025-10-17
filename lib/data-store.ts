"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

// Types
export interface Service {
  id: string
  title: string
  slug: string
  description: string
  icon: string
  features: string[]
  image: string
  detailedDescription: string
  process: { step: number; title: string; description: string }[]
  packages: {
    name: string
    price: string
    features: string[]
    deliveryTime: string
  }[]
  stats: { label: string; value: string }[]
}

export interface Project {
  id: string
  title: string
  slug: string
  category: string
  description: string
  image: string
  videoUrl?: string
  client: string
  year: string
  challenge: string
  solution: string
  results: string[]
  testimonial: {
    text: string
    author: string
    position: string
  }
  gallery: string[]
  tags: string[]
}

export interface TeamMember {
  id: string
  name: string
  slug: string
  role: string
  department: string
  image: string
  bio: string
  experience: string
  education: string[]
  awards: string[]
  expertise: string[]
  social: {
    linkedin?: string
    twitter?: string
    dribbble?: string
    behance?: string
  }
  featuredProjects: string[]
}

export interface Order {
  id: string
  clientId: string
  serviceId: string
  serviceName: string
  packageName: string
  price: string
  status: "pending" | "in-progress" | "completed" | "cancelled"
  orderDate: string
  deliveryDate?: string
  details: {
    name: string
    email: string
    company?: string
    message: string
  }
}

export interface Review {
  id: string
  clientId: string
  serviceId?: string
  projectId?: string
  rating: number
  comment: string
  date: string
  clientName: string
}

export interface Testimonial {
  id: string
  clientId: string
  text: string
  rating: number
  status: "pending" | "approved" | "rejected"
  date: string
  clientName: string
}

export interface Favorite {
  id: string
  clientId: string
  itemId: string
  itemType: "service" | "project"
  date: string
}

// Initial mock data
const initialServices: Service[] = [
  {
    id: "1",
    title: "3D Animation",
    slug: "3d-animation",
    description: "Bring your ideas to life with stunning 3D animations",
    icon: "Box",
    features: ["Character Animation", "Product Visualization", "Architectural Walkthrough"],
    image: "/3d-animation-studio-workspace.jpg",
    detailedDescription: "Our 3D animation services transform concepts into captivating visual stories...",
    process: [
      { step: 1, title: "Concept Development", description: "We start by understanding your vision..." },
      { step: 2, title: "Storyboarding", description: "Creating detailed storyboards..." },
      { step: 3, title: "Modeling & Texturing", description: "Building 3D models..." },
      { step: 4, title: "Animation & Rendering", description: "Bringing everything to life..." },
    ],
    packages: [
      {
        name: "Basic",
        price: "$2,500",
        features: ["Up to 30 seconds", "Basic modeling", "2 revision rounds", "1080p rendering"],
        deliveryTime: "2-3 weeks",
      },
      {
        name: "Professional",
        price: "$5,000",
        features: ["Up to 60 seconds", "Advanced modeling", "4 revision rounds", "4K rendering"],
        deliveryTime: "3-4 weeks",
      },
      {
        name: "Enterprise",
        price: "$10,000+",
        features: ["Unlimited duration", "Premium modeling", "Unlimited revisions", "8K rendering"],
        deliveryTime: "6-8 weeks",
      },
    ],
    stats: [
      { label: "Projects Completed", value: "500+" },
      { label: "Client Satisfaction", value: "98%" },
      { label: "Industry Awards", value: "25+" },
    ],
  },
  // Add more services...
]

const initialProjects: Project[] = [
  {
    id: "1",
    title: "Luxury Watch Campaign",
    slug: "luxury-watch-campaign",
    category: "3D Animation",
    description: "Premium 3D product visualization for luxury timepiece brand",
    image: "/project-luxury-watch.jpg",
    client: "Chronos Luxury",
    year: "2024",
    challenge: "Create a photorealistic 3D animation...",
    solution: "We developed a comprehensive 3D pipeline...",
    results: ["300% increase in engagement", "2M+ views in first week", "45% boost in sales"],
    testimonial: {
      text: "Pqrix exceeded our expectations...",
      author: "Michael Chen",
      position: "Marketing Director, Chronos Luxury",
    },
    gallery: ["/project-luxury-watch-1.jpg", "/project-luxury-watch-2.jpg", "/project-luxury-watch-3.jpg"],
    tags: ["3D Animation", "Product Visualization", "Luxury Brand"],
  },
  // Add more projects...
]

const initialTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Sarah Chen",
    slug: "sarah-chen",
    role: "Creative Director",
    department: "Leadership",
    image: "/team-sarah-chen.jpg",
    bio: "Sarah is an award-winning creative director...",
    experience: "12+ years in creative direction and 3D animation",
    education: ["MFA in Digital Arts, UCLA", "BA in Animation, CalArts"],
    awards: ["Cannes Lions Gold", "D&AD Yellow Pencil", "Webby Award"],
    expertise: ["Creative Direction", "3D Animation", "Brand Strategy"],
    social: {
      linkedin: "https://linkedin.com/in/sarahchen",
      twitter: "https://twitter.com/sarahchen",
    },
    featuredProjects: ["1", "2"],
  },
  // Add more team members...
]

// Store
interface DataStore {
  // Services
  services: Service[]
  addService: (service: Omit<Service, "id">) => void
  updateService: (id: string, service: Partial<Service>) => void
  deleteService: (id: string) => void

  // Projects
  projects: Project[]
  addProject: (project: Omit<Project, "id">) => void
  updateProject: (id: string, project: Partial<Project>) => void
  deleteProject: (id: string) => void

  // Team Members
  teamMembers: TeamMember[]
  addTeamMember: (member: Omit<TeamMember, "id">) => void
  updateTeamMember: (id: string, member: Partial<TeamMember>) => void
  deleteTeamMember: (id: string) => void

  // Orders
  orders: Order[]
  addOrder: (order: Omit<Order, "id">) => void
  updateOrderStatus: (id: string, status: Order["status"]) => void

  // Reviews
  reviews: Review[]
  addReview: (review: Omit<Review, "id">) => void

  // Testimonials
  testimonials: Testimonial[]
  addTestimonial: (testimonial: Omit<Testimonial, "id">) => void
  updateTestimonialStatus: (id: string, status: Testimonial["status"]) => void

  // Favorites
  favorites: Favorite[]
  addFavorite: (favorite: Omit<Favorite, "id">) => void
  removeFavorite: (id: string) => void
}

export const useDataStore = create<DataStore>()(
  persist(
    (set) => ({
      // Services
      services: initialServices,
      addService: (service) =>
        set((state) => ({
          services: [...state.services, { ...service, id: Date.now().toString() }],
        })),
      updateService: (id, service) =>
        set((state) => ({
          services: state.services.map((s) => (s.id === id ? { ...s, ...service } : s)),
        })),
      deleteService: (id) =>
        set((state) => ({
          services: state.services.filter((s) => s.id !== id),
        })),

      // Projects
      projects: initialProjects,
      addProject: (project) =>
        set((state) => ({
          projects: [...state.projects, { ...project, id: Date.now().toString() }],
        })),
      updateProject: (id, project) =>
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? { ...p, ...project } : p)),
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),

      // Team Members
      teamMembers: initialTeamMembers,
      addTeamMember: (member) =>
        set((state) => ({
          teamMembers: [...state.teamMembers, { ...member, id: Date.now().toString() }],
        })),
      updateTeamMember: (id, member) =>
        set((state) => ({
          teamMembers: state.teamMembers.map((m) => (m.id === id ? { ...m, ...member } : m)),
        })),
      deleteTeamMember: (id) =>
        set((state) => ({
          teamMembers: state.teamMembers.filter((m) => m.id !== id),
        })),

      // Orders
      orders: [],
      addOrder: (order) =>
        set((state) => ({
          orders: [...state.orders, { ...order, id: Date.now().toString() }],
        })),
      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        })),

      // Reviews
      reviews: [],
      addReview: (review) =>
        set((state) => ({
          reviews: [...state.reviews, { ...review, id: Date.now().toString() }],
        })),

      // Testimonials
      testimonials: [],
      addTestimonial: (testimonial) =>
        set((state) => ({
          testimonials: [...state.testimonials, { ...testimonial, id: Date.now().toString() }],
        })),
      updateTestimonialStatus: (id, status) =>
        set((state) => ({
          testimonials: state.testimonials.map((t) => (t.id === id ? { ...t, status } : t)),
        })),

      // Favorites
      favorites: [],
      addFavorite: (favorite) =>
        set((state) => ({
          favorites: [...state.favorites, { ...favorite, id: Date.now().toString() }],
        })),
      removeFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== id),
        })),
    }),
    {
      name: "data-storage",
    },
  ),
)
