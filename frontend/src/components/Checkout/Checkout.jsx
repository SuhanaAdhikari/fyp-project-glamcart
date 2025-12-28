"use client"

import React, { useEffect, useMemo, useState } from "react"
import { State } from "country-state-city"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import axios from "axios"
import { toast } from "react-toastify"

import { server } from "../../server"
import { FiCreditCard, FiTag, FiTruck, FiMapPin, FiCheckCircle, FiChevronDown } from "react-icons/fi"

const NEPAL_ISO_CODE = "NP"

const Checkout = () => {
  const { user } = useSelector((state) => state.user)
  const { cart } = useSelector((state) => state.cart)
  const navigate = useNavigate()

  // shipping
  const [city, setCity] = useState("")
  const [address1, setAddress1] = useState("")
  const [address2, setAddress2] = useState("")
  const [zipCode, setZipCode] = useState("")

  // saved address UI
  const [showSaved, setShowSaved] = useState(false)
  const [selectedSavedIndex, setSelectedSavedIndex] = useState(null)

  // coupon
  const [couponCode, setCouponCode] = useState("")
  const [couponCodeData, setCouponCodeData] = useState(null)
  const [discountPrice, setDiscountPrice] = useState(0)
  const [couponLoading, setCouponLoading] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const nepalCities = useMemo(() => State.getStatesOfCountry(NEPAL_ISO_CODE) || [], [])

  const subTotalPrice = useMemo(() => {
    return (cart || []).reduce((acc, item) => acc + Number(item?.qty || 0) * Number(item?.discountPrice || 0), 0)
  }, [cart])

  const shipping = 100

  const totalPrice = useMemo(() => {
    const discount = couponCodeData ? Number(discountPrice || 0) : 0
    const raw = subTotalPrice + shipping - discount
    return Math.max(0, raw).toFixed(2)
  }, [subTotalPrice, shipping, couponCodeData, discountPrice])

  const paymentSubmit = () => {
    if (!address1 || !zipCode || !city) {
      return toast.error("Please complete your delivery address!")
    }

    const shippingAddress = {
      address1,
      address2,
      zipCode,
      country: NEPAL_ISO_CODE,
      city,
    }

    const orderData = {
      cart,
      totalPrice: Number(totalPrice),
      subTotalPrice,
      shipping,
      discountPrice: couponCodeData ? Number(discountPrice || 0) : 0,
      shippingAddress,
      user,
    }

    localStorage.setItem("latestOrder", JSON.stringify(orderData))
    navigate("/payment")
  }

  const handleCouponSubmit = async (e) => {
    e.preventDefault()
    const code = couponCode.trim()
    if (!code) return toast.error("Enter a coupon code")

    try {
      setCouponLoading(true)

      const res = await axios.get(`${server}/coupon/get-coupon-value/${code}`, { withCredentials: true })
      const coupon = res?.data?.couponCode

      if (!coupon) {
        setCouponCode("")
        setCouponCodeData(null)
        setDiscountPrice(0)
        return toast.error("Coupon code doesn't exist!")
      }

      const shopId = coupon?.shopId
      const couponValue = Number(coupon?.value || 0)

      const eligibleItems = (cart || []).filter((item) => item?.shopId === shopId)

      if (!eligibleItems.length) {
        setCouponCode("")
        setCouponCodeData(null)
        setDiscountPrice(0)
        return toast.error("Coupon is not valid for items in your cart")
      }

      const eligiblePrice = eligibleItems.reduce(
        (acc, item) => acc + Number(item?.qty || 0) * Number(item?.discountPrice || 0),
        0
      )

      const discount = (eligiblePrice * couponValue) / 100

      setCouponCodeData(coupon)
      setDiscountPrice(discount)
      setCouponCode("")
      toast.success("Coupon applied ✨")
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message || "Error applying coupon")
    } finally {
      setCouponLoading(false)
    }
  }

  const filledShipping = Boolean(address1 && zipCode && city)

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff6fb] via-white to-[#f6f8ff]">
      {/* Top beauty header */}
      <div className="w-full pt-8 pb-5">
        <div className="w-[95%] 1200px:w-[88%] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h1 className="text-3xl font-extrabold text-[#14152b] tracking-tight">Checkout</h1>
              <p className="text-[#5b5f7a] mt-1">
                A smooth, premium finish — confirm your delivery and complete your order.
              </p>
            </div>

            {/* Steps */}
            <div className="flex items-center gap-3 text-sm">
              <StepBadge active label="Shipping" />
              <div className="h-[2px] w-10 bg-[#e7e2ff] rounded" />
              <StepBadge active={Boolean(couponCodeData)} label="Promo" />
              <div className="h-[2px] w-10 bg-[#e7e2ff] rounded" />
              <StepBadge active={filledShipping} label="Review" />
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="w-[95%] 1200px:w-[88%] mx-auto pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8">
          {/* LEFT */}
          <div className="space-y-6">
            {/* Shipping card */}
            <div className="rounded-2xl border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_20px_60px_rgba(20,21,43,0.08)] overflow-hidden">
              <div className="px-6 py-5 border-b border-[#eef0ff] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff5aa5] to-[#7b61ff] text-white flex items-center justify-center">
                    <FiMapPin />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#14152b]">Delivery Details</h2>
                    <p className="text-sm text-[#5b5f7a]">Tell us where your glow-up should arrive.</p>
                  </div>
                </div>

                {filledShipping && (
                  <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl">
                    <FiCheckCircle />
                    <span>Ready</span>
                  </div>
                )}
              </div>

              <div className="p-6">
                {/* Saved addresses */}
                {user?.addresses?.length > 0 && (
                  <div className="mb-6">
                    <button
                      type="button"
                      onClick={() => setShowSaved((s) => !s)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-[#eef0ff] bg-white hover:bg-[#fbfbff] transition"
                    >
                      <span className="text-sm font-semibold text-[#14152b]">
                        {showSaved ? "Hide saved addresses" : "Use a saved address"}
                      </span>
                      <FiChevronDown className={`transition-transform ${showSaved ? "rotate-180" : ""}`} />
                    </button>

                    {showSaved && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {user.addresses.map((a, idx) => {
                          const active = selectedSavedIndex === idx
                          return (
                            <button
                              type="button"
                              key={idx}
                              onClick={() => {
                                setSelectedSavedIndex(idx)
                                setAddress1(a.address1 || "")
                                setAddress2(a.address2 || "")
                                setZipCode(a.zipCode || "")
                                setCity(a.city || "")
                              }}
                              className={`text-left p-4 rounded-2xl border transition shadow-sm ${
                                active
                                  ? "border-[#14152b] bg-[#14152b] text-white"
                                  : "border-[#eef0ff] bg-white hover:bg-[#fbfbff]"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="text-sm font-bold">{a.addressType || "Saved Address"}</div>
                                <div
                                  className={`w-3 h-3 rounded-full ${
                                    active ? "bg-white" : "bg-[#e7e2ff]"
                                  }`}
                                />
                              </div>
                              <div className={`text-sm mt-2 ${active ? "text-white/85" : "text-[#5b5f7a]"}`}>
                                {a.address1}
                                {a.address2 ? `, ${a.address2}` : ""}
                                <br />
                                {a.city ? `${a.city}, ` : ""}Nepal {a.zipCode ? `- ${a.zipCode}` : ""}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Full Name">
                    <input
                      value={user?.name || ""}
                      readOnly
                      className="w-full px-4 py-3 rounded-xl border border-[#eef0ff] bg-[#fafaff] outline-none"
                    />
                  </Field>

                  <Field label="Email Address">
                    <input
                      value={user?.email || ""}
                      readOnly
                      className="w-full px-4 py-3 rounded-xl border border-[#eef0ff] bg-[#fafaff] outline-none"
                    />
                  </Field>

                  <Field label="Phone Number">
                    <input
                      value={user?.phoneNumber || ""}
                      readOnly
                      className="w-full px-4 py-3 rounded-xl border border-[#eef0ff] bg-[#fafaff] outline-none"
                    />
                  </Field>

                  <Field label="Zip Code">
                    <input
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="Postal code"
                      className="w-full px-4 py-3 rounded-xl border border-[#eef0ff] outline-none focus:ring-2 focus:ring-[#7b61ff]"
                    />
                  </Field>

                  <Field label="Country">
                    <input
                      value="Nepal"
                      readOnly
                      className="w-full px-4 py-3 rounded-xl border border-[#eef0ff] bg-[#fafaff] outline-none"
                    />
                  </Field>

                  <Field label="City / Province">
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#eef0ff] outline-none focus:ring-2 focus:ring-[#7b61ff]"
                    >
                      <option value="">Select</option>
                      {nepalCities.map((c) => (
                        <option key={c.isoCode} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <div className="md:col-span-2">
                    <Field label="Address Line 1">
                      <input
                        value={address1}
                        onChange={(e) => setAddress1(e.target.value)}
                        placeholder="Street, area, landmark"
                        className="w-full px-4 py-3 rounded-xl border border-[#eef0ff] outline-none focus:ring-2 focus:ring-[#7b61ff]"
                      />
                    </Field>
                  </div>

                  <div className="md:col-span-2">
                    <Field label="Address Line 2 (Optional)">
                      <input
                        value={address2}
                        onChange={(e) => setAddress2(e.target.value)}
                        placeholder="Apartment, floor, etc."
                        className="w-full px-4 py-3 rounded-xl border border-[#eef0ff] outline-none focus:ring-2 focus:ring-[#7b61ff]"
                      />
                    </Field>
                  </div>
                </div>

                {/* Mini note */}
                <div className="mt-6 rounded-2xl border border-[#eef0ff] bg-gradient-to-r from-white to-[#fbfbff] p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#f3f1ff] text-[#7b61ff] flex items-center justify-center">
                      <FiTruck />
                    </div>
                    <div>
                      <div className="font-semibold text-[#14152b]">Delivery in Nepal</div>
                      <div className="text-sm text-[#5b5f7a]">
                        Flat shipping Rs.100 • Estimated 3–5 business days • COD/Online depends on Payment page.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Promo card (different placement) */}
            <div className="rounded-2xl border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_20px_60px_rgba(20,21,43,0.08)] overflow-hidden">
              <div className="px-6 py-5 border-b border-[#eef0ff] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#fff0f7] text-[#ff5aa5] flex items-center justify-center">
                  <FiTag />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#14152b]">Promo Code</h2>
                  <p className="text-sm text-[#5b5f7a]">Apply discounts that match items from the same shop.</p>
                </div>
              </div>

              <div className="p-6">
                <form onSubmit={handleCouponSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon (e.g. BEAUTY10)"
                    className="flex-1 px-4 py-3 rounded-xl border border-[#eef0ff] outline-none focus:ring-2 focus:ring-[#ff5aa5]"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading}
                    className="px-5 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#ff5aa5] to-[#7b61ff] hover:opacity-95 transition disabled:opacity-60"
                  >
                    {couponLoading ? "Applying..." : "Apply"}
                  </button>
                </form>

                {couponCodeData && Number(discountPrice) > 0 && (
                  <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-800">
                    <div className="font-semibold">Coupon applied ✨</div>
                    <div className="text-sm mt-1">
                      Discount: <b>Rs.{Number(discountPrice).toLocaleString()}</b>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:sticky lg:top-6 h-fit space-y-6">
            {/* Summary */}
            <div className="rounded-2xl border border-[#eef0ff] bg-white shadow-[0_20px_60px_rgba(20,21,43,0.08)] overflow-hidden">
              <div className="px-6 py-5 border-b border-[#eef0ff]">
                <h2 className="text-lg font-bold text-[#14152b]">Order Summary</h2>
                <p className="text-sm text-[#5b5f7a] mt-1">{(cart || []).length} items • Beauty-ready</p>
              </div>

              <div className="p-6 space-y-4">
                <Line label="Subtotal" value={`Rs.${Number(subTotalPrice).toLocaleString()}`} />
                <Line label="Shipping" value={`Rs.${shipping.toFixed(2)}`} pill="Flat" />
                {couponCodeData && Number(discountPrice) > 0 && (
                  <Line label="Discount" value={`- Rs.${Number(discountPrice).toLocaleString()}`} green />
                )}

                <div className="pt-4 border-t border-[#eef0ff] flex items-center justify-between">
                  <div>
                    <div className="text-sm text-[#5b5f7a]">Total</div>
                    <div className="text-2xl font-extrabold text-[#14152b]">Rs.{totalPrice}</div>
                  </div>

                  <div className="text-xs text-[#5b5f7a] bg-[#fbfbff] border border-[#eef0ff] px-3 py-2 rounded-xl text-right">
                    ETA <b>3–5 days</b>
                    <br />
                    Nepal Delivery
                  </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-r from-[#fff6fb] to-[#f2f4ff] border border-white p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white text-[#7b61ff] flex items-center justify-center">
                      <FiTruck />
                    </div>
                    <div className="text-sm text-[#5b5f7a]">
                      Your items are packed with care. We’ll confirm the order on the payment step.
                    </div>
                  </div>
                </div>

                <button
                  onClick={paymentSubmit}
                  className="w-full mt-2 py-3 rounded-xl font-semibold text-white bg-[#14152b] hover:bg-black transition flex items-center justify-center gap-2"
                >
                  <FiCreditCard />
                  Proceed to Payment
                </button>

                {!filledShipping && (
                  <div className="text-xs text-[#b13a6d] bg-[#fff0f7] border border-[#ffd2e7] px-3 py-2 rounded-xl">
                    Fill Shipping Address to continue.
                  </div>
                )}
              </div>
            </div>

            {/* Mini list preview (different UI) */}
            <div className="rounded-2xl border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_20px_60px_rgba(20,21,43,0.08)] p-5">
              <div className="text-sm font-bold text-[#14152b] mb-3">Quick Cart Peek</div>
              <div className="space-y-3 max-h-[260px] overflow-auto pr-1">
                {(cart || []).slice(0, 6).map((it) => (
                  <div key={it?._id} className="flex gap-3 items-center">
                    <div className="w-12 h-12 rounded-xl bg-[#f4f6ff] border border-[#eef0ff] overflow-hidden flex items-center justify-center">
                      <img
                        src={it?.images?.[0]?.url || "/placeholder.svg"}
                        alt={it?.name || "item"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-[#14152b] line-clamp-1">{it?.name}</div>
                      <div className="text-xs text-[#5b5f7a]">
                        Qty {it?.qty} • Rs.{Number(it?.discountPrice || 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-sm font-bold text-[#14152b]">
                      Rs.{(Number(it?.qty || 0) * Number(it?.discountPrice || 0)).toLocaleString()}
                    </div>
                  </div>
                ))}

                {(cart || []).length > 6 && (
                  <div className="text-xs text-[#5b5f7a] pt-2">+ {(cart || []).length - 6} more items…</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile floating action bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-[#eef0ff]">
        <div className="w-[95%] 1200px:w-[88%] mx-auto py-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs text-[#5b5f7a]">Total</div>
            <div className="text-lg font-extrabold text-[#14152b]">Rs.{totalPrice}</div>
          </div>
          <button
            onClick={paymentSubmit}
            className="px-5 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#ff5aa5] to-[#7b61ff] hover:opacity-95 transition flex items-center gap-2"
          >
            <FiCreditCard />
            Pay Now
          </button>
        </div>
      </div>
    </div>
  )
}

/* Small UI parts */
const StepBadge = ({ label, active }) => {
  return (
    <div
      className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
        active ? "bg-[#14152b] text-white border-[#14152b]" : "bg-white text-[#5b5f7a] border-[#eef0ff]"
      }`}
    >
      {label}
    </div>
  )
}

const Field = ({ label, children }) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#3b3f5c] mb-2">{label}</label>
      {children}
    </div>
  )
}

const Line = ({ label, value, pill, green }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#5b5f7a]">{label}</span>
        {pill && <span className="text-[10px] px-2 py-1 rounded-full bg-[#f2f4ff] text-[#7b61ff]">{pill}</span>}
      </div>
      <span className={`text-sm font-bold ${green ? "text-emerald-700" : "text-[#14152b]"}`}>{value}</span>
    </div>
  )
}

export default Checkout
