import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import User from "../models/User.js";

// Generate JWT Token
const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    console.error("Missing JWT_SECRET in environment variables");
    return null;
  }
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    if (!user) {
      return res.status(400).json({ message: "Invalid user data" });
    }

    const token = generateToken(user._id);
    if (!token) {
      return res.status(500).json({ message: "Token generation failed" });
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        address: user.address || null,
        avatar: user.avatar || null,
      },
      token,
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Both email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);
    if (!token) {
      return res.status(500).json({ message: "Token generation failed" });
    }

    res.json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        address: user.address || null,
        avatar: user.avatar || null,
      },
      token,
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        address: user.address || null,
        avatar: user.avatar || null,
      },
    });
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Profile
export const updateUserProfile = async (req, res) => {
  try {
    const { userId, name, mobile, address } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.mobile = mobile || user.mobile;
    user.address = address || user.address;

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUser: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        mobile: updatedUser.mobile || null,
        isAdmin: updatedUser.isAdmin,
        address: updatedUser.address || null,
        avatar: updatedUser.avatar || null,
      },
    });
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Avatar
export const updateUserAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    // console.log(user)
    if (req.file) {
      const avatarPath = `/uploads/avatars/${req.file.filename}`;
      user.avatar = avatarPath;
      await user.save();
      res.json({ success: true,
         message: "Avatar updated successfully",
         avatar: avatarPath });
    } else {
      res.status(400).json({ message: "No file uploaded" });
    }
  } catch (error) {
    console.error("Error in updateUserAvatar:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Address
export const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.address = req.body;
    await user.save();

    res.json({
      success: true,
      message: "Address updated successfully",
      address: user.address,
    });
  } catch (error) {
    console.error("Error in updateAddress:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Address
export const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.address = null;
    await user.save();

    res.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteAddress:", error);
    res.status(500).json({ message: "Server error" });
  }
};
