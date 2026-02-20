import express from "express";
import Contribution from "../models/Contribution.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// PUBLIC GET
router.get("/", async (req, res) => {
  const contributions = await Contribution.find().sort({ createdAt: -1 });
  res.json(contributions);
});

// CREATE
router.post(
  "/",
  protect,
  upload.single("image"),
  async (req, res) => {
    const contribution = await Contribution.create({
      title: req.body.title,
      type: req.body.type,
      referenceId: req.body.referenceId,
      description: req.body.description,
      image: req.file ? req.file.path : "",
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
      title: req.body.title,
      type: req.body.type,
      referenceId: req.body.referenceId,
      description: req.body.description,
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const updated = await Contribution.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);
  }
);

// DELETE
router.delete("/:id", protect, async (req, res) => {
  await Contribution.findByIdAndDelete(req.params.id);
  res.json({ message: "Contribution Deleted" });
});

export default router;
