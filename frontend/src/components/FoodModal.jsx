import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, X, Image as ImageIcon } from "lucide-react";

const FoodModal = ({ isOpen, onClose, onSubmit, initialData, categories }) => {
  const [foodData, setFoodData] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
  });

  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (initialData) {
      setFoodData(initialData);
      setPreviewImage(initialData.image || "");
    } else {
      setFoodData({ name: "", price: "", image: "", category: "" });
      setPreviewImage("");
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFoodData({ ...foodData, [e.target.name]: e.target.value });
    if (e.target.name === "image") {
      setPreviewImage(e.target.value);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFoodData({ ...foodData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(foodData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white p-6 md:p-8 rounded-2xl shadow-lg w-full max-w-lg sm:max-w-md relative max-h-[90vh] overflow-y-auto"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {initialData ? "Edit Food Item" : "Add Food Item"}
        </h2>

        {/* Responsive Image Preview */}
        {previewImage ? (
          <motion.img
            src={previewImage}
            alt="Food Preview"
            className="w-full h-40 sm:h-48 object-cover rounded-lg mb-4 shadow-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
          />
        ) : (
          <div className="w-full h-40 sm:h-48 bg-gray-100 flex items-center justify-center rounded-lg mb-4">
            <ImageIcon size={50} className="text-gray-400" />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={foodData.name}
              onChange={handleChange}
              placeholder="Food Name"
              className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-200"
              required
            />
            <input
              type="number"
              name="price"
              value={foodData.price}
              onChange={handleChange}
              placeholder="Price ($)"
              className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-200"
              step="0.01"
              required
            />
          </div>

          {/* Modern File Upload UI */}
          <label className="block text-sm font-medium text-gray-700">Upload Image</label>
          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer">
            <Upload size={30} className="mx-auto text-gray-400" />
            <p className="text-sm text-gray-600 mt-2">Click to upload</p>
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
          </div>

          {/* Category Dropdown */}
          <select
            name="category"
            value={foodData.category}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-200"
            required
          >
            <option value="" disabled>Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-between mt-4 gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="w-full sm:w-auto px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
            >
              ❌ Cancel
            </button>
            <button 
              type="submit" 
              className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              ✅ {initialData ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default FoodModal;
