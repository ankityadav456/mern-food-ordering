import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password"); // Attach user data (excluding password) to req

      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(401).json({ message: "Unauthorized, invalid token" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized, no token provided" });
  }
};
