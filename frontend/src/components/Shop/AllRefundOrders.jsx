import { Button } from "@material-ui/core"
import { DataGrid } from "@material-ui/data-grid"
import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import Loader from "../Layout/Loader"
import { getAllOrdersOfShop } from "../../redux/actions/order"
import { AiOutlineArrowRight } from "react-icons/ai"
import { FiRefreshCcw } from "react-icons/fi"

const AllRefundOrders = () => {
  const { orders, isLoading } = useSelector((state) => state.order)
  const { seller } = useSelector((state) => state.seller)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id))
  }, [dispatch, seller._id])

  const refundOrders =
    orders && orders.filter((item) => item.status === "Processing refund" || item.status === "Refund Success")

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 220,
      flex: 1,
      renderCell: (params) => (
        <div className="flex items-center gap-2 min-w-0">
          <span className="gc_dot" />
          <span className="font-semibold text-gray-900 truncate">{params.value}</span>
        </div>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 170,
      flex: 0.8,
      renderCell: (params) => {
        const v = String(params.value || "")
        const ok = v === "Refund Success"
        return <span className={`gc_pill ${ok ? "gc_pillOk" : "gc_pillWarn"}`}>{v}</span>
      },
    },
    {
      field: "itemsQty",
      headerName: "Items",
      type: "number",
      minWidth: 120,
      flex: 0.6,
      renderCell: (params) => <span className="gc_qty">{params.value}</span>,
    },
    {
      field: "total",
      headerName: "Total",
      minWidth: 160,
      flex: 0.7,
      renderCell: (params) => <span className="gc_price">{params.value}</span>,
    },
    {
      field: " ",
      flex: 0.35,
      minWidth: 90,
      headerName: "",
      sortable: false,
      renderCell: (params) => (
        <Link to={`/order/${params.id}`}>
          <Button className="gc_iconBtn" aria-label="View order">
            <AiOutlineArrowRight size={18} />
          </Button>
        </Link>
      ),
    },
  ]

  const row = []
  refundOrders &&
    refundOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "US$ " + item.totalPrice,
        status: item.status,
      })
    })

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full px-4 md:px-8 pt-6 mt-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-2">
              <div className="inline-flex items-center gap-2">
                <span className="gc_dot" />
                <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Orders</p>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Refund Orders</h2>
                  <p className="text-sm text-gray-600">Orders in “Processing refund” or “Refund Success”.</p>
                </div>

                <button
                  type="button"
                  onClick={() => dispatch(getAllOrdersOfShop(seller._id))}
                  className="gc_refreshBtn hidden sm:inline-flex"
                >
                  <FiRefreshCcw />
                  Refresh
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="h-[5px] w-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-600" />
              <div className="p-2 md:p-4">
                <DataGrid
                  rows={row}
                  columns={columns}
                  pageSize={10}
                  disableSelectionOnClick
                  autoHeight
                  className="gc_grid"
                />
              </div>
            </div>

            {/* Empty state */}
            {row.length === 0 && (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <FiRefreshCcw className="text-gray-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No refund orders</h3>
                <p className="text-sm text-gray-600 mt-1">When customers request refunds, they’ll show here.</p>
              </div>
            )}
          </div>

          {/* GlamCart DataGrid styles */}
          <style jsx global>{`
            .gc_dot {
              width: 10px;
              height: 10px;
              border-radius: 999px;
              background: linear-gradient(90deg, #ec4899, #a855f7);
              box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.12);
              display: inline-block;
            }

            .gc_price {
              font-weight: 900;
              color: #111827;
              background: linear-gradient(90deg, rgba(236, 72, 153, 0.12), rgba(168, 85, 247, 0.12));
              border: 1px solid rgba(0, 0, 0, 0.06);
              padding: 6px 10px;
              border-radius: 999px;
              display: inline-flex;
              align-items: center;
              line-height: 1;
            }

            .gc_qty {
              font-weight: 900;
              color: #111827;
              background: rgba(17, 24, 39, 0.06);
              border: 1px solid rgba(0, 0, 0, 0.06);
              padding: 6px 10px;
              border-radius: 999px;
              display: inline-flex;
              align-items: center;
              line-height: 1;
              min-width: 44px;
              justify-content: center;
            }

            .gc_pill {
              font-size: 12px;
              font-weight: 900;
              padding: 6px 10px;
              border-radius: 999px;
              border: 1px solid rgba(0, 0, 0, 0.06);
              line-height: 1;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              max-width: 100%;
              white-space: nowrap;
            }
            .gc_pillOk {
              color: #166534;
              background: rgba(22, 163, 74, 0.08);
              border-color: rgba(22, 163, 74, 0.22);
            }
            .gc_pillWarn {
              color: #9f1239;
              background: rgba(225, 29, 72, 0.08);
              border-color: rgba(225, 29, 72, 0.22);
            }

            .gc_iconBtn {
              min-width: auto !important;
              padding: 7px 10px !important;
              border-radius: 999px !important;
              background: rgba(17, 24, 39, 0.06) !important;
              color: #111827 !important;
              transition: 160ms ease !important;
            }
            .gc_iconBtn:hover {
              background: rgba(17, 24, 39, 0.12) !important;
            }

            .gc_refreshBtn {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              padding: 10px 12px;
              border-radius: 14px;
              border: 1px solid rgba(0, 0, 0, 0.08);
              background: #fff;
              font-weight: 800;
              color: #111827;
              box-shadow: 0 10px 20px rgba(17, 24, 39, 0.08);
              transition: 160ms ease;
            }
            .gc_refreshBtn:hover {
              transform: translateY(-1px);
              box-shadow: 0 14px 28px rgba(17, 24, 39, 0.12);
            }

            .MuiDataGrid-root {
              border: none !important;
              font-family: inherit !important;
            }
            .MuiDataGrid-columnHeaders {
              background: linear-gradient(90deg, rgba(236, 72, 153, 0.08), rgba(168, 85, 247, 0.08)) !important;
              color: #111827 !important;
              font-weight: 900 !important;
              border-bottom: 1px solid rgba(0, 0, 0, 0.06) !important;
            }
            .MuiDataGrid-columnHeaderTitle {
              font-weight: 900 !important;
            }
            .MuiDataGrid-cell {
              border-bottom: 1px solid rgba(0, 0, 0, 0.06) !important;
              color: #111827 !important;
            }
            .MuiDataGrid-cell:focus,
            .MuiDataGrid-cell:focus-within {
              outline: none !important;
            }
            .MuiDataGrid-row:hover {
              background: rgba(17, 24, 39, 0.03) !important;
            }
            .MuiDataGrid-footerContainer {
              background: #fff !important;
              border-top: 1px solid rgba(0, 0, 0, 0.06) !important;
            }
          `}</style>
        </div>
      )}
    </>
  )
}

export default AllRefundOrders
