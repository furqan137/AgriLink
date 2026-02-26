"use client"

import useSWR from "swr"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Receipt, CheckCircle } from "lucide-react"
import { toast } from "sonner"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function FarmerTransactionsPage() {
  const { data, isLoading, mutate } = useSWR("/api/transactions", fetcher)
  const transactions = data?.transactions || []

  async function handleConfirm(id: string) {
    const res = await fetch(`/api/transactions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "confirm" }),
    })
    if (res.ok) {
      toast.success("Transaction confirmed!")
      mutate()
    } else {
      toast.error("Failed to confirm")
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
        <h1 className="text-2xl font-bold">Transaction History</h1>
        <p className="text-muted-foreground">View and manage your crop sale transactions.</p>
      </div>

      {transactions.length === 0 ? (
        <Card className="border-border/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Receipt className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground font-medium">No transactions yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {transactions.map((t: { _id: string; buyer?: { name: string; email: string }; crop?: { cropName: string }; amount: number; status: string; receiptUrl: string; createdAt: string }) => (
            <Card key={t._id} className="card-hover border-border/50">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.status === "confirmed" ? "bg-[#16a34a]/10 text-[#16a34a]" : "bg-[#eab308]/10 text-[#eab308]"}`}>
                    {t.status === "confirmed" ? <CheckCircle className="w-5 h-5" /> : <Receipt className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-medium">{t.crop?.cropName || "Crop"}</p>
                    <p className="text-sm text-muted-foreground">Buyer: {t.buyer?.name || "Unknown"}</p>
                    <p className="text-xs text-muted-foreground">{new Date(t.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-lg">Rs.{t.amount}</p>
                    <Badge className={t.status === "confirmed" ? "bg-[#16a34a]/10 text-[#16a34a] border-[#16a34a]/20" : "bg-[#eab308]/10 text-[#eab308] border-[#eab308]/20"}>
                      {t.status}
                    </Badge>
                  </div>
                  {t.status === "pending" && (
                    <Button size="sm" className="bg-[#16a34a] text-[#ffffff]" onClick={() => handleConfirm(t._id)}>
                      Confirm
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
