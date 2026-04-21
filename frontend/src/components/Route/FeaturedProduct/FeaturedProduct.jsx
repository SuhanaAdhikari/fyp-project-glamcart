import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ProductCard from "../ProductCard/ProductCard";

const FeaturedProducts = () => {
  const { allProducts } = useSelector((state) => state.products);

  const products = useMemo(() => {
    return Array.isArray(allProducts) ? allProducts.slice(0, 10) : [];
  }, [allProducts]);

  return (
    <section className="section-shell py-14">
      <div className="section-frame">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <span className="eyebrow">Featured</span>
            <h2 className="section-heading mt-4">Featured products</h2>
            <p className="section-copy mt-3 max-w-2xl">
              Highlighted products from the current inventory, presented in a fuller layout that feels lighter and more premium.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="floating-card px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#885e4a]">Selection</p>
              <p className="mt-1 text-sm font-semibold text-[#17212b]">{products.length} featured items</p>
            </div>
            <Link to="/products" className="btn-secondary w-fit">
              Browse all products
            </Link>
          </div>
        </div>

        <div className="mt-8 catalog-grid">
          {products.length > 0 ? (
            products.map((product) => <ProductCard key={product._id} data={product} />)
          ) : (
            <div className="surface-card col-span-full p-8 text-center text-[#6b7280]">
              No featured products are available right now.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
