import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Linkedin, Twitter, Mail, Award, Briefcase, GraduationCap, FolderOpen } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { teamData, getAllTeamMemberIds } from "@/data/team"
import { getProjectsByTeamMember } from "@/data/projects"

export function generateStaticParams() {
  return getAllTeamMemberIds().map((id) => ({ id }))
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const member = teamData[params.id]
  if (!member) return {}

  return {
    title: `${member.name} - ${member.role} | Pqrix Team`,
    description: member.bio,
  }
}

export default function TeamMemberPage({ params }: { params: { id: string } }) {
  const member = teamData[params.id]

  if (!member) {
    notFound()
  }

  return (
    <>
      <main className="min-h-[100dvh] text-white">
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
                <span className="inline-flex items-center rounded-full bg-lime-400/20 border border-lime-400/30 px-4 py-1.5 text-sm font-medium text-lime-400">
                  {member.department}
                </span>
              </div>
              <h1 className="mb-2 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-white">
                {member.name}
              </h1>
              <p className="text-xl font-medium text-lime-400 mb-6">{member.role}</p>
              <p className="text-lg text-gray-300 mb-8">{member.fullBio || member.bio}</p>

              {/* Social Links */}
              <div className="flex gap-3 mb-8">
                <Button
                  asChild
                  size="icon"
                  className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20"
                >
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-5 w-5" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="icon"
                  className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20"
                >
                  <a href={member.twitter} target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-5 w-5" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="icon"
                  className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20"
                >
                  <a href={`mailto:${member.email}`}>
                    <Mail className="h-5 w-5" />
                  </a>
                </Button>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="order-1 lg:order-2">
              <div className="relative aspect-square rounded-2xl overflow-hidden liquid-glass border border-white/10">
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
            <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Award className="h-6 w-6 text-lime-400" />
                <h2 className="text-2xl font-bold text-white">Expertise</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {member.expertise.map((skill, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-gray-300 bg-white/5 rounded-lg px-4 py-2"
                  >
                    <div className="h-2 w-2 rounded-full bg-lime-400" />
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
            <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Briefcase className="h-6 w-6 text-lime-400" />
                <h2 className="text-2xl font-bold text-white">Experience</h2>
              </div>
              <div className="space-y-6">
                {member.experience.map((exp, idx) => (
                  <div key={idx} className="border-l-2 border-lime-400/30 pl-6">
                    <h3 className="text-xl font-bold text-white mb-1">{exp.title}</h3>
                    <p className="text-lime-400 font-medium mb-2">{exp.company}</p>
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
              <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <GraduationCap className="h-6 w-6 text-lime-400" />
                  <h2 className="text-2xl font-bold text-white">Education</h2>
                </div>
                <div className="space-y-4">
                  {member.education.map((edu, idx) => (
                    <div key={idx}>
                      <h3 className="text-lg font-bold text-white mb-1">{edu.degree}</h3>
                      <p className="text-lime-400 mb-1">{edu.school}</p>
                      <p className="text-sm text-gray-400">{edu.year}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Awards */}
            {member.awards && (
              <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="h-6 w-6 text-lime-400" />
                  <h2 className="text-2xl font-bold text-white">Awards & Recognition</h2>
                </div>
                <ul className="space-y-3">
                  {member.awards.map((award, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-300">
                      <div className="h-1.5 w-1.5 rounded-full bg-lime-400 mt-2 flex-shrink-0" />
                      <span>{award}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        </section>

        {/* Projects */}
        {(() => {
          const memberProjects = getProjectsByTeamMember(member.id)
          if (memberProjects.length > 0) {
            return (
              <section className="container mx-auto px-4 pb-12">
                <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <FolderOpen className="h-6 w-6 text-lime-400" />
                    <h2 className="text-2xl font-bold text-white">Projects</h2>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {memberProjects.map((project) => (
                      <Link key={project.id} href={`/projects/${project.id}`}>
                        <Card className="liquid-glass border border-white/10 bg-white/5 hover:bg-white/10 transition-colors overflow-hidden h-full">
                          <div className="relative aspect-video overflow-hidden">
                            {project.video ? (
                              <video
                                src={project.video}
                                className="h-full w-full object-cover"
                                muted
                                playsInline
                              />
                            ) : (
                              <img
                                src={project.image || "/placeholder.svg"}
                                alt={project.title}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="inline-flex items-center rounded-full bg-lime-400/20 border border-lime-400/30 px-3 py-1 text-xs font-medium text-lime-400">
                                {project.category}
                              </span>
                              <span className="text-xs text-gray-400">{project.year}</span>
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
        })()}

        {/* CTA */}
        <section className="container mx-auto px-4 pb-16 sm:pb-24">
          <Card className="liquid-glass-enhanced border border-white/15 bg-white/10 backdrop-blur-xl text-center p-8 sm:p-12">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">Work With Our Team</h2>
            <p className="mb-8 text-lg text-gray-300">
              Interested in collaborating with {member.name.split(" ")[0]}? Get in touch with our team
            </p>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-lime-400 px-8 text-base font-semibold text-black hover:bg-lime-300"
            >
              <Link href="https://wa.link/65mf3i">Contact Us</Link>
            </Button>
          </Card>
        </section>

        <AppverseFooter />
      </main>
    </>
  )
}
