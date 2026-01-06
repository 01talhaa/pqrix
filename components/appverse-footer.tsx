"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Instagram, Twitter, Youtube, MessageCircle } from "lucide-react"
import LazyVideo from "./lazy-video"
import Image from "next/image"

interface FooterContent {
  tagline: string
  copyright: string
}

const defaultContent: FooterContent = {
  tagline:
    "Professional software development company delivering custom web, mobile, and desktop solutions tailored to your business needs.",
  copyright: "© 2025 — Pqrix",
}

export function AppverseFooter() {
  const [content, setContent] = useState<FooterContent>(defaultContent)

  useEffect(() => {
    const savedContent = localStorage.getItem("pqrix-content")
    if (savedContent) {
      try {
        const parsed = JSON.parse(savedContent)
        if (parsed.footer) {
          setContent(parsed.footer)
        }
      } catch (error) {
        console.error("Error parsing saved content:", error)
      }
    }
  }, [])

  return (
    <section className="text-black dark:text-white">
      {/* Contact CTA */}
      {/* <div className="container mx-auto px-4 pt-12 sm:pt-16">
        <div className="flex justify-center">
          <Button
            asChild
            className="rounded-full bg-red-600 dark:bg-red-500 px-6 py-2 text-sm font-medium text-white dark:text-black shadow-[0_0_20px_rgba(220,38,38,0.35)] dark:shadow-[0_0_20px_rgba(220,38,38,0.35)] hover:bg-red-700 dark:hover:bg-red-600"
          >
            <a
              href="https://wa.me/8801878377992"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact us
            </a>
          </Button>
        </div>
      </div> */}

      {/* Download the app */}
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <Card className="relative overflow-hidden rounded-3xl liquid-glass p-6 sm:p-10">
          <div className="relative grid items-center gap-8 md:grid-cols-2">
            {/* Left copy */}
            <div>
              <p className="mb-2 text-[11px] tracking-widest text-red-600 dark:text-red-400">
                STREAMLINE YOUR WORKFLOW
              </p>
              <h3 className="text-2xl font-bold leading-tight text-black dark:text-white sm:text-3xl">
                Collaborate &amp; manage your software projects from anywhere
              </h3>
              <p className="mt-2 max-w-prose text-sm text-gray-600 dark:text-neutral-400">
                Track progress, review deliverables, provide feedback, and approve milestones
                using our project management &amp; collaboration platform.
              </p>
            </div>

            {/* Right mockup — hidden on mobile */}
            <div className="mx-auto w-full max-w-[320px] hidden md:block">
              <div className="relative rounded-[28px] liquid-glass p-2 shadow-2xl">
                <div className="relative aspect-[9/19] w-full overflow-hidden rounded-2xl bg-black">
                  <LazyVideo
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Timeline%202-YFaCK7cEiHWSMRv8XEHaLCoYj2SUAi.mp4"
                    className="absolute inset-0 h-full w-full object-cover"
                    poster=""
                  />
                  {/* On-screen content */}
                  <div className="relative p-3">
                    <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-white/20" />
                    <div className="space-y-1 px-1">
                      <div className="text-5xl font-extrabold text-red-600 dark:text-red-400">
                        Project Management
                      </div>
                      <p className="text-xs text-white/80">
                        From concept to deployment in one place
                      </p>
                      <div className="mt-3 inline-flex items-center rounded-full bg-black/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-red-400 dark:text-red-400">
                        Seamless Workflow
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-white/10 pb-20 md:pb-10">
        <div className="container mx-auto px-4 py-10">
          <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
            {/* Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5">
                {/* <Image
                  src="/icons/pqrix-icon.svg"
                  alt="Pqrix Logo"
                  width={48}
                  height={48}
                  className="h-12 w-12"
                /> */}
                <span className="text-xl font-semibold text-red-600 dark:text-red-400">
                  Pqrix
                </span>
              </div>
              <p className="max-w-sm text-sm text-gray-600 dark:text-neutral-400">
                {content.tagline}
              </p>
            </div>

            {/* Navigation */}
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-2">
              <div>
                <h5 className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-600 dark:text-neutral-400">
                  Navigation
                </h5>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-neutral-300">
                  {[
                    "Home",
                    "Features",
                    "Testimonials",
                    "Pricing",
                    "Blog",
                    "Download",
                  ].map((item) => (
                    <li key={item}>
                      <Link
                        href={`#${item.toLowerCase()}`}
                        className="hover:text-red-400"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-600 dark:text-neutral-400">
                  Social media
                </h5>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-neutral-300">
                  <li className="flex items-center gap-2">
                    <Twitter className="h-4 w-4 text-gray-600 dark:text-neutral-400" />
                    <a
                      href="https://twitter.com/pqrix"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-green-600 dark:hover:text-red-400"
                      aria-label="Follow pqrix on Twitter"
                    >
                      X/Twitter
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <Youtube className="h-4 w-4 text-gray-600 dark:text-neutral-400" />
                    <a
                      href="https://www.youtube.com/@pqrixinternational"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-green-600 dark:hover:text-red-400"
                      aria-label="Subscribe to pqrix on YouTube"
                    >
                      YouTube
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <Instagram className="h-4 w-4 text-gray-600 dark:text-neutral-400" />
                    <a
                      href="https://instagram.com/pqrix"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-green-600 dark:hover:text-red-400"
                      aria-label="Follow pqrix on Instagram"
                    >
                      Instagram
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-gray-600 dark:text-neutral-400" />
                    <a
                      href="https://threads.com/pqrix"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-green-600 dark:hover:text-red-400"
                      aria-label="Follow pqrix on Threads"
                    >
                      Threads
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-gray-200 dark:border-white/10 pt-6 text-xs text-gray-600 dark:text-neutral-500 sm:flex-row">
            <p>{content.copyright}</p>
            <div className="flex items-center gap-6">
              <Link href="/revisions" className="hover:text-green-600 dark:hover:text-red-400">
                Revision Policy
              </Link>
              <Link href="/t&c" className="hover:text-green-600 dark:hover:text-red-400">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </section>
  )
}
