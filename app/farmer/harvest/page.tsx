"use client"

import useSWR from "swr"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Loader2, Tractor, MapPin, Clock, Users, Trash2 } from "lucide-react"
import { toast } from "sonner"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function FarmerHarvestsPage() {
  const { data, isLoading, mutate } = useSWR("/api/harvest?my=true", fetcher)
  const harvests = data?.requests || []

  async function handleDelete(id: string) {
    if (!confirm("Delete this harvest request?")) return
    const res = await fetch(`/api/harvest/${id}`, { method: "DELETE" })
    if (res.ok) {
      toast.success("Deleted")
      mutate()
    } else {
      toast.error("Failed to delete")
    }
  }

  async function handleComplete(id: string) {
    const res = await fetch(`/api/harvest/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "complete" }),
    })
    if (res.ok) {
      toast.success("Marked as completed")
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
          <h1 className="text-2xl font-bold">My Harvest Requests</h1>
          <p className="text-muted-foreground">Track and manage your posted harvest needs.</p>
        </div>
        <Link href="/farmer/harvest/new">
          <Button className="bg-gradient-to-r from-[#16a34a] to-[#15803d] text-[#ffffff]">
            <Plus className="w-4 h-4 mr-1" /> New Request
          </Button>
        </Link>
      </div>

      {harvests.length === 0 ? (
        <Card className="border-border/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Tractor className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground font-medium">No harvest requests yet</p>
            <Link href="/farmer/harvest/new">
              <Button variant="link" className="text-[#16a34a] mt-2">Post your first request</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {harvests.map((h: { _id: string; cropType: string; vehicleType: string; status: string; location: string; manpowerRequired: number; duration: string; landArea: string; assignedProvider?: { name: string } }) => (
            <Card key={h._id} className="card-hover border-border/50">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{h.cropType}</h3>
                    <p className="text-sm text-muted-foreground">{h.vehicleType}</p>
                  </div>
                  <Badge className={
                    h.status === "open" ? "bg-[#16a34a]/10 text-[#16a34a] border-[#16a34a]/20" :
                    h.status === "accepted" ? "bg-[#0ea5e9]/10 text-[#0ea5e9] border-[#0ea5e9]/20" :
                    "bg-[#eab308]/10 text-[#eab308] border-[#eab308]/20"
                  }>{h.status}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {h.location}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {h.manpowerRequired} workers</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {h.duration}</span>
                  <span className="text-xs">Area: {h.landArea}</span>
                </div>
                {h.assignedProvider && (
                  <p className="text-sm text-[#0ea5e9] mb-3">Provider: {h.assignedProvider.name}</p>
                )}
                <div className="flex gap-2">
                  {h.status === "accepted" && (
                    <Button size="sm" variant="outline" className="border-[#16a34a]/30 text-[#16a34a]" onClick={() => handleComplete(h._id)}>
                      Mark Complete
                    </Button>
                  )}
                  {h.status === "open" && (
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(h._id)}>
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
