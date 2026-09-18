import { useState, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";

const GlobalSearch = ({ query, setQuery, theme }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      setLoading(true);
      const timeout = setTimeout(() => setLoading(false), 300);
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
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search food items..."
        className={`w-full py-2 pl-10 pr-10 rounded-full text-sm border transition-all duration-200 focus:outline-none focus:ring-2 ${
          theme === "dark"
            ? "bg-white/[0.06] hover:bg-white/[0.08] focus:bg-white/[0.1] border-white/10 text-white placeholder-neutral-400 focus:border-orange-500/60 focus:ring-orange-500/20"
            : "bg-gray-100/80 hover:bg-gray-100 focus:bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:ring-orange-500/20"
        }`}
      />

      {/* Search Icon */}
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

      {/* Loading or Clear Icon */}
      {loading ? (
        <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500 animate-spin" />
      ) : (
        query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-gray-400 hover:text-gray-600 dark:hover:text-white transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )
      )}
    </div>
  );
};

export default GlobalSearch;
