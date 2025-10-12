"use client"

import { useDataStore } from "@/lib/data-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, FolderKanban, Users, TrendingUp, Package } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const { services, projects, teamMembers, orders } = useDataStore()

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
      value: orders.length,
      icon: Package,
      href: "/admin",
      color: "text-orange-400",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-lime-400 bg-clip-text text-transparent">
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
                    <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
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
          <Button asChild className="h-auto py-6 flex-col gap-2">
            <Link href="/admin/services">
              <Briefcase className="w-6 h-6" />
              <span>Manage Services</span>
            </Link>
          </Button>
          <Button asChild className="h-auto py-6 flex-col gap-2 bg-transparent" variant="outline">
            <Link href="/admin/projects">
              <FolderKanban className="w-6 h-6" />
              <span>Manage Projects</span>
            </Link>
          </Button>
          <Button asChild className="h-auto py-6 flex-col gap-2 bg-transparent" variant="outline">
            <Link href="/admin/team">
              <Users className="w-6 h-6" />
              <span>Manage Team</span>
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
            <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
              <TrendingUp className="w-5 h-5 text-lime-400" />
              <div>
                <p className="text-white font-medium">System initialized</p>
                <p className="text-white/60 text-sm">Admin panel is ready to use</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
