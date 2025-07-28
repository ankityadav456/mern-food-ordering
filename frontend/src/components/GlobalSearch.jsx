import { useState, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";

const GlobalSearch = ({ query, setQuery, theme }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      setLoading(true);
      const timeout = setTimeout(() => setLoading(false), 500);
      return () => clearTimeout(timeout);
    } else {
      setLoading(false);
    }
  }, [query]);

  const clearSearch = () => {
    setQuery("");
    setLoading(false);
  };

  return (
    <div className="relative w-full max-w-md animate-slideUp">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search food items..."
        className={`w-full py-2.5 pr-12 pl-10 rounded-full border-[1.5px] text-sm md:text-base focus:outline-none focus:ring-2 transition
          ${
            theme === "dark"
              ? "bg-[#1A1A1A] text-white border-[#FFB300] placeholder-gray-400 focus:ring-[#FF5722]"
              : "bg-white text-black border-[#FFB300] placeholder-gray-500 focus:ring-[#FF5722]"
          }`}
        style={{
          boxShadow:
            theme === "dark"
              ? "0 0 6px rgba(255, 87, 34, 0.4)"
              : "0 0 4px rgba(255, 87, 34, 0.2)",
        }}
      />

      {/* Search Icon (Left - Centered) */}
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#ff562294] dark:text-[#eec461b6]"
      />

      {/* Loader or Clear Icon (Right - Centered) */}
      {loading ? (
     <Loader2
  className="absolute right-4 top-3.5 -translate-y-1/2 w-5 h-5 text-[#ff562294] dark:text-[#eec461b6] animate-spinSlowReverse"
/>

      ) : (
        query && (
          <X
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer text-[#ff562294] dark:text-[#eec461b6] hover:text-red-500 transition"
          />
        )
      )}
    </div>
  );
};

export default GlobalSearch;
