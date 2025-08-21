// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    gsap.to(window, {
      duration: 0.3,
      scrollTo: { y: 0 },
      ease: "power3.out",
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
