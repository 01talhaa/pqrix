import { SiteHeader } from "@/components/site-header"
import { AppverseFooter } from "@/components/appverse-footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Linkedin, Twitter, Mail, Award, Briefcase, GraduationCap } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

const teamData: Record<string, any> = {
  "sarah-chen": {
    id: "sarah-chen",
    name: "Sarah Chen",
    role: "Creative Director",
    department: "Leadership",
    bio: "Leading creative vision with 12+ years in 3D animation and brand strategy",
    image: "/team-sarah-chen.jpg",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "sarah@skitbit.com",
    fullBio:
      "Sarah is a visionary creative director with over 12 years of experience in 3D animation, brand strategy, and creative leadership. She has led award-winning campaigns for Fortune 500 companies and innovative startups alike. Her passion for storytelling through visual media has helped shape Skitbit into the creative powerhouse it is today.",
    expertise: [
      "Creative Strategy & Direction",
      "3D Animation & VFX",
      "Brand Development",
      "Team Leadership",
      "Client Relations",
      "Project Management",
    ],
    experience: [
      {
        title: "Creative Director",
        company: "Skitbit",
        period: "2020 - Present",
        description: "Leading creative vision and strategy for all client projects",
      },
      {
        title: "Senior Art Director",
        company: "Digital Dreams Studio",
        period: "2016 - 2020",
        description: "Directed major campaigns for luxury and tech brands",
      },
      {
        title: "3D Animator",
        company: "Motion Masters",
        period: "2012 - 2016",
        description: "Created award-winning 3D animations for advertising",
      },
    ],
    education: [
      {
        degree: "MFA in Digital Media",
        school: "Rhode Island School of Design",
        year: "2012",
      },
      {
        degree: "BFA in Animation",
        school: "California Institute of the Arts",
        year: "2010",
      },
    ],
    awards: [
      "Cannes Lions Gold - Best Animation (2023)",
      "Webby Award - Best Visual Design (2022)",
      "Communication Arts Award of Excellence (2021)",
    ],
    projects: ["luxury-watch-campaign", "tech-startup-brand"],
  },
  "marcus-rodriguez": {
    id: "marcus-rodriguez",
    name: "Marcus Rodriguez",
    role: "Lead 3D Animator",
    department: "Animation",
    bio: "Award-winning animator specializing in product visualization and character work",
    image: "/team-marcus-rodriguez.jpg",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "marcus@skitbit.com",
    fullBio:
      "Marcus is an award-winning 3D animator with a passion for bringing products and characters to life. With expertise in Cinema 4D, Blender, and Houdini, he creates photorealistic animations that captivate audiences. His work has been featured in major advertising campaigns and has won numerous industry awards.",
    expertise: [
      "3D Animation & Modeling",
      "Product Visualization",
      "Character Animation",
      "VFX & Simulation",
      "Rendering & Lighting",
      "Motion Graphics",
    ],
    experience: [
      {
        title: "Lead 3D Animator",
        company: "Skitbit",
        period: "2019 - Present",
        description: "Leading 3D animation projects and mentoring junior animators",
      },
      {
        title: "Senior Animator",
        company: "Pixel Perfect Studios",
        period: "2015 - 2019",
        description: "Created high-end product visualizations for luxury brands",
      },
      {
        title: "3D Artist",
        company: "Creative Collective",
        period: "2013 - 2015",
        description: "Worked on character animation for games and film",
      },
    ],
    education: [
      {
        degree: "BA in 3D Animation",
        school: "Savannah College of Art and Design",
        year: "2013",
      },
    ],
    awards: [
      "Motion Awards - Best Product Visualization (2023)",
      "3D Artist of the Year - CGI Awards (2022)",
      "Vimeo Staff Pick - Featured Animation (2021)",
    ],
    projects: ["luxury-watch-campaign", "product-launch-video", "automotive-showcase"],
  },
  "emily-watson": {
    id: "emily-watson",
    name: "Emily Watson",
    role: "Brand Strategist",
    department: "Strategy",
    bio: "Crafting compelling brand narratives that resonate with audiences",
    image: "/team-emily-watson.jpg",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "emily@skitbit.com",
    fullBio:
      "Emily is a strategic thinker who helps brands find their unique voice and connect with their audiences. With a background in marketing and psychology, she combines data-driven insights with creative storytelling to build brands that last. Her strategic approach has helped numerous startups and established companies redefine their market position.",
    expertise: [
      "Brand Strategy & Positioning",
      "Market Research & Analysis",
      "Brand Identity Development",
      "Messaging & Storytelling",
      "Competitive Analysis",
      "Go-to-Market Strategy",
    ],
    experience: [
      {
        title: "Brand Strategist",
        company: "Skitbit",
        period: "2021 - Present",
        description: "Developing brand strategies for diverse client portfolio",
      },
      {
        title: "Marketing Strategist",
        company: "Brand Builders Inc",
        period: "2018 - 2021",
        description: "Led rebranding initiatives for tech startups",
      },
      {
        title: "Brand Consultant",
        company: "Independent",
        period: "2016 - 2018",
        description: "Consulted for small businesses on brand development",
      },
    ],
    education: [
      {
        degree: "MBA in Marketing",
        school: "Northwestern University - Kellogg",
        year: "2016",
      },
      {
        degree: "BA in Psychology",
        school: "University of Michigan",
        year: "2014",
      },
    ],
    awards: [
      "Brand Strategy Excellence Award (2023)",
      "Marketing Week Award - Best Rebrand (2022)",
      "Strategy Magazine - Top 30 Under 30 (2020)",
    ],
    projects: ["tech-startup-brand", "restaurant-brand-identity"],
  },
  "david-kim": {
    id: "david-kim",
    name: "David Kim",
    role: "Motion Designer",
    department: "Design",
    bio: "Creating dynamic motion graphics that capture attention and drive engagement",
    image: "/team-david-kim.jpg",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "david@skitbit.com",
    fullBio:
      "David is a motion designer who specializes in creating eye-catching animations for social media and digital campaigns. His work combines bold design with smooth animation to create content that stops the scroll. With expertise in After Effects and Cinema 4D, he brings energy and excitement to every project.",
    expertise: [
      "Motion Graphics Design",
      "Social Media Content",
      "UI/UX Animation",
      "Typography Animation",
      "2D/3D Integration",
      "Video Editing",
    ],
    experience: [
      {
        title: "Motion Designer",
        company: "Skitbit",
        period: "2020 - Present",
        description: "Creating motion graphics for social media and advertising",
      },
      {
        title: "Animator",
        company: "Social First Agency",
        period: "2018 - 2020",
        description: "Produced viral content for major brands",
      },
      {
        title: "Junior Designer",
        company: "Motion Lab",
        period: "2017 - 2018",
        description: "Assisted on motion design projects",
      },
    ],
    education: [
      {
        degree: "BFA in Motion Design",
        school: "Ringling College of Art and Design",
        year: "2017",
      },
    ],
    awards: [
      "Motion Design Awards - Social Media Excellence (2023)",
      "Vimeo Staff Pick - Multiple Features (2022)",
      "Young Guns Award - Motion Design (2021)",
    ],
    projects: ["social-media-campaign", "music-festival-campaign"],
  },
  "lisa-patel": {
    id: "lisa-patel",
    name: "Lisa Patel",
    role: "Art Director",
    department: "Design",
    bio: "Bringing artistic vision to life with meticulous attention to detail",
    image: "/team-lisa-patel.jpg",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "lisa@skitbit.com",
    fullBio:
      "Lisa is an art director with a keen eye for detail and a passion for creating visually stunning work. She oversees the visual direction of projects from concept to completion, ensuring every element aligns with the creative vision. Her background in fine arts and graphic design brings a unique perspective to every project.",
    expertise: [
      "Art Direction",
      "Visual Design",
      "Creative Concepting",
      "Photography Direction",
      "Print & Digital Design",
      "Brand Guidelines",
    ],
    experience: [
      {
        title: "Art Director",
        company: "Skitbit",
        period: "2019 - Present",
        description: "Directing visual aspects of major client campaigns",
      },
      {
        title: "Senior Designer",
        company: "Design Studio Co",
        period: "2016 - 2019",
        description: "Led design for brand identity projects",
      },
      {
        title: "Graphic Designer",
        company: "Creative Agency",
        period: "2014 - 2016",
        description: "Designed for print and digital media",
      },
    ],
    education: [
      {
        degree: "MFA in Graphic Design",
        school: "Yale School of Art",
        year: "2014",
      },
      {
        degree: "BFA in Fine Arts",
        school: "Parsons School of Design",
        year: "2012",
      },
    ],
    awards: [
      "D&AD Award - Art Direction (2023)",
      "One Show Gold - Design Excellence (2022)",
      "Type Directors Club Award (2021)",
    ],
    projects: ["tech-startup-brand", "restaurant-brand-identity"],
  },
  "james-thompson": {
    id: "james-thompson",
    name: "James Thompson",
    role: "Senior Animator",
    department: "Animation",
    bio: "Pushing the boundaries of what's possible in 3D animation",
    image: "/team-james-thompson.jpg",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "james@skitbit.com",
    fullBio:
      "James is a senior animator who loves pushing the technical and creative boundaries of 3D animation. With expertise in complex simulations and procedural animation, he tackles the most challenging projects with enthusiasm. His technical knowledge combined with artistic sensibility makes him an invaluable member of the team.",
    expertise: [
      "Advanced 3D Animation",
      "Simulation & Dynamics",
      "Procedural Animation",
      "Technical Animation",
      "Rigging & Setup",
      "Pipeline Development",
    ],
    experience: [
      {
        title: "Senior Animator",
        company: "Skitbit",
        period: "2018 - Present",
        description: "Leading complex animation projects and technical development",
      },
      {
        title: "Technical Animator",
        company: "VFX House",
        period: "2015 - 2018",
        description: "Worked on film and commercial VFX",
      },
      {
        title: "3D Generalist",
        company: "Animation Studio",
        period: "2013 - 2015",
        description: "Contributed to various animation projects",
      },
    ],
    education: [
      {
        degree: "BS in Computer Animation",
        school: "Full Sail University",
        year: "2013",
      },
    ],
    awards: [
      "VES Award - Outstanding Animation (2023)",
      "SIGGRAPH - Technical Achievement (2022)",
      "Animation Magazine - Rising Star (2020)",
    ],
    projects: ["automotive-showcase", "product-launch-video"],
  },
  "nina-martinez": {
    id: "nina-martinez",
    name: "Nina Martinez",
    role: "Brand Designer",
    department: "Design",
    bio: "Designing memorable brand identities that stand the test of time",
    image: "/team-nina-martinez.jpg",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "nina@skitbit.com",
    fullBio:
      "Nina is a brand designer who creates visual identities that are both beautiful and functional. She believes great design should be timeless, versatile, and meaningful. Her work spans logo design, brand systems, and visual guidelines that help brands maintain consistency across all touchpoints.",
    expertise: [
      "Brand Identity Design",
      "Logo Design",
      "Visual Systems",
      "Typography",
      "Color Theory",
      "Brand Guidelines",
    ],
    experience: [
      {
        title: "Brand Designer",
        company: "Skitbit",
        period: "2020 - Present",
        description: "Designing brand identities for diverse clients",
      },
      {
        title: "Identity Designer",
        company: "Branding Agency",
        period: "2017 - 2020",
        description: "Created brand systems for startups and enterprises",
      },
      {
        title: "Junior Designer",
        company: "Design Firm",
        period: "2015 - 2017",
        description: "Assisted on branding and identity projects",
      },
    ],
    education: [
      {
        degree: "BFA in Graphic Design",
        school: "ArtCenter College of Design",
        year: "2015",
      },
    ],
    awards: [
      "Logo Lounge - Featured Designer (2023)",
      "Brand New Awards - Best Identity (2022)",
      "AIGA Design Award (2021)",
    ],
    projects: ["restaurant-brand-identity"],
  },
  "alex-nguyen": {
    id: "alex-nguyen",
    name: "Alex Nguyen",
    role: "Technical Director",
    department: "Technology",
    bio: "Bridging creativity and technology to deliver exceptional results",
    image: "/team-alex-nguyen.jpg",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "alex@skitbit.com",
    fullBio:
      "Alex is a technical director who ensures our creative vision is technically achievable and optimized. With a background in computer science and visual effects, he develops tools and workflows that empower the creative team to work more efficiently. His technical expertise is crucial in delivering complex projects on time and on budget.",
    expertise: [
      "Technical Direction",
      "Pipeline Development",
      "Workflow Optimization",
      "Rendering Solutions",
      "Scripting & Automation",
      "Quality Assurance",
    ],
    experience: [
      {
        title: "Technical Director",
        company: "Skitbit",
        period: "2019 - Present",
        description: "Managing technical infrastructure and pipeline development",
      },
      {
        title: "Pipeline TD",
        company: "Animation Studio",
        period: "2016 - 2019",
        description: "Developed tools for animation production",
      },
      {
        title: "Technical Artist",
        company: "Game Studio",
        period: "2014 - 2016",
        description: "Bridged art and engineering teams",
      },
    ],
    education: [
      {
        degree: "MS in Computer Science",
        school: "Carnegie Mellon University",
        year: "2014",
      },
      {
        degree: "BS in Computer Graphics",
        school: "University of Southern California",
        year: "2012",
      },
    ],
    awards: [
      "SIGGRAPH - Technical Paper (2023)",
      "VES Award - Technical Achievement (2022)",
      "ACM SIGGRAPH - Emerging Technologies (2021)",
    ],
    projects: ["automotive-showcase", "luxury-watch-campaign"],
  },
}

export function generateStaticParams() {
  return Object.keys(teamData).map((id) => ({ id }))
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const member = teamData[params.id]
  if (!member) return {}

  return {
    title: `${member.name} - ${member.role} | Skitbit Team`,
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
            <div className="relative aspect-square rounded-2xl overflow-hidden liquid-glass border border-white/10 lg:sticky lg:top-24">
              <img src={member.image || "/placeholder.svg"} alt={member.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Social Links */}
              <div className="absolute bottom-6 left-6 right-6 flex gap-3">
                <Button
                  size="icon"
                  className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
                  asChild
                >
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-5 w-5" />
                  </a>
                </Button>
                <Button
                  size="icon"
                  className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
                  asChild
                >
                  <a href={member.twitter} target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-5 w-5" />
                  </a>
                </Button>
                <Button
                  size="icon"
                  className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
                  asChild
                >
                  <a href={`mailto:${member.email}`}>
                    <Mail className="h-5 w-5" />
                  </a>
                </Button>
              </div>

              {/* Department Badge */}
              <div className="absolute top-6 right-6">
                <span className="inline-flex items-center rounded-full bg-black/60 backdrop-blur-sm px-4 py-2 text-sm font-medium text-lime-400 border border-lime-400/30">
                  {member.department}
                </span>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h1 className="mb-2 text-4xl font-extrabold tracking-tight sm:text-5xl text-white">{member.name}</h1>
                <p className="text-2xl font-medium text-lime-400 mb-4">{member.role}</p>
                <p className="text-lg text-gray-300 leading-relaxed">{member.fullBio}</p>
              </div>

              {/* Expertise */}
              <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Areas of Expertise</h2>
                <div className="flex flex-wrap gap-2">
                  {member.expertise.map((skill: string) => (
                    <span
                      key={skill}
                      className="rounded-full bg-white/5 border border-white/10 px-4 py-2 text-sm text-gray-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Card>

              {/* Contact CTA */}
              <Card className="liquid-glass-enhanced border border-white/15 bg-white/10 backdrop-blur-xl p-6">
                <h3 className="text-lg font-bold text-white mb-3">Get in Touch</h3>
                <p className="text-sm text-gray-300 mb-4">
                  Interested in working together? Feel free to reach out directly
                </p>
                <Button asChild className="w-full rounded-full bg-lime-400 text-black hover:bg-lime-300 font-semibold">
                  <a href={`mailto:${member.email}`}>
                    Send Email
                    <Mail className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* Experience */}
        <section className="container mx-auto px-4 pb-12">
          <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <Briefcase className="h-6 w-6 text-lime-400" />
              <h2 className="text-2xl font-bold text-white">Experience</h2>
            </div>
            <div className="space-y-6">
              {member.experience.map((exp: any, idx: number) => (
                <div key={idx} className="border-l-2 border-lime-400/30 pl-6 pb-6 last:pb-0">
                  <h3 className="text-lg font-semibold text-white mb-1">{exp.title}</h3>
                  <div className="text-lime-400 font-medium mb-2">
                    {exp.company} • {exp.period}
                  </div>
                  <p className="text-gray-300">{exp.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* Education & Awards */}
        <section className="container mx-auto px-4 pb-12">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Education */}
            <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <GraduationCap className="h-6 w-6 text-lime-400" />
                <h2 className="text-2xl font-bold text-white">Education</h2>
              </div>
              <div className="space-y-4">
                {member.education.map((edu: any, idx: number) => (
                  <div key={idx}>
                    <h3 className="text-lg font-semibold text-white mb-1">{edu.degree}</h3>
                    <div className="text-gray-400">
                      {edu.school} • {edu.year}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Awards */}
            <Card className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Award className="h-6 w-6 text-lime-400" />
                <h2 className="text-2xl font-bold text-white">Awards & Recognition</h2>
              </div>
              <ul className="space-y-3">
                {member.awards.map((award: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="mt-1.5 h-2 w-2 rounded-full bg-lime-400 flex-shrink-0" />
                    <span className="text-gray-300">{award}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </section>

        {/* Featured Projects */}
        {member.projects && member.projects.length > 0 && (
          <section className="container mx-auto px-4 pb-16 sm:pb-24">
            <h2 className="text-3xl font-bold text-white mb-8">Featured Projects</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {member.projects.map((projectId: string) => (
                <Card
                  key={projectId}
                  className="liquid-glass border border-white/10 bg-white/5 backdrop-blur-xl p-4 hover:border-white/20 transition-all"
                >
                  <Link href={`/projects/${projectId}`} className="block">
                    <div className="text-lime-400 font-medium mb-2">View Project →</div>
                    <div className="text-white capitalize">{projectId.replace(/-/g, " ")}</div>
                  </Link>
                </Card>
              ))}
            </div>
          </section>
        )}

        <AppverseFooter />
      </main>
    </>
  )
}
