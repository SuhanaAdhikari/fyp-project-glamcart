import React from "react"
import { Link } from "react-router-dom"

const Navbar = ({ active }) => {
  const navItems = [
    { id: 1, title: "Home", link: "/" },
    { id: 2, title: "Best Selling", link: "/best-selling" },
    { id: 3, title: "Products", link: "/products" },
    { id: 4, title: "Offers", link: "/offers" },
    { id: 5, title: "FAQ", link: "/faq" },
  ]

  const activeIndex = Math.max(0, navItems.findIndex((i) => i.id === active))
  const itemWidth = 120 // keeps it compact + consistent

  return (
    <div className="w-full flex justify-center">
      <div
        className="
          relative
          w-fit
          px-3 py-2
          rounded-full
          bg-white/85
          backdrop-blur-md
          border border-pink-200/60
          shadow-[0_10px_30px_rgba(236,72,153,0.18)]
          flex items-center
          gap-1
        "
      >
        {/* Active moving pill */}
        <div
          className="
            absolute top-1 bottom-1
            rounded-full
            bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-600
            shadow-[0_10px_25px_rgba(168,85,247,0.28)]
            transition-transform duration-300 ease-out
          "
          style={{
            width: itemWidth,
            transform: `translateX(${activeIndex * itemWidth}px)`,
          }}
        />

        {navItems.map((item) => {
          const isActive = active === item.id
          return (
            <Link
              key={item.id}
              to={item.link}
              className={`
                relative z-10
                h-10
                flex items-center justify-center
                rounded-full
                px-5
                text-[15px] font-semibold
                tracking-wide
                transition-all duration-200
                ${isActive ? "text-white" : "text-gray-700 hover:text-gray-900"}
              `}
              style={{ width: itemWidth }}
            >
              {item.title}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default Navbar
