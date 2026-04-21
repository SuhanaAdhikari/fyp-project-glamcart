import React from "react";
import SellerWorkspace from "../../components/Shop/Layout/SellerWorkspace";
import AllRefundOrders from "../../components/Shop/AllRefundOrders";

const ShopAllRefunds = () => {
  return (
    <SellerWorkspace active={10}>
      <div className="w-full justify-center flex">
        <AllRefundOrders />
      </div>
    </SellerWorkspace>
  );
};

export default ShopAllRefunds;
