"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader2, Star, CheckCircle2, X, Trash2, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { TestimonialDocument } from "@/lib/models/Testimonial"

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [approving, setApproving] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/testimonials?admin=true", {
        cache: 'no-store',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      const data = await response.json()
      console.log("Fetched testimonials:", data)
      if (data.success) {
        setTestimonials(data.data)
        console.log("Set testimonials state:", data.data)
      } else {
        console.error("Failed to fetch testimonials:", data)
        toast({
          title: "Error",
          description: "Failed to fetch testimonials",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error)
      toast({
        title: "Error",
        description: "An error occurred while fetching testimonials",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApproveToggle = async (id: string, currentStatus: boolean) => {
    setApproving(id)
    try {
      const response = await fetch(`/api/testimonials/${id}?admin=true`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          approved: !currentStatus,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: `Testimonial ${!currentStatus ? "approved" : "rejected"} successfully`,
        })
        
        // Update the testimonials list locally without refetching
        setTestimonials(testimonials.map(t => 
          t.id === id ? { ...t, approved: !currentStatus } : t
        ))
        
        // Trigger event for home page to update
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('testimonial-approved'))
        }
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update testimonial",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating testimonial:", error)
      toast({
        title: "Error",
        description: "An error occurred while updating testimonial",
        variant: "destructive",
      })
    } finally {
      setApproving(null)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/testimonials/${id}?admin=true`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Testimonial deleted successfully",
        })
        
        // Remove the deleted testimonial from the list locally
        setTestimonials(testimonials.filter(t => t.id !== id))
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete testimonial",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting testimonial:", error)
      toast({
        title: "Error",
        description: "An error occurred while deleting testimonial",
        variant: "destructive",
      })
    }
  }

  const pendingCount = testimonials.filter((t) => !t.approved).length
  const approvedCount = testimonials.filter((t) => t.approved).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Testimonials</h1>
          <p className="text-white/60 mt-2">Manage client reviews and testimonials</p>
        </div>
        <div className="flex gap-4">
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50 text-lg px-4 py-2">
            {pendingCount} Pending
          </Badge>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/50 text-lg px-4 py-2">
            {approvedCount} Approved
          </Badge>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-lime-400" />
        </div>
      ) : testimonials.length === 0 ? (
        <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-16 w-16 text-white/20 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No testimonials yet</h3>
            <p className="text-white/60 text-center">
              Testimonials will appear here when clients submit reviews
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border-white/10 bg-black/40 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {testimonial.clientImage ? (
                      <img
                        src={testimonial.clientImage}
                        alt={testimonial.clientName}
                        className="h-12 w-12 rounded-full object-cover border-2 border-lime-400"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-lime-400/20 flex items-center justify-center border-2 border-lime-400">
                        <span className="text-lime-400 font-bold">
                          {testimonial.clientName.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-lg text-white">{testimonial.clientName}</CardTitle>
                      <p className="text-sm text-white/60">{testimonial.clientEmail}</p>
                    </div>
                  </div>
                  <Badge
                    className={
                      testimonial.approved
                        ? "bg-green-500/20 text-green-400 border-green-500/50"
                        : "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                    }
                  >
                    {testimonial.approved ? "Approved" : "Pending"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Rating */}
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating
                          ? "fill-lime-400 text-lime-400"
                          : "text-white/40"
                      }`}
                    />
                  ))}
                </div>

                {/* Review */}
                <p className="text-white/90 text-sm leading-relaxed mb-4">
                  &ldquo;{testimonial.review}&rdquo;
                </p>

                {/* Additional Images */}
                {testimonial.images && testimonial.images.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-white/60 mb-2">
                      {testimonial.images.length} {testimonial.images.length === 1 ? 'image' : 'images'} attached
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {testimonial.images.map((image, idx) => (
                        <img
                          key={idx}
                          src={image}
                          alt={`Review image ${idx + 1}`}
                          className="h-16 w-16 rounded-lg object-cover border border-lime-400/30 hover:border-lime-400 transition-colors cursor-pointer"
                          onClick={() => window.open(image, '_blank')}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Date */}
                <p className="text-xs text-white/60 mb-4">
                  {new Date(testimonial.createdAt).toLocaleDateString()}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant={testimonial.approved ? "outline" : "default"}
                    className={
                      testimonial.approved
                        ? "flex-1"
                        : "flex-1 bg-green-500 hover:bg-green-600 text-white"
                    }
                    onClick={() => handleApproveToggle(testimonial.id, testimonial.approved)}
                    disabled={approving === testimonial.id}
                  >
                    {approving === testimonial.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : testimonial.approved ? (
                      <>
                        <X className="mr-2 h-4 w-4" />
                        Reject
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Approve
                      </>
                    )}
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Testimonial?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this testimonial? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(testimonial.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
