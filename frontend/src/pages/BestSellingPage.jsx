import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import Loader from "../components/Layout/Loader";
import ProductCard from "../components/Route/ProductCard/ProductCard";

const BestSellingPage = () => {
  const { allProducts, isLoading } = useSelector((state) => state.products);

  const data = useMemo(() => {
    const products = Array.isArray(allProducts) ? [...allProducts] : [];
    return products.sort((a, b) => (b?.sold_out || 0) - (a?.sold_out || 0));
  }, [allProducts]);

  if (isLoading) return <Loader />;

  return (
    <div className="page-shell">
      <Header activeHeading={2} />
      <section className="section-shell py-10">
        <div className="section-frame">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <span className="eyebrow">Best selling</span>
              <h1 className="section-heading mt-4">Best selling products</h1>
              <p className="section-copy mt-3">Products sorted by total sales from highest to lowest in a wider storefront grid.</p>
            </div>

            <div className="floating-card px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#885e4a]">Ranked list</p>
              <p className="mt-1 text-sm font-semibold text-[#17212b]">{data.length} products</p>
            </div>
          </div>

          {data.length > 0 ? (
            <div className="catalog-grid mt-8">
              {data.map((item) => (
                <ProductCard key={item._id} data={item} />
              ))}
            </div>
          ) : (
            <div className="surface-card mt-8 p-10 text-center text-[#6b7280]">No products found.</div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default BestSellingPage;
