import express from "express";
import { placeOrder, getUserOrders } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Place Order
router.post("/", protect, placeOrder);

// ✅ Get User Orders (query param)
router.get("/user-orders", protect, getUserOrders);

export default router;
