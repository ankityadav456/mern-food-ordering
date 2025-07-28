import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const NavButton = ({ to, icon, label, isActive, theme, setNavMenuOpen, glowStyle }) => {
  const navigate = useNavigate();

  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      whileHover={{ scale: 1.05 }}
      onClick={() => {
        navigate(to);
        if (setNavMenuOpen) setNavMenuOpen(false);
      }}
      className={`
        relative flex items-center gap-2 px-5 py-2 rounded-full font-medium text-sm md:text-base 
        transition-all duration-300 ease-in-out shadow-md ring-1 ring-inset
        ${
          isActive
            ? theme === "dark"
              ? "bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black ring-yellow-500 shadow-[0_0_12px_rgba(255,215,0,0.4)]"
              : "bg-gradient-to-r from-[#FFB300] to-[#FF8C00] text-white ring-[#FF9800] shadow-[0_0_12px_rgba(255,165,0,0.4)]"
            : theme === "dark"
            ? "bg-[#1A1A1A] text-white ring-[#333] hover:bg-gradient-to-r hover:from-[#D4AF37] hover:to-[#FFB300] hover:text-black hover:shadow-[0_0_10px_rgba(212,175,55,0.3)]"
            : "bg-white text-black ring-[#D4AF37] hover:bg-gradient-to-r hover:from-[#FFD54F] hover:to-[#FFB74D] hover:text-black hover:shadow-[0_0_10px_rgba(255,193,7,0.3)]"
        }
      `}
      style={glowStyle}
    >
      <motion.span
        initial={{ opacity: 0, x: -4 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="flex items-center justify-center"
      >
        {icon}
      </motion.span>
      <motion.span
        initial={{ opacity: 0, y: 2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="whitespace-nowrap"
      >
        {label}
      </motion.span>
    </motion.button>
  );
};

export default NavButton;
