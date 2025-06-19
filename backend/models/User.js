// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import cartItemSchema from "./Cart.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    cart: [cartItemSchema],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
    address: { // ✅ Address field added
      fullName: { type: String },
      mobileNumber: { type: String },
      roomNumber: { type: String },
      street: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String }
    }
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

const User = mongoose.model("User", userSchema);
export default User;
