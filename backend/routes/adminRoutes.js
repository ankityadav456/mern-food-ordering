import express from "express";
import protectAdmin from "../middleware/protectAdmin.js"; // ✅ Import Admin Middleware

const router = express.Router();

// ✅ Example Protected Admin Route
router.get("/dashboard", protectAdmin, (req, res) => {
  res.json({ message: "Welcome Admin! You have access to this route." });
});

export default router;
