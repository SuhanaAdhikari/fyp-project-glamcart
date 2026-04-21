import React from "react";
import SellerWorkspace from "../../components/Shop/Layout/SellerWorkspace";
import DashboardMessages from "../../components/Shop/DashboardMessages";

const ShopInboxPage = () => {
  return (
    <SellerWorkspace active={8}>
      <DashboardMessages />
    </SellerWorkspace>
  );
};

export default ShopInboxPage;
