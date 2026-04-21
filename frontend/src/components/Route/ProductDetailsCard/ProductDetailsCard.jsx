"use client"

import { useEffect, useState } from "react"
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai"
import { RxCross1 } from "react-icons/rx"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { addTocart } from "../../../redux/actions/cart"
import { addToWishlist, removeFromWishlist } from "../../../redux/actions/wishlist"

const ProductDetailsCard = ({ setOpen, data }) => {
  const { cart } = useSelector((state) => state.cart)
  const { wishlist } = useSelector((state) => state.wishlist)
  const dispatch = useDispatch()
  const [count, setCount] = useState(1)
  const [click, setClick] = useState(false)

  const handleMessageSubmit = () => {}

  const decrementCount = () => {
    if (count > 1) setCount(count - 1)
  }

  const incrementCount = () => {
    setCount(count + 1)
  }

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id)
    if (isItemExists) {
      toast.error("Item already in cart!")
    } else {
      if (data.stock < count) {
        toast.error("Product stock limited!")
      } else {
        const cartData = { ...data, qty: count }
        dispatch(addTocart(cartData))
        toast.success("Item added to cart successfully!")
      }
    }
  }

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) setClick(true)
    else setClick(false)
  }, [wishlist, data._id])

  const removeFromWishlistHandler = (data) => {
    setClick(!click)
    dispatch(removeFromWishlist(data))
  }

  const addToWishlistHandler = (data) => {
    setClick(!click)
    dispatch(addToWishlist(data))
  }

  // ✅ IMPORTANT: lock background scroll while modal is open (makes it feel premium)
  useEffect(() => {
    if (!data) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [data])

  const discountPercent =
    data?.originalPrice && data?.originalPrice > 0
      ? Math.round(((data.originalPrice - data.discountPrice) / data.originalPrice) * 100)
      : null

  if (!data) return null

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-3"
      onClick={() => setOpen(false)} // click outside closes
    >
      {/* Dialog */}
      <div
        className="
          w-[96%] max-w-[1100px]
          h-[92vh] md:h-[78vh]
          bg-white rounded-2xl
          shadow-2xl
          overflow-hidden
          flex flex-col
        "
        onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
        role="dialog"
        aria-modal="true"
      >
        {/* Top Accent */}
        <div
          className="h-[4px] w-full"
          style={{ background: "linear-gradient(90deg, #a67861, #885e4a)" }}
        />

        {/* Sticky Header (clean) */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="px-5 py-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-500">Quick View</p>
              <h2 className="text-base md:text-lg font-bold text-gray-900 truncate">
                {data.name}
              </h2>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="shrink-0 w-10 h-10 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center"
              title="Close"
            >
              <RxCross1 size={18} className="text-gray-800" />
            </button>
          </div>
        </div>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5 md:p-7 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* ================= LEFT ================= */}
            <div>
              {/* Image */}
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <img
                  src={`${data.images && data.images[0]?.url}` || "/placeholder.svg"}
                  alt={data.name}
                  className="w-full h-[320px] md:h-[360px] object-contain"
                />
              </div>

              {/* Shop Row */}
              <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4 flex items-center justify-between gap-4">
                <Link to={`/shop/preview/${data.shop._id}`} className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 shrink-0">
                    <img
                      src={`${data.shop?.avatar?.url || data.images?.[0]?.url}` || "/placeholder.svg"}
                      alt={data.shop?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{data.shop?.name}</p>
                    <p className="text-xs text-gray-500">
                      {data?.ratings || 0} ratings • <span className="text-[#885e4a] font-semibold">View shop</span>
                    </p>
                  </div>
                </Link>

                <span className="text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full">
                  {data.sold_out || 0} sold
                </span>
              </div>

              {/* Message */}
              <button
                className="
                  w-full mt-4
                  rounded-xl
                  border border-gray-200
                  bg-white hover:bg-gray-50
                  text-gray-900 font-semibold
                  py-3
                  flex items-center justify-center gap-2
                "
                onClick={handleMessageSubmit}
              >
                <AiOutlineMessage />
                Message Seller
              </button>
            </div>

            {/* ================= RIGHT ================= */}
            <div className="flex flex-col">
              {/* Top chips */}
              <div className="flex items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-200">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: "linear-gradient(90deg, #a67861, #885e4a)" }}
                  />
                  <span className="text-xs font-semibold text-gray-700">{data.category}</span>
                </div>

                {/* Wishlist */}
                <button
                  className="w-11 h-11 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center"
                  title={click ? "Remove from wishlist" : "Add to wishlist"}
                >
                  {click ? (
                    <AiFillHeart
                      size={22}
                      className="cursor-pointer text-red-500"
                      onClick={() => removeFromWishlistHandler(data)}
                    />
                  ) : (
                    <AiOutlineHeart
                      size={22}
                      className="cursor-pointer text-gray-900"
                      onClick={() => addToWishlistHandler(data)}
                    />
                  )}
                </button>
              </div>

              {/* Description */}
              <p className="mt-4 text-sm md:text-[15px] text-gray-600 leading-relaxed">
                {data.description}
              </p>

              {/* Price Box (premium + compact) */}
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-end gap-3 flex-wrap">
                    <p className="text-2xl font-extrabold text-gray-900">Rs.{data.discountPrice}</p>

                    {data.originalPrice ? (
                      <p className="text-sm text-gray-400 line-through">Rs.{data.originalPrice}</p>
                    ) : null}

                    {discountPercent ? (
                      <span className="text-xs font-bold text-white px-3 py-1 rounded-full bg-[#885e4a]">
                        {discountPercent}% OFF
                      </span>
                    ) : null}
                  </div>

                  <span className="text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full">
                    Stock: {data.stock}
                  </span>
                </div>
              </div>

              {/* Quantity */}
              <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">Quantity</span>

                  <div className="flex items-center rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                    <button
                      className="px-4 py-2 font-bold text-gray-900 hover:bg-gray-100"
                      onClick={decrementCount}
                    >
                      −
                    </button>
                    <span className="px-6 py-2 bg-white font-semibold border-x border-gray-200">
                      {count}
                    </span>
                    <button
                      className="px-4 py-2 font-bold text-gray-900 hover:bg-gray-100"
                      onClick={incrementCount}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 space-y-3">
                <button
                  className="
                    w-full rounded-xl
                    bg-[#885e4a] hover:bg-[#a67861]
                    text-white font-semibold
                    py-3.5
                    flex items-center justify-center gap-2
                  "
                  onClick={() => addToCartHandler(data._id)}
                >
                  <AiOutlineShoppingCart className="text-xl" />
                  Add to Cart
                </button>

                <button
                  className="
                    w-full rounded-xl
                    border border-gray-200
                    bg-white hover:bg-gray-50
                    text-gray-900 font-semibold
                    py-3.5
                  "
                  onClick={() => setOpen(false)}
                >
                  Continue Shopping
                </button>
              </div>

              {/* Details (clean, not huge) */}
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-gray-50 border border-gray-200 px-3 py-2">
                    <p className="text-gray-500 text-xs">Category</p>
                    <p className="font-semibold text-gray-900">{data.category}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 border border-gray-200 px-3 py-2">
                    <p className="text-gray-500 text-xs">Available Stock</p>
                    <p className="font-semibold text-gray-900">{data.stock} items</p>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs text-gray-500">
                Prices and availability may change during checkout.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailsCard
