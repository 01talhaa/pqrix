"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Loader2, Plus, Edit, Trash2, Eye, FileText, Image as ImageIcon, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { BlogDocument, CreateBlogInput } from "@/lib/models/Blog"
import { generateSlug } from "@/lib/models/Blog"

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditor, setShowEditor] = useState(false)
  const [editingBlog, setEditingBlog] = useState<BlogDocument | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    images: [] as string[],
    author: {
      name: "Admin",
      email: "admin@pqrix.com" as string | undefined,
      image: undefined as string | undefined,
    },
    status: "draft" as "draft" | "published",
    tags: [] as string[],
  })
  const [tagInput, setTagInput] = useState("")

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/blogs?admin=true", {
        cache: 'no-store',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      const data = await response.json()
      if (data.success) {
        setBlogs(data.data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch blogs",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching blogs:", error)
      toast({
        title: "Error",
        description: "An error occurred while fetching blogs",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const openEditor = (blog?: BlogDocument) => {
    if (blog) {
      setEditingBlog(blog)
      setFormData({
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt,
        content: blog.content,
        coverImage: blog.coverImage || "",
        images: blog.images || [],
        author: {
          name: blog.author.name,
          email: blog.author.email,
          image: blog.author.image,
        },
        status: blog.status,
        tags: blog.tags || [],
      })
    } else {
      setEditingBlog(null)
      setFormData({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        coverImage: "",
        images: [],
        author: {
          name: "Admin",
          email: "admin@pqrix.com",
          image: undefined,
        },
        status: "draft",
        tags: [],
      })
    }
    setShowEditor(true)
  }

  const closeEditor = () => {
    setShowEditor(false)
    setEditingBlog(null)
    setTagInput("")
  }

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setUploadingCover(true)
    try {
      const formData = new FormData()
      formData.append("files", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success && data.data.length > 0) {
        setFormData(prev => ({ ...prev, coverImage: data.data[0] }))
        toast({ title: "Success", description: "Cover image uploaded successfully!" })
      } else {
        toast({ title: "Error", description: "Failed to upload image", variant: "destructive" })
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({ title: "Error", description: "Failed to upload image", variant: "destructive" })
    } finally {
      setUploadingCover(false)
    }
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

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.excerpt.trim() || !formData.content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      const url = editingBlog
        ? `/api/blogs/${editingBlog.id}?admin=true`
        : `/api/blogs?admin=true`
      
      const method = editingBlog ? "PUT" : "POST"

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
          description: `Blog ${editingBlog ? "updated" : "created"} successfully!`,
        })
        
        if (editingBlog) {
          setBlogs(blogs.map(b => b.id === editingBlog.id ? data.data : b))
        } else {
          setBlogs([data.data, ...blogs])
        }
        
        closeEditor()
        
        // Trigger event for homepage to update if published
        if (formData.status === 'published' && typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('blog-published'))
        }
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to save blog",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving blog:", error)
      toast({
        title: "Error",
        description: "An error occurred while saving the blog",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!blogToDelete) return

    try {
      const response = await fetch(`/api/blogs/${blogToDelete}?admin=true`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: "Blog deleted successfully",
        })
        setBlogs(blogs.filter(b => b.id !== blogToDelete))
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete blog",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting blog:", error)
      toast({
        title: "Error",
        description: "An error occurred while deleting the blog",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setBlogToDelete(null)
    }
  }

  const openDeleteDialog = (id: string) => {
    setBlogToDelete(id)
    setDeleteDialogOpen(true)
  }

  const draftCount = blogs.filter(b => b.status === 'draft').length
  const publishedCount = blogs.filter(b => b.status === 'published').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Blog Management</h1>
          <p className="text-white/60 mt-1">Create, edit, and manage your blog posts</p>
        </div>
        <Button
          onClick={() => openEditor()}
          className="bg-lime-400 text-black hover:bg-lime-300"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Blog
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Blogs</CardTitle>
            <FileText className="h-4 w-4 text-lime-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{blogs.length}</div>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Published</CardTitle>
            <Eye className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{publishedCount}</div>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Drafts</CardTitle>
            <FileText className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{draftCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Blogs List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-lime-400" />
        </div>
      ) : blogs.length === 0 ? (
        <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-white/20 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No blogs yet</h3>
            <p className="text-white/60 text-center mb-4">
              Start creating amazing content for your audience
            </p>
            <Button
              onClick={() => openEditor()}
              className="bg-lime-400 text-black hover:bg-lime-300"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Blog
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <Card key={blog.id} className="border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden">
              {/* Cover Image */}
              {blog.coverImage && (
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge
                      className={
                        blog.status === 'published'
                          ? "bg-green-500/20 text-green-400 border-green-500/50"
                          : "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                      }
                    >
                      {blog.status === 'published' ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg text-white line-clamp-2">{blog.title}</CardTitle>
                    {!blog.coverImage && (
                      <Badge
                        className={`mt-2 ${
                          blog.status === 'published'
                            ? "bg-green-500/20 text-green-400 border-green-500/50"
                            : "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                        }`}
                      >
                        {blog.status === 'published' ? 'Published' : 'Draft'}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-white/70 text-sm line-clamp-3 mb-4">
                  {blog.excerpt}
                </p>

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {blog.tags.slice(0, 3).map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs text-white/60 border-white/20">
                        {tag}
                      </Badge>
                    ))}
                    {blog.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs text-white/60 border-white/20">
                        +{blog.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-white/60 mb-4">
                  <div className="flex items-center gap-2">
                    <Eye className="h-3 w-3" />
                    <span>{blog.views || 0} views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {blog.images && blog.images.length > 0 && (
                      <>
                        <ImageIcon className="h-3 w-3" />
                        <span>{blog.images.length}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Date */}
                <p className="text-xs text-white/60 mb-4">
                  {blog.status === 'published' && blog.publishedAt
                    ? `Published ${new Date(blog.publishedAt).toLocaleDateString()}`
                    : `Created ${new Date(blog.createdAt).toLocaleDateString()}`}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-white/20 hover:border-lime-400 hover:bg-lime-400/10"
                    onClick={() => openEditor(blog)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                    onClick={() => openDeleteDialog(blog.id)}
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
              {editingBlog ? "Edit Blog" : "Create New Blog"}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              {editingBlog ? "Update your blog post" : "Write and publish a new blog post"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Title */}
            <div>
              <Label className="text-white">Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => {
                  const newTitle = e.target.value
                  setFormData(prev => ({ 
                    ...prev, 
                    title: newTitle,
                    // Auto-generate slug only if not editing or if slug is empty/matches old title
                    slug: !editingBlog || prev.slug === generateSlug(prev.title) || !prev.slug 
                      ? generateSlug(newTitle) 
                      : prev.slug
                  }))
                }}
                placeholder="Enter blog title"
                className="bg-black/40 border-white/10 text-white"
              />
            </div>

            {/* Slug */}
            <div>
              <Label className="text-white">Slug (URL)</Label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="auto-generated-from-title"
                className="bg-black/40 border-white/10 text-white"
              />
              <p className="text-xs text-white/60 mt-1">Leave empty to auto-generate from title</p>
            </div>

            {/* Excerpt */}
            <div>
              <Label className="text-white">Excerpt *</Label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Brief description for previews (recommended 150-200 characters)"
                rows={3}
                className="bg-black/40 border-white/10 text-white"
              />
            </div>

            {/* Content */}
            <div>
              <Label className="text-white">Content *</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your blog content here... (supports HTML)"
                rows={12}
                className="bg-black/40 border-white/10 text-white font-mono text-sm"
              />
              <p className="text-xs text-white/60 mt-1">Supports HTML formatting</p>
            </div>

            {/* Cover Image */}
            <div>
              <Label className="text-white">Cover Image</Label>
              {formData.coverImage ? (
                <div className="relative mt-2">
                  <img
                    src={formData.coverImage}
                    alt="Cover"
                    className="w-full h-48 object-cover rounded-lg border-2 border-lime-400"
                  />
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, coverImage: "" }))}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer mt-2 block">
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-lime-400 transition-colors">
                    {uploadingCover ? (
                      <Loader2 className="h-8 w-8 animate-spin text-lime-400 mx-auto" />
                    ) : (
                      <>
                        <ImageIcon className="h-8 w-8 text-white/60 mx-auto mb-2" />
                        <p className="text-white/60">Click to upload cover image</p>
                        <p className="text-xs text-white/40 mt-1">Max 5MB</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageUpload}
                    className="hidden"
                    disabled={uploadingCover}
                  />
                </label>
              )}
            </div>

            {/* Additional Images */}
            <div>
              <Label className="text-white">Additional Images (Max 10)</Label>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border-2 border-lime-400"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {formData.images.length < 10 && (
                  <label className="cursor-pointer">
                    <div className="w-full h-24 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center hover:border-lime-400 transition-colors">
                      {uploadingImage ? (
                        <Loader2 className="h-6 w-6 animate-spin text-lime-400" />
                      ) : (
                        <Plus className="h-6 w-6 text-white/60" />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <Label className="text-white">Tags</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add a tag"
                  className="bg-black/40 border-white/10 text-white"
                />
                <Button
                  type="button"
                  onClick={addTag}
                  variant="outline"
                  className="border-white/20"
                >
                  Add
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, idx) => (
                    <Badge
                      key={idx}
                      className="bg-lime-400/20 text-lime-400 border-lime-400/50 cursor-pointer hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Status */}
            <div>
              <Label className="text-white">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "draft" | "published") => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="bg-black/40 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/10">
                  <SelectItem value="draft" className="text-white">Draft</SelectItem>
                  <SelectItem value="published" className="text-white">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeEditor}
              className="border-white/20"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-lime-400 text-black hover:bg-lime-300"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  {editingBlog ? "Update" : "Create"} Blog
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-black border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Blog</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              Are you sure you want to delete this blog? This action cannot be undone.
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
