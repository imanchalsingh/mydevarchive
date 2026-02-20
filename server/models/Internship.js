import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    role: { type: String },
    duration: { type: String },
    mode: { type: String },
    status: { type: String },
    image: { type: String },
    skills: [{ type: String }],
  },
  { timestamps: true },
);

export default mongoose.model("Internship", internshipSchema);
