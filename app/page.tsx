import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import Script from "next/script"
import dynamicImport from "next/dynamic"

// 🚀 Lazy load heavy components
const Features = dynamicImport(() => import("@/components/features").then(mod => ({ default: mod.Features })), {
  loading: () => <div className="h-96 animate-pulse bg-black/20" />,
})
const ServicesSection = dynamicImport(() => import("@/components/services-section").then(mod => ({ default: mod.ServicesSection })), {
  loading: () => <div className="h-96 animate-pulse bg-black/20" />,
})
const LogoMarquee = dynamicImport(() => import("@/components/logo-marquee").then(mod => ({ default: mod.LogoMarquee })), {
  loading: () => <div className="h-32 animate-pulse bg-black/20" />,
})
const TechStackMarquee = dynamicImport(() => import("@/components/tech-stack-marquee").then(mod => ({ default: mod.TechStackMarquee })), {
  loading: () => <div className="h-32 animate-pulse bg-black/20" />,
})
const Pricing = dynamicImport(() => import("@/components/pricing").then(mod => ({ default: mod.Pricing })), {
  loading: () => <div className="h-96 animate-pulse bg-black/20" />,
})
const AppverseFooter = dynamicImport(() => import("@/components/appverse-footer").then(mod => ({ default: mod.AppverseFooter })), {
  loading: () => <div className="h-64 animate-pulse bg-black/20" />,
})
const ProjectsSection = dynamicImport(() => import("@/components/projects-section").then(mod => ({ default: mod.ProjectsSection })), {
  loading: () => <div className="h-96 animate-pulse bg-black/20" />,
})
const BlogSection = dynamicImport(() => import("@/components/blog-section").then(mod => ({ default: mod.BlogSection })), {
  loading: () => <div className="h-96 animate-pulse bg-black/20" />,
})
const WhatsAppButton = dynamicImport(() => import("@/components/whatsapp-button").then(mod => ({ default: mod.WhatsAppButton })))
const AdDisplay = dynamicImport(() => import("@/components/ad-display").then(mod => ({ default: mod.AdDisplay })))
const PqrixChatbot = dynamicImport(() => import("@/components/pqrix-chatbot").then(mod => ({ default: mod.PqrixChatbot })))

// ✅ Force static generation for low TTFB
export const dynamic = "force-static"

export default function Page() {
  // Structured data for pricing
  const pricingStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPageElement",
    "@id": "https://pqrix.com/#pricing",
    name: "Pricing Plans",
    description: "Software development pricing plans for Discovery, Web/SaaS, Mobile, 3D Web, and Desktop solutions",
    url: "https://pqrix.com/#pricing",
    mainEntity: {
      "@type": "PriceSpecification",
      name: "Software Development Services",
      description: "Professional software development services with comprehensive pricing packages",
      offers: [
        {
          "@type": "Offer",
          name: "Discovery & Strategy",
          price: "8500",
          priceCurrency: "BDT",
          description: "Technical blueprint, wireframing, and project planning",
        },
        {
          "@type": "Offer",
          name: "Web & SaaS Development",
          price: "35000",
          priceCurrency: "BDT",
          description: "Custom web applications, CRM, ERP, and SaaS solutions",
        },
        {
          "@type": "Offer",
          name: "Mobile App Development",
          price: "75000",
          priceCurrency: "BDT",
          description: "iOS, Android, and cross-platform mobile applications",
        },
      ],
    },
  }

    // Structured data for main page
  const pageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://pqrix.com/",
    name: "Pqrix | Software Development Company in Bangladesh",
    description:
      "Leading software development company in Bangladesh offering Discovery & Strategy, Web/SaaS Development, Mobile Apps, 3D Web/XR, and Desktop solutions with local payment integration.",
    url: "https://pqrix.com/",
    mainEntity: {
      "@type": "Organization",
      name: "Pqrix",
      url: "https://pqrix.com",
      sameAs: [
        "https://twitter.com/pqrix",
        "https://www.youtube.com/@pqrix",
        "https://instagram.com/pqrix",
        "https://threads.com/pqrix",
      ],
    },
    hasPart: [
      {
        "@type": "WebPageElement",
        "@id": "https://pqrix.com/#pricing",
        name: "Pricing Section",
        url: "https://pqrix.com/#pricing",
      },
    ],
  }

  return (
    <>
      <main className="min-h-[100dvh] text-white">
        <SiteHeader />
        <Hero />
        <ServicesSection />
        <ProjectsSection />
        <TechStackMarquee />
        <BlogSection />
        <Features />
        {/* <LogoMarquee /> */}
        {/* <Pricing /> */}
        <AppverseFooter />
      </main>
      
      {/* WhatsApp Floating Button */}
      <WhatsAppButton />

      {/* Ad Display Modal */}
      <AdDisplay />

      {/* AI Chatbot */}
      <PqrixChatbot />

      {/* JSON-LD structured data */}
      <Script
        id="pricing-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pricingStructuredData),
        }}
      />

      <Script
        id="page-structured-data"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pageStructuredData),
        }}
      />
    </>
  )
}
