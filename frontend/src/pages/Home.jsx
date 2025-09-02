import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { Pizza, Coffee, IceCream, Salad, ShoppingCart } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const categories = [
  { icon: <Pizza size={32} />, label: "Pizza" },
  { icon: <Coffee size={32} />, label: "Drinks" },
  { icon: <IceCream size={32} />, label: "Desserts" },
  { icon: <Salad size={32} />, label: "Healthy" },
];

const promos = [
  {
    img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800",
    title: "Flat 20% OFF Pizzas",
    desc: "Cheesy, hot & fresh!",
  },
  {
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800",
    title: "Buy 1 Get 1 Burgers",
    desc: "Limited time offer!",
  },
  {
    img: "https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?w=800",
    title: "Dessert Deals",
    desc: "Satisfy your sweet tooth 🍩",
  },
];

const features = [
  { title: "Freshly Cooked", text: "Prepared after you order, never stale." },
  { title: "Secure Packaging", text: "Sealed, hygienic & spill-proof." },
  { title: "Super Fast Delivery", text: "Meals at your doorstep in 30 mins." },
];

const Home = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);

  return (
    <div className={`${isDark ? "bg-[#121212]" : "bg-[#FAFAFA]"} overflow-hidden`}>

      {/* 🚀 Hero Section */}
      <section className="relative h-[85vh] flex flex-col justify-center items-center text-center px-6">
        <div
  className="
    absolute inset-0 
    bg-primary-light dark:bg-primary-dark
    opacity-20 blur-3xl
  "
></div>



        <motion.h1
  className="text-5xl md:text-6xl font-extrabold relative z-10"
>
  Order <span className="bg-gradient-to-r from-primary-light to-secondary-light bg-clip-text text-transparent">Food</span> Instantly
</motion.h1>

        <p className="mt-6 text-lg max-w-xl text-gray-600 dark:text-gray-300 relative z-10">
          Cravings don’t wait. Get your favorite meals delivered hot & fresh.
        </p>

        <Link
  to="/menu"
  className="mt-8 px-10 py-4 rounded-full font-bold text-white 
             bg-gradient-to-r from-primary-light to-secondary-light
             dark:from-primary-dark dark:to-secondary-dark 
             shadow-lg hover:shadow-xl hover:scale-110 transition relative z-10"
>
  Explore Menu
</Link>

      </section>

      {/* 🍴 Categories */}
      <section className="py-16 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-6">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-2xl shadow-lg bg-white dark:bg-[#1E1E1E] flex flex-col items-center gap-4 cursor-pointer"
            >
              {cat.icon}
              <span className="font-semibold">{cat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🎉 Promo Carousel */}
      <section className="py-16 bg-gradient-to-r from-[#FFF8E1] to-[#FFE082] dark:from-[#1E1E1E] dark:to-[#2C2C2C]">
        <h2 className="text-3xl font-bold text-center mb-12">Deals of the Day</h2>
        <div className="flex gap-6 overflow-x-auto px-6 snap-x snap-mandatory">
          {promos.map((promo, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="min-w-[280px] snap-center bg-white dark:bg-[#121212] rounded-2xl shadow-lg overflow-hidden"
            >
              <img src={promo.img} alt={promo.title} className="w-full h-40 object-cover" />
              <div className="p-4 text-center">
                <h3 className="font-bold text-lg mb-2">{promo.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{promo.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🚀 Features */}
      <section className="py-20 text-center max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-12">Why Yumigo?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="p-8 rounded-2xl shadow-lg bg-white dark:bg-[#181818]"
            >
              <h4 className="text-xl font-semibold mb-3 text-[#FF5722]">{f.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 text-center">
        <h2 className="text-4xl font-extrabold mb-6">Hungry? Let’s Fix That 🍔</h2>
        <Link
          to="/menu"
          className="px-12 py-5 rounded-full font-bold text-white bg-gradient-to-r from-[#FF5722] to-[#FFD54F] shadow-xl hover:scale-110 transition"
        >
          Start Ordering
        </Link>
      </section>
    </div>
  );
};

export default Home;
