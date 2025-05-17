import { useTheme } from "../context/ThemeContext";

const Footer = () => {
  const { theme } = useTheme();

  const bgColor = theme === "dark" ? "#0d0d0d" : "#FAF9F6";
  const textColor = theme === "dark" ? "#888888" : "#444";
  const borderColor = theme === "dark" ? "#2A2A2A" : "#D4AF37";
  const gold = theme === "dark" ? "#D4AF37" : "#B8860B";

  return (
    <footer
      className="text-sm text-center py-3 border-t transition-all duration-300"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        borderTopColor: borderColor,
      }}
    >
      © {new Date().getFullYear()}{" "}
      <span className="font-semibold" style={{ color: gold }}>
        Yumigo
      </span>
      . All rights reserved.
    </footer>
  );
};

export default Footer;
