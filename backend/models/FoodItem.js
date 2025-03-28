import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ["Fast Food", "Beverages", "Dessert", "Vegetarian", "Non-Vegetarian"] // ✅ Allowed values
  },
  price: { type: Number, required: true },
  image: { type: String, required: true },
}, { timestamps: true });

const FoodItem = mongoose.model("FoodItem", foodSchema);
export default FoodItem;
