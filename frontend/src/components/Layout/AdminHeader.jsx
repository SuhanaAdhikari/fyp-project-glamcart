import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { FiArrowUpRight, FiCheckCircle, FiHome, FiShield } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";

const AdminHeader = () => {
  const { user } = useSelector((state) => state.user);
  const { pathname } = useLocation();

  const pageTitle = useMemo(() => {
    if (pathname.startsWith("/admin/dashboard")) return "Platform Overview";
    if (pathname.startsWith("/admin-orders")) return "Orders";
    if (pathname.startsWith("/admin-products")) return "Products";
    if (pathname.startsWith("/admin-sellers")) return "Sellers";
    if (pathname.startsWith("/admin-users")) return "Users";
    if (pathname.startsWith("/admin-events")) return "Events";
    if (pathname.startsWith("/admin-withdraw-request")) return "Withdraw Requests";
    if (pathname.startsWith("/admin-banner")) return "Homepage Banner";
    if (pathname.startsWith("/admin-vendor-approvals")) return "Vendor Approvals";
    return "Admin Workspace";
  }, [pathname]);

  return (
    <header className="workspace-header">
      <div className="workspace-header-line" />

      <div className="section-shell workspace-header-inner">
        <div className="workspace-title-group">
          <div className="workspace-brand-mark">GC</div>

          <div className="min-w-0">
            <span className="workspace-kicker">
              <FiShield size={14} />
              Admin Console
            </span>
            <h1 className="workspace-page-title">{pageTitle}</h1>
            <p className="workspace-page-copy">
              Review vendors, orders, users and payouts from one simplified control center.
            </p>
          </div>
        </div>

        <div className="workspace-header-actions">
          <Link to="/admin-vendor-approvals" className="workspace-link-chip">
            <FiCheckCircle size={16} />
            Pending approvals
          </Link>

          <Link to="/" className="workspace-link-chip is-primary">
            <FiHome size={16} />
            Storefront
          </Link>

          <Link to="/profile" className="workspace-user-chip">
            <img
              src={user?.avatar?.url || "/placeholder.svg"}
              alt={user?.name || "Admin"}
              className="workspace-user-avatar"
            />
            <div className="min-w-0">
              <p className="workspace-user-title truncate">{user?.name || "Administrator"}</p>
              <p className="workspace-user-copy">Manage account</p>
            </div>
            <FiArrowUpRight size={15} color="var(--color-muted)" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
