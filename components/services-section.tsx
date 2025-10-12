"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Video, Palette, Zap, ArrowRight } from "lucide-react"
import Link from "next/link"

const services = [
  {
    id: "3d-animation",
    icon: Video,
    title: "3D Animation",
    description: "Stunning 3D animations that bring your products and ideas to life with cinematic quality.",
    features: ["Product Visualization", "Character Animation", "Motion Graphics"],
    color: "from-purple-500/20 to-violet-500/20",
  },
  {
    id: "brand-identity",
    icon: Palette,
    title: "Brand Identity",
    description: "Complete brand identity design including logos, color schemes, and visual guidelines.",
    features: ["Logo Design", "Brand Guidelines", "Visual Systems"],
    color: "from-lime-500/20 to-green-500/20",
  },
  {
    id: "motion-design",
    icon: Sparkles,
    title: "Motion Design",
    description: "Eye-catching motion graphics for social media, ads, and digital campaigns.",
    features: ["Social Media Content", "Ad Campaigns", "UI Animations"],
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: "creative-direction",
    icon: Zap,
    title: "Creative Direction",
    description: "Strategic creative direction to ensure your brand stands out in the market.",
    features: ["Strategy Development", "Art Direction", "Campaign Planning"],
    color: "from-pink-500/20 to-rose-500/20",
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="container mx-auto px-4 py-16 sm:py-20">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Our Services</h2>
        <p className="mx-auto max-w-2xl text-lg text-gray-300">
          From concept to completion, we deliver premium creative solutions that drive results
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => (
          <Card
            key={service.id}
            className="group liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/10"
          >
            <CardHeader>
              <div
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${service.color}`}
              >
                <service.icon className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl text-white">{service.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-300">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-gray-400">
                    <div className="h-1 w-1 rounded-full bg-lime-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant="ghost"
                className="group/btn w-full justify-between text-lime-400 hover:bg-lime-400/10 hover:text-lime-300"
              >
                <Link href={`/services/${service.id}`}>
                  Learn More
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button
          asChild
          className="rounded-full bg-lime-400 px-8 py-6 text-base font-semibold text-black hover:bg-lime-300"
        >
          <Link href="/services">View All Services</Link>
        </Button>
      </div>
    </section>
  )
}
