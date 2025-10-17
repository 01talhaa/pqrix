"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth, type UserRole } from "@/lib/auth"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log("ProtectedRoute checking auth:", { isAuthenticated, user, requiredRole })
    
    // Give time for store to rehydrate
    const timer = setTimeout(() => {
      setIsLoading(false)
      
      console.log("After rehydration:", { isAuthenticated, user, requiredRole })
      
      if (!isAuthenticated) {
        console.log("Not authenticated, redirecting to login")
        router.push("/admin/login")
        return
      }

      if (requiredRole && user?.role !== requiredRole) {
        console.log("Wrong role, redirecting to login")
        router.push("/admin/login")
      } else {
        console.log("Auth check passed!")
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [isAuthenticated, user, requiredRole, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    return null
  }

  return <>{children}</>
}
