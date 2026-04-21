import React, { useMemo, useState } from "react";
import { BsCartX } from "react-icons/bs";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { addTocart, removeFromCart } from "../../redux/actions/cart";

const Cart = ({ setOpenCart }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const totalPrice = useMemo(() => {
    return (cart || []).reduce((total, item) => total + Number(item.qty || 0) * Number(item.discountPrice || 0), 0);
  }, [cart]);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4">
      <div className="surface-card relative max-h-[90vh] w-full max-w-5xl overflow-hidden bg-[#f6f2eb]">
        <div className="flex items-center justify-between border-b border-[#e6ddd2] bg-white px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-[#1f2937]">Your cart</h2>
            <p className="text-sm text-[#6b7280]">{cart?.length || 0} item(s)</p>
          </div>

          <button
            type="button"
            onClick={() => setOpenCart(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e6ddd2] bg-white"
          >
            <RxCross1 />
          </button>
        </div>

        {cart?.length ? (
          <div className="grid gap-6 p-6 lg:grid-cols-[1fr_320px]">
            <div className="max-h-[65vh] space-y-4 overflow-y-auto pr-1">
              {cart.map((item) => (
                <CartItem
                  key={item._id}
                  data={item}
                  onRemove={() => dispatch(removeFromCart(item))}
                  onUpdate={(nextItem) => dispatch(addTocart(nextItem))}
                />
              ))}
            </div>

            <div className="surface-card-sm h-fit bg-white p-5">
              <h3 className="text-lg font-semibold text-[#1f2937]">Summary</h3>
              <div className="mt-4 space-y-3 text-sm text-[#6b7280]">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1f2937]">Rs. {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="app-divider my-4" />

              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#1f2937]">Estimated total</span>
                <span className="text-xl font-bold text-[#1f2937]">Rs. {totalPrice.toLocaleString()}</span>
              </div>

              <Link to="/checkout" onClick={() => setOpenCart(false)} className="btn-primary mt-5 !w-full">
                Proceed to checkout
              </Link>
              <button type="button" onClick={() => setOpenCart(false)} className="btn-secondary mt-3 !w-full">
                Continue shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#e6ddd2] bg-white text-[#6b7280]">
              <BsCartX size={28} />
            </div>
            <h3 className="mt-5 text-xl font-semibold text-[#1f2937]">Your cart is empty</h3>
            <p className="mt-3 text-[#6b7280]">Add products to your cart and return here when you are ready to checkout.</p>
            <button type="button" onClick={() => setOpenCart(false)} className="btn-primary mt-6">
              Continue shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const CartItem = ({ data, onRemove, onUpdate }) => {
  const [value, setValue] = useState(Number(data?.qty || 1));

  const total = useMemo(() => Number(data?.discountPrice || 0) * value, [data?.discountPrice, value]);

  const increment = () => {
    if (Number(data?.stock || 0) <= value) {
      toast.error("Product stock is limited.");
      return;
    }

    const nextValue = value + 1;
    setValue(nextValue);
    onUpdate({ ...data, qty: nextValue });
  };

  const decrement = () => {
    const nextValue = value <= 1 ? 1 : value - 1;
    setValue(nextValue);
    onUpdate({ ...data, qty: nextValue });
  };

  return (
    <div className="surface-card-sm bg-white p-4">
      <div className="flex gap-4">
        <div className="h-20 w-20 overflow-hidden rounded-2xl border border-[#e6ddd2] bg-[#fbf8f3]">
          <img
            src={data?.images?.[0]?.url || "/placeholder.svg"}
            alt={data?.name || "Product"}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="font-semibold text-[#1f2937]">{data?.name}</h4>
              <p className="mt-1 text-sm text-[#6b7280]">Rs. {Number(data?.discountPrice || 0).toLocaleString()}</p>
            </div>

            <button
              type="button"
              onClick={onRemove}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e6ddd2] bg-white"
            >
              <RxCross1 size={16} />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex items-center overflow-hidden rounded-full border border-[#e6ddd2]">
              <button type="button" onClick={decrement} className="flex h-10 w-10 items-center justify-center bg-white">
                <HiOutlineMinus />
              </button>
              <span className="min-w-[44px] text-center font-semibold text-[#1f2937]">{value}</span>
              <button type="button" onClick={increment} className="flex h-10 w-10 items-center justify-center bg-white">
                <HiPlus />
              </button>
            </div>

            <p className="font-semibold text-[#1f2937]">Rs. {total.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
