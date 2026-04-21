import React from "react";
import { Link } from "react-router-dom";

const SellerActivationPage = () => {
  return (
    <div className="page-shell flex min-h-screen items-center justify-center px-4 py-12">
      <div className="surface-card w-full max-w-xl p-8 text-center">
        <span className="eyebrow">Seller registration</span>
        <h1 className="section-heading mt-5 text-[2rem]">Activation links are no longer used</h1>
        <p className="section-copy mt-3">
          Register your shop normally, then wait for admin approval. You can log in only after the admin approves
          your seller account.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/shop-create" className="btn-primary">
            Create shop
          </Link>
          <Link to="/shop-login" className="btn-secondary">
            Seller login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SellerActivationPage;
