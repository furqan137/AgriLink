"use client"

import useSWR from "swr"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Tag, CheckCircle2, XCircle, Clock } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { useState } from "react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface Offer {
  _id?: string
  buyer: string | { _id: string }
  offeredPrice: number
  status: "pending" | "accepted" | "rejected" | "completed"
}

interface CropWithOffer {
  _id: string
  cropName: string
  quantity: number
  pricePerUnit: number
  location: string
  status: string
  farmer?: { _id: string; name: string; email: string }
  offers: Offer[]
}

export default function BuyerOffersPage() {
  const { user } = useAuth()
  const { data, isLoading, mutate } = useSWR("/api/crops", fetcher)
  const [processingId, setProcessingId] = useState<string | null>(null)

  const crops: CropWithOffer[] = data?.crops || []

  // 🔎 Extract buyer offers from embedded crop offers
  const myOffers = crops.flatMap((crop) =>
    crop.offers
      .filter((offer) => {
        const buyerId =
          typeof offer.buyer === "string"
            ? offer.buyer
            : offer.buyer?._id
        return buyerId === user?.id
      })
      .map((offer) => ({
        ...offer,
        crop,
      }))
  )

  // ❌ Hide completed offers
  const activeOffers = myOffers.filter(
    (offer) => offer.status !== "completed"
  )

  const pending = activeOffers.filter((o) => o.status === "pending")
  const accepted = activeOffers.filter((o) => o.status === "accepted")
  const rejected = activeOffers.filter((o) => o.status === "rejected")

  async function confirmPurchase(
    crop: CropWithOffer,
    offerId: string,
    amount: number
  ) {
    try {
      setProcessingId(offerId)

      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmerId:
            typeof crop.farmer === "object"
              ? crop.farmer._id
              : crop.farmer,
          cropId: crop._id,
          offerId,
          amount,
        }),
      })

      if (res.ok) {
        toast.success("Purchase confirmed successfully!")
        mutate()
      } else {
        const data = await res.json()
        toast.error(data?.error || "Failed to confirm purchase")
      }
    } catch {
      toast.error("Network error")
    } finally {
      setProcessingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    )
  }

  const getIcon = (status: string) => {
    if (status === "pending")
      return <Clock className="w-4 h-4 text-yellow-500" />
    if (status === "accepted")
      return <CheckCircle2 className="w-4 h-4 text-green-600" />
    return <XCircle className="w-4 h-4 text-red-600" />
  }

  const getBadgeStyle = (status: string) => {
    if (status === "pending")
      return "bg-yellow-100 text-yellow-600 border-yellow-300"
    if (status === "accepted")
      return "bg-green-100 text-green-600 border-green-300"
    return "bg-red-100 text-red-600 border-red-300"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Offers</h1>
        <p className="text-muted-foreground">
          Track all your crop price offers and their status.
        </p>
      </div>

      {activeOffers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Tag className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold">No active offers</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Browse crops and start sending offers.
            </p>
            <Link href="/buyer/browse">
              <Button className="mt-4 bg-green-600 text-white">
                Browse Crops
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        [pending, accepted, rejected].map((group, index) => {
          if (group.length === 0) return null

          const title =
            index === 0
              ? "Pending"
              : index === 1
              ? "Accepted"
              : "Rejected"

          return (
            <div key={title} className="space-y-4">
              <h2 className="text-lg font-semibold">
                {title} ({group.length})
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {group.map((offer) => (
                  <Card key={offer._id}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base flex items-center gap-2">
                          {getIcon(offer.status)}
                          {offer.crop.cropName}
                        </CardTitle>
                        <Badge className={getBadgeStyle(offer.status)}>
                          {offer.status}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Farmer
                        </span>
                        <span>{offer.crop.farmer?.name}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Listed Price
                        </span>
                        <span>
                          Rs.{offer.crop.pricePerUnit}/unit
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Your Offer
                        </span>
                        <span className="font-semibold text-green-600">
                          Rs.{offer.offeredPrice}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Quantity
                        </span>
                        <span>{offer.crop.quantity} units</span>
                      </div>

                      {offer.status === "accepted" && offer._id && (
                        <Button
                          disabled={processingId === offer._id}
                          className="w-full mt-2 bg-green-600 text-white"
                          onClick={() =>
                            confirmPurchase(
                              offer.crop,
                              offer._id!,
                              offer.offeredPrice
                            )
                          }
                        >
                          {processingId === offer._id
                            ? "Processing..."
                            : "Confirm Purchase"}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}