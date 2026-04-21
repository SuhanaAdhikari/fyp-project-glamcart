import React from "react";
import SellerWorkspace from "../../components/Shop/Layout/SellerWorkspace";
import AllEvents from "../../components/Shop/AllEvents";

const ShopAllEvents = () => {
  return (
    <SellerWorkspace active={5}>
      <div className="w-full justify-center flex">
        <AllEvents />
      </div>
    </SellerWorkspace>
  );
};

export default ShopAllEvents;
