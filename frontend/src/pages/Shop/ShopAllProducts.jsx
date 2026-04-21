import React from "react";
import SellerWorkspace from "../../components/Shop/Layout/SellerWorkspace";
import AllProducts from "../../components/Shop/AllProducts";

const ShopAllProducts = () => {
  return (
    <SellerWorkspace active={3}>
      <div className="w-full justify-center flex">
        <AllProducts />
      </div>
    </SellerWorkspace>
  );
};

export default ShopAllProducts;
