"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, Tractor } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function NewHarvestPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    vehicleType: "",
    manpowerRequired: "",
    cropType: "",
    landArea: "",
    duration: "",
    location: "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/harvest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          manpowerRequired: Number(form.manpowerRequired),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Failed to create request")
        setLoading(false)
        return
      }
      toast.success("Harvest request posted!")
      router.push("/farmer/harvest")
    } catch {
      toast.error("Something went wrong")
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/farmer/harvest" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Harvests
      </Link>

      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#16a34a]/10 to-[#0ea5e9]/10 flex items-center justify-center text-[#16a34a]">
              <Tractor className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>Post Harvest Requirement</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Find vehicles and manpower for your harvest</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Vehicle Type</Label>
                <Select onValueChange={(v) => setForm({ ...form, vehicleType: v })}>
                  <SelectTrigger><SelectValue placeholder="Select vehicle" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tractor">Tractor</SelectItem>
                    <SelectItem value="Harvester">Harvester</SelectItem>
                    <SelectItem value="Truck">Truck</SelectItem>
                    <SelectItem value="Trailer">Trailer</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="manpower">Manpower Required</Label>
                <Input id="manpower" type="number" min="0" placeholder="e.g. 5" value={form.manpowerRequired}
                  onChange={(e) => setForm({ ...form, manpowerRequired: e.target.value })} required />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cropType">Crop Type</Label>
                <Input id="cropType" placeholder="e.g. Wheat, Rice" value={form.cropType}
                  onChange={(e) => setForm({ ...form, cropType: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="landArea">Land Area</Label>
                <Input id="landArea" placeholder="e.g. 5 acres" value={form.landArea}
                  onChange={(e) => setForm({ ...form, landArea: e.target.value })} required />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input id="duration" placeholder="e.g. 3 days" value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="City, State" value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })} required />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-[#16a34a] to-[#15803d] text-[#ffffff] py-5">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Post Harvest Request
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
