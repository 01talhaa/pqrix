import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Script from "next/script"
import { BookingForm } from "@/components/booking-form"
import { notFound } from "next/navigation"
import { getAllServicesForBuild, getServiceByIdForBuild } from "@/lib/get-services"
import * as LucideIcons from "lucide-react"


// ISR configuration
export const dynamic = 'force-static'
export const revalidate = 60
export const dynamicParams = true

export async function generateStaticParams() {
  const services = await getAllServicesForBuild()
  return services.map((service: any) => ({ id: service.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const service = await getServiceByIdForBuild(id)
  if (!service) return {}

  // Generate comprehensive keywords based on service
  const baseKeywords = [
    (service as any).title,
    `${(service as any).title} Bangladesh`,
    `${(service as any).title} BD`,
    `${(service as any).title} services`,
    `professional ${(service as any).title}`,
    `${(service as any).title} company Bangladesh`,
    "software development Bangladesh",
    "IT services BD",
  ]

  // Add service-specific keywords
  const serviceSpecificKeywords = (service as any).features?.map((f: string) => 
    f.toLowerCase().replace(/[^a-z0-9\s]/g, '')
  ) || []

  // Add pricing keywords
  const pricingKeywords = (service as any).packages 
    ? (service as any).packages.map((pkg: any) => `${(service as any).title} ${pkg.name} ${pkg.price}`)
    : []

  const allKeywords = [
    ...baseKeywords,
    ...serviceSpecificKeywords,
    ...pricingKeywords,
    "affordable software development",
    "fixed price quote",
    "Bangladesh tech services"
  ].join(", ")

  const s = service as any
  const description = s.longDescription 
    ? `${s.longDescription.slice(0, 150)}... Professional ${s.title} services in Bangladesh with packages starting from ${s.pricing || 'competitive rates'}. Expert team, fixed-price quotes, local payment support (bKash/Nagad).`
    : `${s.description} Expert ${s.title} services in Bangladesh starting from ${s.pricing || 'competitive rates'}. Get a detailed quote with comprehensive SOW and technical specifications.`

  return {
    title: `${s.title} Services Bangladesh | ${s.tagline} | Pqrix`,
    description,
    keywords: allKeywords,
    openGraph: {
      title: `${s.title} Services in Bangladesh | Pqrix`,
      description: `${s.description} Starting from ${s.pricing || 'competitive rates'}. Expert team, fixed-price quotes, local payment integration (bKash/Nagad).`,
      type: "website",
      url: `https://pqrix.com/services/${s.id}`,
      images: [
        {
          url: s.image || "/icons/pqrix-logo.png",
          width: 1200,
          height: 630,
          alt: `${s.title} Services by Pqrix Bangladesh`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${s.title} Services Bangladesh | Pqrix`,
      description: `${s.tagline}. Starting ${s.pricing || 'competitive rates'}. bKash/Nagad accepted.`,
      images: [s.image || "/icons/pqrix-logo.png"],
    },
    alternates: {
      canonical: `https://pqrix.com/services/${s.id}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // Hybrid data fetching
  const isProductionBuild = process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL;
  let service: any
  
  if (isProductionBuild) {
    service = await getServiceByIdForBuild(id)
  } else {
    try {
      const baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      
      const response = await fetch(`${baseUrl}/api/services/${id}`, {
        next: { revalidate: 60 }
      })
      
      if (response.ok) {
        const data = await response.json()
        service = data.success ? data.data : null
      } else {
        service = await getServiceByIdForBuild(id)
      }
    } catch (error) {
      console.error('API fetch failed, falling back to database:', error)
      service = await getServiceByIdForBuild(id)
    }
  }

  if (!service) {
    notFound()
  }

  // Convert icon string to component
  const Icon = (LucideIcons as any)[service.icon] || LucideIcons.Box

  return (
    <>
      <main className="min-h-[100dvh] text-black dark:text-white">
        <SiteHeader />

        {/* Back Button */}
        <div className="container mx-auto px-4 pt-8">
          <Button asChild variant="ghost" className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white">
            <Link href="/services">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Services
            </Link>
          </Button>
        </div>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <div
                className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${service.color}`}
              >
                <Icon className="h-8 w-8 text-white" />
              </div>
              <p className="text-sm font-medium text-green-600 dark:text-lime-400 mb-3">{service.tagline}</p>
              <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-black dark:text-white">
                {service.title}
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">{service.description}</p>
              <p className="text-gray-600 dark:text-gray-400">{service.longDescription}</p>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden liquid-glass border border-gray-200 dark:border-white/10">
              <img
                src={service.image || "/placeholder.svg"}
                alt={service.title}
                className="h-full w-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color}`} />
            </div>
          </div>
        </section>

        {/* Stats */}
        {service.stats && service.stats.length > 0 && (
          <section className="container mx-auto px-4 pb-12">
            <div className="grid gap-6 sm:grid-cols-3">
              {service.stats.map((stat: any, idx: number) => {
                const StatIcon = (LucideIcons as any)[stat.icon] || LucideIcons.Award
                return (
                  <Card
                    key={idx}
                    className="liquid-glass border border-gray-200 dark:border-white/10 backdrop-blur-xl text-center p-6"
                  >
                    <StatIcon className="h-8 w-8 text-green-500 dark:text-lime-400 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-black dark:text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </Card>
                )
              })}
            </div>
          </section>
        )}

        {/* Features */}
        <section className="container mx-auto px-4 pb-12">
          <Card className="liquid-glass border border-gray-200 dark:border-white/10 backdrop-blur-xl p-8">
            <h2 className="text-2xl font-bold text-black dark:text-white mb-6">What's Included</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {service.features.map((feature: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 dark:text-lime-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Process */}
        {service.process && (
          <section className="container mx-auto px-4 pb-12">
            <h2 className="text-3xl font-bold text-black dark:text-white mb-8 text-center">Our Process</h2>
            <div className="grid gap-6 md:grid-cols-5">
              {service.process.map((item: any, idx: number) => (
                <Card
                  key={idx}
                  className="liquid-glass border border-gray-200 dark:border-white/10 backdrop-blur-xl p-6 text-center"
                >
                  <div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-lime-400/20 text-green-600 dark:text-lime-400 font-bold">
                    {idx + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-2">{item.step}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Packages */}
        {service.packages && (
          <section className="container mx-auto px-4 pb-12">
            <h2 className="text-3xl font-bold text-black dark:text-white mb-8 text-center">Choose Your Package</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {service.packages.map((pkg: any, idx: number) => (
                <Card
                  key={idx}
                  className={`liquid-glass border backdrop-blur-xl p-6 relative ${
                    pkg.popular ? "border-green-500/50 dark:border-lime-400/50 bg-green-50 dark:bg-lime-400/5" : "border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5"
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 dark:bg-lime-400 text-white dark:text-black text-xs font-bold px-3 py-1 rounded-full">
                      MOST POPULAR
                    </div>
                  )}
                  <CardContent className="p-0 space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-black dark:text-white mb-2">{pkg.name}</h3>
                      <div className="text-4xl font-extrabold text-green-600 dark:text-lime-400 mb-1">{pkg.price}</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{pkg.duration}</p>
                    </div>
                    <ul className="space-y-3">
                      {pkg.features.map((feature: string, fidx: number) => (
                        <li key={fidx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <Check className="h-4 w-4 text-green-500 dark:text-lime-400 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      asChild
                      className={`w-full rounded-full ${
                        pkg.popular
                          ? "bg-green-500 dark:bg-lime-400 text-white dark:text-black hover:bg-green-600 dark:hover:bg-lime-300"
                          : "bg-gray-200 dark:bg-white/10 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-white/20"
                      }`}
                    >
                      <Link href={`/checkout?service=${service.id}&package=${idx}`}>Select Package</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Booking Form */}
        {service.packages && (
          <section id="booking" className="container mx-auto px-4 pb-16 sm:pb-24">
            <Card className="liquid-glass-enhanced border border-gray-200 dark:border-white/15 backdrop-blur-xl p-8 sm:p-12 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-black dark:text-white mb-4 text-center">Book This Service</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-8 text-center">
                Fill out the form below and we'll get back to you within 24 hours
              </p>
              <BookingForm serviceId={service.id} serviceName={service.title} packages={service.packages} />
            </Card>
          </section>
        )}

        <AppverseFooter />
      </main>
      
      {/* Structured Data for Service */}
      <Script
        id="service-detail-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": service.title,
            "name": service.title,
            "description": service.longDescription || service.description,
            "provider": {
              "@type": "Organization",
              "name": "Pqrix",
              "url": "https://pqrix.com"
            },
            "areaServed": {
              "@type": "Place",
              "name": "Worldwide"
            },
            "hasOfferCatalog": service.packages ? {
              "@type": "OfferCatalog",
              "name": `${service.title} Packages`,
              "itemListElement": service.packages.map((pkg: any, idx: number) => ({
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": `${service.title} - ${pkg.name}`,
                  "description": pkg.features.join(", ")
                },
                "price": pkg.price,
                "priceCurrency": "USD"
              }))
            } : undefined,
            "offers": service.packages ? service.packages.map((pkg: any) => ({
              "@type": "Offer",
              "name": pkg.name,
              "price": pkg.price,
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock",
              "url": `https://pqrix.com/services/${service.id}`,
              "seller": {
                "@type": "Organization",
                "name": "Pqrix"
              }
            })) : undefined
          })
        }}
      />
    </>
  )
}
