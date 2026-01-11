import { ArrowRight, Palette, Film, Share2, Sparkles, Layout, Image, Video, Instagram, Youtube, Package, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function PartnerSection() {
  return (
    <section className="container mx-auto px-4 py-16 sm:py-24">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-red-950/20 dark:via-gray-900 dark:to-red-950/20 border border-gray-200 dark:border-white/10">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-red-400/10 dark:bg-red-400/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-400/10 dark:bg-red-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative px-6 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20">
          <div className="mx-auto max-w-5xl">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-red-100 dark:bg-red-950/50 px-4 py-2 backdrop-blur-sm border border-red-200 dark:border-red-800/50">
              <div className="h-2 w-2 rounded-full bg-red-500 dark:bg-red-400 animate-pulse" />
              <span className="text-sm font-semibold text-red-700 dark:text-red-400">
                Trusted Partner
              </span>
            </div>

            {/* Heading */}
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
              Need Creative
              <span className="block text-red-600 dark:text-red-400 mt-2">
                Design Solutions?
              </span>
            </h2>

            {/* Description */}
            <p className="mb-8 text-lg text-gray-700 dark:text-gray-300 sm:text-xl max-w-2xl">
              For professional graphic design, video editing, and social media content creation, 
              we partner with industry experts to deliver exceptional creative services.
            </p>

            {/* Main Service Categories */}
            <div className="mb-10 grid grid-cols-3 gap-6 max-w-xl">
              <div className="group flex flex-col items-center text-center cursor-pointer transition-all duration-300 hover:-translate-y-2">
                <div className="mb-3 rounded-xl bg-white dark:bg-white/5 p-3 shadow-lg dark:shadow-red-500/5 border border-gray-200 dark:border-white/10 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-red-500/30 dark:group-hover:shadow-red-500/30 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-red-50 dark:group-hover:bg-white/10">
                  <Palette className="h-6 w-6 text-red-600 dark:text-red-400 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300 group-hover:text-red-700 dark:group-hover:text-red-300">
                  Graphic Design
                </span>
              </div>
              
              <div className="group flex flex-col items-center text-center cursor-pointer transition-all duration-300 hover:-translate-y-2">
                <div className="mb-3 rounded-xl bg-white dark:bg-white/5 p-3 shadow-lg dark:shadow-red-500/5 border border-gray-200 dark:border-white/10 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-red-500/30 dark:group-hover:shadow-red-500/30 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-red-50 dark:group-hover:bg-white/10">
                  <Film className="h-6 w-6 text-red-600 dark:text-red-400 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300 group-hover:text-red-700 dark:group-hover:text-red-300">
                  Video Editing
                </span>
              </div>
              
              <div className="group flex flex-col items-center text-center cursor-pointer transition-all duration-300 hover:-translate-y-2">
                <div className="mb-3 rounded-xl bg-white dark:bg-white/5 p-3 shadow-lg dark:shadow-red-500/5 border border-gray-200 dark:border-white/10 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-red-500/30 dark:group-hover:shadow-red-500/30 group-hover:scale-110 group-hover:rotate-6 group-hover:bg-red-50 dark:group-hover:bg-white/10">
                  <Share2 className="h-6 w-6 text-red-600 dark:text-red-400 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300 group-hover:text-red-700 dark:group-hover:text-red-300">
                  Social Media
                </span>
              </div>
            </div>

            {/* Detailed Services Grid */}
            <div className="mb-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="group flex items-center gap-2 rounded-lg bg-white/60 dark:bg-white/5 px-3 py-2.5 backdrop-blur-sm border border-gray-200 dark:border-white/10 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/20 dark:hover:shadow-red-500/20 hover:bg-white dark:hover:bg-white/10 hover:border-red-300 dark:hover:border-red-400/50 cursor-pointer hover:-translate-y-1">
                <Layout className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors duration-300">
                  Logo Design
                </span>
              </div>

              <div className="group flex items-center gap-2 rounded-lg bg-white/60 dark:bg-white/5 px-3 py-2.5 backdrop-blur-sm border border-gray-200 dark:border-white/10 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/20 dark:hover:shadow-red-500/20 hover:bg-white dark:hover:bg-white/10 hover:border-red-300 dark:hover:border-red-400/50 cursor-pointer hover:-translate-y-1">
                <Package className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors duration-300">
                  Brand Identity
                </span>
              </div>

              <div className="group flex items-center gap-2 rounded-lg bg-white/60 dark:bg-white/5 px-3 py-2.5 backdrop-blur-sm border border-gray-200 dark:border-white/10 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/20 dark:hover:shadow-red-500/20 hover:bg-white dark:hover:bg-white/10 hover:border-red-300 dark:hover:border-red-400/50 cursor-pointer hover:-translate-y-1">
                <Image className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors duration-300">
                  Thumbnails
                </span>
              </div>

              <div className="group flex items-center gap-2 rounded-lg bg-white/60 dark:bg-white/5 px-3 py-2.5 backdrop-blur-sm border border-gray-200 dark:border-white/10 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/20 dark:hover:shadow-red-500/20 hover:bg-white dark:hover:bg-white/10 hover:border-red-300 dark:hover:border-red-400/50 cursor-pointer hover:-translate-y-1">
                <Sparkles className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors duration-300">
                  Banners & Ads
                </span>
              </div>

              <div className="group flex items-center gap-2 rounded-lg bg-white/60 dark:bg-white/5 px-3 py-2.5 backdrop-blur-sm border border-gray-200 dark:border-white/10 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/20 dark:hover:shadow-red-500/20 hover:bg-white dark:hover:bg-white/10 hover:border-red-300 dark:hover:border-red-400/50 cursor-pointer hover:-translate-y-1">
                <Instagram className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors duration-300">
                  Instagram Reels
                </span>
              </div>

              <div className="group flex items-center gap-2 rounded-lg bg-white/60 dark:bg-white/5 px-3 py-2.5 backdrop-blur-sm border border-gray-200 dark:border-white/10 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/20 dark:hover:shadow-red-500/20 hover:bg-white dark:hover:bg-white/10 hover:border-red-300 dark:hover:border-red-400/50 cursor-pointer hover:-translate-y-1">
                <Youtube className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors duration-300">
                  YouTube Videos
                </span>
              </div>

              <div className="group flex items-center gap-2 rounded-lg bg-white/60 dark:bg-white/5 px-3 py-2.5 backdrop-blur-sm border border-gray-200 dark:border-white/10 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/20 dark:hover:shadow-red-500/20 hover:bg-white dark:hover:bg-white/10 hover:border-red-300 dark:hover:border-red-400/50 cursor-pointer hover:-translate-y-1">
                <Video className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors duration-300">
                  Short Form Content
                </span>
              </div>

              <div className="group flex items-center gap-2 rounded-lg bg-white/60 dark:bg-white/5 px-3 py-2.5 backdrop-blur-sm border border-gray-200 dark:border-white/10 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/20 dark:hover:shadow-red-500/20 hover:bg-white dark:hover:bg-white/10 hover:border-red-300 dark:hover:border-red-400/50 cursor-pointer hover:-translate-y-1">
                <TrendingUp className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors duration-300">
                  Marketing Posts
                </span>
              </div>

              <div className="group flex items-center gap-2 rounded-lg bg-white/60 dark:bg-white/5 px-3 py-2.5 backdrop-blur-sm border border-gray-200 dark:border-white/10 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/20 dark:hover:shadow-red-500/20 hover:bg-white dark:hover:bg-white/10 hover:border-red-300 dark:hover:border-red-400/50 cursor-pointer hover:-translate-y-1">
                <Film className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors duration-300">
                  Promo Videos
                </span>
              </div>

              <div className="group flex items-center gap-2 rounded-lg bg-white/60 dark:bg-white/5 px-3 py-2.5 backdrop-blur-sm border border-gray-200 dark:border-white/10 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/20 dark:hover:shadow-red-500/20 hover:bg-white dark:hover:bg-white/10 hover:border-red-300 dark:hover:border-red-400/50 cursor-pointer hover:-translate-y-1">
                <Palette className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors duration-300">
                  Infographics
                </span>
              </div>

              <div className="group flex items-center gap-2 rounded-lg bg-white/60 dark:bg-white/5 px-3 py-2.5 backdrop-blur-sm border border-gray-200 dark:border-white/10 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/20 dark:hover:shadow-red-500/20 hover:bg-white dark:hover:bg-white/10 hover:border-red-300 dark:hover:border-red-400/50 cursor-pointer hover:-translate-y-1">
                <Share2 className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors duration-300">
                  Story Templates
                </span>
              </div>

              <div className="group flex items-center gap-2 rounded-lg bg-white/60 dark:bg-white/5 px-3 py-2.5 backdrop-blur-sm border border-gray-200 dark:border-white/10 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/20 dark:hover:shadow-red-500/20 hover:bg-white dark:hover:bg-white/10 hover:border-red-300 dark:hover:border-red-400/50 cursor-pointer hover:-translate-y-1">
                <Sparkles className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors duration-300">
                  Motion Graphics
                </span>
              </div>
            </div>

            {/* Additional Services List */}
            <div className="mb-10 rounded-xl bg-white/40 dark:bg-white/5 p-4 sm:p-6 backdrop-blur-sm border border-gray-200 dark:border-white/10 transition-all duration-500 hover:shadow-xl hover:shadow-red-500/10 dark:hover:shadow-red-500/10 hover:border-red-300 dark:hover:border-red-400/30">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Complete Creative Suite:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
                <div className="group flex items-center gap-2 transition-all duration-300 hover:translate-x-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500 dark:bg-red-400 transition-all duration-300 group-hover:scale-150 group-hover:shadow-lg group-hover:shadow-red-500/50" />
                  <span className="transition-colors duration-300 group-hover:text-red-700 dark:group-hover:text-red-300 group-hover:font-semibold">Color Grading & Correction</span>
                </div>
                <div className="group flex items-center gap-2 transition-all duration-300 hover:translate-x-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500 dark:bg-red-400 transition-all duration-300 group-hover:scale-150 group-hover:shadow-lg group-hover:shadow-red-500/50" />
                  <span className="transition-colors duration-300 group-hover:text-red-700 dark:group-hover:text-red-300 group-hover:font-semibold">Audio Mixing & Mastering</span>
                </div>
                <div className="group flex items-center gap-2 transition-all duration-300 hover:translate-x-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500 dark:bg-red-400 transition-all duration-300 group-hover:scale-150 group-hover:shadow-lg group-hover:shadow-red-500/50" />
                  <span className="transition-colors duration-300 group-hover:text-red-700 dark:group-hover:text-red-300 group-hover:font-semibold">Subtitle & Caption Creation</span>
                </div>
                <div className="group flex items-center gap-2 transition-all duration-300 hover:translate-x-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500 dark:bg-red-400 transition-all duration-300 group-hover:scale-150 group-hover:shadow-lg group-hover:shadow-red-500/50" />
                  <span className="transition-colors duration-300 group-hover:text-red-700 dark:group-hover:text-red-300 group-hover:font-semibold">Product Mockups & Packaging</span>
                </div>
                <div className="group flex items-center gap-2 transition-all duration-300 hover:translate-x-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500 dark:bg-red-400 transition-all duration-300 group-hover:scale-150 group-hover:shadow-lg group-hover:shadow-red-500/50" />
                  <span className="transition-colors duration-300 group-hover:text-red-700 dark:group-hover:text-red-300 group-hover:font-semibold">Social Media Strategy</span>
                </div>
                <div className="group flex items-center gap-2 transition-all duration-300 hover:translate-x-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500 dark:bg-red-400 transition-all duration-300 group-hover:scale-150 group-hover:shadow-lg group-hover:shadow-red-500/50" />
                  <span className="transition-colors duration-300 group-hover:text-red-700 dark:group-hover:text-red-300 group-hover:font-semibold">Content Calendar Planning</span>
                </div>
                <div className="group flex items-center gap-2 transition-all duration-300 hover:translate-x-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500 dark:bg-red-400 transition-all duration-300 group-hover:scale-150 group-hover:shadow-lg group-hover:shadow-red-500/50" />
                  <span className="transition-colors duration-300 group-hover:text-red-700 dark:group-hover:text-red-300 group-hover:font-semibold">TikTok & Shorts Editing</span>
                </div>
                <div className="group flex items-center gap-2 transition-all duration-300 hover:translate-x-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500 dark:bg-red-400 transition-all duration-300 group-hover:scale-150 group-hover:shadow-lg group-hover:shadow-red-500/50" />
                  <span className="transition-colors duration-300 group-hover:text-red-700 dark:group-hover:text-red-300 group-hover:font-semibold">Website Graphics & Assets</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex flex-wrap items-center gap-4">
              <Button
                asChild
                size="lg"
                className="group rounded-full bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400 text-white dark:text-black px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Link href="https://pixelprimp.com" target="_blank" rel="noopener noreferrer">
                  Visit PixelPrimp
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex -space-x-2">
                  <div className="h-8 w-8 rounded-full bg-red-500 dark:bg-red-400 border-2 border-white dark:border-gray-900" />
                  <div className="h-8 w-8 rounded-full bg-red-600 dark:bg-red-500 border-2 border-white dark:border-gray-900" />
                  <div className="h-8 w-8 rounded-full bg-red-700 dark:bg-red-600 border-2 border-white dark:border-gray-900" />
                </div>
                <span className="font-medium">Trusted by 500+ clients</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}