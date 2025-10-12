import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, User, Tag, ExternalLink } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

const projectsData: Record<string, any> = {
  "luxury-watch-campaign": {
    id: "luxury-watch-campaign",
    title: "Luxury Watch Campaign",
    client: "TAG Heuer",
    category: "3D Animation",
    year: "2024",
    duration: "3 months",
    description: "Premium 3D product visualization showcasing the new Carrera collection with cinematic quality",
    challenge:
      "TAG Heuer needed a way to showcase their new Carrera Day-Date collection in a digital-first world where physical showrooms were limited. The challenge was to create a visual experience that matched the luxury and precision of the physical product.",
    solution:
      "We created a series of photorealistic 3D animations that highlighted the watch's intricate details, bold colors, and refined finishes. Using advanced rendering techniques and careful attention to lighting, we captured the essence of luxury that TAG Heuer is known for.",
    results: [
      "5M+ views across social media platforms",
      "40% increase in online engagement",
      "Featured in Watches & Wonders digital showcase",
      "150% increase in product page visits",
    ],
    tags: ["3D Animation", "Product Visualization", "Luxury", "CGI", "Rendering"],
    video:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/A%20new%20chapter%20in%20the%20story%20of%20success.__Introducing%20the%20new%20TAG%20Heuer%20Carrera%20Day-Date%20collection%2C%20reimagined%20with%20bold%20colors%2C%20refined%20finishes%2C%20and%20upgraded%20functionality%20to%20keep%20you%20focused%20on%20your%20goals.%20__Six%20-nDNoRQyFaZ8oaaoty4XaQz8W8E5bqA.mp4",
    images: ["/project-luxury-watch-1.jpg", "/project-luxury-watch-2.jpg", "/project-luxury-watch-3.jpg"],
    testimonial: {
      quote:
        "The 3D animations exceeded our expectations. They captured the essence of our brand and helped us connect with customers in a meaningful way during a challenging time.",
      author: "Marketing Director",
      company: "TAG Heuer",
    },
  },
  "tech-startup-brand": {
    id: "tech-startup-brand",
    title: "Tech Startup Rebrand",
    client: "Smartpack",
    category: "Brand Identity",
    year: "2024",
    duration: "2 months",
    description: "Complete brand identity redesign for innovative tech startup entering the smart luggage market",
    challenge:
      "Smartpack was launching a revolutionary smart luggage product but lacked a cohesive brand identity that could compete with established players in the market. They needed a brand that communicated innovation, reliability, and premium quality.",
    solution:
      "We developed a comprehensive brand identity system that included a modern logo, vibrant color palette, custom typography, and extensive brand guidelines. The visual language was designed to appeal to tech-savvy travelers while maintaining a premium feel.",
    results: [
      "Successfully launched at CES 2024",
      "Featured in TechCrunch and The Verge",
      "Secured $5M in Series A funding",
      "Brand recognition increased by 300%",
    ],
    tags: ["Branding", "Logo Design", "Tech", "Startup", "Identity System"],
    images: ["/project-tech-startup-1.jpg", "/project-tech-startup-2.jpg", "/project-tech-startup-3.jpg"],
    testimonial: {
      quote:
        "The rebrand transformed our company. We went from looking like a garage startup to a serious player in the smart luggage space. The investment paid for itself within the first quarter.",
      author: "CEO & Founder",
      company: "Smartpack",
    },
  },
  "social-media-campaign": {
    id: "social-media-campaign",
    title: "Social Media Campaign",
    client: "Fashion Brand",
    category: "Motion Design",
    year: "2024",
    duration: "1 month",
    description: "Dynamic motion graphics series for Instagram and TikTok campaign driving 2M+ impressions",
    challenge:
      "A fashion brand needed to break through the noise on social media and capture the attention of Gen Z consumers. Traditional static posts weren't generating the engagement they needed.",
    solution:
      "We created a series of eye-catching motion graphics that combined bold typography, dynamic transitions, and on-brand colors. Each piece was optimized for both Instagram Reels and TikTok, with attention-grabbing hooks in the first 3 seconds.",
    results: [
      "2M+ impressions in first week",
      "65% increase in follower growth",
      "40% increase in website traffic",
      "Best-performing campaign of the year",
    ],
    tags: ["Motion Graphics", "Social Media", "Fashion", "Instagram", "TikTok"],
    video: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Timeline%201-Ku3Y2Hgaw8hCiFEFg1ELtYp631rSzR.webm",
    images: ["/project-social-campaign-1.jpg", "/project-social-campaign-2.jpg", "/project-social-campaign-3.jpg"],
    testimonial: {
      quote:
        "These motion graphics completely changed our social media game. We've never seen engagement like this before. Our followers can't get enough!",
      author: "Social Media Manager",
      company: "Fashion Brand",
    },
  },
  "product-launch-video": {
    id: "product-launch-video",
    title: "Product Launch Video",
    client: "Consumer Electronics",
    category: "3D Animation",
    year: "2024",
    duration: "6 weeks",
    description: "High-impact 3D animation for flagship product launch reaching 5M+ views",
    challenge:
      "A consumer electronics company was launching their most ambitious product yet and needed a launch video that would generate buzz and excitement across all channels.",
    solution:
      "We created a cinematic 3D animation that showcased the product's innovative features through dynamic camera movements, sleek transitions, and photorealistic rendering. The video told a story of innovation and possibility.",
    results: [
      "5M+ views in first 48 hours",
      "Trending #1 on YouTube in Tech category",
      "90% positive sentiment in comments",
      "Product sold out in first week",
    ],
    tags: ["3D Animation", "Product Launch", "Electronics", "Video Production"],
    images: ["/project-product-launch-1.jpg", "/project-product-launch-2.jpg", "/project-product-launch-3.jpg"],
    testimonial: {
      quote:
        "This launch video was instrumental in our product's success. It perfectly captured what makes our product special and got people excited to buy.",
      author: "VP of Marketing",
      company: "Consumer Electronics",
    },
  },
  "restaurant-brand-identity": {
    id: "restaurant-brand-identity",
    title: "Restaurant Brand Identity",
    client: "Culinary Collective",
    category: "Brand Identity",
    year: "2023",
    duration: "3 months",
    description: "Modern brand identity for upscale restaurant group with multiple locations",
    challenge:
      "A restaurant group was expanding to multiple locations and needed a cohesive brand identity that could work across different concepts while maintaining a unified premium feel.",
    solution:
      "We developed a flexible brand system with a sophisticated logo, elegant typography, and a warm color palette. The system included guidelines for menu design, signage, uniforms, and digital presence.",
    results: [
      "Successfully opened 3 new locations",
      "Featured in Food & Wine magazine",
      "Michelin Guide recognition",
      "25% increase in reservations",
    ],
    tags: ["Branding", "Hospitality", "Print Design", "Restaurant", "Identity"],
    images: ["/project-restaurant-1.jpg", "/project-restaurant-2.jpg", "/project-restaurant-3.jpg"],
    testimonial: {
      quote:
        "The brand identity elevated our entire operation. Customers immediately recognize the quality and attention to detail we bring to every aspect of the dining experience.",
      author: "Owner",
      company: "Culinary Collective",
    },
  },
  "app-ui-animations": {
    id: "app-ui-animations",
    title: "App UI Animations",
    client: "FinTech Startup",
    category: "Motion Design",
    year: "2023",
    duration: "6 weeks",
    description: "Smooth UI animations and micro-interactions for mobile banking app",
    challenge:
      "A FinTech startup needed to differentiate their banking app in a crowded market. They wanted animations that felt premium and trustworthy while making complex financial tasks feel simple.",
    solution:
      "We designed and implemented a comprehensive system of micro-interactions, transitions, and animations that guided users through the app with clarity and delight. Every animation served a purpose and enhanced usability.",
    results: [
      "4.8 star rating on App Store",
      "Featured by Apple in 'Apps We Love'",
      "50% reduction in support tickets",
      "30% increase in daily active users",
    ],
    tags: ["UI Animation", "Mobile", "FinTech", "UX Design", "Micro-interactions"],
    images: ["/project-app-animations-1.jpg", "/project-app-animations-2.jpg", "/project-app-animations-3.jpg"],
    testimonial: {
      quote:
        "The animations transformed our app from functional to delightful. Users constantly compliment us on how smooth and intuitive everything feels.",
      author: "Head of Product",
      company: "FinTech Startup",
    },
  },
  "automotive-showcase": {
    id: "automotive-showcase",
    title: "Automotive Showcase",
    client: "Luxury Auto Brand",
    category: "3D Animation",
    year: "2023",
    duration: "4 months",
    description: "Photorealistic 3D car visualization for digital showroom experience",
    challenge:
      "A luxury automotive brand wanted to create an immersive digital showroom experience that would allow customers to explore vehicles in detail without visiting a physical location.",
    solution:
      "We created photorealistic 3D models and animations of their entire vehicle lineup, complete with customizable colors, interiors, and features. The experience included 360-degree views and detailed close-ups of key features.",
    results: [
      "Digital showroom visits increased 200%",
      "40% of customers configured vehicles online",
      "Reduced showroom costs by 30%",
      "Industry award for digital innovation",
    ],
    tags: ["3D Animation", "Automotive", "CGI", "Product Visualization", "Interactive"],
    images: ["/project-automotive-1.jpg", "/project-automotive-2.jpg", "/project-automotive-3.jpg"],
    testimonial: {
      quote:
        "The digital showroom has become an essential part of our sales process. Customers love being able to explore vehicles in such detail from the comfort of their homes.",
      author: "Digital Marketing Director",
      company: "Luxury Auto Brand",
    },
  },
  "music-festival-campaign": {
    id: "music-festival-campaign",
    title: "Music Festival Campaign",
    client: "Summer Sounds Festival",
    category: "Motion Design",
    year: "2023",
    duration: "2 months",
    description: "Vibrant motion graphics campaign for annual music festival",
    challenge:
      "An annual music festival needed a visual campaign that would capture the energy and excitement of the event while standing out in a crowded festival market.",
    solution:
      "We created a bold motion graphics campaign featuring vibrant colors, dynamic typography, and energetic animations. The campaign included social media content, video ads, and on-site digital displays.",
    results: [
      "Tickets sold out 2 weeks early",
      "Social media engagement up 150%",
      "Featured in Billboard magazine",
      "Highest attendance in festival history",
    ],
    tags: ["Motion Graphics", "Events", "Entertainment", "Festival", "Campaign"],
    images: ["/project-music-festival-1.jpg", "/project-music-festival-2.jpg", "/project-music-festival-3.jpg"],
    testimonial: {
      quote:
        "The motion graphics campaign perfectly captured the vibe of our festival. It got people excited and helped us sell out faster than ever before.",
      author: "Festival Director",
      company: "Summer Sounds Festival",
    },
  },
}

export function generateStaticParams() {
  return Object.keys(projectsData).map((id) => ({ id }))
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const project = projectsData[params.id]
  if (!project) return {}

  return {
    title: `${project.title} | Skitbit Projects`,
    description: project.description,
  }
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = projectsData[params.id]

  if (!project) {
    notFound()
  }

  return (
    <>
      <main className="min-h-[100dvh] text-white">
        <SiteHeader />

        {/* Back Button */}
        <div className="container mx-auto px-4 pt-8">
          <Button asChild variant="ghost" className="text-gray-300 hover:text-white">
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>
        </div>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16">
          <div className="mb-8">
            <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <span className="inline-flex items-center gap-2">
                <User className="h-4 w-4" />
                {project.client}
              </span>
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {project.year}
              </span>
              <span className="inline-flex items-center gap-2">
                <Tag className="h-4 w-4" />
                {project.category}
              </span>
            </div>
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-white">
              {project.title}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl">{project.description}</p>
          </div>

          {/* Main Media */}
          <div className="relative aspect-video rounded-2xl overflow-hidden liquid-glass border border-white/10 mb-8">
            {project.video ? (
              <video src={project.video} className="h-full w-full object-cover" controls autoPlay loop muted />
            ) : (
              <img
                src={project.images?.[0] || "/placeholder.svg"}
                alt={project.title}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag: string) => (
              <span
                key={tag}
                className="rounded-full bg-white/5 border border-white/10 px-4 py-2 text-sm text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* Project Details */}
        <section className="container mx-auto px-4 pb-12">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              {/* Challenge */}
              <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-4">The Challenge</h2>
                <p className="text-gray-300 leading-relaxed">{project.challenge}</p>
              </Card>

              {/* Solution */}
              <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Our Solution</h2>
                <p className="text-gray-300 leading-relaxed">{project.solution}</p>
              </Card>

              {/* Results */}
              <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Results</h2>
                <ul className="space-y-3">
                  {project.results.map((result: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-lime-400 flex-shrink-0" />
                      <span className="text-gray-300">{result}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Testimonial */}
              {project.testimonial && (
                <Card className="liquid-glass-enhanced border border-white/15 bg-white/10 backdrop-blur-xl p-8">
                  <blockquote className="space-y-4">
                    <p className="text-lg text-white italic leading-relaxed">"{project.testimonial.quote}"</p>
                    <footer className="text-gray-400">
                      <div className="font-semibold text-white">{project.testimonial.author}</div>
                      <div className="text-sm">{project.testimonial.company}</div>
                    </footer>
                  </blockquote>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Project Info</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm text-gray-400 mb-1">Client</dt>
                    <dd className="text-white font-medium">{project.client}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-400 mb-1">Category</dt>
                    <dd className="text-white font-medium">{project.category}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-400 mb-1">Year</dt>
                    <dd className="text-white font-medium">{project.year}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-400 mb-1">Duration</dt>
                    <dd className="text-white font-medium">{project.duration}</dd>
                  </div>
                </dl>
              </Card>

              <Card className="liquid-glass-enhanced border border-white/15 bg-white/10 backdrop-blur-xl p-6 text-center">
                <h3 className="text-lg font-bold text-white mb-3">Like What You See?</h3>
                <p className="text-sm text-gray-300 mb-4">Let's create something amazing together</p>
                <Button asChild className="w-full rounded-full bg-lime-400 text-black hover:bg-lime-300 font-semibold">
                  <Link href="https://wa.link/65mf3i">
                    Start Your Project
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* Additional Images */}
        {project.images && project.images.length > 1 && (
          <section className="container mx-auto px-4 pb-16 sm:pb-24">
            <h2 className="text-3xl font-bold text-white mb-8">More From This Project</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {project.images.slice(1).map((image: string, idx: number) => (
                <div
                  key={idx}
                  className="relative aspect-video rounded-xl overflow-hidden liquid-glass border border-white/10"
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${project.title} ${idx + 2}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        <AppverseFooter />
      </main>
    </>
  )
}
