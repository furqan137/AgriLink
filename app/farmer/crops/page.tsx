"use client"

import useSWR from "swr"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Loader2, Wheat, MapPin, Trash2, Check, X } from "lucide-react"
import { toast } from "sonner"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function FarmerCropsPage() {
  const { data, isLoading, mutate } = useSWR("/api/crops?my=true", fetcher)
  const crops = data?.crops || []

  async function handleOfferAction(cropId: string, offerId: string, action: "accept" | "reject") {
    const res = await fetch(`/api/crops/${cropId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ offerId, action }),
    })
    if (res.ok) {
      toast.success(action === "accept" ? "Offer accepted!" : "Offer rejected")
      mutate()
    } else {
      toast.error("Failed to update offer")
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this crop listing?")) return
    const res = await fetch(`/api/crops/${id}`, { method: "DELETE" })
    if (res.ok) {
      toast.success("Deleted")
      mutate()
    } else {
      toast.error("Failed to delete")
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Crop Listings</h1>
          <p className="text-muted-foreground">Manage your crops and buyer offers.</p>
        </div>
        <Link href="/farmer/crops/new">
          <Button className="bg-gradient-to-r from-[#16a34a] to-[#15803d] text-[#ffffff]">
            <Plus className="w-4 h-4 mr-1" /> New Crop
          </Button>
        </Link>
      </div>

      {crops.length === 0 ? (
        <Card className="border-border/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Wheat className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground font-medium">No crops listed yet</p>
            <Link href="/farmer/crops/new">
              <Button variant="link" className="text-[#16a34a] mt-2">List your first crop</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {crops.map((c: { _id: string; cropName: string; pricePerUnit: number; quantity: number; status: string; location: string; description: string; offers: Array<{ _id: string; buyer: { name: string; email: string }; offeredPrice: number; status: string }> }) => (
            <Card key={c._id} className="card-hover border-border/50">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{c.cropName}</h3>
                    <p className="text-sm text-muted-foreground">{c.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={c.status === "available" ? "bg-[#16a34a]/10 text-[#16a34a] border-[#16a34a]/20" : "bg-muted text-muted-foreground"}>
                      {c.status}
                    </Badge>
                    {c.status === "available" && (
                      <Button size="icon" variant="ghost" className="text-destructive h-8 w-8" onClick={() => handleDelete(c._id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                  <span>Rs.{c.pricePerUnit}/unit</span>
                  <span>Qty: {c.quantity}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {c.location}</span>
                </div>

                {/* Offers */}
                {c.offers.length > 0 && (
                  <div className="border-t border-border/50 pt-3 space-y-2">
                    <p className="text-sm font-medium">Offers ({c.offers.length})</p>
                    {c.offers.map((o) => (
                      <div key={o._id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary/50">
                        <div>
                          <p className="text-sm font-medium">{o.buyer?.name || "Buyer"}</p>
                          <p className="text-xs text-muted-foreground">Offered Rs.{o.offeredPrice}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={
                            o.status === "pending" ? "border-[#eab308]/30 text-[#eab308]" :
                            o.status === "accepted" ? "border-[#16a34a]/30 text-[#16a34a]" :
                            "border-destructive/30 text-destructive"
                          }>{o.status}</Badge>
                          {o.status === "pending" && (
                            <>
                              <Button size="icon" className="h-7 w-7 bg-[#16a34a] text-[#ffffff] hover:bg-[#16a34a]/90" onClick={() => handleOfferAction(c._id, o._id, "accept")}>
                                <Check className="w-3 h-3" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => handleOfferAction(c._id, o._id, "reject")}>
                                <X className="w-3 h-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
