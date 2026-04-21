import React from "react";
import ShopSettings from "../../components/Shop/ShopSettings";
import SellerWorkspace from "../../components/Shop/Layout/SellerWorkspace";

const ShopSettingsPage = () => {
  return (
    <SellerWorkspace active={11}>
      <ShopSettings />
    </SellerWorkspace>
  );
};

export default ShopSettingsPage;
