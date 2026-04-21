import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post(
        `${server}/user/login-user`,
        { email, password },
        { withCredentials: true }
      );

      toast.success("Login successful.");
      navigate("/");
      window.location.reload();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to login.");
    }
  };

  return (
    <div className="page-shell flex items-center justify-center px-4 py-12">
      <div className="surface-card w-full max-w-md p-8">
        <span className="eyebrow">Welcome back</span>
        <h1 className="section-heading mt-5 text-[2rem]">Login to GlamCart</h1>
        <p className="section-copy mt-3">Sign in to continue shopping and manage your orders.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#1f2937]">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="field-input"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#1f2937]">Password</label>
            <div className="relative">
              <input
                type={visible ? "text" : "password"}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="field-input pr-12"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setVisible((value) => !value)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280]"
              >
                {visible ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary !w-full">
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#6b7280]">
          Do not have an account?
          <Link to="/sign-up" className="ml-1 font-semibold text-[#1f2937]">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
