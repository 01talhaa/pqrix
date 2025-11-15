"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useClientAuth } from "@/lib/client-auth"
import { ServiceBookingDocument } from "@/lib/models/ServiceBooking"
import { TestimonialDocument } from "@/lib/models/Testimonial"
import { 
  FolderKanban, 
  Clock, 
  CheckCircle2, 
  Upload,
  Loader2,
  ArrowLeft,
  Briefcase,
  Package,
  Star,
  MessageSquare,
  MapPin,
  Calendar,
  FileText,
  ExternalLink
} from "lucide-react"
import { toast } from "sonner"

export default function ClientDashboard() {
  const router = useRouter()
  const { client, isAuthenticated, isLoading, updateClient } = useClientAuth()
  const [uploading, setUploading] = useState(false)
  const [bookings, setBookings] = useState<ServiceBookingDocument[]>([])
  const [loadingBookings, setLoadingBookings] = useState(true)
  const [testimonials, setTestimonials] = useState<TestimonialDocument[]>([])
  const [loadingTestimonials, setLoadingTestimonials] = useState(true)
  const [submittingTestimonial, setSubmittingTestimonial] = useState(false)
  const [testimonialImages, setTestimonialImages] = useState<string[]>([])
  const [uploadingTestimonialImage, setUploadingTestimonialImage] = useState(false)
  const [testimonialForm, setTestimonialForm] = useState({
    rating: 5,
    review: ""
  })
  const [applications, setApplications] = useState<any[]>([])
  const [loadingApplications, setLoadingApplications] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/client/login")
    } else if (client) {
      fetchBookings()
      fetchTestimonials()
      fetchApplications()
    }
  }, [isAuthenticated, isLoading, router, client])

  const fetchBookings = async () => {
    if (!client) return
    
    setLoadingBookings(true)
    try {
      const response = await fetch(`/api/bookings?clientId=${client.id}`)
      const data = await response.json()
      if (data.success) {
        setBookings(data.data)
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setLoadingBookings(false)
    }
  }

  const fetchTestimonials = async () => {
    if (!client) return
    
    setLoadingTestimonials(true)
    try {
      const response = await fetch(`/api/testimonials`)
      const data = await response.json()
      if (data.success) {
        // Filter to show only client's own testimonials
        const clientTestimonials = data.data.filter((t: TestimonialDocument) => t.clientEmail === client.email)
        setTestimonials(clientTestimonials)
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error)
    } finally {
      setLoadingTestimonials(false)
    }
  }

  const fetchApplications = async () => {
    if (!client) return
    
    setLoadingApplications(true)
    try {
      const response = await fetch(`/api/applications?userId=${client.id}`)
      const data = await response.json()
      if (data.success) {
        setApplications(data.data)
      }
    } catch (error) {
      console.error("Error fetching applications:", error)
    } finally {
      setLoadingApplications(false)
    }
  }

  const handleTestimonialImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB")
      return
    }

    // Check if max 5 images
    if (testimonialImages.length >= 5) {
      toast.error("Maximum 5 images allowed")
      return
    }

    setUploadingTestimonialImage(true)
    try {
      const formData = new FormData()
      formData.append("files", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success && data.data.length > 0) {
        setTestimonialImages([...testimonialImages, data.data[0]])
        toast.success("Image uploaded successfully!")
      } else {
        toast.error("Failed to upload image")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Failed to upload image")
    } finally {
      setUploadingTestimonialImage(false)
    }
  }

  const removeTestimonialImage = (index: number) => {
    const newImages = [...testimonialImages]
    newImages.splice(index, 1)
    setTestimonialImages(newImages)
    toast.success("Image removed")
  }

  const handleSubmitTestimonial = async () => {
    if (!client) return

    if (!testimonialForm.review.trim()) {
      toast.error("Please write a review")
      return
    }

    if (testimonialForm.review.trim().length < 10) {
      toast.error("Review should be at least 10 characters")
      return
    }

    setSubmittingTestimonial(true)
    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId: client.id,
          clientName: client.name,
          clientEmail: client.email,
          clientImage: client.image,
          images: testimonialImages,
          rating: testimonialForm.rating,
          review: testimonialForm.review,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success("Thank you for your review! It will be published after approval.")
        setTestimonialForm({ rating: 5, review: "" })
        setTestimonialImages([])
        fetchTestimonials()
      } else {
        toast.error(data.error || "Failed to submit review")
      }
    } catch (error) {
      console.error("Error submitting testimonial:", error)
      toast.error("Failed to submit review")
    } finally {
      setSubmittingTestimonial(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-lime-400" />
      </div>
    )
  }

  if (!client) {
    return null
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500"
      case "In Progress":
      case "Started":
        return "bg-blue-500"
      case "Pending":
      case "Inquired":
        return "bg-yellow-500"
      case "Paid":
        return "bg-purple-500"
      case "On Hold":
      case "Cancelled":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTimelineStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "In Progress":
        return <Clock className="h-5 w-5 text-blue-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("files", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      if (data.success && data.data && data.data[0]) {
        // Update client image in database
        const updateResponse = await fetch("/api/clients/update-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clientId: client.id,
            image: data.data[0],
          }),
        })

        if (updateResponse.ok) {
          updateClient({ image: data.data[0] })
          toast.success("Profile image updated!")
        }
      } else {
        toast.error("Failed to upload image")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Error uploading image")
    } finally {
      setUploading(false)
    }
  }

  const stats = [
    {
      title: "Total Projects",
      value: client.projects?.length || 0,
      icon: FolderKanban,
      color: "text-lime-400",
    },
    {
      title: "Service Bookings",
      value: bookings.length || 0,
      icon: Briefcase,
      color: "text-purple-400",
    },
    {
      title: "In Progress",
      value: (client.projects?.filter((p) => p.status === "In Progress").length || 0) + 
             (bookings.filter((b) => b.status === "In Progress" || b.status === "Started").length || 0),
      icon: Clock,
      color: "text-blue-400",
    },
    {
      title: "Completed",
      value: (client.projects?.filter((p) => p.status === "Completed").length || 0) +
             (bookings.filter((b) => b.status === "Completed").length || 0),
      icon: CheckCircle2,
      color: "text-green-400",
    },
  ]

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="text-white hover:text-lime-400 mb-4">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Client Dashboard</h1>
              <p className="text-white/60 mt-2">Track your projects and their progress</p>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <Card className="mb-8 border-white/10 bg-black/40 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-lime-400">
                  <AvatarImage src={client.image} alt={client.name} />
                  <AvatarFallback className="bg-lime-400 text-black text-2xl font-semibold">
                    {getInitials(client.name)}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-lime-400 hover:bg-lime-300 text-black rounded-full p-2 cursor-pointer transition-all"
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white">{client.name}</h2>
                <p className="text-white/60 mt-1">{client.email}</p>
                {client.phone && <p className="text-white/60">{client.phone}</p>}
                {client.company && (
                  <p className="text-lime-400 font-medium mt-2">{client.company}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-white/10 bg-black/40 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">{stat.title}</p>
                    <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-12 h-12 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Projects and Services Tabs */}
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-3 mb-6">
            <TabsTrigger value="projects">
              <FolderKanban className="mr-2 h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="services">
              <Package className="mr-2 h-4 w-4" />
              Services
            </TabsTrigger>
            <TabsTrigger value="applications">
              <Briefcase className="mr-2 h-4 w-4" />
              Applications ({applications.length})
            </TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Your Projects</CardTitle>
              </CardHeader>
              <CardContent>
                {!client.projects || client.projects.length === 0 ? (
                  <div className="text-center py-12">
                    <FolderKanban className="h-16 w-16 text-white/20 mx-auto mb-4" />
                    <p className="text-white/60">No projects yet</p>
                    <p className="text-white/40 text-sm mt-2">
                      Contact us to start your first project
                    </p>
                    <Button asChild className="mt-4 bg-lime-400 text-black hover:bg-lime-300">
                      <Link href="/#contact">Get Started</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {client.projects.map((project, index) => (
                      <Card key={index} className="border-white/10 bg-white/5">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-semibold text-white">
                                {project.projectTitle}
                              </h3>
                              <p className="text-white/60 text-sm mt-1">
                                Booked: {new Date(project.bookedDate).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge className={getStatusColor(project.status)}>
                              {project.status}
                            </Badge>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-white/60">Progress</span>
                              <span className="text-sm font-semibold text-white">
                                {project.progress}%
                              </span>
                            </div>
                            <Progress value={project.progress} className="h-2" />
                          </div>

                          {/* Timeline */}
                          {project.timeline && project.timeline.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="text-sm font-semibold text-white mb-3">Timeline</h4>
                              {project.timeline.map((phase, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                  {getTimelineStatusIcon(phase.status)}
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <p className="text-white font-medium">{phase.phase}</p>
                                      {phase.date && (
                                        <span className="text-xs text-white/60">
                                          {new Date(phase.date).toLocaleDateString()}
                                        </span>
                                      )}
                                    </div>
                                    <Badge
                                      variant="outline"
                                      className="mt-1 text-xs border-white/20 text-white/60"
                                    >
                                      {phase.status}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Dates */}
                          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
                            {project.startDate && (
                              <div>
                                <p className="text-xs text-white/60">Start Date</p>
                                <p className="text-white font-medium">
                                  {new Date(project.startDate).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                            {project.estimatedCompletion && (
                              <div>
                                <p className="text-xs text-white/60">Est. Completion</p>
                                <p className="text-white font-medium">
                                  {new Date(project.estimatedCompletion).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Notes */}
                          {project.notes && (
                            <div className="mt-4 p-4 rounded-lg bg-white/5">
                              <p className="text-xs text-white/60 mb-1">Notes</p>
                              <p className="text-white text-sm">{project.notes}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Service Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingBookings ? (
                  <div className="space-y-6">
                    {[1, 2].map((i) => (
                      <Card key={i} className="border-white/10 bg-white/5">
                        <CardContent className="p-6">
                          <Skeleton className="h-6 w-3/4 mb-4" />
                          <Skeleton className="h-4 w-1/2 mb-4" />
                          <Skeleton className="h-2 w-full mb-6" />
                          <Skeleton className="h-20 w-full" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-white/20 mx-auto mb-4" />
                    <p className="text-white/60">No service bookings yet</p>
                    <p className="text-white/40 text-sm mt-2">
                      Browse our services to get started
                    </p>
                    <Button asChild className="mt-4 bg-lime-400 text-black hover:bg-lime-300">
                      <Link href="/services">Browse Services</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {bookings.map((booking) => (
                      <Card key={booking.id} className="border-white/10 bg-white/5">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-semibold text-white">
                                {booking.serviceTitle}
                              </h3>
                              <p className="text-purple-400 font-medium mt-1">
                                {booking.packageName} - ${booking.packagePrice}
                              </p>
                              <p className="text-white/60 text-sm mt-1">
                                Booked: {new Date(booking.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>

                          {/* WhatsApp Status */}
                          {booking.whatsappMessageSent && (
                            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                              <p className="text-sm text-green-400 flex items-center">
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                WhatsApp inquiry sent successfully
                              </p>
                            </div>
                          )}

                          {/* Progress Bar */}
                          <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-white/60">Progress</span>
                              <span className="text-sm font-semibold text-white">
                                {booking.progress || 0}%
                              </span>
                            </div>
                            <Progress value={booking.progress || 0} className="h-2" />
                          </div>

                          {/* Timeline */}
                          {booking.timeline && booking.timeline.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="text-sm font-semibold text-white mb-3">Timeline</h4>
                              {booking.timeline.map((phase, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                  {getTimelineStatusIcon(phase.status)}
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <p className="text-white font-medium">{phase.phase}</p>
                                      {phase.date && (
                                        <span className="text-xs text-white/60">
                                          {new Date(phase.date).toLocaleDateString()}
                                        </span>
                                      )}
                                    </div>
                                    {phase.description && (
                                      <p className="text-xs text-white/60 mt-1">{phase.description}</p>
                                    )}
                                    <Badge
                                      variant="outline"
                                      className="mt-1 text-xs border-white/20 text-white/60"
                                    >
                                      {phase.status}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Dates */}
                          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
                            {booking.startDate && (
                              <div>
                                <p className="text-xs text-white/60">Start Date</p>
                                <p className="text-white font-medium">
                                  {new Date(booking.startDate).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                            {booking.estimatedCompletion && (
                              <div>
                                <p className="text-xs text-white/60">Est. Completion</p>
                                <p className="text-white font-medium">
                                  {new Date(booking.estimatedCompletion).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Notes */}
                          {booking.notes && (
                            <div className="mt-4 p-4 rounded-lg bg-white/5">
                              <p className="text-xs text-white/60 mb-1">Admin Notes</p>
                              <p className="text-white text-sm">{booking.notes}</p>
                            </div>
                          )}

                          {/* Invoice Link */}
                          {booking.invoiceId && (
                            <div className="mt-4">
                              <Button
                                asChild
                                className="w-full bg-lime-400 text-black hover:bg-lime-300"
                              >
                                <Link href={`/client/invoices/${booking.invoiceId}`}>
                                  View Invoice & Payment Details
                                </Link>
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Job Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingApplications ? (
                  <div className="text-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-white/40 mx-auto" />
                  </div>
                ) : applications.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="h-16 w-16 text-white/20 mx-auto mb-4" />
                    <p className="text-white/60">No job applications yet</p>
                    <p className="text-white/40 text-sm mt-2">
                      Browse open positions and apply
                    </p>
                    <Button asChild className="mt-4 bg-lime-400 text-black hover:bg-lime-300">
                      <Link href="/careers">View Openings</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((application: any) => (
                      <Card key={application.id} className="border-white/10 bg-white/5">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className={`${
                                  application.status === 'pending' ? 'bg-yellow-500' :
                                  application.status === 'reviewing' ? 'bg-blue-500' :
                                  application.status === 'shortlisted' ? 'bg-purple-500' :
                                  application.status === 'interview-scheduled' ? 'bg-green-500' :
                                  application.status === 'rejected' ? 'bg-red-500' :
                                  application.status === 'accepted' ? 'bg-green-600' :
                                  'bg-gray-500'
                                } text-white`}>
                                  {application.status === 'pending' ? 'Pending Review' :
                                   application.status === 'reviewing' ? 'Under Review' :
                                   application.status === 'shortlisted' ? 'Shortlisted' :
                                   application.status === 'interview-scheduled' ? 'Interview Scheduled' :
                                   application.status === 'rejected' ? 'Not Selected' :
                                   application.status === 'accepted' ? 'Accepted' :
                                   application.status}
                                </Badge>
                              </div>
                              <h3 className="text-xl font-bold text-white mb-2">
                                {application.job?.title || "Position No Longer Available"}
                              </h3>
                              {application.job && (
                                <div className="flex flex-wrap gap-4 text-sm text-white/60">
                                  <div className="flex items-center gap-1">
                                    <Briefcase className="h-4 w-4" />
                                    <span>{application.job.department}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>{application.job.location}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span className="capitalize">{application.job.type.replace('-', ' ')}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mb-4 p-4 bg-white/5 rounded-lg">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <div className="text-white/60 mb-1">Applied On</div>
                                <div className="font-medium text-white flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(application.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                              <div>
                                <div className="text-white/60 mb-1">Experience</div>
                                <div className="font-medium text-white">{application.yearsOfExperience} years</div>
                              </div>
                              {application.currentCompany && (
                                <div>
                                  <div className="text-white/60 mb-1">Current Company</div>
                                  <div className="font-medium text-white">{application.currentCompany}</div>
                                </div>
                              )}
                              {application.expectedSalary && application.expectedSalary > 0 && (
                                <div>
                                  <div className="text-white/60 mb-1">Expected Salary</div>
                                  <div className="font-medium text-white">৳{application.expectedSalary.toLocaleString()}</div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Cover Letter
                            </h4>
                            <p className="text-sm text-white/80 line-clamp-3">
                              {application.coverLetter}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="sm" className="gap-2 border-white/20 text-white hover:bg-white/10">
                                <ExternalLink className="h-4 w-4" />
                                View Resume
                              </Button>
                            </a>
                            {application.portfolioUrl && (
                              <a href={application.portfolioUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm" className="gap-2 border-white/20 text-white hover:bg-white/10">
                                  <ExternalLink className="h-4 w-4" />
                                  Portfolio
                                </Button>
                              </a>
                            )}
                            {application.linkedinUrl && (
                              <a href={application.linkedinUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm" className="gap-2 border-white/20 text-white hover:bg-white/10">
                                  <ExternalLink className="h-4 w-4" />
                                  LinkedIn
                                </Button>
                              </a>
                            )}
                            {application.githubUrl && (
                              <a href={application.githubUrl} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm" className="gap-2 border-white/20 text-white hover:bg-white/10">
                                  <ExternalLink className="h-4 w-4" />
                                  GitHub
                                </Button>
                              </a>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Testimonial Section */}
        <Card className="border-white/10 bg-black/40 backdrop-blur-xl mt-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Share Your Experience
            </CardTitle>
            <p className="text-white/60 text-sm">Your feedback helps us improve and helps others make informed decisions</p>
          </CardHeader>
          <CardContent>
            {/* Submit Testimonial Form */}
            <div className="space-y-6 mb-8">
              <div>
                <Label htmlFor="rating" className="text-white">Rating</Label>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setTestimonialForm({ ...testimonialForm, rating: star })}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= testimonialForm.rating
                            ? "fill-lime-400 text-lime-400"
                            : "text-white/40"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="review" className="text-white">Your Review</Label>
                <Textarea
                  id="review"
                  value={testimonialForm.review}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, review: e.target.value })}
                  placeholder="Share your experience working with us..."
                  rows={4}
                  className="mt-2"
                />
                <p className="text-xs text-white/60 mt-1">Minimum 10 characters</p>
              </div>

              <div>
                <Label className="text-white">Photos (Optional - Max 5)</Label>
                <div className="mt-2">
                  <div className="flex flex-wrap gap-4">
                    {testimonialImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Testimonial ${index + 1}`}
                          className="h-24 w-24 rounded-lg object-cover border-2 border-lime-400"
                        />
                        <button
                          onClick={() => removeTestimonialImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    
                    {testimonialImages.length < 5 && (
                      <label className="cursor-pointer">
                        <div className="h-24 w-24 rounded-lg border-2 border-dashed border-white/20 flex flex-col items-center justify-center hover:border-lime-400 transition-colors">
                          {uploadingTestimonialImage ? (
                            <Loader2 className="h-6 w-6 animate-spin text-lime-400" />
                          ) : (
                            <>
                              <Upload className="h-6 w-6 text-white/60" />
                              <span className="text-xs text-white/60 mt-1">Upload</span>
                            </>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleTestimonialImageUpload}
                          className="hidden"
                          disabled={uploadingTestimonialImage}
                        />
                      </label>
                    )}
                  </div>
                  <p className="text-sm text-white/60 mt-2">
                    Upload photos of yourself or your work (Max 5 images, 5MB each)
                    {testimonialImages.length > 0 && ` - ${testimonialImages.length}/5 uploaded`}
                  </p>
                </div>
              </div>

              <Button
                onClick={handleSubmitTestimonial}
                disabled={submittingTestimonial || !testimonialForm.review.trim()}
                className="bg-lime-400 text-black hover:bg-lime-300"
              >
                {submittingTestimonial ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </Button>
            </div>

            {/* Client's Testimonials */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Your Reviews</h3>
              {loadingTestimonials ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-lime-400" />
                </div>
              ) : testimonials.length === 0 ? (
                <div className="text-center py-8 bg-white/5 rounded-lg">
                  <MessageSquare className="h-12 w-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/60">You haven&apos;t submitted any reviews yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {testimonials.map((testimonial) => (
                    <Card key={testimonial.id} className="bg-white/5 border-white/10">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          {testimonial.clientImage && (
                            <img
                              src={testimonial.clientImage}
                              alt={testimonial.clientName}
                              className="h-16 w-16 rounded-lg object-cover"
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${
                                      star <= testimonial.rating
                                        ? "fill-lime-400 text-lime-400"
                                        : "text-white/40"
                                    }`}
                                  />
                                ))}
                              </div>
                              <Badge className={testimonial.approved ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}>
                                {testimonial.approved ? "Published" : "Pending Approval"}
                              </Badge>
                            </div>
                            <p className="text-white/90 text-sm">{testimonial.review}</p>
                            <p className="text-xs text-white/60 mt-2">
                              {new Date(testimonial.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
