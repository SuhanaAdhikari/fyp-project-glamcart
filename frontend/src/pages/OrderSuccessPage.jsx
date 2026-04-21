import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

const OrderSuccessPage = () => {
  return (
    <div className="page-shell">
      <Header />
      <section className="section-shell py-12">
        <div className="surface-card mx-auto max-w-2xl p-10 text-center">
          <span className="eyebrow">Order complete</span>
          <h1 className="section-heading mt-5">Your order was placed successfully</h1>
          <p className="section-copy mt-4">
            The order has been saved and you can continue shopping or review your account for order updates.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/products" className="btn-primary">
              Continue shopping
            </Link>
            <Link to="/profile" className="btn-secondary">
              View account
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default OrderSuccessPage;
