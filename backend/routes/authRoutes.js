import {Router} from "express";
import {
  registerUser,
  loginUser,
    logoutUser,  
  getUserProfile,
  updateUserProfile,
  updateUserAvatar,
  updateAddress,
  deleteAddress,
  deleteAvatar
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadAvatar } from "../middleware/multer.js";

const authRouter = Router();

// Public
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", logoutUser); 

authRouter.get("/me", protect, getUserProfile);
authRouter.put("/update-profile", protect, updateUserProfile);
authRouter.put("/update-avatar", protect, uploadAvatar.single("avatar"), updateUserAvatar);
authRouter.put("/save-address", protect, updateAddress);
authRouter.delete("/delete-address", protect, deleteAddress);
authRouter.delete("/delete-avatar", protect, deleteAvatar);

export default authRouter;
