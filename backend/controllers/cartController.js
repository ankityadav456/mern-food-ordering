import User from "../models/User.js";
import FoodItem from "../models/FoodItem.js";

// 📌 Get Cart Items
export const getCart = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const user = await User.findById(req.user._id).populate("cart.foodId");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ cart: user.cart });
  } catch (error) {
    console.error("Get Cart Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// 📌 Add Item to Cart
export const addToCart = async (req, res) => {
  try {
    const { foodId } = req.body;
    if (!foodId) {
      return res.status(400).json({ message: "Food ID is required" });
    }

    const foodExists = await FoodItem.findById(foodId);
    if (!foodExists) {
      return res.status(404).json({ message: "Food item not found" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const itemIndex = user.cart.findIndex(
      (item) => item.foodId.toString() === foodId
    );

    if (itemIndex > -1) {
      user.cart[itemIndex].quantity += 1;
    } else {
      user.cart.push({ foodId, quantity: 1 });
    }

    await user.save();
    await user.populate("cart.foodId");
    res.status(200).json({ message: "Item added to cart", cart: user.cart });
  } catch (error) {
    console.error("Add to Cart Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 Update Quantity
export const updateCartItemQuantity = async (req, res) => {
  try {
    const { foodId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const item = user.cart.find((item) => item.foodId.toString() === foodId);

    if (item) {
      item.quantity = quantity;
      await user.save();
      await user.populate("cart.foodId");
      res.json({ message: "Quantity updated", cart: user.cart });
    } else {
      res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    console.error("Update Cart Quantity Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 Remove Item
export const removeFromCart = async (req, res) => {
  try {
    const { foodId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cart = user.cart.filter((item) => item.foodId.toString() !== foodId);
    await user.save();
    await user.populate("cart.foodId");
    res.json({ message: "Item removed from cart", cart: user.cart });
  } catch (error) {
    console.error("Remove From Cart Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 Clear Cart
export const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cart = [];
    await user.save();
    res.json({ message: "Cart cleared", cart: [] });
  } catch (error) {
    console.error("Clear Cart Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
