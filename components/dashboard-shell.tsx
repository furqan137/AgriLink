"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sprout, LogOut, Menu, X,
  Home, Wheat, Tractor, ShoppingCart, Users,
  ClipboardList, Package, TrendingUp, Settings,
  Truck, UserCheck, BarChart3, Receipt,
  Store, Tag, FileText
} from "lucide-react"
import { useState, type ReactNode } from "react"

interface NavItem {
  label: string
  href: string
  icon: ReactNode
}

const navItems: Record<string, NavItem[]> = {
  farmer: [
    { label: "Dashboard", href: "/farmer", icon: <Home className="w-4 h-4" /> },
    { label: "Post Harvest", href: "/farmer/harvest/new", icon: <Tractor className="w-4 h-4" /> },
    { label: "My Harvests", href: "/farmer/harvest", icon: <ClipboardList className="w-4 h-4" /> },
    { label: "Post Crop", href: "/farmer/crops/new", icon: <Wheat className="w-4 h-4" /> },
    { label: "My Crops", href: "/farmer/crops", icon: <Package className="w-4 h-4" /> },
    { label: "Transactions", href: "/farmer/transactions", icon: <Receipt className="w-4 h-4" /> },
  ],
  provider: [
    { label: "Dashboard", href: "/provider", icon: <Home className="w-4 h-4" /> },
    { label: "Post Service", href: "/provider/services/new", icon: <Truck className="w-4 h-4" /> },
    { label: "My Services", href: "/provider/services", icon: <Settings className="w-4 h-4" /> },
    { label: "Available Jobs", href: "/provider/jobs", icon: <ClipboardList className="w-4 h-4" /> },
    { label: "My Jobs", href: "/provider/accepted", icon: <UserCheck className="w-4 h-4" /> },
  ],
  buyer: [
    { label: "Dashboard", href: "/buyer", icon: <Home className="w-4 h-4" /> },
    { label: "Browse Crops", href: "/buyer/browse", icon: <Store className="w-4 h-4" /> },
    { label: "My Offers", href: "/buyer/offers", icon: <Tag className="w-4 h-4" /> },
    { label: "Purchases", href: "/buyer/purchases", icon: <ShoppingCart className="w-4 h-4" /> },
  ],
  admin: [
    { label: "Dashboard", href: "/admin", icon: <BarChart3 className="w-4 h-4" /> },
    { label: "Users", href: "/admin/users", icon: <Users className="w-4 h-4" /> },
    { label: "Transactions", href: "/admin/transactions", icon: <TrendingUp className="w-4 h-4" /> },
    { label: "Reports", href: "/admin/reports", icon: <FileText className="w-4 h-4" /> },
  ],
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!user) return null

  const items = navItems[user.role] || []

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r border-border bg-sidebar transition-transform duration-300 md:relative md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-sidebar-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-[#16a34a] to-[#0ea5e9]">
              <Sprout className="w-5 h-5 text-[#ffffff]" />
            </div>
            <span className="text-lg font-bold gradient-text">AgriLink</span>
          </Link>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-3 py-2">
          <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {user.role === "admin" ? "Administration" : `${user.role} Panel`}
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#16a34a] to-[#0ea5e9] flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-[#ffffff]">{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-destructive" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-[#000000]/30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center gap-4 px-4 py-3 border-b border-border bg-card md:px-6">
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h2 className="text-lg font-semibold capitalize">{user.role} Dashboard</h2>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <span>{user.location}</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}
