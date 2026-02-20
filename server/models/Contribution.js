import mongoose from "mongoose";

const contributionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      required: true,
    },
    event: { type: String },
    referenceId: { type: mongoose.Schema.Types.ObjectId },
    role: { type: String },
    image: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model("Contribution", contributionSchema);
