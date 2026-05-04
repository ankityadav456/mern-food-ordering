import User from "../models/User.js";
import FoodItem from "../models/FoodItem.js";

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


export const addToCart = async (req, res) => {
  try {
    const { foodId } = req.body;

    if (!foodId)
      return res.status(400).json({ message: "Food ID required" });

    const user = await User.findById(req.user._id);

    const itemIndex = user.cart.findIndex(
      (item) => item.foodId.toString() === foodId
    );

    if (itemIndex > -1) {
      user.cart[itemIndex].quantity += 1;
    } else {
      user.cart.push({ foodId, quantity: 1 });
    }

    await user.save();

    res.json({ message: "Item added to cart" });
  } catch (error) {
    console.error("Add To Cart Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateCartItemQuantity = async (req, res) => {
  try {
    const { foodId } = req.params;
    const { quantity } = req.body;
    if (quantity < 1)
      return res.status(400).json({ message: "Invalid quantity" });

    await User.updateOne(
      {
        _id: req.user._id,
        "cart.foodId": foodId,
      },
      {
        $set: { "cart.$.quantity": quantity },
      }
    );

    res.json({ message: "Quantity updated" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { foodId } = req.params;

    const user = await User.findById(req.user._id);

    user.cart = user.cart.filter(
      (item) => item.foodId.toString() !== foodId
    );

    await user.save();

    res.json({ message: "Item removed" });
  } catch (error) {
    console.error("Remove Cart Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

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
