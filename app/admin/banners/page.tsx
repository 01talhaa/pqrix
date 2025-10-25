"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Loader2,
  Plus,
  Edit,
  Trash2,
  Layout,
  Video,
  Image as ImageIcon,
  X,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { BannerDocument, BannerMedia } from "@/lib/models/Banner"
import { DISPLAY_STYLES, TONE_OPTIONS, GRADIENT_PRESETS } from "@/lib/models/Banner"

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<BannerDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [editingBanner, setEditingBanner] = useState<BannerDocument | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingMedia, setUploadingMedia] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [bannerToDelete, setBannerToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  // Form state with multiple media support
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    tone: "results",
    media: [] as BannerMedia[],
    displayStyle: "autoplay" as "autoplay" | "slider" | "static",
    status: "draft" as "draft" | "published",
    order: 1,
    gradient: "from-[#0b0b0b] via-[#1f2937] to-[#0b1220]",
  })

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/banners?admin=true", {
        cache: "no-store",
        credentials: "include",
        headers: {
          "Cache-Control": "no-cache",
        },
      })
      const data = await response.json()
      if (data.success) {
        setBanners(data.data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch banners",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching banners:", error)
      toast({
        title: "Error",
        description: "An error occurred while fetching banners",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const openEditor = (banner?: BannerDocument) => {
    if (banner) {
      setEditingBanner(banner)
      setFormData({
        title: banner.title,
        subtitle: banner.subtitle,
        tone: banner.tone,
        media: banner.media || [],
        displayStyle: banner.displayStyle,
        status: banner.status,
        order: banner.order,
        gradient: banner.gradient || "from-[#0b0b0b] via-[#1f2937] to-[#0b1220]",
      })
    } else {
      setEditingBanner(null)
      const nextOrder = banners.length > 0 ? Math.max(...banners.map((b) => b.order)) + 1 : 1
      setFormData({
        title: "",
        subtitle: "",
        tone: "results",
        media: [],
        displayStyle: "autoplay",
        status: "draft",
        order: nextOrder,
        gradient: "from-[#0b0b0b] via-[#1f2937] to-[#0b1220]",
      })
    }
    setShowEditor(true)
  }

  const closeEditor = () => {
    setShowEditor(false)
    setEditingBanner(null)
    setFormData({
      title: "",
      subtitle: "",
      tone: "results",
      media: [],
      displayStyle: "autoplay",
      status: "draft",
      order: 1,
      gradient: "from-[#0b0b0b] via-[#1f2937] to-[#0b1220]",
    })
  }

  const handleMediaUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    mediaType: "image" | "video"
  ) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Validate file types
    for (const file of files) {
      if (mediaType === "image" && !file.type.startsWith("image/")) {
        toast({
          title: "Invalid File",
          description: `${file.name} is not an image file`,
          variant: "destructive",
        })
        return
      }
      if (mediaType === "video" && !file.type.startsWith("video/")) {
        toast({
          title: "Invalid File",
          description: `${file.name} is not a video file`,
          variant: "destructive",
        })
        return
      }

      // Validate file size (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: `${file.name} exceeds 50MB limit`,
          variant: "destructive",
        })
        return
      }
    }

    setUploadingMedia(true)

    try {
      const formDataUpload = new FormData()
      files.forEach(file => {
        formDataUpload.append("files", file)
      })

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      })

      const data = await response.json()

      if (data.success && data.data && data.data.length > 0) {
        const newMediaItems: BannerMedia[] = data.data.map((url: string) => ({
          url,
          type: mediaType,
        }))

        setFormData({
          ...formData,
          media: [...formData.media, ...newMediaItems],
        })

        toast({
          title: "Success",
          description: `${files.length} ${mediaType}(s) uploaded successfully!`,
        })
      } else {
        throw new Error(data.error || "Upload failed")
      }
    } catch (error: any) {
      console.error("Error uploading:", error)
      toast({
        title: "Upload Error",
        description: error.message || "Failed to upload files",
        variant: "destructive",
      })
    } finally {
      setUploadingMedia(false)
      // Reset file input
      e.target.value = ""
    }
  }

  const handlePosterUpload = async (e: React.ChangeEvent<HTMLInputElement>, mediaIndex: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File",
        description: "Poster must be an image file",
        variant: "destructive",
      })
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Poster image must be under 10MB",
        variant: "destructive",
      })
      return
    }

    setUploadingMedia(true)

    try {
      const formDataUpload = new FormData()
      formDataUpload.append("files", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      })

      const data = await response.json()

      if (data.success && data.data && data.data[0]) {
        const updatedMedia = [...formData.media]
        updatedMedia[mediaIndex] = {
          ...updatedMedia[mediaIndex],
          posterUrl: data.data[0],
        }

        setFormData({
          ...formData,
          media: updatedMedia,
        })

        toast({
          title: "Success",
          description: "Poster uploaded successfully!",
        })
      } else {
        throw new Error(data.error || "Upload failed")
      }
    } catch (error: any) {
      console.error("Error uploading poster:", error)
      toast({
        title: "Upload Error",
        description: error.message || "Failed to upload poster",
        variant: "destructive",
      })
    } finally {
      setUploadingMedia(false)
      e.target.value = ""
    }
  }

  const removeMedia = (index: number) => {
    const updatedMedia = formData.media.filter((_, i) => i !== index)
    setFormData({ ...formData, media: updatedMedia })
  }

  const handleSubmit = async () => {
    // Validation
    if (!formData.title.trim() || !formData.subtitle.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and subtitle are required",
        variant: "destructive",
      })
      return
    }

    if (formData.media.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please upload at least one media file",
        variant: "destructive",
      })
      return
    }

    // Check if all videos have posters
    const videosWithoutPosters = formData.media.filter(m => m.type === 'video' && !m.posterUrl)
    if (videosWithoutPosters.length > 0) {
      toast({
        title: "Validation Error",
        description: "All videos must have a poster image",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      const url = editingBanner
        ? `/api/banners/${editingBanner.id}?admin=true`
        : `/api/banners?admin=true`

      const method = editingBanner ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: `Banner ${editingBanner ? "updated" : "created"} successfully!`,
        })

        if (editingBanner) {
          setBanners(banners.map((b) => (b.id === editingBanner.id ? data.data : b)))
        } else {
          setBanners([data.data, ...banners])
        }

        closeEditor()

        // Dispatch event if published
        if (formData.status === "published") {
          window.dispatchEvent(new CustomEvent("banner-published", { detail: data.data }))
        }
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to save banner",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving banner:", error)
      toast({
        title: "Error",
        description: "An error occurred while saving",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const openDeleteDialog = (id: string) => {
    setBannerToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!bannerToDelete) return

    try {
      const response = await fetch(`/api/banners/${bannerToDelete}?admin=true`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Banner deleted successfully!",
        })
        setBanners(banners.filter((b) => b.id !== bannerToDelete))
      } else {
        toast({
          title: "Error",
          description: "Failed to delete banner",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting banner:", error)
      toast({
        title: "Error",
        description: "An error occurred while deleting",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setBannerToDelete(null)
    }
  }

  const moveBanner = async (id: string, direction: "up" | "down") => {
    const currentIndex = banners.findIndex((b) => b.id === id)
    if (currentIndex === -1) return

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
    if (targetIndex < 0 || targetIndex >= banners.length) return

    const newBanners = [...banners]
    const [moved] = newBanners.splice(currentIndex, 1)
    newBanners.splice(targetIndex, 0, moved)

    // Update order numbers
    const updates = newBanners.map((banner, index) => ({
      ...banner,
      order: index + 1,
    }))

    setBanners(updates)

    // Update in database
    try {
      await fetch(`/api/banners/${id}?admin=true`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: targetIndex + 1 }),
      })
    } catch (error) {
      console.error("Error updating banner order:", error)
      fetchBanners() // Refresh on error
    }
  }

  const toggleStatus = async (id: string, currentStatus: "draft" | "published") => {
    const newStatus = currentStatus === "published" ? "draft" : "published"

    try {
      const response = await fetch(`/api/banners/${id}?admin=true`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await response.json()

      if (data.success) {
        setBanners(banners.map((b) => (b.id === id ? { ...b, status: newStatus } : b)))
        toast({
          title: "Success",
          description: `Banner ${newStatus === "published" ? "published" : "unpublished"} successfully!`,
        })
      }
    } catch (error) {
      console.error("Error toggling status:", error)
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      })
    }
  }

  const stats = {
    total: banners.length,
    published: banners.filter((b) => b.status === "published").length,
    draft: banners.filter((b) => b.status === "draft").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Layout className="h-8 w-8 text-lime-400" />
            Hero Banners Management
          </h1>
          <p className="text-white/60 mt-1">Create and manage hero section banners with images/videos</p>
        </div>
        <Button onClick={() => openEditor()} className="bg-lime-400 text-black hover:bg-lime-300">
          <Plus className="mr-2 h-4 w-4" />
          Create New Banner
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-white/10 bg-black/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/60">Total Banners</CardTitle>
            <Layout className="h-4 w-4 text-white/60" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-black/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/60">Published</CardTitle>
            <Eye className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{stats.published}</div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-black/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/60">Drafts</CardTitle>
            <EyeOff className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{stats.draft}</div>
          </CardContent>
        </Card>
      </div>

      {/* Banners List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-lime-400" />
        </div>
      ) : banners.length === 0 ? (
        <Card className="border-white/10 bg-black/40">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Layout className="h-12 w-12 text-white/20 mb-4" />
            <p className="text-white/60 mb-4">No banners created yet</p>
            <Button onClick={() => openEditor()} className="bg-lime-400 text-black hover:bg-lime-300">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Banner
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {banners.map((banner, index) => (
            <Card key={banner.id} className="border-white/10 bg-black/40 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  {/* Media Preview */}
                  <div className="flex gap-2 flex-shrink-0">
                    {banner.media && banner.media.slice(0, 3).map((media, idx) => (
                      <div key={idx} className="relative w-24 h-36 rounded-lg overflow-hidden bg-black">
                        {media.type === "video" ? (
                          <div className="relative w-full h-full">
                            <img
                              src={media.posterUrl || "/thumbnails/default.jpg"}
                              alt={`${banner.title} - ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                              <Video className="h-6 w-6 text-white" />
                            </div>
                          </div>
                        ) : (
                          <img
                            src={media.url}
                            alt={`${banner.title} - ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    ))}
                    {banner.media && banner.media.length > 3 && (
                      <div className="w-24 h-36 rounded-lg overflow-hidden bg-black/60 flex items-center justify-center">
                        <span className="text-white text-lg font-bold">+{banner.media.length - 3}</span>
                      </div>
                    )}
                  </div>

                  {/* Banner Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white">{banner.title}</h3>
                        <p className="text-sm text-white/60">{banner.subtitle}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge
                          variant="outline"
                          className={
                            banner.status === "published"
                              ? "bg-green-500/20 text-green-400 border-green-500/50"
                              : "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                          }
                        >
                          {banner.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-sm">
                      <Badge variant="outline" className="text-white/70">
                        {banner.tone}
                      </Badge>
                      <Badge variant="outline" className="text-white/70">
                        {banner.media && banner.media.length} media item{banner.media && banner.media.length !== 1 ? 's' : ''}
                      </Badge>
                      <Badge variant="outline" className="text-white/70">
                        {DISPLAY_STYLES[banner.displayStyle]?.label || banner.displayStyle}
                      </Badge>
                      <Badge variant="outline" className="text-white/70">
                        Order: {banner.order}
                      </Badge>
                    </div>

                    <div
                      className={`h-3 rounded-full ${banner.gradient} bg-gradient-to-r`}
                      title="Banner Gradient"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => toggleStatus(banner.id, banner.status)}
                      className="border-white/20"
                    >
                      {banner.status === "published" ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => moveBanner(banner.id, "up")}
                      disabled={index === 0}
                      className="border-white/20"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => moveBanner(banner.id, "down")}
                      disabled={index === banners.length - 1}
                      className="border-white/20"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEditor(banner)}
                      className="border-white/20"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openDeleteDialog(banner.id)}
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10"
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

      {/* Editor Dialog */}
      <Dialog open={showEditor} onOpenChange={closeEditor}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-black/95 border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingBanner ? "Edit Banner" : "Create New Banner"}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Create engaging hero section banners with multiple images or videos
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">
                Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Conversions"
                className="bg-black/60 border-white/20 text-white"
              />
            </div>

            {/* Subtitle */}
            <div className="space-y-2">
              <Label htmlFor="subtitle" className="text-white">
                Subtitle *
              </Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="e.g., Turn clicks into paying customers."
                className="bg-black/60 border-white/20 text-white"
              />
            </div>

            {/* Tone */}
            <div className="space-y-2">
              <Label htmlFor="tone" className="text-white">
                Tone *
              </Label>
              <Select value={formData.tone} onValueChange={(value) => setFormData({ ...formData, tone: value })}>
                <SelectTrigger className="bg-black/60 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Media Upload Section */}
            <div className="space-y-4 border border-white/10 rounded-lg p-4 bg-black/20">
              <div>
                <Label className="text-white text-lg">Media Files *</Label>
                <p className="text-xs text-white/60 mt-1">Upload images or videos. You can add multiple files.</p>
              </div>

              {/* Upload Buttons */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="video-upload" className="cursor-pointer">
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-4 hover:border-lime-400/50 transition-colors text-center">
                      <Video className="h-8 w-8 mx-auto mb-2 text-white/60" />
                      <p className="text-sm text-white/80">Upload Videos</p>
                      <p className="text-xs text-white/40">MP4, WebM (max 50MB each)</p>
                    </div>
                  </Label>
                  <Input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={(e) => handleMediaUpload(e, "video")}
                    className="hidden"
                    disabled={uploadingMedia}
                  />
                </div>

                <div className="flex-1">
                  <Label htmlFor="image-upload" className="cursor-pointer">
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-4 hover:border-lime-400/50 transition-colors text-center">
                      <ImageIcon className="h-8 w-8 mx-auto mb-2 text-white/60" />
                      <p className="text-sm text-white/80">Upload Images</p>
                      <p className="text-xs text-white/40">JPG, PNG (max 50MB each)</p>
                    </div>
                  </Label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleMediaUpload(e, "image")}
                    className="hidden"
                    disabled={uploadingMedia}
                  />
                </div>
              </div>

              {uploadingMedia && (
                <div className="flex items-center justify-center gap-2 text-lime-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Uploading...</span>
                </div>
              )}

              {/* Media List */}
              {formData.media.length > 0 && (
                <div className="space-y-3 mt-4">
                  <Label className="text-white">Uploaded Media ({formData.media.length})</Label>
                  {formData.media.map((media, index) => (
                    <div key={index} className="flex items-center gap-3 bg-black/60 p-3 rounded-lg border border-white/10">
                      <div className="w-16 h-16 rounded overflow-hidden bg-black flex-shrink-0">
                        {media.type === "video" ? (
                          <div className="relative w-full h-full">
                            {media.posterUrl ? (
                              <img src={media.posterUrl} alt="Poster" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-black/40">
                                <Video className="h-6 w-6 text-white" />
                              </div>
                            )}
                          </div>
                        ) : (
                          <img src={media.url} alt={`Media ${index + 1}`} className="w-full h-full object-cover" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {media.type === "video" ? (
                              <>
                                <Video className="h-3 w-3 mr-1" />
                                Video
                              </>
                            ) : (
                              <>
                                <ImageIcon className="h-3 w-3 mr-1" />
                                Image
                              </>
                            )}
                          </Badge>
                          <span className="text-xs text-white/60 truncate">Media #{index + 1}</span>
                        </div>

                        {/* Poster Upload for Videos */}
                        {media.type === "video" && (
                          <div className="mt-2">
                            {media.posterUrl ? (
                              <p className="text-xs text-green-400">✓ Poster uploaded</p>
                            ) : (
                              <div>
                                <Label htmlFor={`poster-${index}`} className="cursor-pointer">
                                  <span className="text-xs text-yellow-400 hover:text-yellow-300 underline">
                                    Upload poster image (required)
                                  </span>
                                </Label>
                                <Input
                                  id={`poster-${index}`}
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handlePosterUpload(e, index)}
                                  className="hidden"
                                  disabled={uploadingMedia}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMedia(index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        disabled={uploadingMedia}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Display Style */}
            <div className="space-y-2">
              <Label htmlFor="displayStyle" className="text-white">
                Display Style *
              </Label>
              <Select
                value={formData.displayStyle}
                onValueChange={(value: "autoplay" | "slider" | "static") =>
                  setFormData({ ...formData, displayStyle: value })
                }
              >
                <SelectTrigger className="bg-black/60 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DISPLAY_STYLES).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      <div>
                        <div className="font-medium">{value.label}</div>
                        <div className="text-xs text-white/60">{value.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Gradient */}
            <div className="space-y-2">
              <Label htmlFor="gradient" className="text-white">
                Background Gradient
              </Label>
              <Select value={formData.gradient} onValueChange={(value) => setFormData({ ...formData, gradient: value })}>
                <SelectTrigger className="bg-black/60 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {GRADIENT_PRESETS.map((preset) => (
                    <SelectItem key={preset.value} value={preset.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-12 h-4 rounded ${preset.value} bg-gradient-to-r`} />
                        {preset.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Order */}
            <div className="space-y-2">
              <Label htmlFor="order" className="text-white">
                Display Order
              </Label>
              <Input
                id="order"
                type="number"
                min="1"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                className="bg-black/60 border-white/20 text-white"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-white">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: "draft" | "published") => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="bg-black/60 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeEditor} disabled={submitting} className="border-white/20">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting || uploadingMedia} className="bg-lime-400 text-black hover:bg-lime-300">
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Banner"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-black/95 border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Banner?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              This action cannot be undone. This banner will be permanently removed from the hero section.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/20">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
