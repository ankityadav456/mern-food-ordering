import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { XCircle, CheckCircle } from "lucide-react";
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
        resetForm();
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
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  // Theme classes
  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-gray-900" : "bg-white";
  const textColor = isDark ? "text-gray-100" : "text-gray-900";
  const inputBg = isDark ? "bg-gray-800" : "bg-white";
  const inputBorder = isDark ? "border-gray-700" : "border-gray-300";
  const inputFocusRing = isDark ? "focus:ring-yellow-400" : "focus:ring-blue-400";
  const btnCancelBg = isDark ? "bg-gray-700" : "bg-gray-200";
  const btnCancelHover = isDark ? "hover:bg-gray-600" : "hover:bg-gray-300";
  const btnSubmitBg = isDark ? "bg-yellow-500" : "bg-blue-600";
  const btnSubmitHover = isDark ? "hover:bg-yellow-600" : "hover:bg-blue-700";
  const borderDashed = isDark ? "border-gray-600" : "border-gray-300";
  const uploadText = isDark ? "text-gray-400" : "text-gray-600";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className={`${bgColor} rounded-2xl shadow-2xl w-full max-w-lg relative flex flex-col max-h-[90vh]`}
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Header */}
            <div
              className={`sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b ${isDark ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"} `}
            >
              <h2 className={`text-lg font-semibold ${textColor}`}>
                {initialData ? "Edit Food Item" : "Add Food Item"}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                <X size={22} className={textColor} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="px-6 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-lg scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 flex-1">
              {/* Image Preview */}
              {previewImage ? (
                <motion.img
                  src={previewImage}
                  alt="Food Preview"
                  className="w-full h-40 sm:h-48 object-cover rounded-lg mb-4 shadow"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                />
              ) : (
                <div
                  className={`w-full h-40 sm:h-48 ${isDark ? "bg-gray-800" : "bg-gray-100"} flex items-center justify-center rounded-lg mb-4`}
                >
                  <ImageIcon size={48} className={uploadText} />
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
                    className={`w-full p-3 border ${inputBorder} rounded-lg ${inputBg} ${textColor} focus:ring-2 ${inputFocusRing} outline-none`}
                    required
                  />
                  <input
                    type="number"
                    name="price"
                    value={foodData.price}
                    onChange={handleChange}
                    placeholder="Price ($)"
                    className={`w-full p-3 border ${inputBorder} rounded-lg ${inputBg} ${textColor} focus:ring-2 ${inputFocusRing} outline-none`}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                {/* Upload Image */}
                <label className={`block text-sm font-medium ${textColor}`}>Upload Image</label>
                <div
                  className={`relative border-2 border-dashed ${borderDashed} rounded-lg p-6 text-center hover:${isDark ? "bg-gray-800" : "bg-gray-100"} transition cursor-pointer`}
                >
                  <Upload size={28} className={`mx-auto ${uploadText}`} />
                  <p className={`text-sm ${uploadText} mt-2`}>Click to upload</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                </div>

                {/* Category */}
                <select
                  name="category"
                  value={foodData.category}
                  onChange={handleChange}
                  className={`w-full p-3 border ${inputBorder} rounded-lg ${inputBg} ${textColor} focus:ring-2 ${inputFocusRing} outline-none`}
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
              </form>
            </div>

            {/* Sticky Footer */}
            <div
              className={`sticky bottom-0 z-10 flex justify-end gap-3 px-6 py-4 border-t ${isDark ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"} `}
            >
              <button
  onClick={handleClose}
  type="button"
  className={`flex items-center gap-2 px-5 py-2 rounded-lg font-medium transition
    ${theme === "dark"
      ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
    }`}
>
  <XCircle size={18} /> Cancel
</button>

<button
  onClick={handleSubmit}
  type="submit"
  className={`flex items-center gap-2 px-5 py-2 rounded-lg font-medium shadow-md transition
    ${theme === "dark"
      ? "bg-gradient-to-r from-[#FF5722] to-[#FFD54F] text-black hover:opacity-90"
      : "bg-gradient-to-r from-[#FF5722] to-[#FFC107] text-white hover:opacity-90"
    }`}
>
  <CheckCircle size={18} /> {initialData ? "Update" : "Add"}
</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FoodModal;
