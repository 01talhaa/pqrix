"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus, Eye, EyeOff, ChevronUp, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface CaseStudy {
  _id: string
  title: string
  industry: string
  clientType: string
  challenge: string
  solution: string
  result: string
  image?: string
  metrics?: { label: string; value: string }[]
  technologies?: string[]
  isActive: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export default function CaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  const fetchCaseStudies = async () => {
    try {
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/case-studies?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      if (data.success) {
        setCaseStudies(data.data)
      } else {
        console.error('Failed to fetch case studies:', data.message)
      }
    } catch (error) {
      console.error("Error fetching case studies:", error)
      alert('Failed to load case studies. Please try refreshing the page.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCaseStudies()
  }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    
    setDeleting(true)
    try {
      const response = await fetch(`/api/case-studies?id=${deleteId}`, {
        method: "DELETE",
      })
      const data = await response.json()
      
      if (data.success) {
        setCaseStudies(caseStudies.filter((cs) => cs._id !== deleteId))
        setDeleteId(null)
      } else {
        alert(data.message || "Failed to delete case study")
      }
    } catch (error) {
      console.error("Error deleting case study:", error)
      alert("Failed to delete case study")
    } finally {
      setDeleting(false)
    }
  }

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch("/api/case-studies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      })
      const data = await response.json()
      
      if (data.success) {
        fetchCaseStudies()
      }
    } catch (error) {
      console.error("Error toggling case study status:", error)
    }
  }

  const updateOrder = async (id: string, newOrder: number) => {
    try {
      const response = await fetch("/api/case-studies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, order: newOrder }),
      })
      const data = await response.json()
      
      if (data.success) {
        fetchCaseStudies()
      }
    } catch (error) {
      console.error("Error updating order:", error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Case Studies</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 rounded-lg bg-gray-200 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Case Studies</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your case studies and success stories
          </p>
        </div>
        <Link href="/admin/case-studies/new">
          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Case Study
          </Button>
        </Link>
      </div>

      {caseStudies.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No case studies found. Create your first one!
            </p>
            <Link href="/admin/case-studies/new">
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="mr-2 h-4 w-4" />
                Create Case Study
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((caseStudy) => (
            <Card key={caseStudy._id} className="relative overflow-hidden">
              {caseStudy.image && (
                <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={caseStudy.image}
                    alt={caseStudy.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg line-clamp-2">{caseStudy.title}</CardTitle>
                  <Badge variant={caseStudy.isActive ? "default" : "secondary"}>
                    {caseStudy.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {caseStudy.industry}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {caseStudy.clientType}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="font-semibold text-gray-700 dark:text-gray-300">Challenge:</p>
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                      {caseStudy.challenge}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700 dark:text-gray-300">Result:</p>
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                      {caseStudy.result}
                    </p>
                  </div>
                </div>

                {caseStudy.metrics && caseStudy.metrics.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {caseStudy.metrics.slice(0, 2).map((metric, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {metric.label}: {metric.value}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateOrder(caseStudy._id, caseStudy.order - 1)}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateOrder(caseStudy._id, caseStudy.order + 1)}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2 ml-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleActive(caseStudy._id, caseStudy.isActive)}
                    >
                      {caseStudy.isActive ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Link href={`/admin/case-studies/edit/${caseStudy._id}`}>
                      <Button size="sm" variant="outline">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeleteId(caseStudy._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Case Study</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this case study? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
