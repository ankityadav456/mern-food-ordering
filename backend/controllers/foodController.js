import FoodItem from "../models/FoodItem.js";

// @desc    Get all food items
// @route   GET /api/food
// @access  Public
export const getAllFoodItems = async (req, res) => {
  try {
    const foodItems = await FoodItem.find().lean();
    res.json(foodItems);
  } catch (error) {
    console.error("Error fetching food items:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Add a new food item (Admin Only)
// @route   POST /api/food
// @access  Admin
export const addFoodItem = async (req, res) => {
  try {
    const { name, category, price, image } = req.body;
    console.log(req.body)
    if (!name || !category || !price || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ message: "Price must be a positive number" });
    }

    const newFoodItem = new FoodItem({ name, category, price: Number(price), image });
    await newFoodItem.save();

    res.status(201).json({ message: "Food item added successfully", foodItem: newFoodItem });
  } catch (error) {
    console.error("Error adding food item:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update a food item (Admin Only)
// @route   PUT /api/food/:id
// @access  Admin
export const updateFoodItem = async (req, res) => {
  try {
    const { name, category, price, image } = req.body;
    const { id } = req.params;

    const foodItem = await FoodItem.findById(id);
    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    // Update fields only if provided
    if (name) foodItem.name = name;
    if (category) foodItem.category = category;
    if (price) {
      if (isNaN(price) || price <= 0) {
        return res.status(400).json({ message: "Price must be a positive number" });
      }
      foodItem.price = Number(price);
    }
    if (image) foodItem.image = image;

    await foodItem.save();

    res.json({ message: "Food item updated successfully", foodItem });
  } catch (error) {
    console.error("Error updating food item:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a food item (Admin Only)
// @route   DELETE /api/food/:id
// @access  Admin
export const deleteFoodItem = async (req, res) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id);

    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    await foodItem.deleteOne();

    res.json({ message: "Food item deleted successfully" });
  } catch (error) {
    console.error("Error deleting food item:", error);
    res.status(500).json({ message: "Server error" });
  }
};
