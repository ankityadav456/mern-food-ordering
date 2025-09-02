import { motion } from "framer-motion";
import { Star, Timer } from "lucide-react";
import { Button } from "@/components/ui/button"; // ShadCN button

const FoodCard = ({ item, theme, getItemQuantity, addLoadingId, handleAddToCart, setQuickViewItem }) => {
  return (
    <motion.div
      key={item._id}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`relative rounded-2xl overflow-hidden shadow-md border transition-all duration-300 flex flex-col
        ${getItemQuantity(item._id) > 0
          ? "border-[#FFD54F] shadow-[#FFD54F]/30"
          : theme === "dark"
            ? "bg-[#1E1E1E] border-[#2A2A2A] hover:border-[#FF5722] hover:shadow-lg hover:shadow-[#FF5722]/20"
            : "bg-white border-gray-200 hover:border-[#FF5722] hover:shadow-md hover:shadow-orange-200"
        }`}
    >
      {/* Cart Quantity Badge */}
      {getItemQuantity(item._id) > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 bg-[#FFD54F] text-black text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-md"
        >
          {getItemQuantity(item._id)}
        </motion.div>
      )}

      {/* Responsive Image */}
      <div className="w-full aspect-[4/3] overflow-hidden">
        <motion.img
          src={item.image}
          alt={item.name}
          whileHover={{ scale: 1.05 }}
          className="w-full h-full object-cover transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className={`text-lg font-bold truncate ${theme === "dark" ? "text-white" : "text-black"}`}>
          {item.name}
        </h3>
        <p className={`text-md font-semibold ${theme === "dark" ? "text-[#FFD54F]" : "text-[#FF5722]"}`}>
          ₹{item.price.toLocaleString("en-IN")}
        </p>
        <p
          className={`text-xs mt-1 font-semibold ${
            item.category === "Vegetarian"
              ? "text-green-500"
              : item.category === "Non-Vegetarian"
              ? "text-red-500"
              : "text-gray-500"
          }`}
        >
          {item.category}
        </p>

        {/* Rating & Delivery */}
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span>{item.rating || 4.5}</span>
          </div>
          <div className="flex items-center gap-1">
            <Timer className="w-4 h-4 text-orange-400" />
            <span>{item.deliveryTime || "25-35 mins"}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-4">
          <Button
            variant={theme === "dark" ? "secondary" : "outline"}
            className="flex-1 rounded-lg font-semibold"
            onClick={() => setQuickViewItem(item)}
          >
            Quick View
          </Button>

          <Button
            disabled={getItemQuantity(item._id) > 0 || addLoadingId === item._id}
            onClick={() => handleAddToCart(item)}
            className={`flex-1 rounded-lg font-semibold flex items-center justify-center transition-all duration-300 ${
              getItemQuantity(item._id) || addLoadingId === item._id
                ? "bg-gray-400 cursor-not-allowed text-white"
                : theme === "dark"
                ? "bg-gradient-to-r from-[#FF5722] to-[#FFD54F] text-black hover:opacity-90"
                : "bg-gradient-to-r from-[#FF5722] to-[#FFC107] text-white hover:opacity-90"
            }`}
          >
            {addLoadingId === item._id ? (
              <span className="loader w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
            ) : getItemQuantity(item._id) > 0 ? "In Cart" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default FoodCard;
