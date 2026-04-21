import React from "react";
import WithdrawMoney from "../../components/Shop/WithdrawMoney";
import SellerWorkspace from "../../components/Shop/Layout/SellerWorkspace";

const ShopWithDrawMoneyPage = () => {
  return (
    <SellerWorkspace active={7}>
      <WithdrawMoney />
    </SellerWorkspace>
  );
};

export default ShopWithDrawMoneyPage;
