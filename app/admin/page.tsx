"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Users, Wheat, Tractor, ShoppingCart, TrendingUp,
  BarChart3, ArrowRight, Loader2, IndianRupee, Truck
} from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function AdminDashboard() {
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

  const statCards = [
    { label: "Total Users", value: stats.users || 0, icon: <Users className="w-5 h-5" />, color: "text-[#0ea5e9]", bg: "bg-[#0ea5e9]/10" },
    { label: "Crop Listings", value: stats.crops || 0, icon: <Wheat className="w-5 h-5" />, color: "text-[#16a34a]", bg: "bg-[#16a34a]/10" },
    { label: "Harvest Requests", value: stats.harvests || 0, icon: <Tractor className="w-5 h-5" />, color: "text-[#eab308]", bg: "bg-[#eab308]/10" },
    { label: "Services", value: stats.services || 0, icon: <Truck className="w-5 h-5" />, color: "text-[#f97316]", bg: "bg-[#f97316]/10" },
    { label: "Transactions", value: stats.transactions || 0, icon: <ShoppingCart className="w-5 h-5" />, color: "text-[#8b5cf6]", bg: "bg-[#8b5cf6]/10" },
    { label: "Revenue", value: `Rs.${(stats.totalRevenue || 0).toLocaleString()}`, icon: <IndianRupee className="w-5 h-5" />, color: "text-[#16a34a]", bg: "bg-[#16a34a]/10" },
  ]

  const roleCounts = {
    farmer: users.filter((u: { role: string }) => u.role === "farmer").length,
    provider: users.filter((u: { role: string }) => u.role === "provider").length,
    buyer: users.filter((u: { role: string }) => u.role === "buyer").length,
    admin: users.filter((u: { role: string }) => u.role === "admin").length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and analytics.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((s) => (
          <Card key={s.label} className="card-hover border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center ${s.color}`}>{s.icon}</div>
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User distribution */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> User Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { role: "Farmers", count: roleCounts.farmer, color: "bg-[#16a34a]" },
              { role: "Providers", count: roleCounts.provider, color: "bg-[#0ea5e9]" },
              { role: "Buyers", count: roleCounts.buyer, color: "bg-[#eab308]" },
              { role: "Admins", count: roleCounts.admin, color: "bg-[#8b5cf6]" },
            ].map((r) => (
              <div key={r.role} className="text-center p-4 rounded-xl bg-muted/50">
                <div className={`w-3 h-3 rounded-full ${r.color} mx-auto mb-2`} />
                <p className="text-2xl font-bold">{r.count}</p>
                <p className="text-xs text-muted-foreground">{r.role}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Recent Users</CardTitle>
            <Link href="/admin/users" className="text-sm text-[#16a34a] hover:underline flex items-center gap-1">
              Manage <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No users yet.</p>
            ) : (
              <div className="space-y-3">
                {users.slice(0, 6).map((u: { _id: string; name: string; email: string; role: string; isVerified: boolean; createdAt: string }) => (
                  <div key={u._id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#16a34a] to-[#0ea5e9] flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-[#ffffff]">{u.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize text-xs">{u.role}</Badge>
                      {u.isVerified ? (
                        <Badge className="bg-[#16a34a]/10 text-[#16a34a] border-[#16a34a]/20 text-xs">Verified</Badge>
                      ) : (
                        <Badge className="bg-[#eab308]/10 text-[#eab308] border-[#eab308]/20 text-xs">Pending</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
            <Link href="/admin/transactions" className="text-sm text-[#16a34a] hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No transactions yet.</p>
            ) : (
              <div className="space-y-3">
                {transactions.slice(0, 6).map((t: { _id: string; amount: number; status: string; buyer?: { name: string }; farmer?: { name: string }; crop?: { cropName: string }; createdAt: string }) => (
                  <div key={t._id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{t.crop?.cropName || "Transaction"}</p>
                      <p className="text-xs text-muted-foreground">{t.buyer?.name} &#8594; {t.farmer?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">Rs.{t.amount.toLocaleString()}</p>
                      <Badge className={t.status === "confirmed"
                        ? "bg-[#16a34a]/10 text-[#16a34a] border-[#16a34a]/20 text-xs"
                        : "bg-[#eab308]/10 text-[#eab308] border-[#eab308]/20 text-xs"
                      }>
                        {t.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
