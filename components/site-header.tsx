"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useEffect, useState } from "react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, Briefcase, Wrench, FolderOpen, Users, LogOut, LayoutDashboard, Lightbulb, Sparkles } from "lucide-react"
import { useClientAuth } from "@/lib/client-auth"
import { useRouter } from "next/navigation"

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const { client, logout } = useClientAuth()
  const router = useRouter()
  const isAuthenticated = !!client
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  const handleLogout = () => {
    logout()
    router.push('/')
  }
  
  const links = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/projects", label: "Projects" },
    { href: "/team", label: "Team" },
    { href: "/careers", label: "Careers" },
    { href: "/insights", label: "Insights" },
  ]

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-4 pb-4 transition-all duration-700">
      <div className="container mx-auto max-w-7xl">
        {/* Mobile/Tablet: Simple Header with Icon Logo + Menu (below 1100px) */}
        <div className="xl:hidden px-4 flex items-center justify-between min-h-[60px]">
          {/* Icon Logo Only */}
          <Link href="/">
          <div className="flex items-center gap-2 px-6 border-b border-red-500/20">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center shadow-lg shadow-red-500/30 border border-red-400/20">
                  <Sparkles size={20} className="text-white" />
                </div>
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-red-100 to-red-500 bg-clip-text text-transparent">
                  PQRIX
                </span>
              </div>
          </Link>
          
          
          {/* Menu Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-red-500/30 bg-black/50 text-white hover:bg-black/70 hover:border-red-500/50 rounded-full transition-all duration-300 shadow-lg shadow-red-500/10"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="border-red-500/20 p-0 w-80 flex flex-col bg-gradient-to-b from-[#050000] via-[#0a0000] to-black backdrop-blur-xl"
            >
              {/* Brand Header */}
              <div className="flex items-center gap-2 px-6 py-6 border-b border-red-500/20">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center shadow-lg shadow-red-500/30 border border-red-400/20">
                  <Sparkles size={20} className="text-white" />
                </div>
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-red-100 to-red-500 bg-clip-text text-transparent">
                  PQRIX
                </span>
              </div>

              {/* Nav Links */}
              <nav className="flex flex-col gap-1 mt-4 px-3 text-gray-300">
                {links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-red-500/10 hover:text-white transition-all duration-300 group"
                  >
                    <span className="text-sm font-semibold">{l.label}</span>
                    <div className="ml-auto w-0 h-0.5 bg-red-500 group-hover:w-6 transition-all duration-300 shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
                  </a>
                ))}
              </nav>

              {/* CTA at Bottom */}
              <div className="mt-auto border-t border-red-500/20 p-6">
                {isAuthenticated && client ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5">
                      <Avatar className="h-12 w-12 border-2 border-red-500 shadow-lg shadow-red-500/20">
                        <AvatarImage src={client.image} alt={client.name} />
                        <AvatarFallback className="bg-gradient-to-br from-red-600 to-red-900 text-white font-bold">
                          {getInitials(client.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{client.name}</p>
                        <p className="text-xs text-white/60 truncate">{client.email}</p>
                      </div>
                    </div>
                    <Link href="/client/dashboard">
                      <Button
                        className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold rounded-full py-6 transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/30 border border-red-400/20"
                      >
                        Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="w-full border-red-400/50 text-red-400 hover:bg-red-400/10 rounded-full py-6 transition-all duration-300"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Link href="/client/register">
                  <Button
                    className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold rounded-full py-6 shadow-[0_8px_24px_rgba(220,38,38,0.4)] hover:shadow-[0_12px_32px_rgba(220,38,38,0.6)] transition-all duration-500 hover:scale-105 border border-red-400/20"
                  >
                    Get Started
                  </Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop/Laptop: Full Header with Animations (1100px and above) */}
        <div className="hidden xl:block relative min-h-[60px]">
          {/* Background Pill - Morphs smoothly with responsive positioning */}
          <div 
            className="absolute inset-0 rounded-full transition-all duration-700 ease-out"
            style={{
              background: scrolled 
                ? 'rgba(0, 0, 0, 0.7)' 
                : 'rgba(5, 0, 0, 0.4)',
              backdropFilter: scrolled ? 'blur(32px) saturate(180%)' : 'blur(20px) saturate(150%)',
              WebkitBackdropFilter: scrolled ? 'blur(32px) saturate(180%)' : 'blur(20px) saturate(150%)',
              border: scrolled 
                ? '1px solid rgba(220, 38, 38, 0.3)' 
                : '1px solid rgba(220, 38, 38, 0.15)',
              boxShadow: scrolled 
                ? '0 8px 32px rgba(220, 38, 38, 0.2)' 
                : '0 4px 16px rgba(220, 38, 38, 0.08)',
              left: scrolled ? 'clamp(10%, 16%, 18%)' : 'clamp(12%, 20%, 22%)',
              right: scrolled ? 'clamp(8%, 12%, 14%)' : 'clamp(12%, 20%, 22%)',
            }}
          />

          {/* Logo - Slides from outside left to inside with responsive scaling */}
          <div 
            className="absolute z-10 flex items-center gap-1 transition-all duration-700 ease-out"
            style={{
              transform: scrolled 
                ? 'translateX(clamp(120%, 180%, 200%)) scale(1)' 
                : 'translateX(-40%) scale(1.3)',
              paddingLeft: scrolled ? '1rem' : '0',
              top: '50%',
              marginTop: '-15px',
              left: '1rem',
            }}
          >

            <Link href="/"  className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center shadow-lg shadow-red-500/30 border border-red-400/20">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-red-100 to-red-500 bg-clip-text text-transparent whitespace-nowrap">
              PQRIX
            </span>
            </Link>
           
          </div>

          {/* Desktop Nav - Always visible with enhanced styling and responsive gap */}
          <nav 
            className="absolute inset-y-0 left-1/2 flex items-center xl:gap-6 2xl:gap-8 text-sm font-semibold transition-all duration-700 ease-out"
            style={{
              opacity: scrolled ? 1 : 0.85,
              transform: scrolled 
                ? 'translateX(-50%) scale(1.0)' 
                : 'translateX(-50%) scale(1.0)',
            }}
          >
            {links.map((l) => (
              <a 
                key={l.href} 
                href={l.href} 
                className="relative text-gray-300 hover:text-white transition-all duration-300 group"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 to-red-500 group-hover:w-full transition-all duration-300 shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
              </a>
            ))}
          </nav>
{/* with responsive sizing  */}
          <div 
            className="absolute z-10 flex items-center gap-3 transition-all duration-700 ease-out"
            style={{
              transform: scrolled 
                ? isAuthenticated 
                  ? 'translateX(clamp(-250%, -250%, -170%)) scale(1)' 
                  : 'translateX(clamp(-80%, -100%, -110%)) scale(1)'
                : 'translateX(40%) scale(1.05)',
              paddingRight: scrolled ? '1.2rem' : '0',
              top: '50%',
              marginTop: '-20px',
              right: '1rem',
            }}
          >
            {isAuthenticated && client ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:scale-105 transition-all duration-500 shadow-[0_4px_16px_rgba(220,38,38,0.3)] hover:shadow-[0_8px_24px_rgba(220,38,38,0.5)]">
                    <Avatar className="h-10 w-10 border-2 border-red-500 shadow-lg shadow-red-500/20">
                      <AvatarImage src={client.image} alt={client.name} />
                      <AvatarFallback className="bg-gradient-to-br from-red-600 to-red-900 text-white font-bold">
                        {getInitials(client.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-56 bg-black/95 backdrop-blur-xl border-red-500/20 shadow-xl"
                >
                  <DropdownMenuLabel className="text-white">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{client.name}</p>
                      <p className="text-xs text-gray-400">{client.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-red-500/20" />
                  <DropdownMenuItem 
                    className="text-white hover:bg-red-500/10 cursor-pointer focus:bg-red-500/10"
                    onClick={() => router.push('/client/dashboard')}
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-red-500/20" />
                  <DropdownMenuItem 
                    className="text-red-400 hover:bg-red-500/10 cursor-pointer focus:bg-red-500/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/client/register"> 
              <Button
                className="relative overflow-hidden bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold px-8 py-5 rounded-full text-sm shadow-[0_8px_24px_rgba(220,38,38,0.4)] hover:shadow-[0_12px_32px_rgba(220,38,38,0.6)] transition-all duration-500 hover:scale-105 border border-red-400/20"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}