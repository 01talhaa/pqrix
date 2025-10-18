"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TestimonialDocument } from "@/lib/models/Testimonial"

interface FeaturesContent {
  title: string
  subtitle: string
}

const defaultContent: FeaturesContent = {
  title: "What makes us the best studio for you.",
  subtitle: "Discover our unique approach to 3D animation",
}

export function Features() {
  const [content, setContent] = useState<FeaturesContent>(defaultContent)
  const [testimonials, setTestimonials] = useState<TestimonialDocument[]>([])
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    // Load content from localStorage
    const savedContent = localStorage.getItem("pqrix-content")
    if (savedContent) {
      try {
        const parsed = JSON.parse(savedContent)
        if (parsed.features) {
          setContent(parsed.features)
        }
      } catch (error) {
        console.error("Error parsing saved content:", error)
      }
    }

    // Fetch approved testimonials
    fetchTestimonials()

    // Listen for testimonial approval events
    const handleTestimonialUpdate = () => {
      fetchTestimonials()
    }
    
    window.addEventListener('testimonial-approved', handleTestimonialUpdate)
    
    return () => {
      window.removeEventListener('testimonial-approved', handleTestimonialUpdate)
    }
  }, [])

  // Auto-play slideshow
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length <= 1) return

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000) // Change every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, testimonials.length])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("/api/testimonials")
      const data = await response.json()
      if (data.success) {
        // Only show approved testimonials
        const approved = data.data.filter((t: TestimonialDocument) => t.approved)
        setTestimonials(approved)
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error)
    }
  }

  const nextTestimonial = () => {
    setIsAutoPlaying(false)
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setIsAutoPlaying(false)
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const averageRating = testimonials.length > 0
    ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
    : "5.0"

  return (
    <section id="features" className="container mx-auto px-4 py-16 sm:py-20">
      <h2 className="mb-8 text-center text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
        {content.title}
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Adaptability Card - Hidden on mobile */}
        <Card className="hidden md:block liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader>
            <p className="text-[11px] tracking-widest text-neutral-400">ADAPTABILITY</p>
            <CardTitle className="mt-1 text-xl text-white">Make the experience truly intuitive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-white/10">
                <Image
                  src="/images/intuitive-1.png"
                  alt="Close-up smartphone camera module on textured leather back"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 240px, 45vw"
                  priority={false}
                />
              </div>
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-white/10">
                <Image
                  src="/images/intuitive-2.png"
                  alt="Hand gripping textured phone back — macro detail"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 240px, 45vw"
                  priority={false}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Client Love Card - Always visible */}
        <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader>
            <p className="text-[11px] tracking-widest text-neutral-400">CLIENT LOVE</p>
            <CardTitle className="mt-1 text-xl text-white">
              What Our Clients Say
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex items-end gap-4">
              <div className="text-5xl font-bold text-lime-300">{averageRating}</div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-lime-300 text-lime-300" />
                ))}
              </div>
              <span className="text-sm text-white/60 mb-1">({testimonials.length} reviews)</span>
            </div>

            {testimonials.length > 0 ? (
              <div className="relative">
                {/* Testimonial Slideshow */}
                <div className="min-h-[280px] flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Client Image and Info */}
                    <div className="flex items-center gap-4">
                      {testimonials[currentTestimonial].clientImage ? (
                        <img
                          src={testimonials[currentTestimonial].clientImage}
                          alt={testimonials[currentTestimonial].clientName}
                          className="h-16 w-16 rounded-full object-cover border-2 border-lime-300"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-lime-300/20 flex items-center justify-center border-2 border-lime-300">
                          <span className="text-lime-300 font-bold text-xl">
                            {testimonials[currentTestimonial].clientName.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <h4 className="text-white font-semibold">
                          {testimonials[currentTestimonial].clientName}
                        </h4>
                        <div className="flex gap-1 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < testimonials[currentTestimonial].rating
                                  ? "fill-lime-300 text-lime-300"
                                  : "text-white/40"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Review Text */}
                    <p className="text-white/90 leading-relaxed">
                      &ldquo;{testimonials[currentTestimonial].review}&rdquo;
                    </p>

                    {/* Additional Images */}
                    {testimonials[currentTestimonial].images && 
                     testimonials[currentTestimonial].images!.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {testimonials[currentTestimonial].images!.slice(0, 3).map((image, idx) => (
                          <img
                            key={idx}
                            src={image}
                            alt={`Review image ${idx + 1}`}
                            className="h-20 w-20 rounded-lg object-cover border border-lime-300/30"
                          />
                        ))}
                        {testimonials[currentTestimonial].images!.length > 3 && (
                          <div className="h-20 w-20 rounded-lg bg-white/10 flex items-center justify-center border border-lime-300/30">
                            <span className="text-lime-300 text-sm font-semibold">
                              +{testimonials[currentTestimonial].images!.length - 3}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Navigation Controls */}
                  {testimonials.length > 1 && (
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
                      <button
                        onClick={prevTestimonial}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        aria-label="Previous testimonial"
                      >
                        <ChevronLeft className="h-5 w-5 text-white" />
                      </button>
                      
                      <div className="flex gap-2">
                        {testimonials.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setCurrentTestimonial(index)
                              setIsAutoPlaying(false)
                            }}
                            className={`h-2 rounded-full transition-all ${
                              index === currentTestimonial
                                ? "w-8 bg-lime-300"
                                : "w-2 bg-white/40 hover:bg-white/60"
                            }`}
                            aria-label={`Go to testimonial ${index + 1}`}
                          />
                        ))}
                      </div>

                      <button
                        onClick={nextTestimonial}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        aria-label="Next testimonial"
                      >
                        <ChevronRight className="h-5 w-5 text-white" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Fallback if no testimonials
              <div className="space-y-4">
                <p className="text-white/90 leading-relaxed">
                  &ldquo;Their work didn&apos;t just look good, it moved the needle — our audience felt the difference instantly.&rdquo;
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <Image
                    src={"/images/top-rated-1.png"}
                    width={280}
                    height={160}
                    alt="Product sketch concepts"
                    className="h-full w-full rounded-xl border border-white/10 object-cover"
                  />
                  <Image
                    src={"/images/top-rated-2.png"}
                    width={280}
                    height={160}
                    alt="Product showcase"
                    className="h-full w-full rounded-xl border border-white/10 object-cover"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
