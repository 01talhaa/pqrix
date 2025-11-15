import Link from 'next/link'
import Image from 'next/image'
import { Lightbulb, Calendar, User, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

async function getLatestInsights() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/insights?status=published&limit=3`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return []
    }
    
    const data = await response.json()
    return data.success ? data.data : []
  } catch (error) {
    console.error('Error fetching insights:', error)
    return []
  }
}

export async function LatestInsightsSection() {
  const insights = await getLatestInsights()

  if (!insights || insights.length === 0) {
    return null
  }

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 font-medium text-sm mb-4">
            <Lightbulb className="h-4 w-4" />
            Industry Insights
          </div>
          <h2 className="text-[#064E3B] text-4xl md:text-5xl font-bold mb-4">
            Latest Market Intelligence
          </h2>
          <p className="text-xl text-black max-w-2xl mx-auto">
            Stay informed with expert analysis and industry trends
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {insights.map((insight: any) => (
            <Link href={`/insights/${insight.slug}`} key={insight._id}>
              <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 h-full border-0">
                {/* Featured Image */}
                <div className="relative h-48 overflow-hidden">
                  {insight.featuredImage ? (
                    <Image
                      src={insight.featuredImage}
                      alt={insight.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                      <Lightbulb className="h-16 w-16 text-amber-300" />
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-amber-500">
                      {insight.category}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Title */}
                  <h3 className="text-[#064E3B] text-xl font-bold mb-3 group-hover:text-amber-600 transition-colors line-clamp-2">
                    {insight.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-black mb-4 line-clamp-3">
                    {insight.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between pt-4 border-t text-sm text-black">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{insight.author?.name || 'Admin'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(insight.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Read More */}
                  <div className="mt-4">
                    <span className="text-amber-600 font-semibold group-hover:gap-2 flex items-center gap-1 transition-all">
                      Read Article
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/insights">
            <Button size="lg" variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50">
              View All Insights
              <Lightbulb className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
