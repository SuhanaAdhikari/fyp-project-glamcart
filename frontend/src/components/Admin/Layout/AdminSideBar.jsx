import React from "react"
import { Link } from "react-router-dom"
import { FiShoppingBag } from "react-icons/fi"
import { GrWorkshop } from "react-icons/gr"
import { RxDashboard } from "react-icons/rx"
import { CiMoneyBill } from "react-icons/ci"
import { HiOutlineUserGroup } from "react-icons/hi"
import { BsHandbag } from "react-icons/bs"
import { MdOutlineLocalOffer } from "react-icons/md"
import { AiOutlineSetting } from "react-icons/ai"

const AdminSideBar = ({ active }) => {
  const items = [
    { id: 1, label: "Dashboard", to: "/admin/dashboard", icon: RxDashboard },
    { id: 2, label: "All Orders", to: "/admin-orders", icon: FiShoppingBag },
    { id: 3, label: "All Sellers", to: "/admin-sellers", icon: GrWorkshop },
    { id: 4, label: "All Users", to: "/admin-users", icon: HiOutlineUserGroup },
    { id: 5, label: "All Products", to: "/admin-products", icon: BsHandbag },
    { id: 6, label: "All Events", to: "/admin-events", icon: MdOutlineLocalOffer },
    { id: 7, label: "Withdraw Request", to: "/admin-withdraw-request", icon: CiMoneyBill },
    // change this route if you want: "/admin/settings"
    { id: 8, label: "Settings", to: "/profile", icon: AiOutlineSetting },
  ]

  return (
    <aside className="as_wrap">
      {/* top gradient bar */}
      <div className="as_topBar" />

      {/* title */}
      <div className="as_head">
        <h2 className="as_title">Admin Panel</h2>
        <p className="as_sub">Manage everything</p>
      </div>

      {/* items */}
      <div className="as_list">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id

          return (
            <Link key={item.id} to={item.to} className={`as_item ${isActive ? "as_itemActive" : ""}`}>
              <span className={`as_indicator ${isActive ? "as_indicatorOn" : ""}`} />
              <span className={`as_icon ${isActive ? "as_iconOn" : ""}`}>
                <Icon size={22} />
              </span>

              <span className={`as_text ${isActive ? "as_textOn" : ""}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>

      <style jsx global>{`
        .as_wrap {
          width: 100%;
          height: 90vh;
          position: sticky;
          top: 0;
          left: 0;
          z-index: 10;
          background: #ffffff;
          border-right: 1px solid rgba(0, 0, 0, 0.08);
          overflow-y: auto;
        }

        .as_topBar {
          height: 6px;
          background: linear-gradient(90deg, #1a2240, #3d569a, #4b6cb7);
        }

        .as_head {
          padding: 14px 14px 12px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        }

        .as_title {
          font-size: 18px;
          font-weight: 1000;
          color: #111827;
          margin: 0;
        }

        .as_sub {
          margin: 4px 0 0;
          font-size: 12px;
          font-weight: 800;
          color: rgba(17, 24, 39, 0.55);
        }

        .as_list {
          padding: 10px 8px 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .as_item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 12px;
          border-radius: 16px;
          text-decoration: none;
          border: 1px solid rgba(0, 0, 0, 0.06);
          background: rgba(17, 24, 39, 0.02);
          transition: 160ms ease;
          overflow: hidden;
        }

        .as_item:hover {
          transform: translateY(-1px);
          background: rgba(17, 24, 39, 0.06);
        }

        .as_indicator {
          position: absolute;
          left: 0;
          top: 10px;
          bottom: 10px;
          width: 4px;
          border-radius: 999px;
          background: transparent;
        }

        .as_indicatorOn {
          background: linear-gradient(180deg, #1a2240, #3d569a, #4b6cb7);
        }

        .as_icon {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(17, 24, 39, 0.06);
          color: rgba(17, 24, 39, 0.72);
          border: 1px solid rgba(0, 0, 0, 0.06);
          flex-shrink: 0;
        }

        .as_iconOn {
          background: linear-gradient(90deg, rgba(26, 34, 64, 0.14), rgba(61, 86, 154, 0.14));
          color: #111827;
          border-color: rgba(61, 86, 154, 0.22);
        }

        .as_text {
          font-size: 15px;
          font-weight: 900;
          color: rgba(17, 24, 39, 0.65);
          white-space: nowrap;
        }

        .as_textOn {
          color: #111827;
        }

        .as_itemActive {
          background: #ffffff;
          box-shadow: 0 14px 28px rgba(17, 24, 39, 0.1);
          border-color: rgba(61, 86, 154, 0.18);
        }

        /* Same behavior as your old code: hide text on small widths */
        @media (max-width: 800px) {
          .as_text {
            display: none;
          }
        }
      `}</style>
    </aside>
  )
}

export default AdminSideBar
