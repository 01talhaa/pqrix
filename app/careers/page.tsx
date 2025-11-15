'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { SiteHeader } from '@/components/site-header'
import { AppverseFooter } from '@/components/appverse-footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MapPin, Briefcase, DollarSign, Clock, Search, ChevronRight } from 'lucide-react'

interface JobPosting {
  _id: string
  id: string
  title: string
  department: string
  location: string
  type: string
  experienceLevel: string
  salaryRange?: {
    min: number
    max: number
    currency: string
  }
  description: string
  status: 'active' | 'closed' | 'draft'
  postedDate: string
}

export default function CareersPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    department: '',
    type: '',
    location: '',
    search: ''
  })

  useEffect(() => {
    fetchJobs()
  }, [filters])

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.department) params.append('department', filters.department)
      if (filters.type) params.append('type', filters.type)
      if (filters.location) params.append('location', filters.location)
      if (filters.search) params.append('search', filters.search)
      
      const response = await fetch(`/api/careers?${params}`)
      const data = await response.json()

      if (data.success) {
        setJobs(data.data)
      } else {
        setJobs([])
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  const getJobTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'Full-time': 'bg-green-500',
      'Part-time': 'bg-blue-500',
      'Contract': 'bg-purple-500',
      'Internship': 'bg-orange-500',
      'Remote': 'bg-pink-500'
    }
    return colors[type] || 'bg-gray-500'
  }

  const getExperienceLevelColor = (level: string) => {
    const colors: { [key: string]: string } = {
      'Entry': 'bg-green-100 text-green-800',
      'Mid': 'bg-blue-100 text-blue-800',
      'Senior': 'bg-purple-100 text-purple-800',
      'Lead': 'bg-orange-100 text-orange-800',
      'Executive': 'bg-red-100 text-red-800'
    }
    return colors[level] || 'bg-gray-100 text-gray-800'
  }

  return (
    <>
      <SiteHeader />
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pt-24 pb-16">
        <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black dark:text-white mb-4">
            Join Our <span className="text-green-600 dark:text-lime-300 drop-shadow-[0_0_20px_rgba(34,197,94,0.35)] dark:drop-shadow-[0_0_20px_rgba(132,204,22,0.35)]">Team</span>
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Build the future of digital experiences with us. We're always looking for talented individuals to join our growing team.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="liquid-glass border border-gray-200 dark:border-white/10 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search jobs..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-10"
                  />
                </div>

                <Select
                  value={filters.department || undefined}
                  onValueChange={(value) => setFilters({ ...filters, department: value === 'all' ? '' : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.type || undefined}
                  onValueChange={(value) => setFilters({ ...filters, type: value === 'all' ? '' : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.location || undefined}
                  onValueChange={(value) => setFilters({ ...filters, location: value === 'all' ? '' : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                    <SelectItem value="New York">New York</SelectItem>
                    <SelectItem value="San Francisco">San Francisco</SelectItem>
                    <SelectItem value="London">London</SelectItem>
                    <SelectItem value="Dubai">Dubai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Job Listings */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-600 dark:text-gray-400">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-black dark:text-white mb-2">No Open Positions</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We don't have any openings matching your criteria right now, but check back soon!
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="liquid-glass border border-gray-200 dark:border-white/10 backdrop-blur-xl hover:shadow-lg transition-all duration-300 hover:border-green-500 dark:hover:border-lime-400">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-start gap-3">
                          <CardTitle className="text-2xl font-bold text-black dark:text-white">
                            {job.title}
                          </CardTitle>
                          {job.status === 'active' && (
                            <Badge className="bg-green-500 dark:bg-lime-400 text-white dark:text-black">Active</Badge>
                          )}
                        </div>
                        <CardDescription className="text-base">
                          {job.department}
                        </CardDescription>
                      </div>
                      <Link href={`/careers/${job.id}`}>
                        <Button className="gap-2 rounded-full bg-green-500 dark:bg-lime-400 text-white dark:text-black hover:bg-green-600 dark:hover:bg-lime-300">
                          View Details
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Job Details */}
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Briefcase className="h-4 w-4" />
                          <Badge className={getJobTypeColor(job.type)}>
                            {job.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getExperienceLevelColor(job.experienceLevel)}>
                            {job.experienceLevel} Level
                          </Badge>
                        </div>
                        {job.salaryRange && (
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <DollarSign className="h-4 w-4" />
                            <span>
                              {job.salaryRange.currency} {job.salaryRange.min.toLocaleString()} - {job.salaryRange.max.toLocaleString()}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Description Preview */}
                      <p className="text-gray-700 dark:text-gray-300 line-clamp-2">
                        {job.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="liquid-glass border border-gray-200 dark:border-white/10 backdrop-blur-xl">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-green-600 dark:text-lime-400 mb-2">
                {jobs.length}
              </div>
              <p className="text-gray-600 dark:text-gray-400">Open Positions</p>
            </CardContent>
          </Card>
          <Card className="liquid-glass border border-gray-200 dark:border-white/10 backdrop-blur-xl">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-green-600 dark:text-lime-400 mb-2">
                Remote
              </div>
              <p className="text-gray-600 dark:text-gray-400">Work From Anywhere</p>
            </CardContent>
          </Card>
          <Card className="liquid-glass border border-gray-200 dark:border-white/10 backdrop-blur-xl">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-green-600 dark:text-lime-400 mb-2">
                Growth
              </div>
              <p className="text-gray-600 dark:text-gray-400">Career Development</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
    <AppverseFooter />
    </>
  )
}
