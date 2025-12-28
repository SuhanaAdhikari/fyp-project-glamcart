import React from "react"
import { useNavigate } from "react-router-dom"

const DropDown = ({ categoriesData, setDropDown }) => {
  const navigate = useNavigate()

  const submitHandle = (i) => {
    navigate(`/products?category=${i.title}`)
    setDropDown(false)
    window.location.reload()
  }

  return (
    <div
      className="
        absolute
        z-40
        w-[300px]
        mt-3
        rounded-2xl
        border border-white/20
        bg-white/80
        backdrop-blur-xl
        shadow-[0_20px_40px_-15px_rgba(0,0,0,0.25)]
        overflow-hidden
      "
    >
      {/* Header */}
      <div className="px-5 py-3 border-b border-gray-200/60">
        <h4 className="text-sm font-semibold text-[#1a2240] tracking-wide">
          Browse Categories
        </h4>
      </div>

      {/* Category list */}
      <div className="max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
        {categoriesData &&
          categoriesData.map((i, index) => (
            <button
              key={index}
              onClick={() => submitHandle(i)}
              className="
                group
                w-full
                flex
                items-center
                gap-4
                px-5
                py-3
                text-left
                transition
                hover:bg-gradient-to-r
                hover:from-pink-50
                hover:to-violet-50
              "
            >
              {/* Image container */}
              <div
                className="
                  w-10 h-10
                  rounded-xl
                  bg-white
                  border border-gray-200
                  flex items-center justify-center
                  shadow-sm
                  group-hover:shadow-md
                  transition
                "
              >
                <img
                  src={i.image_Url}
                  alt={i.title}
                  className="w-6 h-6 object-contain"
                  draggable={false}
                />
              </div>

              {/* Text */}
              <div className="flex-1">
                <p className="text-sm font-medium text-[#1a2240] group-hover:text-[#3d569a] transition">
                  {i.title}
                </p>
                <span className="text-xs text-gray-500">
                  Explore products
                </span>
              </div>

              {/* Hover indicator */}
              <span
                className="
                  w-2 h-2
                  rounded-full
                  bg-gradient-to-r from-pink-500 to-violet-600
                  opacity-0
                  group-hover:opacity-100
                  transition
                "
              />
            </button>
          ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-200/60 bg-white/70">
        <p className="text-xs text-gray-500">
          Discover makeup, skincare & beauty essentials
        </p>
      </div>
    </div>
  )
}

export default DropDown
