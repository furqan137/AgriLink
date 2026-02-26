import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { getUser } from "@/lib/auth"
import HarvestRequest from "@/lib/models/HarvestRequest"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const user = await getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await params
    const body = await req.json()
    const { action } = body

    const request = await HarvestRequest.findById(id)
    if (!request) return NextResponse.json({ error: "Not found" }, { status: 404 })

    if (action === "accept" && user.role === "provider") {
      request.status = "accepted"
      request.assignedProvider = user.id
      await request.save()
      return NextResponse.json({ request })
    }

    if (action === "complete") {
      request.status = "completed"
      await request.save()
      return NextResponse.json({ request })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Harvest PUT error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const user = await getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await params
    const request = await HarvestRequest.findById(id)
    if (!request) return NextResponse.json({ error: "Not found" }, { status: 404 })

    if (request.farmer.toString() !== user.id && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await HarvestRequest.findByIdAndDelete(id)
    return NextResponse.json({ message: "Deleted" })
  } catch (error) {
    console.error("Harvest DELETE error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
