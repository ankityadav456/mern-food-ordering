import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload, X, Image as ImageIcon } from "lucide-react";

const FoodModal = ({ isOpen, onClose, onSubmit, initialData, categories, theme = "light" }) => {
  const [foodData, setFoodData] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
  });

  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFoodData(initialData);
        setPreviewImage(initialData.image || "");
      } else {
        resetForm(); // Reset form when opening a fresh modal
      }
    }
  }, [isOpen, initialData]);

  const resetForm = () => {
    setFoodData({ name: "", price: "", image: "", category: "" });
    setPreviewImage("");
  };

  const handleChange = (e) => {
    setFoodData({ ...foodData, [e.target.name]: e.target.value });
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
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm(); // Reset values when closing the modal
    onClose();
  };

  if (!isOpen) return null;

  // Dark/light mode colors
  const bgColor = theme === "dark" ? "bg-gray-900" : "bg-white";
  const textColor = theme === "dark" ? "text-gray-100" : "text-gray-900";
  const inputBg = theme === "dark" ? "bg-gray-800" : "bg-white";
  const inputBorder = theme === "dark" ? "border-gray-700" : "border-gray-300";
  const inputFocusRing = theme === "dark" ? "focus:ring-yellow-400" : "focus:ring-blue-300";
  const btnCancelBg = theme === "dark" ? "bg-gray-700" : "bg-gray-400";
  const btnCancelHover = theme === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-500";
  const btnSubmitBg = theme === "dark" ? "bg-yellow-500" : "bg-blue-600";
  const btnSubmitHover = theme === "dark" ? "hover:bg-yellow-600" : "hover:bg-blue-700";
  const borderDashed = theme === "dark" ? "border-gray-600" : "border-gray-300";
  const uploadText = theme === "dark" ? "text-gray-400" : "text-gray-600";

  return (
    <motion.div
      className={`fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex items-center justify-center p-4 z-50`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleClose} // Close modal on outside click
    >
      <motion.div
        className={`${bgColor} p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-lg sm:max-w-md relative max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-yellow-400 scrollbar-track-transparent`}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className={`absolute top-4 right-4 ${textColor} hover:${theme === "dark" ? "text-yellow-400" : "text-blue-600"} transition`}
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <h2 className={`text-2xl font-semibold mb-6 text-center ${textColor}`}>
          {initialData ? "Edit Food Item" : "Add Food Item"}
        </h2>

        {/* Image Preview */}
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
          <div
            className={`w-full h-40 sm:h-48 ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"} flex items-center justify-center rounded-lg mb-4`}
          >
            <ImageIcon size={50} className={uploadText} />
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={foodData.name}
              onChange={handleChange}
              placeholder="Food Name"
              className={`w-full p-3 border ${inputBorder} rounded-lg shadow-sm ${inputBg} ${textColor} focus:ring-2 ${inputFocusRing} outline-none`}
              required
              autoComplete="off"
            />
            <input
              type="number"
              name="price"
              value={foodData.price}
              onChange={handleChange}
              placeholder="Price ($)"
              className={`w-full p-3 border ${inputBorder} rounded-lg shadow-sm ${inputBg} ${textColor} focus:ring-2 ${inputFocusRing} outline-none`}
              step="0.01"
              required
              autoComplete="off"
              min="0"
            />
          </div>

          {/* Upload Image */}
          <label className={`block text-sm font-medium ${textColor}`}>Upload Image</label>
          <div
            className={`relative border-2 border-dashed ${borderDashed} rounded-lg p-6 text-center hover:${theme === "dark" ? "bg-gray-700" : "bg-gray-100"} transition cursor-pointer`}
          >
            <Upload size={30} className={`mx-auto ${uploadText}`} />
            <p className={`text-sm ${uploadText} mt-2`}>Click to upload</p>
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
              aria-label="Upload food image"
            />
          </div>

          {/* Category Selection */}
          <select
            name="category"
            value={foodData.category}
            onChange={handleChange}
            className={`w-full p-3 border ${inputBorder} rounded-lg shadow-sm ${inputBg} ${textColor} focus:ring-2 ${inputFocusRing} outline-none`}
            required
          >
            <option value="" disabled>
              Select Category
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between mt-4 gap-3">
            <button
              type="button"
              onClick={handleClose}
              className={`${btnCancelBg} text-white rounded-lg px-4 py-2 w-full sm:w-auto hover:${btnCancelHover} transition`}
            >
              ❌ Cancel
            </button>
            <button
              type="submit"
              className={`${btnSubmitBg} text-white rounded-lg px-4 py-2 w-full sm:w-auto hover:${btnSubmitHover} transition`}
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
