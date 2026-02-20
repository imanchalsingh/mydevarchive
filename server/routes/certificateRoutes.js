import express from "express";
import Certificate from "../models/Certificate.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// PUBLIC GET
router.get("/", async (req, res) => {
  const certificates = await Certificate.find().sort({ createdAt: -1 });
  res.json(certificates);
});

// CREATE
router.post("/", protect, upload.single("image"), async (req, res) => {
  const certificate = await Certificate.create({
    title: req.body.title,
    issuer: req.body.issuer,
    image: req.file ? req.file.path : "",
  });

  res.status(201).json(certificate);
});

// UPDATE
router.put("/:id", protect, async (req, res) => {
  const updated = await Certificate.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

// DELETE
router.delete("/:id", protect, async (req, res) => {
  await Certificate.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
