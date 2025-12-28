import React from "react"
import styles from "../../styles/styles"

/**
 * Reliable global SVG CDN:
 * https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/<slug>.svg
 * Source: Simple Icons + jsDelivr CDN :contentReference[oaicite:1]{index=1}
 */
const brands = [
  // Makeup
  { name: "Sephora", slug: "sephora", domain: "sephora.com" },
  { name: "MAC Cosmetics", slug: "maccosmetics", domain: "maccosmetics.com" },
  { name: "Maybelline", slug: "maybelline", domain: "maybelline.com" },
  { name: "L'Oréal", slug: "loreal", domain: "lorealparis.com" },

  // Skincare
  { name: "CeraVe", slug: "cerave", domain: "cerave.com" },
  { name: "The Ordinary", slug: "theordinary", domain: "theordinary.com" },
  { name: "La Roche-Posay", slug: "larocheposay", domain: "laroche-posay.com" },
]

const iconUrl = (slug) => `https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/${slug}.svg`
const clearbitUrl = (domain) => `https://logo.clearbit.com/${domain}`

const Sponsored = () => {
  return (
    <section className="relative py-14 hidden sm:block">
      {/* soft glam background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-pink-50 via-white to-violet-50" />

      <div className={`${styles.section}`}>
        {/* Header */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-pink-500 to-violet-600" />
            <span className="text-xs font-semibold text-gray-800 tracking-wide">Beauty Partners</span>
          </div>

          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-gray-900">
            Sponsored Brands
          </h2>

          <p className="mt-2 text-sm md:text-base text-gray-600 max-w-xl">
            Makeup & skincare brands — curated for GlamCart customers.
          </p>
        </div>

        {/* Brand Logos */}
        <div className="relative">
          <div className="absolute inset-0 rounded-[28px] bg-white/60 backdrop-blur-md border border-gray-200" />

          <div className="relative rounded-[28px] p-6 md:p-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 md:gap-8">
              {brands.map((b, idx) => (
                <div
                  key={idx}
                  className="
                    group
                    rounded-2xl
                    bg-white
                    border border-gray-200
                    shadow-sm
                    flex items-center justify-center
                    h-[90px]
                    transition-all duration-300
                    hover:shadow-md
                    hover:-translate-y-1
                  "
                  title={b.name}
                >
                  {/* Use SVG logo via CDN */}
                  <img
                    src={iconUrl(b.slug)}
                    alt={b.name}
                    loading="lazy"
                    className="
                      max-h-[42px]
                      max-w-[120px]
                      object-contain
                      opacity-80
                      transition-all duration-300
                      group-hover:opacity-100
                      group-hover:scale-105
                    "
                    onError={(e) => {
                      // fallback: try clearbit domain logo
                      e.currentTarget.onerror = null
                      e.currentTarget.src = clearbitUrl(b.domain)
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Logos are fetched via public brand icon/CDN sources.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Sponsored
