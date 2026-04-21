import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [avatar, setAvatar] = useState(null);

  const handleFileInputChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!avatar) {
      toast.error("Please upload an avatar image.");
      return;
    }

    try {
      const response = await axios.post(`${server}/user/create-user`, {
        name,
        email,
        password,
        avatar,
      });

      toast.success(response?.data?.message || "Account created.");
      setName("");
      setEmail("");
      setPassword("");
      setAvatar(null);

      if (response?.data?.activationUrl) {
        window.location.href = response.data.activationUrl;
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to create account.");
    }
  };

  return (
    <div className="page-shell flex items-center justify-center px-4 py-12">
      <div className="surface-card w-full max-w-md p-8">
        <span className="eyebrow">Create account</span>
        <h1 className="section-heading mt-5 text-[2rem]">Join GlamCart</h1>
        <p className="section-copy mt-3">Create an account to manage orders, save products and checkout faster.</p>

        <div className="surface-card-sm mt-8 flex items-center gap-4 bg-[#fbf8f3] p-4">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-[#e6ddd2] bg-white">
            {avatar ? (
              <img src={avatar || "/placeholder.svg"} alt="Avatar preview" className="h-full w-full object-cover" />
            ) : (
              <RxAvatar size={32} className="text-[#6b7280]" />
            )}
          </div>

          <div>
            <p className="font-medium text-[#1f2937]">Profile photo</p>
            <label className="mt-2 inline-flex cursor-pointer rounded-full border border-[#e6ddd2] bg-white px-4 py-2 text-sm font-medium text-[#1f2937]">
              Upload image
              <input
                type="file"
                name="avatar"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#1f2937]">Full name</label>
            <input
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="field-input"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#1f2937]">Email address</label>
            <input
              type="email"
              autoComplete="email"
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
                autoComplete="new-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="field-input pr-12"
                placeholder="Create a password"
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
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#6b7280]">
          Already have an account?
          <Link to="/login" className="ml-1 font-semibold text-[#1f2937]">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
