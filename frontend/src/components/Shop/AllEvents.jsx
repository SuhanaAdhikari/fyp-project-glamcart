import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { deleteEvent, getAllEventsShop } from "../../redux/actions/event"
import { toast } from "react-toastify"
import { DataGrid } from "@material-ui/data-grid"
import {
  FiCalendar,
  FiEye,
  FiTrash2,
  FiSearch,
  FiPlus,
  FiClock,

} from "react-icons/fi"
import Loader from "../Layout/Loader"

const AllEvents = () => {
  const { events, isLoading } = useSelector((state) => state.events)
  const { seller } = useSelector((state) => state.seller)
  const dispatch = useDispatch()

  const [localEvents, setLocalEvents] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null })

  useEffect(() => {
    if (seller?._id) dispatch(getAllEventsShop(seller._id))
  }, [dispatch, seller?._id])

  useEffect(() => {
    setLocalEvents(events)
  }, [events])

  // ❌ DO NOT CHANGE
  const handleDelete = async (id) => {
    try {
      await dispatch(deleteEvent(id, seller._id))
      toast.success("Event deleted successfully!")
      setLocalEvents((prev) => prev.filter((item) => item._id !== id))
      setDeleteConfirm({ show: false, id: null })
    } catch (error) {
      toast.error("Failed to delete event!")
      setDeleteConfirm({ show: false, id: null })
    }
  }

  const filteredEvents = localEvents?.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  /* ==================== TABLE COLUMNS ==================== */
  const columns = [
    {
      field: "id",
      headerName: "Event ID",
      minWidth: 200,
      flex: 0.9,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <span className="gc_dot" />
          <span className="font-semibold text-gray-900">{params.value}</span>
        </div>
      ),
    },
    {
      field: "name",
      headerName: "Event Name",
      minWidth: 220,
      flex: 1.3,
      renderCell: (params) => (
        <div>
          <p className="font-semibold text-gray-900">{params.value}</p>
          <span className="text-xs text-gray-500">GlamCart event</span>
        </div>
      ),
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 120,
      flex: 0.6,
      renderCell: (params) => <span className="gc_price">{params.value}</span>,
    },
    {
      field: "Stock",
      headerName: "Stock",
      minWidth: 100,
      flex: 0.5,
      renderCell: (params) => {
        const low = params.value < 10
        return <span className={`gc_pill ${low ? "gc_low" : "gc_ok"}`}>{params.value}</span>
      },
    },
    {
      field: "sold",
      headerName: "Sold",
      minWidth: 100,
      flex: 0.5,
      renderCell: (params) => (
        <span className="font-semibold text-gray-700">{params.value}</span>
      ),
    },
    {
      field: "startDate",
      headerName: "Start",
      minWidth: 130,
      flex: 0.6,
      renderCell: (params) => (
        <div className="flex items-center gap-2 text-gray-700">
          <FiClock />
          {params.value}
        </div>
      ),
    },
    {
      field: "endDate",
      headerName: "End",
      minWidth: 130,
      flex: 0.6,
      renderCell: (params) => (
        <div className="flex items-center gap-2 text-gray-700">
          <FiClock />
          {params.value}
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "",
      minWidth: 120,
      flex: 0.6,
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-2">
          <Link to={`/product/${params.id}`}>
            <button className="gc_iconBtn">
              <FiEye />
            </button>
          </Link>
          <button
            onClick={() => setDeleteConfirm({ show: true, id: params.id })}
            className="gc_iconBtnDanger"
          >
            <FiTrash2 />
          </button>
        </div>
      ),
    },
  ]

  /* ==================== ROWS ==================== */
  const rows = []
  filteredEvents?.forEach((item) => {
    rows.push({
      id: item._id,
      name: item.name,
      price: "Rs." + item.discountPrice,
      Stock: item.stock,
      sold: item.sold_out,
      startDate: new Date(item.start_Date).toLocaleDateString(),
      endDate: new Date(item.Finish_Date).toLocaleDateString(),
    })
  })

  /* ==================== UI ==================== */
  return isLoading ? (
    <Loader />
  ) : (
    <div className="w-full px-8 pt-6 mt-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="gc_dot" />
            <span className="text-xs font-bold text-gray-500 uppercase">Events</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
                <FiCalendar /> All Events
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage your GlamCart promotions & offers
              </p>
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search events..."
                  className="pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#ead7c8] focus:border-[#a67861] outline-none"
                />
              </div>

              <Link to="/dashboard-create-event">
                <button className="gc_primaryBtn">
                  <FiPlus /> Create Event
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="gc_card overflow-hidden">
          <div className="gc_cardTopLine" />
          {rows.length === 0 ? (
            <div className="py-20 text-center">
              <FiCalendar size={36} className="mx-auto text-[var(--color-accent-strong)] mb-4" />
              <h3 className="text-xl font-bold text-gray-900">No Events Found</h3>
              <p className="text-gray-600 mt-2">
                {searchTerm ? "No matching events." : "Create your first GlamCart event."}
              </p>
            </div>
          ) : (
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              autoHeight
              disableSelectionOnClick
              className="gc_grid"
            />
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[380px] shadow-2xl">
            <FiTrash2 size={28} className="text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-center text-gray-900">Delete Event?</h3>
            <p className="text-center text-gray-600 mt-2 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm({ show: false, id: null })}
                className="flex-1 border rounded-xl py-2 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl py-2 font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GlamCart Styles */}
      <style jsx global>{`
        .gc_dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: linear-gradient(90deg, var(--color-accent), var(--color-accent-strong));
        }
        .gc_card {
          border-radius: 18px;
          border: 1px solid #e5e7eb;
          background: #fff;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
        }
        .gc_cardTopLine {
          height: 5px;
          background: linear-gradient(90deg, var(--color-accent), var(--color-accent-strong));
        }
        .gc_price {
          font-weight: 900;
          padding: 6px 10px;
          border-radius: 999px;
          background: var(--color-panel);
        }
        .gc_pill {
          padding: 6px 10px;
          border-radius: 999px;
          font-weight: 800;
          font-size: 12px;
        }
        .gc_ok {
          background: rgba(22, 163, 74, 0.12);
          color: #166534;
        }
        .gc_low {
          background: rgba(225, 29, 72, 0.12);
          color: #9f1239;
        }
        .gc_iconBtn {
          padding: 8px;
          border-radius: 999px;
          background: #f3f4f6;
        }
        .gc_iconBtnDanger {
          padding: 8px;
          border-radius: 999px;
          background: #fee2e2;
          color: #dc2626;
        }
        .gc_primaryBtn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 14px;
          font-weight: 900;
          color: #fff;
          background: linear-gradient(90deg, var(--color-accent), var(--color-accent-strong));
        }
      `}</style>
    </div>
  )
}

export default AllEvents
