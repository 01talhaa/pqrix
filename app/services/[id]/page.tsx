import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Video, Palette, Sparkles, Zap, Check, Clock, Users, Award, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { BookingForm } from "@/components/booking-form"
import { notFound } from "next/navigation"

const servicesData: Record<string, any> = {
  "3d-animation": {
    id: "3d-animation",
    icon: Video,
    title: "3D Animation",
    tagline: "Bring Your Vision to Life",
    description:
      "Create stunning 3D animations that captivate your audience and elevate your brand. From product visualizations to character animations, we deliver cinematic quality that drives engagement and conversions.",
    longDescription:
      "Our 3D animation services combine cutting-edge technology with artistic excellence to create visuals that leave a lasting impression. Whether you need product demonstrations, character animations, or architectural walkthroughs, our team brings years of experience and a passion for storytelling to every project.",
    features: [
      "Product Visualization & Rendering",
      "Character Animation & Rigging",
      "Motion Graphics & VFX",
      "Architectural Visualization",
      "Medical & Technical Animation",
      "Social Media Content",
    ],
    process: [
      { step: "Discovery", description: "We learn about your brand, goals, and vision" },
      { step: "Concept", description: "Create initial concepts and storyboards" },
      { step: "Production", description: "Bring your animation to life with our expert team" },
      { step: "Refinement", description: "Polish and perfect every detail" },
      { step: "Delivery", description: "Receive your final animation in all required formats" },
    ],
    packages: [
      {
        name: "Starter",
        price: "$299",
        duration: "Up to 15 seconds",
        revisions: "2 revisions",
        features: ["Basic 3D animation", "HD rendering", "2 revisions", "5-7 day delivery"],
      },
      {
        name: "Professional",
        price: "$699",
        duration: "Up to 30 seconds",
        revisions: "4 revisions",
        features: ["Advanced 3D animation", "4K rendering", "4 revisions", "Custom effects", "7-10 day delivery"],
        popular: true,
      },
      {
        name: "Premium",
        price: "$2,049",
        duration: "Up to 60 seconds",
        revisions: "Unlimited revisions",
        features: [
          "Complex 3D animation",
          "8K rendering",
          "Unlimited revisions",
          "Advanced VFX",
          "Priority support",
          "10-14 day delivery",
        ],
      },
    ],
    stats: [
      { icon: Clock, label: "Average Delivery", value: "7-10 Days" },
      { icon: Users, label: "Projects Completed", value: "500+" },
      { icon: Award, label: "Client Satisfaction", value: "4.9/5" },
    ],
    color: "from-purple-500/20 to-violet-500/20",
    image: "/3d-animation-production.jpg",
  },
  "brand-identity": {
    id: "brand-identity",
    icon: Palette,
    title: "Brand Identity",
    tagline: "Define Your Unique Voice",
    description:
      "Build a powerful brand identity that resonates with your audience. We create comprehensive visual systems that tell your story and set you apart from the competition.",
    longDescription:
      "Your brand is more than just a logo—it's the complete visual and emotional experience your customers have with your business. We craft cohesive brand identities that communicate your values, connect with your audience, and stand the test of time.",
    features: [
      "Logo Design & Brand Marks",
      "Brand Guidelines & Style Guides",
      "Color Palette Development",
      "Typography Systems",
      "Brand Collateral Design",
      "Brand Strategy Consulting",
    ],
    process: [
      { step: "Research", description: "Deep dive into your market and competitors" },
      { step: "Strategy", description: "Define your brand positioning and voice" },
      { step: "Design", description: "Create your visual identity system" },
      { step: "Refinement", description: "Perfect every element of your brand" },
      { step: "Guidelines", description: "Deliver comprehensive brand guidelines" },
    ],
    packages: [
      {
        name: "Essential",
        price: "$499",
        duration: "Logo + Basics",
        revisions: "3 revisions",
        features: ["Logo design", "Color palette", "Typography selection", "Basic guidelines", "10-14 day delivery"],
      },
      {
        name: "Complete",
        price: "$1,299",
        duration: "Full Identity",
        revisions: "5 revisions",
        features: [
          "Complete logo suite",
          "Brand guidelines",
          "Business card design",
          "Social media templates",
          "Brand strategy",
          "14-21 day delivery",
        ],
        popular: true,
      },
      {
        name: "Enterprise",
        price: "$3,499",
        duration: "Comprehensive System",
        revisions: "Unlimited revisions",
        features: [
          "Full brand system",
          "Comprehensive guidelines",
          "Marketing collateral",
          "Brand strategy workshop",
          "Ongoing support",
          "21-30 day delivery",
        ],
      },
    ],
    stats: [
      { icon: Clock, label: "Average Delivery", value: "14-21 Days" },
      { icon: Users, label: "Brands Created", value: "300+" },
      { icon: Award, label: "Client Satisfaction", value: "4.9/5" },
    ],
    color: "from-lime-500/20 to-green-500/20",
    image: "/brand-identity-process.png",
  },
  "motion-design": {
    id: "motion-design",
    icon: Sparkles,
    title: "Motion Design",
    tagline: "Make Every Frame Count",
    description:
      "Eye-catching motion graphics that stop the scroll and drive action. Perfect for social media, advertising campaigns, and digital experiences that demand attention.",
    longDescription:
      "In today's fast-paced digital world, motion design is essential for capturing attention and communicating your message effectively. We create dynamic animations that engage viewers, enhance user experiences, and drive measurable results across all platforms.",
    features: [
      "Social Media Content Creation",
      "Advertising Campaign Assets",
      "UI/UX Animations",
      "Explainer Videos",
      "Title Sequences & Intros",
      "Kinetic Typography",
    ],
    process: [
      { step: "Brief", description: "Understand your goals and target audience" },
      { step: "Concept", description: "Develop creative concepts and style frames" },
      { step: "Animation", description: "Bring motion to your content" },
      { step: "Sound Design", description: "Add audio elements for maximum impact" },
      { step: "Delivery", description: "Export in all required formats and sizes" },
    ],
    packages: [
      {
        name: "Social Pack",
        price: "$399",
        duration: "3-5 animations",
        revisions: "2 revisions",
        features: ["3-5 social animations", "Multiple formats", "2 revisions", "Stock music", "5-7 day delivery"],
      },
      {
        name: "Campaign",
        price: "$999",
        duration: "10-15 animations",
        revisions: "4 revisions",
        features: [
          "10-15 animations",
          "Custom motion design",
          "All social formats",
          "Custom sound design",
          "4 revisions",
          "7-10 day delivery",
        ],
        popular: true,
      },
      {
        name: "Enterprise",
        price: "$2,999",
        duration: "Unlimited animations",
        revisions: "Unlimited revisions",
        features: [
          "Unlimited animations",
          "Advanced motion graphics",
          "Custom illustrations",
          "Full sound design",
          "Priority support",
          "Ongoing partnership",
        ],
      },
    ],
    stats: [
      { icon: Clock, label: "Average Delivery", value: "5-7 Days" },
      { icon: Users, label: "Animations Created", value: "1,000+" },
      { icon: Award, label: "Client Satisfaction", value: "4.9/5" },
    ],
    color: "from-blue-500/20 to-cyan-500/20",
    image: "/abstract-motion-graphics.png",
  },
  "creative-direction": {
    id: "creative-direction",
    icon: Zap,
    title: "Creative Direction",
    tagline: "Strategy Meets Creativity",
    description:
      "Strategic creative direction that ensures your brand stands out. We combine market insights with creative excellence to deliver campaigns that resonate and convert.",
    longDescription:
      "Great creative work starts with great strategy. Our creative direction services bring together strategic thinking, market insights, and artistic vision to create campaigns that not only look amazing but also drive real business results.",
    features: [
      "Creative Strategy Development",
      "Art Direction & Concepting",
      "Campaign Planning & Execution",
      "Brand Positioning",
      "Visual Storytelling",
      "Multi-Channel Campaigns",
    ],
    process: [
      { step: "Discovery", description: "Understand your business and market landscape" },
      { step: "Strategy", description: "Develop creative strategy and positioning" },
      { step: "Concepting", description: "Create campaign concepts and creative direction" },
      { step: "Execution", description: "Guide production and ensure quality" },
      { step: "Optimization", description: "Analyze results and refine approach" },
    ],
    packages: [
      {
        name: "Consultation",
        price: "$799",
        duration: "Single Project",
        revisions: "N/A",
        features: [
          "Creative strategy session",
          "Campaign concept",
          "Art direction guidelines",
          "Presentation deck",
          "2-week engagement",
        ],
      },
      {
        name: "Campaign",
        price: "$2,499",
        duration: "Full Campaign",
        revisions: "Ongoing",
        features: [
          "Complete campaign strategy",
          "Art direction",
          "Creative oversight",
          "Team collaboration",
          "4-6 week engagement",
        ],
        popular: true,
      },
      {
        name: "Retainer",
        price: "$5,999/mo",
        duration: "Ongoing Partnership",
        revisions: "Unlimited",
        features: [
          "Ongoing creative direction",
          "Strategic partnership",
          "Priority access",
          "Team integration",
          "Monthly strategy sessions",
          "Unlimited projects",
        ],
      },
    ],
    stats: [
      { icon: Clock, label: "Average Engagement", value: "4-6 Weeks" },
      { icon: Users, label: "Campaigns Directed", value: "200+" },
      { icon: Award, label: "Client Satisfaction", value: "4.9/5" },
    ],
    color: "from-pink-500/20 to-rose-500/20",
    image: "/creative-direction-team-brainstorming.jpg",
  },
}

export function generateStaticParams() {
  return Object.keys(servicesData).map((id) => ({ id }))
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const service = servicesData[params.id]
  if (!service) return {}

  return {
    title: `${service.title} | Skitbit Services`,
    description: service.description,
  }
}

export default function ServiceDetailPage({ params }: { params: { id: string } }) {
  const service = servicesData[params.id]

  if (!service) {
    notFound()
  }

  const Icon = service.icon

  return (
    <>
      <main className="min-h-[100dvh] text-white">
        <SiteHeader />

        {/* Back Button */}
        <div className="container mx-auto px-4 pt-8">
          <Button asChild variant="ghost" className="text-gray-300 hover:text-white">
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
              <p className="text-sm font-medium text-lime-400 mb-3">{service.tagline}</p>
              <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-white">
                {service.title}
              </h1>
              <p className="text-xl text-gray-300 mb-6">{service.description}</p>
              <p className="text-gray-400">{service.longDescription}</p>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden liquid-glass border border-white/10">
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
        <section className="container mx-auto px-4 pb-12">
          <div className="grid gap-6 sm:grid-cols-3">
            {service.stats.map((stat: any, idx: number) => (
              <Card
                key={idx}
                className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl text-center p-6"
              >
                <stat.icon className="h-8 w-8 text-lime-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </Card>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 pb-12">
          <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">What's Included</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {service.features.map((feature: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-lime-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Process */}
        <section className="container mx-auto px-4 pb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Process</h2>
          <div className="grid gap-6 md:grid-cols-5">
            {service.process.map((item: any, idx: number) => (
              <Card
                key={idx}
                className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl p-6 text-center"
              >
                <div className="mb-4 mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-lime-400/20 text-lime-400 font-bold">
                  {idx + 1}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.step}</h3>
                <p className="text-sm text-gray-400">{item.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Packages */}
        <section className="container mx-auto px-4 pb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Choose Your Package</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {service.packages.map((pkg: any, idx: number) => (
              <Card
                key={idx}
                className={`liquid-glass border backdrop-blur-xl p-6 relative ${
                  pkg.popular ? "border-lime-400/50 bg-lime-400/5" : "border-white/10 bg-white/5"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-lime-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <CardContent className="p-0 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                    <div className="text-4xl font-extrabold text-lime-400 mb-1">{pkg.price}</div>
                    <p className="text-sm text-gray-400">{pkg.duration}</p>
                  </div>
                  <ul className="space-y-3">
                    {pkg.features.map((feature: string, fidx: number) => (
                      <li key={fidx} className="flex items-start gap-2 text-sm text-gray-300">
                        <Check className="h-4 w-4 text-lime-400 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className={`w-full rounded-full ${
                      pkg.popular
                        ? "bg-lime-400 text-black hover:bg-lime-300"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    <a href="#booking">Select Package</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Booking Form */}
        <section id="booking" className="container mx-auto px-4 pb-16 sm:pb-24">
          <Card className="liquid-glass-enhanced border border-white/15 bg-white/10 backdrop-blur-xl p-8 sm:p-12 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">Book This Service</h2>
            <p className="text-gray-300 mb-8 text-center">
              Fill out the form below and we'll get back to you within 24 hours
            </p>
            <BookingForm serviceId={service.id} serviceName={service.title} packages={service.packages} />
          </Card>
        </section>

        <AppverseFooter />
      </main>
    </>
  )
}
