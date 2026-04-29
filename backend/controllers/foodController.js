import FoodItem from "../models/FoodItem.js";
import fs from "fs";
import path from "path";

export const getAllFoodItems = async (req, res) => {
  try {
    const foodItems = await FoodItem.find().lean();
    res.json(foodItems);
  } catch (error) {
    console.error("Error fetching food items:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addFoodItem = async (req, res) => {
  try {
    const { name, category, price, rating } = req.body;
console.log(req.file, name, category, price, rating);
    const imagePath = req.file
      ? `/uploads/food/${req.file.filename}`
      : null;

    if (!name || !category || !price || !imagePath) {
      return res.status(400).json({
        message: "All fields including image are required",
      });
    }

    if (isNaN(price) || price <= 0) {
      return res.status(400).json({
        message: "Price must be positive",
      });
    }

    const newFoodItem = new FoodItem({
      name,
      category,
      price: Number(price),
      image: imagePath,
      rating: rating || 0,
    });

    await newFoodItem.save();

    res.status(201).json({
      message: "Food item added successfully",
      foodItem: newFoodItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateFoodItem = async (req, res) => {
  try {
    const { name, category, price, rating } = req.body;
    const { id } = req.params;

    const foodItem = await FoodItem.findById(id);

    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    if (name) foodItem.name = name;
    if (category) foodItem.category = category;

    if (price) {
      if (isNaN(price) || price <= 0) {
        return res.status(400).json({
          message: "Price must be positive",
        });
      }
      foodItem.price = Number(price);
    }

    if (req.file) {
      foodItem.image = `/uploads/food/${req.file.filename}`;
    }

    if (rating !== undefined) {
      if (rating < 0 || rating > 5) {
        return res.status(400).json({
          message: "Rating must be between 0 and 5",
        });
      }
      foodItem.rating = Number(rating);
    }

    await foodItem.save();

    res.json({
      message: "Food item updated successfully",
      foodItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteFoodItem = async (req, res) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id);

    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    if (foodItem.image) {
      const imagePath = path.join(process.cwd(), foodItem.image);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await foodItem.deleteOne();

    res.json({ message: "Food item deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
