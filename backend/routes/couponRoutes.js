import express from "express";
import { applyCoupon, removeCoupon } from "../controllers/couponController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/apply", protect, applyCoupon);
router.post("/remove", protect, removeCoupon);

export default router;
