"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Loader2, Plus, Edit, Trash2, Megaphone, Image as ImageIcon, X, ExternalLink, Video, Layout, Play, ArrowUp, ArrowDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { AdDocument, CreateAdInput } from "@/lib/models/Ad"
import type { BannerDocument, CreateBannerInput } from "@/lib/models/Banner"
import { DISPLAY_STYLES, TONE_OPTIONS, GRADIENT_PRESETS } from "@/lib/models/Banner"

export default function AdminAdsPage() {
  const [activeTab, setActiveTab] = useState<"ads" | "banners">("ads")
  
  // Ads state
  const [ads, setAds] = useState<AdDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [editingAd, setEditingAd] = useState<AdDocument | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [adToDelete, setAdToDelete] = useState<string | null>(null)
  
  // Banners state
  const [banners, setBanners] = useState<BannerDocument[]>([])
  const [bannersLoading, setBannersLoading] = useState(true)
  const [showBannerEditor, setShowBannerEditor] = useState(false)
  const [editingBanner, setEditingBanner] = useState<BannerDocument | null>(null)
  const [bannerSubmitting, setBannerSubmitting] = useState(false)
  const [uploadingMedia, setUploadingMedia] = useState(false)
  const [bannerDeleteDialogOpen, setBannerDeleteDialogOpen] = useState(false)
  const [bannerToDelete, setBannerToDelete] = useState<string | null>(null)
  
  const { toast } = useToast()

  // Form state for ads
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    images: [] as string[],
    link: "",
    status: "draft" as "draft" | "published",
    displayDuration: 5,
  })
  
  // Form state for banners
  const [bannerFormData, setBannerFormData] = useState({
    title: "",
    subtitle: "",
    tone: "results",
    mediaType: "video" as "image" | "video",
    mediaUrl: "",
    posterUrl: "",
    displayStyle: "autoplay" as "autoplay" | "slider" | "static",
    status: "draft" as "draft" | "published",
    order: 1,
    gradient: "from-[#0b0b0b] via-[#1f2937] to-[#0b1220]",
  })

  useEffect(() => {
    fetchAds()
  }, [])

  const fetchAds = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/ads?admin=true", {
        cache: 'no-store',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      const data = await response.json()
      if (data.success) {
        setAds(data.data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch ads",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching ads:", error)
      toast({
        title: "Error",
        description: "An error occurred while fetching ads",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const openEditor = (ad?: AdDocument) => {
    if (ad) {
      setEditingAd(ad)
      setFormData({
        title: ad.title,
        description: ad.description || "",
        images: ad.images || [],
        link: ad.link || "",
        status: ad.status,
        displayDuration: ad.displayDuration || 5,
      })
    } else {
      setEditingAd(null)
      setFormData({
        title: "",
        description: "",
        images: [],
        link: "",
        status: "draft",
        displayDuration: 5,
      })
    }
    setShowEditor(true)
  }

  const closeEditor = () => {
    setShowEditor(false)
    setEditingAd(null)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast({ title: "Error", description: "Please upload an image file", variant: "destructive" })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Error", description: "Image size should be less than 5MB", variant: "destructive" })
      return
    }

    if (formData.images.length >= 10) {
      toast({ title: "Error", description: "Maximum 10 images allowed", variant: "destructive" })
      return
    }

    setUploadingImage(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append("files", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      })

      const data = await response.json()

      if (data.success && data.data.length > 0) {
        setFormData(prev => ({ ...prev, images: [...prev.images, data.data[0]] }))
        toast({ title: "Success", description: "Image uploaded successfully!" })
      } else {
        toast({ title: "Error", description: "Failed to upload image", variant: "destructive" })
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({ title: "Error", description: "Failed to upload image", variant: "destructive" })
    } finally {
      setUploadingImage(false)
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title",
        variant: "destructive",
      })
      return
    }

    if (formData.images.length === 0) {
      toast({
        title: "Error",
        description: "Please upload at least one image",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      const url = editingAd
        ? `/api/ads/${editingAd.id}?admin=true`
        : `/api/ads?admin=true`
      
      const method = editingAd ? "PUT" : "POST"

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
          description: `Ad ${editingAd ? "updated" : "created"} successfully!`,
        })
        
        if (editingAd) {
          setAds(ads.map(a => a.id === editingAd.id ? data.data : a))
        } else {
          setAds([data.data, ...ads])
        }
        
        closeEditor()
        
        // Dispatch event if published
        if (formData.status === 'published') {
          window.dispatchEvent(new CustomEvent('ad-published', { detail: data.data }))
        }
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to save ad",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving ad:", error)
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
    setAdToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!adToDelete) return

    try {
      const response = await fetch(`/api/ads/${adToDelete}?admin=true`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Ad deleted successfully!",
        })
        setAds(ads.filter(a => a.id !== adToDelete))
      } else {
        toast({
          title: "Error",
          description: "Failed to delete ad",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting ad:", error)
      toast({
        title: "Error",
        description: "An error occurred while deleting",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setAdToDelete(null)
    }
  }

  // ====================
  // BANNER FUNCTIONS
  // ====================

  useEffect(() => {
    if (activeTab === "banners") {
      fetchBanners()
    }
  }, [activeTab])

  const fetchBanners = async () => {
    setBannersLoading(true)
    try {
      const response = await fetch("/api/banners?admin=true", {
        cache: 'no-store',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
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
      setBannersLoading(false)
    }
  }

  const openBannerEditor = (banner?: BannerDocument) => {
    if (banner) {
      setEditingBanner(banner)
      // Get first media item for backwards compatibility
      const firstMedia = banner.media && banner.media.length > 0 ? banner.media[0] : null
      setBannerFormData({
        title: banner.title,
        subtitle: banner.subtitle,
        tone: banner.tone,
        mediaType: firstMedia?.type || "video",
        mediaUrl: firstMedia?.url || "",
        posterUrl: firstMedia?.type === 'video' ? (firstMedia.posterUrl || "") : "",
        displayStyle: banner.displayStyle,
        status: banner.status,
        order: banner.order,
        gradient: banner.gradient || "from-[#0b0b0b] via-[#1f2937] to-[#0b1220]",
      })
    } else {
      setEditingBanner(null)
      const nextOrder = banners.length > 0 ? Math.max(...banners.map(b => b.order)) + 1 : 1
      setBannerFormData({
        title: "",
        subtitle: "",
        tone: "results",
        mediaType: "video",
        mediaUrl: "",
        posterUrl: "",
        displayStyle: "autoplay",
        status: "draft",
        order: nextOrder,
        gradient: "from-[#0b0b0b] via-[#1f2937] to-[#0b1220]",
      })
    }
    setShowBannerEditor(true)
  }

  const closeBannerEditor = () => {
    setShowBannerEditor(false)
    setEditingBanner(null)
    setBannerFormData({
      title: "",
      subtitle: "",
      tone: "results",
      mediaType: "video",
      mediaUrl: "",
      posterUrl: "",
      displayStyle: "autoplay",
      status: "draft",
      order: 1,
      gradient: "from-[#0b0b0b] via-[#1f2937] to-[#0b1220]",
    })
  }

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'media' | 'poster') => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (type === 'media') {
      if (bannerFormData.mediaType === 'image' && !file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: "Please upload an image file",
          variant: "destructive",
        })
        return
      }
      if (bannerFormData.mediaType === 'video' && !file.type.startsWith('video/')) {
        toast({
          title: "Invalid File",
          description: "Please upload a video file",
          variant: "destructive",
        })
        return
      }
    } else if (type === 'poster' && !file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Poster must be an image file",
        variant: "destructive",
      })
      return
    }

    // Validate file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Maximum file size is 50MB",
        variant: "destructive",
      })
      return
    }

    setUploadingMedia(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success && data.url) {
        if (type === 'media') {
          setBannerFormData({ ...bannerFormData, mediaUrl: data.url })
        } else {
          setBannerFormData({ ...bannerFormData, posterUrl: data.url })
        }
        toast({
          title: "Success",
          description: `${type === 'media' ? 'Media' : 'Poster'} uploaded successfully!`,
        })
      } else {
        throw new Error(data.error || 'Upload failed')
      }
    } catch (error: any) {
      console.error("Error uploading:", error)
      toast({
        title: "Upload Error",
        description: error.message || "Failed to upload file",
        variant: "destructive",
      })
    } finally {
      setUploadingMedia(false)
    }
  }

  const handleBannerSubmit = async () => {
    // Validation
    if (!bannerFormData.title.trim() || !bannerFormData.subtitle.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and subtitle are required",
        variant: "destructive",
      })
      return
    }

    if (!bannerFormData.mediaUrl) {
      toast({
        title: "Validation Error",
        description: "Please upload media file",
        variant: "destructive",
      })
      return
    }

    if (bannerFormData.mediaType === 'video' && !bannerFormData.posterUrl) {
      toast({
        title: "Validation Error",
        description: "Poster image is required for videos",
        variant: "destructive",
      })
      return
    }

    setBannerSubmitting(true)

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
        body: JSON.stringify(bannerFormData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: `Banner ${editingBanner ? "updated" : "created"} successfully!`,
        })
        
        if (editingBanner) {
          setBanners(banners.map(b => b.id === editingBanner.id ? data.data : b))
        } else {
          setBanners([data.data, ...banners])
        }
        
        closeBannerEditor()
        
        // Dispatch event if published
        if (bannerFormData.status === 'published') {
          window.dispatchEvent(new CustomEvent('banner-published', { detail: data.data }))
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
      setBannerSubmitting(false)
    }
  }

  const openBannerDeleteDialog = (id: string) => {
    setBannerToDelete(id)
    setBannerDeleteDialogOpen(true)
  }

  const handleBannerDelete = async () => {
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
        setBanners(banners.filter(b => b.id !== bannerToDelete))
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
      setBannerDeleteDialogOpen(false)
      setBannerToDelete(null)
    }
  }

  const moveBanner = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = banners.findIndex(b => b.id === id)
    if (currentIndex === -1) return
    
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (targetIndex < 0 || targetIndex >= banners.length) return

    const newBanners = [...banners]
    const [moved] = newBanners.splice(currentIndex, 1)
    newBanners.splice(targetIndex, 0, moved)

    // Update order numbers
    const updates = newBanners.map((banner, index) => ({
      ...banner,
      order: index + 1
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

  const stats = {
    total: ads.length,
    published: ads.filter(a => a.status === 'published').length,
    draft: ads.filter(a => a.status === 'draft').length,
  }

  const bannerStats = {
    total: banners.length,
    published: banners.filter(b => b.status === 'published').length,
    draft: banners.filter(b => b.status === 'draft').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Megaphone className="h-8 w-8 text-lime-400" />
            Ads & Offers Management
          </h1>
          <p className="text-white/60 mt-1">Create and manage promotional ads and special offers</p>
        </div>
        <Button
          onClick={() => openEditor()}
          className="bg-lime-400 text-black hover:bg-lime-300"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Ad
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-white/10 bg-black/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/60">Total Ads</CardTitle>
            <Megaphone className="h-4 w-4 text-white/60" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-black/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/60">Published</CardTitle>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/50">Active</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.published}</div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-black/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/60">Drafts</CardTitle>
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">Pending</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.draft}</div>
          </CardContent>
        </Card>
      </div>

      {/* Ads List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-lime-400" />
        </div>
      ) : ads.length === 0 ? (
        <Card className="border-white/10 bg-black/40 backdrop-blur-xl p-12 text-center">
          <Megaphone className="h-12 w-12 text-white/40 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No ads yet</h3>
          <p className="text-white/60 mb-6">Create your first ad to get started</p>
          <Button
            onClick={() => openEditor()}
            className="bg-lime-400 text-black hover:bg-lime-300"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Ad
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ads.map((ad) => (
            <Card key={ad.id} className="border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden">
              {/* First Image Preview */}
              {ad.images && ad.images.length > 0 && (
                <div className="relative aspect-video">
                  <img
                    src={ad.images[0]}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                  />
                  {ad.images.length > 1 && (
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-white">
                      +{ad.images.length - 1} more
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <Badge
                      className={
                        ad.status === 'published'
                          ? "bg-green-500/20 text-green-400 border-green-500/50"
                          : "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                      }
                    >
                      {ad.status === 'published' ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-lg text-white line-clamp-2">{ad.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {ad.description && (
                  <p className="text-white/70 text-sm line-clamp-2">
                    {ad.description}
                  </p>
                )}

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-white/60">
                  <div>Display: {ad.displayDuration || 5}s</div>
                  {ad.link && (
                    <div className="flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      <span>Has Link</span>
                    </div>
                  )}
                </div>

                {/* Date */}
                <p className="text-xs text-white/60">
                  {ad.status === 'published' && ad.publishedAt
                    ? `Published ${new Date(ad.publishedAt).toLocaleDateString()}`
                    : `Created ${new Date(ad.createdAt).toLocaleDateString()}`}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-white/20 hover:border-lime-400 hover:bg-lime-400/10"
                    onClick={() => openEditor(ad)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                    onClick={() => openDeleteDialog(ad.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Editor Dialog */}
      <Dialog open={showEditor} onOpenChange={closeEditor}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-black border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingAd ? "Edit Ad" : "Create New Ad"}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              {editingAd ? "Update your ad details" : "Create a new promotional ad or special offer"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Title */}
            <div>
              <Label className="text-white">Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter ad title"
                className="bg-black/40 border-white/10 text-white"
              />
            </div>

            {/* Description */}
            <div>
              <Label className="text-white">Description (Optional)</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the ad"
                rows={3}
                className="bg-black/40 border-white/10 text-white"
              />
            </div>

            {/* Link */}
            <div>
              <Label className="text-white">Link (Optional)</Label>
              <Input
                value={formData.link}
                onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                placeholder="https://example.com"
                className="bg-black/40 border-white/10 text-white"
              />
              <p className="text-xs text-white/60 mt-1">URL to open when users click the ad</p>
            </div>

            {/* Display Duration */}
            <div>
              <Label className="text-white">Display Duration (seconds)</Label>
              <Input
                type="number"
                min="1"
                max="60"
                value={formData.displayDuration}
                onChange={(e) => setFormData(prev => ({ ...prev, displayDuration: parseInt(e.target.value) || 5 }))}
                className="bg-black/40 border-white/10 text-white"
              />
              <p className="text-xs text-white/60 mt-1">How long the ad shows on homepage (1-60 seconds)</p>
            </div>

            {/* Images */}
            <div>
              <Label className="text-white">Images * (Max 10)</Label>
              
              {/* Images Grid */}
              <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-2 mb-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={image}
                      alt={`Ad image ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg border-2 border-lime-400"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                
                {formData.images.length < 10 && (
                  <label className="cursor-pointer aspect-square">
                    <div className="border-2 border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center h-full hover:border-lime-400 transition-colors">
                      {uploadingImage ? (
                        <Loader2 className="h-8 w-8 animate-spin text-lime-400" />
                      ) : (
                        <>
                          <Plus className="h-8 w-8 text-white/60 mb-1" />
                          <p className="text-xs text-white/60 text-center px-2">Add Image</p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage || formData.images.length >= 10}
                    />
                  </label>
                )}
              </div>
              <p className="text-xs text-white/60">Upload high-quality images for your ad (max 5MB each)</p>
            </div>

            {/* Status */}
            <div>
              <Label className="text-white">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "draft" | "published") =>
                  setFormData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="bg-black/40 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/10">
                  <SelectItem value="draft" className="text-white">Draft</SelectItem>
                  <SelectItem value="published" className="text-white">Published</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-white/60 mt-1">
                Published ads will show on homepage
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeEditor}
              className="border-white/20 text-black"
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-lime-400 text-black hover:bg-lime-300"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>{editingAd ? "Update Ad" : "Create Ad"}</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-black border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              This action cannot be undone. This will permanently delete the ad.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/20 text-white">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
