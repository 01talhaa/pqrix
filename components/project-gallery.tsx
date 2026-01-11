'use client'

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react"

interface ProjectGalleryProps {
  images: string[]
  mainImage?: string
  video?: string
  title: string
}

export function ProjectGalleryWithGrid({ images, mainImage, video, title }: ProjectGalleryProps) {
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // Combine all images (main + gallery)
  const allImages = [
    mainImage,
    ...(images || [])
  ].filter((img, index, self) => img && self.indexOf(img) === index) as string[]

  const openGallery = (index: number) => {
    setCurrentImageIndex(index)
    setGalleryOpen(true)
    setZoom(1)
    setPosition({ x: 0, y: 0 })
    document.body.style.overflow = 'hidden'
  }

  const closeGallery = () => {
    setGalleryOpen(false)
    setZoom(1)
    setPosition({ x: 0, y: 0 })
    document.body.style.overflow = ''
  }

  const navigateGallery = (direction: 'prev' | 'next') => {
    setZoom(1)
    setPosition({ x: 0, y: 0 })
    if (direction === 'prev') {
      setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
    } else {
      setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
    }
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 3))
  }

  const handleZoomOut = () => {
    setZoom((prev) => {
      const newZoom = Math.max(prev - 0.5, 1)
      if (newZoom === 1) {
        setPosition({ x: 0, y: 0 })
      }
      return newZoom
    })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!galleryOpen) return
      
      if (e.key === 'Escape') closeGallery()
      if (e.key === 'ArrowLeft') navigateGallery('prev')
      if (e.key === 'ArrowRight') navigateGallery('next')
      if (e.key === '+' || e.key === '=') handleZoomIn()
      if (e.key === '-') handleZoomOut()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [galleryOpen])

  return (
    <>
      {/* Main Media with click to open gallery */}
      <div 
        className="relative aspect-video rounded-2xl overflow-hidden liquid-glass border border-red-500/20 shadow-xl shadow-red-900/20 cursor-pointer group"
        onClick={() => !video && openGallery(0)}
      >
        {video ? (
          <video
            src={video}
            className="h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            controls
          />
        ) : (
          <>
            <img
              src={mainImage || images?.[0] || "/placeholder.svg"}
              alt={title}
              className="transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1 }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                  <ZoomIn className="h-8 w-8 text-white" />
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>

      {/* Image Gallery Grid - Full Width Section */}
      {images && images.length > 0 && (
        <section className="container mx-auto px-4 pb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Project Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image: string, idx: number) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openGallery(mainImage ? idx + 1 : idx)}
                className="relative aspect-square rounded-xl overflow-hidden liquid-glass border border-red-500/20 hover:border-red-500/40 transition-all cursor-pointer shadow-lg shadow-red-900/10 group"
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${title} - Image ${idx + 1}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}



      {/* Gallery Modal */}
      <AnimatePresence>
        {galleryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center"
            onClick={(e) => e.target === e.currentTarget && closeGallery()}
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={closeGallery}
              className="absolute top-4 right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
            >
              <X className="h-6 w-6 text-white" />
            </motion.button>

            {/* Zoom Controls */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 1}
                className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ZoomOut className="h-5 w-5 text-white" />
              </button>
              <span className="text-white text-sm font-medium min-w-[3rem] text-center">{Math.round(zoom * 100)}%</span>
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 3}
                className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ZoomIn className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* Image Counter */}
            <div className="absolute top-4 left-4 z-50 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
              <span className="text-white text-sm font-medium">
                {currentImageIndex + 1} / {allImages.length}
              </span>
            </div>

            {/* Navigation Arrows */}
            {allImages.length > 1 && (
              <>
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={() => navigateGallery('prev')}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
                >
                  <ChevronLeft className="h-8 w-8 text-white" />
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onClick={() => navigateGallery('next')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
                >
                  <ChevronRight className="h-8 w-8 text-white" />
                </motion.button>
              </>
            )}

            {/* Main Image */}
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-[90vw] max-h-[80vh] overflow-hidden"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
            >
              <img
                src={allImages[currentImageIndex]}
                alt={`${title} - Image ${currentImageIndex + 1}`}
                className="max-w-full max-h-[80vh] object-contain rounded-lg select-none"
                style={{
                  transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                  transition: isDragging ? 'none' : 'transform 0.2s ease-out'
                }}
                draggable={false}
              />
            </motion.div>

            {/* Thumbnail Strip */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 px-4 py-3 bg-black/50 backdrop-blur-sm rounded-xl border border-white/10 max-w-[90vw] overflow-x-auto">
                {allImages.map((img, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setCurrentImageIndex(idx)
                      setZoom(1)
                      setPosition({ x: 0, y: 0 })
                    }}
                    className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === currentImageIndex 
                        ? 'border-red-500 ring-2 ring-red-500/50' 
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

