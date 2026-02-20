import mongoose from "mongoose";

const contributionSchema = new mongoose.Schema(
  {
    name: { type: String },
    event: { type: String },
    type: { type: String },
    role: { type: String },
    issuer: { type: String },
    image: { type: String, required: true },
  },
  { timestamps: true },
);

const ContributionCert = mongoose.model("ContributionCert", contributionSchema);

export default ContributionCert;
