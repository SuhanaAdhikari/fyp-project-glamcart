import React from "react";
import SellerWorkspace from "../../components/Shop/Layout/SellerWorkspace";
import OrderDetails from "../../components/Shop/OrderDetails";

const ShopOrderDetails = () => {
  return (
    <SellerWorkspace active={2}>
      <OrderDetails />
    </SellerWorkspace>
  );
};

export default ShopOrderDetails;
