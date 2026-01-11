"use client"

import { useState, useMemo, useCallback } from "react"
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
  initialServices: Service[]
}

export function ProjectsFilter({ initialProjects, initialServices }: ProjectsFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Memoize filtered projects to prevent unnecessary recalculations
  const filteredProjects = useMemo(() => {
    if (selectedCategory === "all") {
      return initialProjects
    }
    return initialProjects.filter(
      (project) => project.serviceCategory === selectedCategory
    )
  }, [selectedCategory, initialProjects])

  // Memoize service map for O(1) lookup
  const serviceMap = useMemo(() => {
    const map = new Map<string, string>()
    initialServices.forEach(s => map.set(s.id, s.title))
    return map
  }, [initialServices])

  // Handle category change
  const handleCategoryChange = useCallback((category: string) => {
    if (category === selectedCategory) return
    setSelectedCategory(category)
  }, [selectedCategory])

  return (
    <>
      {/* Filter Tabs */}
      <section className="container mx-auto px-4 pb-8">
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            onClick={() => handleCategoryChange("all")}
            variant={selectedCategory === "all" ? "default" : "outline"}
            className={
              selectedCategory === "all"
                ? "rounded-full bg-gradient-to-r from-red-600 to-red-800 text-white hover:from-red-700 hover:to-red-900 transition-all duration-300 shadow-lg shadow-red-500/30 border border-red-400/20"
                : "rounded-full border-red-500/30 bg-black/40 text-gray-300 hover:bg-red-500/10 hover:border-red-500/50 hover:text-white transition-all duration-300"
            }
          >
            All Projects
          </Button>
          {initialServices.map((service) => (
            <Button
              key={service.id}
              onClick={() => handleCategoryChange(service.id)}
              variant={selectedCategory === service.id ? "default" : "outline"}
              className={
                selectedCategory === service.id
                  ? "rounded-full bg-gradient-to-r from-red-600 to-red-800 text-white hover:from-red-700 hover:to-red-900 transition-all duration-300 shadow-lg shadow-red-500/30 border border-red-400/20"
                  : "rounded-full border-red-500/30 bg-black/40 text-gray-300 hover:bg-red-500/10 hover:border-red-500/50 hover:text-white transition-all duration-300"
              }
            >
              {service.title}
            </Button>
          ))}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="container mx-auto px-4 pb-16 sm:pb-24">
        <div className="min-h-[400px]">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-gray-400">
                No projects found for this category.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project: Project) => {
              // Use memoized service map for O(1) lookup instead of array.find()
              const serviceTitle = project.serviceCategory 
                ? serviceMap.get(project.serviceCategory)
                : project.category

              return (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <Card className="group liquid-glass border border-red-500/20 bg-black/40 backdrop-blur-xl overflow-hidden transition-all hover:border-red-500/40 hover:bg-black/60 hover:shadow-xl hover:shadow-red-900/20 h-full">
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
                            src={project.image || project.images?.[0] || "/placeholder.svg"}
                            alt={project.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </>
                      )}

                      {project.video && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-800 backdrop-blur-sm shadow-lg shadow-red-500/50">
                            <Play className="h-7 w-7 text-white fill-white ml-1" />
                          </div>
                        </div>
                      )}

                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center rounded-full bg-black/60 backdrop-blur-sm px-3 py-1 text-xs font-medium text-red-400 border border-red-400/30">
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
                      <div className="mb-2 text-sm text-gray-400">{project.client}</div>
                      <h3 className="mb-2 text-xl font-bold text-white group-hover:text-red-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="mb-4 text-sm text-gray-300 line-clamp-2">{project.description}</p>
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.tags.slice(0, 3).map((tag: string) => (
                            <span key={tag} className="rounded-full bg-red-500/10 border border-red-500/20 px-2.5 py-1 text-xs text-gray-400">
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
        </div>
      </section>
    </>
  )
}
