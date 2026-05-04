import FoodItem from "../models/FoodItem.js";
import cloudinary from "../config/cloudinary.js";

/* ===================================================
   GET ALL FOOD ITEMS
=================================================== */
export const getAllFoodItems = async (req, res) => {
  try {
    const foodItems = await FoodItem.find().lean();
    res.json(foodItems);
  } catch (error) {
    console.error("Error fetching food items:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===================================================
   ADD FOOD ITEM
=================================================== */
export const addFoodItem = async (req, res) => {
  try {
    const { name, price, rating, category } = req.body;

    // ✅ image required
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Food image is required",
      });
    }

    const newFood = await FoodItem.create({
      name,
      price,
      rating,
      category,
      image: req.file.path, // ✅ Cloudinary URL
      imagePublicId: req.file.filename, // needed for delete/update
    });

    res.status(201).json({
      success: true,
      message: "Food item added successfully",
      foodItem: newFood,
    });
  } catch (error) {
    console.error("ADD FOOD ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add food item",
    });
  }
};

/* ===================================================
   UPDATE FOOD ITEM
=================================================== */
export const updateFoodItem = async (req, res) => {
  try {
    const { id } = req.params;

    const food = await FoodItem.findById(id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
      });
    }

    const { name, price, rating, category } = req.body;

    /* ===== IF NEW IMAGE UPLOADED ===== */
    if (req.file) {
      // delete old cloudinary image
      if (food.imagePublicId) {
        await cloudinary.uploader.destroy(food.imagePublicId);
      }

      food.image = req.file.path;
      food.imagePublicId = req.file.filename;
    }

    // update fields
    food.name = name || food.name;
    food.price = price || food.price;
    food.rating = rating || food.rating;
    food.category = category || food.category;

    await food.save();

    res.status(200).json({
      success: true,
      message: "Food item updated successfully",
      foodItem: food,
    });
  } catch (error) {
    console.error("UPDATE FOOD ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update food item",
    });
  }
};

/* ===================================================
   DELETE FOOD ITEM
=================================================== */
export const deleteFoodItem = async (req, res) => {
  try {
    const { id } = req.params;

    const food = await FoodItem.findById(id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
      });
    }

    // ✅ delete image from cloudinary
    if (food.imagePublicId) {
      await cloudinary.uploader.destroy(food.imagePublicId);
    }

    await FoodItem.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Food item deleted successfully",
    });
  } catch (error) {
    console.error("DELETE FOOD ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete food item",
    });
  }
};