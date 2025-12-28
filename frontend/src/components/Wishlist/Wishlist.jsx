"use client"

import React, { useMemo } from "react"
import { RxCross1 } from "react-icons/rx"
import { BsCartPlus } from "react-icons/bs"
import { AiOutlineHeart } from "react-icons/ai"
import { useDispatch, useSelector } from "react-redux"
import { removeFromWishlist } from "../../redux/actions/wishlist"
import { addTocart } from "../../redux/actions/cart"

const Wishlist = ({ setOpenWishlist }) => {
  const { wishlist } = useSelector((state) => state.wishlist)
  const dispatch = useDispatch()

  const count = wishlist?.length || 0

  const subtotal = useMemo(() => {
    if (!wishlist?.length) return 0
    return wishlist.reduce((acc, item) => acc + Number(item?.discountPrice || 0), 0)
  }, [wishlist])

  const removeFromWishlistHandler = (data) => dispatch(removeFromWishlist(data))

  const addToCartHandler = (data) => {
    const newData = { ...data, qty: 1 }
    dispatch(addTocart(newData))
    setOpenWishlist(false)
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop (blur) */}
      <button
        aria-label="Close wishlist"
        onClick={() => setOpenWishlist(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl rounded-3xl overflow-hidden border border-white/30 bg-white/75 backdrop-blur-xl shadow-[0_35px_120px_rgba(0,0,0,0.35)]">
        {/* Top Beauty Header */}
        <div className="relative px-6 py-5 border-b border-white/50 bg-gradient-to-r from-[#ff5aa5]/15 via-white/40 to-[#7b61ff]/15">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-[#ff5aa5] to-[#7b61ff] text-white flex items-center justify-center shadow-md">
                <AiOutlineHeart size={22} />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[#14152b]">Your Wishlist</h2>
                <p className="text-sm text-[#6b6f86]">
                  Saved items •{" "}
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/70 border border-white/60 font-semibold text-[#14152b]">
                    {count} item{count !== 1 ? "s" : ""}
                  </span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setOpenWishlist(false)}
              className="h-11 w-11 rounded-full bg-white/70 border border-white/60 hover:bg-white transition shadow-sm flex items-center justify-center"
              title="Close"
            >
              <RxCross1 size={18} className="text-[#14152b]" />
            </button>
          </div>

          {/* Mini summary bar */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-[#6b6f86]">
              Subtotal (wishlist):{" "}
              <span className="font-extrabold text-[#14152b]">Rs.{subtotal.toLocaleString()}</span>
            </div>
            <div className="text-xs text-[#6b6f86] bg-white/60 border border-white/60 px-3 py-2 rounded-xl">
              Tip: Add items to cart anytime ✨
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {count > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wishlist.map((item, index) => (
                <WishlistCard
                  key={item?._id || index}
                  data={item}
                  onRemove={() => removeFromWishlistHandler(item)}
                  onAddToCart={() => addToCartHandler(item)}
                />
              ))}
            </div>
          ) : (
            <EmptyState onClose={() => setOpenWishlist(false)} />
          )}
        </div>

        {/* Footer */}
        {count > 0 && (
          <div className="px-6 py-5 border-t border-white/50 bg-white/60">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <p className="text-sm text-[#6b6f86]">
                You can also continue browsing and come back later.
              </p>

              <button
                onClick={() => setOpenWishlist(false)}
                className="px-5 py-3 rounded-xl border border-[#7b61ff]/30 bg-white/70 text-[#14152b] font-semibold hover:bg-white transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const WishlistCard = ({ data, onRemove, onAddToCart }) => {
  const price = Number(data?.discountPrice || 0)
  const image = data?.images?.[0]?.url || "/placeholder.svg"

  return (
    <div className="relative rounded-2xl bg-white/70 border border-white/60 p-4 shadow-sm hover:shadow-md transition overflow-hidden">
      {/* Remove */}
      <button
        onClick={onRemove}
        className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/70 border border-white/60 hover:bg-white transition flex items-center justify-center"
        title="Remove"
      >
        <RxCross1 size={16} className="text-[#14152b]" />
      </button>

      <div className="flex gap-4">
        {/* Image */}
        <div className="h-20 w-20 rounded-2xl overflow-hidden border border-white/60 bg-white flex-shrink-0">
          <img src={image} alt={data?.name || "Product"} className="h-full w-full object-cover" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-extrabold text-[#14152b] truncate">{data?.name}</h3>

          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-extrabold bg-gradient-to-r from-[#ff5aa5]/15 to-[#7b61ff]/15 border border-white/60 text-[#14152b]">
              Rs.{price.toLocaleString()}
            </span>
            {data?.shop?.name && (
              <span className="text-xs text-[#6b6f86] truncate">by {data.shop.name}</span>
            )}
          </div>

          <button
            onClick={onAddToCart}
            className="mt-4 w-full rounded-xl py-3 font-semibold text-white shadow-md hover:shadow-lg transition bg-gradient-to-r from-[#14152b] to-[#7b61ff] flex items-center justify-center gap-2"
          >
            <BsCartPlus size={18} />
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  )
}

const EmptyState = ({ onClose }) => {
  return (
    <div className="py-10 text-center">
      <div className="mx-auto h-16 w-16 rounded-3xl bg-gradient-to-r from-[#ff5aa5] to-[#7b61ff] text-white flex items-center justify-center shadow-md">
        <AiOutlineHeart size={28} />
      </div>
      <h3 className="mt-4 text-xl font-extrabold text-[#14152b]">Your wishlist is empty</h3>
      <p className="mt-2 text-sm text-[#6b6f86]">Save your favorite beauty picks here and add to cart later.</p>
      <button
        onClick={onClose}
        className="mt-6 px-6 py-3 rounded-xl bg-[#14152b] text-white font-semibold hover:opacity-90 transition"
      >
        Explore Products
      </button>
    </div>
  )
}

export default Wishlist
