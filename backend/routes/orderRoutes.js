import express from "express";
import {
  placeOrder,
  getUserOrders,
  getOrderById,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Place Order
router.post("/", protect, placeOrder);

// Get User Orders (query param)
router.get("/user-orders", protect, getUserOrders);

// Get Single Order By ID for Tracking
router.get("/:orderId", protect, getOrderById);

export default router;
