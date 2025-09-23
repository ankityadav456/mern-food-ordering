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
// import { useTheme } from "../context/ThemeContext";
import { useLocation } from "react-router-dom"; // ✅ add this


const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const bgMain = isDark ? "bg-[#121212]" : "bg-[#FAFAFA]";
  const textMain = isDark ? "text-gray-300" : "text-gray-700";
  const goldText = isDark ? "text-[#FFB300]" : "text-[#FF5722]"; // amber/orange accent
  const iconBg = isDark ? "bg-[#1E1E1E]" : "bg-gray-100";
  const hoverGold = isDark ? "hover:text-[#FFB300]" : "hover:text-[#FF5722]";
  const borderColor = isDark ? "border-gray-800" : "border-gray-300";
  const bottomBg = isDark ? "bg-[#1A1A1A]/90 backdrop-blur-lg" : "bg-[#ffffff]/70 backdrop-blur-lg";
  const location = useLocation();
  const isHome = location.pathname === "/";

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" },
    }),
  };

  return (
    <footer className={`relative z-10 overflow-hidden ${textMain}`}>
      {isHome && (
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
      )}

      {/* Animated gradient line on top */}
      <div className="absolute top-0 left-0 w-full h-[1px]  opacity-50
      bg-gradient-to-r from-[#FF5722] via-[#FFD54F] to-[#FF5722] 
       bg-[length:200%_100%] bg-left animate-shimmer"/>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-14 relative">
        {/* Brand & Social */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeUp}
          custom={0}
        >
          <h2
            className={`text-4xl font-extrabold tracking-wide bg-gradient-to-r from-[#FF5722] to-[#FFD54F] bg-clip-text text-transparent`}
          >
            Yumigo
          </h2>
          <p className="mt-4 text-sm leading-relaxed max-w-sm">
            Premium food, passionately prepared and quickly delivered. A{" "}
            <span className={goldText}>luxury taste</span> at your doorstep.
          </p>
          <div className="flex gap-4 mt-6">
            {[FaFacebookF, FaInstagram, FaTwitter].map((Icon, i) => (
              <motion.span
                key={i}
                className={`p-3 rounded-full ${iconBg} ${hoverGold} cursor-pointer shadow-md transition-transform`}
                custom={i}
                variants={fadeUp}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon size={18} />
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeUp}
          custom={1}
        >
          <h3 className={`text-xl font-semibold mb-5 ${goldText}`}>Contact Info</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <FaPhoneAlt className={goldText} /> +91 1234567890
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className={goldText} /> support@yumigo.com
            </li>
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className={`${goldText} mt-1`} />
              <span>123 Food Street,<br />Spice City, India</span>
            </li>
          </ul>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeUp}
          custom={2}
        >
          <h3 className={`text-xl font-semibold mb-5 ${goldText}`}>Quick Links</h3>
          <ul className="space-y-4 text-sm">
            {["Our Menu", "About Us", "Reviews", "FAQ", "Contact"].map((link, i) => (
              <motion.li
                key={i}
                className={`relative cursor-pointer transition-all ${hoverGold}`}
                whileHover={{ x: 6 }}
              >
                {link}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-[#FF5722] to-[#FFD54F] transition-all duration-300 group-hover:w-full"></span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Bottom Info */}
      <motion.div
        className={`${bottomBg} text-sm ${isDark ? "text-gray-200" : "text-gray-800"} py-4 px-6 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-3`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <motion.div whileHover={{ scale: 1.05 }}>🚚 Free delivery on orders over ₹500</motion.div>
        <motion.div whileHover={{ scale: 1.05 }}>⏱️ 30 minutes or less</motion.div>
        <motion.div className="flex items-center gap-1" whileHover={{ scale: 1.05 }}>
          <FaCheckCircle className="text-green-500" /> 100% satisfaction guaranteed
        </motion.div>
      </motion.div>

      {/* Legal */}
      <div className={`text-xs py-5 text-center border-t ${borderColor}`}>
        © {new Date().getFullYear()}{" "}
        <span className={`font-semibold ${goldText}`}>Yumigo</span>. All rights reserved. &nbsp;
        <span className="opacity-70 hover:opacity-100 cursor-pointer">Privacy</span> |{" "}
        <span className="opacity-70 hover:opacity-100 cursor-pointer">Terms</span> |{" "}
        <span className="opacity-70 hover:opacity-100 cursor-pointer">Cookie</span>
      </div>

      {/* Extra Animated Glow */}
      {/* <div className="absolute -bottom-5 left-3 -translate-x-1/2 w-[300px] h-[300px] bg-gradient-to-r from-[#FF5722]/20 to-[#FFD54F]/20 blur-3xl rounded-full animate-slideUp" /> */}
    </footer>
  );
};

export default Footer;
