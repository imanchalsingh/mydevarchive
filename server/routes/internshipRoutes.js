import express from "express";
import Internship from "../models/Internship.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// PUBLIC GET
router.get("/", async (req, res) => {
  const internships = await Internship.find().sort({ createdAt: -1 });
  res.json(internships);
});

// CREATE
router.post(
  "/",
  protect,
  upload.single("image"),
  async (req, res) => {
    const internship = await Internship.create({
      company: req.body.company,
      role: req.body.role,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      certificateURL: req.body.certificateURL,
      description: req.body.description,
      image: req.file ? req.file.path : "",
    });

    res.status(201).json(internship);
  }
);

// UPDATE
router.put(
  "/:id",
  protect,
  upload.single("image"),
  async (req, res) => {
    const updateData = {
      company: req.body.company,
      role: req.body.role,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      certificateURL: req.body.certificateURL,
      description: req.body.description,
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const updated = await Internship.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);
  }
);

// DELETE
router.delete("/:id", protect, async (req, res) => {
  await Internship.findByIdAndDelete(req.params.id);
  res.json({ message: "Internship Deleted" });
});

export default router;
