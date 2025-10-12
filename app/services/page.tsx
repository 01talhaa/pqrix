import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Video, Palette, Sparkles, Zap, ArrowRight, Check } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Our Services | Skitbit - Premium Creative Solutions",
  description:
    "Explore our full range of creative services including 3D animation, brand identity, motion design, and creative direction.",
}

const services = [
  {
    id: "3d-animation",
    icon: Video,
    title: "3D Animation",
    tagline: "Bring Your Vision to Life",
    description:
      "Create stunning 3D animations that captivate your audience and elevate your brand. From product visualizations to character animations, we deliver cinematic quality that drives engagement.",
    features: [
      "Product Visualization & Rendering",
      "Character Animation & Rigging",
      "Motion Graphics & VFX",
      "Architectural Visualization",
      "Medical & Technical Animation",
      "Social Media Content",
    ],
    pricing: "Starting at $299",
    color: "from-purple-500/20 to-violet-500/20",
    image: "/3d-animation-studio-workspace.jpg",
  },
  {
    id: "brand-identity",
    icon: Palette,
    title: "Brand Identity",
    tagline: "Define Your Unique Voice",
    description:
      "Build a powerful brand identity that resonates with your audience. We create comprehensive visual systems that tell your story and set you apart from the competition.",
    features: [
      "Logo Design & Brand Marks",
      "Brand Guidelines & Style Guides",
      "Color Palette Development",
      "Typography Systems",
      "Brand Collateral Design",
      "Brand Strategy Consulting",
    ],
    pricing: "Starting at $499",
    color: "from-lime-500/20 to-green-500/20",
    image: "/brand-identity-design-mockups.jpg",
  },
  {
    id: "motion-design",
    icon: Sparkles,
    title: "Motion Design",
    tagline: "Make Every Frame Count",
    description:
      "Eye-catching motion graphics that stop the scroll and drive action. Perfect for social media, advertising campaigns, and digital experiences that demand attention.",
    features: [
      "Social Media Content Creation",
      "Advertising Campaign Assets",
      "UI/UX Animations",
      "Explainer Videos",
      "Title Sequences & Intros",
      "Kinetic Typography",
    ],
    pricing: "Starting at $399",
    color: "from-blue-500/20 to-cyan-500/20",
    image: "/motion-graphics-design-workspace.jpg",
  },
  {
    id: "creative-direction",
    icon: Zap,
    title: "Creative Direction",
    tagline: "Strategy Meets Creativity",
    description:
      "Strategic creative direction that ensures your brand stands out. We combine market insights with creative excellence to deliver campaigns that resonate and convert.",
    features: [
      "Creative Strategy Development",
      "Art Direction & Concepting",
      "Campaign Planning & Execution",
      "Brand Positioning",
      "Visual Storytelling",
      "Multi-Channel Campaigns",
    ],
    pricing: "Custom Pricing",
    color: "from-pink-500/20 to-rose-500/20",
    image: "/creative-direction-team-meeting.jpg",
  },
]

export default function ServicesPage() {
  return (
    <>
      <main className="min-h-[100dvh] text-white">
        <SiteHeader />

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
              <span className="block">Premium Creative</span>
              <span className="block text-lime-300 drop-shadow-[0_0_20px_rgba(132,204,22,0.35)]">Services</span>
            </h1>
            <p className="text-lg text-gray-300 sm:text-xl">
              From concept to completion, we deliver world-class creative solutions that drive real results for your
              business
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="container mx-auto px-4 pb-16 sm:pb-24">
          <div className="grid gap-8 lg:gap-12">
            {services.map((service, index) => (
              <Card
                key={service.id}
                className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden"
              >
                <div className={`grid gap-8 lg:grid-cols-2 ${index % 2 === 1 ? "lg:grid-flow-dense" : ""}`}>
                  {/* Image */}
                  <div className={`relative aspect-video lg:aspect-auto ${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                    <img
                      src={service.image || "/placeholder.svg"}
                      alt={service.title}
                      className="h-full w-full object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color}`} />
                  </div>

                  {/* Content */}
                  <div className="p-6 lg:p-8 flex flex-col justify-center">
                    <div
                      className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${service.color}`}
                    >
                      <service.icon className="h-7 w-7 text-white" />
                    </div>

                    <CardHeader className="p-0 mb-4">
                      <p className="text-sm font-medium text-lime-400 mb-2">{service.tagline}</p>
                      <CardTitle className="text-3xl text-white mb-3">{service.title}</CardTitle>
                      <p className="text-gray-300">{service.description}</p>
                    </CardHeader>

                    <CardContent className="p-0 space-y-6">
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-3">What's Included:</h4>
                        <ul className="grid gap-2 sm:grid-cols-2">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                              <Check className="h-4 w-4 text-lime-400 mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <div className="text-2xl font-bold text-white">{service.pricing}</div>
                        <Button asChild className="rounded-full bg-lime-400 px-6 text-black hover:bg-lime-300">
                          <Link href={`/services/${service.id}`}>
                            View Details
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 pb-16 sm:pb-24">
          <Card className="liquid-glass-enhanced border border-white/15 bg-white/10 backdrop-blur-xl text-center p-8 sm:p-12">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Ready to Start Your Project?</h2>
            <p className="mb-8 text-lg text-gray-300">Let's discuss how we can bring your vision to life</p>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-lime-400 px-8 text-base font-semibold text-black hover:bg-lime-300"
            >
              <Link href="https://wa.link/65mf3i">Get in Touch</Link>
            </Button>
          </Card>
        </section>

        <AppverseFooter />
      </main>
    </>
  )
}
