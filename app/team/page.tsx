import SiteHeader from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getAllTeamMembersForBuild } from "@/lib/get-team"
import { TeamFilter } from "@/components/team-filter"

export const dynamic = 'force-static'
export const revalidate = 60

export const metadata = {
  title: "Our Team | Pqrix - Meet the Creative Minds",
  description:
    "Meet the talented team behind Pqrix. Our creative professionals bring years of experience in 3D animation, design, and creative direction.",
}

async function getTeamMembers() {
  const isProductionBuild = process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL;
  
  if (isProductionBuild) {
    return await getAllTeamMembersForBuild()
  }

  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/team`, {
      next: { revalidate: 60 }
    })
    
    if (response.ok) {
      const data = await response.json()
      return data.success ? data.data : []
    }
  } catch (error) {
    console.error('API fetch failed, falling back to database:', error)
  }
  
  return await getAllTeamMembersForBuild()
}

export default async function TeamPage() {
  const teamMembers = await getTeamMembers()
  
  // Ensure teamMembers is always an array
  const members = Array.isArray(teamMembers) ? teamMembers : []
  
  return (
    <>
      <main className="min-h-[100dvh] text-black dark:text-white">
        <SiteHeader />

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
              <span className="block">Meet Our</span>
              <span className="block bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(239,68,68,0.5)]">Creative Team</span>
            </h1>
            <p className="text-lg text-gray-300 sm:text-xl">
              Talented professionals passionate about bringing your vision to life through exceptional creative work
            </p>
          </div>
        </section>

        {/* Interactive Filter and Team Grid */}
        <TeamFilter initialMembers={members} />

        {/* Join Team CTA */}
        <section className="container mx-auto px-4 pb-16 sm:pb-24">
          <Card className="liquid-glass-enhanced border border-red-500/20 bg-black/40 backdrop-blur-xl text-center p-8 sm:p-12 shadow-lg shadow-red-500/30">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Want to Join Our Team?</h2>
            <p className="mb-8 text-lg text-gray-300">
              We're always looking for talented creatives to join our growing team
            </p>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-gradient-to-r from-red-600 to-red-800 px-8 text-base font-semibold text-white hover:from-red-700 hover:to-red-900 transition-all duration-300 shadow-[0_8px_24px_rgba(220,38,38,0.4)] hover:shadow-[0_12px_32px_rgba(220,38,38,0.5)]"
            >
              <Link href="mailto:careers@pqrix.com">View Open Positions</Link>
            </Button>
          </Card>
        </section>

        <AppverseFooter />
      </main>
    </>
  )
}
