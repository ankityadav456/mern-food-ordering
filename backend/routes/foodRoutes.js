import express from "express";
import {
  getAllFoodItems,
  getFoodItemById,
  addFoodItem,
  updateFoodItem,
  deleteFoodItem,
} from "../controllers/foodController.js";

import { uploadFoodImage } from "../middleware/uploadFoodImage.js";
import FoodItem from "../models/FoodItem.js"; // ✅ Needed for fix-rating

const router = express.Router();

/* ================= GET ALL ================= */
router.get("/", getAllFoodItems);

/* ================= FIX RATING (UTILITY ROUTE) ================= */
router.get("/fix-rating", async (req, res) => {
  try {
    const result = await FoodItem.updateMany(
      { rating: { $exists: false } },
      { $set: { rating: 4.2 } }
    );

    res.json({
      message: "Ratings added successfully",
      modified: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ================= INIT STOCK (DEFAULT 10 FOR EXISTING ITEMS) ================= */
router.get("/init-stock", async (req, res) => {
  try {
    const result = await FoodItem.updateMany(
      { $or: [{ stock: { $exists: false } }, { stock: null }] },
      { $set: { stock: 10 } }
    );

    res.json({
      success: true,
      message: "Default 10 stock initialized for existing food items",
      modified: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/* ================= GET SINGLE ================= */
router.get("/:id", getFoodItemById);

/* ================= ADD FOOD ================= */
router.post(
  "/",
  uploadFoodImage.single("image"), // Cloudinary upload
  addFoodItem
);

/* ================= UPDATE FOOD ================= */
router.put(
  "/:id",
  uploadFoodImage.single("image"), // optional new image
  updateFoodItem
);

/* ================= DELETE FOOD ================= */
router.delete("/:id", deleteFoodItem);

export default router;