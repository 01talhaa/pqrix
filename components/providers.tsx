"use client"

import * as React from "react"
import { ThemeProvider } from "@/contexts/theme-context"
import { ClientAuthProvider } from "@/lib/client-auth"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ClientAuthProvider>
        {children}
      </ClientAuthProvider>
    </ThemeProvider>
  )
}
