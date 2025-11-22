"use client"

import { useState, useMemo, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Linkedin, Twitter, Mail } from "lucide-react"
import Link from "next/link"

interface TeamMember {
  id: string
  name: string
  role: string
  department: string
  bio: string
  image?: string
  linkedin?: string
  twitter?: string
  email?: string
}

interface TeamFilterProps {
  initialMembers: TeamMember[]
}

export function TeamFilter({ initialMembers }: TeamFilterProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")

  // Get unique departments
  const departments = useMemo(() => {
    if (!Array.isArray(initialMembers)) return []
    const depts = new Set(initialMembers.map((m) => m.department).filter(Boolean))
    return Array.from(depts).sort()
  }, [initialMembers])

  // Filter members by department
  const filteredMembers = useMemo(() => {
    if (selectedDepartment === "all") {
      return initialMembers
    }
    return initialMembers.filter((member) => member.department === selectedDepartment)
  }, [selectedDepartment, initialMembers])

  // Handle department change
  const handleDepartmentChange = useCallback((department: string) => {
    if (department === selectedDepartment) return
    setSelectedDepartment(department)
  }, [selectedDepartment])

  return (
    <>
      {/* Department Filter */}
      <section className="container mx-auto px-4 pb-8">
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            onClick={() => handleDepartmentChange("all")}
            variant={selectedDepartment === "all" ? "default" : "outline"}
            className={
              selectedDepartment === "all"
                ? "rounded-full bg-green-500 dark:bg-lime-400 text-white dark:text-black hover:bg-green-600 dark:hover:bg-lime-300 transition-colors duration-150"
                : "rounded-full border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors duration-150"
            }
          >
            All Departments
          </Button>
          {departments.map((dept) => (
            <Button
              key={dept}
              onClick={() => handleDepartmentChange(dept)}
              variant={selectedDepartment === dept ? "default" : "outline"}
              className={
                selectedDepartment === dept
                  ? "rounded-full bg-green-500 dark:bg-lime-400 text-white dark:text-black hover:bg-green-600 dark:hover:bg-lime-300 transition-colors duration-150"
                  : "rounded-full border-gray-300 dark:border-white/20 bg-white dark:bg-white/5 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors duration-150"
              }
            >
              {dept}
            </Button>
          ))}
        </div>
      </section>

      {/* Team Grid */}
      <section className="container mx-auto px-4 pb-16 sm:pb-24">
        <div className="min-h-[400px]">
          {filteredMembers.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-gray-600 dark:text-gray-400">
                No team members found in this department.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredMembers.map((member) => (
                <Link key={member.id} href={`/team/${member.id}`}>
                  <Card className="group liquid-glass border border-gray-200 dark:border-white/10 backdrop-blur-xl overflow-hidden transition-all hover:border-gray-300 dark:hover:border-white/20 hover:bg-white dark:hover:bg-white/10 h-full">
                    <div className="relative aspect-square overflow-hidden bg-gray-200 dark:bg-gray-900">
                      <img
                        src={member.image || "/placeholder.svg"}
                        alt={member.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Social Links Overlay */}
                      {(member.linkedin || member.twitter || member.email) && (
                        <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                          {member.linkedin && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
                              asChild
                            >
                              <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                                <Linkedin className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          {member.twitter && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
                              asChild
                            >
                              <a href={member.twitter} target="_blank" rel="noopener noreferrer">
                                <Twitter className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          {member.email && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
                              asChild
                            >
                              <a href={`mailto:${member.email}`}>
                                <Mail className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      )}

                      {/* Department Badge */}
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center rounded-full bg-black/60 backdrop-blur-sm px-3 py-1 text-xs font-medium text-green-400 dark:text-lime-400 border border-green-400/30 dark:border-lime-400/30">
                          {member.department}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="mb-1 text-xl font-bold text-black dark:text-white group-hover:text-green-600 dark:group-hover:text-lime-400 transition-colors">
                        {member.name}
                      </h3>
                      <p className="mb-3 text-sm font-medium text-green-600 dark:text-lime-400">{member.role}</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{member.bio}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
