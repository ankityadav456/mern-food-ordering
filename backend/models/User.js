import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import cartItemSchema from "./Cart.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    avatar: { type: String, default: "" },

    status: {
      type: String,
      enum: ["Active", "Blocked"],
      default: "Active",
    },

    cart: [cartItemSchema],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    address: {
      fullName: { type: String },
      mobileNumber: { type: String },
      roomNumber: { type: String },
      street: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
    },

    appliedCoupon: {
      code: { type: String, default: null },
      discountValue: { type: Number, default: 0 },
      discountType: { 
        type: String, 
        enum: ["percentage", "fixed", null],
        default: null 
      },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.virtual("cartTotal").get(function () {
  return this.cart.reduce((sum, item) => {
    const price = item.price || (item.foodId?.price ?? 0);
    return sum + price * item.quantity;
  }, 0);
});

userSchema.virtual("finalTotal").get(function () {
  let total = this.cartTotal;
  if (this.appliedCoupon?.discountValue) {
    total -= this.appliedCoupon.discountValue;
  }
  return total < 0 ? 0 : total;
});

const User = mongoose.model("User", userSchema);
export default User;
