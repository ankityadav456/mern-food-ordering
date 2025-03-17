import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Adjust path as needed

const protectAdmin = async (req, res, next) => {
  try {
    // ✅ Get token from headers
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized! No token provided." });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // ✅ Check if user is an admin
    if (!user.isAdmin) {
      return res.status(403).json({ message: "Access denied! Admins only." });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token!" });
  }
};

export default protectAdmin;
