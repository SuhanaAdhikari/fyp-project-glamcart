import React, { useMemo, useState } from "react"
import { AiOutlineGift } from "react-icons/ai"
import { MdOutlineLocalOffer } from "react-icons/md"
import { FiPackage, FiShoppingBag } from "react-icons/fi"
import { BiMessageSquareDetail } from "react-icons/bi"
import { useSelector } from "react-redux"
import { Link, useLocation } from "react-router-dom"
import { RxCross2 } from "react-icons/rx"
import { HiOutlineSparkles } from "react-icons/hi2"
import logo from "../../../Assests/logo.png"

const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { pathname } = useLocation()

  const navItems = useMemo(
    () => [
      { title: "Coupons", icon: <AiOutlineGift size={20} />, link: "/dashboard/cupouns" },
      { title: "Events", icon: <MdOutlineLocalOffer size={20} />, link: "/dashboard-events" },
      { title: "Products", icon: <FiShoppingBag size={20} />, link: "/dashboard-products" },
      { title: "Orders", icon: <FiPackage size={20} />, link: "/dashboard-orders" },
      { title: "Messages", icon: <BiMessageSquareDetail size={20} />, link: "/dashboard-messages" },
    ],
    []
  )

  const isActive = (link) => pathname === link || pathname.startsWith(link)

  return (
    <header className="sticky top-0 left-0 z-40 w-full">
      {/* Ultra soft feminine background */}
      <div className="relative">
        <div className="absolute inset-0 bg-[#0b1020]" />
        <div className="absolute inset-0 opacity-100 bg-[radial-gradient(1100px_260px_at_15%_0%,rgba(236,72,153,0.22),transparent_60%),radial-gradient(900px_240px_at_85%_20%,rgba(168,85,247,0.20),transparent_60%),radial-gradient(800px_260px_at_50%_120%,rgba(255,255,255,0.06),transparent_60%)]" />

        {/* Satin texture overlay (subtle) */}
        <div className="absolute inset-0 opacity-[0.16] bg-[linear-gradient(115deg,rgba(255,255,255,0.10)_0%,rgba(255,255,255,0.02)_25%,rgba(255,255,255,0.10)_50%,rgba(255,255,255,0.02)_75%,rgba(255,255,255,0.10)_100%)]" />
        <div className="absolute inset-0 opacity-[0.10] bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_80%_35%,rgba(255,255,255,0.14),transparent_40%)]" />

        {/* Top hairline glow */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-pink-500/0 via-pink-400/50 to-violet-500/0" />

        <div className="relative border-b border-white/10">
          <div className="mx-auto max-w-[1400px] px-4 lg:px-8 h-[74px] flex items-center justify-between">
            {/* Left: Logo + badge */}
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="flex items-center gap-3">
                <img src={logo || "/placeholder.svg"} alt="Logo" className="w-[118px] h-auto object-contain" />
              </Link>

              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-xl">
                <HiOutlineSparkles className="text-pink-300" />
                <span className="text-xs text-white/80 font-semibold tracking-wide">Glam Seller</span>
              </div>
            </div>

            {/* Desktop nav: elegant pill tabs */}
            <nav className="hidden 800px:flex items-center">
              <div className="relative rounded-full bg-white/10 border border-white/15 backdrop-blur-xl p-1 shadow-[0_20px_40px_-25px_rgba(0,0,0,0.85)]">
                {/* inner shine */}
                <div className="pointer-events-none absolute inset-0 rounded-full opacity-[0.35] bg-[linear-gradient(to_bottom,rgba(255,255,255,0.18),rgba(255,255,255,0.02))]" />
                <div className="relative flex items-center gap-1">
                  {navItems.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.link}
                      className={`group relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all
                        ${
                          isActive(item.link)
                            ? "bg-white text-[#0b1020] shadow-[0_18px_35px_-20px_rgba(255,255,255,0.9)]"
                            : "text-white/80 hover:text-white hover:bg-white/10"
                        }`}
                    >
                      <span
                        className={`transition ${
                          isActive(item.link) ? "text-[#0b1020]" : "text-white/80 group-hover:text-white"
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span className="whitespace-nowrap">{item.title}</span>

                      {/* soft underline shimmer */}
                      <span className="pointer-events-none absolute left-4 right-4 -bottom-[7px] h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-pink-400/0 via-pink-400/60 to-violet-500/0" />
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            {/* Right: profile + mobile menu */}
            <div className="flex items-center gap-3">
              {/* Desktop profile */}
              <Link
                to={`/shop/${seller?._id}`}
                className="hidden 800px:flex items-center gap-3 rounded-2xl bg-white/10 border border-white/15 px-3 py-2 hover:bg-white/15 transition backdrop-blur-xl"
              >
                <div className="relative">
                  <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-pink-500/35 to-violet-600/35 blur-[6px]" />
                  <img
                    src={seller?.avatar?.url || "/placeholder.svg"}
                    alt={seller?.name || "Shop"}
                    className="relative w-[40px] h-[40px] rounded-2xl object-cover border border-white/20"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#0b1020]" />
                </div>

                <div className="hidden xl:block leading-tight">
                  <p className="text-sm font-bold text-white max-w-[170px] truncate">{seller?.name || "Your Shop"}</p>
                  <p className="text-xs text-white/60">View shop</p>
                </div>
              </Link>

              {/* Mobile avatar */}
              <Link to={`/shop/${seller?._id}`} className="800px:hidden relative">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-pink-500/35 to-violet-600/35 blur-[7px]" />
                <img
                  src={seller?.avatar?.url || "/placeholder.svg"}
                  alt={seller?.name || "Shop"}
                  className="relative w-[40px] h-[40px] rounded-2xl object-cover border border-white/20"
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0b1020]" />
              </Link>

              {/* Mobile toggle */}
              <button
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="800px:hidden inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-white/10 border border-white/15 text-white hover:bg-white/15 transition"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <RxCross2 size={22} /> : <span className="text-[20px] font-black">≡</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu (beauty drawer) */}
        {mobileMenuOpen && (
          <div className="800px:hidden border-b border-white/10 bg-[#0b1020]/92 backdrop-blur-xl">
            <div className="mx-auto max-w-[1400px] px-4 py-4">
              <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden shadow-[0_25px_60px_-35px_rgba(0,0,0,0.9)]">
                <div className="px-5 py-3 border-b border-white/10 flex items-center justify-between">
                  <p className="text-sm font-semibold text-white/85">Navigation</p>
                  <span className="text-xs text-white/55">Tap to open</span>
                </div>

                <div className="p-2">
                  {navItems.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.link}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`group flex items-center gap-3 px-4 py-3 rounded-2xl transition
                        ${
                          isActive(item.link)
                            ? "bg-white text-[#0b1020]"
                            : "text-white/85 hover:bg-white/10 hover:text-white"
                        }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition
                          ${
                            isActive(item.link)
                              ? "bg-[#0b1020]/5 border-black/10"
                              : "bg-white/5 border-white/10"
                          }`}
                      >
                        {item.icon}
                      </div>

                      <div className="flex-1">
                        <p className="font-semibold">{item.title}</p>
                        <p className={`text-xs ${isActive(item.link) ? "text-black/60" : "text-white/55"}`}>
                          Manage {item.title.toLowerCase()}
                        </p>
                      </div>

                      <span className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 opacity-70 group-hover:opacity-100 transition" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-white/60">
                  Tip: Upload high-quality product photos to increase conversions.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default DashboardHeader
