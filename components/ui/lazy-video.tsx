"use client"

import React, { useEffect, useRef, useState } from "react"

interface LazyVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string
  poster?: string
}

export default function LazyVideo({ src, poster, ...props }: LazyVideoProps) {
  const [isVisible, setIsVisible] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.25 }
    )

    if (videoRef.current) observer.observe(videoRef.current)

    return () => observer.disconnect()
  }, [])

  return (
    <video
      ref={videoRef}
      poster={poster}
      preload="none"
      {...props}
      src={isVisible ? src : undefined}
    />
  )
}
