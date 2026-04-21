import React, { useEffect, useMemo } from "react"
import { Button } from "@material-ui/core"
import { DataGrid } from "@material-ui/data-grid"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import Loader from "../Layout/Loader"
import { getAllOrdersOfShop } from "../../redux/actions/order"
import { AiOutlineArrowRight } from "react-icons/ai"

const AllOrders = () => {
  const { orders, isLoading } = useSelector((state) => state.order)
  const { seller } = useSelector((state) => state.seller)

  const dispatch = useDispatch()

  useEffect(() => {
    if (seller && seller._id) {
      dispatch(getAllOrdersOfShop(seller._id))
    }
  }, [dispatch, seller])

  // ✅ same functionality, better UI
  const columns = useMemo(
    () => [
      {
        field: "id",
        headerName: "Order ID",
        minWidth: 210,
        flex: 0.9,
        renderCell: (params) => (
          <div className="flex items-center gap-2">
            <span className="gc_orderDot" />
            <span className="font-semibold text-gray-900">{params.value}</span>
          </div>
        ),
      },
      {
        field: "products",
        headerName: "Products",
        minWidth: 260,
        flex: 1.3,
        renderCell: (params) => (
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900 truncate">{params.value.mainProduct}</span>
            {params.value.otherCount > 0 && (
              <span className="text-xs text-gray-500">+{params.value.otherCount} more items</span>
            )}
          </div>
        ),
      },
      {
        field: "status",
        headerName: "Status",
        minWidth: 150,
        flex: 0.6,
        sortable: true,
        renderCell: (params) => {
          const s = params.value || "Unknown"
          const delivered = s === "Delivered"
          return (
            <span className={`gc_statusPill ${delivered ? "gc_statusDelivered" : "gc_statusOther"}`}>{s}</span>
          )
        },
      },
      {
        field: "itemsQty",
        headerName: "Items",
        type: "number",
        minWidth: 110,
        flex: 0.4,
        align: "left",
        headerAlign: "left",
        renderCell: (params) => <span className="font-semibold text-gray-900">{params.value}</span>,
      },
      {
        field: "total",
        headerName: "Total",
        minWidth: 140,
        flex: 0.5,
        renderCell: (params) => <span className="font-extrabold text-gray-900">{params.value}</span>,
      },
      {
        field: "action",
        headerName: "",
        minWidth: 90,
        flex: 0.35,
        sortable: false,
        renderCell: (params) => (
          <Link to={`/order/${params.row.id}`}>
            <Button className="gc_viewBtn" aria-label="View order">
              <AiOutlineArrowRight size={18} />
            </Button>
          </Link>
        ),
      },
    ],
    []
  )

  const rows = useMemo(() => {
    const r = []
    orders &&
      orders.forEach((item) => {
        const productInfo = {
          mainProduct: item.cart?.[0]?.name || "Unknown Product",
          otherCount: item.cart?.length > 1 ? item.cart.length - 1 : 0,
        }

        r.push({
          id: item._id,
          products: productInfo,
          itemsQty: item.cart?.length || 0,
          total: "Rs." + item.totalPrice,
          status: item.status,
        })
      })
    return r
  }, [orders])

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full px-4 md:px-8 pt-6 mt-6">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-2">
            <div className="inline-flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: "linear-gradient(90deg, var(--color-accent), var(--color-accent-strong))" }}
              />
              <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Orders</p>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">All Orders</h2>
            <p className="text-sm text-gray-600">View and manage every order from your store.</p>
          </div>

          {/* Table Container */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div
              className="h-[5px] w-full"
              style={{ background: "linear-gradient(90deg, var(--color-accent), var(--color-accent-strong))" }}
            />
            <div className="p-2 md:p-4">
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                disableSelectionOnClick
                autoHeight
                className="gc_grid"
              />
            </div>
          </div>

          {/* DataGrid styles (GlamCart theme, clean, not cartoon) */}
          <style jsx global>{`
            .gc_orderDot {
              width: 10px;
              height: 10px;
              border-radius: 999px;
              background: linear-gradient(90deg, var(--color-accent), var(--color-accent-strong));
              box-shadow: 0 0 0 3px rgba(166, 120, 97, 0.12);
              display: inline-block;
            }

            .gc_statusPill {
              font-size: 12px;
              font-weight: 700;
              padding: 6px 10px;
              border-radius: 999px;
              line-height: 1;
              display: inline-flex;
              align-items: center;
              border: 1px solid rgba(0, 0, 0, 0.06);
              background: #fff;
              color: #111827;
              white-space: nowrap;
            }
            .gc_statusDelivered {
              border-color: rgba(22, 163, 74, 0.25);
              background: rgba(22, 163, 74, 0.08);
              color: #166534;
            }
            .gc_statusOther {
              border-color: rgba(225, 29, 72, 0.25);
              background: rgba(225, 29, 72, 0.08);
              color: #9f1239;
            }

            .gc_viewBtn {
              min-width: auto !important;
              padding: 7px 10px !important;
              border-radius: 999px !important;
              background: rgba(17, 24, 39, 0.06) !important;
              color: #111827 !important;
              transition: 160ms ease !important;
            }
            .gc_viewBtn:hover {
              background: rgba(17, 24, 39, 0.12) !important;
            }

            .MuiDataGrid-root {
              border: none !important;
              font-family: inherit !important;
            }
            .MuiDataGrid-columnHeaders {
              background: linear-gradient(90deg, rgba(236, 72, 153, 0.08), rgba(168, 85, 247, 0.08)) !important;
              color: #111827 !important;
              font-weight: 800 !important;
              border-bottom: 1px solid rgba(0, 0, 0, 0.06) !important;
            }
            .MuiDataGrid-columnHeaderTitle {
              font-weight: 800 !important;
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

export default AllOrders
