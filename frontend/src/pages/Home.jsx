import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Replace with your actual images
import promo1 from "../assets/Images/PB1.png";
import promo2 from "../assets/Images/PB2.png";
import promo3 from "../assets/Images/PB3.png";

const banners = [promo1, promo2, promo3];

const Home = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const gold = "#B8860B";
  const red = "#D72638";
  const bgGold = "#eac54969";

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`${isDark ? "bg-[#0d0d0d] text-white" : "bg-[#FAF9F6] text-black"} pt-4`}>
      {/* Modern Animated Banner Slider */}
      <div className="relative w-full max-w-6xl mx-auto h-[200px] md:h-[300px] lg:h-[350px] overflow-hidden rounded-2xl">
  <AnimatePresence mode="wait">
    <motion.div
      key={currentSlide}
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 w-full h-full mt-4"
    >
      <img
        src={banners[currentSlide]}
        alt={`Slide ${currentSlide + 1}`}
        className="w-full h-full object-cover rounded-2xl"
      />
    </motion.div>
  </AnimatePresence>

  {/* Slide Indicators */}
  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
    {banners.map((_, idx) => (
      <button
        key={idx}
        onClick={() => setCurrentSlide(idx)}
        className={`w-3 h-3 rounded-full transition ${currentSlide === idx ? "bg-white" : "bg-white/50"}`}
      ></button>
    ))}
  </div>

  {/* Navigation Buttons */}
  <button
    onClick={prevSlide}
    className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/60 text-white p-2 md:p-3 rounded-full z-10 hover:scale-110 transition"
  >
    <FaArrowLeft />
  </button>
  <button
    onClick={nextSlide}
    className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/60 text-white p-2 md:p-3 rounded-full z-10 hover:scale-110 transition"
  >
    <FaArrowRight />
  </button>
</div>


      {/* How We Serve */}
      <section className="py-12 text-center">
        <h2 className="text-3xl font-bold mb-10" style={{ color: red }}>How Yumigo Serves You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`${isDark ? "bg-[#1a1a1a]" : "bg-gray-100"} p-6 rounded-xl shadow-xl`}
          >
            <h4 className="text-xl font-semibold mb-2" style={{ color: gold }}>Automated Packaging</h4>
            <p className="text-sm">100% sealed and hygienic packaging for freshness.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className={`${isDark ? "bg-[#1a1a1a]" : "bg-gray-100"} p-6 rounded-xl shadow-xl`}
          >
            <h4 className="text-xl font-semibold mb-2" style={{ color: gold }}>Packed with Love</h4>
            <p className="text-sm">Every order is handled with utmost care and love.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className={`${isDark ? "bg-[#1a1a1a]" : "bg-gray-100"} p-6 rounded-xl shadow-xl`}
          >
            <h4 className="text-xl font-semibold mb-2" style={{ color: gold }}>Served Hot</h4>
            <p className="text-sm">Delivered piping hot within 30 minutes!</p>
          </motion.div>
        </div>
      </section>

      {/* Offers Section */}
      <section className={`${isDark ? "bg-[#1a1a1a]" : "bg-yellow-50"} py-12`}>
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-6">
          <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-tr from-yellow-400 to-yellow-200 rounded-xl p-6 text-center shadow-md">
            <h3 className="text-xl font-bold mb-2">Buy 2 Get 1 Free</h3>
            <p className="mb-2">Exclusive pizza deal</p>
            <span className="font-bold text-2xl">₹28</span>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-tr from-red-300 to-red-100 rounded-xl p-6 text-center shadow-md">
            <h3 className="text-xl font-bold mb-2">Save 20%</h3>
            <p>Spicy combos only</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="bg-gradient-to-tr from-orange-300 to-orange-100 rounded-xl p-6 text-center shadow-md">
            <h3 className="text-xl font-bold mb-2">₹12 Off</h3>
            <p>Wraps & tacos combo</p>
          </motion.div>
        </div>
      </section>

      {/* Explore & CTA */}
      <section className="py-12 text-center rounded-xl" style={{ backgroundColor: isDark ? "#111" : bgGold, color: isDark ? gold : "#111" }}>
        <h2 className="text-3xl font-bold mb-4">
          Discover a World of Flavors — Explore Our Curated Food Categories!
        </h2>
        <p className="text-lg mb-6 font-medium">
          From sizzling street food to gourmet meals, Yumigo brings you 3000+ dishes across multiple cuisines.
        </p>
        <Link
          to="/menu"
          className="mt-2 inline-block px-6 py-3 rounded-xl font-bold bg-black text-white hover:bg-opacity-80 transition"
        >
          Explore Menu
        </Link>
      </section>

    </div>
  );
};

export default Home;
