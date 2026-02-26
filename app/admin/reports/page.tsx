"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Loader2, Users, Wheat, Tractor, Truck, ShoppingCart,
  TrendingUp, CheckCircle2, Clock, BarChart3, IndianRupee
} from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function AdminReportsPage() {
  const { data: statsData, isLoading: sLoad } = useSWR("/api/admin?resource=stats", fetcher)
  const { data: usersData, isLoading: uLoad } = useSWR("/api/admin?resource=users", fetcher)
  const { data: txData, isLoading: tLoad } = useSWR("/api/admin?resource=transactions", fetcher)

  const stats = statsData?.stats || {}
  const users = usersData?.users || []
  const transactions = txData?.transactions || []

  const isLoading = sLoad || uLoad || tLoad

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#16a34a]" />
      </div>
    )
  }

  const roleCounts = {
    farmer: users.filter((u: { role: string }) => u.role === "farmer").length,
    provider: users.filter((u: { role: string }) => u.role === "provider").length,
    buyer: users.filter((u: { role: string }) => u.role === "buyer").length,
    admin: users.filter((u: { role: string }) => u.role === "admin").length,
  }

  const verifiedCount = users.filter((u: { isVerified: boolean }) => u.isVerified).length
  const unverifiedCount = users.length - verifiedCount

  const confirmedTx = transactions.filter((t: { status: string }) => t.status === "confirmed")
  const pendingTx = transactions.filter((t: { status: string }) => t.status === "pending")
  const totalRevenue = confirmedTx.reduce((s: number, t: { amount: number }) => s + t.amount, 0)
  const avgTransaction = transactions.length > 0
    ? Math.round(transactions.reduce((s: number, t: { amount: number }) => s + t.amount, 0) / transactions.length)
    : 0

  const roleDistribution = [
    { label: "Farmers", count: roleCounts.farmer, icon: <Wheat className="w-4 h-4" />, color: "#16a34a", pct: users.length ? Math.round((roleCounts.farmer / users.length) * 100) : 0 },
    { label: "Providers", count: roleCounts.provider, icon: <Truck className="w-4 h-4" />, color: "#0ea5e9", pct: users.length ? Math.round((roleCounts.provider / users.length) * 100) : 0 },
    { label: "Buyers", count: roleCounts.buyer, icon: <ShoppingCart className="w-4 h-4" />, color: "#eab308", pct: users.length ? Math.round((roleCounts.buyer / users.length) * 100) : 0 },
    { label: "Admins", count: roleCounts.admin, icon: <Users className="w-4 h-4" />, color: "#8b5cf6", pct: users.length ? Math.round((roleCounts.admin / users.length) * 100) : 0 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Platform Reports</h1>
        <p className="text-muted-foreground">Comprehensive analytics and insights for the platform.</p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: users.length, icon: <Users className="w-5 h-5" />, color: "text-[#0ea5e9]", bg: "bg-[#0ea5e9]/10" },
          { label: "Total Revenue", value: `Rs.${totalRevenue.toLocaleString()}`, icon: <IndianRupee className="w-5 h-5" />, color: "text-[#16a34a]", bg: "bg-[#16a34a]/10" },
          { label: "Avg Transaction", value: `Rs.${avgTransaction.toLocaleString()}`, icon: <TrendingUp className="w-5 h-5" />, color: "text-[#eab308]", bg: "bg-[#eab308]/10" },
          { label: "Total Listings", value: (stats.crops || 0) + (stats.services || 0), icon: <BarChart3 className="w-5 h-5" />, color: "text-[#f97316]", bg: "bg-[#f97316]/10" },
        ].map((s) => (
          <Card key={s.label} className="card-hover border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center ${s.color}`}>{s.icon}</div>
              <div>
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* User Distribution */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Users className="w-4 h-4" /> User Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {roleDistribution.map((r) => (
              <div key={r.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2" style={{ color: r.color }}>
                    {r.icon}
                    <span className="font-medium text-foreground">{r.label}</span>
                  </div>
                  <span className="text-muted-foreground">{r.count} ({r.pct}%)</span>
                </div>
                <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${r.pct}%`, backgroundColor: r.color }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Verification Status */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Verification Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-8 py-4">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-[#16a34a]/10 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-8 h-8 text-[#16a34a]" />
                </div>
                <p className="text-2xl font-bold">{verifiedCount}</p>
                <p className="text-xs text-muted-foreground">Verified</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-[#eab308]/10 flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-8 h-8 text-[#eab308]" />
                </div>
                <p className="text-2xl font-bold">{unverifiedCount}</p>
                <p className="text-xs text-muted-foreground">Unverified</p>
              </div>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden mt-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#16a34a] to-[#0ea5e9] transition-all duration-700"
                style={{ width: `${users.length ? (verifiedCount / users.length) * 100 : 0}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              {users.length ? Math.round((verifiedCount / users.length) * 100) : 0}% verification rate
            </p>
          </CardContent>
        </Card>

        {/* Transaction Summary */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Transaction Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#16a34a]/5 text-center">
                <CheckCircle2 className="w-6 h-6 text-[#16a34a] mx-auto mb-1" />
                <p className="text-xl font-bold">{confirmedTx.length}</p>
                <p className="text-xs text-muted-foreground">Confirmed</p>
              </div>
              <div className="p-4 rounded-xl bg-[#eab308]/5 text-center">
                <Clock className="w-6 h-6 text-[#eab308] mx-auto mb-1" />
                <p className="text-xl font-bold">{pendingTx.length}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-[#16a34a]/10 to-[#0ea5e9]/10">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Success Rate</span>
                <span className="text-lg font-bold text-[#16a34a]">
                  {transactions.length ? Math.round((confirmedTx.length / transactions.length) * 100) : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Platform Activity */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Platform Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Crop Listings", value: stats.crops || 0, icon: <Wheat className="w-4 h-4" />, color: "#16a34a" },
              { label: "Harvest Requests", value: stats.harvests || 0, icon: <Tractor className="w-4 h-4" />, color: "#eab308" },
              { label: "Service Listings", value: stats.services || 0, icon: <Truck className="w-4 h-4" />, color: "#0ea5e9" },
              { label: "Transactions", value: stats.transactions || 0, icon: <ShoppingCart className="w-4 h-4" />, color: "#f97316" },
            ].map((item) => {
              const maxVal = Math.max(stats.crops || 0, stats.harvests || 0, stats.services || 0, stats.transactions || 0, 1)
              return (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2" style={{ color: item.color }}>
                      {item.icon}
                      <span className="font-medium text-foreground">{item.label}</span>
                    </div>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${(item.value / maxVal) * 100}%`, backgroundColor: item.color }}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
