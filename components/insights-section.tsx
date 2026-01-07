"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight, User } from "lucide-react"
import type { InsightDocument } from "@/lib/models/Insight"

export function InsightsSection() {
  const [insights, setInsights] = useState<InsightDocument[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInsights()
  }, [])

  const fetchInsights = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        limit: "6",
        status: "published",
      })

      const response = await fetch(`/api/insights?${params}`)
      const data = await response.json()

      if (data.success) {
        setInsights(data.data)
      } else {
        setInsights([])
      }
    } catch (error) {
      console.error("Error fetching insights:", error)
      setInsights([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-16 sm:py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-black dark:text-white sm:text-5xl">
            Industry <span className="text-red-600 dark:text-red-400">Insights</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-700 dark:text-gray-300">
            Thought leadership, technical guides, and industry trends from our experts
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-96 rounded-lg bg-gray-200 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  if (insights.length === 0) {
    return null
  }

  return (
    <section className="container mx-auto px-4 py-16 sm:py-20">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-black dark:text-white sm:text-5xl">
          Industry <span className="text-red-600 dark:text-red-400">Insights</span>
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-gray-700 dark:text-gray-300">
          Thought leadership, technical guides, and industry trends from our experts
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {insights.map((insight) => (
          <Link key={insight.id} href={`/insights/${insight.slug}`}>
            <Card className="group liquid-glass border border-gray-200 dark:border-white/10 backdrop-blur-xl overflow-hidden transition-all hover:border-gray-300 dark:hover:border-white/20 hover:bg-white/90 dark:hover:bg-white/10 h-full flex flex-col">
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
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-600 to-red-800 dark:from-red-500 dark:to-red-700">
                    <span className="text-4xl font-bold text-white">
                      {insight.title.charAt(0)}
                    </span>
                  </div>
                )}
                {/* Category Badge */}
                {insight.category && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-red-600 dark:bg-red-500 text-white text-xs font-semibold">
                      {insight.category}
                    </Badge>
                  </div>
                )}
              </div>

              <CardContent className="flex-1 p-6 flex flex-col">
                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(insight.publishDate).toLocaleDateString()}</span>
                  </div>
                  {insight.readTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{insight.readTime} min</span>
                    </div>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-black dark:text-white mb-2 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                  {insight.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-3 flex-1">
                  {insight.excerpt}
                </p>

                {/* Author */}
                {insight.author && (
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-4 pb-4 border-b border-gray-200 dark:border-white/10">
                    <User className="h-3 w-3" />
                    <span>{insight.author.name}</span>
                  </div>
                )}

                {/* Read More Link */}
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-semibold text-sm group-hover:gap-3 transition-all">
                  <span>Read More</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-12 text-center">
        <Button
          asChild
          className="rounded-full bg-red-600 dark:bg-red-500 px-8 py-6 text-base font-semibold text-white hover:bg-red-700 dark:hover:bg-red-600"
        >
          <Link href="/insights">
            View All Insights
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  )
}

export default InsightsSection