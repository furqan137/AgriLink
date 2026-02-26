"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Store, Tag, ShoppingCart, TrendingUp, ArrowRight, Loader2 } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function BuyerDashboard() {
  const { data: cropData, isLoading: cLoad } = useSWR("/api/crops?status=available", fetcher)
  const { data: txData, isLoading: tLoad } = useSWR("/api/transactions", fetcher)
  const { data: allCrops, isLoading: aLoad } = useSWR("/api/crops", fetcher)

  const crops = cropData?.crops || []
  const transactions = txData?.transactions || []
  const allCropsList = allCrops?.crops || []

  const myOffers = allCropsList.flatMap((c: { _id: string; cropName: string; offers: { buyer: { _id: string } | string; status: string; offeredPrice: number }[] }) =>
    (c.offers || []).map((o: { buyer: { _id: string } | string; status: string; offeredPrice: number }) => ({
      ...o,
      cropId: c._id,
      cropName: c.cropName,
    }))
  )
  const pendingOffers = myOffers.filter((o: { status: string }) => o.status === "pending")
  const totalSpent = transactions
    .filter((t: { status: string }) => t.status === "confirmed")
    .reduce((sum: number, t: { amount: number }) => sum + t.amount, 0)

  const isLoading = cLoad || tLoad || aLoad

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#16a34a]" />
      </div>
    )
  }

  const stats = [
    { label: "Available Crops", value: crops.length, icon: <Store className="w-5 h-5" />, color: "text-[#16a34a]", bg: "bg-[#16a34a]/10" },
    { label: "My Offers", value: myOffers.length, icon: <Tag className="w-5 h-5" />, color: "text-[#0ea5e9]", bg: "bg-[#0ea5e9]/10" },
    { label: "Purchases", value: transactions.length, icon: <ShoppingCart className="w-5 h-5" />, color: "text-[#eab308]", bg: "bg-[#eab308]/10" },
    { label: "Total Spent", value: `Rs.${totalSpent.toLocaleString()}`, icon: <TrendingUp className="w-5 h-5" />, color: "text-[#f97316]", bg: "bg-[#f97316]/10" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Buyer Dashboard</h1>
          <p className="text-muted-foreground">Browse crops and manage your purchases.</p>
        </div>
        <Link href="/buyer/browse">
          <Button className="bg-gradient-to-r from-[#16a34a] to-[#15803d] text-[#ffffff]">
            <Store className="w-4 h-4 mr-1" /> Browse Crops
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
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

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Available Crops</CardTitle>
            <Link href="/buyer/browse" className="text-sm text-[#16a34a] hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {crops.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No crops available right now.</p>
            ) : (
              <div className="space-y-3">
                {crops.slice(0, 5).map((c: { _id: string; cropName: string; quantity: number; pricePerUnit: number; farmer?: { name: string }; location: string }) => (
                  <div key={c._id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{c.cropName}</p>
                      <p className="text-xs text-muted-foreground">{c.farmer?.name} - {c.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#16a34a]">Rs.{c.pricePerUnit}/unit</p>
                      <p className="text-xs text-muted-foreground">{c.quantity} units</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Pending Offers</CardTitle>
            <Link href="/buyer/offers" className="text-sm text-[#16a34a] hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {pendingOffers.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No pending offers.</p>
            ) : (
              <div className="space-y-3">
                {pendingOffers.slice(0, 5).map((o: { cropId: string; cropName: string; offeredPrice: number; status: string }, i: number) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{o.cropName}</p>
                      <p className="text-xs text-muted-foreground">Offered: Rs.{o.offeredPrice}</p>
                    </div>
                    <Badge className="bg-[#eab308]/10 text-[#eab308] border-[#eab308]/20">{o.status}</Badge>
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
