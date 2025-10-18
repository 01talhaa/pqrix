"use client"

import { useEffect, useState, useRef } from "react"
import { X } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { AdDocument } from "@/lib/models/Ad"

export function AdDisplay() {
  const [ads, setAds] = useState<AdDocument[]>([])
  const [currentAd, setCurrentAd] = useState<AdDocument | null>(null)
  const [showAd, setShowAd] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const imageTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchAds()

    // Listen for new published ads
    const handleAdPublished = (event: any) => {
      const newAd = event.detail
      if (newAd.status === 'published') {
        setAds(prev => [newAd, ...prev])
        // Show the new ad immediately
        displayAd(newAd)
      }
    }

    window.addEventListener('ad-published', handleAdPublished)
    return () => window.removeEventListener('ad-published', handleAdPublished)
  }, [])

  const fetchAds = async () => {
    try {
      const response = await fetch('/api/ads')
      const data = await response.json()
      if (data.success && data.data.length > 0) {
        setAds(data.data)
        // Pick a random ad to display
        const randomAd = data.data[Math.floor(Math.random() * data.data.length)]
        displayAd(randomAd)
      }
    } catch (error) {
      console.error('Error fetching ads:', error)
    }
  }

  const displayAd = (ad: AdDocument) => {
    setCurrentAd(ad)
    setCurrentImageIndex(0)
    setShowAd(true)
    setIsPaused(false)
    const duration = (ad.displayDuration || 5) * 1000
    setTimeRemaining(duration)
    
    // Auto-hide after duration
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      if (!isPaused) {
        hideAd()
      }
    }, duration)

    // Cycle through images if multiple
    if (ad.images.length > 1) {
      startImageCycle(ad)
    }
  }

  const startImageCycle = (ad: AdDocument) => {
    if (imageTimerRef.current) clearInterval(imageTimerRef.current)
    imageTimerRef.current = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % ad.images.length)
    }, 3000) // Change image every 3 seconds
  }

  const hideAd = () => {
    setShowAd(false)
    if (timerRef.current) clearTimeout(timerRef.current)
    if (imageTimerRef.current) clearInterval(imageTimerRef.current)
  }

  const handleClose = () => {
    hideAd()
  }

  const handleAdClick = () => {
    if (currentAd?.link) {
      window.open(currentAd.link, '_blank', 'noopener,noreferrer')
    }
  }

  const handleMouseEnter = () => {
    setIsPaused(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    if (imageTimerRef.current) clearInterval(imageTimerRef.current)
  }

  const handleMouseLeave = () => {
    if (!currentAd) return
    
    setIsPaused(false)
    
    // Resume timer with remaining time
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      hideAd()
    }, 2000) // Give 2 more seconds after mouse leaves

    // Resume image cycling
    if (currentAd.images.length > 1) {
      startImageCycle(currentAd)
    }
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (imageTimerRef.current) clearInterval(imageTimerRef.current)
    }
  }, [])

  if (!showAd || !currentAd) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={hideAd}
    >
      <Card
        className="relative w-[90vw] h-[85vh] md:w-[70vw] md:h-[75vh] lg:w-[60vw] lg:h-[70vh] max-w-6xl bg-black border-white/20 overflow-hidden shadow-2xl cursor-pointer"
        onClick={(e) => {
          e.stopPropagation()
          handleAdClick()
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleClose()
          }}
          className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-colors backdrop-blur-sm"
          aria-label="Close ad"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Ad Image */}
        <div className="relative w-full h-full">
          <img
            src={currentAd.images[currentImageIndex]}
            alt={currentAd.title}
            className="w-full h-full object-contain"
          />
          
          {/* Gradient Overlay for Title */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
              {currentAd.title}
            </h2>
            {currentAd.description && (
              <p className="text-base md:text-lg text-white/80 line-clamp-2">
                {currentAd.description}
              </p>
            )}
            {currentAd.link && (
              <p className="text-sm text-lime-400 mt-2">
                Click to learn more →
              </p>
            )}
          </div>

          {/* Image Indicators */}
          {currentAd.images.length > 1 && (
            <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-2">
              {currentAd.images.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? 'w-8 bg-lime-400'
                      : 'w-2 bg-white/40'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pause Indicator */}
        {isPaused && (
          <div className="absolute top-4 left-4 bg-lime-400/90 text-black px-3 py-1 rounded-full text-sm font-medium">
            Paused
          </div>
        )}
      </Card>
    </div>
  )
}
