import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { ChevronDown, LogOut } from "lucide-react";

const Home = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDF6EC] text-gray-900">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-center justify-center text-center md:text-left p-10"
      >
        <div className="max-w-xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Make the Smart <span className="text-green-600">FOOD CHOICE</span></h2>
          <p className="text-gray-700 mb-6">Enjoy delicious and healthy meals made with love and fresh ingredients. Order now and satisfy your cravings!</p>
          <Link to="/menu" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">Explore Menu</Link>
        </div>
        <img src="/frontend/src/assets/Images/food-frame-with-asian-dish.jpg" alt="Food" className="w-96 mt-8 md:mt-0" />
      </motion.div>
    </div>
  );
};

export default Home;
