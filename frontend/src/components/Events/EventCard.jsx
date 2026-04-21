import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { addTocart } from "../../redux/actions/cart";
import CountDown from "./CountDown";

const EventCard = ({ data }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [timeUp, setTimeUp] = useState(false);

  if (!data) return null;

  const imageUrl = data?.images?.[0]?.url || "/placeholder.svg";
  const originalPrice = Number(data?.originalPrice || 0);
  const discountPrice = Number(data?.discountPrice || 0);
  const savings = Math.max(0, originalPrice - discountPrice);

  const addToCartHandler = () => {
    const isItemExists = cart?.find((item) => item._id === data._id);
    if (isItemExists) return toast.error("Item is already in the cart.");
    if (Number(data?.stock || 0) < 1) return toast.error("This event item is out of stock.");

    dispatch(addTocart({ ...data, qty: 1 }));
    toast.success("Item added to cart.");
  };

  return (
    <div className="surface-card overflow-hidden">
      <div className="grid lg:grid-cols-[1fr_1fr]">
        <div className="bg-[#fbf8f3]">
          <img src={imageUrl} alt={data?.name || "Event"} className="h-full w-full object-cover" />
        </div>

        <div className="p-6 md:p-8">
          <span className="eyebrow">Limited-time offer</span>
          <h3 className="section-heading mt-4">{data?.name}</h3>
          <p className="section-copy mt-4">{data?.description}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="surface-card-sm p-4">
              <p className="text-sm text-[#6b7280]">Event price</p>
              <p className="mt-1 text-xl font-bold text-[#1f2937]">Rs. {discountPrice}</p>
            </div>
            <div className="surface-card-sm p-4">
              <p className="text-sm text-[#6b7280]">You save</p>
              <p className="mt-1 text-xl font-bold text-[#1f2937]">Rs. {savings}</p>
            </div>
            <div className="surface-card-sm p-4">
              <p className="text-sm text-[#6b7280]">Stock</p>
              <p className="mt-1 text-xl font-bold text-[#1f2937]">{data?.stock || 0}</p>
            </div>
          </div>

          <div className="surface-card-sm mt-6 bg-[#fbf8f3] p-4">
            <p className="text-sm font-semibold text-[#1f2937]">Offer ends in</p>
            <div className="mt-4">
              <CountDown data={data} onTimeUpChange={setTimeUp} />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to={`/product/${data._id}?isEvent=true`} className="btn-secondary">
              View details
            </Link>
            {!timeUp && (
              <button type="button" onClick={addToCartHandler} className="btn-primary">
                Add to cart
              </button>
            )}
          </div>

          {timeUp && <p className="mt-4 text-sm font-semibold text-[#b91c1c]">This event has ended.</p>}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
