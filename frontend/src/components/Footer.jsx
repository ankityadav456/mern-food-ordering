import { useTheme } from "../context/ThemeContext";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const location = useLocation();
  const isHome = location.pathname === "/";

  const bgMain = isDark ? "bg-[#121212]" : "bg-[#FAFAFA]";
  const textMain = isDark ? "text-gray-300" : "text-gray-700";
  const accent = "from-[#FF5722] to-[#FFD54F]";
  const goldText = isDark ? "text-[#FFD54F]" : "text-[#FF5722]";
  const borderColor = isDark ? "border-gray-800" : "border-gray-200";

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.7, ease: "easeOut" },
    }),
  };

  return (
    <footer className={`relative overflow-hidden ${bgMain} ${textMain}`}>

      {/* Floating Glow Background */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-r from-[#FF5722]/20 to-[#FFD54F]/20 blur-[120px] rounded-full opacity-40 pointer-events-none" />

      {/* Animated Gradient Border */}
      <div className="absolute top-0 left-0 w-full h-[1px]
      bg-gradient-to-r from-[#FF5722] via-[#FFD54F] to-[#FF5722]
      bg-[length:200%_100%] animate-shimmer" />

      {/* CTA SECTION (2026 trend) */}
      {isHome && (
        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className={`rounded-3xl border ${borderColor}
            backdrop-blur-xl p-10 text-center
            ${isDark ? "bg-[#1E1E1E]/60" : "bg-white/70"}
            shadow-xl`}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to order your favorite food?
            </h2>

            <p className="text-sm opacity-80 mb-6">
              Delicious meals from the best restaurants delivered fast.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-xl text-white font-semibold
              bg-gradient-to-r from-[#FF5722] to-[#FFD54F]
              shadow-lg hover:opacity-90 transition"
            >
              Explore Menu
            </motion.button>
          </motion.div>
        </div>
      )}

      {/* MAIN FOOTER GRID */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-14 relative">

        {/* BRAND */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeUp}
          custom={0}
        >
          <h2 className={`text-4xl font-extrabold bg-gradient-to-r ${accent} bg-clip-text text-transparent`}>
            Yumigo
          </h2>

          <p className="mt-4 text-sm leading-relaxed max-w-sm">
            Premium food delivered fast. Experience a
            <span className={`font-semibold ${goldText}`}> luxury taste </span>
            at your doorstep.
          </p>

          {/* SOCIAL */}
          <div className="flex gap-4 mt-6">
            {[FaFacebookF, FaInstagram, FaTwitter].map((Icon, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.15, rotate: 6 }}
                whileTap={{ scale: 0.9 }}
                className={`p-3 rounded-xl cursor-pointer
                ${isDark ? "bg-[#1E1E1E]" : "bg-gray-100"}
                shadow-md hover:shadow-lg transition`}
              >
                <Icon size={16} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CONTACT */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeUp}
          custom={1}
        >
          <h3 className={`text-xl font-semibold mb-6 ${goldText}`}>
            Contact
          </h3>

          <ul className="space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <FaPhoneAlt className={goldText} /> +91 1234567890
            </li>

            <li className="flex items-center gap-3">
              <FaEnvelope className={goldText} /> support@yumigo.com
            </li>

            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className={`${goldText} mt-1`} />
              <span>
                123 Food Street <br />
                Mumbai, India
              </span>
            </li>
          </ul>
        </motion.div>

        {/* QUICK LINKS */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeUp}
          custom={2}
        >
          <h3 className={`text-xl font-semibold mb-6 ${goldText}`}>
            Quick Links
          </h3>

          <ul className="space-y-4 text-sm">
            {["Menu", "About", "Reviews", "FAQ", "Contact"].map((link, i) => (
              <motion.li
                key={i}
                whileHover={{ x: 6 }}
                className="relative cursor-pointer group"
              >
                {link}

                <span className="absolute left-0 -bottom-1 h-[2px] w-0
                bg-gradient-to-r from-[#FF5722] to-[#FFD54F]
                group-hover:w-full transition-all duration-300" />
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* FEATURES BAR */}
      <div className={`py-4 px-6 border-y ${borderColor}
      flex flex-wrap justify-center gap-6 text-sm`}>

        <motion.div whileHover={{ scale: 1.05 }}>
          🚚 Free delivery on orders over ₹500
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }}>
          ⏱ 30 minutes or less
        </motion.div>

        <motion.div className="flex items-center gap-1" whileHover={{ scale: 1.05 }}>
          <FaCheckCircle className="text-green-500" />
          100% satisfaction guaranteed
        </motion.div>
      </div>

      {/* LEGAL */}
   <div className={`text-xs py-5 text-center border-t ${borderColor}`}>
  © {new Date().getFullYear()}{" "}
  <span className={`font-semibold ${goldText}`}>Yumigo</span>. 
  All rights reserved • 
  <span className="opacity-70 ml-1">v{__APP_VERSION__}</span>

  <span className="ml-3 opacity-70 hover:opacity-100 cursor-pointer">
    Privacy
  </span>{" "}
  |{" "}
  <span className="opacity-70 hover:opacity-100 cursor-pointer">
    Terms
  </span>{" "}
  |{" "}
  <span className="opacity-70 hover:opacity-100 cursor-pointer">
    Cookie
  </span>
</div>
    </footer>
  );
};

export default Footer;