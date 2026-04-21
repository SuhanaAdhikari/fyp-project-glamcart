import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineHeart, AiOutlineSearch, AiOutlineShoppingCart } from "react-icons/ai";
import { BiMenuAltLeft } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { FiLogIn, FiUserPlus } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";
import { shoeCategoriesData } from "../../static/data";
import Cart from "../cart/Cart";
import Wishlist from "../Wishlist/Wishlist";
import DropDown from "./DropDown";
import Navbar from "./Navbar";

const Header = ({ activeHeading = 1 }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { allProducts } = useSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState("");
  const [dropDown, setDropDown] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const sellerLink = isSeller ? "/dashboard" : "/shop-create";

  const searchResults = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return [];

    const safeProducts = Array.isArray(allProducts) ? allProducts : [];

    return safeProducts
      .filter((product) => (product?.name || "").toLowerCase().includes(query))
      .slice(0, 6);
  }, [allProducts, searchTerm]);

  const closeMenu = () => setOpenMenu(false);

  const handleResultClick = () => {
    setSearchTerm("");
    setDropDown(false);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#dfd2c4] bg-[#f2ece4]/92 backdrop-blur">
        <div className="section-shell">
          <div className="hidden items-center gap-6 py-4 800px:flex">
            <Link to="/" className="shrink-0">
              <div className="rounded-[22px] border border-[#dfd2c4] bg-white px-4 py-3 shadow-[0_12px_28px_rgba(23,33,43,0.06)]">
                <p className="text-2xl font-extrabold tracking-tight text-[#17212b]">GlamCart</p>
                <p className="text-xs uppercase tracking-[0.18em] text-[#885e4a]">Beauty and lifestyle store</p>
              </div>
            </Link>

            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search products"
                className="field-input pr-11 !min-h-[56px] !rounded-[20px] bg-white"
              />
              <AiOutlineSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-[#687280]" />

              {searchResults.length > 0 && (
                <div className="surface-card absolute left-0 top-[calc(100%+12px)] z-50 w-full overflow-hidden !rounded-[24px]">
                  {searchResults.map((product) => (
                    <Link
                      key={product._id}
                      to={`/product/${product._id}`}
                      onClick={handleResultClick}
                      className="flex items-center gap-3 border-b border-[#dfd2c4] px-4 py-3 last:border-b-0 hover:bg-[#faf5ef]"
                    >
                      <div className="h-12 w-12 overflow-hidden rounded-2xl border border-[#dfd2c4] bg-[#faf5ef]">
                        <img
                          src={product?.images?.[0]?.url || "/placeholder.svg"}
                          alt={product?.name || "Product"}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#1f2937]">{product?.name}</p>
                        <p className="text-xs text-[#6b7280]">Open product details</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Link to={sellerLink} className="btn-primary !min-h-[48px] !px-5">
                {isSeller ? "Seller dashboard" : "Start selling"}
              </Link>

              <button
                type="button"
                onClick={() => setOpenWishlist(true)}
                className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[#dfd2c4] bg-white text-[#17212b]"
              >
                <AiOutlineHeart size={22} />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#1f2937] text-[11px] font-semibold text-white">
                  {wishlist?.length || 0}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setOpenCart(true)}
                className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[#dfd2c4] bg-white text-[#17212b]"
              >
                <AiOutlineShoppingCart size={22} />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#1f2937] text-[11px] font-semibold text-white">
                  {cart?.length || 0}
                </span>
              </button>

              {isAuthenticated ? (
                <Link to="/profile" className="overflow-hidden rounded-full border border-[#dfd2c4] bg-white shadow-[0_8px_18px_rgba(23,33,43,0.06)]">
                  <img
                    src={user?.avatar?.url || "/placeholder.svg"}
                    alt="User"
                    className="h-12 w-12 object-cover"
                  />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-[#dfd2c4] bg-white text-[#17212b]"
                >
                  <CgProfile size={22} />
                </Link>
              )}
            </div>
          </div>

          <div className="hidden items-center justify-between gap-4 py-3 800px:flex">
            <div className="surface-card-sm flex w-full items-center justify-between gap-4 bg-white px-4 py-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropDown((value) => !value)}
                className="btn-secondary !min-h-[46px] !rounded-[16px] !px-5"
              >
                Browse categories
                <IoIosArrowDown />
              </button>

              {dropDown && <DropDown categoriesData={shoeCategoriesData} setDropDown={setDropDown} />}
            </div>

            <Navbar active={activeHeading} />
            </div>
          </div>

          <div className="flex items-center justify-between py-3 800px:hidden">
            <button
              type="button"
              onClick={() => setOpenMenu(true)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[#dfd2c4] bg-white text-[#17212b]"
            >
              <BiMenuAltLeft size={24} />
            </button>

            <Link to="/" className="rounded-full border border-[#dfd2c4] bg-white px-4 py-2 text-lg font-extrabold tracking-tight text-[#17212b] shadow-[0_10px_22px_rgba(23,33,43,0.05)]">
              GlamCart
            </Link>

            <button
              type="button"
              onClick={() => setOpenCart(true)}
              className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[#dfd2c4] bg-white text-[#17212b]"
            >
              <AiOutlineShoppingCart size={22} />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#1f2937] text-[11px] font-semibold text-white">
                {cart?.length || 0}
              </span>
            </button>
          </div>
        </div>
      </header>

      {openMenu && (
        <div className="fixed inset-0 z-[999] bg-black/30 p-4 800px:hidden">
          <div className="ml-auto h-full w-full max-w-[340px] overflow-y-auto rounded-[28px] border border-[#dfd2c4] bg-[#f2ece4] p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xl font-extrabold text-[#1f2937]">Menu</span>
              <button
                type="button"
                onClick={closeMenu}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#dfd2c4] bg-white"
              >
                <RxCross1 />
              </button>
            </div>

            <div className="mt-5">
              <Navbar active={activeHeading} vertical onNavigate={closeMenu} />
            </div>

            <div className="mt-6 space-y-3">
              <p className="text-sm font-semibold text-[#1f2937]">Popular categories</p>
              <div className="flex flex-wrap gap-2">
                {shoeCategoriesData.slice(0, 6).map((item) => (
                  <Link
                    key={item.id}
                    to={`/products?category=${encodeURIComponent(item.title)}`}
                    onClick={closeMenu}
                    className="muted-chip"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <Link to={sellerLink} onClick={closeMenu} className="btn-secondary !w-full">
                {isSeller ? "Seller dashboard" : "Start selling"}
              </Link>
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  setOpenWishlist(true);
                }}
                className="btn-secondary !w-full"
              >
                <AiOutlineHeart />
                Wishlist ({wishlist?.length || 0})
              </button>
            </div>

            <div className="mt-6 border-t border-[#dfd2c4] pt-6">
              {isAuthenticated ? (
                <Link to="/profile" onClick={closeMenu} className="flex items-center gap-3">
                  <img
                    src={user?.avatar?.url || "/placeholder.svg"}
                    alt="User"
                    className="h-12 w-12 rounded-full border border-[#dfd2c4] object-cover"
                  />
                  <div>
                    <p className="font-semibold text-[#1f2937]">{user?.name || "My account"}</p>
                    <p className="text-sm text-[#6b7280]">Open profile</p>
                  </div>
                </Link>
              ) : (
                <div className="grid gap-3">
                  <Link to="/login" onClick={closeMenu} className="btn-primary !w-full">
                    <FiLogIn />
                    Login
                  </Link>
                  <Link to="/sign-up" onClick={closeMenu} className="btn-secondary !w-full">
                    <FiUserPlus />
                    Create account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {openCart && <Cart setOpenCart={setOpenCart} />}
      {openWishlist && <Wishlist setOpenWishlist={setOpenWishlist} />}
    </>
  );
};

export default Header;
