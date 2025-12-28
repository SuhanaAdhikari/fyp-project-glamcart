import React, { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { Link } from "react-router-dom"
import axios from "axios"
import { server } from "../../server"
import { toast } from "react-toastify"
import { RxAvatar } from "react-icons/rx"

const ShopCreate = () => {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [address, setAddress] = useState("")
  const [avatar, setAvatar] = useState("")
  const [password, setPassword] = useState("")
  const [visible, setVisible] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(`${server}/shop/create-shop`, {
        name,
        email,
        password,
        avatar,
        zipCode,
        address,
        phoneNumber,
      })
      toast.success(data.message)
      setName("")
      setEmail("")
      setPassword("")
      setAvatar("")
      setZipCode("")
      setAddress("")
      setPhoneNumber("")
    } catch (error) {
      toast.error(error.response?.data?.message || "Error occurred")
    }
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (reader.readyState === 2) setAvatar(reader.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 py-10">
      {/* Background (GlamCart Seller style) */}
      <div className="absolute inset-0 bg-[#0b1020]" />
      <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_18%_10%,rgba(61,86,154,0.22),transparent_60%),radial-gradient(900px_520px_at_85%_18%,rgba(139,92,246,0.22),transparent_60%),radial-gradient(700px_420px_at_50%_100%,rgba(236,72,153,0.14),transparent_60%)]" />

      {/* Card */}
      <div className="relative w-full max-w-[38rem] rounded-3xl bg-white/10 backdrop-blur-xl border border-white/15 shadow-[0_25px_60px_-25px_rgba(0,0,0,0.9)] p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-pink-500" />
            <span className="text-xs text-white/80 font-semibold tracking-wide">Become a Seller</span>
          </div>

          <h2 className="mt-4 text-3xl font-extrabold text-white">Create your shop</h2>
          <p className="mt-2 text-sm text-white/70">
            Start selling makeup, skincare, and beauty products on GlamCart
          </p>
        </div>

        {/* Logo upload (new UI) */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/10 border border-white/15 flex items-center justify-center">
                {avatar ? (
                  <img src={avatar || "/placeholder.svg"} alt="logo" className="w-full h-full object-cover" />
                ) : (
                  <RxAvatar className="text-white/70" size={34} />
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 border border-white/20" />
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Shop Logo</p>
              <p className="text-xs text-white/60">Upload your brand identity (PNG/JPG)</p>

              <label className="mt-3 inline-flex cursor-pointer items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white bg-white/10 border border-white/15 hover:bg-white/15 transition">
                Upload Logo
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Shop Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="
                  w-full rounded-xl bg-white/10 border border-white/20
                  px-4 py-3 text-white placeholder-white/50
                  outline-none focus:ring-4 focus:ring-violet-500/30
                  focus:border-violet-400/50 transition
                "
                placeholder="Your shop name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Phone Number</label>
              <input
                type="number"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="
                  w-full rounded-xl bg-white/10 border border-white/20
                  px-4 py-3 text-white placeholder-white/50
                  outline-none focus:ring-4 focus:ring-violet-500/30
                  focus:border-violet-400/50 transition
                "
                placeholder="98XXXXXXXX"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Email address</label>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full rounded-xl bg-white/10 border border-white/20
                px-4 py-3 text-white placeholder-white/50
                outline-none focus:ring-4 focus:ring-violet-500/30
                focus:border-violet-400/50 transition
              "
              placeholder="shop@email.com"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Address</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="
                w-full rounded-xl bg-white/10 border border-white/20
                px-4 py-3 text-white placeholder-white/50
                outline-none focus:ring-4 focus:ring-violet-500/30
                focus:border-violet-400/50 transition
              "
              placeholder="Your shop address"
            />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Zip Code</label>
              <input
                type="number"
                required
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="
                  w-full rounded-xl bg-white/10 border border-white/20
                  px-4 py-3 text-white placeholder-white/50
                  outline-none focus:ring-4 focus:ring-violet-500/30
                  focus:border-violet-400/50 transition
                "
                placeholder="Zip code"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Password</label>
              <div className="relative">
                <input
                  type={visible ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    w-full rounded-xl bg-white/10 border border-white/20
                    px-4 py-3 text-white placeholder-white/50
                    outline-none focus:ring-4 focus:ring-violet-500/30
                    focus:border-violet-400/50 transition
                  "
                  placeholder="Create password"
                />
                {visible ? (
                  <AiOutlineEye
                    size={22}
                    className="absolute right-4 top-3.5 cursor-pointer text-white/70 hover:text-white"
                    onClick={() => setVisible(false)}
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    size={22}
                    className="absolute right-4 top-3.5 cursor-pointer text-white/70 hover:text-white"
                    onClick={() => setVisible(true)}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="
              w-full rounded-xl py-3 font-bold text-white
              bg-gradient-to-r from-violet-600 to-pink-500
              hover:brightness-110 transition
              shadow-[0_15px_35px_-15px_rgba(139,92,246,0.9)]
            "
          >
            Create Shop ✨
          </button>

          {/* Footer */}
          <div className="text-center text-sm text-white/70">
            Already have a shop account?
            <Link to="/shop-login" className="ml-1 text-pink-300 hover:text-pink-200 font-semibold">
              Sign in
            </Link>
          </div>
        </form>

        {/* Helper */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-white/65">
            Tip: Use a clean logo and complete your store details to build customer trust.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ShopCreate
