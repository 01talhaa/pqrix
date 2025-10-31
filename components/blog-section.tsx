"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Eye, ArrowRight, Loader2, FileText } from "lucide-react"
import type { BlogDocument } from "@/lib/models/Blog"

export function BlogSection() {
  const [blogs, setBlogs] = useState<BlogDocument[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlogs()

    // Listen for blog publish events
    const handleBlogPublish = () => {
      fetchBlogs()
    }
    
    window.addEventListener('blog-published', handleBlogPublish)
    
    return () => {
      window.removeEventListener('blog-published', handleBlogPublish)
    }
  }, [])

  const fetchBlogs = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/blogs", {
        cache: 'no-store',
      })
      const data = await response.json()
      if (data.success) {
        // Get latest 6 published blogs
        setBlogs(data.data.slice(0, 6))
      }
    } catch (error) {
      console.error("Error fetching blogs:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section id="blogs" className="container mx-auto px-4 py-16 sm:py-20">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-lime-400" />
        </div>
      </section>
    )
  }

  if (blogs.length === 0) {
    return null // Don't show section if no blogs
  }

  return (
    <section id="blogs" className="container mx-auto px-4 py-16 sm:py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold tracking-tight text-black dark:text-white sm:text-5xl mb-4">
          Latest from Our Blog
        </h2>
        <p className="text-xl text-gray-600 dark:text-white/60 max-w-2xl mx-auto">
          Insights, tutorials, and updates from our team
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => (
          <Link key={blog.id} href={`/blogs/${blog.slug}`}>
            <Card className="border-gray-200 dark:border-white/10 backdrop-blur-xl hover:bg-white dark:hover:bg-white/10 transition-all group cursor-pointer h-full">
              {/* Cover Image */}
              {blog.coverImage ? (
                <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              ) : (
                <div className="relative h-48 w-full overflow-hidden rounded-t-lg bg-gradient-to-br from-green-200/40 dark:from-purple-500/20 to-green-400/40 dark:to-lime-400/20 flex items-center justify-center">
                  <FileText className="h-16 w-16 text-gray-600 dark:text-white/40" />
                </div>
              )}

              <CardHeader>
                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {blog.tags.slice(0, 2).map((tag: string, idx: number) => (
                      <Badge 
                        key={idx} 
                        variant="outline" 
                        className="text-xs text-green-600 dark:text-lime-400 border-green-500/50 dark:border-lime-400/50"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <CardTitle className="text-xl text-black dark:text-white line-clamp-2 group-hover:text-green-600 dark:group-hover:text-lime-400 transition-colors">
                  {blog.title}
                </CardTitle>
              </CardHeader>

              <CardContent>
                {/* Excerpt */}
                <p className="text-gray-700 dark:text-white/70 text-sm line-clamp-3 mb-4">
                  {blog.excerpt}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-white/60 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{blog.author.name}</span>
                    </div>
                    {blog.views && blog.views > 0 && (
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{blog.views}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-white/60 mb-4">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {blog.publishedAt 
                      ? new Date(blog.publishedAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })
                      : new Date(blog.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })
                    }
                  </span>
                </div>

                {/* Read More */}
                <div className="flex items-center text-green-600 dark:text-lime-400 text-sm font-semibold group-hover:gap-2 transition-all">
                  Read More
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* View All Button */}
      {blogs.length >= 6 && (
        <div className="flex justify-center mt-12">
          <Link href="/blogs">
            <Button className="bg-green-500 dark:bg-lime-400 text-white dark:text-black hover:bg-green-600 dark:hover:bg-lime-300">
              View All Blogs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </section>
  )
}
