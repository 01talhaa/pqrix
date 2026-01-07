"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import * as LucideIcons from "lucide-react"

export function ServicesSection() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services')
        const data = await response.json()
        if (data.success) {
          // Show only first 4 services
          setServices(data.data.slice(0, 4))
        }
      } catch (error) {
        console.error('Error fetching services:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  if (loading) {
    return (
      <section id="services" className="container mx-auto px-4 py-16 sm:py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-black dark:text-white sm:text-5xl">Our <span className="text-red-600 dark:text-red-400">Services</span></h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-700 dark:text-gray-300">
            From concept to completion, we deliver premium creative solutions that drive results
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-80 rounded-lg bg-gray-200 dark:bg-white/5 animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  if (services.length === 0) {
    return null
  }
  return (
    <section id="services" className="container mx-auto px-4 py-16 sm:py-20">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-black dark:text-white sm:text-5xl">Our <span className="text-red-600 dark:text-red-400">Services</span></h2>
        <p className="mx-auto max-w-2xl text-lg text-gray-700 dark:text-gray-300">
          From concept to completion, we deliver premium creative solutions that drive results
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => {
          const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Box
          return (
          <Card
            key={service.id}
            className="group liquid-glass border border-gray-200 dark:border-white/10 backdrop-blur-xl transition-all hover:border-gray-300 dark:hover:border-white/20 hover:bg-white/90 dark:hover:bg-white/10"
          >
            <CardHeader>
              <div
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${service.color}`}
              >
                <IconComponent className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl text-black dark:text-white">{service.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">{service.description}</p>
              <ul className="space-y-2">
                {service.features?.map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <div className="h-1 w-1 rounded-full bg-red-500 dark:bg-red-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant="ghost"
                className="group/btn w-full justify-between text-red-600 dark:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-400/10 hover:text-red-700 dark:hover:text-red-300"
              >
                <Link href={`/services/${service.id}`}>
                  Learn More
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )
        })}
      </div>

      <div className="mt-12 text-center">
        <Button
          asChild
          className="rounded-full bg-red-600 dark:bg-red-500 px-8 py-6 text-base font-semibold text-white hover:bg-red-700 dark:hover:bg-red-600"
        >
          <Link href="/services">View All Services</Link>
        </Button>
      </div>
    </section>
  )
}
