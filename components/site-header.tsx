"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { Menu, Briefcase, Tag, HelpCircle, Wrench, FolderOpen, Users, LogOut, LayoutDashboard, Lightbulb } from "lucide-react"
import { useClientAuth } from "@/lib/client-auth"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  const { client, isAuthenticated, logout } = useClientAuth()
  
  const links = [
    { href: "/", label: "Home", icon: LayoutDashboard },
    { href: "/services", label: "Services", icon: Wrench },
    { href: "/projects", label: "Projects", icon: FolderOpen },
    { href: "/team", label: "Team", icon: Users },
    { href: "/careers", label: "Careers", icon: Briefcase },
    { href: "/insights", label: "Insights", icon: Lightbulb },
    // { href: "/faq", label: "FAQ", icon: HelpCircle },
  ]

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleLogout = async () => {
    await logout()
    window.location.href = "/"
  }

  return (
    <header className="sticky top-0 z-50 p-4 transition-all duration-300">
      <div className="container mx-auto max-w-4xl">
        <div className="flex h-14 items-center justify-between px-6 rounded-full thick-glass-header" style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)',
          backdropFilter: 'blur(32px) saturate(180%)',
          WebkitBackdropFilter: 'blur(32px) saturate(180%)',
          border: '2px solid rgba(255,255,255,0.5)',
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.12), inset 0 1px 2px 0 rgba(255,255,255,0.7)'
        }}>
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2">
            {/* <Image src="/images/pqrix-logo.png" alt="Pqrix logo" width={28} height={28} className="h-7 w-7" /> */}
            <span className="text-base font-bold tracking-wide text-green-600 dark:text-lime-300">PQRIX</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 text-sm text-gray-700 dark:text-gray-300 md:flex">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-green-600 dark:hover:text-lime-300 transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA / Avatar */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {isAuthenticated && client ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                    <Avatar className="h-10 w-10 border-2 border-lime-400">
                      <AvatarImage src={client.image} alt={client.name} />
                      <AvatarFallback className="bg-lime-400 text-black font-semibold">
                        {getInitials(client.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-black/95 border-white/10">
                  <DropdownMenuLabel className="text-white">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{client.name}</p>
                      <p className="text-xs text-white/60">{client.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem asChild className="text-white hover:bg-white/10 cursor-pointer">
                    <Link href="/client/dashboard" className="flex items-center">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-red-400 hover:bg-white/10 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                asChild
                className="bg-green-500 dark:bg-lime-400 text-white dark:text-black font-medium rounded-lg px-6 py-2.5
                           hover:bg-green-600 dark:hover:bg-lime-300 hover:shadow-md hover:scale-[1.02]
                           transition-all"
              >
                <Link href="/client/login">Login / Sign Up</Link>
              </Button>
            )}
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="liquid-glass border-gray-200 dark:border-gray-800 p-0 w-64 flex flex-col">
                {/* Brand Header */}
                <div className="flex items-center gap-1.5 px-4 py-4 border-b border-gray-200 dark:border-gray-800">
                  <Image src="/icons/pqrix-icon.svg" alt="Pqrix logo" width={32} height={32} className="h-8 w-8" />
                  <span className="text-lg font-bold tracking-wide text-green-600 dark:text-lime-300">PQRIX</span>
                  <span className="font-semibold tracking-wide text-black dark:text-white text-lg">Pqrix</span>
                </div>

                {/* Nav Links */}
                <nav className="flex flex-col gap-1 mt-2 text-gray-800 dark:text-gray-200">
                  {links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-green-600 dark:hover:text-lime-300 transition-colors"
                    >
                      <span className="inline-flex items-center justify-center w-5 h-5 text-gray-600 dark:text-gray-400">
                        <l.icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm">{l.label}</span>
                    </Link>
                  ))}
                </nav>

                {/* CTA Button / Client Info at Bottom */}
                <div className="mt-auto border-t border-gray-200 dark:border-gray-800 p-4">
                  {isAuthenticated && client ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 px-2">
                        <Avatar className="h-10 w-10 border-2 border-green-500 dark:border-lime-400">
                          <AvatarImage src={client.image} alt={client.name} />
                          <AvatarFallback className="bg-green-500 dark:bg-lime-400 text-white dark:text-black font-semibold">
                            {getInitials(client.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-black dark:text-white truncate">{client.name}</p>
                          <p className="text-xs text-gray-600 dark:text-white/60 truncate">{client.email}</p>
                        </div>
                      </div>
                      <Button
                        asChild
                        className="w-full bg-green-500 dark:bg-lime-400 text-white dark:text-black font-medium rounded-lg
                                   hover:bg-green-600 dark:hover:bg-lime-300 transition-all"
                      >
                        <Link href="/client/dashboard">Dashboard</Link>
                      </Button>
                      <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="w-full border-red-400/50 text-red-400 hover:bg-red-400/10"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <Button
                      asChild
                      className="w-full bg-green-500 dark:bg-lime-400 text-white dark:text-black font-medium rounded-lg px-6 py-2.5
                                 hover:bg-green-600 dark:hover:bg-lime-300 hover:shadow-md hover:scale-[1.02]
                                 transition-all"
                    >
                      <Link href="/client/login">Login / Sign Up</Link>
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
