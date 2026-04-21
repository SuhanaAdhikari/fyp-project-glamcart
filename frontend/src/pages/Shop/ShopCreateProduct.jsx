import React from "react";
import SellerWorkspace from "../../components/Shop/Layout/SellerWorkspace";
import CreateProduct from "../../components/Shop/CreateProduct";

const ShopCreateProduct = () => {
  return (
    <SellerWorkspace active={4}>
      <div className="w-full justify-center flex">
        <CreateProduct />
      </div>
    </SellerWorkspace>
  );
};

export default ShopCreateProduct;
