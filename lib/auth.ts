"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type UserRole = "admin" | "client" | null

interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string, role: UserRole) => Promise<boolean>
  logout: () => void
  register: (email: string, password: string, name: string) => Promise<boolean>
}

// Mock users for demo - includes admin credentials
const mockUsers = [
  { id: "1", email: "admin@pqrix.com", password: "admin123", name: "Admin User", role: "admin" as UserRole },
  { id: "2", email: "abstalha@gmail.com", password: "123456", name: "Talha Admin", role: "admin" as UserRole },
  { id: "3", email: "client@example.com", password: "client123", name: "John Doe", role: "client" as UserRole },
]

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string, role: UserRole) => {
        console.log("Login attempt:", { email, password, role })
        // Mock authentication
        const user = mockUsers.find((u) => u.email === email && u.password === password && u.role === role)

        console.log("User found:", user)

        if (user) {
          const authUser = { id: user.id, email: user.email, name: user.name, role: user.role }
          set({
            user: authUser,
            isAuthenticated: true,
          })
          console.log("Auth state updated:", { user: authUser, isAuthenticated: true })
          return true
        }
        console.log("Login failed - no matching user")
        return false
      },
      logout: () => {
        console.log("Logging out")
        set({ user: null, isAuthenticated: false })
      },
      register: async (email: string, password: string, name: string) => {
        // Mock registration for clients
        const newUser = {
          id: Date.now().toString(),
          email,
          name,
          role: "client" as UserRole,
        }
        set({
          user: newUser,
          isAuthenticated: true,
        })
        return true
      },
    }),
    {
      name: "auth-storage",
      skipHydration: false,
    },
  ),
)
