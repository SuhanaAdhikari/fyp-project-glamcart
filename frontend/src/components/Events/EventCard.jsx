import React, { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import CountDown from "./CountDown"
import { addTocart } from "../../redux/actions/cart"
import { FiShoppingBag, FiArrowUpRight, FiZap } from "react-icons/fi"

const EventCard = ({ active, data }) => {
  const { cart } = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const [timeUp, setTimeUp] = useState(false)

  const imageUrl = useMemo(() => data?.images?.[0]?.url || "/placeholder.svg", [data])
  const offPercent = useMemo(() => {
    if (!data?.originalPrice || !data?.discountPrice) return 0
    const p = ((data.originalPrice - data.discountPrice) / data.originalPrice) * 100
    return Number.isFinite(p) ? Math.max(0, Math.round(p)) : 0
  }, [data])

  const addToCartHandler = (product) => {
    const isItemExists = cart && cart.find((i) => i._id === product._id)
    if (isItemExists) return toast.error("Item already in cart!")
    if (product.stock < 1) return toast.error("Product stock limited!")

    dispatch(addTocart({ ...product, qty: 1 }))
    toast.success("Item added to cart successfully!")
  }

  if (!data) return null

  return (
    <section className="w-full px-4 md:px-10 py-10 bg-gradient-to-b from-[#fff7fb] via-white to-[#f6f7ff]">
      <div className="max-w-[1200px] mx-auto">
        {/* Top mini badges row */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white border border-[#f2d7e6] text-[#b21b5a] shadow-sm">
            Beauty Event
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#e8e9ff] text-[#4b4ff0] shadow-sm">
            Limited Time
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#e9f7ee] text-[#0f7a3a] shadow-sm">
            {data?.sold_out || 0} sold
          </span>
          {offPercent > 0 && (
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#14152b] text-white shadow-sm">
              {offPercent}% OFF
            </span>
          )}
        </div>

        {/* Main hero card */}
        <div className="relative rounded-[28px] overflow-hidden border border-white/60 shadow-[0_28px_80px_rgba(20,21,43,0.12)]">
          {/* Background image layer */}
          <div className="absolute inset-0">
            <img src={imageUrl} alt={data.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d0f1a]/80 via-[#0d0f1a]/45 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0d0f1a]/40" />
          </div>

          {/* Content grid */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6 p-6 md:p-10">
            {/* LEFT: text hero */}
            <div className="text-white">
              <div className="max-w-[640px]">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-[1.05]">
                  {data.name}
                </h2>

                <p className="text-white/85 mt-4 text-sm md:text-base leading-relaxed line-clamp-4">
                  {data.description}
                </p>

                {/* Floating price capsule */}
                <div className="mt-6 inline-flex items-center gap-3 bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-4 py-3">
                  <div className="flex flex-col">
                    <span className="text-xs text-white/70">Event Price</span>
                    <span className="text-2xl font-extrabold">Rs.{data.discountPrice}</span>
                  </div>

                  {data.originalPrice ? (
                    <div className="pl-3 border-l border-white/20">
                      <div className="text-xs text-white/70">MRP</div>
                      <div className="text-white/80 line-through font-semibold">Rs.{data.originalPrice}</div>
                    </div>
                  ) : null}

                  <div className="pl-3 border-l border-white/20">
                    <div className="text-xs text-white/70">Stock</div>
                    <div className="font-semibold">{data.stock}</div>
                  </div>
                </div>

                {/* CTA row */}
                {!timeUp && (
                  <div className="mt-7 flex flex-col sm:flex-row gap-3">
                    <Link to={`/product/${data._id}?isEvent=true`} className="w-full sm:w-auto">
                      <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-[#14152b] font-bold flex items-center justify-center gap-2 hover:opacity-95 transition">
                        Explore Offer <FiArrowUpRight />
                      </button>
                    </Link>

                    <button
                      onClick={() => addToCartHandler(data)}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff5aa5] to-[#7b61ff] text-white font-bold flex items-center justify-center gap-2 hover:brightness-110 transition"
                    >
                      Add to Bag <FiShoppingBag />
                    </button>
                  </div>
                )}

                {timeUp && (
                  <div className="mt-7 inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 border border-white/20">
                    <FiZap />
                    <span className="font-semibold">This event has ended.</span>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: glass countdown panel */}
            <div className="lg:justify-self-end w-full">
              <div className="rounded-3xl bg-white/12 backdrop-blur-xl border border-white/20 p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xs text-white/70 font-semibold">Ends in</div>
                    <div className="text-lg font-extrabold text-white">Flash Countdown</div>
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs font-bold bg-white/15 border border-white/20 text-white">
                    Event Live
                  </div>
                </div>

                <div className="rounded-2xl bg-white/10 border border-white/15 p-4">
                  <CountDown data={data} onTimeUpChange={setTimeUp} />
                </div>

                {/* small info blocks */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="rounded-2xl bg-white/10 border border-white/15 p-3">
                    <div className="text-xs text-white/70">Sold</div>
                    <div className="text-white font-extrabold text-lg">{data?.sold_out || 0}</div>
                  </div>
                  <div className="rounded-2xl bg-white/10 border border-white/15 p-3">
                    <div className="text-xs text-white/70">You save</div>
                    <div className="text-white font-extrabold text-lg">
                      Rs.{Math.max(0, (data.originalPrice || 0) - (data.discountPrice || 0))}
                    </div>
                  </div>
                </div>

                {/* bottom bar */}
                <div className="mt-4 text-xs text-white/70">
                  Tip: Add to cart now — prices may change after the event ends.
                </div>
              </div>
            </div>
          </div>

          {/* Bottom sticky CTA strip inside card */}
          {!timeUp && (
            <div className="relative z-10 px-6 md:px-10 pb-6">
              <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="text-white">
                  <div className="text-xs text-white/70 font-semibold">Ready to glow?</div>
                  <div className="font-extrabold">Grab the deal before time runs out.</div>
                </div>

                <div className="flex gap-3">
                  <Link to={`/product/${data._id}?isEvent=true`}>
                    <button className="px-5 py-2 rounded-xl bg-white text-[#14152b] font-bold hover:opacity-95 transition">
                      Details
                    </button>
                  </Link>
                  <button
                    onClick={() => addToCartHandler(data)}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#ff5aa5] to-[#7b61ff] text-white font-bold hover:brightness-110 transition"
                  >
                    Add to Bag
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Optional: small disclaimer */}
        <div className="text-center text-xs text-[#6b6f86] mt-5">
          * Limited-time promotional price. Subject to availability.
        </div>
      </div>
    </section>
  )
}

export default EventCard
