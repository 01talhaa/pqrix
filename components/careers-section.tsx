"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { MapPin, Briefcase, Clock, TrendingUp, ArrowRight, Users } from "lucide-react"
import type { JobPostingDocument } from "@/lib/models/JobPosting"

const departmentColors: Record<string, string> = {
  Engineering: "bg-blue-500",
  Design: "bg-purple-500",
  Marketing: "bg-pink-500",
  Sales: "bg-green-500",
  Product: "bg-orange-500",
  Operations: "bg-cyan-500",
}

function CareersSection() {
  const [jobs, setJobs] = useState<JobPostingDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")

  useEffect(() => {
    fetchJobs()
  }, [selectedDepartment])

  const fetchJobs = async () => {
    setLoading(true) // Ensure loading is true when fetching
    try {
      const params = new URLSearchParams({
        status: "active",
      })

      if (selectedDepartment !== "all") {
        params.append("department", selectedDepartment)
      }

      const response = await fetch(`/api/careers?${params}`)
      const data = await response.json()

      if (data.success) {
        setJobs(data.data.slice(0, 6)) // Show max 6 on homepage
      } else {
        setJobs([]); // Clear jobs on error or no success
      }
    } catch (error) {
      console.error("Error fetching jobs:", error)
      setJobs([]); // Clear jobs on error
    } finally {
      setLoading(false)
    }
  }

  // Extract unique departments from jobs
  // Filter out null/undefined departments and ensure 'all' is always first
  const departments = ["all", ...Array.from(new Set(jobs.map(job => job.department).filter(Boolean)))]

  return (
    <section className="relative py-16 sm:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-semibold text-sm mb-4">
            <Users className="h-4 w-4" />
            <span>Join Our Team</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black dark:text-white mb-4">
            Open <span className="text-red-600 dark:text-red-400">Positions</span>
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Build the future of software with talented individuals from around the world
          </p>

          {/* Department Filter */}
          {departments.length > 1 && (
            <div className="flex flex-wrap justify-center gap-3">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                    selectedDepartment === dept
                      ? "bg-red-600 dark:bg-red-500 text-white shadow-lg scale-105"
                      : "bg-white/80 dark:bg-black/60 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-black/80 border border-gray-200 dark:border-gray-700"
                  }`}
                  style={{
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {dept === "all" ? "All Departments" : dept}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-3xl overflow-hidden bg-gray-200 dark:bg-gray-800 h-64"
              />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              No open positions at the moment.
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm">
              Check back soon or send us your resume at <a href="mailto:careers@pqrix.com" className="text-red-600 dark:text-red-400 hover:underline">careers@pqrix.com</a>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {jobs.map((job, index) => (
              <motion.article
                key={job.id || `job-${index}`} // Ensure unique key with fallback
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link href={`/careers/${job.id}`} className="block h-full"> {/* Ensure link takes full height */}
                  <div
                    // Combined styles for consistency with InsightsSection
                    className="relative overflow-hidden rounded-3xl p-6 transition-all duration-300
                               group-hover:shadow-2xl group-hover:-translate-y-2 h-full flex flex-col
                               bg-white/90 dark:bg-black/70 border border-gray-200 dark:border-white/10
                               hover:border-gray-300 dark:hover:border-white/20 hover:bg-white/95 dark:hover:bg-black/80"
                    style={{
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      boxShadow: "0 8px 32px 0 rgba(0,0,0,0.1)", // Light mode shadow
                      // Dark mode shadow will be handled by data-theme in global CSS or a dedicated dark class
                    }}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-black dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                          {job.title}
                        </h3>
                        <div
                          className={`inline-flex items-center gap-1 ${
                            departmentColors[job.department] || "bg-gray-500"
                          } text-white px-3 py-1 rounded-full text-xs font-bold shadow-md`}
                        >
                          <Briefcase className="h-3 w-3" />
                          <span>{job.department}</span>
                        </div>
                      </div>

                      {job.featured && (
                        <div className="flex-shrink-0">
                          <div className="px-3 py-1 rounded-full bg-yellow-400 text-yellow-900 text-xs font-bold shadow-md flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            <span>Featured</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2 flex-grow"> {/* flex-grow to push content down */}
                      {job.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                        {job.remote && (
                          <span className="ml-1 px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded text-xs font-semibold">
                            Remote
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span className="capitalize">{job.type.replace("-", " ")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        <span>{job.experience}</span>
                      </div>
                    </div>

                    {/* Requirements Preview */}
                    {job.requirements && job.requirements.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-black dark:text-white mb-2">
                          Key Requirements:
                        </h4>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          {job.requirements.slice(0, 3).map((req, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-red-600 dark:text-red-400 mt-0.5">•</span>
                              <span className="line-clamp-1">{req}</span>
                            </li>
                          ))}
                          {job.requirements.length > 3 && (
                            <li className="text-xs text-gray-500 dark:text-gray-500 ml-4">
                              +{job.requirements.length - 3} more...
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Apply Button */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 mt-auto"> {/* mt-auto to push to bottom */}
                      <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-semibold text-sm group-hover:gap-3 transition-all">
                        <span>View Details & Apply</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                      {job.applicationsCount > 0 && (
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          {job.applicationsCount} applicant{job.applicationsCount !== 1 ? "s" : ""}
                        </div>
                      )}
                    </div>

                    {/* Hover Gradient Effect */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        background: "radial-gradient(circle at top right, rgba(220,38,38,0.15), transparent 60%)",
                      }}
                    />
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}

        {/* View All Jobs Button */}
        {!loading && jobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 dark:bg-red-500 text-white font-bold rounded-full hover:scale-105 transition-transform shadow-xl"
            >
              <span>View All Openings</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        )}

        {/* Dark Mode Styles - Removed as classes are now inline or derived */}
        {/* <style jsx global>{`
          @media (prefers-color-scheme: dark) {
            .group > a > div {
              background: linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(20,20,20,0.7) 100%) !important;
              border: 2px solid rgba(255,255,255,0.1) !important;
              box-shadow: 0 8px 32px 0 rgba(0,0,0,0.4) !important;
            }
          }
        `}</style> */}
      </div>
    </section>
  )
}

export { CareersSection }
export default CareersSection