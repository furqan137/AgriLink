import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { getUser } from "@/lib/auth"
import CropListing from "@/lib/models/CropListing"

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const user = await getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const myOnly = searchParams.get("my") === "true"
    const status = searchParams.get("status")

    const filter: Record<string, unknown> = {}
    if (myOnly && user.role === "farmer") filter.farmer = user.id
    if (status) filter.status = status

    const crops = await CropListing.find(filter)
      .populate("farmer", "name email phone location")
      .populate("offers.buyer", "name email phone location")
      .sort({ createdAt: -1 })

    return NextResponse.json({ crops })
  } catch (error) {
    console.error("Crops GET error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const user = await getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (user.role !== "farmer") return NextResponse.json({ error: "Only farmers can post crops" }, { status: 403 })

    const body = await req.json()
    const { cropName, quantity, pricePerUnit, location, description } = body

    const crop = await CropListing.create({
      farmer: user.id,
      cropName,
      quantity,
      pricePerUnit,
      location: location || user.location,
      description,
    })

    return NextResponse.json({ crop }, { status: 201 })
  } catch (error) {
    console.error("Crops POST error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
