import React from "react";
import { AiOutlineFolderAdd, AiOutlineGift } from "react-icons/ai";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { VscNewFile } from "react-icons/vsc";
import { CiMoneyBill, CiSettings } from "react-icons/ci";
import { Link } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";
import { HiOutlineReceiptRefund } from "react-icons/hi";

const DashboardSideBar = ({ active }) => {
  const menuItems = [
    { id: 1, title: "Dashboard", meta: "Performance overview", link: "/dashboard", icon: RxDashboard },
    { id: 2, title: "Orders", meta: "Current shop orders", link: "/dashboard-orders", icon: FiShoppingBag },
    { id: 3, title: "Products", meta: "Live catalog items", link: "/dashboard-products", icon: FiPackage },
    { id: 4, title: "Create Product", meta: "Add a new listing", link: "/dashboard-create-product", icon: AiOutlineFolderAdd },
    { id: 5, title: "Events", meta: "Campaign schedule", link: "/dashboard-events", icon: MdOutlineLocalOffer },
    { id: 6, title: "Create Event", meta: "Publish an offer", link: "/dashboard-create-event", icon: VscNewFile },
    { id: 7, title: "Withdrawals", meta: "Available balance", link: "/dashboard-withdraw-money", icon: CiMoneyBill },
    { id: 8, title: "Inbox", meta: "Shop conversations", link: "/dashboard-messages", icon: BiMessageSquareDetail },
    { id: 9, title: "Discount Codes", meta: "Promotional coupons", link: "/dashboard-coupouns", icon: AiOutlineGift },
    { id: 10, title: "Refunds", meta: "Return requests", link: "/dashboard-refunds", icon: HiOutlineReceiptRefund },
    { id: 11, title: "Settings", meta: "Brand and profile", link: "/settings", icon: CiSettings },
  ];

  return (
    <aside className="workspace-nav-card">
      <div className="workspace-nav-head">
        <span className="workspace-nav-kicker">Seller tools</span>
        <h2 className="workspace-nav-title">Shop navigation</h2>
        <p className="workspace-nav-copy">Keep products, messages and orders organized in one place.</p>
      </div>

      <div className="workspace-nav-list">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <Link key={item.id} to={item.link} className={`workspace-nav-item ${isActive ? "is-active" : ""}`}>
              <span className="workspace-nav-icon">
                <Icon size={19} />
              </span>

              <span className="workspace-nav-text">
                <span className="workspace-nav-label">{item.title}</span>
                <span className="workspace-nav-meta">{item.meta}</span>
              </span>

              <span className="workspace-nav-trailing" />
            </Link>
          );
        })}
      </div>

      <div className="workspace-nav-foot">
        <p className="workspace-nav-foot-title">Keep the storefront fresh</p>
        <p className="workspace-nav-foot-copy">
          Updated products, accurate settings and quick replies help sellers convert more consistently.
        </p>
      </div>
    </aside>
  );
};

export default DashboardSideBar;
