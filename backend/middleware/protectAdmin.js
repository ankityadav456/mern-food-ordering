import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protectAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized! No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

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
