"use client"

import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sprout, Menu, X, User, LogOut, LayoutDashboard } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const dashboardPath = user
    ? user.role === "admin"
      ? "/admin"
      : `/${user.role}`
    : "/login"

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-border/50">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#16a34a] to-[#0ea5e9]">
            <Sprout className="w-6 h-6 text-[#ffffff]" />
          </div>
          <span className="text-xl font-bold gradient-text font-sans">AgriLink</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
            About
          </Link>
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#16a34a] to-[#0ea5e9] flex items-center justify-center">
                    <span className="text-sm font-bold text-[#ffffff]">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium">{user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href={dashboardPath} className="flex items-center gap-2 cursor-pointer">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="flex items-center gap-2 cursor-pointer text-destructive">
                  <LogOut className="w-4 h-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="text-sm">Login</Button>
              </Link>
              <Link href="/register">
                <Button className="text-sm bg-gradient-to-r from-[#16a34a] to-[#15803d] text-[#ffffff] hover:opacity-90 transition-opacity">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 glass-card animate-fade-in-up">
          <Link href="/" className="py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link href="/about" className="py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>About</Link>
          {isAuthenticated ? (
            <>
              <Link href={dashboardPath} className="py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              <button onClick={() => { logout(); setMobileOpen(false) }} className="py-2 text-sm font-medium text-destructive text-left">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link href="/register" className="py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
