// // components/FilterButton.jsx
// import { useState } from "react";
// import { FilterModal } from "./FilterModal";
// import { SlidersHorizontal } from "lucide-react";

// export default function FilterButton() {
//   const [open, setOpen] = useState(false);

//   return (
//     <>
//       <button
//         onClick={() => setOpen(true)}
//         className="fixed bottom-5 right-5 z-50 bg-gold-500 text-black px-4 py-2 rounded-full shadow-lg flex items-center gap-2 hover:bg-gold-600 transition-all"
//       >
//         <SlidersHorizontal size={20} />
//         Filters
//       </button>
//       <FilterModal open={open} onClose={() => setOpen(false)} />
//     </>
//   );
// }
