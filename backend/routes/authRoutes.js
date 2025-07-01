import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  updateUserAvatar,
  updateAddress,
  deleteAddress,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadAvatar } from "../middleware/multer.js"; // ✅ multer for avatar upload

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getUserProfile);
router.put("/update-profile", updateUserProfile);
router.put("/update-avatar", protect, uploadAvatar.single("avatar"), updateUserAvatar); // ✅ Avatar upload route
router.put("/save-address", protect, updateAddress);
router.delete("/delete-address", protect, deleteAddress);

export default router;
