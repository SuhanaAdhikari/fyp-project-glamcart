import React, { cloneElement } from "react"
import styles from "../../../styles/styles"
import { brandingData, shoeCategoriesData } from "../../../static/data"
import { useNavigate } from "react-router-dom"

const Categories = () => {
  const navigate = useNavigate()

  const handleSubmit = (item) => {
    // ✅ keep UX smooth (no full reload)
    navigate(`/products?category=${encodeURIComponent(item.title)}`)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <>
      {/* ================= Branding Section ================= */}
      <div className={`${styles.normalFlex} hidden sm:block px-6 md:px-16`}>
        <div className="my-12 w-full rounded-2xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm px-8 md:px-16 py-10 flex justify-between items-center gap-8">
          {brandingData &&
            brandingData.map((item, index) => (
              <div key={index} className="flex items-start gap-4 max-w-xs">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-600 flex items-center justify-center shadow-sm">
                  <span className="text-white text-[22px]">
                    {cloneElement(item.icon, {
                      strokeWidth: 2,
                      strokeLinecap: "round",
                    })}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-[16px] md:text-[18px] text-gray-900">{item.title}</h3>
                  <p className="text-sm md:text-[15px] text-gray-600 leading-relaxed">{item.Description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* ================= Categories Section ================= */}
      <div className={`${styles.section} px-6 md:px-16 pb-12`} id="Categories">
        {/* Badge title */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/80 border border-gray-200 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-pink-500 to-violet-600" />
            <span className="text-sm font-semibold text-gray-800 tracking-wide">Categories</span>
          </div>

          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-gray-900">Shop by Category</h2>
          <p className="mt-2 text-sm md:text-base text-gray-600">Explore popular picks in one click</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {shoeCategoriesData &&
            shoeCategoriesData.slice(0, 10).map((i) => (
              <button
                key={i.id}
                type="button"
                onClick={() => handleSubmit(i)}
                className="
                  group text-left
                  rounded-2xl
                  bg-white
                  border border-gray-200
                  shadow-sm
                  px-6 py-7
                  flex flex-col items-center gap-4
                  transition-all duration-200
                  hover:border-gray-300 hover:shadow-md
                  focus:outline-none focus:ring-4 focus:ring-fuchsia-200
                "
                aria-label={`Go to ${i.title}`}
              >
                {/* ✅ Bigger image + better UI/UX */}
                <div
                  className="
                    w-[92px] h-[92px] md:w-[100px] md:h-[100px]
                    rounded-2xl
                    bg-gradient-to-br from-gray-50 to-white
                    border border-gray-200
                    flex items-center justify-center
                    overflow-hidden
                    shadow-[0_10px_25px_rgba(17,24,39,0.06)]
                  "
                >
                  <img
                    src={i.image_Url || "/placeholder.svg"}
                    alt={i.title}
                    className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-200"
                    loading="lazy"
                  />
                </div>

                {/* Title + subtitle (if exists) */}
                <div className="text-center">
                  <h5 className="text-[15px] font-extrabold text-gray-900">{i.title}</h5>
                  {i.subTitle ? (
                    <p className="mt-1 text-[12px] font-semibold text-gray-500">{i.subTitle}</p>
                  ) : null}
                </div>

                {/* Underline hover effect */}
                <div className="relative h-[3px] w-12 overflow-hidden">
                  <span
                    className="
                      absolute left-1/2 top-0
                      h-[3px] w-0
                      bg-gradient-to-r from-pink-500 to-violet-600
                      rounded-full
                      transition-all duration-300 ease-out
                      group-hover:w-full
                      group-hover:left-0
                    "
                  />
                </div>
              </button>
            ))}
        </div>

        {/* Small note (optional): true background removal needs PNG/SVG */}
        <p className="mt-6 text-center text-xs text-gray-500">
          Tip: Real “background removed” images need transparent PNG/SVG. JPG photos can only be styled (cropped/contained).
        </p>
      </div>
    </>
  )
}

export default Categories
