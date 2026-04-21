import React from "react";
import { Link } from "react-router-dom";
import { FiImage, FiShoppingBag } from "react-icons/fi";
import { GrWorkshop } from "react-icons/gr";
import { RxDashboard } from "react-icons/rx";
import { CiMoneyBill } from "react-icons/ci";
import { HiOutlineUserGroup } from "react-icons/hi";
import { BsHandbag } from "react-icons/bs";
import { MdCheckCircleOutline, MdOutlineLocalOffer } from "react-icons/md";
import { AiOutlineSetting } from "react-icons/ai";

const AdminSideBar = ({ active }) => {
  const items = [
    { id: 1, label: "Dashboard", meta: "Platform snapshot", to: "/admin/dashboard", icon: RxDashboard },
    { id: 2, label: "Orders", meta: "Track fulfillment", to: "/admin-orders", icon: FiShoppingBag },
    { id: 3, label: "Sellers", meta: "Manage vendors", to: "/admin-sellers", icon: GrWorkshop },
    { id: 4, label: "Users", meta: "Customer accounts", to: "/admin-users", icon: HiOutlineUserGroup },
    { id: 5, label: "Products", meta: "Catalog review", to: "/admin-products", icon: BsHandbag },
    { id: 6, label: "Events", meta: "Promotions and deals", to: "/admin-events", icon: MdOutlineLocalOffer },
    { id: 7, label: "Withdrawals", meta: "Payout requests", to: "/admin-withdraw-request", icon: CiMoneyBill },
    { id: 8, label: "Banner", meta: "Homepage hero image", to: "/admin-banner", icon: FiImage },
    { id: 9, label: "Approvals", meta: "New vendor reviews", to: "/admin-vendor-approvals", icon: MdCheckCircleOutline },
    { id: 10, label: "Settings", meta: "Personal profile", to: "/profile", icon: AiOutlineSetting },
  ];

  return (
    <aside className="workspace-nav-card">
      <div className="workspace-nav-head">
        <span className="workspace-nav-kicker">Control panel</span>
        <h2 className="workspace-nav-title">Admin navigation</h2>
        <p className="workspace-nav-copy">Every platform tool stays one click away.</p>
      </div>

      <div className="workspace-nav-list">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <Link key={item.id} to={item.to} className={`workspace-nav-item ${isActive ? "is-active" : ""}`}>
              <span className="workspace-nav-icon">
                <Icon size={19} />
              </span>

              <span className="workspace-nav-text">
                <span className="workspace-nav-label">{item.label}</span>
                <span className="workspace-nav-meta">{item.meta}</span>
              </span>

              <span className="workspace-nav-trailing" />
            </Link>
          );
        })}
      </div>

      <div className="workspace-nav-foot">
        <p className="workspace-nav-foot-title">Keep approvals moving</p>
        <p className="workspace-nav-foot-copy">
          Review new vendors regularly so the marketplace stays active and trustworthy.
        </p>
      </div>
    </aside>
  );
};

export default AdminSideBar;
