import Order from "../models/Order.js";
import User from "../models/User.js";
import FoodItem from "../models/FoodItem.js";

// ✅ Place a new order
export const placeOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    const userId = req.user.id; // Assuming user is set by auth middleware

    // Validate and prepare order items
    const orderItems = await Promise.all(
      items.map(async (item) => {
        const food = await FoodItem.findById(item.foodId._id || item.foodId); // Accept full object or ID
        if (!food) {
          throw new Error(`Food item ${item.foodId} not found`);
        }
        return {
          foodId: food._id,
          name: food.name,
          quantity: item.quantity,
          price: food.price,
        };
      })
    );

    // Calculate total manually to ensure correctness
    const calculatedTotal = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    if (calculatedTotal !== totalAmount) {
      return res.status(400).json({
        message: "Total amount mismatch. Please verify your cart.",
      });
    }

    // Create order with correct `user` field
    const order = await Order.create({
      user: userId, // ✅ fixed: use `user`, not `userId`
      items: orderItems,
      totalAmount: calculatedTotal,
      paymentStatus: "Paid",
    });

    // Push order reference to user document
    await User.findByIdAndUpdate(userId, { $push: { orders: order._id } });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Order Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get orders for a user using query param
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const orders = await Order.find({ user: userId })
      .populate({
        path: "items.foodId",
        select: "name price image",
      })
      .sort({ createdAt: -1 }); // Optional: latest orders first

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Get Orders Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
