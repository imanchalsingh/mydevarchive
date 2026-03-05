import express from "express";
import Badge from "../models/Badge.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// PUBLIC GET
router.get("/", async (req, res) => {
  const badges = await Badge.find().sort({ createdAt: -1 });
  res.json(badges);
});

// CREATE
router.post(
  "/",
  protect,
  upload.single("image"),
  async (req, res) => {
    const badge = await Badge.create({
      title: req.body.title,
      issuer: req.body.issuer,
      image: req.file ? req.file.path : "",
      category: req.body.category,
    });

    res.status(201).json(badge);
  }
);

// UPDATE
router.put(
  "/:id",
  protect,
  upload.single("image"),
  async (req, res) => {
    const updateData = {
      title: req.body.title,
      issuer: req.body.issuer,
      category: req.body.category,
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const updated = await Badge.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);
  }
);

// DELETE
router.delete("/:id", protect, async (req, res) => {
  await Badge.findByIdAndDelete(req.params.id);
  res.json({ message: "Badge Deleted" });
});

export default router;
