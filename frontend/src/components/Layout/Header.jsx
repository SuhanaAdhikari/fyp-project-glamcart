import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
// import logo from "../../Assests/logo.png"
import { shoeCategoriesData } from "../../static/data"
import { AiOutlineSearch, AiOutlineHeart, AiOutlineShoppingCart } from "react-icons/ai"
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io"
import { CgProfile } from "react-icons/cg"
import { BiMenuAltLeft } from "react-icons/bi"
import DropDown from "./DropDown"
import Navbar from "./Navbar"
import { useSelector } from "react-redux"
import Cart from "../cart/Cart"
import Wishlist from "../Wishlist/Wishlist"
import { RxCross1 } from "react-icons/rx"
import { FiLogIn } from "react-icons/fi"
import { FaUserPlus } from "react-icons/fa"

const BRAND = {
  name: "GlamCart ",
  primary: "#c084fc", // glam lavender
  dark: "#1f1b2e",
  accent: "#f472b6", // glam pink
}

const Header = ({ activeHeading }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user)
  const { isSeller } = useSelector((state) => state.seller)
  const { wishlist } = useSelector((state) => state.wishlist)
  const { cart } = useSelector((state) => state.cart)
  const { allProducts } = useSelector((state) => state.products)

  const [searchTerm, setSearchTerm] = useState("")
  const [searchData, setSearchData] = useState([])
  const [dropDown, setDropDown] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const [openCart, setOpenCart] = useState(false)
  const [openWishlist, setOpenWishlist] = useState(false)
  const [open, setOpen] = useState(false)

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)

    const safeProducts = Array.isArray(allProducts) ? allProducts : []
    setSearchData(
      value.trim()
        ? safeProducts.filter((p) => (p?.name || "").toLowerCase().includes(value.toLowerCase()))
        : [],
    )
  }

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 70)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleProductClick = () => {
    setSearchTerm("")
    setSearchData([])
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <>
      {/* Desktop Top Header */}
      <div className="hidden 800px:flex items-center justify-between py-4 px-6 shadow-sm bg-white z-40 relative border-b border-gray-100">
        <Link to="/" className="flex items-center gap-2">
          {/* <img src={logo} alt={BRAND.name} className="w-[48px] h-[48px] object-contain" /> */}
          <span className="text-2xl font-extrabold tracking-wide text-[#1f1b2e]">
            GlamCart 
          </span>
        </Link>

        {/* Search */}
        <div className="relative flex-grow max-w-[720px] mx-6 z-50">
          <input
            type="text"
            placeholder="Search beauty, skincare & glam essentials..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="h-[44px] w-full px-4 pr-10 border border-gray-200 rounded-xl outline-none focus:border-[#c084fc] focus:ring-2 focus:ring-[#c084fc]/20 transition bg-white shadow-sm"
          />
          <AiOutlineSearch className="absolute right-3 top-[11px] text-gray-500 cursor-pointer text-xl hover:text-[#c084fc] transition" />

          {searchData.length > 0 && (
            <div className="absolute top-[115%] left-0 w-full bg-white shadow-2xl rounded-xl p-2 z-50 border border-gray-100 max-h-[500px] overflow-y-auto">
              {searchData.map((product, index) => (
                <Link to={`/product/${product._id}`} key={product?._id || index} onClick={handleProductClick}>
                  <div className="flex items-center p-2 hover:bg-[#faf5ff] rounded-lg transition">
                    <img
                      src={product?.images?.[0]?.url || "/placeholder.svg"}
                      alt={product?.name || "Product"}
                      className="w-[44px] h-[44px] mr-3 rounded-lg object-cover border border-gray-100"
                    />
                    <div className="flex flex-col">
                      <h1 className="text-sm font-semibold text-[#1f1b2e]">{product?.name}</h1>
                      <p className="text-xs text-gray-500">Tap to view</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Seller CTA */}
        <Link to={isSeller ? "/dashboard" : "/shop-create"}>
          <button className="bg-gradient-to-r from-[#c084fc] to-[#f472b6] text-white px-5 py-2.5 rounded-xl flex items-center font-semibold shadow-md hover:shadow-lg transition-transform transform hover:scale-[1.03]">
            {isSeller ? "Seller Dashboard" : "Sell on GlamCart"}
            <IoIosArrowForward className="ml-1 text-lg" />
          </button>
        </Link>
      </div>

      {/* Sticky Navbar (Desktop) */}
      <div
        className={`w-full h-[72px] px-4 flex items-center transition-all duration-300 border-b border-white/10 bg-gradient-to-r from-[#1f1b2e] to-[#2d1f47] ${
          isSticky ? "fixed top-0 left-0 shadow-2xl z-50" : "relative"
        } 800px:flex hidden`}
      >
        <div className="relative flex items-center justify-between w-full max-w-[1200px] mx-auto">
          {/* Categories */}
          <div className="relative flex-shrink-0">
            <button
              className="flex items-center w-[220px] h-[50px] bg-white text-[#1f1b2e] text-[15px] font-semibold rounded-xl px-4 shadow-lg hover:bg-[#fff7ff] transition"
              onClick={() => setDropDown(!dropDown)}
            >
              <BiMenuAltLeft size={24} className="mr-2 text-[#c084fc]" />
              Beauty Categories
              <IoIosArrowDown size={20} className="ml-auto text-[#c084fc]" />
            </button>
            {dropDown && <DropDown categoriesData={shoeCategoriesData} setDropDown={setDropDown} />}
          </div>

          {/* Nav links */}
          <div className="flex space-x-6 text-white">
            <Navbar active={activeHeading} />
          </div>

          {/* Icons */}
          <div className="flex space-x-6 items-center">
            <button type="button" className="relative group" onClick={() => setOpenWishlist(true)}>
              <AiOutlineHeart size={30} className="text-white hover:text-[#f472b6] transition" />
              <span className="absolute -top-2 -right-2 bg-white rounded-full w-5 h-5 text-[#1f1b2e] text-xs flex items-center justify-center font-bold">
                {wishlist?.length || 0}
              </span>
            </button>

            <button type="button" className="relative group" onClick={() => setOpenCart(true)}>
              <AiOutlineShoppingCart size={30} className="text-white hover:text-[#f472b6] transition" />
              <span className="absolute -top-2 -right-2 bg-white rounded-full w-5 h-5 text-[#1f1b2e] text-xs flex items-center justify-center font-bold">
                {cart?.length || 0}
              </span>
            </button>

            {isAuthenticated ? (
              <Link to="/profile" className="group relative">
                <img
                  src={user?.avatar?.url || "/placeholder.svg"}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full border-2 border-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:border-[#f472b6]"
                />
              </Link>
            ) : (
              <Link to="/login" className="flex items-center">
                <CgProfile size={30} className="text-white hover:text-[#f472b6] transition" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="w-full 800px:hidden fixed bg-white z-50 top-0 left-0 shadow-md border-b border-gray-100">
        <div className="w-full flex items-center justify-between px-4 py-2">
          <BiMenuAltLeft size={30} onClick={() => setOpen(true)} className="text-[#1f1b2e]" />

          <Link to="/" className="flex items-center gap-2">
            <img  alt={BRAND.name} className="h-[44px]" />
            <span className="font-extrabold text-lg text-[#1f1b2e]">
              GlamCart <span className="text-[#c084fc]">US</span>
            </span>
          </Link>

          <button
            type="button"
            className="relative group flex items-center justify-center w-10 h-10"
            onClick={() => setOpenCart(true)}
          >
            <AiOutlineShoppingCart size={28} className="text-[#1f1b2e] hover:text-[#c084fc] transition" />
            <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-[#c084fc] to-[#f472b6] rounded-full w-5 h-5 text-white text-[10px] flex items-center justify-center font-bold">
              {cart?.length || 0}
            </span>
          </button>
        </div>

        {/* Sidebar */}
        {open && (
          <div className="fixed w-full bg-black bg-opacity-40 z-40 h-full top-0 left-0">
            <div className="fixed w-[70%] bg-white h-full top-0 left-0 z-50 overflow-y-auto">
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <AiOutlineHeart size={26} className="text-[#f472b6]" />
                  <span className="font-extrabold text-base text-[#1f1b2e]">
                    GlamCart <span className="text-[#c084fc]">US</span>
                  </span>
                </div>
                <RxCross1 size={26} onClick={() => setOpen(false)} className="text-[#1f1b2e]" />
              </div>

              <div className="px-3">
                <Navbar active={activeHeading} />
              </div>

              <div className="px-6 mt-4">
                <Link to={isSeller ? "/dashboard" : "/shop-create"} onClick={() => setOpen(false)}>
                  <button className="w-full bg-gradient-to-r from-[#c084fc] to-[#f472b6] text-white px-5 py-3 rounded-xl flex items-center justify-center font-semibold hover:shadow-lg transition">
                    {isSeller ? "Seller Dashboard" : "Start Selling on GlamCart"}
                    <IoIosArrowForward className="ml-1 text-lg" />
                  </button>
                </Link>
              </div>

              <div className="flex w-full justify-center mt-6 pb-10">
                {isAuthenticated ? (
                  <Link to="/profile" onClick={() => setOpen(false)}>
                    <div className="w-24 h-24 rounded-full overflow-hidden border-[3px] border-[#c084fc] shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer">
                      <img
                        src={user?.avatar?.url || "/placeholder.svg"}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>
                ) : (
                  <div className="flex flex-col gap-3 px-6 w-full">
                    <Link to="/login" onClick={() => setOpen(false)}>
                      <button className="w-full bg-[#1f1b2e] text-white px-6 py-3 rounded-xl flex items-center justify-center font-semibold hover:bg-black transition shadow">
                        <FiLogIn className="mr-2 text-[18px]" /> Login
                      </button>
                    </Link>
                    <Link to="/signup" onClick={() => setOpen(false)}>
                      <button className="w-full bg-gradient-to-r from-[#c084fc] to-[#f472b6] text-white px-6 py-3 rounded-xl flex items-center justify-center font-semibold hover:shadow-lg transition shadow">
                        <FaUserPlus className="mr-2 text-[18px]" /> Sign Up
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {openCart && <Cart setOpenCart={setOpenCart} />}
      {openWishlist && <Wishlist setOpenWishlist={setOpenWishlist} />}
    </>
  )
}

export default Header
