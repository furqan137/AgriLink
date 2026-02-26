import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { getUser } from "@/lib/auth"
import CropListing from "@/lib/models/CropListing"

// Send an offer on a crop
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const user = await getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (user.role !== "buyer") return NextResponse.json({ error: "Only buyers can send offers" }, { status: 403 })

    const { id } = await params
    const body = await req.json()
    const { offeredPrice } = body

    const crop = await CropListing.findById(id)
    if (!crop) return NextResponse.json({ error: "Crop not found" }, { status: 404 })

    crop.offers.push({
      buyer: user.id,
      offeredPrice,
      status: "pending",
    })
    await crop.save()

    return NextResponse.json({ crop })
  } catch (error) {
    console.error("Crop offer error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

// Accept/reject an offer
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const user = await getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await params
    const body = await req.json()
    const { offerId, action } = body

    const crop = await CropListing.findById(id)
    if (!crop) return NextResponse.json({ error: "Crop not found" }, { status: 404 })

    if (crop.farmer.toString() !== user.id && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const offer = crop.offers.find((o: { _id?: { toString: () => string } }) => o._id?.toString() === offerId)
    if (!offer) return NextResponse.json({ error: "Offer not found" }, { status: 404 })

    if (action === "accept") {
      offer.status = "accepted"
      crop.status = "sold"
      // Reject all other pending offers
      crop.offers.forEach((o: { _id?: { toString: () => string }; status: string }) => {
        if (o._id?.toString() !== offerId && o.status === "pending") {
          o.status = "rejected"
        }
      })
    } else if (action === "reject") {
      offer.status = "rejected"
    }

    await crop.save()
    return NextResponse.json({ crop })
  } catch (error) {
    console.error("Crop offer update error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const user = await getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await params
    const crop = await CropListing.findById(id)
    if (!crop) return NextResponse.json({ error: "Not found" }, { status: 404 })

    if (crop.farmer.toString() !== user.id && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await CropListing.findByIdAndDelete(id)
    return NextResponse.json({ message: "Deleted" })
  } catch (error) {
    console.error("Crop delete error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
