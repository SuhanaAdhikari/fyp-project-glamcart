"use client";

import React, { useEffect, useMemo, useState } from "react";
import { State } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";

const NEPAL_ISO_CODE = "NP";

const Checkout = () => {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const navigate = useNavigate();

  const [city, setCity] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [showSaved, setShowSaved] = useState(false);
  const [selectedSavedIndex, setSelectedSavedIndex] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeData, setCouponCodeData] = useState(null);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const nepalCities = useMemo(() => State.getStatesOfCountry(NEPAL_ISO_CODE) || [], []);

  const subTotalPrice = useMemo(() => {
    return (cart || []).reduce((total, item) => total + Number(item?.qty || 0) * Number(item?.discountPrice || 0), 0);
  }, [cart]);

  const shipping = 100;
  const totalPrice = useMemo(() => {
    const discount = couponCodeData ? Number(discountPrice || 0) : 0;
    return Math.max(0, subTotalPrice + shipping - discount);
  }, [couponCodeData, discountPrice, shipping, subTotalPrice]);

  const filledShipping = Boolean(address1 && zipCode && city);

  const paymentSubmit = () => {
    if (!filledShipping) {
      toast.error("Please complete your delivery address.");
      return;
    }

    const shippingAddress = {
      address1,
      address2,
      zipCode,
      country: NEPAL_ISO_CODE,
      city,
    };

    const orderData = {
      cart,
      totalPrice,
      subTotalPrice,
      shipping,
      discountPrice: couponCodeData ? Number(discountPrice || 0) : 0,
      shippingAddress,
      user,
    };

    localStorage.setItem("latestOrder", JSON.stringify(orderData));
    navigate("/payment");
  };

  const handleCouponSubmit = async (event) => {
    event.preventDefault();
    const code = couponCode.trim();
    if (!code) return toast.error("Enter a coupon code.");

    try {
      setCouponLoading(true);
      const response = await axios.get(`${server}/coupon/get-coupon-value/${code}`, { withCredentials: true });
      const coupon = response?.data?.couponCode;

      if (!coupon) {
        setCouponCode("");
        setCouponCodeData(null);
        setDiscountPrice(0);
        return toast.error("Coupon code does not exist.");
      }

      const eligibleItems = (cart || []).filter((item) => item?.shopId === coupon?.shopId);
      if (!eligibleItems.length) {
        setCouponCode("");
        setCouponCodeData(null);
        setDiscountPrice(0);
        return toast.error("Coupon is not valid for items in your cart.");
      }

      const eligiblePrice = eligibleItems.reduce(
        (total, item) => total + Number(item?.qty || 0) * Number(item?.discountPrice || 0),
        0
      );

      const discount = (eligiblePrice * Number(coupon?.value || 0)) / 100;

      setCouponCodeData(coupon);
      setDiscountPrice(discount);
      setCouponCode("");
      toast.success("Coupon applied.");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to apply coupon.");
    } finally {
      setCouponLoading(false);
    }
  };

  return (
    <section className="section-shell py-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="surface-card p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[#1f2937]">Delivery details</h2>
                <p className="mt-1 text-sm text-[#6b7280]">Add your address and review the order before payment.</p>
              </div>
              {filledShipping && <span className="muted-chip">Address ready</span>}
            </div>

            {user?.addresses?.length > 0 && (
              <div className="mt-6">
                <button type="button" onClick={() => setShowSaved((value) => !value)} className="btn-secondary">
                  {showSaved ? "Hide saved addresses" : "Use a saved address"}
                </button>

                {showSaved && (
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {user.addresses.map((address, index) => {
                      const isActive = selectedSavedIndex === index;

                      return (
                        <button
                          key={`${address.address1}-${index}`}
                          type="button"
                          onClick={() => {
                            setSelectedSavedIndex(index);
                            setAddress1(address.address1 || "");
                            setAddress2(address.address2 || "");
                            setZipCode(address.zipCode || "");
                            setCity(address.city || "");
                          }}
                          className={`rounded-[20px] border p-4 text-left transition ${
                            isActive
                              ? "border-[#1f2937] bg-[#1f2937] text-white"
                              : "border-[#e6ddd2] bg-[#fbf8f3] text-[#1f2937]"
                          }`}
                        >
                          <p className="font-semibold">{address.addressType || "Saved address"}</p>
                          <p className={`mt-2 text-sm ${isActive ? "text-white/80" : "text-[#6b7280]"}`}>
                            {address.address1}
                            {address.address2 ? `, ${address.address2}` : ""}
                            <br />
                            {address.city ? `${address.city}, ` : ""}Nepal {address.zipCode ? `- ${address.zipCode}` : ""}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Field label="Full name">
                <input value={user?.name || ""} readOnly className="field-input bg-[#fbf8f3]" />
              </Field>
              <Field label="Email address">
                <input value={user?.email || ""} readOnly className="field-input bg-[#fbf8f3]" />
              </Field>
              <Field label="Phone number">
                <input value={user?.phoneNumber || ""} readOnly className="field-input bg-[#fbf8f3]" />
              </Field>
              <Field label="Zip code">
                <input value={zipCode} onChange={(event) => setZipCode(event.target.value)} className="field-input" />
              </Field>
              <Field label="Country">
                <input value="Nepal" readOnly className="field-input bg-[#fbf8f3]" />
              </Field>
              <Field label="City / Province">
                <select value={city} onChange={(event) => setCity(event.target.value)} className="field-select">
                  <option value="">Select</option>
                  {nepalCities.map((item) => (
                    <option key={item.isoCode} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="md:col-span-2">
                <Field label="Address line 1">
                  <input value={address1} onChange={(event) => setAddress1(event.target.value)} className="field-input" />
                </Field>
              </div>
              <div className="md:col-span-2">
                <Field label="Address line 2">
                  <input value={address2} onChange={(event) => setAddress2(event.target.value)} className="field-input" />
                </Field>
              </div>
            </div>
          </div>

          <div className="surface-card p-6">
            <h2 className="text-xl font-semibold text-[#1f2937]">Promo code</h2>
            <p className="mt-1 text-sm text-[#6b7280]">Apply a valid coupon for items from the matching seller.</p>

            <form onSubmit={handleCouponSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
              <input
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value)}
                placeholder="Enter coupon code"
                className="field-input"
              />
              <button type="submit" disabled={couponLoading} className="btn-primary sm:min-w-[150px]">
                {couponLoading ? "Applying..." : "Apply"}
              </button>
            </form>

            {couponCodeData && Number(discountPrice) > 0 && (
              <div className="surface-card-sm mt-4 bg-[#f0fdf4] p-4 text-sm text-[#166534]">
                Coupon applied. Discount: Rs. {Number(discountPrice).toLocaleString()}
              </div>
            )}
          </div>
        </div>

        <div className="surface-card h-fit p-6 lg:sticky lg:top-24">
          <h2 className="text-xl font-semibold text-[#1f2937]">Order summary</h2>
          <p className="mt-1 text-sm text-[#6b7280]">{(cart || []).length} item(s)</p>

          <div className="mt-6 space-y-3 text-sm text-[#6b7280]">
            <SummaryLine label="Subtotal" value={`Rs. ${subTotalPrice.toLocaleString()}`} />
            <SummaryLine label="Shipping" value={`Rs. ${shipping.toFixed(2)}`} />
            {couponCodeData && Number(discountPrice) > 0 && (
              <SummaryLine label="Discount" value={`- Rs. ${Number(discountPrice).toLocaleString()}`} />
            )}
          </div>

          <div className="app-divider my-5" />

          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#1f2937]">Total</span>
            <span className="text-2xl font-bold text-[#1f2937]">Rs. {totalPrice.toFixed(2)}</span>
          </div>

          <div className="surface-card-sm mt-5 bg-[#fbf8f3] p-4 text-sm text-[#6b7280]">
            Delivery is currently set to a flat Rs. 100 inside Nepal.
          </div>

          <button type="button" onClick={paymentSubmit} className="btn-primary mt-5 !w-full">
            Proceed to payment
          </button>

          {!filledShipping && (
            <div className="surface-card-sm mt-4 bg-[#fff7ed] p-4 text-sm text-[#9a3412]">
              Complete the shipping address to continue.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const Field = ({ label, children }) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-[#1f2937]">{label}</label>
    {children}
  </div>
);

const SummaryLine = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <span>{label}</span>
    <span className="font-semibold text-[#1f2937]">{value}</span>
  </div>
);

export default Checkout;
