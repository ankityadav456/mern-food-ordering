import React from "react";

const SkeletonCard = ({ theme }) => {
  const isDark = theme === "dark";

  return (
    <div
      className={`rounded-2xl border overflow-hidden animate-pulse ${
        isDark ? "bg-[#18181b] border-neutral-800" : "bg-white border-gray-200"
      }`}
    >
      <div
        className={`w-full h-48 ${
          isDark ? "bg-neutral-800" : "bg-gray-100"
        }`}
      />
      <div className="p-4 space-y-3">
        <div
          className={`h-4 w-3/4 rounded ${
            isDark ? "bg-neutral-800" : "bg-gray-200"
          }`}
        />
        <div
          className={`h-3 w-1/2 rounded ${
            isDark ? "bg-neutral-800" : "bg-gray-100"
          }`}
        />
        <div className="pt-2 flex items-center justify-between">
          <div
            className={`h-5 w-16 rounded ${
              isDark ? "bg-neutral-800" : "bg-gray-200"
            }`}
          />
          <div
            className={`h-8 w-16 rounded ${
              isDark ? "bg-neutral-800" : "bg-gray-200"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
