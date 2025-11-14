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
            <span className="block">PREMIUM CUSTOM</span>
            <span className="block text-green-600 dark:text-lime-300 drop-shadow-[0_0_20px_rgba(34,197,94,0.35)] dark:drop-shadow-[0_0_20px_rgba(132,204,22,0.35)]">
              SOFTWARE SOLUTIONS
            </span>
            <span className="block">FOR YOUR BUSINESS</span>
          </h1>

          {/* CTA */}
          {/* <div className="mt-6">{buttonNew}</div> */}

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
    <div className="relative rounded-[32px] p-3 shadow-2xl dark-glass-card" style={{
      background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.92) 100%)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: '3px solid rgba(255,255,255,0.6)',
      boxShadow: '0 8px 32px 0 rgba(0,0,0,0.2), inset 0 1px 2px 0 rgba(255,255,255,0.7)'
    }}>
      <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[24px] bg-white dark:bg-black" style={{
        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.1)'
      }}>
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

        <div className="relative z-10 p-4">
          <div className="mx-auto mb-3 h-2 w-20 rounded-full bg-black/40 dark:bg-white/40" style={{
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }} />
          <div className="space-y-2 px-1">
            <div className="text-3xl font-extrabold leading-tight text-black dark:text-white drop-shadow-[0_3px_6px_rgba(0,0,0,0.5)] dark:drop-shadow-[0_3px_10px_rgba(255,255,255,0.3)] [text-shadow:_1px_1px_2px_rgb(0_0_0_/_40%)]">{title}</div>
            <p className="text-sm font-bold text-black dark:text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)] [text-shadow:_1px_1px_1px_rgb(0_0_0_/_30%)]">{sub}</p>
            <div className="mt-4 inline-flex items-center rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-wider shadow-xl dark-badge" style={{
              background: 'linear-gradient(135deg, rgba(34,197,94,1) 0%, rgba(22,163,74,1) 100%)',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.5)',
              boxShadow: '0 4px 12px rgba(34,197,94,0.4), inset 0 1px 2px rgba(255,255,255,0.3)'
            }}>
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
    title: "Web Apps",
    sub: "Custom websites & SaaS platforms",
    tone: "Web Development",
    gradient: "from-[#0b0b0b] via-[#0f172a] to-[#020617]",
    videoSrc:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/A%20new%20chapter%20in%20the%20story%20of%20success.__Introducing%20the%20new%20TAG%20Heuer%20Carrera%20Day-Date%20collection%2C%20reimagined%20with%20bold%20colors%2C%20refined%20finishes%2C%20and%20upgraded%20functionality%20to%20keep%20you%20focused%20on%20your%20goals.%20__Six%20-nDNoRQyFaZ8oaaoty4XaQz8W8E5bqA.mp4",
    poster: "/thumbnails/conversions.jpg",
  },
  {
    title: "3D Web",
    sub: "Immersive 3D experiences & XR",
    tone: "3D Development",
    gradient: "from-[#0b1a0b] via-[#052e16] to-[#022c22]",
    poster: "/thumbnails/speed.jpg",
  },
  {
    title: "Mobile Apps",
    sub: "iOS & Android applications",
    tone: "Mobile Development",
    gradient: "from-[#001028] via-[#0b355e] to-[#052e5e]",
    videoSrc:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Timeline%201-Ku3Y2Hgaw8hCiFEFg1ELtYp631rSzR.webm",
    poster: "/thumbnails/social.jpg",
  },
  {
    title: "Desktop Apps",
    sub: "Windows, macOS & Linux software",
    tone: "Desktop Development",
    gradient: "from-[#0b0b0b] via-[#1f2937] to-[#0b1220]",
    poster: "/thumbnails/standout.jpg",
  },
  {
    title: "Custom Software",
    sub: "Tailored solutions for your needs",
    tone: "Enterprise Solutions",
    gradient: "from-[#0b0b0b] via-[#111827] to-[#052e16]",
    poster: "/thumbnails/premium.jpg",
  },
]
