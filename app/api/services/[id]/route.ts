import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { getUser } from "@/lib/auth"
import ServiceListing from "@/lib/models/ServiceListing"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const user = await getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await params
    const body = await req.json()

    const service = await ServiceListing.findById(id)
    if (!service) return NextResponse.json({ error: "Not found" }, { status: 404 })

    if (service.provider.toString() !== user.id && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    Object.assign(service, body)
    await service.save()

    return NextResponse.json({ service })
  } catch (error) {
    console.error("Service PUT error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const user = await getUser()
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await params
    const service = await ServiceListing.findById(id)
    if (!service) return NextResponse.json({ error: "Not found" }, { status: 404 })

    if (service.provider.toString() !== user.id && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await ServiceListing.findByIdAndDelete(id)
    return NextResponse.json({ message: "Deleted" })
  } catch (error) {
    console.error("Service DELETE error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
