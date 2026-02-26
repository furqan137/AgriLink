"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2, Wheat } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function NewCropPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    cropName: "",
    quantity: "",
    pricePerUnit: "",
    location: "",
    description: "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/crops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          quantity: Number(form.quantity),
          pricePerUnit: Number(form.pricePerUnit),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Failed to create listing")
        setLoading(false)
        return
      }
      toast.success("Crop listed for sale!")
      router.push("/farmer/crops")
    } catch {
      toast.error("Something went wrong")
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/farmer/crops" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Crops
      </Link>

      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#16a34a]/10 to-[#eab308]/10 flex items-center justify-center text-[#16a34a]">
              <Wheat className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>List Crop for Sale</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Add your crop to the marketplace</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cropName">Crop Name</Label>
                <Input id="cropName" placeholder="e.g. Wheat, Rice, Corn" value={form.cropName}
                  onChange={(e) => setForm({ ...form, cropName: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity (units)</Label>
                <Input id="quantity" type="number" min="1" placeholder="e.g. 100" value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price Per Unit (Rs.)</Label>
                <Input id="price" type="number" min="1" placeholder="e.g. 500" value={form.pricePerUnit}
                  onChange={(e) => setForm({ ...form, pricePerUnit: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="City, State" value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Describe your crop quality, grade, etc." value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} required />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-[#16a34a] to-[#15803d] text-[#ffffff] py-5">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              List Crop for Sale
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
