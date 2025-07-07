import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  updateUserAvatar,
  updateAddress,
  deleteAddress,
  deleteAvatar,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadAvatar } from "../middleware/multer.js";

const router = express.Router();

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected
router.get("/me", protect, getUserProfile);
router.put("/update-profile", protect, updateUserProfile);            // ✅ Added protect
router.put("/update-avatar", protect, uploadAvatar.single("avatar"), updateUserAvatar);
router.put("/save-address", protect, updateAddress);
router.delete("/delete-address", protect, deleteAddress);
router.delete("/delete-avatar", protect, deleteAvatar);

export default router;
