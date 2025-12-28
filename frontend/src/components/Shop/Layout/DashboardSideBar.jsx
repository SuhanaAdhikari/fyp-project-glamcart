import React, { useMemo, useState } from "react"
import { AiOutlineFolderAdd, AiOutlineGift } from "react-icons/ai"
import { FiPackage, FiShoppingBag } from "react-icons/fi"
import { MdOutlineLocalOffer } from "react-icons/md"
import { RxDashboard } from "react-icons/rx"
import { VscNewFile } from "react-icons/vsc"
import { CiMoneyBill, CiSettings } from "react-icons/ci"
import { Link } from "react-router-dom"
import { BiMessageSquareDetail } from "react-icons/bi"
import { HiOutlineReceiptRefund } from "react-icons/hi"

const DashboardSideBar = ({ active }) => {
  const [collapsed, setCollapsed] = useState(false)

  const menuItems = useMemo(
    () => [
      { id: 1, title: "Dashboard", icon: <RxDashboard size={20} />, link: "/dashboard" },
      { id: 2, title: "All Orders", icon: <FiShoppingBag size={20} />, link: "/dashboard-orders" },
      { id: 3, title: "All Products", icon: <FiPackage size={20} />, link: "/dashboard-products" },
      { id: 4, title: "Create Product", icon: <AiOutlineFolderAdd size={20} />, link: "/dashboard-create-product" },
      { id: 5, title: "All Events", icon: <MdOutlineLocalOffer size={20} />, link: "/dashboard-events" },
      { id: 6, title: "Create Event", icon: <VscNewFile size={20} />, link: "/dashboard-create-event" },
      { id: 7, title: "Withdraw Money", icon: <CiMoneyBill size={20} />, link: "/dashboard-withdraw-money" },
      { id: 8, title: "Shop Inbox", icon: <BiMessageSquareDetail size={20} />, link: "/dashboard-messages" },
      { id: 9, title: "Discount Codes", icon: <AiOutlineGift size={20} />, link: "/dashboard-coupouns" },
      { id: 10, title: "Refunds", icon: <HiOutlineReceiptRefund size={20} />, link: "/dashboard-refunds" },
      { id: 11, title: "Settings", icon: <CiSettings size={20} />, link: "/settings" },
    ],
    []
  )

  return (
    <aside className="w-full h-[90vh] sticky top-0 left-0 z-10">
      <div className="h-full bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] tracking-widest text-gray-500 font-semibold">GLAMCART</p>
              <h2 className="text-gray-900 font-extrabold text-[18px] leading-tight">Seller Panel</h2>
            </div>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
              aria-label="Toggle sidebar"
            >
              {collapsed ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>

          {/* Tip (minimal, not cartoon) */}
          <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3">
            <p className="text-xs text-gray-600">
              <span className="font-semibold text-gray-900">Quick tip:</span> Add offers to boost sales.
            </p>
            <div className="mt-2 h-[2px] w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full w-[48%] bg-gradient-to-r from-pink-500 to-violet-600" />
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className={`px-3 py-3 overflow-y-auto ${collapsed ? "hidden" : "block"} lg:block`}>
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = active === item.id
              return (
                <Link
                  key={item.id}
                  to={item.link}
                  className={`
                    group relative flex items-center gap-3 px-4 py-3 rounded-xl transition
                    ${isActive ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-50"}
                  `}
                >
                  {/* Left accent line (clean) */}
                  <span
                    className={`
                      absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full transition
                      ${isActive ? "bg-gradient-to-b from-pink-500 to-violet-600" : "bg-transparent group-hover:bg-gray-200"}
                    `}
                  />

                  {/* Icon */}
                  <div
                    className={`
                      flex items-center justify-center w-10 h-10 rounded-xl border transition
                      ${isActive ? "border-white/15 bg-white/10" : "border-gray-200 bg-white group-hover:bg-gray-50"}
                    `}
                  >
                    <span className={`${isActive ? "text-white" : "text-gray-700"}`}>{item.icon}</span>
                  </div>

                  {/* Text */}
                  <div className="flex-1 hidden 800px:block">
                    <p className={`text-[15px] font-semibold ${isActive ? "text-white" : "text-gray-900"}`}>
                      {item.title}
                    </p>
                    <p className={`text-xs ${isActive ? "text-white/70" : "text-gray-500"}`}>
                      Manage {item.title.toLowerCase()}
                    </p>
                  </div>

                  {/* Right dot (subtle) */}
                  <span
                    className={`
                      w-2 h-2 rounded-full transition
                      ${isActive ? "bg-gradient-to-r from-pink-500 to-violet-600" : "bg-gray-300 group-hover:bg-gray-400"}
                    `}
                  />
                </Link>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto p-4 border-t border-gray-100 hidden 800px:block">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-xs text-gray-500">Vendor Dashboard</p>
            <p className="text-sm font-extrabold text-gray-900 mt-1">GlamCart Seller</p>
            <p className="text-xs text-gray-500 mt-1">Keep your catalog fresh for better results.</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default DashboardSideBar
