import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import heroImg from "../assets/Images/heroImage.png";
import { Star, Zap, Headphones, ShoppingBag, Truck, Smile, Rocket, Utensils, MessageCircle, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollProgress from '../components/ScrollProgress'
export default function LandingPage() {
  const { theme } = useTheme();
const MotionLink = motion(Link);
  return (
    <div className="min-h-screen w-full bg-white relative text-gray-800">
      <div
        className="absolute inset-0 z-0 pointer-events-none animate-moveGrid"
        style={{
          backgroundImage: `
      repeating-linear-gradient(
        0deg, 
        transparent, transparent 5px, 
        ${theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(75,85,99,0.06)"} 5px, 
        ${theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(75,85,99,0.06)"} 6px, 
        transparent 6px, 
        transparent 15px
      ),
      repeating-linear-gradient(
        90deg, 
        transparent, transparent 5px, 
        ${theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(75,85,99,0.06)"} 5px, 
        ${theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(75,85,99,0.06)"} 6px, 
        transparent 6px, 
        transparent 15px
      ),
      repeating-linear-gradient(
        0deg, 
        transparent, transparent 10px, 
        ${theme === "dark" ? "rgba(255,255,255,0.04)" : "rgba(107,114,128,0.04)"} 10px, 
        ${theme === "dark" ? "rgba(255,255,255,0.04)" : "rgba(107,114,128,0.04)"} 11px, 
        transparent 11px, 
        transparent 30px
      ),
      repeating-linear-gradient(
        90deg, 
        transparent, transparent 10px, 
        ${theme === "dark" ? "rgba(255,255,255,0.04)" : "rgba(107,114,128,0.04)"} 10px, 
        ${theme === "dark" ? "rgba(255,255,255,0.04)" : "rgba(107,114,128,0.04)"} 11px, 
        transparent 11px, 
        transparent 30px
      )
    `,
          backgroundSize: "30px 30px, 30px 30px, 60px 60px, 60px 60px",
        }}
      />


      <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark overflow-hidden">
        <ScrollProgress />

        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden text-center px-6">
          <div className="absolute inset-0 -z-10">
            <div className="w-full h-full bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-primary-light via-secondary-light to-transparent dark:from-primary-dark dark:via-secondary-dark dark:to-transparent animate-pulse blur-3xl opacity-30"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 0.6, y: 0 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-primary-light to-secondary-light rounded-full blur-2xl opacity-40"
          />
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 0.6, y: 0 }}
            transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse" }}
            className="absolute bottom-20 right-10 w-52 h-52 bg-gradient-to-r from-secondary-light to-primary-light rounded-full blur-2xl opacity-30"
          />

          {/* Hero Content */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-7xl font-extrabold leading-tight"
          >
            Say Hello to{" "}
            <span className="bg-gradient-to-r from-primary-light to-secondary-light bg-clip-text text-transparent">
              Yumigo
            </span>
            <br />
            <span className="text-text-light dark:text-text-dark">
              The Smarter Way to Order Food
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-6 text-lg md:text-xl text-text-subtleLight dark:text-text-subtleDark max-w-2xl"
          >
            With{" "}
            <span className="bg-gradient-to-r from-primary-light to-secondary-light bg-clip-text text-transparent font-bold">
              Yumigo
            </span>
            , enjoy fresh meals, lightning-fast delivery, and a seamless ordering
            experience — anytime, anywhere.
          </motion.p>


          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
              <MotionLink
  to="/menu"
  whileTap={{ scale: 0.95 }}
  whileHover={{ scale: 1.05 }}
  className="px-8 py-3 rounded-full bg-gradient-to-r from-primary-light to-secondary-light text-white font-semibold shadow-lg flex items-center gap-2"
>
  <ShoppingBag className="w-5 h-5" />
  Order Now
</MotionLink>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-full border border-primary-light text-primary-light dark:text-primary-dark font-semibold shadow-lg flex items-center gap-2"
            >
              <Star className="w-5 h-5" />
              Learn More
            </motion.button>
          </motion.div>
          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 2 }}
            className="absolute bottom-10 flex flex-col items-center"
          >
            <ChevronDown className="w-6 h-6 text-primary-light animate-bounce" />
            <span className="text-xs text-text-subtleLight mt-1">Scroll Down</span>
          </motion.div>
        </section>

        <section className="relative py-24 px-6 text-center overflow-hidden">
          <motion.div
            animate={{ y: [0, -40, 0], x: [0, 30, 0] }}
            transition={{ duration: 14, repeat: Infinity }}
            className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-[160px]"
          />
          <motion.div
            animate={{ y: [0, 50, 0], x: [0, -40, 0] }}
            transition={{ duration: 16, repeat: Infinity }}
            className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/30 rounded-full blur-[160px]"
          />

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center text-5xl md:text-6xl font-extrabold mb-24"
          >
            Get Your Food in{" "}
            <span className="bg-gradient-to-r from-primary-light to-secondary-light bg-clip-text text-transparent">
              3 Easy Steps
            </span>
          </motion.h2>

          {/* Steps */}
          <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-3 gap-10 px-14">
            {[
              {
                icon: Utensils,
                title: "Browse the Menu",
                desc: "Explore a variety of delicious dishes and find what you're craving.",
              },
              {
                icon: ShoppingBag,
                title: "Add to Cart",
                desc: "Pick your favorites and add them to your cart in just one click.",
              },
              {
                icon: Truck,
                title: "Fast Delivery",
                desc: "We prepare your order instantly and deliver it fresh to your door.",
              },
            ].map((item, i) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.25, duration: 0.6 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group relative"
                >
                  {/* Gradient Glow */}
                  <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r 
      from-primary-light via-secondary-light to-primary-light 
      opacity-10 blur-lg group-hover:opacity-30 transition"></div>

                  {/* Card */}
                  <div className="relative rounded-2xl p-6
      bg-white/70 dark:bg-surface-dark/60
      backdrop-blur-lg
      border border-white/20
      transition-all duration-300">

                    {/* Step Number */}
                    <div className="absolute -top-3 -left-3 
        w-8 h-8 rounded-full 
        bg-gradient-to-r from-primary-light to-secondary-light
        text-white text-sm font-semibold flex items-center justify-center shadow-md">
                      {i + 1}
                    </div>

                    {/* Icon */}
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="flex justify-center mb-4"
                    >
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center
          bg-gradient-to-br from-primary-light to-secondary-light
          text-white shadow-md group-hover:scale-110 transition">
                        <Icon size={28} strokeWidth={1.8} />
                      </div>
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-center mb-2">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-center text-sm leading-relaxed 
        text-text-subtleLight dark:text-text-subtleDark">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="relative py-24 px-6 text-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 -z-10">
            <div className="w-full h-full bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 dark:from-primary-dark dark:via-secondary-dark dark:to-primary-dark animate-gradient-x"></div>
          </div>

          {/* Floating Glow Elements (only show in dark mode) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.25, scale: 1 }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            className="hidden dark:block absolute top-20 left-10 w-40 h-40 bg-white rounded-full blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 0.25, scale: 1 }}
            transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
            className="hidden dark:block absolute bottom-20 right-10 w-52 h-52 bg-yellow-300 rounded-full blur-3xl"
          />

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-extrabold 
               text-gray-900 dark:text-white"
          >
            Ready to{" "}
            <span className="text-primary-light dark:text-yellow-300">
              Taste Happiness?
            </span>
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-4 text-lg md:text-xl 
               text-gray-700 dark:text-white/90 
               max-w-2xl mx-auto"
          >
            Experience lightning-fast delivery and mouth-watering meals with{" "}
            <span className="bg-gradient-to-r from-primary-light to-secondary-light bg-clip-text text-transparent font-bold">
              Yumigo
            </span>.
            Your cravings, just a click away.
          </motion.p>

          {/* <Link to="/menu">
            <motion.button
              whileHover={{
                scale: 1.1,
                boxShadow: "0px 0px 30px rgba(0,0,0,0.2)",
              }}
              whileTap={{ scale: 0.95 }}
              className="relative mt-8 px-10 py-3 rounded-full 
              bg-gradient-to-r from-primary-light to-secondary-light
               bg-surface-light dark:bg-surface-dark 
               text-white dark:text-primary-dark 
               font-bold text-lg shadow-lg flex items-center gap-2 mx-auto 
               overflow-hidden transition-colors duration-300"
            >
              <ShoppingBag className="w-5 h-5 text-white dark:text-primary-dark" />
              <span className="relative z-10">Get Started</span>

              <span
                className="absolute inset-0 rounded-full 
                 bg-gradient-to-r from-primary-light to-secondary-light 
                 dark:from-primary-dark dark:to-secondary-dark 
                 opacity-0 hover:opacity-20 transition-opacity duration-300"
              ></span>
            </motion.button>
          </Link> */}

          <Link to="/menu">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(255,87,34,0.6)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-primary-light to-secondary-light text-white font-semibold shadow-lg flex items-center gap-2 mx-auto mt-5"
              >
                <ShoppingBag className="w-5 h-5" />
                Get Started
              </motion.button>
            </Link>

        </section>

      </div>
    </div>

  );
}
