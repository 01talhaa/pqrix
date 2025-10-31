"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export function ProjectsSection() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects')
        const data = await response.json()
        if (data.success || Array.isArray(data.data)) {
          // Show only first 6 projects
          const projectsData = data.data || data
          setProjects(projectsData.slice(0, 6))
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  if (loading) {
    return (
      <section id="projects" className="container mx-auto px-4 py-12 sm:py-16">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-4xl font-extrabold tracking-tight text-black dark:text-white sm:text-5xl">Featured Projects</h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-700 dark:text-gray-300">See how we've helped brands stand out with innovative design and animation.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-96 rounded-lg bg-gray-200 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  if (projects.length === 0) {
    return null
  }

  return (
    <section id="projects" className="container mx-auto px-4 py-12 sm:py-16">
      <div className="mb-10 text-center">
        <h2 className="mb-2 text-4xl font-extrabold tracking-tight text-black dark:text-white sm:text-5xl">Featured Projects</h2>
        <p className="mx-auto max-w-2xl text-lg text-gray-700 dark:text-gray-300">See how we've helped brands stand out with innovative design and animation.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button
          asChild
          className="rounded-full bg-green-500 dark:bg-lime-400 px-8 py-6 text-base font-semibold text-white dark:text-black hover:bg-green-600 dark:hover:bg-lime-300"
        >
          <Link href="/projects">
            View All Projects
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  )
}

function ProjectCard({ project }: { project: any }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link href={`/projects/${project.id}`}>
      <Card
        className="group liquid-glass border border-gray-200 dark:border-white/10 backdrop-blur-xl overflow-hidden transition-all hover:border-gray-300 dark:hover:border-white/20 hover:bg-white/90 dark:hover:bg-white/10 h-full flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-900">
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
              <div className="absolute inset-0 bg-gradient-to-t from-white/60 dark:from-black/60 to-transparent" />
            </>
          ) : (
            <>
              <img
                src={project.image || project.images?.[0] || "/placeholder.svg"}
                alt={project.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/60 dark:from-black/60 to-transparent" />
            </>
          )}

          {/* Play button overlay for video projects */}
          {project.video && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/90 dark:bg-lime-400/90 backdrop-blur-sm">
                <Play className="h-7 w-7 text-white dark:text-black fill-white dark:fill-black ml-1" />
              </div>
            </div>
          )}

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-sm px-2.5 py-0.5 text-xs font-medium text-green-700 dark:text-lime-400 border border-green-500/30 dark:border-lime-400/30">
              {project.category}
            </span>
          </div>
        </div>

        <div className="p-4 flex-grow flex flex-col">
          <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">
            <span>{project.client}</span>
          </div>
          <h3 className="mb-2 text-xl font-bold text-black dark:text-white group-hover:text-green-600 dark:group-hover:text-lime-400 transition-colors">
            {project.title}
          </h3>
          <p className="mb-3 text-gray-700 dark:text-gray-300 text-sm flex-grow">{project.description}</p>
          <div className="flex flex-wrap gap-2 mt-auto">
            {project.tags?.map((tag: string) => (
              <span key={tag} className="rounded-full bg-gray-200 dark:bg-white/5 px-2.5 py-0.5 text-xs text-gray-600 dark:text-gray-400">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </Link>
  )
}