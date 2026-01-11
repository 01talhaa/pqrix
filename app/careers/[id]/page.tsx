"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Briefcase, Clock, DollarSign, CheckCircle, ArrowLeft, Upload } from "lucide-react"
import Link from "next/link"
import { useClientAuth } from "@/lib/client-auth"
import type { JobPostingDocument } from "@/lib/models/JobPosting"

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { client: user } = useClientAuth()
  const [job, setJob] = useState<JobPostingDocument | null>(null)
  const [loading, setLoading] = useState(true)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [applying, setApplying] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    applicantName: "",
    applicantEmail: "",
    applicantPhone: "",
    resumeUrl: "",
    coverLetter: "",
    portfolioUrl: "",
    linkedinUrl: "",
    githubUrl: "",
    yearsOfExperience: 0,
    currentCompany: "",
    expectedSalary: 0,
    noticePeriod: "",
  })

  useEffect(() => {
    fetchJob()
  }, [params.id])

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        applicantName: user.name || "",
        applicantEmail: user.email || "",
      }))
      checkIfApplied()
    }
  }, [user, params.id])

  const fetchJob = async () => {
    try {
      const response = await fetch(`/api/careers/${params.id}`)
      const data = await response.json()
      if (data.success) {
        setJob(data.data)
      }
    } catch (error) {
      console.error("Error fetching job:", error)
    } finally {
      setLoading(false)
    }
  }

  const checkIfApplied = async () => {
    if (!user) return
    try {
      const response = await fetch(`/api/applications?userId=${user.id}&jobId=${params.id}`)
      const data = await response.json()
      if (data.success && data.data.length > 0) {
        setHasApplied(true)
      }
    } catch (error) {
      console.error("Error checking application:", error)
    }
  }

  const handleApplyClick = () => {
    if (!user) {
      router.push(`/client/login?redirect=/careers/${params.id}`)
      return
    }
    setShowApplyModal(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !job) return

    // Validate resume
    if (!resumeFile && !formData.resumeUrl) {
      alert("Please upload a resume or provide a resume URL")
      return
    }

    setApplying(true)

    try {
      let resumeUrl = formData.resumeUrl

      // Upload resume file if provided
      if (resumeFile) {
        const uploadFormData = new FormData()
        uploadFormData.append("file", resumeFile)

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        })

        const uploadData = await uploadResponse.json()
        
        if (uploadData.success) {
          resumeUrl = uploadData.data.url
        } else {
          alert("Failed to upload resume")
          setApplying(false)
          return
        }
      }

      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job.id,
          userId: user.id,
          ...formData,
          resumeUrl,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setHasApplied(true)
        setShowApplyModal(false)
        alert("Application submitted successfully!")
      } else {
        alert(data.error || "Failed to submit application")
      }
    } catch (error) {
      console.error("Error submitting application:", error)
      alert("Failed to submit application")
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500" />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-16 text-center bg-black min-h-screen">
        <h1 className="text-2xl font-bold mb-4 text-white">Job Not Found</h1>
        <Link href="/careers">
          <Button>Back to Careers</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/careers" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Careers
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="liquid-glass border border-red-500/20 bg-black/40 backdrop-blur-xl">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold mb-4 text-white">{job.title}</h1>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className="bg-gradient-to-r from-blue-600 to-blue-800 text-white border-0">{job.department}</Badge>
                      <Badge className="bg-gradient-to-r from-purple-600 to-purple-800 text-white border-0 capitalize">{job.type.replace("-", " ")}</Badge>
                      {job.remote && <Badge className="bg-gradient-to-r from-red-600 to-red-800 text-white border-0">Remote</Badge>}
                      {job.featured && <Badge className="bg-yellow-500 text-white border-0">Featured</Badge>}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-8">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    <span>{job.experience}</span>
                  </div>
                  {job.salaryRange && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span>
                        {job.salaryRange.currency} {job.salaryRange.min.toLocaleString()} - {job.salaryRange.max.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4 text-white">About the Role</h2>
                  <p className="text-gray-300 whitespace-pre-wrap">{job.description}</p>
                </div>

                {/* Responsibilities */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4 text-white">Responsibilities</h2>
                  <ul className="space-y-2">
                    {job.responsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Requirements */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4 text-white">Requirements</h2>
                  <ul className="space-y-2">
                    {job.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Nice to Have */}
                {job.niceToHave && job.niceToHave.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4 text-white">Nice to Have</h2>
                    <ul className="space-y-2">
                      {job.niceToHave.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Benefits */}
                {job.benefits && job.benefits.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-4 text-white">Benefits</h2>
                    <ul className="space-y-2">
                      {job.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 liquid-glass border border-red-500/20 bg-black/40 backdrop-blur-xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4 text-white">Apply for this position</h3>
                
                {hasApplied ? (
                  <div className="text-center py-4">
                    <CheckCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
                    <p className="font-semibold text-red-400 mb-2">Application Submitted!</p>
                    <p className="text-sm text-gray-400 mb-4">
                      You have already applied for this position. Check your dashboard for updates.
                    </p>
                    <Link href="/client/dashboard">
                      <Button variant="outline" className="w-full">
                        View Dashboard
                      </Button>
                    </Link>
                  </div>
                ) : job.status !== "active" ? (
                  <div className="text-center py-4">
                    <p className="text-gray-400">
                      This position is currently closed.
                    </p>
                  </div>
                ) : (
                  <Button onClick={handleApplyClick} className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900" size="lg">
                    Apply Now
                  </Button>
                )}

                <div className="mt-6 pt-6 border-t border-red-500/20">
                  <p className="text-sm text-gray-400 mb-2">
                    <strong>{job.applicationsCount}</strong> applications received
                  </p>
                  {job.applicationDeadline && (
                    <p className="text-sm text-gray-400">
                      Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <Dialog open={showApplyModal} onOpenChange={setShowApplyModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Apply for {job.title}</DialogTitle>
            <DialogDescription>
              Fill out the application form below. All fields marked with * are required.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.applicantName}
                  onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.applicantEmail}
                  onChange={(e) => setFormData({ ...formData, applicantEmail: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.applicantPhone}
                  onChange={(e) => setFormData({ ...formData, applicantPhone: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="experience">Years of Experience *</Label>
                <Input
                  id="experience"
                  type="number"
                  value={formData.yearsOfExperience}
                  onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="resume">
                Resume/CV * 
                <span className="text-xs text-gray-500 ml-2">
                  (Upload PDF or provide URL to Google Drive/Dropbox)
                </span>
              </Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    id="resume-file"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  <Upload className="h-4 w-4 text-gray-400" />
                </div>
                <div className="text-xs text-gray-500 text-center">OR</div>
                <Input
                  id="resume-url"
                  type="url"
                  value={formData.resumeUrl}
                  onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                  placeholder="https://drive.google.com/..."
                  disabled={!!resumeFile}
                />
                {resumeFile && (
                  <p className="text-sm text-green-600">
                    File selected: {resumeFile.name}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="coverLetter">Cover Letter *</Label>
              <Textarea
                id="coverLetter"
                value={formData.coverLetter}
                onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                rows={6}
                placeholder="Tell us why you're a great fit for this role..."
                required
              />
            </div>

            <div>
              <Label htmlFor="portfolio">Portfolio URL (optional)</Label>
              <Input
                id="portfolio"
                type="url"
                value={formData.portfolioUrl}
                onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                placeholder="https://yourportfolio.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="linkedin">LinkedIn URL (optional)</Label>
                <Input
                  id="linkedin"
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div>
                <Label htmlFor="github">GitHub URL (optional)</Label>
                <Input
                  id="github"
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  placeholder="https://github.com/..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentCompany">Current Company (optional)</Label>
                <Input
                  id="currentCompany"
                  value={formData.currentCompany}
                  onChange={(e) => setFormData({ ...formData, currentCompany: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="noticePeriod">Notice Period (optional)</Label>
                <Input
                  id="noticePeriod"
                  value={formData.noticePeriod}
                  onChange={(e) => setFormData({ ...formData, noticePeriod: e.target.value })}
                  placeholder="e.g., 1 month"
                />
              </div>
            </div>

            {job.salaryRange && (
              <div>
                <Label htmlFor="expectedSalary">Expected Salary ({job.salaryRange.currency}) (optional)</Label>
                <Input
                  id="expectedSalary"
                  type="number"
                  value={formData.expectedSalary}
                  onChange={(e) => setFormData({ ...formData, expectedSalary: parseInt(e.target.value) })}
                />
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowApplyModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={applying} className="flex-1">
                {applying ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
