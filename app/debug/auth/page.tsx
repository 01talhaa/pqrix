"use client"

import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function AuthDebugPage() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Auth State Debug</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong>Is Authenticated:</strong>{" "}
            <span className={isAuthenticated ? "text-green-500" : "text-red-500"}>
              {isAuthenticated ? "Yes" : "No"}
            </span>
          </div>
          <div>
            <strong>User:</strong>
            <pre className="mt-2 p-4 bg-muted rounded-lg overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
          <div>
            <strong>Local Storage:</strong>
            <pre className="mt-2 p-4 bg-muted rounded-lg overflow-auto text-xs">
              {typeof window !== "undefined"
                ? localStorage.getItem("auth-storage")
                : "Server side"}
            </pre>
          </div>
          <div>
            <strong>Cookies:</strong>
            <pre className="mt-2 p-4 bg-muted rounded-lg overflow-auto text-xs">
              {typeof window !== "undefined" ? document.cookie : "Server side"}
            </pre>
          </div>
          <div className="flex gap-4">
            <Button onClick={() => router.push("/admin")}>Go to Admin</Button>
            <Button onClick={() => router.push("/admin/login")} variant="outline">
              Go to Login
            </Button>
            <Button
              onClick={() => {
                logout()
                router.push("/admin/login")
              }}
              variant="destructive"
            >
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
