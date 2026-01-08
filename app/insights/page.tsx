'use client'

import { useState, useEffect } from 'react'
import SiteHeader from '@/components/site-header'
import { AppverseFooter } from '@/components/appverse-footer'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, User, Search, FileText, ArrowRight } from 'lucide-react'

export default function InsightsPage() {
  const [insights, setInsights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchInsights()
  }, [currentPage, category, searchQuery])

  const fetchInsights = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: '9',
        status: 'published',
      })

      if (category !== 'all') {
        params.append('category', category)
      }
      if (searchQuery) {
        params.append('search', searchQuery)
      }

      const response = await fetch(`/api/insights?${params}`)
      const data = await response.json()

      if (data.success) {
        setInsights(data.data)
        setTotalPages(data.pagination?.pages || 1)
      }
    } catch (error) {
      console.error('Error fetching insights:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setSearchQuery(search)
    setCurrentPage(1)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <>
      <main className="min-h-[100dvh] text-black dark:text-white">
        <SiteHeader />

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
              <span className="block">Industry</span>
              <span className="block bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(239,68,68,0.5)]">Insights</span>
            </h1>
            <p className="text-lg text-gray-300 sm:text-xl">
              Explore our latest insights on technology, market trends, and industry best practices
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="container mx-auto px-4 pb-8">
          <Card className="liquid-glass border border-red-500/20 bg-black/40 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search articles..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pl-10 bg-black/50 border-red-500/30 text-white focus:border-red-500/50 focus:ring-red-500/30"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <Select value={category} onValueChange={(value) => {
                  setCategory(value)
                  setCurrentPage(1)
                }}>
                  <SelectTrigger className="w-full md:w-48 bg-black/50 border-red-500/30 text-white">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-red-500/30">
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Market Analysis">Market Analysis</SelectItem>
                    <SelectItem value="Investment Tips">Investment Tips</SelectItem>
                    <SelectItem value="Industry News">Industry News</SelectItem>
                    <SelectItem value="Trends">Trends</SelectItem>
                    <SelectItem value="Regulations">Regulations</SelectItem>
                    <SelectItem value="Case Study">Case Study</SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  onClick={handleSearch}
                  className="rounded-full bg-gradient-to-r from-red-600 to-red-800 text-white hover:from-red-700 hover:to-red-900 transition-all duration-300 shadow-lg shadow-red-500/40"
                >
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Insights Grid */}
        <section className="container mx-auto px-4 pb-16 sm:pb-24">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <div key={i} className="h-96 rounded-lg bg-black/40 border border-red-500/20 animate-pulse" />
              ))}
            </div>
          ) : insights.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-white text-2xl font-bold mb-2">No Insights Found</h3>
              <p className="text-gray-300 mb-4">
                Try adjusting your filters or search query
              </p>
              <Button 
                onClick={() => {
                  setSearch('')
                  setSearchQuery('')
                  setCategory('all')
                  setCurrentPage(1)
                }}
                className="rounded-full bg-gradient-to-r from-red-600 to-red-800 text-white hover:from-red-700 hover:to-red-900 transition-all duration-300 shadow-lg shadow-red-500/40"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {insights.map((insight) => (
                  <Link
                    key={insight._id || insight.id}
                    href={`/insights/${insight.slug}`}
                  >
                    <Card className="group liquid-glass border border-red-500/20 bg-black/40 backdrop-blur-xl overflow-hidden transition-all hover:border-red-500/40 hover:shadow-lg hover:shadow-red-500/30 h-full flex flex-col">
                      {/* Featured Image */}
                      <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-900">
                        {insight.featuredImage ? (
                          <Image
                            src={insight.featuredImage}
                            alt={insight.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                            <span className="text-4xl font-bold text-white">
                              {insight.title.charAt(0)}
                            </span>
                          </div>
                        )}
                        {/* Category Badge */}
                        {insight.category && (
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-gradient-to-r from-red-600 to-red-800 text-white text-xs font-semibold border-0">
                              {insight.category}
                            </Badge>
                          </div>
                        )}
                        {insight.featured && (
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-yellow-500 text-white text-xs font-semibold">Featured</Badge>
                          </div>
                        )}
                      </div>

                      <CardContent className="flex-1 p-6 flex flex-col">
                        {/* Title */}
                        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-red-400 transition-colors">
                          {insight.title}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-sm text-gray-300 mb-4 line-clamp-3 flex-1">
                          {insight.excerpt}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center justify-between text-xs text-gray-400 border-t border-red-500/20 pt-4">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{typeof insight.author === 'string' ? insight.author : insight.author?.name || 'Anonymous'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(insight.publishDate || insight.publishedAt || insight.createdAt)}</span>
                          </div>
                        </div>

                        {/* Read More */}
                        <div className="flex items-center gap-2 text-red-400 font-semibold text-sm mt-4 group-hover:gap-3 transition-all">
                          <span>Read More</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="rounded-full border-red-500/30 bg-black/40 text-white hover:bg-black/60"
                  >
                    Previous
                  </Button>
                  
                  {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'default' : 'outline'}
                        onClick={() => setCurrentPage(pageNum)}
                        className={currentPage === pageNum 
                          ? "rounded-full bg-gradient-to-r from-red-600 to-red-800 text-white hover:from-red-700 hover:to-red-900 shadow-lg shadow-red-500/40"
                          : "rounded-full border-red-500/30 bg-black/40 text-white hover:bg-black/60"
                        }
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                  
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="rounded-full border-red-500/30 bg-black/40 text-white hover:bg-black/60"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </section>

        <AppverseFooter />
      </main>
    </>
  )
}
