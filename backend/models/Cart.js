// models/CartItem.js
import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodItem", // Make sure this matches your food item model
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
  },
  { _id: false } // Prevents MongoDB from auto-adding _id to each cart item
);

export default cartItemSchema;
