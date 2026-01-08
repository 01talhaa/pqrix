"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Plus, X, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import ImageUpload from "@/components/image-upload"

export default function EditCaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [caseStudyId, setCaseStudyId] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    industry: "",
    clientType: "",
    challenge: "",
    solution: "",
    result: "",
    image: "",
    isActive: true,
    order: 0,
  })
  const [metrics, setMetrics] = useState<{ label: string; value: string }[]>([])
  const [technologies, setTechnologies] = useState<string[]>([])
  const [techInput, setTechInput] = useState("")

  useEffect(() => {
    const fetchCaseStudy = async () => {
      try {
        const resolvedParams = await params
        const id = resolvedParams.id
        setCaseStudyId(id)
        
        const response = await fetch(`/api/case-studies?id=${id}`)
        const data = await response.json()
        
        if (data.success) {
          const cs = data.data
          setFormData({
            title: cs.title,
            industry: cs.industry,
            clientType: cs.clientType,
            challenge: cs.challenge,
            solution: cs.solution,
            result: cs.result,
            image: cs.image || "",
            isActive: cs.isActive,
            order: cs.order,
          })
          setMetrics(cs.metrics || [])
          setTechnologies(cs.technologies || [])
        } else {
          alert("Case study not found")
          router.push("/admin/case-studies")
        }
      } catch (error) {
        console.error("Error fetching case study:", error)
        alert("Failed to load case study")
      } finally {
        setLoading(false)
      }
    }

    fetchCaseStudy()
  }, [params, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch("/api/case-studies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: caseStudyId,
          ...formData,
          metrics,
          technologies,
        }),
      })

      const data = await response.json()

      if (data.success) {
        router.push("/admin/case-studies")
        router.refresh()
      } else {
        alert(data.message || "Failed to update case study")
      }
    } catch (error) {
      console.error("Error updating case study:", error)
      alert("Failed to update case study")
    } finally {
      setSubmitting(false)
    }
  }

  const addMetric = () => {
    setMetrics([...metrics, { label: "", value: "" }])
  }

  const updateMetric = (index: number, field: "label" | "value", value: string) => {
    const updated = [...metrics]
    updated[index][field] = value
    setMetrics(updated)
  }

  const removeMetric = (index: number) => {
    setMetrics(metrics.filter((_, i) => i !== index))
  }

  const addTechnology = () => {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      setTechnologies([...technologies, techInput.trim()])
      setTechInput("")
    }
  }

  const removeTechnology = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading case study...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/case-studies">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Case Study</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Update case study information
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="E.g., E-commerce Platform Redesign"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="industry">Industry *</Label>
                    <Input
                      id="industry"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      placeholder="E.g., Healthcare, Fintech"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientType">Client Type *</Label>
                    <Input
                      id="clientType"
                      value={formData.clientType}
                      onChange={(e) => setFormData({ ...formData, clientType: e.target.value })}
                      placeholder="E.g., Startup, Enterprise"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Case Study Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="challenge">The Challenge *</Label>
                  <Textarea
                    id="challenge"
                    value={formData.challenge}
                    onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                    placeholder="Describe the client's problem or challenge..."
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="solution">Our Solution *</Label>
                  <Textarea
                    id="solution"
                    value={formData.solution}
                    onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                    placeholder="Describe what you built and how..."
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="result">The Result *</Label>
                  <Textarea
                    id="result"
                    value={formData.result}
                    onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                    placeholder="Performance improvements, user growth, efficiency gains..."
                    rows={4}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Metrics & Technologies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label>Key Metrics</Label>
                    <Button type="button" size="sm" variant="outline" onClick={addMetric}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Metric
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {metrics.map((metric, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Label (e.g., Revenue Growth)"
                          value={metric.label}
                          onChange={(e) => updateMetric(index, "label", e.target.value)}
                        />
                        <Input
                          placeholder="Value (e.g., +150%)"
                          value={metric.value}
                          onChange={(e) => updateMetric(index, "value", e.target.value)}
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => removeMetric(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="technologies">Technologies Used</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="technologies"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTechnology())}
                      placeholder="Add technology (press Enter)"
                    />
                    <Button type="button" onClick={addTechnology} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {technologies.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechnology(tech)}
                          className="hover:text-red-900 dark:hover:text-red-200"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  onRemove={() => setFormData({ ...formData, image: "" })}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="isActive">Active</Label>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                </div>

                <div>
                  <Label htmlFor="order">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={submitting}>
                  {submitting ? "Updating..." : "Update Case Study"}
                </Button>
                <Link href="/admin/case-studies">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
