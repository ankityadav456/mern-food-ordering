// src/components/SkeletonCard.jsx
import React from "react";
import { motion } from "framer-motion";

const SkeletonCard = ({ theme }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-2xl overflow-hidden border backdrop-blur-md 
        ${theme === "dark"
          ? "bg-[rgba(30,30,30,0.6)] border-[rgba(255,255,255,0.1)]"
          : "bg-[rgba(255,255,255,0.5)] border-[rgba(0,0,0,0.05)] shadow-md"
        }`}
    >
      {/* Image Skeleton */}
      <div
        className={`w-full h-44 animate-pulse rounded-t-2xl 
          ${theme === "dark" ? "bg-[rgba(255,255,255,0.05)]" : "bg-gray-200"}
        `}
      ></div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div
          className={`w-3/4 h-4 rounded-md animate-pulse 
            ${theme === "dark" ? "bg-[rgba(255,255,255,0.08)]" : "bg-gray-300"}
          `}
        ></div>
        <div
          className={`w-1/2 h-3 rounded-md animate-pulse 
            ${theme === "dark" ? "bg-[rgba(255,255,255,0.08)]" : "bg-gray-300"}
          `}
        ></div>
        <div
          className={`w-1/3 h-3 rounded-md animate-pulse 
            ${theme === "dark" ? "bg-[rgba(255,255,255,0.08)]" : "bg-gray-300"}
          `}
        ></div>

        {/* Buttons */}
        <div className="flex gap-2 mt-3">
          <div
            className={`flex-1 h-8 rounded-lg animate-pulse 
              ${theme === "dark" ? "bg-[rgba(255,255,255,0.08)]" : "bg-gray-300"}
            `}
          ></div>
          <div
            className={`flex-1 h-8 rounded-lg animate-pulse 
              ${theme === "dark" ? "bg-[rgba(255,255,255,0.08)]" : "bg-gray-300"}
            `}
          ></div>
        </div>
      </div>
    </motion.div>
  );
};

export default SkeletonCard;
