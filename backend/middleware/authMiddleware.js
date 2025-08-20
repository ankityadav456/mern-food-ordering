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
      console.log("✅ Received token:", token); // Debugging

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Decoded token:", decoded);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        console.log("❌ User not found in DB");
        return res.status(401).json({ message: "User not found" });
      }

      return next();
    } catch (error) {
      console.error("❌ Token verification failed:", error.message);
      return res.status(401).json({ message: "Unauthorized, invalid token" });
    }
  }

  console.warn("❌ No token provided in request headers");
  return res.status(401).json({ message: "Unauthorized, no token provided" });
};
