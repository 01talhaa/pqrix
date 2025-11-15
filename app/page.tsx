import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import Script from "next/script"
import { StatsSection } from "@/components/stats-section"
import { Features } from "@/components/features"
import { ServicesSection } from "@/components/services-section"
import { InsightsSection } from "@/components/insights-section"
import { CareersSection } from "@/components/careers-section"
import { LogoMarquee } from "@/components/logo-marquee"
import { TechStackMarquee } from "@/components/tech-stack-marquee"
import { Pricing } from "@/components/pricing" // This component is currently commented out
import { LatestInsightsSection } from "@/components/latest-insights-section"
import { AppverseFooter } from "@/components/appverse-footer"
import { ProjectsSection } from "@/components/projects-section"
import { BlogSection } from "@/components/blog-section"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { AdDisplay } from "@/components/ad-display"
import { PqrixChatbot } from "@/components/pqrix-chatbot"

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
      <main className="min-h-[100dvh] text-black dark:text-white">
        <SiteHeader />
        <Hero />
        {/* <StatsSection /> */}
        <ServicesSection />
        <ProjectsSection />
        <TechStackMarquee />
        <InsightsSection />
        {/* <LatestInsightsSection /> */}
        <CareersSection />
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