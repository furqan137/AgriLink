"use client"

import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Search, CheckCircle2, Clock, TrendingUp, IndianRupee, Receipt } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface TxItem {
  _id: string
  amount: number
  status: string
  receiptUrl: string
  createdAt: string
  buyer?: { name: string; email: string }
  farmer?: { name: string; email: string }
  crop?: { cropName: string; quantity: number }
}

export default function AdminTransactionsPage() {
  const { data, isLoading } = useSWR("/api/admin?resource=transactions", fetcher)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const allTx: TxItem[] = data?.transactions || []

  const transactions = allTx.filter((t) => {
    const matchSearch =
      (t.buyer?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.farmer?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.crop?.cropName || "").toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" || t.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalAmount = allTx.reduce((s, t) => s + t.amount, 0)
  const confirmedAmount = allTx.filter((t) => t.status === "confirmed").reduce((s, t) => s + t.amount, 0)
  const pendingCount = allTx.filter((t) => t.status === "pending").length

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
        <h1 className="text-2xl font-bold">Transaction Monitor</h1>
        <p className="text-muted-foreground">Monitor all platform transactions and payments.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#16a34a]/10 flex items-center justify-center text-[#16a34a]">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold">Rs.{totalAmount.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Volume</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0ea5e9]/10 flex items-center justify-center text-[#0ea5e9]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold">Rs.{confirmedAmount.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Confirmed</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#eab308]/10 flex items-center justify-center text-[#eab308]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold">{pendingCount}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by buyer, farmer, or crop..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {["all", "pending", "confirmed"].map((s) => (
            <Button
              key={s}
              size="sm"
              variant={statusFilter === s ? "default" : "outline"}
              className={statusFilter === s ? "bg-gradient-to-r from-[#16a34a] to-[#15803d] text-[#ffffff]" : ""}
              onClick={() => setStatusFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {transactions.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Receipt className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-1">No transactions found</h3>
            <p className="text-sm text-muted-foreground">Adjust your filters to see results.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {transactions.map((tx) => (
            <Card key={tx._id} className="card-hover border-border/50 overflow-hidden">
              <div className={`h-0.5 ${tx.status === "confirmed" ? "bg-gradient-to-r from-[#16a34a] to-[#0ea5e9]" : "bg-gradient-to-r from-[#eab308] to-[#f97316]"}`} />
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{tx.crop?.cropName || "Transaction"}</p>
                      <Badge className={tx.status === "confirmed"
                        ? "bg-[#16a34a]/10 text-[#16a34a] border-[#16a34a]/20"
                        : "bg-[#eab308]/10 text-[#eab308] border-[#eab308]/20"
                      }>
                        {tx.status === "confirmed" ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                        {tx.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-x-4 text-xs text-muted-foreground">
                      <span>Buyer: {tx.buyer?.name || "N/A"}</span>
                      <span>Farmer: {tx.farmer?.name || "N/A"}</span>
                      <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <p className="text-lg font-bold text-[#16a34a]">Rs.{tx.amount.toLocaleString()}</p>
                    {tx.receiptUrl && (
                      <a
                        href={tx.receiptUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#0ea5e9] hover:underline flex items-center gap-1"
                      >
                        <Receipt className="w-3 h-3" /> Receipt
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
