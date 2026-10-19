import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized, no token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    if (user.status === "Blocked") {
      return res.status(403).json({
        success: false,
        isBlocked: true,
        message: "Your account has been blocked. You have been logged out.",
      });
    }

    req.user = user;

    // Keep user's lastActive and isOnline fresh (throttled to at most once every 60s)
    const now = Date.now();
    const lastActiveTime = user.lastActive ? new Date(user.lastActive).getTime() : 0;
    if (now - lastActiveTime > 60 * 1000 || !user.isOnline) {
      User.findByIdAndUpdate(user._id, {
        lastActive: new Date(now),
        isOnline: true,
      }).exec().catch(() => {});
    }

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    return res.status(401).json({
      message: "Unauthorized, invalid token",
    });
  }
};