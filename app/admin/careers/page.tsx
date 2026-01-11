"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus, MapPin, Briefcase, Clock, Users } from "lucide-react"
import Link from "next/link"
import type { JobPostingDocument } from "@/lib/models/JobPosting"

export default function CareersAdminPage() {
  const [jobs, setJobs] = useState<JobPostingDocument[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await fetch("/api/careers?admin=true")
      const data = await response.json()
      if (data.success) {
        setJobs(data.data)
      }
    } catch (error) {
      console.error("Error fetching jobs:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteJob = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job posting?")) return

    try {
      const response = await fetch(`/api/careers/${id}?admin=true`, {
        method: "DELETE",
      })

      if (response.ok) {
        setJobs(jobs.filter((j) => j.id !== id))
      }
    } catch (error) {
      console.error("Error deleting job:", error)
    }
  }

  const statusColors: Record<string, string> = {
    active: "bg-green-500",
    closed: "bg-red-500",
    draft: "bg-gray-500",
  }

  const typeColors: Record<string, string> = {
    "full-time": "bg-blue-500",
    "part-time": "bg-purple-500",
    contract: "bg-orange-500",
    internship: "bg-pink-500",
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Career Opportunities</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage job postings and track applications
          </p>
        </div>
        <Link href="/admin/careers/create">
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            New Job Posting
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {jobs.filter((j) => j.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {jobs.reduce((sum, j) => sum + j.applicationsCount, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Departments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(jobs.map((j) => j.department)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {jobs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No job postings yet. Create your first one!
              </p>
              <Link href="/admin/careers/create">
                <Button>Create Job Posting</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          jobs.map((job) => (
            <Card key={job.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${statusColors[job.status]} text-white`}>
                        {job.status}
                      </Badge>
                      <Badge className={`${typeColors[job.type]} text-white`}>
                        {job.type}
                      </Badge>
                      {job.featured && (
                        <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                          Featured
                        </Badge>
                      )}
                      {job.remote && (
                        <Badge variant="outline" className="border-green-500 text-green-600">
                          Remote
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {job.description}
                    </p>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    <span>{job.department}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{job.experience}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{job.applicationsCount} applications</span>
                  </div>
                </div>

                {/* Salary Range */}
                {job.salaryRange && (
                  <div className="mb-4 text-sm">
                    <span className="font-semibold text-green-600 dark:text-lime-400">
                      {job.salaryRange.currency} {job.salaryRange.min.toLocaleString()} -{" "}
                      {job.salaryRange.max.toLocaleString()}
                    </span>
                  </div>
                )}

                {/* Requirements Preview */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2">Requirements ({job.requirements.length}):</h4>
                  <div className="flex flex-wrap gap-1">
                    {job.requirements.slice(0, 3).map((req, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {req.substring(0, 30)}...
                      </Badge>
                    ))}
                    {job.requirements.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{job.requirements.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link href={`/admin/careers/edit/${job.id}`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                  <Link href={`/admin/applications?jobId=${job.id}`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Users className="h-4 w-4" />
                      View Applications ({job.applicationsCount})
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-red-600 hover:text-red-700"
                    onClick={() => deleteJob(job.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
