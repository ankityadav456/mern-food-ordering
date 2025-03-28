import express from "express";
import { 
  getAllFoodItems, 
  addFoodItem, 
  updateFoodItem,  // <-- Added Update Food Item Controller
  deleteFoodItem 
} from "../controllers/foodController.js";

const router = express.Router();

router.get("/", getAllFoodItems); // ✅ Get all food items
router.post("/", addFoodItem); // ✅ Add food item (Admin Only)
router.put("/:id", updateFoodItem); // ✅ Update food item (Admin Only)  <-- New Update Route
router.delete("/:id", deleteFoodItem); // ✅ Delete food item (Admin Only)

export default router;
