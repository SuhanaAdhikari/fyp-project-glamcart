import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { FiArrowUpRight, FiCheckCircle, FiExternalLink, FiShoppingBag } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";

const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller);
  const { pathname } = useLocation();

  const pageTitle = useMemo(() => {
    if (pathname.startsWith("/dashboard-create-product")) return "Create Product";
    if (pathname.startsWith("/dashboard-products")) return "Products";
    if (pathname.startsWith("/dashboard-orders")) return "Orders";
    if (pathname.startsWith("/dashboard-create-event")) return "Create Event";
    if (pathname.startsWith("/dashboard-events")) return "Events";
    if (pathname.startsWith("/dashboard-coupouns")) return "Discount Codes";
    if (pathname.startsWith("/dashboard-withdraw-money")) return "Withdrawals";
    if (pathname.startsWith("/dashboard-messages")) return "Messages";
    if (pathname.startsWith("/dashboard-refunds")) return "Refunds";
    if (pathname.startsWith("/settings")) return "Shop Settings";
    return "Seller Workspace";
  }, [pathname]);

  const approvalLabel = seller?.isApproved === false ? "Pending approval" : "Approved seller";

  return (
    <header className="workspace-header">
      <div className="workspace-header-line" />

      <div className="section-shell workspace-header-inner">
        <div className="workspace-title-group">
          <div className="workspace-brand-mark">SC</div>

          <div className="min-w-0">
            <span className="workspace-kicker">
              <FiShoppingBag size={14} />
              Seller Studio
            </span>
            <h1 className="workspace-page-title">{pageTitle}</h1>
            <p className="workspace-page-copy">
              Manage catalog, orders, payouts and storefront details from one focused seller workspace.
            </p>
          </div>
        </div>

        <div className="workspace-header-actions">
          <span className="workspace-status-pill">
            <FiCheckCircle size={14} />
            {approvalLabel}
          </span>

          <Link to={`/shop/${seller?._id}`} className="workspace-link-chip">
            <FiExternalLink size={16} />
            View shop
          </Link>

          <Link to="/settings" className="workspace-user-chip">
            <img
              src={seller?.avatar?.url || "/placeholder.svg"}
              alt={seller?.name || "Shop"}
              className="workspace-user-avatar"
            />
            <div className="min-w-0">
              <p className="workspace-user-title truncate">{seller?.name || "Your shop"}</p>
              <p className="workspace-user-copy">Profile and branding</p>
            </div>
            <FiArrowUpRight size={15} color="var(--color-muted)" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
