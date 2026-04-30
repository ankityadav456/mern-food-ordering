import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
        console.log("All cookies:", req.cookies);
    console.log("Headers:", req.headers);
    console.log("Origin:", req.headers.origin);
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized, no token",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.id)
      .select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);

    return res.status(401).json({
      message: "Unauthorized, invalid token",
    });
  }
};