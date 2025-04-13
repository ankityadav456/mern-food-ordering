import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const FoodItemCard = ({ item, addToCart }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="border border-yellow-600 rounded-xl p-4 shadow-lg bg-black text-white"
    >
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-36 object-cover rounded-md mb-3 border border-yellow-900"
      />

      <h2 className="text-lg font-bold text-yellow-400">{item.name}</h2>
      <p className="text-red-400 font-semibold">${item.price}</p>
      <p className="text-sm text-gray-400">Vegetarian</p>

      {/* ⭐ Dummy Rating */}
      <div className="flex items-center gap-1 text-yellow-500 mt-1">
        <Star size={16} fill="currentColor" /> <span className="text-sm">4.5</span>
      </div>

      <button
        onClick={() => addToCart(item)}
        className="mt-3 bg-gradient-to-r from-yellow-500 to-red-500 text-black font-semibold px-4 py-2 rounded-lg w-full hover:opacity-90 transition"
      >
        Add to Cart
      </button>
    </motion.div>
  );
};

FoodItemCard.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
  addToCart: PropTypes.func.isRequired,
};

export default FoodItemCard;
