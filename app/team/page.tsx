import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Linkedin, Twitter, Mail } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Our Team | Skitbit - Meet the Creative Minds",
  description:
    "Meet the talented team behind Skitbit. Our creative professionals bring years of experience in 3D animation, design, and creative direction.",
}

const teamMembers = [
  {
    id: "sarah-chen",
    name: "Sarah Chen",
    role: "Creative Director",
    department: "Leadership",
    bio: "Leading creative vision with 12+ years in 3D animation and brand strategy",
    image: "/team-sarah-chen.jpg",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "sarah@skitbit.com",
  },
  {
    id: "marcus-rodriguez",
    name: "Marcus Rodriguez",
    role: "Lead 3D Animator",
    department: "Animation",
    bio: "Award-winning animator specializing in product visualization and character work",
    image: "/team-marcus-rodriguez.jpg",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "marcus@skitbit.com",
  },
  {
    id: "emily-watson",
    name: "Emily Watson",
    role: "Brand Strategist",
    department: "Strategy",
    bio: "Crafting compelling brand narratives that resonate with audiences",
    image: "/team-emily-watson.jpg",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "emily@skitbit.com",
  },
  {
    id: "david-kim",
    name: "David Kim",
    role: "Motion Designer",
    department: "Design",
    bio: "Creating dynamic motion graphics that capture attention and drive engagement",
    image: "/team-david-kim.jpg",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "david@skitbit.com",
  },
  {
    id: "lisa-patel",
    name: "Lisa Patel",
    role: "Art Director",
    department: "Design",
    bio: "Bringing artistic vision to life with meticulous attention to detail",
    image: "/team-lisa-patel.jpg",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "lisa@skitbit.com",
  },
  {
    id: "james-thompson",
    name: "James Thompson",
    role: "Senior Animator",
    department: "Animation",
    bio: "Pushing the boundaries of what's possible in 3D animation",
    image: "/team-james-thompson.jpg",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "james@skitbit.com",
  },
  {
    id: "nina-martinez",
    name: "Nina Martinez",
    role: "Brand Designer",
    department: "Design",
    bio: "Designing memorable brand identities that stand the test of time",
    image: "/team-nina-martinez.jpg",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "nina@skitbit.com",
  },
  {
    id: "alex-nguyen",
    name: "Alex Nguyen",
    role: "Technical Director",
    department: "Technology",
    bio: "Bridging creativity and technology to deliver exceptional results",
    image: "/team-alex-nguyen.jpg",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "alex@skitbit.com",
  },
]

const departments = ["All", "Leadership", "Animation", "Design", "Strategy", "Technology"]

export default function TeamPage() {
  return (
    <>
      <main className="min-h-[100dvh] text-white">
        <SiteHeader />

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
              <span className="block">Meet Our</span>
              <span className="block text-lime-300 drop-shadow-[0_0_20px_rgba(132,204,22,0.35)]">Creative Team</span>
            </h1>
            <p className="text-lg text-gray-300 sm:text-xl">
              Talented professionals passionate about bringing your vision to life through exceptional creative work
            </p>
          </div>
        </section>

        {/* Department Filter */}
        <section className="container mx-auto px-4 pb-8">
          <div className="flex flex-wrap justify-center gap-3">
            {departments.map((dept) => (
              <Button
                key={dept}
                variant={dept === "All" ? "default" : "outline"}
                className={
                  dept === "All"
                    ? "rounded-full bg-lime-400 text-black hover:bg-lime-300"
                    : "rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10"
                }
              >
                {dept}
              </Button>
            ))}
          </div>
        </section>

        {/* Team Grid */}
        <section className="container mx-auto px-4 pb-16 sm:pb-24">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member) => (
              <Link key={member.id} href={`/team/${member.id}`}>
                <Card className="group liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden transition-all hover:border-white/20 hover:bg-white/10 h-full">
                  <div className="relative aspect-square overflow-hidden bg-gray-900">
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Social Links Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
                        asChild
                      >
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
                        asChild
                      >
                        <a href={member.twitter} target="_blank" rel="noopener noreferrer">
                          <Twitter className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
                        asChild
                      >
                        <a href={`mailto:${member.email}`}>
                          <Mail className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>

                    {/* Department Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center rounded-full bg-black/60 backdrop-blur-sm px-3 py-1 text-xs font-medium text-lime-400 border border-lime-400/30">
                        {member.department}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="mb-1 text-xl font-bold text-white group-hover:text-lime-400 transition-colors">
                      {member.name}
                    </h3>
                    <p className="mb-3 text-sm font-medium text-lime-400">{member.role}</p>
                    <p className="text-sm text-gray-300 line-clamp-2">{member.bio}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Join Team CTA */}
        <section className="container mx-auto px-4 pb-16 sm:pb-24">
          <Card className="liquid-glass-enhanced border border-white/15 bg-white/10 backdrop-blur-xl text-center p-8 sm:p-12">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Want to Join Our Team?</h2>
            <p className="mb-8 text-lg text-gray-300">
              We're always looking for talented creatives to join our growing team
            </p>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-lime-400 px-8 text-base font-semibold text-black hover:bg-lime-300"
            >
              <Link href="mailto:careers@skitbit.com">View Open Positions</Link>
            </Button>
          </Card>
        </section>

        <AppverseFooter />
      </main>
    </>
  )
}
