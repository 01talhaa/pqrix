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
                ? "rounded-full bg-gradient-to-r from-red-600 to-red-800 text-white hover:from-red-700 hover:to-red-900 transition-all duration-300 shadow-lg shadow-red-500/40"
                : "rounded-full border-red-500/30 bg-black/20 text-gray-300 hover:bg-black/40 hover:border-red-500/50 transition-all duration-300"
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
                  ? "rounded-full bg-gradient-to-r from-red-600 to-red-800 text-white hover:from-red-700 hover:to-red-900 transition-all duration-300 shadow-lg shadow-red-500/40"
                  : "rounded-full border-red-500/30 bg-black/20 text-gray-300 hover:bg-black/40 hover:border-red-500/50 transition-all duration-300"
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
              <p className="text-lg text-gray-400">
                No team members found in this department.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredMembers.map((member) => (
                <Link key={member.id} href={`/team/${member.id}`}>
                  <Card className="group liquid-glass border border-red-500/20 bg-black/40 backdrop-blur-xl overflow-hidden transition-all hover:border-red-500/40 hover:shadow-lg hover:shadow-red-500/30 h-full">
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
                        <span className="inline-flex items-center rounded-full bg-black/60 backdrop-blur-sm px-3 py-1 text-xs font-medium text-red-400 border border-red-400/30">
                          {member.department}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="mb-1 text-xl font-bold text-white group-hover:text-red-400 transition-colors">
                        {member.name}
                      </h3>
                      <p className="mb-3 text-sm font-medium text-red-400">{member.role}</p>
                      <p className="text-sm text-gray-300 line-clamp-2">{member.bio}</p>
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
