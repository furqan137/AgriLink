"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Sprout, Tractor, ShoppingCart, Shield, ArrowRight,
  Wheat, Users, TrendingUp, Zap, Globe, Lock
} from "lucide-react"

const features = [
  {
    icon: <Wheat className="w-7 h-7" />,
    title: "Crop Marketplace",
    desc: "List and sell crops directly to verified buyers with transparent pricing and offers.",
  },
  {
    icon: <Tractor className="w-7 h-7" />,
    title: "Harvest Services",
    desc: "Hire vehicles and manpower for harvesting. Providers can accept and fulfill jobs.",
  },
  {
    icon: <ShoppingCart className="w-7 h-7" />,
    title: "Smart Buying",
    desc: "Browse available crops, send price offers, and track purchases seamlessly.",
  },
  {
    icon: <Shield className="w-7 h-7" />,
    title: "Secure Transactions",
    desc: "Verified payments with receipt uploads and full transaction transparency.",
  },
  {
    icon: <Users className="w-7 h-7" />,
    title: "Multi-Role Access",
    desc: "Dedicated dashboards for Farmers, Service Providers, Buyers, and Admins.",
  },
  {
    icon: <TrendingUp className="w-7 h-7" />,
    title: "Analytics & Insights",
    desc: "Admin dashboard with platform-wide analytics, user management, and reports.",
  },
]

const stats = [
  { value: "4", label: "User Roles" },
  { value: "6+", label: "Core Features" },
  { value: "100%", label: "Transparent" },
  { value: "24/7", label: "Available" },
]

const roles = [
  {
    icon: <Wheat className="w-8 h-8 text-[#16a34a]" />,
    title: "Farmer",
    desc: "Post harvest needs, sell crops, manage offers, and track transactions.",
    gradient: "from-[#16a34a]/10 to-[#0ea5e9]/10",
  },
  {
    icon: <Tractor className="w-8 h-8 text-[#0ea5e9]" />,
    title: "Service Provider",
    desc: "Offer vehicles & manpower, accept harvest jobs, and manage earnings.",
    gradient: "from-[#0ea5e9]/10 to-[#16a34a]/10",
  },
  {
    icon: <ShoppingCart className="w-8 h-8 text-[#eab308]" />,
    title: "Buyer",
    desc: "Browse crops, send price offers, confirm purchases, and upload receipts.",
    gradient: "from-[#eab308]/10 to-[#f97316]/10",
  },
  {
    icon: <Shield className="w-8 h-8 text-[#f97316]" />,
    title: "Admin",
    desc: "Manage all users, verify providers, monitor transactions, and view analytics.",
    gradient: "from-[#f97316]/10 to-[#eab308]/10",
  },
]

export function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative hero-gradient overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-[#16a34a]/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#0ea5e9]/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-32">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="animate-fade-in-up stagger-1 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#16a34a]/10 border border-[#16a34a]/20 mb-6">
              <Zap className="w-4 h-4 text-[#16a34a]" />
              <span className="text-sm font-medium text-[#16a34a]">Digital Agriculture Platform</span>
            </div>

            <h1 className="animate-fade-in-up stagger-2 text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight text-balance">
              <span className="text-foreground">Connecting </span>
              <span className="gradient-text">Agriculture</span>
              <br />
              <span className="text-foreground">With Technology</span>
            </h1>

            <p className="animate-fade-in-up stagger-3 mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl text-pretty leading-relaxed">
              AgriLink brings farmers, service providers, and buyers together in one powerful
              digital ecosystem. Streamline operations, maximize profits, and grow smarter.
            </p>

            <div className="animate-fade-in-up stagger-4 flex flex-col sm:flex-row gap-4 mt-10">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-[#16a34a] to-[#15803d] text-[#ffffff] hover:opacity-90 transition-all text-base px-8 py-6 shadow-lg shadow-[#16a34a]/25 animate-pulse-glow">
                  Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="text-base px-8 py-6 border-[#16a34a]/30 text-[#16a34a] hover:bg-[#16a34a]/5">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="animate-fade-in-up stagger-5 mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-28 bg-card">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#16a34a]/10 border border-[#16a34a]/20 mb-4">
              <Globe className="w-4 h-4 text-[#16a34a]" />
              <span className="text-sm font-medium text-[#16a34a]">Platform Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-balance">
              Everything You Need to <span className="gradient-text">Grow</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
              A complete suite of tools designed for every stakeholder in the agricultural supply chain.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card key={i} className="card-hover border-border/50 bg-card overflow-hidden group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#16a34a]/10 to-[#0ea5e9]/10 flex items-center justify-center text-[#16a34a] mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-20 md:py-28 hero-gradient">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#16a34a]/10 border border-[#16a34a]/20 mb-4">
              <Users className="w-4 h-4 text-[#16a34a]" />
              <span className="text-sm font-medium text-[#16a34a]">User Roles</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-balance">
              Built for <span className="gradient-text">Everyone</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role, i) => (
              <Card key={i} className="card-hover border-border/50 overflow-hidden">
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${role.gradient} flex items-center justify-center mb-4`}>
                    {role.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{role.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{role.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="relative rounded-3xl overflow-hidden p-10 md:p-16 bg-gradient-to-br from-[#16a34a] to-[#0f766e]">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#ffffff]/10 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#ffffff]/10 blur-3xl" />
            </div>
            <div className="relative">
              <Lock className="w-10 h-10 text-[#ffffff]/80 mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-[#ffffff] mb-4 text-balance">
                Ready to Transform Your Farm?
              </h2>
              <p className="text-[#ffffff]/80 max-w-xl mx-auto mb-8 text-pretty leading-relaxed">
                Join AgriLink today and experience the future of digital agriculture.
                Secure, transparent, and built for you.
              </p>
              <Link href="/register">
                <Button size="lg" className="bg-[#ffffff] text-[#16a34a] hover:bg-[#ffffff]/90 text-base px-8 py-6">
                  Create Free Account <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sprout className="w-5 h-5 text-[#16a34a]" />
              <span className="font-bold gradient-text">AgriLink</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with technology-driven efficiency for modern agriculture.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
