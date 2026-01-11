"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth, type UserRole } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>, role: UserRole) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const success = await login(email, password, role)

    if (success) {
      if (role === "admin") {
        router.push("/admin")
      } else {
        router.push("/client/dashboard")
      }
    } else {
      setError("Invalid email or password")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-black">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black" />

      <Card className="w-full max-w-md relative border-red-500/20 bg-black/60 backdrop-blur-xl shadow-lg shadow-red-500/10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-gray-300">Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="client" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-black/40 border border-red-500/20">
              <TabsTrigger value="client" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-800 data-[state=active]:text-white">Client Login</TabsTrigger>
              <TabsTrigger value="admin" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-red-800 data-[state=active]:text-white">Admin Login</TabsTrigger>
            </TabsList>

            <TabsContent value="client">
              <form onSubmit={(e) => handleLogin(e, "client")} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="client-email">Email</Label>
                  <Input
                    id="client-email"
                    name="email"
                    type="email"
                    placeholder="client@example.com"
                    required
                    className="bg-black/50 border-red-500/30 focus:border-red-500/50 focus:ring-red-500/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-password">Password</Label>
                  <Input
                    id="client-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="bg-black/50 border-red-500/30 focus:border-red-500/50 focus:ring-red-500/30"
                  />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
                <p className="text-sm text-center text-gray-400">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-red-400 hover:text-red-300">
                    Register here
                  </Link>
                </p>
                <p className="text-xs text-center text-gray-500 mt-4">Demo: client@example.com / client123</p>
              </form>
            </TabsContent>

            <TabsContent value="admin">
              <form onSubmit={(e) => handleLogin(e, "admin")} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input
                    id="admin-email"
                    name="email"
                    type="email"
                    placeholder="admin@pqrix.com"
                    required
                    className="bg-black/50 border-red-500/30 focus:border-red-500/50 focus:ring-red-500/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input
                    id="admin-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="bg-black/50 border-red-500/30 focus:border-red-500/50 focus:ring-red-500/30"
                  />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In as Admin"}
                </Button>
                <p className="text-xs text-center text-gray-500 mt-4">Demo: admin@pqrix.com / admin123</p>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
