'use client'

import { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation, EffectCards } from 'swiper/modules'
import { TrendingUp, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-cards'

interface CaseStudy {
  _id: string
  title: string
  industry: string
  clientType: string
  challenge: string
  solution: string
  result: string
  image?: string
  metrics?: {
    label: string
    value: string
  }[]
  technologies?: string[]
  isActive: boolean
  order: number
}

export function CaseStudiesSection() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        // Add cache busting for production
        const timestamp = new Date().getTime()
        const response = await fetch(`/api/case-studies?activeOnly=true&t=${timestamp}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        if (data.success) {
          setCaseStudies(data.data)
        } else {
          console.error('Failed to fetch case studies:', data.message)
        }
      } catch (error) {
        console.error('Error fetching case studies:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCaseStudies()
  }, [])

  if (loading) {
    return (
      <section id="case-studies" className="container mx-auto px-4 py-16 sm:py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-black dark:text-white sm:text-5xl">
            Case <span className="text-red-600 dark:text-red-400">Studies</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-700 dark:text-gray-300">
            Real results from real projects
          </p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    )
  }

  if (caseStudies.length === 0) {
    return null
  }

  return (
    <section id="case-studies" className="container mx-auto px-4 py-16 sm:py-20">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/10 dark:bg-red-950/30 border border-red-500/30 backdrop-blur-xl mb-6">
          <Sparkles className="w-4 h-4 text-red-600 dark:text-red-400" />
          <span className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-[0.25em]">
            Success Stories
          </span>
        </div>
        <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-black dark:text-white sm:text-5xl">
          Case <span className="text-red-600 dark:text-red-400">Studies</span>
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-gray-700 dark:text-gray-300">
          Real results from real projects that drive measurable impact
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={caseStudies.length > 1}
          className="case-studies-swiper"
        >
          {caseStudies.map((caseStudy) => (
            <SwiperSlide key={caseStudy._id}>
              <div className="group relative overflow-hidden rounded-2xl bg-white/90 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-500">
                <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
                  {/* Left Side - Image and Info */}
                  <div className="space-y-6">
                    {caseStudy.image && (
                      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 shadow-lg">
                        <img
                          src={caseStudy.image}
                          alt={caseStudy.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-3xl font-black text-black dark:text-white mb-3 tracking-tight">
                        {caseStudy.title}
                      </h3>
                      <div className="flex gap-2 flex-wrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/30">
                          {caseStudy.industry}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10">
                          {caseStudy.clientType}
                        </span>
                      </div>
                    </div>

                    {/* Metrics */}
                    {caseStudy.metrics && caseStudy.metrics.length > 0 && (
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        {caseStudy.metrics.slice(0, 4).map((metric, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/20 dark:to-red-900/10 border border-red-200/50 dark:border-red-800/30"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <TrendingUp className="w-4 h-4 text-red-600 dark:text-red-400" />
                              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                {metric.label}
                              </span>
                            </div>
                            <div className="text-2xl font-black text-red-600 dark:text-red-400">
                              {metric.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Technologies */}
                    {caseStudy.technologies && caseStudy.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {caseStudy.technologies.slice(0, 5).map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10"
                          >
                            {tech}
                          </span>
                        ))}
                        {caseStudy.technologies.length > 5 && (
                          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10">
                            +{caseStudy.technologies.length - 5} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Side - Content */}
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-8 w-1 bg-red-600 dark:bg-red-500 rounded-full" />
                        <h4 className="text-sm font-black text-red-600 dark:text-red-400 uppercase tracking-wider">
                          The Challenge
                        </h4>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {caseStudy.challenge}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-8 w-1 bg-red-600 dark:bg-red-500 rounded-full" />
                        <h4 className="text-sm font-black text-red-600 dark:text-red-400 uppercase tracking-wider">
                          Our Solution
                        </h4>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {caseStudy.solution}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-8 w-1 bg-red-600 dark:bg-red-500 rounded-full" />
                        <h4 className="text-sm font-black text-red-600 dark:text-red-400 uppercase tracking-wider">
                          The Result
                        </h4>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {caseStudy.result}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .case-studies-swiper {
          padding-bottom: 60px !important;
        }
        
        .case-studies-swiper .swiper-pagination {
          bottom: 20px !important;
        }
        
        .case-studies-swiper .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: rgb(220, 38, 38);
          opacity: 0.3;
          transition: all 0.3s ease;
        }
        
        .case-studies-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          width: 32px;
          border-radius: 6px;
        }
        
        .case-studies-swiper .swiper-button-next,
        .case-studies-swiper .swiper-button-prev {
          color: rgb(220, 38, 38);
          width: 44px;
          height: 44px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          border: 1px solid rgba(220, 38, 38, 0.2);
          transition: all 0.3s ease;
        }
        
        .dark .case-studies-swiper .swiper-button-next,
        .dark .case-studies-swiper .swiper-button-prev {
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
        }
        
        .case-studies-swiper .swiper-button-next:hover,
        .case-studies-swiper .swiper-button-prev:hover {
          background: rgb(220, 38, 38);
          color: white;
          transform: scale(1.1);
        }
        
        .case-studies-swiper .swiper-button-next::after,
        .case-studies-swiper .swiper-button-prev::after {
          font-size: 18px;
          font-weight: bold;
        }
      `}</style>
    </section>
  )
}
