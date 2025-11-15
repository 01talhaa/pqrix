"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Briefcase, 
  FolderKanban, 
  Users, 
  Package, 
  FileText, 
  Lightbulb, 
  UsersRound, 
  Clipboard,
  MessageSquare,
  Newspaper,
  TrendingUp,
  Calendar,
  DollarSign,
  Eye
} from "lucide-react"
import Link from "next/link"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts"
import { ServiceBookingDocument } from "@/lib/models/ServiceBooking"

const COLORS = ['#22c55e', '#84cc16', '#3b82f6', '#a855f7', '#f59e0b', '#ec4899']

export default function AdminDashboard() {
  const [services, setServices] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [bookings, setBookings] = useState<ServiceBookingDocument[]>([])
  const [insights, setInsights] = useState<any[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [
        servicesRes, 
        projectsRes, 
        teamRes, 
        bookingsRes,
        insightsRes,
        jobsRes,
        applicationsRes,
        clientsRes,
        testimonialsRes,
        blogsRes
      ] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/projects'),
        fetch('/api/team'),
        fetch('/api/bookings'),
        fetch('/api/insights'),
        fetch('/api/careers?admin=true'),
        fetch('/api/careers/applications'),
        fetch('/api/clients'),
        fetch('/api/testimonials'),
        fetch('/api/blogs')
      ])

      const servicesData = await servicesRes.json()
      const projectsData = await projectsRes.json()
      const teamData = await teamRes.json()
      const bookingsData = await bookingsRes.json()
      const insightsData = await insightsRes.json()
      const jobsData = await jobsRes.json()
      const applicationsData = await applicationsRes.json()
      const clientsData = await clientsRes.json()
      const testimonialsData = await testimonialsRes.json()
      const blogsData = await blogsRes.json()

      setServices(servicesData.success ? servicesData.data : [])
      setProjects(projectsData.success ? projectsData.data : [])
      setTeamMembers(teamData.success ? teamData.data : [])
      setBookings(bookingsData.success ? bookingsData.data : [])
      setInsights(insightsData.success ? insightsData.data : [])
      setJobs(jobsData.success ? jobsData.data : [])
      setApplications(applicationsData.success ? applicationsData.data : [])
      setClients(clientsData.success ? clientsData.data : [])
      setTestimonials(testimonialsData.success ? testimonialsData.data : [])
      setBlogs(blogsData.success ? blogsData.data : [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const newInquiries = bookings.filter(b => b.status === "Inquired").length
  const activeJobs = jobs.filter(j => j.status === "active").length
  const pendingApplications = applications.filter(a => a.status === "pending").length

  const stats = [
    {
      title: "Total Services",
      value: services.length,
      icon: Briefcase,
      href: "/admin/services",
      color: "text-green-600 dark:text-lime-400",
      bgColor: "bg-green-500/10 dark:bg-lime-400/10",
    },
    {
      title: "Total Projects",
      value: projects.length,
      icon: FolderKanban,
      href: "/admin/projects",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10 dark:bg-blue-400/10",
    },
    {
      title: "Team Members",
      value: teamMembers.length,
      icon: Users,
      href: "/admin/team",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-500/10 dark:bg-purple-400/10",
    },
    {
      title: "Service Bookings",
      value: bookings.length,
      icon: Package,
      href: "/admin/bookings",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-500/10 dark:bg-orange-400/10",
      badge: newInquiries > 0 ? newInquiries : undefined,
    },
    {
      title: "Industry Insights",
      value: insights.length,
      icon: Lightbulb,
      href: "/admin/insights",
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-500/10 dark:bg-yellow-400/10",
    },
    {
      title: "Job Postings",
      value: jobs.length,
      icon: FileText,
      href: "/admin/careers",
      color: "text-pink-600 dark:text-pink-400",
      bgColor: "bg-pink-500/10 dark:bg-pink-400/10",
      badge: activeJobs > 0 ? `${activeJobs} active` : undefined,
    },
    {
      title: "Applications",
      value: applications.length,
      icon: Clipboard,
      href: "/admin/applications",
      color: "text-cyan-600 dark:text-cyan-400",
      bgColor: "bg-cyan-500/10 dark:bg-cyan-400/10",
      badge: pendingApplications > 0 ? `${pendingApplications} pending` : undefined,
    },
    {
      title: "Clients",
      value: clients.length,
      icon: UsersRound,
      href: "/admin/clients",
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-500/10 dark:bg-indigo-400/10",
    },
    {
      title: "Testimonials",
      value: testimonials.length,
      icon: MessageSquare,
      href: "/admin/testimonials",
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-500/10 dark:bg-emerald-400/10",
    },
    {
      title: "Blog Posts",
      value: blogs.length,
      icon: Newspaper,
      href: "/admin/blogs",
      color: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-500/10 dark:bg-rose-400/10",
    },
  ]

  // Chart data
  const pieData = [
    { name: 'Services', value: services.length, color: '#22c55e' },
    { name: 'Projects', value: projects.length, color: '#3b82f6' },
    { name: 'Insights', value: insights.length, color: '#eab308' },
    { name: 'Jobs', value: jobs.length, color: '#ec4899' },
    { name: 'Blogs', value: blogs.length, color: '#f97316' },
  ]

  const projectStatusData = [
    { 
      status: 'Completed', 
      count: projects.filter(p => p.status === 'Completed').length 
    },
    { 
      status: 'In Progress', 
      count: projects.filter(p => p.status === 'In Progress').length 
    },
    { 
      status: 'On Hold', 
      count: projects.filter(p => p.status === 'On Hold').length 
    },
  ]

  const monthlyData = [
    { month: 'Jan', projects: 4, services: 2, insights: 1 },
    { month: 'Feb', projects: 6, services: 3, insights: 2 },
    { month: 'Mar', projects: 8, services: 5, insights: 3 },
    { month: 'Apr', projects: 12, services: 6, insights: 5 },
    { month: 'May', projects: 15, services: 8, insights: 7 },
    { month: 'Jun', projects: projects.length, services: services.length, insights: insights.length },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your agency content and data</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="liquid-glass border border-gray-200 dark:border-white/10 hover:border-green-500/50 dark:hover:border-lime-400/50 transition-all cursor-pointer group h-full">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  {stat.badge !== undefined && (
                    <Badge className="bg-green-500 dark:bg-lime-400 text-white dark:text-black text-xs px-2 py-0.5 shadow-lg">
                      {stat.badge}
                    </Badge>
                  )}
                </div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {stat.title}
                </h3>
                <p className="text-2xl font-bold text-black dark:text-white">
                  {loading ? '...' : stat.value}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="liquid-glass border border-gray-200 dark:border-white/10">
        <CardHeader>
          <CardTitle className="text-black dark:text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button asChild className="h-auto py-6 flex-col gap-2 bg-green-500 dark:bg-lime-400 text-white dark:text-black hover:bg-green-600 dark:hover:bg-lime-300 shadow-lg shadow-green-500/20 dark:shadow-lime-400/20">
            <Link href="/admin/services/new">
              <Briefcase className="w-6 h-6" />
              <span>Add Service</span>
            </Link>
          </Button>
          <Button asChild className="h-auto py-6 flex-col gap-2 bg-green-500 dark:bg-lime-400 text-white dark:text-black hover:bg-green-600 dark:hover:bg-lime-300 shadow-lg shadow-green-500/20 dark:shadow-lime-400/20">
            <Link href="/admin/projects/new">
              <FolderKanban className="w-6 h-6" />
              <span>Add Project</span>
            </Link>
          </Button>
          <Button asChild className="h-auto py-6 flex-col gap-2 bg-green-500 dark:bg-lime-400 text-white dark:text-black hover:bg-green-600 dark:hover:bg-lime-300 shadow-lg shadow-green-500/20 dark:shadow-lime-400/20">
            <Link href="/admin/insights/new">
              <Lightbulb className="w-6 h-6" />
              <span>Add Insight</span>
            </Link>
          </Button>
          <Button asChild className="h-auto py-6 flex-col gap-2 bg-green-500 dark:bg-lime-400 text-white dark:text-black hover:bg-green-600 dark:hover:bg-lime-300 shadow-lg shadow-green-500/20 dark:shadow-lime-400/20">
            <Link href="/admin/careers/new">
              <FileText className="w-6 h-6" />
              <span>Post Job</span>
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="liquid-glass border border-gray-200 dark:border-white/10">
        <CardHeader>
          <CardTitle className="text-black dark:text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {!loading && services.length > 0 && (
              <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                <div className="p-2 rounded-lg bg-green-500/10 dark:bg-lime-400/10">
                  <Briefcase className="w-5 h-5 text-green-600 dark:text-lime-400" />
                </div>
                <div className="flex-1">
                  <p className="text-black dark:text-white font-medium">{services.length} Services Available</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Latest: {services[0]?.title || 'N/A'}</p>
                </div>
              </div>
            )}
            {!loading && projects.length > 0 && (
              <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                <div className="p-2 rounded-lg bg-blue-500/10 dark:bg-blue-400/10">
                  <FolderKanban className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-black dark:text-white font-medium">{projects.length} Projects Completed</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Latest: {projects[0]?.title || 'N/A'}</p>
                </div>
              </div>
            )}
            {!loading && insights.length > 0 && (
              <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                <div className="p-2 rounded-lg bg-yellow-500/10 dark:bg-yellow-400/10">
                  <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="flex-1">
                  <p className="text-black dark:text-white font-medium">{insights.length} Industry Insights</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Latest: {insights[0]?.title || 'N/A'}</p>
                </div>
              </div>
            )}
            {!loading && jobs.length > 0 && (
              <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                <div className="p-2 rounded-lg bg-pink-500/10 dark:bg-pink-400/10">
                  <FileText className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                </div>
                <div className="flex-1">
                  <p className="text-black dark:text-white font-medium">{jobs.length} Job Postings ({activeJobs} Active)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Latest: {jobs[0]?.title || 'N/A'}</p>
                </div>
              </div>
            )}
            {!loading && applications.length > 0 && (
              <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                <div className="p-2 rounded-lg bg-cyan-500/10 dark:bg-cyan-400/10">
                  <Clipboard className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div className="flex-1">
                  <p className="text-black dark:text-white font-medium">{applications.length} Job Applications ({pendingApplications} Pending)</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Review applications from potential candidates</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Distribution Pie Chart */}
        <Card className="liquid-glass border border-gray-200 dark:border-white/10">
          <CardHeader>
            <CardTitle className="text-black dark:text-white">Content Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.name}: ${entry.value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Project Status Bar Chart */}
        <Card className="liquid-glass border border-gray-200 dark:border-white/10">
          <CardHeader>
            <CardTitle className="text-black dark:text-white">Project Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(150,150,150,0.2)" />
                <XAxis 
                  dataKey="status" 
                  stroke="#888" 
                  tick={{ fill: '#888' }}
                />
                <YAxis 
                  stroke="#888" 
                  tick={{ fill: '#888' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="count" fill="#22c55e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Growth Trend Line Chart */}
        <Card className="liquid-glass border border-gray-200 dark:border-white/10 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-black dark:text-white">Growth Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(150,150,150,0.2)" />
                <XAxis 
                  dataKey="month" 
                  stroke="#888" 
                  tick={{ fill: '#888' }}
                />
                <YAxis 
                  stroke="#888" 
                  tick={{ fill: '#888' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend 
                  wrapperStyle={{ color: '#888' }}
                  iconType="circle"
                />
                <Line 
                  type="monotone" 
                  dataKey="projects" 
                  stroke="#22c55e" 
                  strokeWidth={3}
                  dot={{ fill: '#22c55e', r: 6 }}
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="services" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 6 }}
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="insights" 
                  stroke="#eab308" 
                  strokeWidth={3}
                  dot={{ fill: '#eab308', r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Service Bookings */}
      {bookings.length > 0 && (
        <Card className="liquid-glass border border-gray-200 dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-black dark:text-white">Recent Service Bookings</CardTitle>
            <Button asChild variant="outline" size="sm" className="border-gray-200 dark:border-white/10">
              <Link href="/admin/bookings">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bookings.slice(0, 5).map((booking) => {
                const getStatusColor = (status: string) => {
                  switch (status) {
                    case "Inquired":
                      return "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/50"
                    case "Pending":
                      return "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/50"
                    case "Paid":
                      return "bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/50"
                    case "Started":
                      return "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/50"
                    case "In Progress":
                      return "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/50"
                    case "Completed":
                      return "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/50"
                    case "Cancelled":
                      return "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/50"
                    default:
                      return "bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-500/50"
                  }
                }

                return (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold text-black dark:text-white">{booking.serviceTitle}</h4>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-green-600 dark:text-lime-400 font-medium">{booking.packageName} - ${booking.packagePrice}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{booking.clientEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
                      {booking.whatsappMessageSent && (
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">✓ WhatsApp sent</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
