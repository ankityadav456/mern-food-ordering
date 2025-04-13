// routes/cartRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

// Protect routes using middleware
router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.put("/:foodId", protect, updateCartItemQuantity);
router.delete("/:foodId", protect, removeFromCart);
router.delete("/", protect, clearCart);

export default router;
