import React, { useEffect, useState } from "react";
import { CardCvcElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";

const stripeElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#1f2937",
      fontFamily: "Poppins, sans-serif",
      "::placeholder": {
        color: "#9ca3af",
      },
    },
  },
};

const Payment = ({ stripePromise }) => {
  const [orderData, setOrderData] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [khaltiLoading, setKhaltiLoading] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const latestOrder = JSON.parse(localStorage.getItem("latestOrder"));
    setOrderData(latestOrder);
    window.scrollTo(0, 0);
  }, []);

  const order = {
    cart: orderData?.cart,
    shippingAddress: orderData?.shippingAddress,
    user,
    totalPrice: orderData?.totalPrice,
  };

  const paymentData = {
    amount: orderData?.totalPrice ? Math.round(Number(orderData.totalPrice || 0) * 100) : 0,
  };

  const clearCheckoutState = () => {
    localStorage.setItem("cartItems", JSON.stringify([]));
    localStorage.setItem("latestOrder", JSON.stringify([]));
    window.location.reload();
  };

  if (!orderData?.cart?.length) {
    return (
      <section className="section-shell py-8">
        <div className="surface-card p-6 text-center">
          <h2 className="text-xl font-semibold text-[#1f2937]">No order data found</h2>
          <p className="mt-4 text-sm text-[#6b7280]">
            Please complete the checkout form before initiating payment.
          </p>
        </div>
      </section>
    );
  }

  const CardPaymentForm = ({ paymentData, order }) => {
    const stripe = useStripe();
    const elements = useElements();

    const paymentHandler = async (event) => {
      event.preventDefault();

      if (!stripePromise) {
        toast.error("Stripe is not ready yet. Please refresh the page or choose another payment method.");
        return;
      }

      try {
        const config = { headers: { "Content-Type": "application/json" } };
        const response = await axios.post(`${server}/payment/process`, paymentData, config);
        const clientSecret = response?.data?.client_secret;

        if (!stripe || !elements || !clientSecret) {
          toast.error("Stripe is still loading. Please try again in a moment.");
          return;
        }

        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardNumberElement),
          },
        });

        if (result.error) {
          toast.error(result.error.message);
          return;
        }

        if (result.paymentIntent.status === "succeeded") {
          order.paymentInfo = {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
            type: "Credit Card",
          };

          await axios.post(`${server}/order/create-order`, order, config);
          toast.success("Order successful.");
          navigate("/order/success");
          clearCheckoutState();
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Payment processing failed.");
      }
    };

    return (
      <form onSubmit={paymentHandler} className="mt-6 space-y-5">
        <Field label="Name on card">
          <input value={user?.name || ""} readOnly className="field-input bg-[#fbf8f3]" />
        </Field>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Card number">
            <div className="field-input flex items-center">
              <CardNumberElement options={stripeElementOptions} className="w-full" />
            </div>
          </Field>

          <Field label="Expiry date">
            <div className="field-input flex items-center">
              <CardExpiryElement options={stripeElementOptions} className="w-full" />
            </div>
          </Field>
        </div>

        <Field label="Security code">
          <div className="field-input flex items-center">
            <CardCvcElement options={stripeElementOptions} className="w-full" />
          </div>
        </Field>

        <button type="submit" className="btn-primary !w-full">
          Pay now
        </button>
      </form>
    );
  };

  const cashOnDeliveryHandler = async (event) => {
    event.preventDefault();

    try {
      const config = { headers: { "Content-Type": "application/json" } };
      order.paymentInfo = { type: "Cash On Delivery" };
      await axios.post(`${server}/order/create-order`, order, config);
      toast.success("Order successful.");
      navigate("/order/success");
      clearCheckoutState();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to place the order.");
    }
  };

  const khaltiPaymentHandler = async (event) => {
    event.preventDefault();
    if (!orderData?.cart?.length || !orderData?.totalPrice) {
      toast.error("Unable to initiate Khalti payment. Please complete checkout and try again.");
      return;
    }

    setKhaltiLoading(true);

    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const khaltiOrderData = {
        cart: orderData?.cart,
        shippingAddress: orderData?.shippingAddress,
        user,
        totalPrice: orderData?.totalPrice,
        customerInfo: {
          name: user?.name,
          email: user?.email,
          phone: String(user?.phoneNumber || ""),
        },
      };

      const response = await axios.post(`${server}/order/create-order-khalti`, khaltiOrderData, config);

      if (!response?.data?.success) {
        toast.error("Failed to initiate Khalti payment.");
        return;
      }

      const orderIds = response.data.orders.map((item) => item._id).join(",");
      localStorage.setItem("khaltiOrderIds", orderIds);
      localStorage.setItem("khaltiPidx", response.data.khalti.pidx);
      window.location.href = response.data.khalti.payment_url;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to initiate Khalti payment.");
    } finally {
      setKhaltiLoading(false);
    }
  };

  return (
    <section className="section-shell py-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="surface-card p-6">
          <h2 className="text-xl font-semibold text-[#1f2937]">Choose payment method</h2>
          <p className="mt-1 text-sm text-[#6b7280]">Select one payment option and complete the order.</p>

          <div className="mt-6 grid gap-4">
            <MethodButton
              active={selectedMethod === "card"}
              title="Credit or debit card"
              description="Pay securely with Stripe."
              onClick={() => setSelectedMethod("card")}
            />
            <MethodButton
              active={selectedMethod === "khalti"}
              title="Khalti"
              description="Pay using the Khalti wallet flow."
              onClick={() => setSelectedMethod("khalti")}
            />
            <MethodButton
              active={selectedMethod === "cod"}
              title="Cash on delivery"
              description="Pay when your order arrives."
              onClick={() => setSelectedMethod("cod")}
            />
          </div>

          {selectedMethod === "card" && (
            stripePromise ? (
              <CardPaymentForm paymentData={paymentData} order={order} />
            ) : (
              <div className="mt-6 space-y-4">
                <div className="surface-card-sm bg-[#fff7ed] p-4 text-sm text-[#9a3412]">
                  Stripe is not available right now. Please reload the page or use Khalti / Cash on Delivery.
                </div>
              </div>
            )
          )}

          {selectedMethod === "khalti" && (
            <form onSubmit={khaltiPaymentHandler} className="mt-6 space-y-4">
              <div className="surface-card-sm bg-[#fbf8f3] p-4 text-sm text-[#6b7280]">
                You will be redirected to Khalti to complete the payment securely.
              </div>

              <button type="submit" disabled={khaltiLoading} className="btn-primary !w-full">
                {khaltiLoading ? "Processing..." : "Pay with Khalti"}
              </button>
            </form>
          )}

          {selectedMethod === "cod" && (
            <form onSubmit={cashOnDeliveryHandler} className="mt-6 space-y-4">
              <div className="surface-card-sm bg-[#fbf8f3] p-4 text-sm text-[#6b7280]">
                Cash on delivery is available for eligible orders inside Nepal.
              </div>

              <button type="submit" className="btn-primary !w-full">
                Confirm order
              </button>
            </form>
          )}
        </div>

        <div className="surface-card h-fit p-6 lg:sticky lg:top-24">
          <h2 className="text-xl font-semibold text-[#1f2937]">Order summary</h2>
          <div className="mt-5 space-y-3 text-sm text-[#6b7280]">
            <SummaryLine label="Subtotal" value={`Rs. ${Number(orderData?.subTotalPrice || 0).toLocaleString()}`} />
            <SummaryLine label="Shipping" value={`Rs. ${Number(orderData?.shipping || 0).toFixed(2)}`} />
            <SummaryLine
              label="Discount"
              value={
                orderData?.discountPrice ? `Rs. ${Number(orderData.discountPrice).toLocaleString()}` : "Not applied"
              }
            />
          </div>

          <div className="app-divider my-5" />

          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#1f2937]">Total</span>
            <span className="text-2xl font-bold text-[#1f2937]">Rs. {Number(orderData?.totalPrice || 0).toFixed(2)}</span>
          </div>

          <div className="surface-card-sm mt-5 bg-[#fbf8f3] p-4 text-sm text-[#6b7280]">
            <p className="font-medium text-[#1f2937]">Delivery address</p>
            <p className="mt-2">
              {orderData?.shippingAddress?.address1}
              {orderData?.shippingAddress?.address2 ? `, ${orderData.shippingAddress.address2}` : ""}
              {orderData?.shippingAddress?.city ? `, ${orderData.shippingAddress.city}` : ""}
              {orderData?.shippingAddress?.zipCode ? ` - ${orderData.shippingAddress.zipCode}` : ""}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const MethodButton = ({ active, title, description, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-[20px] border p-4 text-left transition ${
      active ? "border-[#1f2937] bg-[#1f2937] text-white" : "border-[#e6ddd2] bg-[#fbf8f3] text-[#1f2937]"
    }`}
  >
    <p className="font-semibold">{title}</p>
    <p className={`mt-1 text-sm ${active ? "text-white/80" : "text-[#6b7280]"}`}>{description}</p>
  </button>
);

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

export default Payment;
