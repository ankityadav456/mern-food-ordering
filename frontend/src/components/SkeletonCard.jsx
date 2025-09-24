import React from "react";

const SkeletonCard = ({ theme }) => {
  return (
    <div
      className={`animate-pulse rounded-2xl overflow-hidden border 
        ${theme === "dark"
          ? "bg-[#1E1E1E] border-[#2C2C2C]"
          : "bg-gray-100 border-gray-300"
        }`}
    >
      {/* Image Skeleton */}
      <div className={`w-full h-44 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`} />

      {/* Text & Button Skeletons */}
      <div className="p-3 space-y-2">
        <div className={`h-5 w-3/4 rounded ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"}`}></div>
        <div className={`h-4 w-1/2 rounded ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"}`}></div>
        <div className="flex gap-2 mt-3">
          <div className={`flex-1 h-8 rounded ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"}`}></div>
          <div className={`flex-1 h-8 rounded ${theme === "dark" ? "bg-gray-600" : "bg-gray-300"}`}></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
