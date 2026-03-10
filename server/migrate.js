import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Badge from "./models/Badge.js";
import Certificate from "./models/Certificate.js";
import Contribution from "./models/Contribution.js";
import Internship from "./models/Internship.js";
import Archive from "./models/Archive.js";

await mongoose.connect(process.env.MONGO_URI);

async function migrate() {
  console.log("Migration started...");

  /* ---------- BADGES ---------- */
  const badges = await Badge.find();

  for (const b of badges) {
    await Archive.create({
      title: b.title,
      type: "badge",
      issuer: b.issuer,
      category: b.category,
      image: b.image,
      createdAt: b.createdAt,
    });
  }

  /* ---------- CERTIFICATES ---------- */
  const certificates = await Certificate.find();

  for (const c of certificates) {
    await Archive.create({
      title: c.title,
      type: "certificate",
      issuer: c.issuer,
      category: c.category,
      image: c.image,
      createdAt: c.createdAt,
    });
  }

  /* ---------- CONTRIBUTIONS ---------- */
  const contributions = await Contribution.find();

  for (const c of contributions) {
    await Archive.create({
      title: c.title,
      type: "contribution",
      event: c.event,
      role: c.role,
      image: c.image,
      referenceId: c.referenceId,
      createdAt: c.createdAt,
    });
  }

  /* ---------- INTERNSHIPS ---------- */
  const internships = await Internship.find();

  for (const i of internships) {
    await Archive.create({
      title: `${i.role} Internship`,
      type: "internship",
      issuer: i.company,
      duration: i.duration,
      mode: i.mode,
      status: i.status,
      skills: i.skills,
      image: i.image,
      createdAt: i.createdAt,
    });
  }

  console.log("Migration completed ✅");
  process.exit();
}

migrate();