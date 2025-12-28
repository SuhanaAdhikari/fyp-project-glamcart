import React, { useEffect, useState } from "react"
import styles from "../../../styles/styles"
import ProductCard from "../ProductCard/ProductCard"
import axios from "axios"
import { server } from "../../../server"

const FeaturedProducts = () => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get(`${server}/product/get-all-products`)
        const featured = response.data.products.slice(0, 10)
        setProducts(featured)
      } catch (error) {
        console.error("Error fetching featured products:", error)
      }
    }

    fetchFeaturedProducts()
  }, [])

  return (
    <section className="w-full py-14 relative z-0">
      {/* soft glam background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-pink-50 via-white to-violet-50" />

      <div className={`${styles.section}`}>
        {/* ================= Header row (matches your BestDeals theme) ================= */}
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-pink-500 to-violet-600" />
              <span className="text-xs md:text-sm font-semibold text-gray-800 tracking-wide">
                Curated Picks
              </span>
            </div>

            <h1 className="mt-4 text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              Featured Products
            </h1>

            <p className="mt-2 text-sm md:text-base text-gray-600 max-w-[620px]">
              Handpicked favorites to match your vibe — premium looks, clean prices, fast checkout.
            </p>
          </div>

          {/* Right mini card */}
          <div className="w-full md:w-[360px]">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900">Selection</p>
                <span className="text-xs font-semibold text-gray-500">
                  {products?.length ? `${products.length} items` : "..."}
                </span>
              </div>

              <div className="mt-3 h-[3px] w-full rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-pink-500 to-violet-600" />
              </div>

              <p className="mt-3 text-xs text-gray-500">
                Updated from store inventory.
              </p>
            </div>
          </div>
        </div>

        {/* ================= Products container (premium frame) ================= */}
        <div className="relative z-0">
          <div className="absolute inset-0 rounded-[28px] bg-white/60 backdrop-blur-md border border-gray-200" />
          <div className="relative rounded-[28px] p-4 sm:p-6">
            <div className="rounded-2xl bg-white/70 backdrop-blur-md border border-white/60 shadow-sm p-4 sm:p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {products && products.length > 0 ? (
                  products.map((product) => (
                    <ProductCard key={product._id} data={product} />
                  ))
                ) : (
                  <div className="col-span-full py-14 flex items-center justify-center">
                    <div className="w-full max-w-[520px] rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
                      <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-r from-pink-500 to-violet-600 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-white/90 animate-pulse" />
                      </div>
                      <p className="mt-4 font-semibold text-gray-900">
                        No featured products right now
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        Check back soon — new items are added frequently.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* bottom note (small, not floating) */}
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white/75 backdrop-blur-md px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm relative z-0">
              <p className="text-sm text-gray-700">
                Explore more products by category to find your perfect match.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500">Fresh picks</span>
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
