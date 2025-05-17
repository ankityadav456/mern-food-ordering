import { useTheme } from "../context/ThemeContext";
import heroImage from "../assets/Images/bgImg.png"; // Replace with your actual image
import { Link } from "react-router-dom";

const Home = () => {
  const { theme } = useTheme();

  const bg = theme === "dark" ? "bg-[#0d0d0d]" : "bg-[#FAF9F6]";
  const text = theme === "dark" ? "text-white" : "text-[#1a1a1a]";
  const highlight = theme === "dark" ? "text-[#FFD700]" : "text-[#B8860B]";
  const btnBg = theme === "dark" ? "bg-[#FFD700] text-black" : "bg-[#8B0000] text-white";
  const btnHover = theme === "dark" ? "hover:bg-[#B8860B]" : "hover:bg-[#FFD700] hover:text-black";

  return (
    <div className={`min-h-screen ${bg} ${text} transition-colors duration-300 py-8 px-5`}>
      <div className="max-w-7xl mx-auto px-4 flex flex-col-reverse lg:flex-row items-center justify-between gap-10">
        
        {/* Text Section */}
        <div className="flex-1">
          <h1 className={`text-4xl sm:text-5xl font-bold mb-4 ${highlight}`}>
            Indulge in Premium Flavors
          </h1>
          <p className="text-lg mb-6 max-w-xl">
            Welcome to <span className={highlight}>Yumigo</span>, where gourmet meets comfort. Explore a wide range of
            delicious meals crafted to elevate your taste.
          </p>
          <Link to="/menu">
            <button className={`px-6 py-3 rounded-xl font-semibold ${btnBg} ${btnHover} transition-all duration-300`}>
              Explore Menu
            </button>
          </Link>
        </div>

        {/* Image Section */}
        <div className="flex-1">
          <img
            src={heroImage}
            alt="Gourmet Meal"
            className="w-full rounded-2xl shadow-lg border border-[#FFD700]"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
