import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    issuer: { type: String },
    image: { type: String },
    category: { type: String }, //frontend, backend, devops, etc.
  },
  { timestamps: true },
);

export default mongoose.model("Certificate", certificateSchema);
