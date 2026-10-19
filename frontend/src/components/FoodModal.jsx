import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  X,
  Sparkles,
  Layers,
  IndianRupee,
  Star,
  Package,
  Utensils,
  Check,
  Image as ImageIcon,
} from "lucide-react";

const FoodModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  categories = ["Pizza", "Burger", "Chinese", "Chicken", "Biryani"],
  theme = "light",
}) => {
  const [foodData, setFoodData] = useState(() => ({
    name: initialData?.name || "",
    price: initialData?.price || "",
    rating: initialData?.rating || "4.5",
    category: initialData?.category || categories[0] || "Pizza",
    stock: initialData?.stock !== undefined ? initialData.stock : 10,
    image: null,
  }));

  /* ================= SYNC DATA ON OPEN ================= */
  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setFoodData({
        name: initialData.name || "",
        price: initialData.price || "",
        rating: initialData.rating || "4.5",
        category: initialData.category || categories[0] || "Pizza",
        stock: initialData.stock !== undefined ? initialData.stock : 10,
        image: null,
      });
    } else {
      setFoodData({
        name: "",
        price: "",
        rating: "4.5",
        category: categories[0] || "Pizza",
        stock: 10,
        image: null,
      });
    }
  }, [isOpen, initialData, categories]);

  const resetForm = () => {
    setFoodData({
      name: "",
      price: "",
      rating: "4.5",
      category: categories[0] || "Pizza",
      stock: 10,
      image: null,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFoodData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFoodData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", foodData.name);
    formData.append("price", foodData.price);
    formData.append("rating", foodData.rating || "4.5");
    formData.append("category", foodData.category || categories[0]);
    formData.append("stock", foodData.stock !== undefined ? foodData.stock : 10);

    if (foodData.image instanceof File) {
      formData.append("image", foodData.image);
    }

    onSubmit(formData);
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.98, opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#111118] border border-neutral-200/90 dark:border-neutral-800 shadow-2xl overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-850 bg-neutral-50/50 dark:bg-[#14141d]/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <Utensils className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-neutral-900 dark:text-white tracking-tight">
                  {initialData ? "Edit Dish Details" : "Add New Dish"}
                </h2>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Update inventory, culinary specs, and pricing
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[calc(85vh-120px)] overflow-y-auto">
            
            {/* Dish Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1.5">
                Dish Name *
              </label>
              <input
                type="text"
                name="name"
                value={foodData.name}
                onChange={handleChange}
                placeholder="e.g. Artisanal Paneer Tikka Makhani"
                required
                className="w-full px-3.5 py-2.5 rounded-xl text-sm font-medium bg-neutral-50 dark:bg-[#171722] border border-neutral-200 dark:border-neutral-750 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all"
              />
            </div>

            {/* Price & Stock in 2 Columns */}
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-orange-500" />
                  <span>Price (₹) *</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={foodData.price}
                  onChange={handleChange}
                  placeholder="349"
                  required
                  min="1"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-neutral-50 dark:bg-[#171722] border border-neutral-200 dark:border-neutral-750 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all"
                />
              </div>

              <div>
                <label className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1.5">
                  <Package className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Stock Left *</span>
                </label>
                <input
                  type="number"
                  name="stock"
                  value={foodData.stock}
                  onChange={handleChange}
                  placeholder="10"
                  required
                  min="0"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-neutral-50 dark:bg-[#171722] border border-neutral-200 dark:border-neutral-750 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all"
                />
              </div>
            </div>

            {/* Category & Rating */}
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1.5">
                  <Layers className="w-3.5 h-3.5 text-orange-500" />
                  <span>Category *</span>
                </label>
                <select
                  name="category"
                  value={foodData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm font-medium bg-neutral-50 dark:bg-[#171722] border border-neutral-200 dark:border-neutral-750 text-neutral-900 dark:text-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Rating (0–5)</span>
                </label>
                <input
                  type="text"
                  name="rating"
                  value={foodData.rating}
                  onChange={handleChange}
                  placeholder="4.8"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm font-medium bg-neutral-50 dark:bg-[#171722] border border-neutral-200 dark:border-neutral-750 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all"
                />
              </div>
            </div>

            {/* Food Photo Upload Area (Clean, no image preview flicker) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-1.5">
                Food Photography {initialData ? "(Optional to change)" : "*"}
              </label>

              {foodData.image instanceof File ? (
                <div className="rounded-2xl border border-neutral-200 dark:border-neutral-750 bg-neutral-50 dark:bg-[#171722] p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                        {foodData.image.name}
                      </p>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        {(foodData.image.size / 1024).toFixed(1)} KB &bull; Ready to save
                      </p>
                    </div>
                  </div>

                  <label className="px-3 py-1.5 rounded-xl text-xs font-bold text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-orange-500 transition-colors cursor-pointer shrink-0">
                    Replace
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <label className="relative border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-orange-500 dark:hover:border-orange-500 rounded-2xl p-4 text-center cursor-pointer flex flex-col items-center justify-center transition-all bg-neutral-50/50 dark:bg-[#151520]/50 group">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    {initialData ? "Upload new photo to replace current image" : "Click to select dish photo"}
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">
                    {initialData ? "Optional &bull; PNG / JPG supported" : "Required &bull; PNG / JPG supported"}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required={!initialData}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Footer Action Buttons */}
            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-850 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:shadow-md hover:shadow-orange-500/20 active:scale-95 transition-all cursor-pointer shadow-xs"
              >
                {initialData ? "Save Changes" : "Add to Kitchen"}
              </button>
            </div>

          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FoodModal;