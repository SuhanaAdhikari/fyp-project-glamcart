import React from "react"
import { Link } from "react-router-dom"
import { AiFillFacebook, AiOutlineTwitter, AiFillInstagram, AiFillYoutube } from "react-icons/ai"

const SOCIALS = [
  { name: "Facebook", href: "https://facebook.com", icon: <AiFillFacebook size={20} /> },
  { name: "Twitter", href: "https://twitter.com", icon: <AiOutlineTwitter size={20} /> },
  { name: "Instagram", href: "https://instagram.com", icon: <AiFillInstagram size={20} /> },
  { name: "YouTube", href: "https://youtube.com", icon: <AiFillYoutube size={20} /> },
]

const Footer = () => {
  return (
    <footer className="relative text-white">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[#0b1020]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(900px_500px_at_20%_10%,rgba(236,72,153,0.18),transparent_60%),radial-gradient(900px_500px_at_80%_20%,rgba(139,92,246,0.18),transparent_60%),radial-gradient(700px_400px_at_50%_100%,rgba(61,86,154,0.18),transparent_60%)]" />

      {/* Top divider */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* ================== Newsletter Card ================== */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-12">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_80px_-30px_rgba(0,0,0,0.7)]">
          <div className="absolute inset-0 bg-[radial-gradient(600px_260px_at_15%_20%,rgba(236,72,153,0.25),transparent_60%),radial-gradient(600px_260px_at_85%_30%,rgba(139,92,246,0.22),transparent_60%)]" />
          <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-gradient-to-r from-pink-500/25 to-violet-600/25 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-52 h-52 rounded-full bg-gradient-to-r from-violet-600/25 to-blue-500/25 blur-2xl" />

          <div className="relative p-6 sm:p-10 lg:p-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Left text */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/5">
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-pink-500 to-violet-600" />
                <span className="text-xs font-semibold text-white/90 tracking-wide">GlamCart Insider</span>
              </div>

              <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight">
                Get beauty drops, deals & skincare tips
              </h2>

              <p className="mt-2 text-sm sm:text-base text-white/70 max-w-xl">
                Subscribe for early access to new launches, limited offers, and curated beauty recommendations.
              </p>
            </div>

            {/* Right form */}
            <div className="w-full lg:w-[520px]">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-white placeholder:text-white/55 outline-none focus:ring-4 focus:ring-pink-500/20 focus:border-pink-400/40 transition"
                  />
                  <button className="rounded-xl px-6 py-3 font-bold bg-gradient-to-r from-pink-500 to-violet-600 hover:brightness-110 transition shadow-[0_12px_30px_-18px_rgba(236,72,153,0.9)] whitespace-nowrap">
                    Subscribe ✨
                  </button>
                </div>

                <p className="mt-3 text-xs text-white/55">No spam. Unsubscribe anytime.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================== Links Area ================== */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-12 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                <span className="font-extrabold text-white">G</span>
              </div>
              <div>
                <h3 className="text-xl font-extrabold">GlamCart</h3>
                <p className="text-xs text-white/60 -mt-0.5">Beauty • Skincare • Glow</p>
              </div>
            </div>

            <p className="mt-4 text-sm text-white/70 leading-relaxed max-w-sm">
              Shop authentic makeup and skincare essentials from trusted global brands — curated for your glow.
            </p>

            {/* Social links (✅ no eslint warning) */}
            <div className="mt-5 flex items-center gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition flex items-center justify-center"
                  aria-label={s.name}
                  title={s.name}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div>
              <h4 className="text-sm font-bold tracking-wide text-white/90">Company</h4>
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                <li><Link to="#" className="hover:text-white transition">About GlamCart</Link></li>
                <li><Link to="#" className="hover:text-white transition">Careers</Link></li>
                <li><Link to="#" className="hover:text-white transition">Beauty Blog</Link></li>
                <li><Link to="#" className="hover:text-white transition">Partnerships</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold tracking-wide text-white/90">Shop</h4>
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                <li><Link to="#" className="hover:text-white transition">Makeup</Link></li>
                <li><Link to="#" className="hover:text-white transition">Skincare</Link></li>
                <li><Link to="#" className="hover:text-white transition">Hair Care</Link></li>
                <li><Link to="#" className="hover:text-white transition">Fragrances</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold tracking-wide text-white/90">Support</h4>
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                <li><Link to="#" className="hover:text-white transition">Help Center</Link></li>
                <li><Link to="#" className="hover:text-white transition">Orders & Returns</Link></li>
                <li><Link to="#" className="hover:text-white transition">Shipping Info</Link></li>
                <li><Link to="#" className="hover:text-white transition">Track Order</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold tracking-wide text-white/90">Legal</h4>
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                <li><Link to="#" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link to="#" className="hover:text-white transition">Terms of Service</Link></li>
                <li><Link to="#" className="hover:text-white transition">Refund Policy</Link></li>
                <li><Link to="#" className="hover:text-white transition">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/55">
            <p>© {new Date().getFullYear()} GlamCart. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 animate-pulse" />
                Secure checkout
              </span>
              <span className="hidden sm:inline">•</span>
              <span>Made for glow ✨</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
