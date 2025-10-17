"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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

const COLORS = ['#a3e635', '#8b5cf6', '#3b82f6', '#f97316']

export default function AdminDashboard() {
  const [services, setServices] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [servicesRes, projectsRes, teamRes] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/projects'),
        fetch('/api/team')
      ])

      const servicesData = await servicesRes.json()
      const projectsData = await projectsRes.json()
      const teamData = await teamRes.json()

      setServices(servicesData.success ? servicesData.data : [])
      setProjects(projectsData.success ? projectsData.data : [])
      setTeamMembers(teamData.success ? teamData.data : [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

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
      title: "Total Orders",
      value: 0,
      icon: Package,
      href: "/admin",
      color: "text-orange-400",
    },
  ]

  // Chart data
  const pieData = [
    { name: 'Services', value: services.length, color: '#8b5cf6' },
    { name: 'Projects', value: projects.length, color: '#a3e635' },
    { name: 'Team', value: teamMembers.length, color: '#3b82f6' },
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
                    <p className="text-white/60 text-sm">{stat.title}</p>
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
    </div>
  )
}
