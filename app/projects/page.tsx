import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Our Projects | Skitbit - Portfolio Showcase",
  description:
    "Explore our portfolio of creative projects including 3D animations, brand identities, and motion design work.",
}

const allProjects = [
  {
    id: "luxury-watch-campaign",
    title: "Luxury Watch Campaign",
    client: "TAG Heuer",
    category: "3D Animation",
    description: "Premium 3D product visualization showcasing the new Carrera collection with cinematic quality",
    image: "/project-luxury-watch.jpg",
    video:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/A%20new%20chapter%20in%20the%20story%20of%20success.__Introducing%20the%20new%20TAG%20Heuer%20Carrera%20Day-Date%20collection%2C%20reimagined%20with%20bold%20colors%2C%20refined%20finishes%2C%20and%20upgraded%20functionality%20to%20keep%20you%20focused%20on%20your%20goals.%20__Six%20-nDNoRQyFaZ8oaaoty4XaQz8W8E5bqA.mp4",
    tags: ["3D Animation", "Product Viz", "Luxury"],
    year: "2024",
  },
  {
    id: "tech-startup-brand",
    title: "Tech Startup Rebrand",
    client: "Smartpack",
    category: "Brand Identity",
    description: "Complete brand identity redesign for innovative tech startup entering the smart luggage market",
    image: "/project-tech-startup.jpg",
    tags: ["Branding", "Logo Design", "Tech"],
    year: "2024",
  },
  {
    id: "social-media-campaign",
    title: "Social Media Campaign",
    client: "Fashion Brand",
    category: "Motion Design",
    description: "Dynamic motion graphics series for Instagram and TikTok campaign driving 2M+ impressions",
    image: "/project-social-campaign.jpg",
    video: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Timeline%201-Ku3Y2Hgaw8hCiFEFg1ELtYp631rSzR.webm",
    tags: ["Motion Graphics", "Social Media", "Fashion"],
    year: "2024",
  },
  {
    id: "product-launch-video",
    title: "Product Launch Video",
    client: "Consumer Electronics",
    category: "3D Animation",
    description: "High-impact 3D animation for flagship product launch reaching 5M+ views",
    image: "/project-product-launch.jpg",
    tags: ["3D Animation", "Product Launch", "Electronics"],
    year: "2024",
  },
  {
    id: "restaurant-brand-identity",
    title: "Restaurant Brand Identity",
    client: "Culinary Collective",
    category: "Brand Identity",
    description: "Modern brand identity for upscale restaurant group with multiple locations",
    image: "/project-restaurant-brand.jpg",
    tags: ["Branding", "Hospitality", "Print Design"],
    year: "2023",
  },
  {
    id: "app-ui-animations",
    title: "App UI Animations",
    client: "FinTech Startup",
    category: "Motion Design",
    description: "Smooth UI animations and micro-interactions for mobile banking app",
    image: "/project-app-animations.jpg",
    tags: ["UI Animation", "Mobile", "FinTech"],
    year: "2023",
  },
  {
    id: "automotive-showcase",
    title: "Automotive Showcase",
    client: "Luxury Auto Brand",
    category: "3D Animation",
    description: "Photorealistic 3D car visualization for digital showroom experience",
    image: "/project-automotive.jpg",
    tags: ["3D Animation", "Automotive", "CGI"],
    year: "2023",
  },
  {
    id: "music-festival-campaign",
    title: "Music Festival Campaign",
    client: "Summer Sounds Festival",
    category: "Motion Design",
    description: "Vibrant motion graphics campaign for annual music festival",
    image: "/project-music-festival.jpg",
    tags: ["Motion Graphics", "Events", "Entertainment"],
    year: "2023",
  },
]

const categories = ["All", "3D Animation", "Brand Identity", "Motion Design"]

export default function ProjectsPage() {
  return (
    <>
      <main className="min-h-[100dvh] text-white">
        <SiteHeader />

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
              <span className="block">Our Creative</span>
              <span className="block text-lime-300 drop-shadow-[0_0_20px_rgba(132,204,22,0.35)]">Portfolio</span>
            </h1>
            <p className="text-lg text-gray-300 sm:text-xl">
              Explore our latest work and see how we've helped brands create unforgettable experiences
            </p>
          </div>
        </section>

        {/* Filter Tabs */}
        <section className="container mx-auto px-4 pb-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                className={
                  category === "All"
                    ? "rounded-full bg-lime-400 text-black hover:bg-lime-300"
                    : "rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </section>

        {/* Projects Grid */}
        <section className="container mx-auto px-4 pb-16 sm:pb-24">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {allProjects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="group liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden transition-all hover:border-white/20 hover:bg-white/10 h-full">
                  <div className="relative aspect-video overflow-hidden bg-gray-900">
                    {project.video ? (
                      <>
                        <video
                          src={project.video}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </>
                    ) : (
                      <>
                        <img
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </>
                    )}

                    {project.video && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-lime-400/90 backdrop-blur-sm">
                          <Play className="h-7 w-7 text-black fill-black ml-1" />
                        </div>
                      </div>
                    )}

                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center rounded-full bg-black/60 backdrop-blur-sm px-3 py-1 text-xs font-medium text-lime-400 border border-lime-400/30">
                        {project.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center rounded-full bg-black/60 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white">
                        {project.year}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="mb-2 text-sm text-gray-400">{project.client}</div>
                    <h3 className="mb-2 text-xl font-bold text-white group-hover:text-lime-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="mb-4 text-sm text-gray-300 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-gray-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 pb-16 sm:pb-24">
          <Card className="liquid-glass-enhanced border border-white/15 bg-white/10 backdrop-blur-xl text-center p-8 sm:p-12">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Ready to Create Something Amazing?</h2>
            <p className="mb-8 text-lg text-gray-300">Let's bring your vision to life with our creative expertise</p>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-lime-400 px-8 text-base font-semibold text-black hover:bg-lime-300"
            >
              <Link href="https://wa.link/65mf3i">Start Your Project</Link>
            </Button>
          </Card>
        </section>

        <AppverseFooter />
      </main>
    </>
  )
}
