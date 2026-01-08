import SiteHeader from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Linkedin, Twitter, Mail, Award, Briefcase, GraduationCap, FolderOpen } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getAllTeamMembersForBuild, getTeamMemberByIdForBuild } from "@/lib/get-team"
import { getProjectByIdForBuild } from "@/lib/get-projects"

export const dynamic = 'force-static'
export const revalidate = 60
export const dynamicParams = true

export async function generateStaticParams() {
  const teamMembers = await getAllTeamMembersForBuild()
  return teamMembers.map((member: any) => ({ id: member.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const member = await getTeamMemberByIdForBuild(id)
  if (!member) return {}

  return {
    title: `${(member as any).name} - ${(member as any).role} | Pqrix Team`,
    description: (member as any).bio,
  }
}

export default async function TeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  // Hybrid data fetching
  const isProductionBuild = process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL;
  let member: any
  
  if (isProductionBuild) {
    member = await getTeamMemberByIdForBuild(id)
  } else {
    try {
      const baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      
      const response = await fetch(`${baseUrl}/api/team/${id}`, {
        next: { revalidate: 60 }
      })
      
      if (response.ok) {
        const data = await response.json()
        member = data.success ? data.data : null
      } else {
        member = await getTeamMemberByIdForBuild(id)
      }
    } catch (error) {
      console.error('API fetch failed, falling back to database:', error)
      member = await getTeamMemberByIdForBuild(id)
    }
  }

  if (!member) {
    notFound()
  }

  return (
    <>
      <main className="min-h-[100dvh] text-black dark:text-white">
        <SiteHeader />

        {/* Back Button */}
        <div className="container mx-auto px-4 pt-8">
          <Button asChild variant="ghost" className="text-gray-300 hover:text-white">
            <Link href="/team">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Team
            </Link>
          </Button>
        </div>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-start">
            {/* Left Column - Info */}
            <div className="order-2 lg:order-1">
              <div className="mb-4">
                <span className="inline-flex items-center rounded-full bg-red-500/10 border border-red-400/30 px-4 py-1.5 text-sm font-medium text-red-400">
                  {member.department}
                </span>
              </div>
              <h1 className="mb-2 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-white">
                {member.name}
              </h1>
              <p className="text-xl font-medium text-red-400 mb-6">{member.role}</p>
              <p className="text-lg text-gray-300 mb-8">{member.fullBio || member.bio}</p>

              {/* Social Links */}
              <div className="flex gap-3 mb-8">
                <Button
                  asChild
                  size="icon"
                  className="h-10 w-10 rounded-full bg-black/40 border border-red-500/30 hover:bg-black/60 hover:border-red-500/50 text-white"
                >
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-5 w-5" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="icon"
                  className="h-10 w-10 rounded-full bg-black/40 border border-red-500/30 hover:bg-black/60 hover:border-red-500/50 text-white"
                >
                  <a href={member.twitter} target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-5 w-5" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="icon"
                  className="h-10 w-10 rounded-full bg-black/40 border border-red-500/30 hover:bg-black/60 hover:border-red-500/50 text-white"
                >
                  <a href={`mailto:${member.email}`}>
                    <Mail className="h-5 w-5" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="order-1 lg:order-2">
              <div className="relative aspect-square rounded-2xl overflow-hidden liquid-glass border border-red-500/20">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* Expertise */}
        {member.expertise && (
          <section className="container mx-auto px-4 pb-12">
            <Card className="liquid-glass border border-red-500/20 bg-black/40 backdrop-blur-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Award className="h-6 w-6 text-red-400" />
                <h2 className="text-2xl font-bold text-white">Expertise</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {member.expertise.map((skill: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-gray-300 bg-black/50 rounded-lg px-4 py-2"
                  >
                    <div className="h-2 w-2 rounded-full bg-red-400" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        )}

        {/* Experience */}
        {member.experience && (
          <section className="container mx-auto px-4 pb-12">
            <Card className="liquid-glass border border-red-500/20 bg-black/40 backdrop-blur-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Briefcase className="h-6 w-6 text-red-400" />
                <h2 className="text-2xl font-bold text-white">Experience</h2>
              </div>
              <div className="space-y-6">
                {member.experience.map((exp: any, idx: number) => (
                  <div key={idx} className="border-l-2 border-red-400/30 pl-6">
                    <h3 className="text-xl font-bold text-white mb-1">{exp.title}</h3>
                    <p className="text-red-400 font-medium mb-2">{exp.company}</p>
                    <p className="text-sm text-gray-400 mb-2">{exp.period}</p>
                    <p className="text-gray-300">{exp.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        )}

        {/* Education & Awards */}
        <section className="container mx-auto px-4 pb-12">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Education */}
            {member.education && (
              <Card className="liquid-glass border border-red-500/20 bg-black/40 backdrop-blur-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <GraduationCap className="h-6 w-6 text-red-400" />
                  <h2 className="text-2xl font-bold text-white">Education</h2>
                </div>
                <div className="space-y-4">
                  {member.education.map((edu: any, idx: number) => (
                    <div key={idx}>
                      <h3 className="text-lg font-bold text-white mb-1">{edu.degree}</h3>
                      <p className="text-red-400 mb-1">{edu.school}</p>
                      <p className="text-sm text-gray-400">{edu.year}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Awards */}
            {member.awards && (
              <Card className="liquid-glass border border-red-500/20 bg-black/40 backdrop-blur-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="h-6 w-6 text-red-400" />
                  <h2 className="text-2xl font-bold text-white">Awards & Recognition</h2>
                </div>
                <ul className="space-y-3">
                  {member.awards.map((award: any, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-300">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                      <span>{award}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        </section>

        {/* Projects */}
        {member.projects && member.projects.length > 0 && (await (async () => {
          // Fetch projects from MongoDB based on project IDs
          const memberProjects = []
          
          for (const projectId of member.projects) {
            if (!projectId || projectId.trim() === '') continue
            
            try {
              // Try fetching from API first
              if (!isProductionBuild) {
                try {
                  const baseUrl = process.env.VERCEL_URL 
                    ? `https://${process.env.VERCEL_URL}` 
                    : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
                  
                  const response = await fetch(`${baseUrl}/api/projects/${projectId}`, {
                    next: { revalidate: 60 }
                  })
                  
                  if (response.ok) {
                    const data = await response.json()
                    if (data.success && data.data) {
                      memberProjects.push(data.data)
                      continue
                    }
                  }
                } catch (error) {
                  console.error(`API fetch failed for project ${projectId}:`, error)
                }
              }
              
              // Fallback to database
              const project = await getProjectByIdForBuild(projectId)
              if (project) {
                memberProjects.push(project)
              }
            } catch (error) {
              console.error(`Error fetching project ${projectId}:`, error)
            }
          }
          
          if (memberProjects.length > 0) {
            return (
              <section className="container mx-auto px-4 pb-12">
                <Card className="liquid-glass border border-red-500/20 bg-black/40 backdrop-blur-xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <FolderOpen className="h-6 w-6 text-red-400" />
                    <h2 className="text-2xl font-bold text-white">Projects</h2>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {memberProjects.map((project: any) => (
                      <Link key={project.id} href={`/projects/${project.id}`}>
                        <Card className="liquid-glass border border-red-500/20 bg-black/40 hover:bg-black/60 hover:border-red-500/40 transition-all duration-300 overflow-hidden h-full">
                          <div className="relative aspect-video overflow-hidden">
                            {project.images && project.images.length > 0 ? (
                              <img
                                src={project.images[0] || "/placeholder.svg"}
                                alt={project.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full bg-gradient-to-br from-red-600 to-red-800" />
                            )}
                          </div>
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="inline-flex items-center rounded-full bg-red-500/10 border border-red-400/30 px-3 py-1 text-xs font-medium text-red-400">
                                {project.category}
                              </span>
                              <span className="text-xs text-gray-400">{project.status}</span>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-1">{project.title}</h3>
                            <p className="text-sm text-gray-400 mb-2">{project.client}</p>
                            <p className="text-sm text-gray-300 line-clamp-2">{project.description}</p>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </Card>
              </section>
            )
          }
          return null
        })())}

        {/* CTA */}
        <section className="container mx-auto px-4 pb-16 sm:pb-24">
          <Card className="liquid-glass-enhanced border border-red-500/20 bg-gradient-to-br from-red-600 to-red-800 backdrop-blur-xl text-center p-8 sm:p-12 shadow-lg shadow-red-500/30">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Work With Our Team</h2>
            <p className="mb-8 text-lg text-white/90">
              Interested in collaborating with {member.name.split(" ")[0]}? Get in touch with our team
            </p>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-white px-8 text-base font-semibold text-red-600 hover:bg-gray-100 transition-all duration-300"
            >
              <Link href="https://wa.me/8801401658685">Contact Us</Link>
            </Button>
          </Card>
        </section>

        <AppverseFooter />
      </main>
    </>
  )
}
