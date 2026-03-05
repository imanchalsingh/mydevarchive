import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    issuer: { type: String, required: true },
    image: { type: String },
    category: { type: String }, //frontend, backend, devops, etc.
  },
  { timestamps: true },
);

export default mongoose.model("Badge", badgeSchema);
