// routes/reservationRoutes.js
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import protectAdmin from "../middleware/protectAdmin.js";
import {
  createReservation,
  getMyReservations,
  getReservationDetails,
  cancelReservation,
  getAllReservations,
} from "../controllers/reservationController.js";

const router = express.Router();

// Optional auth middleware: attaches req.user if valid token exists, but doesn't block guests
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (user) {
        req.user = user;
      }
    }
  } catch (err) {
    // Silent ignore for optional auth
  }
  next();
};

// Public / Guest or Logged-in user routes
router.post("/", optionalAuth, createReservation);
router.get("/my", optionalAuth, getMyReservations);
router.get("/:id", optionalAuth, getReservationDetails);
router.patch("/:id/cancel", optionalAuth, cancelReservation);

// Admin routes
router.get("/admin/all", protectAdmin, getAllReservations);

export default router;
