import { useTheme } from "../context/ThemeContext";
import {
  FaFacebookF,
  FaInstagram,
  FaUserCircle,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const bgMain = isDark ? "bg-[#0d0d0d]" : "bg-[#fefefe]";
  const textMain = isDark ? "text-gray-300" : "text-gray-700";
  const goldText = isDark ? "text-[#D4AF37]" : "text-[#B8860B]";
  const iconBg = isDark ? "bg-gray-800/60 backdrop-blur-sm" : "bg-gray-100/80 backdrop-blur-sm";
  const hoverGold = isDark ? "hover:text-[#D4AF37]" : "hover:text-[#B8860B]";
  const borderColor = isDark ? "border-gray-800" : "border-gray-300";
  const bottomBg = isDark ? "bg-[#111111]/90 backdrop-blur-sm" : "bg-[#f9f9f9]/90 backdrop-blur-sm";

  const iconVariant = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  };

  return (
    <footer className={`relative z-10 ${bgMain} ${textMain}`}>
      {/* Blurry Top Border */}
      <div className="absolute top-0 left-0 w-full h-1 backdrop-blur-sm border-t border-white/10 z-10" />

      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
        {/* Brand & Social */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={`text-3xl font-bold tracking-wide ${goldText}`}>Yumigo</h2>
          <p className="mt-4 text-sm leading-relaxed max-w-sm">
            Premium food, passionately prepared and quickly delivered. A taste of luxury at your doorstep.
          </p>
          <div className="flex gap-3 mt-6">
            {[FaFacebookF, FaInstagram, FaUserCircle].map((Icon, i) => (
              <motion.span
                key={i}
                className={`p-2 rounded-full ${iconBg} ${hoverGold} cursor-pointer transition-all hover:scale-110`}
                custom={i}
                variants={iconVariant}
                initial="hidden"
                animate="visible"
              >
                <Icon size={18} />
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h3 className={`text-xl font-semibold mb-4 ${goldText}`}>Contact Info</h3>
          <ul className="space-y-3 text-sm">
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
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h3 className={`text-xl font-semibold mb-4 ${goldText}`}>Quick Links</h3>
          <ul className="space-y-3 text-sm">
            {["Our Menu", "About Us", "Reviews", "FAQ", "Contact"].map((link, i) => (
              <li
                key={i}
                className={`cursor-pointer transition-all hover:translate-x-1 ${hoverGold}`}
              >
                {link}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <motion.div
        className={`${bottomBg} text-sm ${isDark ? "text-white" : "text-gray-800"} py-3 px-5 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-2`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div>🚚 Free delivery on orders over ₹500</div>
        <div>⏱️ 30 minutes or less</div>
        <div className="flex items-center gap-1">
          <FaCheckCircle className="text-white" /> 100% satisfaction guaranteed
        </div>
      </motion.div>

      {/* Legal */}
      <div className={`text-xs py-4 text-center border-t ${borderColor}`}>
        © {new Date().getFullYear()} <span className={`font-semibold ${goldText}`}>Yumigo</span>. All rights reserved.
        &nbsp; <span className="text-gray-400">Privacy | Terms | Cookie</span>
      </div>
    </footer>
  );
};

export default Footer;
