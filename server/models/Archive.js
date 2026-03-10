import mongoose from "mongoose";

const archiveSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    type: {
      type: String,
      required: true,
      enum: ["badge", "certificate", "internship", "contribution"],
    },

    issuer: { type: String }, // company / organization / platform
    event: { type: String },  // hackathon/workshop/event name

    role: { type: String },

    category: { type: String }, // frontend, backend, devops

    duration: { type: String }, // internships mainly
    mode: { type: String },     // remote / onsite
    status: { type: String },

    skills: [{ type: String }],

    image: { type: String, required: true },

    referenceId: { type: mongoose.Schema.Types.ObjectId },
  },
  { timestamps: true }
);

export default mongoose.model("Archive", archiveSchema);