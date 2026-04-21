import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import Loader from "../components/Layout/Loader";
import ProductCard from "../components/Route/ProductCard/ProductCard";

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const categoryData = searchParams.get("category");
  const { allProducts, isLoading } = useSelector((state) => state.products);

  const data = useMemo(() => {
    const products = Array.isArray(allProducts) ? allProducts : [];
    if (!categoryData) return products;
    return products.filter((item) => item.category === categoryData);
  }, [allProducts, categoryData]);

  if (isLoading) return <Loader />;

  return (
    <div className="page-shell">
      <Header activeHeading={3} />
      <section className="section-shell py-10">
        <div className="section-frame">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <span className="eyebrow">{categoryData ? "Filtered catalog" : "Catalog"}</span>
              <h1 className="section-heading mt-4">{categoryData || "Products"}</h1>
              <p className="section-copy mt-3">
                {categoryData
                  ? `Showing ${data.length} items in ${categoryData}.`
                  : "Browse the full product catalog in a wider, more open layout."}
              </p>
            </div>

            <div className="floating-card px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#885e4a]">Available</p>
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

export default ProductsPage;
