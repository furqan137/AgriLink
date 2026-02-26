"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Wheat, Tractor, Receipt, TrendingUp, Plus, ArrowRight, Loader2 } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function FarmerDashboard() {
  const { data: harvestData, isLoading: hLoad } = useSWR("/api/harvest?my=true", fetcher)
  const { data: cropData, isLoading: cLoad } = useSWR("/api/crops?my=true", fetcher)
  const { data: txData, isLoading: tLoad } = useSWR("/api/transactions", fetcher)

  const harvests = harvestData?.requests || []
  const crops = cropData?.crops || []
  const transactions = txData?.transactions || []

  const openHarvests = harvests.filter((h: { status: string }) => h.status === "open").length
  const availableCrops = crops.filter((c: { status: string }) => c.status === "available").length
  const pendingOffers = crops.reduce((acc: number, c: { offers: Array<{ status: string }> }) => 
    acc + c.offers.filter((o) => o.status === "pending").length, 0)

  const isLoading = hLoad || cLoad || tLoad

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#16a34a]" />
      </div>
    )
  }

  const stats = [
    { label: "Open Harvests", value: openHarvests, icon: <Tractor className="w-5 h-5" />, color: "text-[#0ea5e9]", bg: "bg-[#0ea5e9]/10" },
    { label: "Active Crops", value: availableCrops, icon: <Wheat className="w-5 h-5" />, color: "text-[#16a34a]", bg: "bg-[#16a34a]/10" },
    { label: "Pending Offers", value: pendingOffers, icon: <TrendingUp className="w-5 h-5" />, color: "text-[#eab308]", bg: "bg-[#eab308]/10" },
    { label: "Transactions", value: transactions.length, icon: <Receipt className="w-5 h-5" />, color: "text-[#f97316]", bg: "bg-[#f97316]/10" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Farmer Dashboard</h1>
          <p className="text-muted-foreground">Manage your harvests, crops, and transactions.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/farmer/harvest/new">
            <Button size="sm" className="bg-gradient-to-r from-[#16a34a] to-[#15803d] text-[#ffffff]">
              <Plus className="w-4 h-4 mr-1" /> Post Harvest
            </Button>
          </Link>
          <Link href="/farmer/crops/new">
            <Button size="sm" variant="outline" className="border-[#16a34a]/30 text-[#16a34a]">
              <Plus className="w-4 h-4 mr-1" /> Post Crop
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="card-hover border-border/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center ${s.color}`}>
                {s.icon}
              </div>
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Harvest Requests */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Recent Harvests</CardTitle>
            <Link href="/farmer/harvest" className="text-sm text-[#16a34a] hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {harvests.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No harvest requests yet.</p>
            ) : (
              <div className="space-y-3">
                {harvests.slice(0, 4).map((h: { _id: string; cropType: string; vehicleType: string; status: string; location: string }) => (
                  <div key={h._id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{h.cropType}</p>
                      <p className="text-xs text-muted-foreground">{h.vehicleType} - {h.location}</p>
                    </div>
                    <Badge variant={h.status === "open" ? "default" : h.status === "accepted" ? "secondary" : "outline"}
                      className={h.status === "open" ? "bg-[#16a34a]/10 text-[#16a34a] border-[#16a34a]/20" : ""}>
                      {h.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Crops */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Recent Crops</CardTitle>
            <Link href="/farmer/crops" className="text-sm text-[#16a34a] hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {crops.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No crops listed yet.</p>
            ) : (
              <div className="space-y-3">
                {crops.slice(0, 4).map((c: { _id: string; cropName: string; pricePerUnit: number; quantity: number; status: string; offers: Array<{ status: string }> }) => (
                  <div key={c._id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{c.cropName}</p>
                      <p className="text-xs text-muted-foreground">Rs.{c.pricePerUnit}/unit - Qty: {c.quantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {c.offers.filter((o) => o.status === "pending").length > 0 && (
                        <Badge className="bg-[#eab308]/10 text-[#eab308] border-[#eab308]/20">
                          {c.offers.filter((o) => o.status === "pending").length} offers
                        </Badge>
                      )}
                      <Badge variant={c.status === "available" ? "default" : "secondary"}
                        className={c.status === "available" ? "bg-[#16a34a]/10 text-[#16a34a] border-[#16a34a]/20" : ""}>
                        {c.status}
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
