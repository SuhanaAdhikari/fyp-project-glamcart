import React from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import CheckoutSteps from "../components/Checkout/CheckoutSteps";
import Checkout from "../components/Checkout/Checkout";

const CheckoutPage = () => {
  return (
    <div className="page-shell">
      <Header />
      <CheckoutSteps active={1} />
      <Checkout />
      <Footer />
    </div>
  );
};

export default CheckoutPage;
