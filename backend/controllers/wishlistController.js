import User from "../models/User.js";
import FoodItem from "../models/FoodItem.js";

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findById(req.user._id).populate("wishlist");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filter out any referenced items that might have been removed from FoodItem collection
    const validWishlist = (user.wishlist || []).filter((item) => item !== null);

    res.json({ wishlist: validWishlist });
  } catch (error) {
    console.error("Get Wishlist Error:", error);
    res.status(500).json({ message: "Server error fetching wishlist" });
  }
};

// @desc    Toggle item in user wishlist
// @route   POST /api/wishlist/toggle
// @access  Private
export const toggleWishlist = async (req, res) => {
  try {
    const { foodId } = req.body;
    if (!foodId) {
      return res.status(400).json({ message: "Food ID is required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const wishlist = user.wishlist || [];
    const isAlreadyWishlisted = wishlist.some(
      (id) => id?.toString() === foodId.toString()
    );

    let updatedUser;
    if (isAlreadyWishlisted) {
      updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { wishlist: foodId } },
        { new: true }
      ).populate("wishlist");

      return res.json({
        message: "Item removed from wishlist",
        isWishlisted: false,
        wishlist: (updatedUser.wishlist || []).filter((item) => item !== null),
      });
    } else {
      // Validate food item exists
      const foodItem = await FoodItem.findById(foodId);
      if (!foodItem) {
        return res.status(404).json({ message: "Food item not found" });
      }

      updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { wishlist: foodId } },
        { new: true }
      ).populate("wishlist");

      return res.json({
        message: "Item added to wishlist",
        isWishlisted: true,
        wishlist: (updatedUser.wishlist || []).filter((item) => item !== null),
      });
    }
  } catch (error) {
    console.error("Toggle Wishlist Error:", error);
    res.status(500).json({ message: "Server error updating wishlist" });
  }
};

// @desc    Add item to wishlist
// @route   POST /api/wishlist/add
// @access  Private
export const addToWishlist = async (req, res) => {
  try {
    const { foodId } = req.body;
    if (!foodId) {
      return res.status(400).json({ message: "Food ID is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { wishlist: foodId } },
      { new: true }
    ).populate("wishlist");

    res.json({
      message: "Item added to wishlist",
      wishlist: (updatedUser.wishlist || []).filter((item) => item !== null),
    });
  } catch (error) {
    console.error("Add Wishlist Error:", error);
    res.status(500).json({ message: "Server error adding to wishlist" });
  }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:foodId
// @access  Private
export const removeFromWishlist = async (req, res) => {
  try {
    const { foodId } = req.params;
    if (!foodId) {
      return res.status(400).json({ message: "Food ID is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { wishlist: foodId } },
      { new: true }
    ).populate("wishlist");

    res.json({
      message: "Item removed from wishlist",
      wishlist: (updatedUser.wishlist || []).filter((item) => item !== null),
    });
  } catch (error) {
    console.error("Remove Wishlist Error:", error);
    res.status(500).json({ message: "Server error removing from wishlist" });
  }
};

// @desc    Clear entire wishlist
// @route   DELETE /api/wishlist
// @access  Private
export const clearWishlist = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $set: { wishlist: [] } });
    res.json({ message: "Wishlist cleared", wishlist: [] });
  } catch (error) {
    console.error("Clear Wishlist Error:", error);
    res.status(500).json({ message: "Server error clearing wishlist" });
  }
};
