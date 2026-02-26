import mongoose, { Schema, Document } from "mongoose"

export interface IHarvestRequest extends Document {
  farmer: mongoose.Types.ObjectId
  vehicleType: string
  manpowerRequired: number
  cropType: string
  landArea: string
  duration: string
  location: string
  status: "open" | "accepted" | "completed"
  assignedProvider: mongoose.Types.ObjectId | null
  createdAt: Date
}

const HarvestRequestSchema = new Schema<IHarvestRequest>(
  {
    farmer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    vehicleType: { type: String, required: true },
    manpowerRequired: { type: Number, required: true },
    cropType: { type: String, required: true },
    landArea: { type: String, required: true },
    duration: { type: String, required: true },
    location: { type: String, required: true },
    status: {
      type: String,
      enum: ["open", "accepted", "completed"],
      default: "open",
    },
    assignedProvider: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
)

export default mongoose.models.HarvestRequest ||
  mongoose.model<IHarvestRequest>("HarvestRequest", HarvestRequestSchema)
