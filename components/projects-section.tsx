"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const featuredProjects = [
  {
    id: "luxury-watch-campaign",
    title: "Luxury Watch Campaign",
    client: "TAG Heuer",
    category: "3D Animation",
    description: "Premium 3D product visualization showcasing the new Carrera collection",
    image: "/project-luxury-watch.jpg",
    video:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/A%20new%20chapter%20in%20the%20story%20of%20success.__Introducing%20the%20new%20TAG%20Heuer%20Carrera%20Day-Date%20collection%2C%20reimagined%20with%20bold%20colors%2C%20refined%20finishes%2C%20and%20upgraded%20functionality%20to%20keep%20you%20focused%20on%20your%20goals.%20__Six%20-nDNoRQyFaZ8oaaoty4XaQz8W8E5bqA.mp4",
    tags: ["3D Animation", "Product Viz", "Luxury"],
  },
  {
    id: "tech-startup-brand",
    title: "Tech Startup Rebrand",
    client: "Smartpack",
    category: "Brand Identity",
    description: "Complete brand identity redesign for innovative tech startup",
    image: "/project-tech-startup.jpg",
    tags: ["Branding", "Logo Design", "Tech"],
  },
  {
    id: "social-media-campaign",
    title: "Social Media Campaign",
    client: "Fashion Brand",
    category: "Motion Design",
    description: "Dynamic motion graphics for Instagram and TikTok campaign",
    image: "/project-social-campaign.jpg",
    video: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Timeline%201-Ku3Y2Hgaw8hCiFEFg1ELtYp631rSzR.webm",
    tags: ["Motion Graphics", "Social Media", "Fashion"],
  },
  {
    id: "product-launch-video",
    title: "Product Launch Video",
    client: "Consumer Electronics",
    category: "3D Animation",
    description: "High-impact 3D animation for flagship product launch",
    image: "/project-product-launch.jpg",
    tags: ["3D Animation", "Product Launch", "Electronics"],
  },
]

export function ProjectsSection() {
  return (
    <section id="projects" className="container mx-auto px-4 py-12 sm:py-16">
      <div className="mb-10 text-center">
        <h2 className="mb-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Featured Projects</h2>
        <p className="mx-auto max-w-2xl text-lg text-gray-300">See how we've helped brands stand out with innovative design and animation.</p>
        <Button asChild variant="ghost" className="mt-6 text-lime-400 hover:bg-lime-400/10 hover:text-lime-300">
          <Link href="/projects">
            View All Projects
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featuredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}

function ProjectCard({ project }: { project: (typeof featuredProjects)[0] }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link href={`/projects/${project.id}`}>
      <Card
        className="group liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden transition-all hover:border-white/20 hover:bg-white/10 h-full flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-video overflow-hidden bg-gray-900">
          {project.video ? (
            <>
              <video
                src={project.video}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                autoPlay
                loop
                muted
                playsInline
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </>
          ) : (
            <>
              <img
                src={project.image || "/placeholder.svg"}
                alt={project.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </>
          )}

          {/* Play button overlay for video projects */}
          {project.video && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-lime-400/90 backdrop-blur-sm">
                <Play className="h-7 w-7 text-black fill-black ml-1" />
              </div>
            </div>
          )}

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center rounded-full bg-black/60 backdrop-blur-sm px-2.5 py-0.5 text-xs font-medium text-lime-400 border border-lime-400/30">
              {project.category}
            </span>
          </div>
        </div>

        <div className="p-4 flex-grow flex flex-col">
          <div className="mb-1 text-sm text-gray-400">
            <span>{project.client}</span>
          </div>
          <h3 className="mb-2 text-xl font-bold text-white group-hover:text-lime-400 transition-colors">
            {project.title}
          </h3>
          <p className="mb-3 text-gray-300 text-sm flex-grow">{project.description}</p>
          <div className="flex flex-wrap gap-2 mt-auto">
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs text-gray-400">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </Link>
  )
}