import React from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { addTocart } from "../../../redux/actions/cart";
import { addToWishlist, removeFromWishlist } from "../../../redux/actions/wishlist";
import Ratings from "../../Products/Ratings";

const ProductCard = ({ data, isEvent = false }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  if (!data) return null;

  const isWishlisted = wishlist?.some((item) => item._id === data._id);
  const productLink = isEvent ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`;
  const currentPrice = Number(data?.discountPrice ?? data?.originalPrice ?? 0);
  const originalPrice = Number(data?.originalPrice ?? 0);
  const hasDiscount = originalPrice > currentPrice;
  const discountPercent = hasDiscount ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;
  const productCategory = data?.category || "Featured";
  const shopName = data?.shop?.name || "GlamCart Store";

  const handleWishlist = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(data));
      return;
    }

    dispatch(addToWishlist(data));
  };

  const addToCartHandler = () => {
    const isItemExists = cart?.find((item) => item._id === data._id);
    if (isItemExists) return toast.error("Item is already in the cart.");
    if (Number(data?.stock || 0) < 1) return toast.error("This product is out of stock.");

    dispatch(addTocart({ ...data, qty: 1 }));
    toast.success("Item added to cart.");
  };

  return (
    <article className="group surface-card relative overflow-hidden !rounded-[28px] transition duration-200 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(23,33,43,0.14)]">
      <div className="relative">
        <Link to={productLink} className="block overflow-hidden bg-[#fbf8f3]">
          <img
            src={data?.images?.[0]?.url || "/placeholder.svg"}
            alt={data?.name || "Product"}
            className="aspect-[4/5] h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        </Link>

        <div className="absolute left-4 top-4">
          <span className="muted-chip !bg-white/95 !text-[#885e4a]">{productCategory}</span>
        </div>

        <div className="absolute right-4 top-4">
          <button
            type="button"
            onClick={handleWishlist}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e6ddd2] bg-white/95 text-[#1f2937]"
          >
            {isWishlisted ? <AiFillHeart size={18} color="#9b6b53" /> : <AiOutlineHeart size={18} />}
          </button>
        </div>
      </div>

      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a67861]">{shopName}</p>

        <Link to={productLink}>
          <h3 className="mt-3 min-h-[56px] text-base font-semibold leading-6 text-[#1f2937]">{data?.name}</h3>
        </Link>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className={`muted-chip ${hasDiscount ? "!bg-[#efe2d8] !text-[#9b6b53]" : "!bg-[#f6efe7] !text-[#885e4a]"}`}>
            {hasDiscount ? `${discountPercent}% off` : "Fresh pick"}
          </span>
          <span className="muted-chip">{`${data?.stock || 0} in stock`}</span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 text-sm text-[#6b7280]">
          <div className="flex items-center gap-2">
            <Ratings rating={data?.ratings} size={16} />
            <span>{data?.ratings ? Number(data.ratings).toFixed(1) : "New"}</span>
          </div>
          <span>{data?.sold_out || 0} sold</span>
        </div>

        <div className="app-divider mt-5" />

        <div className="mt-4 flex items-end justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#1f2937]">Rs. {currentPrice}</span>
            {hasDiscount && <span className="text-sm text-[#9ca3af] line-through">Rs. {originalPrice}</span>}
          </div>

          {data?.shop?._id ? (
            <Link to={`/shop/preview/${data.shop._id}`} className="text-sm text-[#6b7280] hover:text-[#1f2937]">
              Visit shop
            </Link>
          ) : (
            <span className="text-sm text-[#6b7280]">{isEvent ? "Event product" : "Ready to ship"}</span>
          )}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Link to={productLink} className="btn-secondary !w-full">
            View
          </Link>
          <button type="button" onClick={addToCartHandler} className="btn-primary !w-full">
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
