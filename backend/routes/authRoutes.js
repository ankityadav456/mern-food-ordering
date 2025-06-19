// routes/authRoutes.js
import express from "express";
import { registerUser, loginUser, getUserProfile, updateAddress, deleteAddress} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getUserProfile); // Protected Route
router.put("/save-address", protect, updateAddress); // ✅ New Address Route
router.delete("/delete-address", protect, deleteAddress);
export default router;
