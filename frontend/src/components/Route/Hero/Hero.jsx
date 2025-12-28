import React, { useEffect, useMemo, useState } from "react"
import styles from "../../../styles/styles"
import { Link } from "react-router-dom"
import { FaShoppingBag } from "react-icons/fa"

const Hero = () => {
  // ✅ GlamCart words (not footwear)
  const words = useMemo(
    () => ["Glam Essentials", "Beauty Picks", "New Arrivals"],
    []
  )

  const [index, setIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((p) => (p + 1) % words.length)
    }, 2200)
    return () => clearInterval(t)
  }, [words.length])

  return (
    <section
      className={`relative w-full h-[90vh] min-h-[620px] flex items-center overflow-hidden ${styles.normalFlex}`}
      style={{
        backgroundImage: "var(--hero-bg)", // ✅ global hero image
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Strong glam overlay (high contrast) */}
      <div className="absolute inset-0 bg-black/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#15001f]/90 via-black/70 to-black/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

      {/* Brand glow blobs */}
      <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-pink-500/35 blur-3xl" />
      <div className="absolute -bottom-36 -right-36 w-[580px] h-[580px] rounded-full bg-violet-500/35 blur-3xl" />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Badge */}
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow">
          <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-pink-500 to-violet-600" />
          <span className="text-white text-sm font-semibold tracking-wide">
            GlamCart • Premium Picks
          </span>
        </div>

        {/* Headline */}
        <h1 className="mt-7 text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] text-white drop-shadow-[0_12px_40px_rgba(0,0,0,0.85)]">
          <span className="block text-white/90">Discover</span>

          {/* ✅ Always visible (no clipping/translate). Unique animation. */}
          <span className="relative block mt-3">
            <span
              key={index} // ✅ forces animation replay each word
              className="
                inline-block
                text-transparent bg-clip-text
                bg-gradient-to-r from-pink-300 via-fuchsia-200 to-violet-200
                drop-shadow-[0_10px_35px_rgba(0,0,0,0.6)]
                animate-[glamWordIn_2.2s_ease-in-out_infinite]
              "
            >
              {words[index]}
            </span>

            {/* Underline */}
            <span
              className="
                block mt-4
                h-[6px] w-[280px] md:w-[380px]
                rounded-full
                bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-600
                shadow-[0_10px_30px_rgba(236,72,153,0.35)]
                animate-[glamUnderline_2.2s_ease-in-out_infinite]
              "
            />
          </span>
        </h1>

        {/* Description */}
        <p className="mt-7 max-w-[720px] text-base md:text-lg text-white/90 leading-relaxed">
          <span className="font-bold text-white">GlamCart</span> brings you curated fashion and beauty essentials. Shop
          best sellers, explore new drops, and upgrade your style — all in one destination.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link to="/products">
            <div
              className="
                group inline-flex items-center gap-3
                px-7 py-4 rounded-2xl
                bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-600
                shadow-[0_18px_55px_rgba(236,72,153,0.45)]
                hover:shadow-[0_22px_75px_rgba(168,85,247,0.55)]
                hover:-translate-y-1
                transition-all duration-300
                border border-white/15
              "
            >
              <span className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur">
                <FaShoppingBag size={20} className="text-white group-hover:scale-110 transition-transform" />
              </span>
              <span className="text-white font-semibold text-[16px] tracking-wide">
                Shop Now
              </span>
            </div>
          </Link>

          <Link to="/offers">
            <div
              className="
                inline-flex items-center justify-center
                px-7 py-4 rounded-2xl
                bg-white/10 backdrop-blur-md
                border border-white/25
                text-white font-semibold text-[16px]
                hover:bg-white/15
                transition-all duration-300
              "
            >
              View Offers
            </div>
          </Link>
        </div>

        {/* Trust strip */}
        <div className="mt-10">
          <div className="inline-flex flex-wrap items-center gap-6 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/25 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
            {["Fast Delivery", "Easy Returns", "Secure Payments"].map((t) => (
              <span key={t} className="text-white font-semibold text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 flex items-center justify-center text-[12px]">
                  ✓
                </span>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes glamWordIn {
          0%   { opacity: 0; transform: translateY(18px); filter: blur(2px); }
          18%  { opacity: 1; transform: translateY(0px);  filter: blur(0px); }
          78%  { opacity: 1; transform: translateY(0px);  filter: blur(0px); }
          100% { opacity: 0; transform: translateY(-12px); filter: blur(2px); }
        }

        @keyframes glamUnderline {
          0%   { transform: scaleX(0.15); transform-origin: left; opacity: .35; }
          35%  { transform: scaleX(1);    transform-origin: left; opacity: .95; }
          70%  { transform: scaleX(1);    transform-origin: right; opacity: .85; }
          100% { transform: scaleX(0.15); transform-origin: right; opacity: .35; }
        }
      `}</style>
    </section>
  )
}

export default Hero
