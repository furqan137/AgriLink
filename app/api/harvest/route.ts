import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { getUser } from "@/lib/auth"
import HarvestRequest from "@/lib/models/HarvestRequest"

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const user = await getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const myOnly = searchParams.get("my") === "true"

    const filter: Record<string, unknown> = {}
    if (status) filter.status = status
    if (myOnly && user.role === "farmer") filter.farmer = user.id
    if (myOnly && user.role === "provider") filter.assignedProvider = user.id

    const requests = await HarvestRequest.find(filter)
      .populate("farmer", "name email phone location")
      .populate("assignedProvider", "name email phone location")
      .sort({ createdAt: -1 })

    return NextResponse.json({ requests })
  } catch (error) {
    console.error("Harvest GET error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const user = await getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    if (user.role !== "farmer") return NextResponse.json({ error: "Only farmers can post harvest requests" }, { status: 403 })

    const body = await req.json()
    const { vehicleType, manpowerRequired, cropType, landArea, duration, location } = body

    const request = await HarvestRequest.create({
      farmer: user.id,
      vehicleType,
      manpowerRequired,
      cropType,
      landArea,
      duration,
      location: location || user.location,
    })

    return NextResponse.json({ request }, { status: 201 })
  } catch (error) {
    console.error("Harvest POST error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
