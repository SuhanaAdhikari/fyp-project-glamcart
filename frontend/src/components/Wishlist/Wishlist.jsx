import React, { useMemo } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import { BsCartPlus } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { addTocart } from "../../redux/actions/cart";
import { removeFromWishlist } from "../../redux/actions/wishlist";

const Wishlist = ({ setOpenWishlist }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  const count = wishlist?.length || 0;
  const subtotal = useMemo(() => {
    return (wishlist || []).reduce((total, item) => total + Number(item?.discountPrice || 0), 0);
  }, [wishlist]);

  const addToCartHandler = (item) => {
    dispatch(addTocart({ ...item, qty: 1 }));
    setOpenWishlist(false);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 p-4">
      <div className="surface-card relative max-h-[90vh] w-full max-w-3xl overflow-hidden bg-[#f6f2eb]">
        <div className="flex items-center justify-between border-b border-[#e6ddd2] bg-white px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-[#1f2937]">Wishlist</h2>
            <p className="text-sm text-[#6b7280]">
              {count} item(s) · Rs. {subtotal.toLocaleString()}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpenWishlist(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e6ddd2] bg-white"
          >
            <RxCross1 />
          </button>
        </div>

        <div className="max-h-[72vh] overflow-y-auto p-6">
          {count ? (
            <div className="grid gap-4 md:grid-cols-2">
              {wishlist.map((item) => (
                <div key={item._id} className="surface-card-sm bg-white p-4">
                  <div className="flex gap-4">
                    <div className="h-20 w-20 overflow-hidden rounded-2xl border border-[#e6ddd2] bg-[#fbf8f3]">
                      <img
                        src={item?.images?.[0]?.url || "/placeholder.svg"}
                        alt={item?.name || "Product"}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-[#1f2937]">{item?.name}</h3>
                          <p className="mt-1 text-sm text-[#6b7280]">Rs. {Number(item?.discountPrice || 0).toLocaleString()}</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => dispatch(removeFromWishlist(item))}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e6ddd2] bg-white"
                        >
                          <RxCross1 size={16} />
                        </button>
                      </div>

                      <button type="button" onClick={() => addToCartHandler(item)} className="btn-primary mt-4 !w-full">
                        <BsCartPlus />
                        Add to cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#e6ddd2] bg-white text-[#6b7280]">
                <AiOutlineHeart size={26} />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-[#1f2937]">Your wishlist is empty</h3>
              <p className="mt-3 text-[#6b7280]">Save products here and move them to the cart whenever you are ready.</p>
              <button type="button" onClick={() => setOpenWishlist(false)} className="btn-primary mt-6">
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
