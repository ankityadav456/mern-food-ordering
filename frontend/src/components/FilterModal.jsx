// // components/FilterModal.jsx
// import { Dialog } from "@headlessui/react";
// import { useState } from "react";

// export const FilterModal = ({ open, onClose }) => {
//   const [sort, setSort] = useState("");
//   const [priceRange, setPriceRange] = useState([0, 1000]);

//   const applyFilters = () => {
//     console.log("Sort:", sort);
//     console.log("Price Range:", priceRange);
//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={onClose} className="relative z-50">
//       <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
//       <div className="fixed inset-0 flex items-center justify-center p-4">
//         <Dialog.Panel className="bg-white dark:bg-black w-full max-w-md rounded-xl p-6 space-y-6 shadow-xl">
//           <Dialog.Title className="text-xl font-bold">Filters</Dialog.Title>

//           {/* Sort by */}
//           <div>
//             <h3 className="font-semibold mb-2">Sort by</h3>
//             <select
//               value={sort}
//               onChange={(e) => setSort(e.target.value)}
//               className="w-full border p-2 rounded"
//             >
//               <option value="">Select</option>
//               <option value="price_low_high">Price: Low to High</option>
//               <option value="price_high_low">Price: High to Low</option>
//               <option value="rating">Rating</option>
//             </select>
//           </div>

//           {/* Price range */}
//           <div>
//             <h3 className="font-semibold mb-2">Price Range (₹)</h3>
//             <div className="flex gap-2">
//               <input
//                 type="number"
//                 value={priceRange[0]}
//                 onChange={(e) =>
//                   setPriceRange([Number(e.target.value), priceRange[1]])
//                 }
//                 className="w-full border p-2 rounded"
//                 placeholder="Min"
//               />
//               <input
//                 type="number"
//                 value={priceRange[1]}
//                 onChange={(e) =>
//                   setPriceRange([priceRange[0], Number(e.target.value)])
//                 }
//                 className="w-full border p-2 rounded"
//                 placeholder="Max"
//               />
//             </div>
//           </div>

//           <div className="flex justify-end gap-2">
//             <button
//               onClick={onClose}
//               className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={applyFilters}
//               className="px-4 py-2 rounded bg-gold-500 text-black hover:bg-gold-600"
//             >
//               Apply
//             </button>
//           </div>
//         </Dialog.Panel>
//       </div>
//     </Dialog>
//   );
// };
