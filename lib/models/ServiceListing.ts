import mongoose, { Schema, Document } from "mongoose"

export interface IServiceListing extends Document {
  provider: mongoose.Types.ObjectId
  serviceType: "vehicle" | "manpower"
  vehicleDetails: string
  manpowerCount: number
  pricePerDay: number
  availabilityStatus: boolean
  location: string
  createdAt: Date
}

const ServiceListingSchema = new Schema<IServiceListing>(
  {
    provider: { type: Schema.Types.ObjectId, ref: "User", required: true },
    serviceType: {
      type: String,
      enum: ["vehicle", "manpower"],
      required: true,
    },
    vehicleDetails: { type: String, default: "" },
    manpowerCount: { type: Number, default: 0 },
    pricePerDay: { type: Number, required: true },
    availabilityStatus: { type: Boolean, default: true },
    location: { type: String, required: true },
  },
  { timestamps: true }
)

export default mongoose.models.ServiceListing ||
  mongoose.model<IServiceListing>("ServiceListing", ServiceListingSchema)
