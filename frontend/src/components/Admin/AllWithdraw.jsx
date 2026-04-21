"use client"

// ShopProfileData.jsx
import React, { useEffect, useMemo, useState } from "react"
import axios from "axios"
import { server } from "../../server"
import { DataGrid } from "@material-ui/data-grid"
import { BsPencil } from "react-icons/bs"
import { RxCross1 } from "react-icons/rx"
import { FiAlertTriangle, FiSearch, FiCreditCard } from "react-icons/fi"
import { toast } from "react-toastify"

const AllWithdraw = () => {
  const [data, setData] = useState([])
  const [open, setOpen] = useState(false)
  const [withdrawData, setWithdrawData] = useState(null)
  const [withdrawStatus, setWithdrawStatus] = useState("Processing")
  const [loading, setLoading] = useState(false)
  const [q, setQ] = useState("")

  useEffect(() => {
    setLoading(true)
    axios
      .get(`${server}/withdraw/get-all-withdraw-request`, { withCredentials: true })
      .then((res) => {
        setData(res.data.withdraws || [])
        setLoading(false)
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to load withdraw requests")
        setLoading(false)
      })
  }, [])

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const summary = useMemo(() => {
    const total = data?.length || 0
    const processing = (data || []).filter((x) => x?.status === "Processing").length
    const succeed = (data || []).filter((x) => x?.status === "Succeed").length
    return { total, processing, succeed }
  }, [data])

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase()
    if (!text) return data || []

    return (data || []).filter((item) => {
      const id = (item?._id || "").toLowerCase()
      const status = (item?.status || "").toLowerCase()
      const sellerName = (item?.seller?.name || "").toLowerCase()
      const sellerId = (item?.seller?._id || "").toLowerCase()
      const amount = String(item?.amount ?? "").toLowerCase()
      return (
        id.includes(text) ||
        status.includes(text) ||
        sellerName.includes(text) ||
        sellerId.includes(text) ||
        amount.includes(text)
      )
    })
  }, [data, q])

  const rows = useMemo(() => {
    return (filtered || []).map((item) => ({
      id: item._id,
      shopId: item?.seller?._id,
      name: item?.seller?.name,
      amount: item?.amount, // keep numeric for formatting
      status: item?.status,
      createdAt: item?.createdAt,
    }))
  }, [filtered])

  const columns = [
    { field: "id", headerName: "Withdraw ID", minWidth: 200, flex: 1 },

    { field: "name", headerName: "Shop Name", minWidth: 200, flex: 1 },

    { field: "shopId", headerName: "Shop ID", minWidth: 200, flex: 1 },

    {
      field: "amount",
      headerName: "Amount",
      minWidth: 140,
      flex: 0.7,
      renderCell: (params) => <span className="font-semibold text-gray-900">Rs. {params.value}</span>,
    },

    {
      field: "status",
      headerName: "Status",
      minWidth: 140,
      flex: 0.7,
      renderCell: (params) => {
        const v = params.value
        const cls = v === "Succeed" ? "status-chip status-chip--success" : "status-chip status-chip--neutral"
        return (
          <span className={cls}>
            {v}
          </span>
        )
      },
    },

    {
      field: "createdAt",
      headerName: "Request Date",
      minWidth: 170,
      flex: 0.8,
      renderCell: (params) => <span className="font-medium text-gray-700">{formatDate(params.value)}</span>,
    },

    {
      field: "update",
      headerName: "",
      minWidth: 120,
      flex: 0.4,
      sortable: false,
      renderCell: (params) => {
        const disabled = params.row.status !== "Processing"
        return (
          <button
            type="button"
            title={disabled ? "Only Processing can be updated" : "Update Status"}
            disabled={disabled}
            className={`h-10 w-10 rounded-xl flex items-center justify-center transition ${
              disabled ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-100 text-gray-900"
            }`}
            onClick={() => {
              if (disabled) return
              setWithdrawData(params.row)
              setWithdrawStatus(params.row.status || "Processing")
              setOpen(true)
            }}
          >
            <BsPencil size={18} />
          </button>
        )
      },
    },
  ]

  const gridSx = {
    border: 0,
    "& .MuiDataGrid-columnHeaders": {
      borderBottom: "1px solid rgba(0,0,0,0.08)",
      fontWeight: 800,
    },
    "& .MuiDataGrid-cell": { borderBottom: "1px solid rgba(0,0,0,0.06)" },
    "& .MuiDataGrid-row:hover": { backgroundColor: "rgba(0,0,0,0.02)" },
    "& .MuiDataGrid-footerContainer": { borderTop: "1px solid rgba(0,0,0,0.08)" },
    "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": { outline: "none" },
  }

  const handleSubmit = async () => {
    if (!withdrawData?.id) return

    try {
      const res = await axios.put(
        `${server}/withdraw/update-withdraw-request/${withdrawData.id}`,
        {
          sellerId: withdrawData.shopId,
          status: withdrawStatus, // ✅ IMPORTANT: send selected status
        },
        { withCredentials: true }
      )

      toast.success("Withdraw request updated successfully!")
      setData(res.data.withdraws || [])
      setOpen(false)
      setWithdrawData(null)
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred")
      console.error(error)
    }
  }

  return (
      <div className="w-full p-4 md:p-6">
      {/* GlamCart header */}
      <div className="surface-card mb-5">
        <div className="px-5 py-4 md:px-6 md:py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-[22px] md:text-[26px] font-semibold text-[var(--color-text)]">Withdraw Requests</h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">Review and approve seller withdrawals.</p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="status-chip status-chip--neutral">
                Total: {summary.total}
              </span>
              <span className="status-chip status-chip--muted">
                Processing: {summary.processing}
              </span>
              <span className="status-chip status-chip--success">
                Succeed: {summary.succeed}
              </span>
            </div>
          </div>

          {/* Search */}
          <div className="w-full md:w-[420px]">
            <div className="flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 h-12">
              <FiSearch className="text-[var(--color-muted)]" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by shop, id, status, amount..."
                className="w-full outline-none bg-transparent text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="surface-card overflow-hidden">
        <div className="px-5 py-4 md:px-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-text)]">Request List</h3>
            <p className="mt-1 text-sm text-[var(--color-muted)]">Showing {rows.length} request(s)</p>
          </div>
        </div>

        <div className="px-2 md:px-4 pb-4">
          {rows.length === 0 && !loading ? (
              <div className="py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-accent-strong)]">
                <FiCreditCard size={24} />
              </div>
              <h4 className="mt-4 text-lg font-semibold text-[var(--color-text)]">No withdraw requests</h4>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                {q ? `No requests matching "${q}".` : "No withdrawal requests have been made yet."}
              </p>
            </div>
          ) : (
            <div className="surface-card-sm overflow-hidden bg-white">
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 20]}
                disableSelectionOnClick
                autoHeight
                loading={loading}
                sx={gridSx}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="surface-card w-full max-w-md p-6">
            <div className="w-full flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  setWithdrawData(null)
                }}
                className="btn-secondary !h-10 !min-h-0 !w-10 !rounded-[14px] !p-0"
                title="Close"
              >
                <RxCross1 size={18} className="text-[var(--color-text)]" />
              </button>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]">
                <FiAlertTriangle size={24} />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-[var(--color-text)]">Update withdrawal</h3>
              <p className="mt-2 text-sm text-[var(--color-muted)]">Confirm the status update for this request.</p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="surface-card-sm p-4">
                <div className="text-xs font-semibold text-[var(--color-muted)]">Withdrawal Amount</div>
                <div className="mt-1 text-lg font-bold text-[var(--color-text)]">Rs. {withdrawData?.amount}</div>
                <div className="mt-1 text-xs text-[var(--color-muted)]">Withdraw ID: {withdrawData?.id}</div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[var(--color-text)]">Status</label>
                <select
                  value={withdrawStatus}
                  onChange={(e) => setWithdrawStatus(e.target.value)}
                  className="field-select !min-h-[44px]"
                >
                  <option value="Processing">Processing</option>
                  <option value="Succeed">Succeed</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  setWithdrawData(null)
                }}
                className="btn-secondary !h-11 !w-full"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="btn-primary !h-11 !w-full"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AllWithdraw
