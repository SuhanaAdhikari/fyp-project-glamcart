import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import ProductDetails from "../components/Products/ProductDetails.jsx";
import SuggestedProduct from "../components/Products/SuggestedProduct";

const ProductDetailsPage = () => {
  const { allProducts } = useSelector((state) => state.products);
  const { allEvents } = useSelector((state) => state.events);
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const eventData = searchParams.get("isEvent");

  useEffect(() => {
    if (eventData !== null) {
      setData(allEvents?.find((item) => item._id === id) || null);
      return;
    }

    setData(allProducts?.find((item) => item._id === id) || null);
  }, [allEvents, allProducts, eventData, id]);

  return (
    <div className="page-shell">
      <Header />
      <ProductDetails data={data} />
      {!eventData && data && <SuggestedProduct data={data} />}
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
