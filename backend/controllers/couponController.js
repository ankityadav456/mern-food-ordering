import Coupon from "../models/Coupon.js";
import User from "../models/User.js";

//  Static coupons
const staticCoupons = [
  {
    code: "ANKIT100",
    discountType: "fixed",
    discountValue: 100,
    minOrderValue: 500,
    expiryDate: new Date("2026-12-31"),
    isActive: true,
  },
  {
    code: "YUMIGO50",
    discountType: "fixed",
    discountValue: 50,
    minOrderValue: 200,
    expiryDate: new Date("2025-12-31"),
    isActive: true,
  },
];

export const applyCoupon = async (req, res) => {
  try {
    // console.log(req.body);
    const { userId, code, cartTotal } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Coupon code is required." });
    }

    const upperCode = code.toUpperCase();

    let coupon = staticCoupons.find(
      (c) => c.code === upperCode && c.isActive
    );

    if (!coupon) {
      coupon = await Coupon.findOne({ code: upperCode, isActive: true });
    }

    if (!coupon) {
      return res.status(404).json({ message: "Invalid or expired coupon." });
    }

    if (coupon.expiryDate && new Date() > coupon.expiryDate) {
      return res.status(400).json({ message: "Coupon has expired." });
    }

    if (cartTotal < coupon.minOrderValue) {
      return res.status(400).json({
        message: `Minimum order value should be ₹${coupon.minOrderValue} to use this coupon.`,
      });
    }

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (cartTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    const finalTotal = Math.max(cartTotal - discount, 0);

    //  Store in user model
    await User.findByIdAndUpdate(userId, {
      appliedCoupon: {
        code: coupon.code,
        discountValue: discount,
        discountType: coupon.discountType,
      },
    });

    res.status(200).json({
      success: true,
      message: "Coupon applied successfully!",
      discount,
      finalTotal,
      appliedCoupon: coupon.code,
    });
  } catch (error) {
    console.error("Apply Coupon Error:", error);
    res.status(500).json({ message: "Server error while applying coupon." });
  }
};

//  Remove Coupon
export const removeCoupon = async (req, res) => {
  try {
    const { userId } = req.body;
    await User.findByIdAndUpdate(userId, { appliedCoupon: null });
    res.status(200).json({ success: true, message: "Coupon removed successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error removing coupon." });
  }
};
