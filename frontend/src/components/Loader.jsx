import React from "react";
import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <motion.div
        className="w-20 h-20 border-4 border-t-[#D4AF37] border-b-[#B22222] border-l-white border-r-white rounded-full animate-spin"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
};

export default Loader;
