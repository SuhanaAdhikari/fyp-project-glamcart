import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import ProductCard from "../Route/ProductCard/ProductCard";

const SuggestedProduct = ({ data }) => {
  const { allProducts } = useSelector((state) => state.products);

  const items = useMemo(() => {
    const category = data?.category;
    const currentId = data?._id;

    if (!Array.isArray(allProducts) || !category) return [];

    return allProducts
      .filter((item) => item?.category === category && item?._id !== currentId)
      .slice(0, 10);
  }, [allProducts, data?.category, data?._id]);

  if (!data) return null;

  return (
    <section className="section-shell py-10">
      <div className="flex flex-col gap-2">
        <h2 className="section-heading">You may also like</h2>
        <p className="section-copy">More products from the same category.</p>
      </div>

      {items.length > 0 ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((item) => (
            <ProductCard key={item._id} data={item} />
          ))}
        </div>
      ) : (
        <div className="surface-card mt-8 p-8 text-center text-[#6b7280]">No related products found.</div>
      )}
    </section>
  );
};

export default SuggestedProduct;
