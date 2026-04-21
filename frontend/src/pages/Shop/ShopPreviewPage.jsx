import React from 'react'
import ShopInfo from "../../components/Shop/ShopInfo";
import ShopProfileData from "../../components/Shop/ShopProfileData";

const ShopPreviewPage = () => {
  return (
    <div className="shop-profile-shell">
      <div className="section-shell">
        <div className="shop-profile-grid">
          <div className="shop-profile-sidebar">
            <ShopInfo isOwner={false} />
          </div>
          <div className="shop-profile-main">
            <ShopProfileData isOwner={false} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShopPreviewPage
