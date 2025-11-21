"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import Link from "next/link"

interface Project {
  id: string
  title: string
  client: string
  category: string
  serviceCategory?: string
  description: string
  image?: string
  images?: string[]
  video?: string
  tags: string[]
  year: string
}

interface Service {
  id: string
  title: string
}

interface ProjectsFilterProps {
  initialProjects: Project[]
}

export function ProjectsFilter({ initialProjects }: ProjectsFilterProps) {
  const [projects] = useState<Project[]>(initialProjects)
  const [services, setServices] = useState<Service[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(initialProjects)

  useEffect(() => {
    fetchServices()
  }, [])

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredProjects(projects)
    } else {
      setFilteredProjects(
        projects.filter(
          (project) => project.serviceCategory === selectedCategory
        )
      )
    }
  }, [selectedCategory, projects])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services')
      const data = await response.json()
      if (data.success) {
        setServices(data.data.map((s: any) => ({ id: s.id, title: s.title })))
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    }
  }

  return (
    <>
      {/* Filter Tabs */}
      <section className="container mx-auto px-4 pb-8">
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            onClick={() => setSelectedCategory("all")}
            variant={selectedCategory === "all" ? "default" : "outline"}
            className={
              selectedCategory === "all"
                ? "rounded-full bg-green-500 dark:bg-lime-400 text-white dark:text-black hover:bg-green-600 dark:hover:bg-lime-300"
                : "rounded-full border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
            }
          >
            All Projects
          </Button>
          {services.map((service) => (
            <Button
              key={service.id}
              onClick={() => setSelectedCategory(service.id)}
              variant={selectedCategory === service.id ? "default" : "outline"}
              className={
                selectedCategory === service.id
                  ? "rounded-full bg-green-500 dark:bg-lime-400 text-white dark:text-black hover:bg-green-600 dark:hover:bg-lime-300"
                  : "rounded-full border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
              }
            >
              {service.title}
            </Button>
          ))}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="container mx-auto px-4 pb-16 sm:pb-24">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              No projects found for this category.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project: Project) => {
              // Find the service title for display
              const serviceTitle = project.serviceCategory 
                ? services.find(s => s.id === project.serviceCategory)?.title 
                : project.category

              return (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <Card className="group liquid-glass border border-gray-200 dark:border-white/10 backdrop-blur-xl overflow-hidden transition-all hover:border-gray-300 dark:hover:border-white/20 hover:bg-white dark:hover:bg-white/10 h-full">
                    <div className="relative aspect-video overflow-hidden bg-gray-200 dark:bg-gray-900">
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
                            src={project.image || project.images?.[0] || "/placeholder.svg"}
                            alt={project.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </>
                      )}

                      {project.video && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/90 dark:bg-lime-400/90 backdrop-blur-sm">
                            <Play className="h-7 w-7 text-white dark:text-black fill-white dark:fill-black ml-1" />
                          </div>
                        </div>
                      )}

                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center rounded-full bg-black/60 backdrop-blur-sm px-3 py-1 text-xs font-medium text-green-400 dark:text-lime-400 border border-green-400/30 dark:border-lime-400/30">
                          {serviceTitle || project.category}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center rounded-full bg-black/60 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white">
                          {project.year}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">{project.client}</div>
                      <h3 className="mb-2 text-xl font-bold text-black dark:text-white group-hover:text-green-600 dark:group-hover:text-lime-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="mb-4 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{project.description}</p>
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.tags.slice(0, 3).map((tag: string) => (
                            <span key={tag} className="rounded-full bg-gray-100 dark:bg-white/5 px-2.5 py-1 text-xs text-gray-600 dark:text-gray-400">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}
