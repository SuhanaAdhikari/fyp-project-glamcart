import React, { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { server } from "../../server"
import { toast } from "react-toastify"

const ShopLogin = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [visible, setVisible] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    await axios
      .post(
        `${server}/shop/login-shop`,
        { email, password },
        { withCredentials: true }
      )
      .then(() => {
        toast.success("Login Success!")
        navigate("/dashboard")
        window.location.reload(true)
      })
      .catch((err) => {
        toast.error(err.response.data.message)
      })
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 py-10">
      {/* Background (GlamCart seller theme) */}
      <div className="absolute inset-0 bg-[#0b1020]" />
      <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_15%_10%,rgba(61,86,154,0.22),transparent_60%),radial-gradient(900px_520px_at_85%_20%,rgba(139,92,246,0.22),transparent_60%),radial-gradient(700px_420px_at_50%_100%,rgba(236,72,153,0.14),transparent_60%)]" />

      {/* Card */}
      <div className="relative w-full max-w-md rounded-3xl bg-white/10 backdrop-blur-xl border border-white/15 shadow-[0_25px_60px_-25px_rgba(0,0,0,0.9)] p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-pink-500" />
            <span className="text-xs text-white/80 font-semibold tracking-wide">Seller Access</span>
          </div>

          <h2 className="mt-4 text-3xl font-extrabold text-white">Login to your shop</h2>
          <p className="mt-2 text-sm text-white/70">
            Manage products, orders & customers from your dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Password</label>
            <div className="relative">
              <input
                type={visible ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  w-full rounded-xl bg-white/10 border border-white/20
                  px-4 py-3 text-white placeholder-white/50
                  outline-none focus:ring-4 focus:ring-violet-500/30
                  focus:border-violet-400/50 transition
                "
                placeholder="••••••••"
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

          {/* Options */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-white/70">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-white/30 bg-white/10 text-violet-500 focus:ring-violet-500"
              />
              Remember me
            </label>

            {/* ✅ Use Link (avoid eslint warning for href=".forgot-password") */}
            <Link to="/forgot-password" className="text-violet-300 hover:text-violet-200 transition">
              Forgot password?
            </Link>
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
            Sign In
          </button>

          {/* Footer */}
          <div className="text-center text-sm text-white/70">
            Don’t have a shop account?
            <Link to="/shop-create" className="ml-1 text-pink-300 hover:text-pink-200 font-semibold">
              Create Shop
            </Link>
          </div>
        </form>

        {/* Small helper panel */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-white/65">
            Tip: Keep your store profile updated to build trust and boost sales.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ShopLogin
