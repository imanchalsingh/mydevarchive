import express from "express";
import ContributionCert from "../models/ContributionCert.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// PUBLIC GET
router.get("/", async (req, res) => {
  const contributions = await ContributionCert.find().sort({ createdAt: -1 });
  res.json(contributions);
});

// CREATE
router.post(
  "/",
  protect,
  upload.single("image"),
  async (req, res) => {
    const contribution = await ContributionCert.create({
      name: req.body.name,
      type: req.body.type,
      image: req.file ? req.file.path : "",
      role: req.body.role,
      event: req.body.event,
      issuer: req.body.issuer,
    });

    res.status(201).json(contribution);
  }
);

// UPDATE
router.put(
  "/:id",
  protect,
  upload.single("image"),
  async (req, res) => {
    const updateData = {
      name: req.body.name,
      type: req.body.type,
      issuer: req.body.issuer,
      role: req.body.role,
      event: req.body.event,
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const updated = await ContributionCert.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);
  }
);

// DELETE
router.delete("/:id", protect, async (req, res) => {
  await ContributionCert.findByIdAndDelete(req.params.id);
  res.json({ message: "Contribution Deleted" });
});

export default router;
