// import express from "express";
// import protectAdmin from "../middleware/protectAdmin.js"; //  Import Admin Middleware

// const router = express.Router();

// //  Example Protected Admin Route
// router.get("/dashboard", protectAdmin, (req, res) => {
//   res.json({ message: "Welcome Admin! You have access to this route." });
// });

// export default router;


import express from "express";
import {
  getAllUsers,
  updateUser,
  toggleUserStatus,
  deleteUser,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

//  All admin routes are protected
router.get("/users", protect, getAllUsers);            // GET /api/admin/users
router.put("/users/:id", protect, updateUser);         // PUT /api/admin/users/:id
router.put("/users/:id/status", protect, toggleUserStatus); // PUT /api/admin/users/:id/status
router.delete("/users/:id", protect, deleteUser);      // DELETE /api/admin/users/:id

export default router;
