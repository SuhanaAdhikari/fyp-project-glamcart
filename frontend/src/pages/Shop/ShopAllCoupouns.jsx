import React from "react";
import SellerWorkspace from "../../components/Shop/Layout/SellerWorkspace";
import AllCoupons from "../../components/Shop/AllCoupons";

const ShopAllCoupouns = () => {
  return (
    <SellerWorkspace active={9}>
      <div className="w-full justify-center flex">
        <AllCoupons />
      </div>
    </SellerWorkspace>
  );
};

export default ShopAllCoupouns;
