import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { getUser } from "@/lib/auth"
import ServiceListing from "@/lib/models/ServiceListing"

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const user = await getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const myOnly = searchParams.get("my") === "true"
    const serviceType = searchParams.get("type")

    const filter: Record<string, unknown> = {}
    if (myOnly && user.role === "provider") filter.provider = user.id
    if (serviceType) filter.serviceType = serviceType

    const services = await ServiceListing.find(filter)
      .populate("provider", "name email phone location")
      .sort({ createdAt: -1 })

    return NextResponse.json({ services })
  } catch (error) {
    console.error("Services GET error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const user = await getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (user.role !== "provider") return NextResponse.json({ error: "Only providers can post services" }, { status: 403 })

    const body = await req.json()
    const { serviceType, vehicleDetails, manpowerCount, pricePerDay, location } = body

    const service = await ServiceListing.create({
      provider: user.id,
      serviceType,
      vehicleDetails: vehicleDetails || "",
      manpowerCount: manpowerCount || 0,
      pricePerDay,
      location: location || user.location,
    })

    return NextResponse.json({ service }, { status: 201 })
  } catch (error) {
    console.error("Services POST error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
