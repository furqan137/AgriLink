import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { getUser } from "@/lib/auth"
import Transaction from "@/lib/models/Transaction"
import "@/lib/models/User"
import "@/lib/models/CropListing"
import { v2 as cloudinary } from "cloudinary"

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await context.params

    const transaction = await Transaction.findById(id)
    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      )
    }

    // ✅ FIXED BUYER CHECK
    if (!transaction.buyer) {
      return NextResponse.json(
        { error: "Invalid transaction data" },
        { status: 400 }
      )
    }

    if (transaction.buyer.toString() !== String(user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get uploaded file
    const formData = await req.formData()
    const file = formData.get("receipt") as File | null

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "agrilink_receipts" },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        )
        .end(buffer)
    })

    // Update transaction
    transaction.receiptUrl = uploadResult.secure_url
    transaction.status = "confirmed"
    await transaction.save()

    return NextResponse.json({
      message: "Receipt uploaded and transaction confirmed",
      transaction,
    })
  } catch (error) {
    console.error("Transaction PUT error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}