import dotenv from "dotenv";
// dotenv.config({ path: "./.env" });
dotenv.config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "./config/cloudinary.js";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ====== Middleware ======

// 1. CORS first
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// 2. Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 3. Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ====== Routes ======
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/coupons", couponRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

// ====== Database ======
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });

// ====== Start Server ======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));