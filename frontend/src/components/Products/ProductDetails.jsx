"use client"

import React, { useEffect, useMemo, useState } from "react"
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage, AiOutlineShoppingCart } from "react-icons/ai"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"

import { getAllProductsShop } from "../../redux/actions/product"
import { addToWishlist, removeFromWishlist } from "../../redux/actions/wishlist"
import { addTocart } from "../../redux/actions/cart"

import { server } from "../../server"
import styles from "../../styles/styles"
import Ratings from "./Ratings"

const ProductDetails = ({ data }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { wishlist } = useSelector((state) => state.wishlist)
  const { cart } = useSelector((state) => state.cart)
  const { user, isAuthenticated } = useSelector((state) => state.user)
  const { products } = useSelector((state) => state.products)

  const [count, setCount] = useState(1)
  const [click, setClick] = useState(false)
  const [select, setSelect] = useState(0)

  // fetch shop products + wishlist sync
  useEffect(() => {
    if (data?.shop?._id) {
      dispatch(getAllProductsShop(data.shop._id))
    }
  }, [dispatch, data?.shop?._id])

  useEffect(() => {
    if (!data?._id) return
    const exists = wishlist?.some((i) => i?._id === data._id)
    setClick(Boolean(exists))
  }, [wishlist, data?._id])

  // reset count + selected image when product changes
  useEffect(() => {
    setCount(1)
    setSelect(0)
  }, [data?._id])

  const incrementCount = () => {
    const max = Number(data?.stock || 0)
    if (max > 0 && count >= max) return toast.error("You reached max stock!")
    setCount((prev) => prev + 1)
  }

  const decrementCount = () => {
    if (count > 1) setCount((prev) => prev - 1)
  }

  const removeFromWishlistHandler = () => {
    setClick(false)
    dispatch(removeFromWishlist(data))
  }

  const addToWishlistHandler = () => {
    setClick(true)
    dispatch(addToWishlist(data))
  }

  const addToCartHandler = () => {
    if (!data?._id) return

    const isItemExists = cart?.some((i) => i?._id === data._id)
    if (isItemExists) return toast.error("Item already in cart!")

    if (Number(data?.stock || 0) < 1) return toast.error("Product out of stock!")

    const cartData = { ...data, qty: count }
    dispatch(addTocart(cartData))
    toast.success("Item added to cart!")
  }

  const buyNowHandler = () => {
    addToCartHandler()
    navigate("/checkout")
  }

  const totalReviewsLength = useMemo(() => {
    return (products || []).reduce((acc, product) => acc + (product?.reviews?.length || 0), 0)
  }, [products])

  const totalRatings = useMemo(() => {
    return (products || []).reduce((acc, product) => {
      const sum = (product?.reviews || []).reduce((s, r) => s + (Number(r?.rating) || 0), 0)
      return acc + sum
    }, 0)
  }, [products])

  const averageRating = useMemo(() => {
    const avg = totalRatings / (totalReviewsLength || 1)
    return Number.isFinite(avg) ? avg.toFixed(2) : "0.00"
  }, [totalRatings, totalReviewsLength])

  const handleMessageSubmit = async () => {
    if (!isAuthenticated) return toast.error("Please login to create a conversation")
    if (!data?._id || !user?._id || !data?.shop?._id) return toast.error("Missing conversation info")

    try {
      const groupTitle = `${data._id}${user._id}`
      const res = await axios.post(`${server}/conversation/create-new-conversation`, {
        groupTitle,
        userId: user._id,
        sellerId: data.shop._id,
      })
      navigate(`/inbox?${res.data.conversation._id}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create conversation")
    }
  }

  if (!data) return null

  return (
    <div className="bg-white">
      <div className={`${styles.section} w-[92%] 800px:w-[80%]`}>
        <div className="w-full py-6">
          <div className="grid grid-cols-1 800px:grid-cols-2 gap-8">
            {/* Images */}
            <div className="w-full">
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <img
                    src={data?.images?.[select]?.url}
                    alt={data?.name}
                    className="w-[85%] mx-auto object-contain"
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {(data?.images || []).map((i, idx) => (
                    <button
                      type="button"
                      key={i?.public_id || idx}
                      onClick={() => setSelect(idx)}
                      className={`h-[92px] w-[92px] rounded-xl overflow-hidden border transition ${
                        select === idx ? "border-black shadow-sm" : "border-gray-200 hover:shadow-sm"
                      }`}
                      title={`Image ${idx + 1}`}
                    >
                      <img src={i?.url} alt={`Product ${idx + 1}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="w-full">
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
                <h1 className="text-2xl font-semibold text-gray-900">{data?.name}</h1>

                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <div className="flex items-center">
                    <Ratings rating={data?.ratings} />
                  </div>
                  <span className="text-sm text-gray-500">({data?.reviews?.length || 0} reviews)</span>

                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                    {data?.sold_out || 0} Sold
                  </span>

                  {Number(data?.stock || 0) > 0 ? (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                      In Stock: {data?.stock}
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 ring-1 ring-rose-200">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="mt-5 flex items-end gap-3">
                  <div className="text-3xl font-bold text-gray-900">Rs. {data?.discountPrice}</div>
                  {data?.originalPrice ? (
                    <>
                      <div className="text-lg text-rose-600 line-through">Rs. {data.originalPrice}</div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">
                        {Math.round(((data.originalPrice - data.discountPrice) / data.originalPrice) * 100)}% OFF
                      </span>
                    </>
                  ) : null}
                </div>

                {/* Description */}
                <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {(data?.description || "").substring(0, 220)}
                    {data?.description?.length > 220 ? "..." : ""}
                  </p>
                </div>

                {/* Quantity + wishlist */}
                <div className="mt-5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-700">Quantity</span>
                    <div className="flex items-center overflow-hidden rounded-xl border border-gray-200 bg-white">
                      <button
                        type="button"
                        onClick={decrementCount}
                        className="h-10 w-10 grid place-items-center hover:bg-gray-50 transition"
                      >
                        -
                      </button>
                      <div className="h-10 min-w-[52px] grid place-items-center font-semibold text-gray-900">
                        {count}
                      </div>
                      <button
                        type="button"
                        onClick={incrementCount}
                        className="h-10 w-10 grid place-items-center hover:bg-gray-50 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="h-11 w-11 rounded-xl border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition"
                    title={click ? "Remove from wishlist" : "Add to wishlist"}
                    onClick={() => (click ? removeFromWishlistHandler() : addToWishlistHandler())}
                  >
                    {click ? <AiFillHeart size={24} className="text-rose-600" /> : <AiOutlineHeart size={24} />}
                  </button>
                </div>

                {/* CTA */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={addToCartHandler}
                    className="h-12 rounded-xl bg-black text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition"
                  >
                    Add to Cart <AiOutlineShoppingCart className="text-xl" />
                  </button>

                  <button
                    type="button"
                    onClick={buyNowHandler}
                    className="h-12 rounded-xl border border-gray-200 bg-white text-gray-900 font-semibold hover:bg-gray-50 transition"
                  >
                    Buy Now
                  </button>
                </div>

                {/* Shop card */}
                <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 flex items-center gap-4">
                  <Link to={`/shop/preview/${data?.shop?._id}`}>
                    <img
                      src={data?.shop?.avatar?.url || "/placeholder.svg"}
                      alt="Shop Logo"
                      className="w-[56px] h-[56px] rounded-2xl object-cover border border-gray-200"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link to={`/shop/preview/${data?.shop?._id}`}>
                      <h3 className="font-semibold text-gray-900 truncate">{data?.shop?.name}</h3>
                    </Link>
                    <p className="text-sm text-gray-500">
                      {averageRating}/5 • <span className="font-semibold text-gray-900">View Shop</span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleMessageSubmit}
                    className="h-11 px-4 rounded-xl bg-black text-white text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition"
                  >
                    <AiOutlineMessage />
                    Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ProductDetailsInfo
          data={data}
          products={products}
          totalReviewsLength={totalReviewsLength}
          averageRating={averageRating}
        />

        <div className="h-10" />
      </div>
    </div>
  )
}

const ProductDetailsInfo = ({ data, products, totalReviewsLength, averageRating }) => {
  const [active, setActive] = useState(1)

  return (
    <div className="mt-8 rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Tabs */}
      <div className="px-4 md:px-6 pt-4">
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
          {[
            { id: 1, label: "Product Details" },
            { id: 2, label: "Product Reviews" },
            { id: 3, label: "Seller Information" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActive(t.id)}
              className={`h-10 px-4 rounded-xl text-sm font-semibold transition ${
                active === t.id ? "bg-black text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 min-h-[280px]">
        {active === 1 && (
          <div className="text-gray-700 leading-relaxed whitespace-pre-line">{data?.description}</div>
        )}

        {active === 2 && (
          <div className="space-y-4">
            {data?.reviews?.length ? (
              data.reviews.map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-2xl border border-gray-200 bg-white">
                  <img
                    src={item?.user?.avatar?.url || "/placeholder.svg"}
                    alt="User"
                    className="w-[54px] h-[54px] rounded-2xl object-cover border border-gray-200"
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{item?.user?.name}</h3>
                      <Ratings rating={item?.rating} />
                      <span className="text-sm text-gray-500">
                        {item?.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-700">{item?.comment}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center rounded-2xl border border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">No Reviews Yet</h3>
                <p className="mt-2 text-sm text-gray-500">Be the first to review this product!</p>
              </div>
            )}
          </div>
        )}

        {active === 3 && (
          <div className="grid grid-cols-1 800px:grid-cols-2 gap-6">
            <div>
              <Link to={`/shop/preview/${data?.shop?._id}`}>
                <div className="flex items-center gap-4">
                  <img
                    src={data?.shop?.avatar?.url || "/placeholder.svg"}
                    className="w-[86px] h-[86px] rounded-2xl object-cover border border-gray-200"
                    alt="Shop Logo"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{data?.shop?.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-gray-600">{averageRating}/5</span>
                      <Ratings rating={Number.parseFloat(averageRating)} />
                    </div>
                  </div>
                </div>
              </Link>

              <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm text-gray-700">{data?.shop?.description}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Joined on</span>
                  <span className="font-semibold text-gray-900">
                    {data?.shop?.createdAt ? new Date(data.shop.createdAt).toLocaleDateString() : "-"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Total Products</span>
                  <span className="font-semibold text-gray-900">{products?.length || 0}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Total Reviews</span>
                  <span className="font-semibold text-gray-900">{totalReviewsLength || 0}</span>
                </div>

                <Link to={`/shop/preview/${data?.shop?._id}`}>
                  <button
                    type="button"
                    className="mt-3 w-full h-11 rounded-xl bg-black text-white font-semibold hover:opacity-90 transition"
                  >
                    Visit Shop
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetails
