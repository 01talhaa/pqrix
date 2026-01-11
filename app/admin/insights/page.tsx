'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Eye, FileText } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface Insight {
  _id: string
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  isPublished: boolean
  featured: boolean
  author: {
    name: string
  }
  views: number
  publishDate: string
  createdAt: string
}

export default function InsightsAdminPage() {
  const router = useRouter()
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    search: ''
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })

  useEffect(() => {
    if (pagination.page && pagination.limit) {
      fetchInsights()
    }
  }, [filters, pagination.page])

  const fetchInsights = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (filters.category) params.append('category', filters.category)
      if (filters.status) params.append('status', filters.status)
      if (filters.search) params.append('search', filters.search)
      params.append('page', String(pagination.page || 1))
      params.append('limit', String(pagination.limit || 10))

      const response = await fetch(`/api/insights?${params}`)
      const data = await response.json()

      if (data.success) {
        setInsights(data.data)
        setPagination(data.pagination)
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch insights',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error fetching insights:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch insights',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (insightId: string) => {
    if (!confirm('Are you sure you want to delete this insight?')) return

    try {
      const response = await fetch(`/api/insights/${insightId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Insight deleted successfully'
        })
        fetchInsights()
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete insight',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error deleting insight:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete insight',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[#064E3B] text-3xl font-bold">Industry Insights</h1>
          <p className="text-muted-foreground mt-2">
            Manage your blog posts and industry insights
          </p>
        </div>
        <Link href="/admin/insights/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Insight
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search insights..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            
            <Select
              value={filters.category || undefined}
              onValueChange={(value) => setFilters({ ...filters, category: value === 'all' ? '' : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Market Analysis">Market Analysis</SelectItem>
                <SelectItem value="Investment Tips">Investment Tips</SelectItem>
                <SelectItem value="Industry News">Industry News</SelectItem>
                <SelectItem value="Trends">Trends</SelectItem>
                <SelectItem value="Regulations">Regulations</SelectItem>
                <SelectItem value="Case Study">Case Study</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.status || undefined}
              onValueChange={(value) => setFilters({ ...filters, status: value === 'all' ? '' : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Insights Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading insights...</p>
            </div>
          ) : insights.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No insights found</p>
              <p className="text-muted-foreground mb-4">
                Start sharing your industry expertise
              </p>
              <Link href="/admin/insights/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Insight
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {insights.map((insight) => (
                  <TableRow key={insight._id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{insight.title}</span>
                        <span className="text-sm text-muted-foreground line-clamp-1">
                          {insight.excerpt}
                        </span>
                        {insight.featured && (
                          <Badge variant="secondary" className="mt-1 w-fit">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{insight.category}</Badge>
                    </TableCell>
                    <TableCell>{insight.author?.name || 'Unknown'}</TableCell>
                    <TableCell>
                      <Badge className={insight.isPublished ? 'bg-green-500' : 'bg-yellow-500'}>
                        {insight.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{insight.views || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {insight.isPublished && insight.publishDate
                        ? new Date(insight.publishDate).toLocaleDateString()
                        : 'Not published'
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/insights/edit/${insight.id}`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(insight.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={pagination.page === 1}
            onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
          >
            Previous
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.pages}
            </span>
          </div>
          <Button
            variant="outline"
            disabled={pagination.page === pagination.pages}
            onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
