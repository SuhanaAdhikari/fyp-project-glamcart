import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";

const ShopCreate = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!avatar) {
      toast.error("Please upload a shop logo.");
      return;
    }

    try {
      const response = await axios.post(`${server}/shop/create-shop`, {
        name,
        email,
        password,
        avatar,
        zipCode,
        address,
        phoneNumber,
      });

      toast.success(response?.data?.message || "Shop created.");
      setName("");
      setEmail("");
      setPassword("");
      setAvatar("");
      setZipCode("");
      setAddress("");
      setPhoneNumber("");

    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to create shop.");
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="page-shell flex items-center justify-center px-4 py-12">
      <div className="surface-card w-full max-w-[42rem] p-8">
        <span className="eyebrow">Become a seller</span>
        <h1 className="section-heading mt-5 text-[2rem]">Create your shop</h1>
        <p className="section-copy mt-3">
          Register your seller account. An admin must review and approve your shop before your first login.
        </p>

        <div className="surface-card-sm mt-8 flex items-center gap-4 bg-[#fbf8f3] p-4">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-[#e6ddd2] bg-white">
            {avatar ? (
              <img src={avatar || "/placeholder.svg"} alt="Shop logo preview" className="h-full w-full object-cover" />
            ) : (
              <RxAvatar size={32} className="text-[#6b7280]" />
            )}
          </div>

          <div>
            <p className="font-medium text-[#1f2937]">Shop logo</p>
            <label className="mt-2 inline-flex cursor-pointer rounded-full border border-[#e6ddd2] bg-white px-4 py-2 text-sm font-medium text-[#1f2937]">
              Upload logo
              <input type="file" name="avatar" accept="image/*" onChange={handleFileInputChange} className="hidden" />
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Shop name">
              <input value={name} onChange={(event) => setName(event.target.value)} className="field-input" required />
            </Field>
            <Field label="Phone number">
              <input
                type="number"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                className="field-input"
                required
              />
            </Field>
          </div>

          <Field label="Email address">
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="field-input" required />
          </Field>

          <Field label="Address">
            <input value={address} onChange={(event) => setAddress(event.target.value)} className="field-input" required />
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Zip code">
              <input type="number" value={zipCode} onChange={(event) => setZipCode(event.target.value)} className="field-input" required />
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
          </div>

          <button type="submit" className="btn-primary !w-full">
            Create shop
          </button>
        </form>

        <div className="surface-card-sm mt-6 bg-[#f6f1e9] p-4 text-sm text-[#5b6470]">
          After registration, your shop stays pending until an admin approves it. No email activation link is required.
        </div>

        <p className="mt-6 text-center text-sm text-[#6b7280]">
          Already have a seller account?
          <Link to="/shop-login" className="ml-1 font-semibold text-[#1f2937]">
            Sign in
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

export default ShopCreate;
