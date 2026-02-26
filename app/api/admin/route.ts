import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { getUser } from "@/lib/auth"
import User from "@/lib/models/User"
import CropListing from "@/lib/models/CropListing"
import HarvestRequest from "@/lib/models/HarvestRequest"
import Transaction from "@/lib/models/Transaction"
import ServiceListing from "@/lib/models/ServiceListing"

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const user = await getUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const resource = searchParams.get("resource")

    if (resource === "stats") {
      const [users, crops, harvests, transactions, services] = await Promise.all([
        User.countDocuments(),
        CropListing.countDocuments(),
        HarvestRequest.countDocuments(),
        Transaction.countDocuments(),
        ServiceListing.countDocuments(),
      ])
      const confirmedTx = await Transaction.countDocuments({ status: "confirmed" })
      const totalRevenue = await Transaction.aggregate([
        { $match: { status: "confirmed" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ])
      return NextResponse.json({
        stats: {
          users,
          crops,
          harvests,
          transactions,
          services,
          confirmedTransactions: confirmedTx,
          totalRevenue: totalRevenue[0]?.total || 0,
        },
      })
    }

    if (resource === "users") {
      const users = await User.find().select("-password").sort({ createdAt: -1 })
      return NextResponse.json({ users })
    }

    if (resource === "transactions") {
      const transactions = await Transaction.find()
        .populate("buyer", "name email")
        .populate("farmer", "name email")
        .populate("crop", "cropName")
        .sort({ createdAt: -1 })
      return NextResponse.json({ transactions })
    }

    return NextResponse.json({ error: "Invalid resource" }, { status: 400 })
  } catch (error) {
    console.error("Admin GET error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB()
    const user = await getUser()
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const body = await req.json()
    const { action, userId } = body

    if (action === "verify") {
      await User.findByIdAndUpdate(userId, { isVerified: true })
      return NextResponse.json({ message: "User verified" })
    }

    if (action === "delete") {
      await User.findByIdAndDelete(userId)
      return NextResponse.json({ message: "User deleted" })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Admin PUT error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
