import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getWishlist,
  toggleWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlistController.js";

const router = express.Router();

router.get("/", protect, getWishlist);
router.post("/toggle", protect, toggleWishlist);
router.post("/add", protect, addToWishlist);
router.delete("/:foodId", protect, removeFromWishlist);
router.delete("/", protect, clearWishlist);

export default router;
