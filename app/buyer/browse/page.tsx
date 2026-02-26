"use client"

import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Loader2, MapPin, User, Search, Wheat, IndianRupee } from "lucide-react"
import { toast } from "sonner"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface CropItem {
  _id: string
  cropName: string
  quantity: number
  pricePerUnit: number
  location: string
  description: string
  status: string
  farmer?: { name: string; phone: string; location: string }
  offers: { buyer: string | { _id: string }; offeredPrice: number; status: string }[]
}

export default function BrowseCropsPage() {
  const { data, isLoading, mutate } = useSWR("/api/crops?status=available", fetcher)
  const [search, setSearch] = useState("")
  const [offerPrices, setOfferPrices] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState<string | null>(null)

  const crops: CropItem[] = (data?.crops || []).filter((c: CropItem) =>
    c.cropName.toLowerCase().includes(search.toLowerCase()) ||
    c.location.toLowerCase().includes(search.toLowerCase())
  )

  async function sendOffer(cropId: string) {
    const price = offerPrices[cropId]
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      toast.error("Please enter a valid price")
      return
    }
    setSubmitting(cropId)
    try {
      const res = await fetch(`/api/crops/${cropId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offeredPrice: Number(price) }),
      })
      if (res.ok) {
        toast.success("Offer sent successfully!")
        setOfferPrices((p) => ({ ...p, [cropId]: "" }))
        mutate()
      } else {
        const d = await res.json()
        toast.error(d.error || "Failed to send offer")
      }
    } catch {
      toast.error("Network error")
    }
    setSubmitting(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#16a34a]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Browse Crops</h1>
          <p className="text-muted-foreground">Find and make offers on available crops from farmers.</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by crop name or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {crops.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Wheat className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-1">No crops found</h3>
            <p className="text-sm text-muted-foreground">Try changing your search or check back later.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {crops.map((crop) => (
            <Card key={crop._id} className="card-hover border-border/50 overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-[#16a34a] to-[#0ea5e9]" />
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{crop.cropName}</CardTitle>
                  <Badge className="bg-[#16a34a]/10 text-[#16a34a] border-[#16a34a]/20">Available</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <User className="w-3.5 h-3.5" /> {crop.farmer?.name || "N/A"}
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" /> {crop.location}
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Wheat className="w-3.5 h-3.5" /> {crop.quantity} units
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold text-[#16a34a]">
                    <IndianRupee className="w-3.5 h-3.5" /> Rs.{crop.pricePerUnit}/unit
                  </div>
                </div>

                {crop.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{crop.description}</p>
                )}

                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Your offer price"
                    value={offerPrices[crop._id] || ""}
                    onChange={(e) => setOfferPrices((p) => ({ ...p, [crop._id]: e.target.value }))}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => sendOffer(crop._id)}
                    disabled={submitting === crop._id}
                    className="bg-gradient-to-r from-[#16a34a] to-[#15803d] text-[#ffffff] shrink-0"
                  >
                    {submitting === crop._id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Send Offer"
                    )}
                  </Button>
                </div>

                {crop.offers.length > 0 && (
                  <p className="text-xs text-muted-foreground">{crop.offers.length} offer(s) placed</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
