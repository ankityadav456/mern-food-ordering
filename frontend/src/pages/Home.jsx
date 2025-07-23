import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import promo1 from "../assets/Images/PB1.png";
import promo2 from "../assets/Images/PB2.png";
import promo3 from "../assets/Images/PB3.png";

const banners = [
  "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=1920&q=80",
  promo1, promo2, promo3
];

const Home = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

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
    <div className={`${isDark ? "bg-background-dark text-text-dark" : "bg-background-light text-text-light"} pt-4`}>
      {/* Animated Banner */}
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

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full transition ${currentSlide === idx ? "bg-white" : "bg-white/50"}`}
            ></button>
          ))}
        </div>

        {/* Prev/Next */}
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

      {/* How Yumigo Serves You */}
      <section className="py-12 text-center">
        <h2 className="text-3xl font-bold mb-10 text-secondary-light dark:text-secondary-dark">How Yumigo Serves You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          {[
            { title: "Automated Packaging", text: "100% sealed and hygienic packaging for freshness." },
            { title: "Packed with Love", text: "Every order is handled with utmost care and love." },
            { title: "Served Hot", text: "Delivered piping hot within 30 minutes!" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 + i * 0.2 }}
              className={`${isDark ? "bg-surface-dark" : "bg-surface-light"} p-6 rounded-xl shadow-xl`}
            >
              <h4 className="text-xl font-semibold mb-2 text-primary-light dark:text-primary-dark">{item.title}</h4>
              <p className="text-sm">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Explore Section */}
      <section
        className="py-12 mx-4 md:mx-10 text-center rounded-xl"
        style={{
          backgroundColor: isDark ? "#111" : "#FFF3CD",
          color: isDark ? "#FF7043" : "#1E1E1E",
        }}
      >
        <h2 className="text-3xl font-bold mb-4">
          Discover a World of Flavors — Explore Our Curated Food Categories!
        </h2>
        <p className="text-lg mb-6 font-medium px-3">
          From sizzling street food to gourmet meals, Yumigo brings you 3000+ dishes across multiple cuisines.
        </p>
        <Link
          to="/menu"
          className="mt-2 inline-block px-6 py-3 rounded-xl font-bold bg-primary-light dark:bg-primary-dark text-white 
                     hover:bg-opacity-90 transition"
        >
          Explore Menu
        </Link>
      </section>
    </div>
  );
};

export default Home;
