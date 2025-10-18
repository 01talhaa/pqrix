import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, User, Eye, Tag } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface BlogPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getBlog(slug: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/blogs/${slug}`, {
      cache: 'no-store',
    })
    
    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.success ? data.data : null
  } catch (error) {
    console.error("Error fetching blog:", error)
    return null
  }
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlog(slug)

  if (!blog) {
    return {
      title: "Blog Not Found",
    }
  }

  return {
    title: blog.title,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: blog.coverImage ? [blog.coverImage] : [],
    },
  }
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params
  const blog = await getBlog(slug)

  if (!blog || blog.status !== 'published') {
    notFound()
  }

  const publishedDate = blog.publishedAt ? new Date(blog.publishedAt) : new Date(blog.createdAt)

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section with Cover Image */}
      {blog.coverImage && (
        <div className="relative h-[60vh] w-full">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${blog.coverImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
          </div>
          
          {/* Back Button */}
          <div className="relative z-10 container mx-auto px-4 pt-8">
            <Link href="/#blogs">
              <Button variant="outline" className="border-white/20 text-black hover:bg-white/10 hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blogs
              </Button>
            </Link>
          </div>

          {/* Title Overlay */}
          <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 max-w-4xl">
              {blog.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{blog.author.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{publishedDate.toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{blog.views || 0} views</span>
              </div>
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {blog.tags.map((tag: string, idx: number) => (
                  <Badge 
                    key={idx} 
                    className="bg-lime-400/20 text-lime-400 border-lime-400/50"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        {!blog.coverImage && (
          <div className="mb-8">
            <Link href="/#blogs">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blogs
              </Button>
            </Link>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {blog.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-white/80 mb-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{blog.author.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{publishedDate.toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{blog.views || 0} views</span>
              </div>
            </div>

            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag: string, idx: number) => (
                  <Badge 
                    key={idx} 
                    className="bg-lime-400/20 text-lime-400 border-lime-400/50"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          {/* Excerpt */}
          <div className="mb-8">
            <p className="text-xl text-white/80 leading-relaxed">
              {blog.excerpt}
            </p>
          </div>

          {/* Content */}
<Card className="border-white/10 bg-black/40 backdrop-blur-xl p-8 text-white">
  <div
    className="prose prose-invert prose-lg max-w-none
      prose-headings:text-white 
      prose-p:text-white 
      prose-a:text-lime-400 hover:prose-a:text-lime-300
      prose-strong:text-white
      prose-code:text-lime-400
      prose-pre:bg-black/60 prose-pre:border prose-pre:border-white/10
      prose-blockquote:border-lime-400 prose-blockquote:text-white/80
      prose-ul:text-white
      prose-ol:text-white
      prose-li:text-white"
    dangerouslySetInnerHTML={{ __html: blog.content }}
  />
</Card>


          {/* Additional Images Gallery */}
          {blog.images && blog.images.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Tag className="h-6 w-6 text-lime-400" />
                Gallery
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {blog.images.map((image: string, idx: number) => (
                  <a key={idx} href={image} target="_blank" rel="noopener noreferrer">
                    <Card className="border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden group cursor-pointer">
                      <img
                        src={image}
                        alt={`Gallery image ${idx + 1}`}
                        className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                      />
                    </Card>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Author Card */}
          <Card className="border-white/10 bg-black/40 backdrop-blur-xl p-6 mt-12">
            <div className="flex items-center gap-4">
              {blog.author.image ? (
                <img
                  src={blog.author.image}
                  alt={blog.author.name}
                  className="h-16 w-16 rounded-full object-cover border-2 border-lime-400"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-lime-400/20 flex items-center justify-center border-2 border-lime-400">
                  <span className="text-lime-400 font-bold text-2xl">
                    {blog.author.name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <p className="text-sm text-white/60">Written by</p>
                <p className="text-lg font-semibold text-white">{blog.author.name}</p>
              </div>
            </div>
          </Card>

          {/* Navigation */}
          <div className="flex justify-center mt-12">
            <Link href="/#blogs">
              <Button className="bg-lime-400 text-black hover:bg-lime-300">
                View More Blogs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
