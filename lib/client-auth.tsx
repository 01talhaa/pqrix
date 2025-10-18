"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { ClientDocument } from "@/lib/models/Client"

interface ClientAuthContextType {
  client: Omit<ClientDocument, "password" | "refreshToken"> | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refreshAuth: () => Promise<void>
  updateClient: (data: Partial<ClientDocument>) => void
}

interface RegisterData {
  email: string
  password: string
  name: string
  phone?: string
  company?: string
}

const ClientAuthContext = createContext<ClientAuthContextType | undefined>(undefined)

export function ClientAuthProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<Omit<ClientDocument, "password" | "refreshToken"> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  // Auto-refresh token
  useEffect(() => {
    const interval = setInterval(() => {
      if (accessToken) {
        refreshAccessToken()
      }
    }, 10 * 60 * 1000) // Refresh every 10 minutes

    return () => clearInterval(interval)
  }, [accessToken])

  // Initial auth check
  useEffect(() => {
    refreshAuth()
  }, [])

  const refreshAccessToken = async () => {
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setAccessToken(data.data.accessToken)
          await fetchClientData(data.data.accessToken)
        }
      }
    } catch (error) {
      console.error("Failed to refresh token:", error)
    }
  }

  const fetchClientData = async (token: string) => {
    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setClient(data.data)
        }
      }
    } catch (error) {
      console.error("Failed to fetch client data:", error)
    }
  }

  const refreshAuth = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/refresh", {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setAccessToken(data.data.accessToken)
          await fetchClientData(data.data.accessToken)
        }
      }
    } catch (error) {
      console.error("Auth refresh failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        setAccessToken(data.data.accessToken)
        setClient(data.data.client)
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: "Login failed. Please try again." }
    }
  }

  const register = async (registerData: RegisterData) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      })

      const data = await response.json()

      if (data.success) {
        setAccessToken(data.data.accessToken)
        setClient(data.data.client)
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      return { success: false, error: "Registration failed. Please try again." }
    }
  }

  const logout = async () => {
    try {
      if (accessToken) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setClient(null)
      setAccessToken(null)
    }
  }

  const updateClient = (data: Partial<ClientDocument>) => {
    if (client) {
      setClient({ ...client, ...data })
    }
  }

  return (
    <ClientAuthContext.Provider
      value={{
        client,
        isAuthenticated: !!client,
        isLoading,
        login,
        register,
        logout,
        refreshAuth,
        updateClient,
      }}
    >
      {children}
    </ClientAuthContext.Provider>
  )
}

export function useClientAuth() {
  const context = useContext(ClientAuthContext)
  if (context === undefined) {
    throw new Error("useClientAuth must be used within a ClientAuthProvider")
  }
  return context
}
