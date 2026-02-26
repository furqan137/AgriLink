"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle2, Clock, MapPin, Wheat, User } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface HarvestJob {
  _id: string
  cropType: string
  vehicleType: string
  manpowerRequired: number
  landArea: string
  duration: string
  location: string
  status: string
  farmer?: { name: string; phone: string }
}

export default function AcceptedJobsPage() {
  const { data, isLoading } = useSWR("/api/harvest?my=true", fetcher)
  const jobs: HarvestJob[] = data?.requests || []

  const accepted = jobs.filter((j) => j.status === "accepted")
  const completed = jobs.filter((j) => j.status === "completed")

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
        <h1 className="text-2xl font-bold">My Accepted Jobs</h1>
        <p className="text-muted-foreground">
          Track and manage your active and completed jobs.
        </p>
      </div>

      {accepted.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#eab308]" />
            Active Jobs ({accepted.length})
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {accepted.map((job) => (
              <Card key={job._id} className="card-hover border-border/50 overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-[#eab308] to-[#f97316]" />

                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {job.cropType} - {job.vehicleType}
                    </CardTitle>
                    <Badge className="bg-[#eab308]/10 text-[#eab308] border-[#eab308]/20">
                      In Progress
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <User className="w-3.5 h-3.5" />
                      {job.farmer?.name || "N/A"}
                    </div>

                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      {job.location}
                    </div>

                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Wheat className="w-3.5 h-3.5" />
                      {job.landArea}
                    </div>

                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      {job.duration}
                    </div>
                  </div>

                  {job.manpowerRequired > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Manpower needed: {job.manpowerRequired}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {completed.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#16a34a]" />
            Completed Jobs ({completed.length})
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {completed.map((job) => (
              <Card key={job._id} className="border-border/50 opacity-80">
                <div className="h-1 bg-gradient-to-r from-[#16a34a] to-[#0ea5e9]" />

                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {job.cropType} - {job.vehicleType}
                    </CardTitle>
                    <Badge className="bg-[#16a34a]/10 text-[#16a34a] border-[#16a34a]/20">
                      Completed
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <User className="w-3.5 h-3.5" />
                      {job.farmer?.name || "N/A"}
                    </div>

                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      {job.location}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {accepted.length === 0 && completed.length === 0 && (
        <Card className="border-border/50">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-1">No jobs yet</h3>
            <p className="text-sm text-muted-foreground">
              Accept harvest jobs from the Available Jobs page to get started.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}