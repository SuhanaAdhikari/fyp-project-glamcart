import React from "react";
import SellerWorkspace from "../../components/Shop/Layout/SellerWorkspace";
import AllOrders from "../../components/Shop/AllOrders";

const ShopAllOrders = () => {
  return (
    <SellerWorkspace active={2}>
      <div className="w-full justify-center flex">
        <AllOrders />
      </div>
    </SellerWorkspace>
  );
};

export default ShopAllOrders;
