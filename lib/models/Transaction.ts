import mongoose, { Schema, Document } from "mongoose"

export interface ITransaction extends Document {
  buyer: mongoose.Types.ObjectId
  farmer: mongoose.Types.ObjectId
  crop: mongoose.Types.ObjectId
  amount: number
  receiptUrl: string
  status: "pending" | "confirmed"
  createdAt: Date
}

const TransactionSchema = new Schema<ITransaction>(
  {
    buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    farmer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    crop: { type: Schema.Types.ObjectId, ref: "CropListing", required: true },
    amount: { type: Number, required: true },
    receiptUrl: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "confirmed"],
      default: "pending",
    },
  },
  { timestamps: true }
)

export default mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema)
