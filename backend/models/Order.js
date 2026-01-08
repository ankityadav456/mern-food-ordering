// models/Order.js
import mongoose from "mongoose";

/* ---------------- ORDER ITEM ---------------- */
const orderItemSchema = new mongoose.Schema({
  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FoodItem",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

/* ---------------- ADDRESS ---------------- */
const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  roomNumber: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
});

/* ---------------- COUPON ---------------- */
const appliedCouponSchema = new mongoose.Schema({
  code: { type: String },
  discountType: {
    type: String,
    enum: ["fixed", "percentage"],
  },
  discount: { type: Number },
});

/* ---------------- ORDER ---------------- */
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    /* ---------- PRICE BREAKDOWN ---------- */
    cartTotal: {
      type: Number,
      required: true, // subtotal before coupon
    },

    discount: {
      type: Number,
      default: 0,
    },

    deliveryFee: {
      type: Number,
      default: 40,
    },

    totalAmount: {
      type: Number,
      required: true, // final payable
    },

    appliedCoupon: {
      type: appliedCouponSchema,
      default: null,
    },

    /* ---------- PAYMENT ---------- */
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Paid",
    },

    /* ---------- DELIVERY ---------- */
    deliveryAddress: {
      type: addressSchema,
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
