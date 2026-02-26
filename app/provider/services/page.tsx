"use client"

import useSWR from "swr"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Loader2, Truck, MapPin, Trash2 } from "lucide-react"
import { toast } from "sonner"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function ProviderServicesPage() {
  const { data, isLoading, mutate } = useSWR("/api/services?my=true", fetcher)
  const services = data?.services || []

  async function toggleAvailability(id: string, current: boolean) {
    const res = await fetch(`/api/services/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ availabilityStatus: !current }),
    })
    if (res.ok) {
      toast.success(current ? "Set to unavailable" : "Set to available")
      mutate()
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this service?")) return
    const res = await fetch(`/api/services/${id}`, { method: "DELETE" })
    if (res.ok) {
      toast.success("Deleted")
      mutate()
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
          <h1 className="text-2xl font-bold">My Services</h1>
          <p className="text-muted-foreground">Manage your vehicle and manpower listings.</p>
        </div>
        <Link href="/provider/services/new">
          <Button className="bg-gradient-to-r from-[#16a34a] to-[#15803d] text-[#ffffff]">
            <Plus className="w-4 h-4 mr-1" /> New Service
          </Button>
        </Link>
      </div>

      {services.length === 0 ? (
        <Card className="border-border/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Truck className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground font-medium">No services listed</p>
            <Link href="/provider/services/new">
              <Button variant="link" className="text-[#16a34a] mt-2">Post your first service</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {services.map((s: { _id: string; serviceType: string; vehicleDetails: string; manpowerCount: number; pricePerDay: number; availabilityStatus: boolean; location: string }) => (
            <Card key={s._id} className="card-hover border-border/50">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold capitalize">{s.serviceType}</h3>
                    <p className="text-sm text-muted-foreground">
                      {s.serviceType === "vehicle" ? s.vehicleDetails : `${s.manpowerCount} workers`}
                    </p>
                  </div>
                  <Badge className={s.availabilityStatus ? "bg-[#16a34a]/10 text-[#16a34a] border-[#16a34a]/20" : "bg-muted text-muted-foreground"}>
                    {s.availabilityStatus ? "Available" : "Unavailable"}
                  </Badge>
                </div>
                <div className="flex gap-3 text-sm text-muted-foreground mb-4">
                  <span className="font-medium text-foreground">Rs.{s.pricePerDay}/day</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {s.location}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => toggleAvailability(s._id, s.availabilityStatus)}>
                    {s.availabilityStatus ? "Set Unavailable" : "Set Available"}
                  </Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(s._id)}>
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
