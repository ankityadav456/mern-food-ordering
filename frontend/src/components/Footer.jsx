const Footer = () => {
    return (
      <footer className="bg-[#0f0f0f] text-[#888888] text-xs text-center py-3 border-t border-[#222]">
        © {new Date().getFullYear()} <span className="text-[#FFD700] font-semibold">Yumigo</span>. All rights reserved.
      </footer>
    );
  };
  
  export default Footer;
  