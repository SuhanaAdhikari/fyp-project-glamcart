import React, { useMemo } from "react"
import { useSelector } from "react-redux"
import { Link, NavLink, useLocation } from "react-router-dom"
import { FiHome, FiGrid, FiUsers, FiPackage, FiShoppingCart, FiSearch, FiBell, FiSettings } from "react-icons/fi"

const AdminHeader = () => {
  const { user } = useSelector((state) => state.user)
  const location = useLocation()

  const pageTitle = useMemo(() => {
    const p = location.pathname
    if (p.startsWith("/admin/dashboard")) return "Dashboard"
    if (p.startsWith("/admin/users")) return "Users"
    if (p.startsWith("/admin/orders")) return "Orders"
    if (p.startsWith("/admin/products")) return "Products"
    if (p.startsWith("/admin/sellers")) return "Sellers"
    if (p.startsWith("/admin/profile")) return "Profile"
    return "Admin"
  }, [location.pathname])

  return (
    <>
      <header className="ah_wrap">
        <div className="ah_topBar" />

        <div className="ah_inner">
          {/* Left */}
          <div className="ah_left">
            <Link to="/" className="ah_brand">
              <img
                src="/logo.png"
                alt="ShoeSphere"
                className="ah_logo"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                }}
              />
              <span className="ah_dot" />
              <span className="ah_name">ShoeSphere</span>
              <span className="ah_badge">ADMIN</span>
            </Link>

            <div className="ah_titleWrap">
              <div className="ah_title">{pageTitle}</div>
              <div className="ah_subtitle">Manage store, users & orders</div>
            </div>
          </div>

          {/* Middle Search */}
          <div className="ah_search">
            <FiSearch className="ah_searchIcon" />
            <input className="ah_searchInput" placeholder="Search users, orders, products..." />
          </div>

          {/* Right */}
          <div className="ah_right">
            <nav className="ah_nav">
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) => (isActive ? "ah_link ah_linkActive" : "ah_link")}
              >
                <FiHome />
                <span>Home</span>
              </NavLink>

              <NavLink
                to="/admin-products"
                className={({ isActive }) => (isActive ? "ah_link ah_linkActive" : "ah_link")}
              >
                <FiPackage />
                <span>Products</span>
              </NavLink>

              <NavLink
                to="/admin-orders"
                className={({ isActive }) => (isActive ? "ah_link ah_linkActive" : "ah_link")}
              >
                <FiShoppingCart />
                <span>Orders</span>
              </NavLink>

              <NavLink
                to="/admin-users"
                className={({ isActive }) => (isActive ? "ah_link ah_linkActive" : "ah_link")}
              >
                <FiUsers />
                <span>Users</span>
              </NavLink>

              <NavLink
                to="/admin-sellers"
                className={({ isActive }) => (isActive ? "ah_link ah_linkActive" : "ah_link")}
              >
                <FiGrid />
                <span>Sellers</span>
              </NavLink>
            </nav>

            <button type="button" className="ah_iconBtn" title="Notifications">
              <FiBell />
              <span className="ah_dotNotif" />
            </button>

            <Link to="/admin/settings" className="ah_iconBtn" title="Settings">
              <FiSettings />
            </Link>

            <Link to="/admin/profile" className="ah_user">
              <img
                src={user?.avatar?.url || "/placeholder.svg?height=40&width=40&query=avatar"}
                alt={user?.name || "Admin"}
                className="ah_avatar"
              />
              <div className="ah_userText">
                <div className="ah_userName">{user?.name || "Admin"}</div>
                <div className="ah_userRole">Administrator</div>
              </div>
            </Link>
          </div>
        </div>
      </header>

      <style jsx global>{`
        .ah_wrap {
          position: sticky;
          top: 0;
          z-index: 60;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        }
        .ah_topBar {
          height: 6px;
          background: linear-gradient(90deg, #1a2240, #3d569a, #4b6cb7);
        }

        /* ✅ FLEX LAYOUT (fixes search getting cut) */
        .ah_inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ah_left {
          display: flex;
          align-items: center;
          gap: 14px;
          flex: 0 0 auto; /* do not shrink too much */
          min-width: 0;
        }

        .ah_brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .ah_logo {
          height: 34px;
          width: auto;
          object-fit: contain;
        }
        .ah_dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: linear-gradient(90deg, #1a2240, #3d569a);
          box-shadow: 0 0 0 3px rgba(61, 86, 154, 0.14);
        }
        .ah_name {
          font-weight: 1000;
          color: #111827;
          font-size: 16px;
          white-space: nowrap;
        }
        .ah_badge {
          padding: 5px 10px;
          border-radius: 999px;
          background: rgba(61, 86, 154, 0.1);
          border: 1px solid rgba(61, 86, 154, 0.18);
          font-weight: 1000;
          font-size: 12px;
          color: #1a2240;
          letter-spacing: 0.08em;
          white-space: nowrap;
        }

        .ah_titleWrap {
          display: none;
          min-width: 0;
        }
        .ah_title {
          font-weight: 1000;
          color: #111827;
          line-height: 1.1;
          white-space: nowrap;
        }
        .ah_subtitle {
          margin-top: 2px;
          font-weight: 800;
          font-size: 12px;
          color: rgba(17, 24, 39, 0.62);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 260px;
        }

        /* ✅ Search: flex-grow but can shrink safely */
        .ah_search {
          position: relative;
          flex: 1 1 520px; /* grow + shrink */
          min-width: 220px; /* prevents weird clipping */
          max-width: 560px;
        }
        .ah_searchIcon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(17, 24, 39, 0.45);
        }
        .ah_searchInput {
          width: 100%;
          padding: 10px 12px 10px 38px;
          border-radius: 14px;
          border: 1px solid rgba(0, 0, 0, 0.12);
          background: #fff;
          font-weight: 800;
          outline: none;
        }
        .ah_searchInput:focus {
          border-color: rgba(61, 86, 154, 0.6);
          box-shadow: 0 0 0 4px rgba(61, 86, 154, 0.12);
        }

        /* Right */
        .ah_right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          flex: 0 0 auto; /* do not push into search */
          min-width: 0;
        }
        .ah_nav {
          display: none;
          align-items: center;
          gap: 8px;
        }
        .ah_link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border-radius: 14px;
          text-decoration: none;
          font-weight: 900;
          color: #111827;
          border: 1px solid rgba(0, 0, 0, 0.08);
          background: rgba(17, 24, 39, 0.02);
          transition: 160ms ease;
          white-space: nowrap;
        }
        .ah_link:hover {
          transform: translateY(-1px);
          background: rgba(17, 24, 39, 0.06);
        }
        .ah_linkActive {
          color: #fff;
          background: linear-gradient(90deg, #1a2240, #3d569a, #4b6cb7);
          border: 1px solid rgba(255, 255, 255, 0.25);
          box-shadow: 0 14px 26px rgba(17, 24, 39, 0.12);
        }

        .ah_iconBtn {
          position: relative;
          width: 44px;
          height: 44px;
          border-radius: 14px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          background: rgba(17, 24, 39, 0.02);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #111827;
          transition: 160ms ease;
          text-decoration: none;
          flex-shrink: 0;
        }
        .ah_iconBtn:hover {
          transform: translateY(-1px);
          background: rgba(17, 24, 39, 0.06);
        }
        .ah_dotNotif {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.18);
        }

        .ah_user {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 16px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          background: #fff;
          text-decoration: none;
          box-shadow: 0 10px 20px rgba(17, 24, 39, 0.08);
          transition: 160ms ease;
          flex-shrink: 0;
        }
        .ah_user:hover {
          transform: translateY(-1px);
          box-shadow: 0 14px 28px rgba(17, 24, 39, 0.12);
        }
        .ah_avatar {
          width: 40px;
          height: 40px;
          border-radius: 999px;
          object-fit: cover;
          border: 1px solid rgba(0, 0, 0, 0.12);
        }
        .ah_userText {
          display: none;
        }
        .ah_userName {
          font-weight: 1000;
          color: #111827;
          line-height: 1.1;
          white-space: nowrap;
        }
        .ah_userRole {
          margin-top: 2px;
          font-weight: 900;
          font-size: 12px;
          color: rgba(17, 24, 39, 0.55);
          white-space: nowrap;
        }

        /* ✅ Breakpoints */
        @media (min-width: 980px) {
          .ah_nav {
            display: inline-flex;
          }
          .ah_titleWrap {
            display: block;
          }
          .ah_userText {
            display: block;
          }
        }

        /* ✅ Hide search sooner so it never clips like your screenshot */
        @media (max-width: 860px) {
          .ah_search {
            display: none;
          }
        }

        @media (max-width: 520px) {
          .ah_badge {
            display: none;
          }
        }
      `}</style>
    </>
  )
}

export default AdminHeader
