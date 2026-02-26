"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2, Truck } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function NewServicePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    serviceType: "",
    vehicleDetails: "",
    manpowerCount: "",
    pricePerDay: "",
    location: "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          manpowerCount: Number(form.manpowerCount) || 0,
          pricePerDay: Number(form.pricePerDay),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Failed to create service")
        setLoading(false)
        return
      }
      toast.success("Service listed!")
      router.push("/provider/services")
    } catch {
      toast.error("Something went wrong")
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/provider/services" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Services
      </Link>

      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0ea5e9]/10 to-[#16a34a]/10 flex items-center justify-center text-[#0ea5e9]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>Post a Service</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Offer your vehicle or manpower</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Service Type</Label>
              <Select onValueChange={(v) => setForm({ ...form, serviceType: v })}>
                <SelectTrigger><SelectValue placeholder="Select service type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="vehicle">Vehicle</SelectItem>
                  <SelectItem value="manpower">Manpower</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {form.serviceType === "vehicle" && (
              <div className="space-y-2">
                <Label htmlFor="vehicle">Vehicle Details</Label>
                <Input id="vehicle" placeholder="e.g. Tractor - John Deere 5045D" value={form.vehicleDetails}
                  onChange={(e) => setForm({ ...form, vehicleDetails: e.target.value })} />
              </div>
            )}
            {form.serviceType === "manpower" && (
              <div className="space-y-2">
                <Label htmlFor="manpower">Number of Workers</Label>
                <Input id="manpower" type="number" min="1" placeholder="e.g. 10" value={form.manpowerCount}
                  onChange={(e) => setForm({ ...form, manpowerCount: e.target.value })} />
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price Per Day (Rs.)</Label>
                <Input id="price" type="number" min="1" placeholder="e.g. 1500" value={form.pricePerDay}
                  onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="City, State" value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })} required />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-[#16a34a] to-[#15803d] text-[#ffffff] py-5">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              List Service
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
