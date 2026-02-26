import mongoose, { Schema, Document } from "mongoose"

export interface IOffer {
  _id?: mongoose.Types.ObjectId
  buyer: mongoose.Types.ObjectId
  offeredPrice: number
  status: "pending" | "accepted" | "rejected"
  createdAt?: Date
}

export interface ICropListing extends Document {
  farmer: mongoose.Types.ObjectId
  cropName: string
  quantity: number
  pricePerUnit: number
  location: string
  description: string
  status: "available" | "sold"
  offers: IOffer[]
  createdAt: Date
}

const OfferSchema = new Schema<IOffer>(
  {
    buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    offeredPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"], // ✅ ADD THIS
      default: "pending",
    },
  },
  { timestamps: true }
)

const CropListingSchema = new Schema<ICropListing>(
  {
    farmer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    cropName: { type: String, required: true },
    quantity: { type: Number, required: true },
    pricePerUnit: { type: Number, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["available", "sold"],
      default: "available",
    },
    offers: [OfferSchema],
  },
  { timestamps: true }
)

export default mongoose.models.CropListing ||
  mongoose.model<ICropListing>("CropListing", CropListingSchema)
