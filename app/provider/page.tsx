"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Truck, Settings, ClipboardList, UserCheck, Plus, ArrowRight, Loader2 } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function ProviderDashboard() {
  const { data: serviceData, isLoading: sLoad } = useSWR("/api/services?my=true", fetcher)
  const { data: harvestData, isLoading: hLoad } = useSWR("/api/harvest", fetcher)
  const { data: myJobs, isLoading: jLoad } = useSWR("/api/harvest?my=true", fetcher)

  const services = serviceData?.services || []
  const allHarvests = harvestData?.requests || []
  const acceptedJobs = myJobs?.requests || []

  const openJobs = allHarvests.filter((h: { status: string }) => h.status === "open")
  const activeServices = services.filter((s: { availabilityStatus: boolean }) => s.availabilityStatus)
  const completedJobs = acceptedJobs.filter((j: { status: string }) => j.status === "completed")

  const isLoading = sLoad || hLoad || jLoad

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#16a34a]" />
      </div>
    )
  }

  const stats = [
    { label: "My Services", value: services.length, icon: <Settings className="w-5 h-5" />, color: "text-[#0ea5e9]", bg: "bg-[#0ea5e9]/10" },
    { label: "Active Services", value: activeServices.length, icon: <Truck className="w-5 h-5" />, color: "text-[#16a34a]", bg: "bg-[#16a34a]/10" },
    { label: "Open Jobs", value: openJobs.length, icon: <ClipboardList className="w-5 h-5" />, color: "text-[#eab308]", bg: "bg-[#eab308]/10" },
    { label: "Jobs Completed", value: completedJobs.length, icon: <UserCheck className="w-5 h-5" />, color: "text-[#f97316]", bg: "bg-[#f97316]/10" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Provider Dashboard</h1>
          <p className="text-muted-foreground">Manage services and accept harvest jobs.</p>
        </div>
        <Link href="/provider/services/new">
          <Button className="bg-gradient-to-r from-[#16a34a] to-[#15803d] text-[#ffffff]">
            <Plus className="w-4 h-4 mr-1" /> Post Service
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
            <CardTitle className="text-base font-semibold">Available Jobs</CardTitle>
            <Link href="/provider/jobs" className="text-sm text-[#16a34a] hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {openJobs.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No open jobs available.</p>
            ) : (
              <div className="space-y-3">
                {openJobs.slice(0, 4).map((h: { _id: string; cropType: string; vehicleType: string; location: string; farmer?: { name: string } }) => (
                  <div key={h._id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{h.cropType} - {h.vehicleType}</p>
                      <p className="text-xs text-muted-foreground">{h.farmer?.name} - {h.location}</p>
                    </div>
                    <Badge className="bg-[#16a34a]/10 text-[#16a34a] border-[#16a34a]/20">open</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">My Services</CardTitle>
            <Link href="/provider/services" className="text-sm text-[#16a34a] hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {services.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No services listed.</p>
            ) : (
              <div className="space-y-3">
                {services.slice(0, 4).map((s: { _id: string; serviceType: string; pricePerDay: number; availabilityStatus: boolean; vehicleDetails: string }) => (
                  <div key={s._id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div>
                      <p className="text-sm font-medium capitalize">{s.serviceType} {s.vehicleDetails ? `- ${s.vehicleDetails}` : ""}</p>
                      <p className="text-xs text-muted-foreground">Rs.{s.pricePerDay}/day</p>
                    </div>
                    <Badge className={s.availabilityStatus ? "bg-[#16a34a]/10 text-[#16a34a] border-[#16a34a]/20" : "bg-muted text-muted-foreground"}>
                      {s.availabilityStatus ? "Available" : "Unavailable"}
                    </Badge>
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
