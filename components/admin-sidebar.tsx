"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Briefcase,
  FolderKanban,
  Users,
  UsersRound,
  MessageSquare,
  Newspaper,
  Image,
  Megaphone,
  Lightbulb,
  Clipboard,
  ChevronLeft,
  ChevronRight,
  Wallet,
} from "lucide-react"

interface NavItem {
  label: string
  href: string
  icon: any
}

interface NavCategory {
  category: string
  items: NavItem[]
}

const navigation: NavCategory[] = [
  {
    category: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    category: "Business",
    items: [
      { label: "Bookings", href: "/admin/bookings", icon: Calendar },
      { label: "Invoices", href: "/admin/invoices", icon: Wallet },
      { label: "Clients", href: "/admin/clients", icon: UsersRound },
    ],
  },
  {
    category: "Content",
    items: [
      { label: "Services", href: "/admin/services", icon: Briefcase },
      { label: "Projects", href: "/admin/projects", icon: FolderKanban },
      { label: "Team", href: "/admin/team", icon: Users },
      { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
      { label: "Blogs", href: "/admin/blogs", icon: Newspaper },
      { label: "Insights", href: "/admin/insights", icon: Lightbulb },
    ],
  },
  {
    category: "Marketing",
    items: [
      { label: "Banners", href: "/admin/banners", icon: Image },
      { label: "Ads", href: "/admin/ads", icon: Megaphone },
    ],
  },
  {
    category: "Careers",
    items: [
      { label: "Job Postings", href: "/admin/careers", icon: FileText },
      { label: "Applications", href: "/admin/applications", icon: Clipboard },
    ],
  },
]

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-white dark:bg-black border-r border-gray-200 dark:border-white/10 transition-all duration-300 z-40",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-white/10">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-lime-400 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-lg text-black dark:text-white">PQRIX</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/5"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {navigation.map((category) => (
          <div key={category.category} className="mb-6">
            {!collapsed && (
              <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                {category.category}
              </h3>
            )}
            <div className="space-y-1">
              {category.items.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-all group",
                      isActive
                        ? "bg-green-500 dark:bg-lime-400 text-white dark:text-black font-medium shadow-lg shadow-green-500/20 dark:shadow-lime-400/20"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className={cn("w-5 h-5 flex-shrink-0", collapsed && "mx-auto")} />
                    {!collapsed && <span className="text-sm">{item.label}</span>}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse indicator when collapsed */}
      {collapsed && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-lime-400 rounded-full" />
        </div>
      )}
    </aside>
  )
}
