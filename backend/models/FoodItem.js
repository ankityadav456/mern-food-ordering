import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["Pizza", "Burger", "Chinese", "Chicken", "Biryani"],
    },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true },
);

const FoodItem = mongoose.model("FoodItem", foodSchema);
export default FoodItem;
