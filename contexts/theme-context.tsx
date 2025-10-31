"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Initialize with a safe default for SSR
    if (typeof window === "undefined") return "dark"
    
    // Try to get saved theme or system preference
    try {
      const savedTheme = localStorage.getItem("theme") as Theme | null
      if (savedTheme) return savedTheme
      
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      return prefersDark ? "dark" : "light"
    } catch {
      return "dark"
    }
  })

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    try {
      // Update document class and save preference
      document.documentElement.classList.remove("light", "dark")
      document.documentElement.classList.add(theme)
      localStorage.setItem("theme", theme)
    } catch (error) {
      console.error("Failed to save theme:", error)
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
