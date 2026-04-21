import React from "react";
import SellerWorkspace from "../../components/Shop/Layout/SellerWorkspace";
import DashboardHero from "../../components/Shop/DashboardHero";

const ShopDashboardPage = () => {
  return (
    <SellerWorkspace active={1}>
      <DashboardHero />
    </SellerWorkspace>
  );
};

export default ShopDashboardPage;
