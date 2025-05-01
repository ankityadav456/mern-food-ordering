// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { motion } from "framer-motion";
// import Logo from "../assets/Images/AppLogo.png"; // Add your actual logo path
// import splash from "../assets/Images/SplashScreen.jpg"; // Add your actual logo path

// const Home = () => {
//   const { user, logout } = useAuth();
//   const [menuOpen, setMenuOpen] = useState(false);

//   return (
//     <div className="py-5 min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center">
//       {/* Logo & App Name */}
//       <motion.div 
//         initial={{ opacity: 0, y: -20 }} 
//         animate={{ opacity: 1, y: 0 }} 
//         transition={{ duration: 0.5 }}
//         className="flex flex-col items-center mb-8"
//       >
//         <img src={Logo} alt="Yumigo Logo" className="w-24 h-24 rounded-full border-4 border-[#FFD700] shadow-lg" />
//         <h1 className="text-5xl font-extrabold text-[#FFD700] mt-4 tracking-wide">
//           YUMIGO
//         </h1>
//         <p className="text-gray-400 text-lg mt-2 tracking-wide">
//           Elevate Your Dining Experience 🍽️
//         </p>
//       </motion.div>

//       {/* Hero Section */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="flex flex-col md:flex-row items-center justify-center text-center md:text-left p-10"
//       >
//         <div className="max-w-xl">
//           <h2 className="text-4xl font-bold text-white mb-4">
//             Indulge in <span className="text-[#FFD700]">Gourmet Delights</span>
//           </h2>
//           <p className="text-gray-300 mb-6">
//             Experience the perfect blend of luxury and taste. Freshly made, carefully crafted, and delivered with love. 
//           </p>
//           <Link 
//             to="/menu" 
//             className="bg-[#FFD700] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#8B0000] hover:text-white transition-all duration-300 shadow-lg"
//           >
//             Explore Menu
//           </Link>
//         </div>

//         {/* Hero Image */}
//         <motion.img 
//           src={splash}
//           alt="Delicious Food" 
//           className="w-96 mt-8 md:mt-0 rounded-2xl shadow-lg border-4 border-[#FFD700]"
//           initial={{ scale: 0.9 }}
//           animate={{ scale: 1 }}
//           transition={{ duration: 0.5 }}
//         />
//       </motion.div>

//       {/* Call-to-Action Section */}
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.5, delay: 0.2 }}
//         className="mt-12 text-center"
//       >
//         <p className="text-gray-400 text-lg">Taste the best, made just for you.</p>
//         <Link to="/signup" className="mt-4 inline-block bg-[#8B0000] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#FFD700] hover:text-black transition-all duration-300 shadow-lg">
//           Get Started
//         </Link>
//       </motion.div>
//     </div>
//   );
// };

// export default Home;

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import homebg from '../assets/Images/homebg.png';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-black text-white bg-no-repeat bg-cover"  style={{ backgroundImage: `url(${homebg})` }}>
      {/* Hero Section */}
      <section
        className="relative h-screen flex items-center justify-center bg-cover bg-center"
      >
        <div className="bg-black/70 backdrop-blur-sm p-8 rounded-xl text-center max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl font-bold text-[#FFD700] mb-4"
          >
            Taste Royalty with Yumigo
          </motion.h1>
          <p className="text-gray-300 text-lg mb-6">
            Dive into a premium experience of handpicked Indian cuisine. From Maharaja Thalis to iconic street food — it’s a journey for your senses.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-[#8B0000] hover:bg-[#a00000] text-white py-3 px-6 rounded-full font-bold transition duration-300"
          >
            Explore Menu
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-10 text-white text-center w-full"
        >
          <ChevronDown className="mx-auto animate-bounce text-[#FFD700]" size={32} />
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="px-4 py-16 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center text-[#FFD700] mb-12"
        >
          Explore Categories
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Royal Thalis", description: "Experience the grandeur of traditional Thalis from Rajasthan, Punjab, and more." },
            { title: "Street Food Gems", description: "Relish the spicy, tangy, and crunchy delights from the streets of India." },
            { title: "South Indian Feast", description: "Enjoy aromatic dosas, idlis, and sambar with authentic flavors." },
          ].map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-[#111] rounded-2xl p-6 shadow-xl border border-[#FFD700]/20 hover:shadow-[#FFD700]/30 transition-all duration-300"
            >
              <h3 className="text-2xl font-semibold text-[#FFD700] mb-2">{cat.title}</h3>
              <p className="text-gray-300">{cat.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
