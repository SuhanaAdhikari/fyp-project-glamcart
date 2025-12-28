import React, { useEffect, useState } from "react"
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard"
import { addToWishlist, removeFromWishlist } from "../../../redux/actions/wishlist"
import { addTocart } from "../../../redux/actions/cart"
import { toast } from "react-toastify"
import Ratings from "../../Products/Ratings"

const ProductCard = ({ data, isEvent }) => {
  const { wishlist } = useSelector((state) => state.wishlist)
  const { cart } = useSelector((state) => state.cart)
  const [click, setClick] = useState(false)
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) setClick(true)
    else setClick(false)
  }, [wishlist, data._id])

  const removeFromWishlistHandler = (item) => {
    setClick(false)
    dispatch(removeFromWishlist(item))
  }

  const addToWishlistHandler = (item) => {
    setClick(true)
    dispatch(addToWishlist(item))
  }

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id)
    if (isItemExists) return toast.error("Item already in cart!")
    if (data.stock < 1) return toast.error("Product stock limited!")

    dispatch(addTocart({ ...data, qty: 1 }))
    toast.success("Item added to cart successfully!")
  }

  const productLink = isEvent ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`

  const showOriginal = Boolean(data.originalPrice)
  const finalPrice = data.originalPrice === 0 ? data.originalPrice : data.discountPrice

  const discountPercent =
    showOriginal && data.originalPrice > 0
      ? Math.round(((data.originalPrice - data.discountPrice) / data.originalPrice) * 100)
      : null

  return (
    <>
      <div
        className="
          group relative
          rounded-[26px]
          border border-gray-200
          bg-white
          overflow-hidden
          shadow-sm
          hover:shadow-xl
          transition-all duration-300
        "
      >
        {/* Gradient ring (beauty style) */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition duration-300">
          <div className="absolute -inset-[2px] rounded-[28px] bg-gradient-to-r from-pink-500/30 via-fuchsia-500/20 to-violet-600/30" />
        </div>

        {/* ================= HERO IMAGE ================= */}
        <div className="relative h-[260px]">
          {/* Image as cover */}
          <Link to={productLink} className="block h-full">
            <img
              src={data?.images?.[0]?.url}
              alt={data?.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
            />
          </Link>

          {/* Soft overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

          {/* Wishlist pill (top-left) */}
          <button
            type="button"
            onClick={() => (click ? removeFromWishlistHandler(data) : addToWishlistHandler(data))}
            className="
              absolute top-4 left-4
              inline-flex items-center gap-2
              px-3 py-2 rounded-full
              bg-white/85 backdrop-blur
              border border-white/40
              shadow-sm
              hover:bg-white
              transition
              text-sm font-semibold text-gray-800
            "
          >
            {click ? <AiFillHeart size={18} color="#e11d48" /> : <AiOutlineHeart size={18} />}
            <span className="hidden sm:block">{click ? "Saved" : "Save"}</span>
          </button>

          {/* Discount badge (top-right) */}
          {discountPercent ? (
            <div className="absolute top-4 right-4">
              <span className="px-3 py-2 rounded-full text-xs font-extrabold text-white bg-gradient-to-r from-pink-500 to-violet-600 shadow">
                -{discountPercent}%
              </span>
            </div>
          ) : null}

          {/* Hover actions in center */}
          <div
            className="
              absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
              opacity-0 scale-95
              group-hover:opacity-100 group-hover:scale-100
              transition duration-300
              flex gap-3
            "
          >
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="
                px-5 py-2.5 rounded-full
                bg-white/90 backdrop-blur
                border border-white/40
                text-gray-900 font-semibold text-sm
                hover:bg-white
                shadow
              "
            >
              Quick View
            </button>

            <button
              type="button"
              onClick={() => addToCartHandler(data._id)}
              className="
                px-5 py-2.5 rounded-full
                bg-gradient-to-r from-[#14152b] to-black
                text-white font-semibold text-sm
                shadow
                hover:opacity-95
              "
            >
              Add to Cart
            </button>
          </div>

          {/* Bottom chip row */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur border border-white/20">
              {data?.sold_out || 0} sold
            </span>

            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur border border-white/20">
              In stock: {data?.stock || 0}
            </span>
          </div>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="p-5">
          {/* Product name */}
          <Link to={productLink}>
            <h3 className="text-[15px] md:text-[16px] font-extrabold text-[#14152b] leading-snug line-clamp-2">
              {data?.name}
            </h3>
          </Link>

          {/* Price block (beauty tag style) */}
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex items-end gap-2">
              <span className="text-[18px] font-extrabold text-gray-900">Rs.{finalPrice}</span>

              {showOriginal ? (
                <span className="text-sm text-gray-400 line-through">Rs.{data?.originalPrice}</span>
              ) : null}
            </div>

            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-gray-50 border border-gray-200 text-gray-700">
              Beauty Pick ✨
            </span>
          </div>

          {/* Signature row (rating + shop) */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ratings rating={data?.ratings} />
              <span className="text-xs font-semibold text-gray-600">
                {data?.ratings ? Number(data.ratings).toFixed(1) : ""}
              </span>
            </div>

            <Link to={`/shop/preview/${data?.shop?._id}`}>
              <span className="text-xs font-bold text-[#3d569a] hover:underline">
                {data?.shop?.name}
              </span>
            </Link>
          </div>
        </div>

        {open ? <ProductDetailsCard setOpen={setOpen} data={data} /> : null}
      </div>
    </>
  )
}

export default ProductCard
