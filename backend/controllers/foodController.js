import FoodItem from "../models/FoodItem.js";

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
    const { name, category, price, image, rating } = req.body;
    // console.log(req.body)
    if (!name || !category || !price || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (isNaN(price) || price <= 0) {
      return res
        .status(400)
        .json({ message: "Price must be a positive number" });
    }

    if (rating && (rating < 0 || rating > 5)) {
      return res
        .status(400)
        .json({ message: "Rating must be between 0 and 5" });
    }

    const newFoodItem = new FoodItem({
      name,
      category,
      price: Number(price),
      image,
      rating: rating || 0,
    });

    await newFoodItem.save();
    res.status(201).json({
      message: "Food item added successfully",
      foodItem: newFoodItem,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateFoodItem = async (req, res) => {
  try {
    const { name, category, price, image, rating } = req.body;
    const { id } = req.params;

    const foodItem = await FoodItem.findById(id);
    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    if (name) foodItem.name = name;
    if (category) foodItem.category = category;
    if (price) {
      if (isNaN(price) || price <= 0) {
        return res
          .status(400)
          .json({ message: "Price must be a positive number" });
      }
      foodItem.price = Number(price);
    }
    if (image) foodItem.image = image;
    if (rating !== undefined) {
      if (rating < 0 || rating > 5) {
        return res
          .status(400)
          .json({ message: "Rating must be between 0 and 5" });
      }
      foodItem.rating = Number(rating);
    }

    await foodItem.save();

    res.json({ message: "Food item updated successfully", foodItem });
  } catch (error) {
    console.error("Error updating food item:", error);
    res.status(500).json({ message: "Server error" });
  }
};

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
