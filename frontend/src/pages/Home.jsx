import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import Logo from "../assets/Images/AppLogo.png"; // Add your actual logo path
import splash from "../assets/Images/SplashScreen.jpg"; // Add your actual logo path

const Home = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="py-5 min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center">
      {/* Logo & App Name */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center mb-8"
      >
        <img src={Logo} alt="Yumigo Logo" className="w-24 h-24 rounded-full border-4 border-[#FFD700] shadow-lg" />
        <h1 className="text-5xl font-extrabold text-[#FFD700] mt-4 tracking-wide">
          YUMIGO
        </h1>
        <p className="text-gray-400 text-lg mt-2 tracking-wide">
          Elevate Your Dining Experience 🍽️
        </p>
      </motion.div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-center justify-center text-center md:text-left p-10"
      >
        <div className="max-w-xl">
          <h2 className="text-4xl font-bold text-white mb-4">
            Indulge in <span className="text-[#FFD700]">Gourmet Delights</span>
          </h2>
          <p className="text-gray-300 mb-6">
            Experience the perfect blend of luxury and taste. Freshly made, carefully crafted, and delivered with love. 
          </p>
          <Link 
            to="/menu" 
            className="bg-[#FFD700] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#8B0000] hover:text-white transition-all duration-300 shadow-lg"
          >
            Explore Menu
          </Link>
        </div>

        {/* Hero Image */}
        <motion.img 
          src={splash}
          alt="Delicious Food" 
          className="w-96 mt-8 md:mt-0 rounded-2xl shadow-lg border-4 border-[#FFD700]"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>

      {/* Call-to-Action Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-12 text-center"
      >
        <p className="text-gray-400 text-lg">Taste the best, made just for you.</p>
        <Link to="/signup" className="mt-4 inline-block bg-[#8B0000] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#FFD700] hover:text-black transition-all duration-300 shadow-lg">
          Get Started
        </Link>
      </motion.div>
    </div>
  );
};

export default Home;
