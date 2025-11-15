"use client"

import { useState } from "react"
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

export default function CreateCareerPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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
    active: true,
    featured: false,
    remote: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Convert comma-separated strings to arrays
      const responsibilitiesArray = formData.responsibilities.split("\n").map(item => item.trim()).filter(item => item)
      const requirementsArray = formData.requirements.split("\n").map(item => item.trim()).filter(item => item)
      const niceToHaveArray = formData.niceToHave.split("\n").map(item => item.trim()).filter(item => item)
      const benefitsArray = formData.benefits.split("\n").map(item => item.trim()).filter(item => item)

      const response = await fetch("/api/careers", {
        method: "POST",
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
        toast.success("Job posting created successfully!")
        router.push("/admin/careers")
      } else {
        toast.error(data.error || "Failed to create job posting")
      }
    } catch (error) {
      console.error("Error creating job:", error)
      toast.error("Failed to create job posting")
    } finally {
      setLoading(false)
    }
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
          <CardTitle>Create New Job Posting</CardTitle>
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
                placeholder="e.g. Senior Full Stack Developer"
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
                placeholder="e.g. Engineering, Design, Marketing"
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
                  placeholder="e.g. Dhaka, Bangladesh"
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
                  placeholder="e.g. 3-5 years"
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
                  placeholder="e.g. ৳50,000 - ৳80,000"
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
                placeholder="Describe the role and what the candidate will be doing..."
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
                placeholder="Lead development of new features&#10;Mentor junior developers&#10;Code review and quality assurance"
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
                placeholder="5+ years of React experience&#10;Strong TypeScript skills&#10;Experience with Next.js"
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
                placeholder="Experience with GraphQL&#10;Cloud platform experience&#10;Open source contributions"
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
                placeholder="Competitive salary&#10;Health insurance&#10;Flexible working hours&#10;Remote work options"
                rows={4}
              />
            </div>

            {/* Checkboxes */}
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4"
                />
                <span>Active</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <span>Featured</span>
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
                Create Job Posting
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
