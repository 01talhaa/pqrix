"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X, Upload, Loader2 } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

interface ProjectFormData {
  id: string
  title: string
  category: string
  description: string
  client: string
  year: string
  duration: number
  budget: string
  status: "Completed" | "In Progress" | "On Hold"
  images: string[]
  tags: string[]
  deliverables: string[]
  results: string[]
  metrics: { label: string; value: string }[]
  challenges: string[]
  solutions: string[]
  technologies: string[]
  timeline: { phase: string; duration: string; description: string }[]
  awards: string[]
  links: { label: string; url: string }[]
  testimonial: {
    quote: string
    author: string
    role: string
    company: string
    avatar: string
  }
}

interface ProjectFormProps {
  projectId?: string
  initialData?: Partial<ProjectFormData>
}

export default function ProjectForm({ projectId, initialData }: ProjectFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState<ProjectFormData>({
    id: "",
    title: "",
    category: "",
    description: "",
    client: "",
    year: new Date().getFullYear().toString(),
    duration: 0,
    budget: "",
    status: "In Progress",
    images: [],
    tags: [],
    deliverables: [],
    results: [],
    metrics: [],
    challenges: [],
    solutions: [],
    technologies: [],
    timeline: [],
    awards: [],
    links: [],
    testimonial: {
      quote: "",
      author: "",
      role: "",
      company: "",
      avatar: "",
    },
    ...initialData,
  })

  // Load project data if editing
  useEffect(() => {
    if (projectId && !initialData) {
      fetchProject()
    }
  }, [projectId])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`)
      const data = await response.json()

      if (data.success) {
        setFormData(data.data)
      } else {
        toast.error("Failed to load project")
      }
    } catch (error) {
      console.error("Error loading project:", error)
      toast.error("An error occurred while loading the project")
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      const formData = new FormData()
      Array.from(files).forEach((file) => {
        formData.append("files", file)
      })

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...data.data],
        }))
        toast.success(`${files.length} image(s) uploaded successfully`)
      } else {
        toast.error(data.error || "Failed to upload images")
      }
    } catch (error) {
      console.error("Error uploading images:", error)
      toast.error("An error occurred while uploading images")
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const addArrayItem = (field: keyof ProjectFormData, value: string) => {
    if (!value.trim()) return

    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] as string[]), value.trim()],
    }))
  }

  const removeArrayItem = (field: keyof ProjectFormData, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }))
  }

  const addMetric = (label: string, value: string) => {
    if (!label.trim() || !value.trim()) return

    setFormData((prev) => ({
      ...prev,
      metrics: [...prev.metrics, { label: label.trim(), value: value.trim() }],
    }))
  }

  const removeMetric = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      metrics: prev.metrics.filter((_, i) => i !== index),
    }))
  }

  const addTimelinePhase = (phase: string, duration: string, description: string) => {
    if (!phase.trim() || !duration.trim() || !description.trim()) return

    setFormData((prev) => ({
      ...prev,
      timeline: [
        ...prev.timeline,
        { phase: phase.trim(), duration: duration.trim(), description: description.trim() },
      ],
    }))
  }

  const removeTimelinePhase = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      timeline: prev.timeline.filter((_, i) => i !== index),
    }))
  }

  const addLink = (label: string, url: string) => {
    if (!label.trim() || !url.trim()) return

    setFormData((prev) => ({
      ...prev,
      links: [...prev.links, { label: label.trim(), url: url.trim() }],
    }))
  }

  const removeLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.id) {
      toast.error("Please provide a project ID")
      return
    }

    if (!formData.title || !formData.category || !formData.description) {
      toast.error("Please fill in all required fields")
      return
    }

    if (formData.images.length === 0) {
      toast.error("Please upload at least one image")
      return
    }

    setLoading(true)
    try {
      const url = projectId ? `/api/projects/${projectId}` : "/api/projects"
      const method = projectId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast.success(`Project ${projectId ? "updated" : "created"} successfully`)
        router.push("/admin/projects")
      } else {
        toast.error(data.error || `Failed to ${projectId ? "update" : "create"} project`)
      }
    } catch (error) {
      console.error("Error saving project:", error)
      toast.error("An error occurred while saving the project")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="id">Project ID (URL-friendly) *</Label>
            <Input
              id="id"
              value={formData.id}
              onChange={(e) => {
                // Auto-generate URL-friendly ID from input
                const urlFriendlyId = e.target.value
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/^-+|-+$/g, '')
                setFormData({ ...formData, id: urlFriendlyId })
              }}
              placeholder="e.g., modern-ecommerce-platform"
              required
              disabled={!!projectId}
              className={projectId ? "opacity-50 cursor-not-allowed" : ""}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Will be used in URL: /projects/{formData.id || "your-project-id"}
              {projectId && " (Cannot be changed after creation)"}
            </p>
          </div>

          <div>
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Brand Identity, Mobile App"
                required
              />
            </div>

            <div>
              <Label htmlFor="client">Client</Label>
              <Input
                id="client"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                placeholder="Client name"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="2024"
                required
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration (weeks)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div>
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder="e.g., ৳50,000 - ৳75,000"
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "Completed" | "In Progress" | "On Hold") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>Project Images *</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="images" className="cursor-pointer">
              <div className="flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
                {uploading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload images (multiple files allowed)
                    </p>
                  </div>
                )}
              </div>
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </Label>
          </div>

          {formData.images.length > 0 && (
            <div className="grid grid-cols-4 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="relative h-32 w-full overflow-hidden rounded-lg border">
                    <Image src={image} alt={`Project image ${index + 1}`} fill className="object-cover" />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Array Fields */}
      <ArrayFieldCard
        title="Tags"
        items={formData.tags}
        onAdd={(value) => addArrayItem("tags", value)}
        onRemove={(index) => removeArrayItem("tags", index)}
        placeholder="Enter a tag (e.g., 3D Animation)"
      />

      <ArrayFieldCard
        title="Deliverables"
        items={formData.deliverables}
        onAdd={(value) => addArrayItem("deliverables", value)}
        onRemove={(index) => removeArrayItem("deliverables", index)}
        placeholder="Enter a deliverable"
      />

      <ArrayFieldCard
        title="Results"
        items={formData.results}
        onAdd={(value) => addArrayItem("results", value)}
        onRemove={(index) => removeArrayItem("results", index)}
        placeholder="Enter a result"
      />

      <ArrayFieldCard
        title="Technologies"
        items={formData.technologies}
        onAdd={(value) => addArrayItem("technologies", value)}
        onRemove={(index) => removeArrayItem("technologies", index)}
        placeholder="Enter a technology (e.g., Blender)"
      />

      <ArrayFieldCard
        title="Challenges"
        items={formData.challenges}
        onAdd={(value) => addArrayItem("challenges", value)}
        onRemove={(index) => removeArrayItem("challenges", index)}
        placeholder="Enter a challenge"
      />

      <ArrayFieldCard
        title="Solutions"
        items={formData.solutions}
        onAdd={(value) => addArrayItem("solutions", value)}
        onRemove={(index) => removeArrayItem("solutions", index)}
        placeholder="Enter a solution"
      />

      <ArrayFieldCard
        title="Awards"
        items={formData.awards}
        onAdd={(value) => addArrayItem("awards", value)}
        onRemove={(index) => removeArrayItem("awards", index)}
        placeholder="Enter an award"
      />

      {/* Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Key Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <MetricInput onAdd={addMetric} />
          <div className="space-y-2">
            {formData.metrics.map((metric, index) => (
              <div key={index} className="flex items-center gap-2 rounded-lg border p-3">
                <div className="flex-1">
                  <span className="font-medium">{metric.label}:</span> {metric.value}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeMetric(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Project Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TimelineInput onAdd={addTimelinePhase} />
          <div className="space-y-2">
            {formData.timeline.map((phase, index) => (
              <div key={index} className="rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium">{phase.phase}</div>
                    <div className="text-sm text-muted-foreground">{phase.duration}</div>
                    <p className="mt-1 text-sm">{phase.description}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTimelinePhase(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Links */}
      <Card>
        <CardHeader>
          <CardTitle>Project Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <LinkInput onAdd={addLink} />
          <div className="space-y-2">
            {formData.links.map((link, index) => (
              <div key={index} className="flex items-center gap-2 rounded-lg border p-3">
                <div className="flex-1">
                  <span className="font-medium">{link.label}:</span>{" "}
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {link.url}
                  </a>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeLink(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Testimonial */}
      <Card>
        <CardHeader>
          <CardTitle>Client Testimonial</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="testimonial-quote">Quote</Label>
            <Textarea
              id="testimonial-quote"
              value={formData.testimonial.quote}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  testimonial: { ...formData.testimonial, quote: e.target.value },
                })
              }
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="testimonial-author">Author</Label>
              <Input
                id="testimonial-author"
                value={formData.testimonial.author}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    testimonial: { ...formData.testimonial, author: e.target.value },
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="testimonial-role">Role</Label>
              <Input
                id="testimonial-role"
                value={formData.testimonial.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    testimonial: { ...formData.testimonial, role: e.target.value },
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="testimonial-company">Company</Label>
              <Input
                id="testimonial-company"
                value={formData.testimonial.company}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    testimonial: { ...formData.testimonial, company: e.target.value },
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="testimonial-avatar">Avatar URL</Label>
              <Input
                id="testimonial-avatar"
                value={formData.testimonial.avatar}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    testimonial: { ...formData.testimonial, avatar: e.target.value },
                  })
                }
                placeholder="https://..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex gap-4">
        <Button type="submit" size="lg" disabled={loading || uploading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>{projectId ? "Update Project" : "Create Project"}</>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.push("/admin/projects")}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}

// Helper Components
function ArrayFieldCard({
  title,
  items,
  onAdd,
  onRemove,
  placeholder,
}: {
  title: string
  items: string[]
  onAdd: (value: string) => void
  onRemove: (index: number) => void
  placeholder: string
}) {
  const [inputValue, setInputValue] = useState("")

  const handleAdd = () => {
    onAdd(inputValue)
    setInputValue("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAdd()
              }
            }}
          />
          <Button type="button" onClick={handleAdd}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1"
            >
              <span className="text-sm">{item}</span>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function MetricInput({ onAdd }: { onAdd: (label: string, value: string) => void }) {
  const [label, setLabel] = useState("")
  const [value, setValue] = useState("")

  const handleAdd = () => {
    onAdd(label, value)
    setLabel("")
    setValue("")
  }

  return (
    <div className="flex gap-2">
      <Input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Label (e.g., Revenue Increase)"
      />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Value (e.g., +45%)"
      />
      <Button type="button" onClick={handleAdd}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}

function TimelineInput({
  onAdd,
}: {
  onAdd: (phase: string, duration: string, description: string) => void
}) {
  const [phase, setPhase] = useState("")
  const [duration, setDuration] = useState("")
  const [description, setDescription] = useState("")

  const handleAdd = () => {
    onAdd(phase, duration, description)
    setPhase("")
    setDuration("")
    setDescription("")
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <Input
          value={phase}
          onChange={(e) => setPhase(e.target.value)}
          placeholder="Phase name (e.g., Discovery)"
        />
        <Input
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Duration (e.g., 2 weeks)"
        />
      </div>
      <div className="flex gap-2">
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Phase description"
          rows={2}
        />
        <Button type="button" onClick={handleAdd}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function LinkInput({ onAdd }: { onAdd: (label: string, url: string) => void }) {
  const [label, setLabel] = useState("")
  const [url, setUrl] = useState("")

  const handleAdd = () => {
    onAdd(label, url)
    setLabel("")
    setUrl("")
  }

  return (
    <div className="flex gap-2">
      <Input
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Label (e.g., Live Website)"
      />
      <Input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="URL (https://...)"
      />
      <Button type="button" onClick={handleAdd}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}
