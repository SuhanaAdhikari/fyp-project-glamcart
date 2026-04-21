import React, { useEffect, useState } from "react";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfUser } from "../redux/actions/order";
import { server } from "../server";
import { RxCross1 } from "react-icons/rx";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";

const UserOrderDetails = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(1);

  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch,user._id]);

  const data = orders && orders.find((item) => item._id === id);

  const reviewHandler = async (e) => {
    await axios
      .put(
        `${server}/product/create-new-review`,
        {
          user,
          rating,
          comment,
          productId: selectedItem?._id,
          orderId: id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success(res.data.message);
        dispatch(getAllOrdersOfUser(user._id));
        setComment("");
        setRating(null);
        setOpen(false);
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  
  const refundHandler = async () => {
    await axios.put(`${server}/order/order-refund/${id}`,{
      status: "Processing refund"
    }).then((res) => {
       toast.success(res.data.message);
    dispatch(getAllOrdersOfUser(user._id));
    }).catch((error) => {
      toast.error(error.response.data.message);
    })
  };

  if (!data) {
    return (
      <div className="page-shell">
        <div className="section-shell py-10">
          <div className="surface-card flex min-h-[320px] items-center justify-center text-[var(--color-muted)]">
            Loading order details...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="section-shell py-8">
        <div className="surface-card p-5 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-accent-strong)]">
                <BsFillBagFill size={22} />
              </div>
              <div>
                <h1 className="text-[25px] font-semibold text-[var(--color-text)]">Order Details</h1>
                <p className="mt-1 text-sm text-[var(--color-muted)]">Review items, payment, shipping, and refund options.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="status-chip status-chip--muted">Order ID: #{data?._id?.slice(0, 8)}</span>
              <span className="status-chip status-chip--neutral">Placed on: {data?.createdAt?.slice(0, 10)}</span>
            </div>
          </div>
        </div>

      {/* order items */}
        <div className="mt-6 surface-card p-5 md:p-6">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">Items</h2>
          <div className="mt-5 space-y-4">
            {data?.cart.map((item) => {
              return(
              <div key={item?._id || item?.name} className="surface-card-sm flex flex-col gap-4 p-4 md:flex-row md:items-center">
                <img
                  src={`${item.images[0]?.url}`}
                  alt={item.name}
                  className="h-[88px] w-[88px] rounded-2xl border border-[var(--color-border)] object-cover"
                />
                <div className="flex-1">
                  <h5 className="text-[20px] font-semibold text-[var(--color-text)]">{item.name}</h5>
                  <h5 className="mt-1 text-[16px] text-[var(--color-muted)]">
                    Rs. {item.discountPrice} x {item.qty}
                  </h5>
                </div>
                {!item.isReviewed && data?.status === "Delivered" ? (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => setOpen(true) || setSelectedItem(item)}
                  >
                    Write a review
                  </button>
                ) : null}
              </div>
              )
             })}
          </div>
        </div>

      {/* review popup */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="surface-card w-full max-w-2xl p-4 md:p-6">
            <div className="w-full flex justify-end p-3">
              <RxCross1
                size={30}
                onClick={() => setOpen(false)}
                className="cursor-pointer text-[var(--color-text)]"
              />
            </div>
            <h2 className="text-center text-[30px] font-[500] font-Poppins text-[var(--color-text)]">
              Give a Review
            </h2>
            <br />
            <div className="surface-card-sm flex w-full items-center gap-4 p-4">
              <img
                src={`${selectedItem?.images[0]?.url}`}
                alt={selectedItem?.name}
                className="h-[80px] w-[80px] rounded-2xl border border-[var(--color-border)] object-cover"
              />
              <div>
                <div className="text-[20px] font-semibold text-[var(--color-text)]">{selectedItem?.name}</div>
                <h4 className="mt-1 text-[18px] text-[var(--color-muted)]">
                  Rs. {selectedItem?.discountPrice} x {selectedItem?.qty}
                </h4>
              </div>
            </div>

            <br />
            <br />

            {/* ratings */}
            <h5 className="pl-3 text-[20px] font-[500] text-[var(--color-text)]">
              Give a Rating <span className="text-red-500">*</span>
            </h5>
            <div className="flex w-full ml-2 pt-1">
              {[1, 2, 3, 4, 5].map((i) =>
                rating >= i ? (
                  <AiFillStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246,186,0)"
                    size={25}
                    onClick={() => setRating(i)}
                  />
                ) : (
                  <AiOutlineStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246,186,0)"
                    size={25}
                    onClick={() => setRating(i)}
                  />
                )
              )}
            </div>
            <br />
            <div className="w-full ml-3">
              <label className="block text-[20px] font-[500] text-[var(--color-text)]">
                Write a comment
                <span className="ml-1 font-[400] text-[16px] text-[var(--color-muted)]">
                  (optional)
                </span>
              </label>
              <textarea
                name="comment"
                id=""
                cols="20"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was your product? write your expresion about it!"
                className="field-textarea mt-2 w-[95%]"
              ></textarea>
            </div>
            <button
              type="button"
              className="btn-primary ml-3 mt-4 text-[18px]"
              onClick={rating > 1 ? reviewHandler : null}
            >
              Submit
            </button>
          </div>
        </div>
      )}

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="surface-card p-5 md:p-6">
            <h4 className="text-[20px] font-[600] text-[var(--color-text)]">Shipping Address</h4>
            <h4 className="pt-3 text-[18px] text-[var(--color-text)]">
            {data?.shippingAddress.address1 +
              " " +
              data?.shippingAddress.address2}
          </h4>
            <h4 className="pt-2 text-[18px] text-[var(--color-muted)]">{data?.shippingAddress.country}</h4>
            <h4 className="pt-2 text-[18px] text-[var(--color-muted)]">{data?.shippingAddress.city}</h4>
            <h4 className="pt-2 text-[18px] text-[var(--color-muted)]">{data?.user?.phoneNumber}</h4>
          </div>
          <div className="surface-card p-5 md:p-6">
            <h4 className="text-[20px] text-[var(--color-text)]">Payment Info</h4>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-[var(--color-muted)]">Status:</span>
              <span className={data?.paymentInfo?.status ? "status-chip status-chip--success" : "status-chip status-chip--neutral"}>
                {data?.paymentInfo?.status ? data?.paymentInfo?.status : "Not Paid"}
              </span>
            </div>
            <div className="mt-5 border-t border-[var(--color-border)] pt-4">
              <h5 className="text-[18px] text-[var(--color-text)]">
                Total Price: <strong>Rs. {data?.totalPrice}</strong>
              </h5>
            </div>
           {
            data?.status === "Delivered" && (
              <button
                type="button"
                className="btn-primary mt-5"
                onClick={refundHandler}
              >
                Give a Refund
              </button>
            )
           }
          </div>
        </div>
        <div className="mt-6">
          <Link to="/">
            <div className="btn-secondary w-fit">Send Message</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserOrderDetails;
