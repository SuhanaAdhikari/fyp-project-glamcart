import React from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import CheckoutSteps from "../components/Checkout/CheckoutSteps";
import Payment from "../components/Payment/Payment";
import { Elements } from "@stripe/react-stripe-js";

const PaymentPage = ({ stripePromise }) => {
  return (
    <div className="page-shell">
      <Header />
      <CheckoutSteps active={2} />
      {stripePromise ? (
        <Elements stripe={stripePromise}>
          <Payment stripePromise={stripePromise} />
        </Elements>
      ) : (
        <Payment stripePromise={stripePromise} />
      )}
      <Footer />
    </div>
  );
};

export default PaymentPage;
