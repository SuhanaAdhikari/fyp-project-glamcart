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

  useEffect(() => {
    if (data?.shop?._id) {
      dispatch(getAllProductsShop(data.shop._id))
    }
  }, [dispatch, data?.shop?._id])

  useEffect(() => {
    if (!data?._id) return
    const exists = wishlist?.some((item) => item?._id === data._id)
    setClick(Boolean(exists))
  }, [wishlist, data?._id])

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

    const isItemExists = cart?.some((item) => item?._id === data._id)
    if (isItemExists) return toast.error("Item already in cart!")
    if (Number(data?.stock || 0) < 1) return toast.error("Product out of stock!")

    dispatch(addTocart({ ...data, qty: count }))
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
      const sum = (product?.reviews || []).reduce((score, review) => score + (Number(review?.rating) || 0), 0)
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
    <div className="page-shell">
      <div className={`${styles.section} w-[92%] 800px:w-[80%]`}>
        <div className="w-full py-6">
          <div className="grid grid-cols-1 gap-8 800px:grid-cols-2">
            <div className="w-full">
              <div className="surface-card p-4">
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
                  <img
                    src={data?.images?.[select]?.url}
                    alt={data?.name}
                    className="mx-auto w-[85%] object-contain"
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {(data?.images || []).map((image, idx) => (
                    <button
                      type="button"
                      key={image?.public_id || idx}
                      onClick={() => setSelect(idx)}
                      title={`Image ${idx + 1}`}
                      className={`h-[92px] w-[92px] overflow-hidden rounded-xl border transition ${
                        select === idx
                          ? "border-[var(--color-accent-strong)] shadow-sm"
                          : "border-[var(--color-border)] hover:shadow-sm"
                      }`}
                    >
                      <img src={image?.url} alt={`Product ${idx + 1}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full">
              <div className="surface-card p-5">
                <h1 className="text-2xl font-semibold text-[var(--color-text)]">{data?.name}</h1>

                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <div className="flex items-center">
                    <Ratings rating={data?.ratings} />
                  </div>
                  <span className="text-sm text-[var(--color-muted)]">({data?.reviews?.length || 0} reviews)</span>
                  <span className="status-chip status-chip--neutral">{data?.sold_out || 0} Sold</span>
                  {Number(data?.stock || 0) > 0 ? (
                    <span className="status-chip status-chip--success">In Stock: {data?.stock}</span>
                  ) : (
                    <span className="status-chip status-chip--danger">Out of Stock</span>
                  )}
                </div>

                <div className="mt-5 flex items-end gap-3">
                  <div className="text-3xl font-bold text-[var(--color-text)]">Rs. {data?.discountPrice}</div>
                  {data?.originalPrice ? (
                    <>
                      <div className="text-lg text-[var(--color-muted)] line-through">Rs. {data.originalPrice}</div>
                      <span className="status-chip status-chip--muted">
                        {Math.round(((data.originalPrice - data.discountPrice) / data.originalPrice) * 100)}% OFF
                      </span>
                    </>
                  ) : null}
                </div>

                <div className="mt-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
                  <p className="text-sm leading-relaxed text-[var(--color-muted)]">
                    {(data?.description || "").substring(0, 220)}
                    {data?.description?.length > 220 ? "..." : ""}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-[var(--color-text)]">Quantity</span>
                    <div className="flex items-center overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                      <button
                        type="button"
                        onClick={decrementCount}
                        className="grid h-10 w-10 place-items-center transition hover:bg-[var(--color-surface-soft)]"
                      >
                        -
                      </button>
                      <div className="grid h-10 min-w-[52px] place-items-center font-semibold text-[var(--color-text)]">
                        {count}
                      </div>
                      <button
                        type="button"
                        onClick={incrementCount}
                        className="grid h-10 w-10 place-items-center transition hover:bg-[var(--color-surface-soft)]"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    title={click ? "Remove from wishlist" : "Add to wishlist"}
                    onClick={() => (click ? removeFromWishlistHandler() : addToWishlistHandler())}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--color-border)] transition hover:bg-[var(--color-surface-soft)]"
                  >
                    {click ? <AiFillHeart size={24} className="text-[var(--color-accent-strong)]" /> : <AiOutlineHeart size={24} />}
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button type="button" onClick={addToCartHandler} className="btn-primary !h-12">
                    Add to Cart <AiOutlineShoppingCart className="text-xl" />
                  </button>

                  <button type="button" onClick={buyNowHandler} className="btn-secondary !h-12">
                    Buy Now
                  </button>
                </div>

                <div className="surface-card-sm mt-6 flex items-center gap-4 p-4">
                  <Link to={`/shop/preview/${data?.shop?._id}`}>
                    <img
                      src={data?.shop?.avatar?.url || "/placeholder.svg"}
                      alt="Shop Logo"
                      className="h-[56px] w-[56px] rounded-2xl border border-[var(--color-border)] object-cover"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link to={`/shop/preview/${data?.shop?._id}`}>
                      <h3 className="truncate font-semibold text-[var(--color-text)]">{data?.shop?.name}</h3>
                    </Link>
                    <p className="text-sm text-[var(--color-muted)]">
                      {averageRating}/5 • <span className="font-semibold text-[var(--color-text)]">View Shop</span>
                    </p>
                  </div>

                  <button type="button" onClick={handleMessageSubmit} className="btn-primary !h-11">
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
    <div className="surface-card mt-8">
      <div className="px-4 pt-4 md:px-6">
        <div className="flex flex-wrap gap-2 border-b border-[var(--color-border)] pb-3">
          {[
            { id: 1, label: "Product Details" },
            { id: 2, label: "Product Reviews" },
            { id: 3, label: "Seller Information" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={`h-10 rounded-xl px-4 text-sm font-semibold transition ${
                active === tab.id
                  ? "bg-[var(--color-accent-strong)] text-white"
                  : "bg-[var(--color-surface-soft)] text-[var(--color-text)] hover:bg-[var(--color-accent-soft)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[280px] p-4 md:p-6">
        {active === 1 && (
          <div className="whitespace-pre-line leading-relaxed text-[var(--color-muted)]">{data?.description}</div>
        )}

        {active === 2 && (
          <div className="space-y-4">
            {data?.reviews?.length ? (
              data.reviews.map((item, idx) => (
                <div key={idx} className="surface-card-sm flex gap-4 p-4">
                  <img
                    src={item?.user?.avatar?.url || "/placeholder.svg"}
                    alt="User"
                    className="h-[54px] w-[54px] rounded-2xl border border-[var(--color-border)] object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-[var(--color-text)]">{item?.user?.name}</h3>
                      <Ratings rating={item?.rating} />
                      <span className="text-sm text-[var(--color-muted)]">
                        {item?.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[var(--color-muted)]">{item?.comment}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-12 text-center">
                <h3 className="text-lg font-semibold text-[var(--color-text)]">No Reviews Yet</h3>
                <p className="mt-2 text-sm text-[var(--color-muted)]">Be the first to review this product!</p>
              </div>
            )}
          </div>
        )}

        {active === 3 && (
          <div className="grid grid-cols-1 gap-6 800px:grid-cols-2">
            <div>
              <Link to={`/shop/preview/${data?.shop?._id}`}>
                <div className="flex items-center gap-4">
                  <img
                    src={data?.shop?.avatar?.url || "/placeholder.svg"}
                    className="h-[86px] w-[86px] rounded-2xl border border-[var(--color-border)] object-cover"
                    alt="Shop Logo"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--color-text)]">{data?.shop?.name}</h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[var(--color-muted)]">{averageRating}/5</span>
                      <Ratings rating={Number.parseFloat(averageRating)} />
                    </div>
                  </div>
                </div>
              </Link>

              <div className="mt-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-4">
                <p className="text-sm text-[var(--color-muted)]">{data?.shop?.description}</p>
              </div>
            </div>

            <div className="surface-card-sm p-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-muted)]">Joined on</span>
                  <span className="font-semibold text-[var(--color-text)]">
                    {data?.shop?.createdAt ? new Date(data.shop.createdAt).toLocaleDateString() : "-"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-muted)]">Total Products</span>
                  <span className="font-semibold text-[var(--color-text)]">{products?.length || 0}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-muted)]">Total Reviews</span>
                  <span className="font-semibold text-[var(--color-text)]">{totalReviewsLength || 0}</span>
                </div>

                <Link to={`/shop/preview/${data?.shop?._id}`}>
                  <button type="button" className="btn-primary mt-3 !h-11 !w-full">
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
