// import React, { useState, useEffect, useContext } from "react";
// import { useFood } from "../context/FoodContext";
// import { motion } from "framer-motion";
// import toast, { Toaster } from "react-hot-toast";
// import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
// import { useLocation } from "react-router-dom";
// import { SearchContext } from "../context/SearchContext";
// import { useCart } from "../context/CartContext";
// const UserDashboard = () => {
//   const { foodItems } = useFood();
//   const { searchQuery } = useContext(SearchContext);
//   const location = useLocation();
//   const { addToCart } = useCart();
//   const queryParams = new URLSearchParams(location.search);
//   const initialQuery = queryParams.get("search") || "";

//   const [filteredFoods, setFilteredFoods] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   // const [searchQuery, setSearchQuery] = useState(initialQuery);
//   const [sortOrder, setSortOrder] = useState("");
//   // const [quickViewItem, setQuickViewItem] = useState(null);

//   const categories = ["All", "Fast Food", "Beverages", "Dessert", "Vegetarian", "Non-Vegetarian"];

//   useEffect(() => {
//     if (searchQuery.trim() !== "") {
//       const result = foodItems.filter(item =>
//         item.name.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//       setFilteredFoods(result);
//     } else {
//       filterFoods(selectedCategory);
//     }
//   }, [searchQuery, foodItems]);

//   const renderStars = (rating) => {
//     const stars = [];
//     for (let i = 1; i <= 5; i++) {
//       if (rating >= i) {
//         stars.push(<FaStar key={i} className="text-yellow-400" />);
//       } else if (rating >= i - 0.5) {
//         stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
//       } else {
//         stars.push(<FaRegStar key={i} className="text-yellow-400" />);
//       }
//     }
//     return <div className="flex items-center gap-1 mt-1">{stars}</div>;
//   };

//   const filterFoods = (category) => {
//     let result = category === "All"
//       ? foodItems
//       : foodItems.filter(item => item.category === category);

//     if (sortOrder === "asc") result.sort((a, b) => a.price - b.price);
//     if (sortOrder === "desc") result.sort((a, b) => b.price - a.price);

//     setFilteredFoods(result);
//   };

//   const searchFoods = (query) => {  
//     let results = foodItems.filter(item =>
//       item.name.toLowerCase().includes(query.toLowerCase()) &&
//       (selectedCategory === "All" || item.category === selectedCategory)
//     );

//     if (sortOrder === "asc") results.sort((a, b) => a.price - b.price);
//     if (sortOrder === "desc") results.sort((a, b) => b.price - a.price);

//     setFilteredFoods(results);
//   };

//   const handleAddToCart = (food) => {
//     addToCart(food);
//     toast.success(`${food.name} added to cart!`);
//   };

//   const handleSortChange = (value) => {
//     setSortOrder(value);
//   };

//   return (
//     <div className="min-h-screen bg-[#0d0d0d] text-white p-4">
//       <Toaster position="top-right" />

//       {/* Banner + Filters */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="bg-gradient-to-br from-[#0d0d0d] via-[#1A1A1A] to-[#0d0d0d] border border-[#2A2A2A] rounded-2xl shadow-xl p-6 mx-2 md:mx-6"
//       >
//         <div className="bg-gradient-to-r from-[#D4AF37] via-[#B22222] to-[#D4AF37] text-black py-3 px-4 md:py-4 md:px-6 shadow-md border-b border-[#D4AF37] rounded-xl text-center font-bold mx-2 sm:mx-4">
//   <div className="flex flex-wrap justify-center items-center gap-2 text-sm md:text-base overflow-hidden">
//     🎉
//     <span className="bg-black px-2 md:px-3 py-1 rounded-full text-[#D4AF37] whitespace-nowrap">
//       Get 20% OFF
//     </span>
//     with code
//     <span className="bg-[#D4AF37] text-black px-2 py-1 rounded whitespace-nowrap">
//       FOOD20
//     </span>
//     🎉
//   </div>
// </div>


//         {/* Heading */}
//         <h2 className="text-3xl font-bold text-center text-[#D4AF37] mt-6">Explore Delicious Meals</h2>

//         {/* Search + Sort + Categories */}
//         <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
//           {/* Sort Dropdown */}
//           <select
//             value={sortOrder}
//             onChange={(e) => handleSortChange(e.target.value)}
//             className="px-4 py-2 rounded-lg bg-[#1A1A1A] border border-[#D4AF37] text-white"
//           >
//             <option value="">Sort By</option>
//             <option value="asc">Price: Low to High</option>
//             <option value="desc">Price: High to Low</option>
//           </select>

//           {/* Categories */}
//           <div className="flex flex-wrap justify-center md:justify-start gap-2">
//             {categories.map((category) => (
//               <motion.button
//                 key={category}
//                 onClick={() => {
//                   setSelectedCategory(category);
//                   filterFoods(category);
//                 }}
//                 className={`px-4 py-2 rounded-full border ${selectedCategory === category
//                   ? "bg-[#D4AF37] text-black border-[#D4AF37]"
//                   : "bg-transparent text-white border-[#2A2A2A] hover:border-[#D4AF37]"
//                   }`}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 {category}
//               </motion.button>
//             ))}
//           </div>
//         </div>
//       </motion.div>

//       {/* Food Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
//         {filteredFoods.length > 0 ? (
//           filteredFoods.map((item) => (
//             <motion.div
//               key={item._id}
//               className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl shadow-lg overflow-hidden hover:shadow-[#D4AF37]/40 transition"
//               whileHover={{ scale: 1.03 }}
//               whileTap={{ scale: 0.97 }}
//             >
//               <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
//               <div className="p-4">
//                 <h3 className="text-xl font-semibold text-[#D4AF37] truncate">{item.name}</h3>
//                 <p className="text-white text-lg font-bold">${item.price}</p>
//                 <p className="text-sm text-gray-400">{item.category}</p>
//                 {renderStars(item.rating || 4.5)}
//                 <p className="text-xs text-gray-500 mt-1">⏱ Estimated Delivery: {item.deliveryTime || "25-35 mins"}</p>
//                 <div className="flex mt-4">
//                   <button
//                     className="w-full py-2 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B22222] text-black font-semibold hover:opacity-90"
//                     onClick={() => handleAddToCart(item)}
//                   >
//                     Add to Cart
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           ))
//         ) : (
//           <p className="text-center col-span-full text-gray-500">No food items found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;

import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { ShoppingCart, List, ChefHat } from "lucide-react";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-4 md:p-8 text-white min-h-screen bg-[#0d0d0d]"
    >
      {/* Welcome Message */}
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold mb-4"
      >
        Welcome back,{" "}
        <span className="text-[#D4AF37]">{user?.name || "User"}!</span>
      </motion.h1>

      {/* Rewards Banner */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-[#D4AF37] via-[#B22222] to-[#D4AF37] text-black py-4 px-6 rounded-xl shadow-md border border-[#D4AF37] text-center font-semibold"
      >
        🎉 You’ve earned{" "}
        <span className="bg-black px-2 py-1 rounded-full text-[#D4AF37]">
          150 YumPoints
        </span>
        ! Use them on your next order. 🎁
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
          },
        }}
      >
        {[
          {
            icon: <List size={32} className="text-[#D4AF37] mb-2" />,
            label: "Browse Menu",
            to: "/menu",
          },
          {
            icon: <ShoppingCart size={32} className="text-[#D4AF37] mb-2" />,
            label: "View Cart",
            to: "/cart",
          },
          ...(user?.isAdmin
            ? [
                {
                  icon: <ChefHat size={32} className="text-[#D4AF37] mb-2" />,
                  label: "Manage Food",
                  to: "/food-management",
                },
              ]
            : []),
        ].map((action, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-xl p-6 text-center hover:shadow-md transition"
          >
            <Link to={action.to} className="flex flex-col items-center">
              {action.icon}
              <span className="text-white text-lg font-semibold">
                {action.label}
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Orders Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12"
      >
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-xl p-6 text-gray-300 text-sm">
          You haven’t placed any orders yet. Start by exploring the menu!
        </div>
      </motion.div>

      {/* Manage Profile */}
      <motion.div
        className="mt-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Link
          to="/profile"
          className="inline-block bg-[#D4AF37] text-black font-semibold px-6 py-3 rounded-xl hover:bg-[#B22222] hover:text-white transition-all"
        >
          Manage Profile
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;


