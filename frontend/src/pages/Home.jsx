import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Pizza,
  Drumstick,
  Salad,
  IceCream,
  Coffee,
  Soup,
} from "lucide-react"; // Top of file

import promo1 from "../assets/Images/PB1.png";
import promo2 from "../assets/Images/PB4.png";
import promo3 from "../assets/Images/PB3.png";

const banners = [
  "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1920&q=80",
  promo1,
  promo2,
  promo3,
];

const features = [
  {
    title: "Automated Packaging",
    text: "100% sealed and hygienic packaging for freshness.",
  },
  {
    title: "Packed with Love",
    text: "Every order is handled with utmost care and love.",
  },
  {
    title: "Served Hot",
    text: "Delivered piping hot within 30 minutes!",
  },
];


const Home = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`pt-6 ${isDark ? " text-text-dark" : " text-text-light"}`}>
      {/* Hero Banner */}
      <div
        data-aos="fade-up"
        className="relative w-full max-w-7xl mx-auto h-[200px] sm:h-[260px] md:h-[320px] lg:h-[400px] overflow-hidden rounded-3xl shadow-xl"
      >
        <motion.img
          key={currentSlide}
          src={banners[currentSlide]}
          alt={`Slide ${currentSlide + 1}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full object-cover"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 z-0 rounded-3xl"></div>

        {/* Arrows */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-4 -translate-y-1/2 z-10 bg-black/60 text-white p-2 rounded-full hover:scale-110 transition"
        >
          <FaArrowLeft size={14} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-4 -translate-y-1/2 z-10 bg-black/60 text-white p-2 rounded-full hover:scale-110 transition"
        >
          <FaArrowRight size={14} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full ${
                currentSlide === idx ? "bg-white" : "bg-white/50"
              } transition`}
            />
          ))}
        </div>
      </div>

      {/* How Yumigo Serves You */}
      <section className="py-12 text-center">
        <h2 className="text-3xl font-bold mb-10 text-secondary-light dark:text-secondary-dark">
          How Yumigo Serves You
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          {features.map((item, i) => (
            <motion.div
              key={i}
              data-aos="fade-up"
              data-aos-delay={i * 10}
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
        className={`py-12 px-6 md:px-10 mb-3 text-center mx-auto max-w-6xl rounded-xl transition-all ${
          isDark ? "bg-[#181818] text-[#FF7043]" : "bg-[#FFF3CD] text-[#1E1E1E]"
        }`}
      >
         
        <h2 className="text-3xl font-bold mb-4">
          Discover a World of Flavors — Explore Our Curated Food Categories!
        </h2>
        <p className="text-lg mb-6 font-medium">
          From sizzling street food to gourmet meals, Yumigo brings you 3000+ dishes across multiple cuisines.
        </p>
        <Link
  to="/menu"
  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF5722] to-[#FFD54F] text-white font-semibold rounded-full shadow-md hover:scale-105 hover:shadow-lg transition-transform"
>
  <ShoppingCart size={18} /> Explore Menu
</Link>

      </section>
    </div>
  );
};

export default Home;
