import React from "react";
import CreateEvent from "../../components/Shop/CreateEvent";
import SellerWorkspace from "../../components/Shop/Layout/SellerWorkspace";

const ShopCreateEvents = () => {
  return (
    <SellerWorkspace active={6}>
      <div className="w-full justify-center flex">
        <CreateEvent />
      </div>
    </SellerWorkspace>
  );
};

export default ShopCreateEvents;
