"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, FolderKanban, Users, TrendingUp, Package } from "lucide-react"
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

const COLORS = ['#a3e635', '#8b5cf6', '#3b82f6', '#f97316']

export default function AdminDashboard() {
  const [services, setServices] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [bookings, setBookings] = useState<ServiceBookingDocument[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [servicesRes, projectsRes, teamRes, bookingsRes] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/projects'),
        fetch('/api/team'),
        fetch('/api/bookings')
      ])

      const servicesData = await servicesRes.json()
      const projectsData = await projectsRes.json()
      const teamData = await teamRes.json()
      const bookingsData = await bookingsRes.json()

      setServices(servicesData.success ? servicesData.data : [])
      setProjects(projectsData.success ? projectsData.data : [])
      setTeamMembers(teamData.success ? teamData.data : [])
      setBookings(bookingsData.success ? bookingsData.data : [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const newInquiries = bookings.filter(b => b.status === "Inquired").length

  const stats = [
    {
      title: "Total Services",
      value: services.length,
      icon: Briefcase,
      href: "/admin/services",
      color: "text-purple-400",
    },
    {
      title: "Total Projects",
      value: projects.length,
      icon: FolderKanban,
      href: "/admin/projects",
      color: "text-lime-400",
    },
    {
      title: "Team Members",
      value: teamMembers.length,
      icon: Users,
      href: "/admin/team",
      color: "text-blue-400",
    },
    {
      title: "Service Bookings",
      value: bookings.length,
      icon: Package,
      href: "/admin/bookings",
      color: "text-orange-400",
      badge: newInquiries > 0 ? newInquiries : undefined,
    },
  ]

  // Chart data
  const pieData = [
    { name: 'Services', value: services.length, color: '#8b5cf6' },
    { name: 'Projects', value: projects.length, color: '#a3e635' },
    { name: 'Team', value: teamMembers.length, color: '#3b82f6' },
    { name: 'Bookings', value: bookings.length, color: '#f97316' },
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
    { month: 'Jan', projects: 4, services: 2 },
    { month: 'Feb', projects: 6, services: 3 },
    { month: 'Mar', projects: 8, services: 5 },
    { month: 'Apr', projects: 12, services: 6 },
    { month: 'May', projects: 15, services: 8 },
    { month: 'Jun', projects: projects.length, services: services.length },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Dashboard Overview
        </h1>
        <p className="text-white/60 mt-2">Manage your agency content and data</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="border-white/10 bg-black/40 backdrop-blur-xl hover:border-white/20 transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-white/60 text-sm">{stat.title}</p>
                      {stat.badge !== undefined && stat.badge > 0 && (
                        <Badge className="bg-yellow-500 text-black text-xs px-2 py-0.5">
                          {stat.badge} new
                        </Badge>
                      )}
                    </div>
                    <p className="text-3xl font-bold text-white mt-2">
                      {loading ? '...' : stat.value}
                    </p>
                  </div>
                  <stat.icon className={`w-12 h-12 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button asChild className="h-auto py-6 flex-col gap-2 bg-lime-400 text-black hover:bg-lime-300">
            <Link href="/admin/services/new">
              <Briefcase className="w-6 h-6" />
              <span>Add New Service</span>
            </Link>
          </Button>
          <Button asChild className="h-auto py-6 flex-col gap-2 bg-lime-400 text-black hover:bg-lime-300">
            <Link href="/admin/projects/new">
              <FolderKanban className="w-6 h-6" />
              <span>Add New Project</span>
            </Link>
          </Button>
          <Button asChild className="h-auto py-6 flex-col gap-2 bg-lime-400 text-black hover:bg-lime-300">
            <Link href="/admin/team/new">
              <Users className="w-6 h-6" />
              <span>Add Team Member</span>
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!loading && services.length > 0 && (
              <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
                <Briefcase className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-white font-medium">{services.length} Services Available</p>
                  <p className="text-white/60 text-sm">Latest: {services[0]?.title || 'N/A'}</p>
                </div>
              </div>
            )}
            {!loading && projects.length > 0 && (
              <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
                <FolderKanban className="w-5 h-5 text-lime-400" />
                <div>
                  <p className="text-white font-medium">{projects.length} Projects Completed</p>
                  <p className="text-white/60 text-sm">Latest: {projects[0]?.title || 'N/A'}</p>
                </div>
              </div>
            )}
            {!loading && teamMembers.length > 0 && (
              <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
                <Users className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-white font-medium">{teamMembers.length} Team Members</p>
                  <p className="text-white/60 text-sm">Latest: {teamMembers[0]?.name || 'N/A'}</p>
                </div>
              </div>
            )}
            {!loading && services.length === 0 && projects.length === 0 && teamMembers.length === 0 && (
              <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
                <TrendingUp className="w-5 h-5 text-lime-400" />
                <div>
                  <p className="text-white font-medium">System initialized</p>
                  <p className="text-white/60 text-sm">Admin panel is ready to use</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Distribution Pie Chart */}
        <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Content Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.name} ${(entry.percent * 100).toFixed(0)}%`}
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
        <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Project Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="status" 
                  stroke="#fff" 
                  tick={{ fill: '#fff' }}
                />
                <YAxis 
                  stroke="#fff" 
                  tick={{ fill: '#fff' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="count" fill="#a3e635" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Growth Trend Line Chart */}
        <Card className="border-white/10 bg-black/40 backdrop-blur-xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Growth Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="month" 
                  stroke="#fff" 
                  tick={{ fill: '#fff' }}
                />
                <YAxis 
                  stroke="#fff" 
                  tick={{ fill: '#fff' }}
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
                  wrapperStyle={{ color: '#fff' }}
                  iconType="circle"
                />
                <Line 
                  type="monotone" 
                  dataKey="projects" 
                  stroke="#a3e635" 
                  strokeWidth={3}
                  dot={{ fill: '#a3e635', r: 6 }}
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="services" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Service Bookings */}
      {bookings.length > 0 && (
        <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white">Recent Service Bookings</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/bookings">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookings.slice(0, 5).map((booking) => {
                const getStatusColor = (status: string) => {
                  switch (status) {
                    case "Inquired":
                      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                    case "Pending":
                      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                    case "Paid":
                      return "bg-purple-500/20 text-purple-400 border-purple-500/50"
                    case "Started":
                      return "bg-blue-500/20 text-blue-400 border-blue-500/50"
                    case "In Progress":
                      return "bg-blue-500/20 text-blue-400 border-blue-500/50"
                    case "Completed":
                      return "bg-green-500/20 text-green-400 border-green-500/50"
                    case "Cancelled":
                      return "bg-orange-500/20 text-orange-400 border-orange-500/50"
                    default:
                      return "bg-gray-500/20 text-gray-400 border-gray-500/50"
                  }
                }

                return (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold text-white">{booking.serviceTitle}</h4>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-purple-400">{booking.packageName} - ${booking.packagePrice}</p>
                      <p className="text-xs text-white/60 mt-1">{booking.clientEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-white/60">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
                      {booking.whatsappMessageSent && (
                        <p className="text-xs text-green-400 mt-1">WhatsApp sent</p>
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
