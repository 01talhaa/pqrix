"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import LazyVideo from "./lazy-video"
import { useEffect, useState } from "react"
import type { BannerDocument } from "@/lib/models/Banner"

export function Hero() {
  const [banners, setBanners] = useState<BannerDocument[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBanners()
    
    // Listen for banner updates
    const handleBannerUpdate = () => {
      fetchBanners()
    }
    
    window.addEventListener('banner-published', handleBannerUpdate)
    
    return () => {
      window.removeEventListener('banner-published', handleBannerUpdate)
    }
  }, [])

  const fetchBanners = async () => {
    try {
      const response = await fetch("/api/banners", {
        next: { revalidate: 300 }, // 🚀 Cache for 5 minutes
      })
      const data = await response.json()
      if (data.success && data.data.length > 0) {
        setBanners(data.data)
      } else {
        // Fallback to default banners
        setBanners([])
      }
    } catch (error) {
      console.error("Error fetching banners:", error)
      setBanners([])
    } finally {
      setLoading(false)
    }
  }

  const displayBanners = banners.length > 0 ? banners : phoneData

  const buttonNew = (
    <Button asChild className="rounded-full bg-green-500 dark:bg-lime-400 px-6 text-white dark:text-black hover:bg-green-600 dark:hover:bg-lime-300">
      <a href="https://wa.link/rc25na" target="_blank" rel="noopener noreferrer">
        Chat With Us
      </a>
    </Button>
  )

  return (
    <section className="relative isolate overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center py-14 sm:py-20">
          {/* Logo */}
          <div className="mb-5 flex items-center gap-2">
            <Image
              src="/icons/pqrix-white.svg"
              alt="Pqrix logo"
              width={32}
              height={32}
              className="h-8 w-8 dark:invert-0 invert"
            />
            <p className="text-sm uppercase tracking-[0.25em] text-green-600 dark:text-lime-300/80">pqrix</p>
          </div>

          {/* Heading */}
          <h1 className="mt-3 text-center text-4xl font-extrabold tracking-tight text-black dark:text-white sm:text-5xl md:text-6xl">
            <span className="block">HIGH-IMPACT</span>
            <span className="block text-green-600 dark:text-lime-300 drop-shadow-[0_0_20px_rgba(34,197,94,0.35)] dark:drop-shadow-[0_0_20px_rgba(132,204,22,0.35)]">
              3D ANIMATION
            </span>
            <span className="block">FOR BRANDS</span>
          </h1>

          {/* CTA */}
          <div className="mt-6">{buttonNew}</div>

          {/* Phone Grid */}
          <div className="mt-10 grid w-full gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 dark:border-lime-400"></div>
              </div>
            ) : (
              displayBanners.map((item, i) => {
                const visibility =
                  i <= 2
                    ? "block"
                    : i === 3
                    ? "hidden md:block"
                    : i === 4
                    ? "hidden xl:block"
                    : "hidden"

                // Check if item is a banner or phoneData
                const isBanner = 'media' in item
                
                if (isBanner) {
                  const banner = item as BannerDocument
                  
                  return (
                    <div key={banner.id} className={visibility}>
                      <PhoneCard
                        title={banner.title}
                        sub={banner.subtitle}
                        tone={banner.tone}
                        gradient={banner.gradient || "from-[#0b0b0b] via-[#1f2937] to-[#0b1220]"}
                        media={banner.media}
                        displayStyle={banner.displayStyle}
                      />
                    </div>
                  )
                } else {
                  return (
                    <div key={i} className={visibility}>
                      <PhoneCard {...(item as any)} />
                    </div>
                  )
                }
              })
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function PhoneCard({
  title,
  sub,
  tone,
  gradient,
  videoSrc,
  imageSrc,
  poster,
  media,
  displayStyle,
}: {
  title: string
  sub: string
  tone: string
  gradient: string
  videoSrc?: string
  imageSrc?: string
  poster?: string
  media?: { url: string; type: 'image' | 'video'; posterUrl?: string }[]
  displayStyle?: 'autoplay' | 'slider' | 'static'
}) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Slider functionality - auto cycle through media items
  useEffect(() => {
    if (displayStyle === 'slider' && media && media.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % media.length)
      }, 4000) // Change slide every 4 seconds

      return () => clearInterval(interval)
    }
  }, [displayStyle, media])

  // Determine what to display
  const currentMedia = media && media.length > 0 ? media[currentIndex] : null
  const finalVideoSrc = currentMedia?.type === 'video' ? currentMedia.url : videoSrc
  const finalImageSrc = currentMedia?.type === 'image' ? currentMedia.url : imageSrc
  const finalPoster = currentMedia?.type === 'video' ? currentMedia.posterUrl : poster

  return (
    <div className="relative rounded-[28px] glass-border bg-gray-100 dark:bg-neutral-900 p-2">
      <div className="relative aspect-[9/19] w-full overflow-hidden rounded-2xl bg-white dark:bg-black">
        {finalImageSrc ? (
          // Static Image
          <img
            src={finalImageSrc}
            alt={`${title} - ${sub}`}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
          />
        ) : (
          // Video
          <LazyVideo
            key={finalVideoSrc} // Key forces re-render when video changes
            src={
              finalVideoSrc ??
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/b0f3222371106db366a14ca1c29cef55-1b1EWVSa4w3FL2zslcaCGYTy9vcxjF.mp4"
            }
            poster={finalPoster ?? "/thumbnails/default.jpg"}
            className="absolute inset-0 h-full w-full object-cover"
            {...({ autoPlay: true, loop: true, muted: true, playsInline: true } as any)}
            aria-label={`${title} - ${sub}`}
          />
        )}

        <div className="relative z-10 p-3">
          <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-black/20 dark:bg-white/20" />
          <div className="space-y-1 px-1">
            <div className="text-3xl font-bold leading-snug text-black/90 dark:text-white/90">{title}</div>
            <p className="text-xs text-black/70 dark:text-white/70">{sub}</p>
            <div className="mt-3 inline-flex items-center rounded-full bg-white/60 dark:bg-black/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-green-700 dark:text-lime-300">
              {tone}
            </div>
          </div>
        </div>

        {/* Slider Indicators */}
        {displayStyle === 'slider' && media && media.length > 1 && (
          <div className="absolute bottom-16 left-0 right-0 z-20 flex justify-center gap-1.5">
            {media.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'w-6 bg-green-500 dark:bg-lime-400'
                    : 'w-1.5 bg-black/30 dark:bg-white/30 hover:bg-black/50 dark:hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const phoneData = [
  {
    title: "Conversions",
    sub: "Turn clicks into paying customers.",
    tone: "results",
    gradient: "from-[#0b0b0b] via-[#0f172a] to-[#020617]",
    videoSrc:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/A%20new%20chapter%20in%20the%20story%20of%20success.__Introducing%20the%20new%20TAG%20Heuer%20Carrera%20Day-Date%20collection%2C%20reimagined%20with%20bold%20colors%2C%20refined%20finishes%2C%20and%20upgraded%20functionality%20to%20keep%20you%20focused%20on%20your%20goals.%20__Six%20-nDNoRQyFaZ8oaaoty4XaQz8W8E5bqA.mp4",
    poster: "/thumbnails/conversions.jpg",
  },
  {
    title: "Speed",
    sub: "Launch in days, not weeks.",
    tone: "speed",
    gradient: "from-[#0b1a0b] via-[#052e16] to-[#022c22]",
    poster: "/thumbnails/speed.jpg",
  },
  {
    title: "Social-Ready",
    sub: "Made for IG, TikTok, and Meta.",
    tone: "social",
    gradient: "from-[#001028] via-[#0b355e] to-[#052e5e]",
    videoSrc:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Timeline%201-Ku3Y2Hgaw8hCiFEFg1ELtYp631rSzR.webm",
    poster: "/thumbnails/social.jpg",
  },
  {
    title: "Standout",
    sub: "Be the product no one scrolls past.",
    tone: "standout",
    gradient: "from-[#0b0b0b] via-[#1f2937] to-[#0b1220]",
    poster: "/thumbnails/standout.jpg",
  },
  {
    title: "Premium",
    sub: "Look like the market leader.",
    tone: "premium",
    gradient: "from-[#0b0b0b] via-[#111827] to-[#052e16]",
    poster: "/thumbnails/premium.jpg",
  },
]
