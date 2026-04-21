import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ProductCard from "../ProductCard/ProductCard";

const BestDeals = () => {
  const { allProducts } = useSelector((state) => state.products);

  const data = useMemo(() => {
    const products = Array.isArray(allProducts) ? [...allProducts] : [];
    return products.sort((a, b) => (b?.sold_out || 0) - (a?.sold_out || 0)).slice(0, 5);
  }, [allProducts]);

  return (
    <section className="section-shell py-14">
      <div className="section-frame">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <span className="eyebrow">Best selling</span>
            <h2 className="section-heading mt-4">Popular right now</h2>
            <p className="section-copy mt-3 max-w-2xl">
              The most purchased products from the current catalog, shown in a wider grid with stronger cards and cleaner spacing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="floating-card px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#885e4a]">Showing</p>
              <p className="mt-1 text-sm font-semibold text-[#17212b]">{data.length} best sellers</p>
            </div>
            <Link to="/best-selling" className="btn-secondary w-fit">
              View all best sellers
            </Link>
          </div>
        </div>

        <div className="mt-8 catalog-grid">
          {data.length > 0 ? (
            data.map((product) => <ProductCard key={product._id} data={product} />)
          ) : (
            <div className="surface-card col-span-full p-8 text-center text-[#6b7280]">
              No best-selling products are available right now.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BestDeals;
