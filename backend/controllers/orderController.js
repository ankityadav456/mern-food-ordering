// import Order from "../models/Order.js";
// import User from "../models/User.js";
// import FoodItem from "../models/FoodItem.js";

// ✅ Place a new order with delivery address
import Order from "../models/Order.js";
import User from "../models/User.js";
import FoodItem from "../models/FoodItem.js";
import Coupon from "../models/Coupon.js";
import { staticCoupons } from "../utils/staticCoupons.js";

export const placeOrder = async (req, res) => {
  try {
    const { items, couponCode, deliveryFee = 40, deliveryAddress } = req.body;
    const userId = req.user.id;

    /* ---------------- ADDRESS VALIDATION ---------------- */
    if (
      !deliveryAddress ||
      !deliveryAddress.fullName ||
      !deliveryAddress.mobileNumber ||
      !deliveryAddress.roomNumber ||
      !deliveryAddress.street ||
      !deliveryAddress.city ||
      !deliveryAddress.state ||
      !deliveryAddress.pincode
    ) {
      return res.status(400).json({ message: "All delivery address fields are required" });
    }

    /* ---------------- CART VALIDATION ---------------- */
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    /* ---------------- FETCH FOOD ITEMS ---------------- */
    const orderItems = await Promise.all(
      items.map(async (item) => {
        const food = await FoodItem.findById(item.foodId);
        if (!food) throw new Error("Food item not found");

        return {
          foodId: food._id,
          name: food.name,
          quantity: item.quantity,
          price: food.price,
        };
      })
    );

    /* ---------------- CALCULATE CART TOTAL ---------------- */
    let cartTotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    /* ---------------- APPLY COUPON (IF ANY) ---------------- */
    let discount = 0;
    let appliedCoupon = null;

    if (couponCode) {
      const upperCode = couponCode.toUpperCase();

      let coupon =
        staticCoupons.find(c => c.code === upperCode && c.isActive) ||
        await Coupon.findOne({ code: upperCode, isActive: true });

      if (!coupon) {
        return res.status(400).json({ message: "Invalid coupon" });
      }

      if (coupon.expiryDate && new Date() > coupon.expiryDate) {
        return res.status(400).json({ message: "Coupon expired" });
      }

      if (coupon.minOrderValue && cartTotal < coupon.minOrderValue) {
        return res.status(400).json({
          message: `Minimum order ₹${coupon.minOrderValue} required`
        });
      }

      if (coupon.discountType === "percentage") {
        discount = (cartTotal * coupon.discountValue) / 100;
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
          discount = coupon.maxDiscount;
        }
      } else {
        discount = coupon.discountValue;
      }

      appliedCoupon = {
        code: coupon.code,
        discount,
        discountType: coupon.discountType,
      };
    }

    /* ---------------- FINAL TOTAL ---------------- */
    const finalAmount = Math.max(cartTotal - discount + deliveryFee, 0);

    /* ---------------- CREATE ORDER ---------------- */
    const order = await Order.create({
      user: userId,
      items: orderItems,
      cartTotal,
      discount,
      deliveryFee,
      totalAmount: finalAmount,
      appliedCoupon,
      paymentStatus: "Paid",
      deliveryAddress,
    });

    /* ---------------- SAVE ORDER TO USER ---------------- */
    await User.findByIdAndUpdate(userId, {
      $push: { orders: order._id },
      $unset: { appliedCoupon: "" }, // clear applied coupon
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });

  } catch (error) {
    console.error("Order Error:", error.message);
    res.status(500).json({ message: "Server error" });
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
