// models/FoodItem.js
import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ["Pizza", "Burger", "Chinese", "Chicken", "Biryani"] // Allowed categories
  },
  price: { type: Number, required: true },
  image: { type: String, required: true },
}, { timestamps: true });

const FoodItem = mongoose.model("FoodItem", foodSchema);
export default FoodItem;
