"use client"

import type React from "react"

import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { LogOut } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    // Clear the cookie
    document.cookie = "admin-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC"
    logout()
    router.push("/admin/login")
  }

  // If it's the login page, don't wrap with ProtectedRoute
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-white dark:bg-black">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content Area */}
        <div className="ml-64 transition-all duration-300">
          {/* Minimal Header */}
          <header className="sticky top-0 z-30 h-16 border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-xl">
            <div className="h-full px-6 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Admin Panel</h2>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Welcome, <span className="font-medium text-black dark:text-white">{user?.name || 'Admin'}</span>
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
