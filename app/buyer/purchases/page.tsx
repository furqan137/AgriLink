"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, ShoppingCart, Upload, CheckCircle2, Clock } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface TransactionItem {
  _id: string
  amount: number
  status: string
  receiptUrl: string
  createdAt: string
  farmer?: { name: string; email: string; phone: string }
  crop?: { cropName: string; quantity: number; pricePerUnit: number }
}

export default function PurchasesPage() {
  const { data, isLoading, mutate } = useSWR("/api/transactions", fetcher)
  const [uploading, setUploading] = useState<string | null>(null)

  const transactions: TransactionItem[] = data?.transactions || []
  const pending = transactions.filter((t) => t.status === "pending")
  const confirmed = transactions.filter((t) => t.status === "confirmed")

  async function handleFileUpload(txId: string, file: File) {
    const formData = new FormData()
    formData.append("receipt", file)

    setUploading(txId)

    try {
      const res = await fetch(`/api/transactions/${txId}`, {
        method: "PUT",
        body: formData,
      })

      if (res.ok) {
        toast.success("Receipt uploaded and transaction confirmed!")
        mutate()
      } else {
        toast.error("Failed to upload receipt")
      }
    } catch {
      toast.error("Network error")
    }

    setUploading(null)
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
        <h1 className="text-2xl font-bold">My Purchases</h1>
        <p className="text-muted-foreground">
          View and confirm your crop purchases.
        </p>
      </div>

      {transactions.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <ShoppingCart className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-1">No purchases yet</h3>
            <p className="text-sm text-muted-foreground">
              Your confirmed crop purchases will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* ================= PENDING ================= */}
          {pending.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#eab308]" />
                Pending Confirmation ({pending.length})
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                {pending.map((tx) => (
                  <Card
                    key={tx._id}
                    className="card-hover border-border/50 overflow-hidden"
                  >
                    <div className="h-1 bg-gradient-to-r from-[#eab308] to-[#f97316]" />

                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                          {tx.crop?.cropName || "Crop Purchase"}
                        </CardTitle>
                        <Badge className="bg-[#eab308]/10 text-[#eab308] border-[#eab308]/20">
                          Pending
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Farmer</p>
                          <p className="font-medium">
                            {tx.farmer?.name || "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="text-muted-foreground">Amount</p>
                          <p className="font-semibold text-[#16a34a]">
                            Rs.{tx.amount.toLocaleString()}
                          </p>
                        </div>

                        <div>
                          <p className="text-muted-foreground">Quantity</p>
                          <p className="font-medium">
                            {tx.crop?.quantity || "N/A"} units
                          </p>
                        </div>

                        <div>
                          <p className="text-muted-foreground">Date</p>
                          <p className="font-medium">
                            {new Date(tx.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* FILE UPLOAD */}
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                          <Upload className="w-3 h-3" />
                          Upload Receipt Image
                        </label>

                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (!e.target.files?.[0]) return
                            handleFileUpload(tx._id, e.target.files[0])
                          }}
                        />

                        {uploading === tx._id && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Uploading...
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ================= CONFIRMED ================= */}
          {confirmed.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#16a34a]" />
                Confirmed ({confirmed.length})
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                {confirmed.map((tx) => (
                  <Card
                    key={tx._id}
                    className="border-border/50 overflow-hidden"
                  >
                    <div className="h-1 bg-gradient-to-r from-[#16a34a] to-[#0ea5e9]" />

                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                          {tx.crop?.cropName || "Crop Purchase"}
                        </CardTitle>
                        <Badge className="bg-[#16a34a]/10 text-[#16a34a] border-[#16a34a]/20">
                          Confirmed
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Farmer</p>
                          <p className="font-medium">
                            {tx.farmer?.name || "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="text-muted-foreground">Amount</p>
                          <p className="font-semibold text-[#16a34a]">
                            Rs.{tx.amount.toLocaleString()}
                          </p>
                        </div>

                        <div>
                          <p className="text-muted-foreground">Date</p>
                          <p>
                            {new Date(tx.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* RECEIPT IMAGE */}
                      {tx.receiptUrl && (
                        <div>
                          <p className="text-muted-foreground text-xs mb-1">
                            Receipt
                          </p>
                          <img
                            src={tx.receiptUrl}
                            alt="Receipt"
                            className="rounded-md border w-full max-h-48 object-cover"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}