import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* ======================================================
   TOKEN HELPERS
====================================================== */

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    console.error("Missing JWT_SECRET");
    return null;
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const sendTokenResponse = (res, user, message) => {
  const token = generateToken(user._id);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      address: user.address || null,
      avatar: user.avatar || null,
    },
  });
};

/* ======================================================
   AUTH
====================================================== */

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });

    sendTokenResponse(res, user, "User registered successfully");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: "Invalid credentials" });

    sendTokenResponse(res, user, "Login successful");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully" });
};

/* ======================================================
   PROFILE
====================================================== */

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "_id name email isAdmin address avatar"
    );

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   UPDATE PROFILE
====================================================== */

export const updateUserProfile = async (req, res) => {
  try {
    const { name, mobile } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, mobile },
      { new: true, select: "_id name mobile" }
    );

    res.json({
      success: true,
      message: "Profile updated",
      name: user.name,
      mobile: user.mobile,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   AVATAR
====================================================== */

export const updateUserAvatar = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No file uploaded" });

    const avatarPath = `/uploads/avatars/${req.file.filename}`;

    await User.findByIdAndUpdate(req.user.id, {
      avatar: avatarPath,
    });

    res.json({
      success: true,
      message: "Avatar updated",
      avatar: avatarPath,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteAvatar = async (req, res) => {
  try {
    const defaultAvatar = "/uploads/avatars/default-avatar.png";

    await User.findByIdAndUpdate(req.user.id, {
      avatar: defaultAvatar,
    });

    res.json({
      success: true,
      message: "Avatar removed",
      avatar: defaultAvatar,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete avatar" });
  }
};

/* ======================================================
   ADDRESS (🔥 FIXED PART)
====================================================== */

export const updateAddress = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      address: req.body,
    });

    // ✅ ONLY SEND UPDATED FIELD
    res.json({
      success: true,
      message: "Address updated successfully",
      address: req.body,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      address: null,
    });

    // ✅ NO USER OBJECT RETURNED
    res.json({
      success: true,
      message: "Address deleted successfully",
      address: null,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};