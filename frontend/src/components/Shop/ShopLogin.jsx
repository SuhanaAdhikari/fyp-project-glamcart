import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";

const ShopLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post(
        `${server}/shop/login-shop`,
        { email, password },
        { withCredentials: true }
      );

      toast.success("Login successful.");
      navigate("/dashboard");
      window.location.reload();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to login.");
    }
  };

  return (
    <div className="page-shell flex items-center justify-center px-4 py-12">
      <div className="surface-card w-full max-w-md p-8">
        <span className="eyebrow">Seller access</span>
        <h1 className="section-heading mt-5 text-[2rem]">Login to your shop</h1>
        <p className="section-copy mt-3">
          Manage products, orders and customers from your seller dashboard.
        </p>

        <div className="surface-card-sm mt-6 bg-[#f6f1e9] p-4 text-sm text-[#5b6470]">
          New seller registrations can log in only after an admin approves the shop.
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <Field label="Email address">
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="field-input" required />
          </Field>

          <Field label="Password">
            <div className="relative">
              <input
                type={visible ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="field-input pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setVisible((value) => !value)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280]"
              >
                {visible ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
              </button>
            </div>
          </Field>

          <button type="submit" className="btn-primary !w-full">
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#6b7280]">
          Do not have a seller account?
          <Link to="/shop-create" className="ml-1 font-semibold text-[#1f2937]">
            Create shop
          </Link>
        </p>
      </div>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-[#1f2937]">{label}</label>
    {children}
  </div>
);

export default ShopLogin;
