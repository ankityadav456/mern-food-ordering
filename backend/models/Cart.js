import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodItem",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
  },
  { _id: false }
);

export default cartItemSchema;
