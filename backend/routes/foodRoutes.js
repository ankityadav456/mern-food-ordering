import express from "express";
import { 
  getAllFoodItems, 
  addFoodItem, 
  updateFoodItem,  // <-- Added Update Food Item Controller
  deleteFoodItem 
} from "../controllers/foodController.js";
import { uploadFoodImage } from "../middleware/uploadFoodImage.js";
const router = express.Router();

router.get("/", getAllFoodItems); //  Get all food items
router.post(
  "/",
  uploadFoodImage.single("image"),
  addFoodItem
);
router.put(
  "/:id",
  uploadFoodImage.single("image"),
  updateFoodItem
);
router.delete("/:id", deleteFoodItem); //  Delete food item (Admin Only)


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

export default router;
