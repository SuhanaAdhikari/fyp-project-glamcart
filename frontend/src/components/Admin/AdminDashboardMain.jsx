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
            ? "status-chip status-chip--success"
            : v === "Processing"
              ? "status-chip status-chip--neutral"
              : "status-chip status-chip--danger"

        return (
          <span className={cls}>
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
          <div className="accent-panel surface-card mb-5">
            <div className="px-5 py-4 md:px-6 md:py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h2 className="text-[22px] font-semibold text-[var(--color-text)] md:text-[26px]">
                  Admin Dashboard
                </h2>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  Track earnings, sellers, and latest orders in one place.
                </p>
              </div>

              <div className="flex gap-2">
                <Link
                  to="/admin-orders"
                  className="btn-secondary"
                >
                  Manage Orders
                </Link>
                <Link
                  to="/admin-sellers"
                  className="btn-primary"
                >
                  Manage Sellers
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="surface-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--color-muted)]">Total Earning</p>
                  <h3 className="mt-2 text-2xl font-semibold text-[var(--color-text)] md:text-3xl">
                    Rs. {adminBalance}
                  </h3>
                  <p className="mt-2 text-xs text-[var(--color-muted)]">10% of all sales</p>
                </div>

                <div
                  className="flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-sm"
                  style={{ background: "var(--color-accent-strong)" }}
                >
                  <AiOutlineMoneyCollect size={22} />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-[var(--color-muted)]">This updates automatically</span>
                <span className="text-xs font-semibold text-[var(--color-text)]">Live</span>
              </div>
            </div>

            <div className="surface-card-sm bg-white p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--color-muted)]">All Sellers</p>
                  <h3 className="mt-2 text-2xl font-semibold text-[var(--color-text)] md:text-3xl">
                    {sellers?.length || 0}
                  </h3>
                  <p className="mt-2 text-xs text-[var(--color-muted)]">Total registered sellers</p>
                </div>

                <div
                  className="flex h-11 w-11 items-center justify-center rounded-2xl"
                  style={{ background: "var(--color-accent-soft)", color: "var(--color-accent-strong)" }}
                >
                  <MdBorderClear size={22} />
                </div>
              </div>

              <Link
                to="/admin-sellers"
                className="btn-secondary mt-4 !w-full"
              >
                View Sellers
              </Link>
            </div>

            <div className="surface-card-sm bg-white p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-[var(--color-muted)]">All Orders</p>
                  <h3 className="mt-2 text-2xl font-semibold text-[var(--color-text)] md:text-3xl">
                    {adminOrders?.length || 0}
                  </h3>
                  <p className="mt-2 text-xs text-[var(--color-muted)]">Total orders placed</p>
                </div>

                <div
                  className="flex h-11 w-11 items-center justify-center rounded-2xl"
                  style={{ background: "var(--color-panel)", color: "var(--color-text)" }}
                >
                  <FiPackage size={22} />
                </div>
              </div>

              <Link
                to="/admin-orders"
                className="btn-primary mt-4 !w-full"
              >
                View Orders
              </Link>
            </div>
          </div>

          <div className="surface-card mt-6 overflow-hidden">
            <div className="px-5 py-4 md:px-6 md:py-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-text)] md:text-xl">Latest Orders</h3>
                <p className="mt-1 text-sm text-[var(--color-muted)]">Recent orders with status and totals</p>
              </div>
              <Link
                to="/admin-orders"
                className="text-sm font-semibold text-[var(--color-accent-strong)] hover:underline"
              >
                See all
              </Link>
            </div>

            <div className="px-2 md:px-4 pb-4">
              <div className="surface-card-sm overflow-hidden bg-white">
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
