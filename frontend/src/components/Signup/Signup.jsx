import React, { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { Link } from "react-router-dom"
import { RxAvatar } from "react-icons/rx"
import axios from "axios"
import { server } from "../../server"
import { toast } from "react-toastify"

const Signup = () => {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [visible, setVisible] = useState(false)
  const [avatar, setAvatar] = useState(null)

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (reader.readyState === 2) setAvatar(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    axios
      .post(`${server}/user/create-user`, { name, email, password, avatar })
      .then((res) => {
        toast.success(res.data.message)
        setName("")
        setEmail("")
        setPassword("")
        setAvatar(null)
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Something went wrong!")
      })
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4 py-10">
      {/* Background (matches GlamCart theme) */}
      <div className="absolute inset-0 bg-[#0b1020]" />
      <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_20%_10%,rgba(236,72,153,0.25),transparent_60%),radial-gradient(900px_520px_at_80%_20%,rgba(139,92,246,0.25),transparent_60%),radial-gradient(700px_420px_at_50%_100%,rgba(61,86,154,0.18),transparent_60%)]" />

      {/* Card */}
      <div className="relative w-full max-w-md rounded-3xl bg-white/10 backdrop-blur-xl border border-white/15 shadow-[0_25px_60px_-25px_rgba(0,0,0,0.9)] p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-violet-600" />
            <span className="text-xs text-white/80 font-semibold tracking-wide">Create your account</span>
          </div>

          <h2 className="mt-4 text-3xl font-extrabold text-white">Join GlamCart</h2>
          <p className="mt-2 text-sm text-white/70">Makeup • Skincare • Glow — all in one place</p>
        </div>

        {/* Avatar Upload (NEW UI) */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/10 border border-white/15 flex items-center justify-center">
                {avatar ? (
                  <img src={avatar || "/placeholder.svg"} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <RxAvatar className="text-white/70" size={34} />
                )}
              </div>

              <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 border border-white/20" />
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Profile photo</p>
              <p className="text-xs text-white/60">JPG, JPEG, PNG only</p>

              <label className="mt-3 inline-flex cursor-pointer items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white bg-white/10 border border-white/15 hover:bg-white/15 transition">
                Upload Image
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
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Full Name</label>
            <input
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="
                w-full rounded-xl bg-white/10 border border-white/20
                px-4 py-3 text-white placeholder-white/50
                outline-none focus:ring-4 focus:ring-pink-500/30
                focus:border-pink-400/50 transition
              "
              placeholder="Your name"
            />
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
                outline-none focus:ring-4 focus:ring-pink-500/30
                focus:border-pink-400/50 transition
              "
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
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
                  outline-none focus:ring-4 focus:ring-pink-500/30
                  focus:border-pink-400/50 transition
                "
                placeholder="Create a strong password"
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

          {/* Submit */}
          <button
            type="submit"
            className="
              w-full rounded-xl py-3 font-bold text-white
              bg-gradient-to-r from-pink-500 to-violet-600
              hover:brightness-110 transition
              shadow-[0_15px_35px_-15px_rgba(236,72,153,0.9)]
            "
          >
            Create Account ✨
          </button>

          {/* Footer */}
          <div className="text-center text-sm text-white/70">
            Already have an account?
            <Link to="/login" className="ml-1 text-pink-400 hover:text-pink-300 font-semibold">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup
