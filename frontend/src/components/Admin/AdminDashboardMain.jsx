import React, { useEffect, useMemo } from "react"
import { AiOutlineMoneyCollect } from "react-icons/ai"
import { MdBorderClear } from "react-icons/md"
import { FiPackage } from "react-icons/fi"
import { Link } from "react-router-dom"
import { DataGrid } from "@material-ui/data-grid"
import { useDispatch, useSelector } from "react-redux"
import { getAllOrdersOfAdmin } from "../../redux/actions/order"
import { getAllSellers } from "../../redux/actions/sellers"
import Loader from "../Layout/Loader"

const AdminDashboardMain = () => {
  const dispatch = useDispatch()

  const { adminOrders, adminOrderLoading } = useSelector((state) => state.order)
  const { sellers } = useSelector((state) => state.seller)

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin())
    dispatch(getAllSellers())
  }, [dispatch])

  const adminEarning = adminOrders?.reduce((acc, item) => acc + (item.totalPrice || 0) * 0.1, 0) || 0
  const adminBalance = adminEarning.toFixed(2)

  const rows = useMemo(() => {
    if (!adminOrders) return []
    return adminOrders.map((item) => ({
      id: item?._id,
      itemsQty: item?.cart?.reduce((acc, i) => acc + (i?.qty || 0), 0) || 0,
      total: item?.totalPrice || 0,
      status: item?.status || "Processing",
      createdAt: item?.createdAt ? item.createdAt.slice(0, 10) : "-",
    }))
  }, [adminOrders])

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 180, flex: 1 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 140,
      flex: 0.7,
      renderCell: (params) => {
        const v = params.value
        const cls =
          v === "Delivered"
            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
            : v === "Processing"
              ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
              : "bg-rose-50 text-rose-700 ring-1 ring-rose-200"

        return (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cls}`}>
            {v}
          </span>
        )
      },
    },
    {
      field: "itemsQty",
      headerName: "Items",
      type: "number",
      minWidth: 110,
      flex: 0.5,
    },
    {
      field: "total",
      headerName: "Total (Rs.)",
      type: "number",
      minWidth: 140,
      flex: 0.6,
      valueFormatter: (params) => `Rs. ${params.value}`,
    },
    {
      field: "createdAt",
      headerName: "Date",
      minWidth: 130,
      flex: 0.6,
    },
  ]

  const gridSx = {
    border: 0,
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: "transparent",
      borderBottom: "1px solid rgba(0,0,0,0.08)",
      fontWeight: 700,
    },
    "& .MuiDataGrid-cell": {
      borderBottom: "1px solid rgba(0,0,0,0.06)",
    },
    "& .MuiDataGrid-row:hover": {
      backgroundColor: "rgba(0,0,0,0.02)",
    },
    "& .MuiDataGrid-footerContainer": {
      borderTop: "1px solid rgba(0,0,0,0.08)",
    },
  }

  return (
    <>
      {adminOrderLoading ? (
        <Loader />
      ) : (
        <div className="w-full p-4 md:p-6">
          {/* GlamCart-style Header */}
          <div className="mb-5 rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="px-5 py-4 md:px-6 md:py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h2 className="text-[22px] md:text-[26px] font-semibold text-gray-900">
                  Admin Dashboard
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Track earnings, sellers, and latest orders in one place.
                </p>
              </div>

              <div className="flex gap-2">
                <Link
                  to="/admin-orders"
                  className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium transition"
                >
                  Manage Orders
                </Link>
                <Link
                  to="/admin-sellers"
                  className="px-4 py-2 rounded-xl bg-black text-white hover:opacity-90 text-sm font-medium transition"
                >
                  Manage Sellers
                </Link>
              </div>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Earnings */}
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-sm p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Earning</p>
                  <h3 className="mt-2 text-2xl md:text-3xl font-semibold text-gray-900">
                    Rs. {adminBalance}
                  </h3>
                  <p className="mt-2 text-xs text-gray-500">10% of all sales</p>
                </div>
                <div className="h-11 w-11 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm">
                  <AiOutlineMoneyCollect size={22} />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-500">This updates automatically</span>
                <span className="text-xs font-semibold text-gray-900">Live</span>
              </div>
            </div>

            {/* Sellers */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">All Sellers</p>
                  <h3 className="mt-2 text-2xl md:text-3xl font-semibold text-gray-900">
                    {sellers?.length || 0}
                  </h3>
                  <p className="mt-2 text-xs text-gray-500">Total registered sellers</p>
                </div>
                <div className="h-11 w-11 rounded-2xl bg-gray-100 text-gray-900 flex items-center justify-center">
                  <MdBorderClear size={22} />
                </div>
              </div>

              <Link
                to="/admin-sellers"
                className="mt-4 inline-flex items-center justify-center w-full px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-semibold transition"
              >
                View Sellers
              </Link>
            </div>

            {/* Orders */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">All Orders</p>
                  <h3 className="mt-2 text-2xl md:text-3xl font-semibold text-gray-900">
                    {adminOrders?.length || 0}
                  </h3>
                  <p className="mt-2 text-xs text-gray-500">Total orders placed</p>
                </div>
                <div className="h-11 w-11 rounded-2xl bg-gray-100 text-gray-900 flex items-center justify-center">
                  <FiPackage size={22} />
                </div>
              </div>

              <Link
                to="/admin-orders"
                className="mt-4 inline-flex items-center justify-center w-full px-4 py-2 rounded-xl bg-black text-white hover:opacity-90 text-sm font-semibold transition"
              >
                View Orders
              </Link>
            </div>
          </div>

          {/* Latest Orders */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-4 md:px-6 md:py-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900">Latest Orders</h3>
                <p className="text-sm text-gray-500 mt-1">Recent orders with status and totals</p>
              </div>
              <Link
                to="/admin-orders"
                className="text-sm font-semibold text-gray-900 hover:underline"
              >
                See all
              </Link>
            </div>

            <div className="px-2 md:px-4 pb-4">
              <div className="rounded-2xl border border-gray-200 overflow-hidden">
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={6}
                  disableSelectionOnClick
                  autoHeight
                  sx={gridSx}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AdminDashboardMain
