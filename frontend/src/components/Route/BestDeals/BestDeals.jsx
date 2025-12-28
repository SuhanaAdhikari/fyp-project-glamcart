import React, { useEffect, useState } from "react"
import styles from "../../../styles/styles"
import ProductCard from "../ProductCard/ProductCard"
import axios from "axios"
import { server } from "../../../server" // ✅ Ensure this points to your API base URL

const BestDeals = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchTopDeals = async () => {
      try {
        const response = await axios.get(`${server}/product/get-all-products`)
        const sorted = response.data.products.sort((a, b) => b.sold_out - a.sold_out)
        const topFive = sorted.slice(0, 5)
        setData(topFive)
      } catch (error) {
        console.error("Error fetching best deals:", error)
      }
    }

    fetchTopDeals()
  }, [])

  return (
    // ✅ create a safe stacking context for this whole section
    <section className="w-full py-14 relative z-0">
      <div className={`${styles.section} relative z-0`}>
        {/* ===================== Header Row (Unique layout) ===================== */}
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between mb-8">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-pink-500 to-violet-600" />
              <span className="text-xs md:text-sm font-semibold text-gray-800 tracking-wide">Hot Right Now</span>
            </div>

            <h1 className="mt-4 text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              Best Deals for You
            </h1>

            <p className="mt-2 text-sm md:text-base text-gray-600 max-w-[620px]">
              Our most-loved items based on sales — updated automatically. Grab them before they’re gone.
            </p>
          </div>

          {/* Right mini card */}
          <div className="w-full md:w-[360px]">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900">Today’s Picks</p>
                <span className="text-xs font-semibold text-gray-500">
                  {data.length ? `${data.length} items` : "..."}
                </span>
              </div>

              <div className="mt-3 h-[3px] w-full rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-pink-500 to-violet-600" />
              </div>

              <p className="mt-3 text-xs text-gray-500">Tip: Add to wishlist to track later.</p>
            </div>
          </div>
        </div>

        {/* ===================== PRODUCTS CONTAINER (Changed) ===================== */}
        <div className="relative z-0">
          {/* background panel behind products (new look) */}
          <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-pink-50 via-white to-violet-50 border border-gray-200 z-0" />
          {/* top accent */}
          <div className="absolute top-0 left-0 right-0 h-[5px] rounded-t-[28px] bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-600 z-0" />

          <div className="relative rounded-[28px] p-4 sm:p-6 z-0">
            {/* Soft inner container */}
            <div className="rounded-2xl bg-white/70 backdrop-blur-md border border-white/60 shadow-sm p-4 sm:p-6 relative z-0">
              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {data.length > 0 ? (
                  data.map((product) => <ProductCard key={product._id} data={product} />)
                ) : (
                  <div className="col-span-full py-14 flex items-center justify-center">
                    <div className="w-full max-w-[520px] rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
                      <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-r from-pink-500 to-violet-600 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-white/90 animate-pulse" />
                      </div>
                      <p className="mt-4 font-semibold text-gray-900">Loading best deals…</p>
                      <p className="mt-1 text-sm text-gray-600">Fetching top-selling products from the store.</p>

                      {/* skeleton preview */}
                      <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="h-20 rounded-xl bg-gray-50 border border-gray-200 animate-pulse" />
                        <div className="h-20 rounded-xl bg-gray-50 border border-gray-200 animate-pulse" />
                        <div className="h-20 rounded-xl bg-gray-50 border border-gray-200 animate-pulse hidden sm:block" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ✅ Bottom callout: force it to be behind any modal */}
            <div className="relative z-0 mt-6 rounded-2xl border border-gray-200 bg-white/75 backdrop-blur-md px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
              <p className="text-sm text-gray-700">
                Want more options? Browse all products and filter by category.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500">Updated live</span>
                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BestDeals
