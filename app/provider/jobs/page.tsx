"use client"

import useSWR from "swr"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, ClipboardList, MapPin, Clock, Users, Wheat } from "lucide-react"
import { toast } from "sonner"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function ProviderJobsPage() {
  const { data, isLoading, mutate } = useSWR("/api/harvest?status=open", fetcher)
  const jobs = data?.requests || []

  async function handleAccept(id: string) {
    const res = await fetch(`/api/harvest/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "accept" }),
    })
    if (res.ok) {
      toast.success("Job accepted!")
      mutate()
    } else {
      toast.error("Failed to accept job")
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
      <div>
        <h1 className="text-2xl font-bold">Available Harvest Jobs</h1>
        <p className="text-muted-foreground">Browse and accept open harvest requests from farmers.</p>
      </div>

      {jobs.length === 0 ? (
        <Card className="border-border/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ClipboardList className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground font-medium">No open jobs available right now</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((h: { _id: string; cropType: string; vehicleType: string; location: string; manpowerRequired: number; duration: string; landArea: string; farmer?: { name: string; location: string } }) => (
            <Card key={h._id} className="card-hover border-border/50">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{h.cropType}</h3>
                    <p className="text-sm text-muted-foreground">By: {h.farmer?.name || "Farmer"}</p>
                  </div>
                  <Badge className="bg-[#16a34a]/10 text-[#16a34a] border-[#16a34a]/20">open</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><Wheat className="w-3 h-3" /> {h.vehicleType}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {h.location}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {h.manpowerRequired} workers</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {h.duration}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-4">Land Area: {h.landArea}</p>
                <Button className="w-full bg-gradient-to-r from-[#16a34a] to-[#15803d] text-[#ffffff]" onClick={() => handleAccept(h._id)}>
                  Accept This Job
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
