import express from "express";
import Archive from "../models/Archive.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// ==================== PUBLIC ROUTES ====================

// GET all archive items with filtering
router.get("/", async (req, res) => {
  try {
    const { type, category, status, mode, search } = req.query;
    let query = {};

    // Apply filters if provided
    if (type) query.type = type;
    if (category) query.category = category;
    if (status) query.status = status;
    if (mode) query.mode = mode;

    // Search functionality (searches in title, issuer, event, role)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { issuer: { $regex: search, $options: 'i' } },
        { event: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await Archive.find(query).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching archive items", error: error.message });
  }
});

// GET single archive item by ID
router.get("/:id", async (req, res) => {
  try {
    const item = await Archive.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Error fetching item", error: error.message });
  }
});

// GET items by type (badge, certificate, internship, contribution)
router.get("/type/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const validTypes = ['badge', 'certificate', 'internship', 'contribution'];
    
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    const items = await Archive.find({ type }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching items by type", error: error.message });
  }
});

// GET all unique categories
router.get("/categories/all", async (req, res) => {
  try {
    const categories = await Archive.distinct('category');
    res.json(categories.filter(cat => cat)); // Remove null/undefined
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error: error.message });
  }
});

// GET stats/counts by type
router.get("/stats/counts", async (req, res) => {
  try {
    const [total, badges, certificates, internships, contributions] = await Promise.all([
      Archive.countDocuments(),
      Archive.countDocuments({ type: 'badge' }),
      Archive.countDocuments({ type: 'certificate' }),
      Archive.countDocuments({ type: 'internship' }),
      Archive.countDocuments({ type: 'contribution' }),
    ]);

    res.json({
      total,
      badge: badges,
      certificate: certificates,
      internship: internships,
      contribution: contributions,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error: error.message });
  }
});

// ==================== PROTECTED ROUTES (require authentication) ====================

// CREATE new archive item
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.title || !req.body.type) {
      return res.status(400).json({ message: "Title and type are required" });
    }

    // Validate type
    const validTypes = ['badge', 'certificate', 'internship', 'contribution'];
    if (!validTypes.includes(req.body.type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    // Prepare skills array (handle if sent as string or array)
    let skills = [];
    if (req.body.skills) {
      if (typeof req.body.skills === 'string') {
        try {
          skills = JSON.parse(req.body.skills);
        } catch {
          skills = req.body.skills.split(',').map(s => s.trim());
        }
      } else if (Array.isArray(req.body.skills)) {
        skills = req.body.skills;
      }
    }

    const archiveItem = await Archive.create({
      title: req.body.title,
      type: req.body.type,
      issuer: req.body.issuer,
      event: req.body.event,
      role: req.body.role,
      category: req.body.category,
      duration: req.body.duration,
      mode: req.body.mode,
      status: req.body.status,
      skills: skills,
      image: req.file ? req.file.path : "",
      referenceId: req.body.referenceId,
    });

    res.status(201).json(archiveItem);
  } catch (error) {
    res.status(500).json({ message: "Error creating archive item", error: error.message });
  }
});

// UPDATE archive item
router.put("/:id", protect, upload.single("image"), async (req, res) => {
  try {
    const item = await Archive.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Prepare update data
    const updateData = {
      title: req.body.title,
      issuer: req.body.issuer,
      event: req.body.event,
      role: req.body.role,
      category: req.body.category,
      duration: req.body.duration,
      mode: req.body.mode,
      status: req.body.status,
    };

    // Handle skills update
    if (req.body.skills) {
      if (typeof req.body.skills === 'string') {
        try {
          updateData.skills = JSON.parse(req.body.skills);
        } catch {
          updateData.skills = req.body.skills.split(',').map(s => s.trim());
        }
      } else if (Array.isArray(req.body.skills)) {
        updateData.skills = req.body.skills;
      }
    }

    // Handle image update
    if (req.file) {
      updateData.image = req.file.path;
    }

    // Handle referenceId if provided
    if (req.body.referenceId) {
      updateData.referenceId = req.body.referenceId;
    }

    const updated = await Archive.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating archive item", error: error.message });
  }
});

// DELETE archive item
router.delete("/:id", protect, async (req, res) => {
  try {
    const item = await Archive.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    await Archive.findByIdAndDelete(req.params.id);
    res.json({ message: "Archive item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting archive item", error: error.message });
  }
});

// BULK CREATE (for migrating old data)
router.post("/bulk", protect, async (req, res) => {
  try {
    const items = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: "Expected an array of items" });
    }

    // Validate each item has required fields
    for (const item of items) {
      if (!item.title || !item.type) {
        return res.status(400).json({ 
          message: "Each item must have title and type",
          invalidItem: item 
        });
      }
    }

    const result = await Archive.insertMany(items);
    res.status(201).json({ 
      message: `Successfully created ${result.length} items`,
      items: result 
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating bulk items", error: error.message });
  }
});

// DELETE ALL (use with caution - maybe add an admin check)
router.delete("/bulk/delete-all", protect, async (req, res) => {
  try {
    // Optional: Add admin check here
    const result = await Archive.deleteMany({});
    res.json({ 
      message: `Successfully deleted ${result.deletedCount} items`,
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting all items", error: error.message });
  }
});

export default router;