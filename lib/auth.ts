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

// Mock users for demo
const mockUsers = [
  { id: "1", email: "admin@skitbit.com", password: "admin123", name: "Admin User", role: "admin" as UserRole },
  { id: "2", email: "client@example.com", password: "client123", name: "John Doe", role: "client" as UserRole },
]

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string, role: UserRole) => {
        // Mock authentication
        const user = mockUsers.find((u) => u.email === email && u.password === password && u.role === role)

        if (user) {
          set({
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
            isAuthenticated: true,
          })
          return true
        }
        return false
      },
      logout: () => {
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
    },
  ),
)
