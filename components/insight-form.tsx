'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/hooks/use-toast'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import ImageUpload from '@/components/image-upload'

interface InsightFormProps {
  insightId?: string
}

export default function InsightForm({ insightId }: InsightFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Market Analysis' as 'Market Analysis' | 'Investment Tips' | 'Industry News' | 'Trends' | 'Regulations' | 'Case Study',
    tags: [] as string[],
    featuredImage: '',
    gallery: [] as string[],
    author: {
      name: '',
      role: '',
      avatar: '',
      bio: ''
    },
    seoTitle: '',
    seoDescription: '',
    featured: false,
    isPublished: false
  })

  useEffect(() => {
    if (insightId) {
      fetchInsight()
    }
  }, [insightId])

  const fetchInsight = async () => {
    try {
      const response = await fetch(`/api/insights/${insightId}`)
      const data = await response.json()
      
      if (data.success && data.data) {
        const insight = data.data
        setFormData({
          title: insight.title || '',
          excerpt: insight.excerpt || '',
          content: insight.content || '',
          category: insight.category || 'Market Analysis',
          tags: insight.tags || [],
          featuredImage: insight.featuredImage || '',
          gallery: insight.gallery || [],
          author: {
            name: insight.author?.name || '',
            role: insight.author?.role || '',
            avatar: insight.author?.avatar || '',
            bio: insight.author?.bio || ''
          },
          seoTitle: insight.seoTitle || '',
          seoDescription: insight.seoDescription || '',
          featured: insight.featured || false,
          isPublished: insight.isPublished || false
        })
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch insight',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error fetching insight:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch insight',
        variant: 'destructive'
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Prepare data with current publish state
      const dataToSubmit = {
        ...formData,
        isPublished: publish
      }

      const url = insightId 
        ? `/api/insights/${insightId}` 
        : '/api/insights'
      
      const method = insightId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSubmit)
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: `Insight ${insightId ? 'updated' : 'created'} successfully`
        })
        router.push('/admin/insights')
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to save insight',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error saving insight:', error)
      toast({
        title: 'Error',
        description: 'Failed to save insight',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field: string, value: any) => {
    setFormData((prev) => {
      const keys = field.split('.')
      if (keys.length === 1) {
        return { ...prev, [field]: value }
      }
      
      const newData = { ...prev }
      let current: any = newData
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] }
        current = current[keys[i]]
      }
      
      current[keys[keys.length - 1]] = value
      return newData
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/admin/insights">
            <Button type="button" variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-[#064E3B] text-3xl font-bold">
              {insightId ? 'Edit Insight' : 'Add New Insight'}
            </h1>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={(e) => handleSubmit(e as any, false)}
          >
            Save as Draft
          </Button>
          <Button
            type="button"
            disabled={loading}
            onClick={(e) => handleSubmit(e as any, true)}
          >
            <Save className="mr-2 h-4 w-4" />
            {loading ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  required
                  placeholder="e.g., 2024 Real Estate Market Trends"
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => updateField('excerpt', e.target.value)}
                  required
                  rows={3}
                  placeholder="Brief summary of the article..."
                />
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => updateField('content', e.target.value)}
                  required
                  rows={20}
                  placeholder="Full article content (supports markdown)..."
                  className="font-mono text-sm"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Supports Markdown formatting
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Author Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="authorName">Author Name *</Label>
                <Input
                  id="authorName"
                  value={formData.author.name}
                  onChange={(e) => updateField('author.name', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="authorRole">Author Role *</Label>
                <Input
                  id="authorRole"
                  value={formData.author.role}
                  onChange={(e) => updateField('author.role', e.target.value)}
                  required
                  placeholder="e.g., Senior Investment Analyst"
                />
              </div>

              <div>
                <Label htmlFor="authorBio">Author Bio</Label>
                <Textarea
                  id="authorBio"
                  value={formData.author.bio}
                  onChange={(e) => updateField('author.bio', e.target.value)}
                  rows={3}
                  placeholder="Brief biography of the author..."
                />
              </div>

              <div>
                <Label>Author Avatar</Label>
                <ImageUpload
                  value={formData.author.avatar}
                  onChange={(url) => updateField('author.avatar', url)}
                  label="Upload Author Avatar"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={formData.seoTitle}
                  onChange={(e) => updateField('seoTitle', e.target.value)}
                  placeholder="Leave blank to use article title"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {formData.seoTitle.length || formData.title.length} / 60 characters
                </p>
              </div>

              <div>
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  value={formData.seoDescription}
                  onChange={(e) => updateField('seoDescription', e.target.value)}
                  rows={3}
                  placeholder="Leave blank to use excerpt"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {formData.seoDescription.length || formData.excerpt.length} / 160 characters
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublished"
                  checked={formData.isPublished}
                  onCheckedChange={(checked) => updateField('isPublished', checked)}
                />
                <Label htmlFor="isPublished">Published</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                {formData.isPublished ? 'This article is live and visible to the public' : 'This article is saved as a draft'}
              </p>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => updateField('featured', checked)}
                />
                <Label htmlFor="featured">Featured Article</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Featured articles appear on the homepage
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categories & Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => updateField('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Market Analysis">Market Analysis</SelectItem>
                    <SelectItem value="Investment Tips">Investment Tips</SelectItem>
                    <SelectItem value="Industry News">Industry News</SelectItem>
                    <SelectItem value="Trends">Trends</SelectItem>
                    <SelectItem value="Regulations">Regulations</SelectItem>
                    <SelectItem value="Case Study">Case Study</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags.join(', ')}
                  onChange={(e) => updateField('tags', e.target.value.split(',').map(s => s.trim()))}
                  placeholder="residential, commercial, investment"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={formData.featuredImage}
                onChange={(url) => updateField('featuredImage', url)}
                label="Upload Featured Image"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
