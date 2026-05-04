// middleware/uploadFoodImage.js

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "yumigo-food",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

export const uploadFoodImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});