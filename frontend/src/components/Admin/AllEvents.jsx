"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { deleteEvent, getAllEventsShop } from "../../redux/actions/event"
import { toast } from "react-toastify"
import { DataGrid } from "@material-ui/data-grid"
import { FiCalendar, FiEye, FiTrash2, FiSearch, FiPlus, FiClock } from "react-icons/fi"
import Loader from "../Layout/Loader"

const AllEvents = () => {
  const { events, isLoading } = useSelector((state) => state.events)
  const { seller } = useSelector((state) => state.seller)
  const dispatch = useDispatch()

  const [localEvents, setLocalEvents] = useState([])
  const [q, setQ] = useState("")
  const [dateFilter, setDateFilter] = useState("all") // all | active | upcoming | ended
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null })

  useEffect(() => {
    if (seller?._id) dispatch(getAllEventsShop(seller._id))
  }, [dispatch, seller?._id])

  useEffect(() => {
    setLocalEvents(events || [])
  }, [events])

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteEvent(id, seller._id))
      toast.success("Event deleted successfully!")
      setLocalEvents((prev) => prev.filter((item) => item._id !== id))
      setDeleteConfirm({ show: false, id: null })
    } catch (error) {
      toast.error("Failed to delete event!")
      console.error(error)
      setDeleteConfirm({ show: false, id: null })
    }
  }

  // helper (NOT a hook dependency issue because it's not inside useMemo closure as dependency)
  const computeStatus = (event) => {
    const now = new Date()
    const s = event?.start_Date ? new Date(event.start_Date) : null
    const f = event?.Finish_Date ? new Date(event.Finish_Date) : null

    if (!s || !f) return "Unknown"
    if (now < s) return "Upcoming"
    if (now > f) return "Ended"
    return "Active"
  }

  const filteredEvents = useMemo(() => {
    const text = q.trim().toLowerCase()

    return (localEvents || [])
      .filter((e) => {
        if (!text) return true
        return (e?.name || "").toLowerCase().includes(text) || (e?._id || "").toLowerCase().includes(text)
      })
      .filter((e) => {
        if (dateFilter === "all") return true
        return computeStatus(e).toLowerCase() === dateFilter
      })
  }, [localEvents, q, dateFilter]) // ✅ no getStatus warning

  const rows = useMemo(() => {
    return filteredEvents.map((item) => ({
      id: item._id,
      name: item.name,
      price: item.discountPrice ?? 0,
      stock: item.stock ?? 0,
      sold: item.sold_out ?? 0,
      startDate: item.start_Date ? new Date(item.start_Date).toLocaleDateString() : "-",
      endDate: item.Finish_Date ? new Date(item.Finish_Date).toLocaleDateString() : "-",
      status: computeStatus(item),
    }))
  }, [filteredEvents]) // ✅ no getStatus warning

  const columns = [
    { field: "id", headerName: "Event ID", minWidth: 190, flex: 1 },

    {
      field: "name",
      headerName: "Event",
      minWidth: 240,
      flex: 1.4,
      renderCell: (params) => (
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-accent-strong)]">
            <FiCalendar size={18} />
          </span>
          <div className="leading-tight">
            <div className="font-semibold text-[var(--color-text)]">{params.value}</div>
            <div className="text-xs text-[var(--color-muted)]">Promotion event</div>
          </div>
        </div>
      ),
    },

    {
      field: "status",
      headerName: "Status",
      minWidth: 140,
      flex: 0.7,
      renderCell: (params) => {
        const v = params.value
        const cls =
          v === "Active"
            ? "status-chip status-chip--success"
            : v === "Upcoming"
              ? "status-chip status-chip--primary"
              : v === "Ended"
                ? "status-chip status-chip--muted"
                : "status-chip status-chip--neutral"

        return <span className={cls}>{v}</span>
      },
    },

    {
      field: "price",
      headerName: "Price",
      minWidth: 140,
      flex: 0.7,
      type: "number",
      valueFormatter: (p) => `Rs. ${p.value}`,
      renderCell: (params) => <span className="font-semibold text-[var(--color-text)]">Rs. {params.value}</span>,
    },

    {
      field: "stock",
      headerName: "Stock",
      minWidth: 120,
      flex: 0.6,
      type: "number",
      renderCell: (params) => {
        const v = Number(params.value || 0)
        const cls =
          v === 0
            ? "status-chip status-chip--danger"
            : v < 10
              ? "status-chip status-chip--muted"
              : "status-chip status-chip--success"
        const label = v === 0 ? "Out" : v < 10 ? "Low" : "In stock"
        return (
          <div className="flex items-center gap-2">
            <span className={cls}>{label}</span>
            <span className="text-sm font-semibold text-[var(--color-text)]">{v}</span>
          </div>
        )
      },
    },

    { field: "sold", headerName: "Sold", minWidth: 110, flex: 0.6, type: "number" },

    {
      field: "startDate",
      headerName: "Start",
      minWidth: 140,
      flex: 0.7,
      renderCell: (params) => (
        <div className="flex items-center gap-2 text-[var(--color-muted)]">
          <FiClock className="text-[var(--color-muted)]" />
          <span className="font-medium">{params.value}</span>
        </div>
      ),
    },

    {
      field: "endDate",
      headerName: "End",
      minWidth: 140,
      flex: 0.7,
      renderCell: (params) => (
        <div className="flex items-center gap-2 text-[var(--color-muted)]">
          <FiClock className="text-[var(--color-muted)]" />
          <span className="font-medium">{params.value}</span>
        </div>
      ),
    },

    {
      field: "preview",
      headerName: "",
      minWidth: 90,
      flex: 0.45,
      sortable: false,
      renderCell: (params) => (
        <Link to={`/event/${params.id}`}>
          <button className="btn-secondary !h-10 !min-h-0 !w-10 !rounded-[14px] !p-0">
            <FiEye size={18} className="text-[var(--color-text)]" />
          </button>
        </Link>
      ),
    },

    {
      field: "delete",
      headerName: "",
      minWidth: 90,
      flex: 0.45,
      sortable: false,
      renderCell: (params) => (
        <button
          onClick={() => setDeleteConfirm({ show: true, id: params.id })}
          className="btn-danger !h-10 !min-h-0 !w-10 !rounded-[14px] !p-0"
        >
          <FiTrash2 size={18} />
        </button>
      ),
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

  const total = localEvents?.length || 0
  const active = (localEvents || []).filter((e) => computeStatus(e) === "Active").length
  const upcoming = (localEvents || []).filter((e) => computeStatus(e) === "Upcoming").length
  const ended = (localEvents || []).filter((e) => computeStatus(e) === "Ended").length

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full p-4 md:p-6">
          {/* Header */}
          <div className="surface-card mb-5">
            <div className="px-5 py-4 md:px-6 md:py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-[22px] md:text-[26px] font-semibold text-[var(--color-text)]">All Events</h2>
                <p className="mt-1 text-sm text-[var(--color-muted)]">Manage promotions and special offers.</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="status-chip status-chip--neutral">
                    Total: {total}
                  </span>

                  <button
                    onClick={() => setDateFilter("active")}
                    className={`status-chip transition ${
                      dateFilter === "active"
                        ? "status-chip--success"
                        : "status-chip--muted"
                    }`}
                  >
                    Active: {active}
                  </button>

                  <button
                    onClick={() => setDateFilter("upcoming")}
                    className={`status-chip transition ${
                      dateFilter === "upcoming"
                        ? "status-chip--primary"
                        : "status-chip--muted"
                    }`}
                  >
                    Upcoming: {upcoming}
                  </button>

                  <button
                    onClick={() => setDateFilter("ended")}
                    className={`status-chip transition ${
                      dateFilter === "ended"
                        ? "status-chip--neutral"
                        : "status-chip--muted"
                    }`}
                  >
                    Ended: {ended}
                  </button>

                  <button
                    onClick={() => setDateFilter("all")}
                    className={`status-chip transition ${
                      dateFilter === "all" ? "status-chip--strong" : "status-chip--muted"
                    }`}
                  >
                    All
                  </button>
                </div>
              </div>

              <Link
                to="/dashboard-create-event"
                className="btn-primary"
              >
                <FiPlus size={16} />
                Create Event
              </Link>
            </div>

            {/* Search */}
            <div className="px-5 pb-5 md:px-6">
              <div className="flex h-12 items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4">
                <FiSearch className="text-[var(--color-muted)]" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search events by name or ID..."
                  className="w-full bg-transparent text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-muted)]"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="surface-card overflow-hidden">
            <div className="px-5 py-4 md:px-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-text)]">Event List</h3>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  Showing {rows.length} of {total}
                </p>
              </div>
            </div>

            <div className="px-2 md:px-4 pb-4">
              {rows.length === 0 ? (
                <div className="py-14 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-accent-strong)]">
                    <FiCalendar size={26} />
                  </div>
                  <h4 className="mt-4 text-lg font-semibold text-[var(--color-text)]">No events found</h4>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    {q ? `No events matching "${q}".` : "Create your first event to attract customers with offers."}
                  </p>
                  <Link
                    to="/dashboard-create-event"
                    className="btn-primary mt-5"
                  >
                    <FiPlus size={16} />
                    Create Event
                  </Link>
                </div>
              ) : (
                <div className="surface-card-sm overflow-hidden bg-white">
                  <DataGrid rows={rows} columns={columns} pageSize={10} disableSelectionOnClick autoHeight sx={gridSx} />
                </div>
              )}
            </div>
          </div>

          {/* Delete Modal */}
          {deleteConfirm.show && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="surface-card w-full max-w-md p-6">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#dcc0b4] bg-[#f3e2dc] text-[#8d4e3c]">
                  <FiTrash2 size={24} />
                </div>
                <h3 className="mt-4 text-center text-xl font-semibold text-[var(--color-text)]">Delete event?</h3>
                <p className="mt-2 text-center text-sm text-[var(--color-muted)]">
                  This action cannot be undone. The event will be removed permanently.
                </p>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm({ show: false, id: null })}
                    className="btn-secondary !h-11 !w-full"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm.id)}
                    className="btn-danger !h-11 !w-full"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default AllEvents
