import React, { useMemo, useState } from "react"
import { RxCross1 } from "react-icons/rx"
import { HiOutlineMinus, HiPlus } from "react-icons/hi"
import { BsCartX } from "react-icons/bs"
import { FiShoppingBag } from "react-icons/fi"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { addTocart, removeFromCart } from "../../redux/actions/cart"
import { toast } from "react-toastify"

const Cart = ({ setOpenCart }) => {
  const { cart } = useSelector((state) => state.cart)
  const dispatch = useDispatch()

  const totalPrice = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.qty * item.discountPrice, 0)
  }, [cart])

  const removeFromCartHandler = (data) => dispatch(removeFromCart(data))
  const quantityChangeHandler = (data) => dispatch(addTocart(data))

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        aria-label="Close cart"
        onClick={() => setOpenCart(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
      />

      {/* Modal */}
      <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/40 bg-white/70 shadow-[0_30px_90px_rgba(0,0,0,0.25)] backdrop-blur-xl">
        {/* Top Bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/40 bg-white/60 px-6 py-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-r from-[#ff5aa5] to-[#7b61ff] text-white flex items-center justify-center shadow-md">
              <FiShoppingBag size={18} />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#14152b]">Your Bag</h2>
              <p className="text-xs text-[#6b6f86]">
                {cart?.length || 0} item{cart?.length === 1 ? "" : "s"} • Beauty checkout experience ✨
              </p>
            </div>
          </div>

          <button
            onClick={() => setOpenCart(false)}
            className="h-10 w-10 rounded-full bg-white/80 border border-white/60 hover:bg-white shadow-sm flex items-center justify-center transition"
            title="Close"
          >
            <RxCross1 className="text-[#14152b]" size={20} />
          </button>
        </div>

        {/* Content */}
        {cart?.length === 0 ? (
          <div className="p-10 flex flex-col items-center justify-center text-center">
            <div className="h-20 w-20 rounded-3xl bg-[#f3f4ff] flex items-center justify-center mb-5">
              <BsCartX size={44} className="text-[#7b61ff]" />
            </div>
            <h3 className="text-2xl font-extrabold text-[#14152b]">Your bag is empty</h3>
            <p className="text-[#6b6f86] mt-2 max-w-md">
              Add some products and come back — your favorites deserve a place here.
            </p>

            <button
              onClick={() => setOpenCart(false)}
              className="mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff5aa5] to-[#7b61ff] text-white font-semibold shadow-md hover:shadow-lg transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 p-6">
            {/* Left: items */}
            <div className="min-h-[320px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-[#14152b]">Items</h3>
                <span className="text-xs px-3 py-1 rounded-full bg-white/70 border border-white/50 text-[#6b6f86]">
                  Swipe / scroll
                </span>
              </div>

              <div className="space-y-4 max-h-[55vh] overflow-auto pr-1">
                {cart.map((item, index) => (
                  <CartSingle
                    key={item?._id || index}
                    data={item}
                    quantityChangeHandler={quantityChangeHandler}
                    removeFromCartHandler={removeFromCartHandler}
                  />
                ))}
              </div>
            </div>

            {/* Right: summary */}
            <div className="lg:sticky lg:top-[90px] h-fit">
              <div className="rounded-2xl bg-white/70 border border-white/50 shadow-sm p-5">
                <h3 className="text-base font-extrabold text-[#14152b]">Order Summary</h3>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between text-[#6b6f86]">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#14152b]">Rs.{totalPrice.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-[#6b6f86]">
                    <span>Shipping</span>
                    <span className="font-semibold text-[#14152b]">Calculated at checkout</span>
                  </div>

                  <div className="h-px bg-white/70" />

                  <div className="flex justify-between">
                    <span className="text-[#14152b] font-bold">Estimated Total</span>
                    <span className="text-[#14152b] font-extrabold text-lg">
                      Rs.{totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Link to="/checkout" className="block mt-5">
                  <button className="w-full py-3 rounded-xl bg-gradient-to-r from-[#14152b] to-[#7b61ff] text-white font-semibold shadow-md hover:shadow-lg transition">
                    Proceed to Checkout
                  </button>
                </Link>

                <button
                  onClick={() => setOpenCart(false)}
                  className="w-full mt-3 py-3 rounded-xl border border-white/60 bg-white/60 text-[#14152b] font-semibold hover:bg-white transition"
                >
                  Continue Shopping
                </button>

                <div className="mt-4 text-xs text-[#6b6f86] bg-white/50 border border-white/50 rounded-xl p-3">
                  Tip: Add more items to enjoy a smoother single checkout ✨
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom safe-area */}
        <div className="h-2" />
      </div>
    </div>
  )
}

const CartSingle = ({ data, quantityChangeHandler, removeFromCartHandler }) => {
  const [value, setValue] = useState(data.qty)

  const total = useMemo(() => data.discountPrice * value, [data.discountPrice, value])

  const increment = () => {
    if (data.stock < value + 1) {
      toast.error("Product stock limited!")
      return
    }
    const next = value + 1
    setValue(next)
    quantityChangeHandler({ ...data, qty: next })
  }

  const decrement = () => {
    const next = value <= 1 ? 1 : value - 1
    setValue(next)
    quantityChangeHandler({ ...data, qty: next })
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/50 bg-white/70 p-4 shadow-sm hover:shadow-md transition">
      {/* decorative gradient corner */}
      <div className="pointer-events-none absolute -top-10 -right-10 h-24 w-24 rounded-full bg-gradient-to-r from-[#ff5aa5]/40 to-[#7b61ff]/40 blur-2xl" />

      <button
        onClick={() => removeFromCartHandler(data)}
        className="absolute right-3 top-3 h-9 w-9 rounded-full bg-white/70 border border-white/60 hover:bg-white flex items-center justify-center transition"
        title="Remove"
      >
        <RxCross1 size={18} className="text-[#14152b]" />
      </button>

      <div className="flex gap-4">
        {/* Image */}
        <div className="h-20 w-20 rounded-2xl overflow-hidden border border-white/60 bg-white">
          <img
            src={data?.images?.[0]?.url || "/placeholder.svg"}
            alt={data?.name || "Product"}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1">
          <h4 className="font-bold text-[#14152b] leading-snug line-clamp-1">{data?.name}</h4>
          <p className="text-xs text-[#6b6f86] mt-1">
            Rs.{data.discountPrice.toLocaleString()} • In stock: {data.stock}
          </p>

          <div className="mt-3 flex items-center justify-between gap-3">
            {/* Qty */}
            <div className="flex items-center rounded-xl border border-white/60 bg-white/60 overflow-hidden">
              <button
                onClick={decrement}
                className="h-10 w-10 flex items-center justify-center hover:bg-white transition"
              >
                <HiOutlineMinus className="text-[#14152b]" />
              </button>
              <div className="min-w-[40px] text-center font-bold text-[#14152b]">{value}</div>
              <button
                onClick={increment}
                className="h-10 w-10 flex items-center justify-center hover:bg-white transition"
              >
                <HiPlus className="text-[#14152b]" />
              </button>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="text-xs text-[#6b6f86]">Total</p>
              <p className="text-lg font-extrabold text-[#14152b]">
                Rs.{total.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
