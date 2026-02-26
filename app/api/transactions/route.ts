import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { getUser } from "@/lib/auth"
import Transaction from "@/lib/models/Transaction"
import CropListing from "@/lib/models/CropListing"
import "@/lib/models/User"

export async function GET() {
  try {
    await connectDB()

    const user = await getUser()
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const filter: Record<string, unknown> = {}

    if (user.role === "buyer") filter.buyer = user.id
    if (user.role === "farmer") filter.farmer = user.id

    const transactions = await Transaction.find(filter)
      .populate("buyer", "name email phone location")
      .populate("farmer", "name email phone location")
      .populate("crop", "cropName quantity pricePerUnit")
      .sort({ createdAt: -1 })

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error("Transactions GET error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const user = await getUser()
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    if (user.role !== "buyer")
      return NextResponse.json(
        { error: "Only buyers can create transactions" },
        { status: 403 }
      )

    const body = await req.json()
    const { farmerId, cropId, offerId, amount } = body

    if (!farmerId || !cropId || !offerId || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // 🔎 Find Crop
    const crop = await CropListing.findById(cropId)
    if (!crop)
      return NextResponse.json(
        { error: "Crop not found" },
        { status: 404 }
      )

    // 🔎 Find Offer inside crop
    const offer = crop.offers.id(offerId)
    if (!offer)
      return NextResponse.json(
        { error: "Offer not found" },
        { status: 404 }
      )

    // 🔐 Security check: ensure this buyer owns this offer
    if (offer.buyer.toString() !== user.id.toString()) {
      return NextResponse.json(
        { error: "Not your offer" },
        { status: 403 }
      )
    }

    if (offer.status !== "accepted") {
      return NextResponse.json(
        { error: "Offer is not accepted" },
        { status: 400 }
      )
    }

    // 🚫 Prevent duplicate transaction
    const existingTransaction = await Transaction.findOne({
      buyer: user.id,
      crop: cropId,
    })

    if (existingTransaction) {
      return NextResponse.json(
        { error: "Transaction already exists" },
        { status: 400 }
      )
    }

    // ✅ Mark offer as completed
    offer.set("status", "completed")

    // ✅ Mark crop as sold (optional)
    crop.status = "sold"

    await crop.save()

    // ✅ Create transaction
    const transaction = await Transaction.create({
      buyer: user.id,
      farmer: farmerId,
      crop: cropId,
      amount,
      receiptUrl: "",
      status: "pending",
    })

    return NextResponse.json({ transaction }, { status: 201 })
  } catch (error) {
    console.error("Transactions POST error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}