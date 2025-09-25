import React from 'react'

const SkeletonCard = ({ theme }) => {
  return (
    <div
      className={`relative rounded-2xl border p-4 animate-pulse ${theme === "dark" ? "bg-[#1a1a1a] border-[#2C2C2C]" : "bg-gray-100 border-gray-200"
        }`}
    >
      <div className="w-full h-44 rounded-lg bg-gray-300 dark:bg-gray-700"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mt-3"></div>
      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mt-2"></div>
      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mt-2"></div>
      <div className="flex gap-2 mt-3">
        <div className="flex-1 h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="flex-1 h-8 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  )
}

export default SkeletonCard
