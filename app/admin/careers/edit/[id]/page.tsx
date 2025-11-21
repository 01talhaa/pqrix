"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function EditCareerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    type: "full-time",
    experience: "",
    salary: "",
    description: "",
    responsibilities: "",
    requirements: "",
    niceToHave: "",
    benefits: "",
    status: "active" as 'active' | 'closed' | 'draft',
    featured: false,
    remote: false,
  })

  useEffect(() => {
    fetchJob()
  }, [])

  const fetchJob = async () => {
    try {
      const response = await fetch(`/api/careers/${id}`)
      const data = await response.json()

      if (data.success) {
        const job = data.data
        setFormData({
          title: job.title,
          department: job.department,
          location: job.location,
          type: job.type,
          experience: job.experience,
          salary: job.salary || "",
          description: job.description,
          responsibilities: job.responsibilities?.join("\n") || "",
          requirements: job.requirements?.join("\n") || "",
          niceToHave: job.niceToHave?.join("\n") || "",
          benefits: job.benefits?.join("\n") || "",
          status: job.status || "active",
          featured: job.featured,
          remote: job.remote,
        })
      } else {
        toast.error("Failed to fetch job posting")
      }
    } catch (error) {
      console.error("Error fetching job:", error)
      toast.error("Failed to fetch job posting")
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const responsibilitiesArray = formData.responsibilities.split("\n").map(item => item.trim()).filter(item => item)
      const requirementsArray = formData.requirements.split("\n").map(item => item.trim()).filter(item => item)
      const niceToHaveArray = formData.niceToHave.split("\n").map(item => item.trim()).filter(item => item)
      const benefitsArray = formData.benefits.split("\n").map(item => item.trim()).filter(item => item)

      const response = await fetch(`/api/careers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          responsibilities: responsibilitiesArray,
          requirements: requirementsArray,
          niceToHave: niceToHaveArray,
          benefits: benefitsArray,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Job posting updated successfully!")
        router.push("/admin/careers")
      } else {
        toast.error(data.error || "Failed to update job posting")
      }
    } catch (error) {
      console.error("Error updating job:", error)
      toast.error("Failed to update job posting")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/admin/careers">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Careers
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Job Posting</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Employment Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full Time</SelectItem>
                    <SelectItem value="part-time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Experience */}
              <div className="space-y-2">
                <Label htmlFor="experience">Experience Required *</Label>
                <Input
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  required
                />
              </div>

              {/* Salary */}
              <div className="space-y-2">
                <Label htmlFor="salary">Salary Range</Label>
                <Input
                  id="salary"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
              />
            </div>

            {/* Responsibilities */}
            <div className="space-y-2">
              <Label htmlFor="responsibilities">Key Responsibilities (one per line) *</Label>
              <Textarea
                id="responsibilities"
                value={formData.responsibilities}
                onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                rows={6}
                required
              />
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements (one per line) *</Label>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                rows={6}
                required
              />
            </div>

            {/* Nice to Have */}
            <div className="space-y-2">
              <Label htmlFor="niceToHave">Nice to Have (one per line)</Label>
              <Textarea
                id="niceToHave"
                value={formData.niceToHave}
                onChange={(e) => setFormData({ ...formData, niceToHave: e.target.value })}
                rows={4}
              />
            </div>

            {/* Benefits */}
            <div className="space-y-2">
              <Label htmlFor="benefits">Benefits & Perks (one per line)</Label>
              <Textarea
                id="benefits"
                value={formData.benefits}
                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                rows={4}
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Job Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'active' | 'closed' | 'draft') => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active (Visible on website)</SelectItem>
                  <SelectItem value="draft">Draft (Not visible)</SelectItem>
                  <SelectItem value="closed">Closed (No longer accepting)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Only "Active" jobs will be visible on the homepage and careers page
              </p>
            </div>

            {/* Checkboxes */}
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <span>Featured (Highlight on careers page)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.remote}
                  onChange={(e) => setFormData({ ...formData, remote: e.target.checked })}
                  className="w-4 h-4"
                />
                <span>Remote Available</span>
              </label>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="gap-2">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Update Job Posting
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
