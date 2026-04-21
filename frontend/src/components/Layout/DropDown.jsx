import React from "react";
import { useNavigate } from "react-router-dom";

const DropDown = ({ categoriesData = [], setDropDown }) => {
  const navigate = useNavigate();

  const handleSelect = (category) => {
    navigate(`/products?category=${encodeURIComponent(category.title)}`);
    setDropDown(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className="surface-card absolute left-0 top-full z-40 mt-2 w-[300px] overflow-hidden !rounded-[20px]">
      <div className="border-b border-[#e6ddd2] px-5 py-3">
        <h4 className="text-sm font-semibold text-[#1f2937]">Browse categories</h4>
      </div>

      <div className="max-h-[360px] overflow-y-auto p-2">
        {categoriesData.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleSelect(item)}
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-[#fbf8f3]"
          >
            <div className="h-12 w-12 overflow-hidden rounded-2xl border border-[#e6ddd2] bg-[#fbf8f3]">
              <img src={item.image_Url} alt={item.title} className="h-full w-full object-cover" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#1f2937]">{item.title}</p>
              <p className="truncate text-xs text-[#6b7280]">{item.subTitle || "Explore products"}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DropDown;
