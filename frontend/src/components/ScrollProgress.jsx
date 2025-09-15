import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrolled = (scrollTop / docHeight) * 100;
      setScroll(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-0.5 z-50 bg-white/20 dark:bg-black/20">
      <div 
        className="h-1 bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-primary-dark dark:to-secondary-dark transition-all"
        style={{ width: `${scroll}%` }}
      />
    </div>
  );
}
