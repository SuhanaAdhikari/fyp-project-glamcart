"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import ProductCard from "../Route/ProductCard/ProductCard"

const SuggestedProduct = ({ data }) => {
  const { allProducts } = useSelector((state) => state.products)
  const [items, setItems] = useState([])

  const category = data?.category
  const currentId = data?._id

  const suggestions = useMemo(() => {
    if (!allProducts?.length || !category) return []
    return allProducts
      .filter((p) => p?.category === category && p?._id !== currentId)
      .slice(0, 10)
  }, [allProducts, category, currentId])

  useEffect(() => {
    setItems(suggestions)
  }, [suggestions])

  if (!data) return null

  return (
    <section className="w-full mt-10">
      {/* Beauty Header */}
      <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-r from-[#ff5aa5]/12 via-white/60 to-[#7b61ff]/12 shadow-[0_24px_80px_rgba(0,0,0,0.10)]">
        <div className="px-5 py-5 sm:px-8 sm:py-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-widest text-[#6b6f86] uppercase">
                Curated for you
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#14152b]">
                You may also love
              </h2>
              <p className="mt-1 text-sm text-[#6b6f86]">
                Similar picks from <span className="font-semibold">{category}</span>
              </p>
            </div>

            {/* Mini chip */}
            <div className="inline-flex items-center gap-2 self-start sm:self-auto rounded-2xl bg-white/70 border border-white/60 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-gradient-to-r from-[#ff5aa5] to-[#7b61ff]" />
              <span className="text-sm font-semibold text-[#14152b]">
                {items?.length || 0} suggestions
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 pb-6 sm:px-8">
          {items?.length > 0 ? (
            <>
              {/* Mobile: horizontal scroll (beauty carousel vibe) */}
              <div className="md:hidden -mx-5 px-5 overflow-x-auto">
                <div className="flex gap-4 pb-2">
                  {items.map((p) => (
                    <div key={p?._id} className="min-w-[240px] max-w-[240px]">
                      <ProductCard data={p} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop: clean grid */}
              <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {items.map((p) => (
                  <ProductCard data={p} key={p?._id} />
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white/70 border border-white/60 rounded-2xl p-8 text-center">
              <h3 className="text-lg font-extrabold text-[#14152b]">No related products found</h3>
              <p className="text-sm text-[#6b6f86] mt-1">
                Try exploring other categories — we’ll keep recommending the best matches.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default SuggestedProduct
