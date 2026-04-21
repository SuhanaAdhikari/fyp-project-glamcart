import React from 'react'
import ShopInfo from "../../components/Shop/ShopInfo";
import ShopProfileData from "../../components/Shop/ShopProfileData";

const ShopHomePage = () => {
  return (
    <div className="shop-profile-shell">
      <div className="section-shell">
        <div className="shop-profile-grid">
          <div className="shop-profile-sidebar">
            <ShopInfo isOwner={true} />
          </div>
          <div className="shop-profile-main">
            <ShopProfileData isOwner={true} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShopHomePage
