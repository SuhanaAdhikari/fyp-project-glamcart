import React from "react";
import { Link } from "react-router-dom";

const navItems = [
  { id: 1, title: "Home", link: "/" },
  { id: 2, title: "Best Selling", link: "/best-selling" },
  { id: 3, title: "Products", link: "/products" },
  { id: 4, title: "Offers", link: "/offers" },
  { id: 5, title: "FAQ", link: "/faq" },
];

const Navbar = ({ active = 1, vertical = false, onNavigate }) => {
  return (
    <nav className={vertical ? "flex flex-col gap-2" : "flex flex-wrap items-center gap-2"}>
      {navItems.map((item) => {
        const isActive = active === item.id;

        return (
          <Link
            key={item.id}
            to={item.link}
            onClick={onNavigate}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "border-[#1f2937] bg-[#1f2937] text-white"
                : "border-[#e6ddd2] bg-white text-[#1f2937] hover:bg-[#fbf8f3]"
            }`}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
};

export default Navbar;
