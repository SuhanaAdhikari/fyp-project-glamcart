import React from "react";
import { useNavigate } from "react-router-dom";
import { brandingData, shoeCategoriesData } from "../../../static/data";

const Categories = () => {
  const navigate = useNavigate();
  const categories = shoeCategoriesData.slice(0, 10);

  const handleSubmit = (item) => {
    navigate(`/products?category=${encodeURIComponent(item.title)}`);
    window.scrollTo(0, 0);
  };

  return (
    <section className="section-shell py-14" id="Categories">
      <div className="section-frame">
        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <div className="surface-card accent-panel p-6 md:p-8">
            <span className="eyebrow !bg-white">Categories</span>
            <h2 className="section-heading mt-4 max-w-xl">Start with a category that matches your routine.</h2>
            <p className="section-copy mt-4 max-w-2xl">
              The storefront is cleaner now, but it should still feel rich. These category cards use more of the screen and make discovery faster.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="floating-card px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#885e4a]">Categories</p>
                <p className="mt-1 text-xl font-extrabold text-[#17212b]">{categories.length}</p>
              </div>
              <div className="floating-card px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#885e4a]">Experience</p>
                <p className="mt-1 text-sm font-semibold text-[#17212b]">Cleaner browsing</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {brandingData.map((item, index) => (
              <div key={item.id || index} className="surface-card-sm p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#efe2d8] text-sm font-bold text-[#9b6b53]">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[#1f2937]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#6b7280]">{item.Description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {categories.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSubmit(item)}
              className="group surface-card overflow-hidden text-left transition duration-200 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(23,33,43,0.14)]"
            >
              <div className="relative h-56 overflow-hidden bg-[#fbf8f3]">
                <img
                  src={item.image_Url || "/placeholder.svg"}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <div className="floating-card flex items-center justify-between px-4 py-3">
                    <span className="text-sm font-semibold text-[#17212b]">{item.subTitle}</span>
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#885e4a]">Browse</span>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-[#1f2937]">{item.title}</h3>
                  <span className="muted-chip !bg-[#f6efe7] !text-[#885e4a]">{String(item.id).padStart(2, "0")}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-[#6b7280]">
                  Explore curated picks for {item.subTitle.toLowerCase()} in a wider product view.
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
