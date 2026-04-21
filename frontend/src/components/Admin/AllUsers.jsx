"use client"

// ShopProfileData.jsx
import React, { useEffect, useState, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllUsers } from "../../redux/actions/user"
import { DataGrid } from "@material-ui/data-grid"
import { AiOutlineDelete } from "react-icons/ai"
import { RxCross1 } from "react-icons/rx"
import axios from "axios"
import { server } from "../../server"
import { toast } from "react-toastify"
import { FiAlertTriangle, FiSearch, FiUsers } from "react-icons/fi"
import Loader from "../Layout/Loader"

const AllUsers = () => {
  const dispatch = useDispatch()
  const { users, isLoading } = useSelector((state) => state.user) // if you don't have isLoading, it's fine
  const [open, setOpen] = useState(false)
  const [userId, setUserId] = useState("")
  const [q, setQ] = useState("")

  useEffect(() => {
    dispatch(getAllUsers())
  }, [dispatch])

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${server}/user/delete-user/${id}`, { withCredentials: true })
      toast.success(res?.data?.message || "User deleted!")
      dispatch(getAllUsers())
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete user!")
      console.error(err)
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase()
    if (!text) return users || []
    return (users || []).filter((u) => {
      const name = (u?.name || "").toLowerCase()
      const email = (u?.email || "").toLowerCase()
      const role = (u?.role || "").toLowerCase()
      const id = (u?._id || "").toLowerCase()
      return name.includes(text) || email.includes(text) || role.includes(text) || id.includes(text)
    })
  }, [users, q])

  const rows = useMemo(() => {
    return (filtered || []).map((item) => ({
      id: item._id,
      name: item.name,
      email: item.email,
      role: item.role,
      joinedAt: item.createdAt,
    }))
  }, [filtered])

  const columns = [
    { field: "id", headerName: "User ID", minWidth: 190, flex: 1 },

    {
      field: "name",
      headerName: "Name",
      minWidth: 160,
      flex: 0.8,
      renderCell: (params) => <span className="font-semibold text-gray-900">{params.value}</span>,
    },

    { field: "email", headerName: "Email", minWidth: 240, flex: 1 },

    {
      field: "role",
      headerName: "Role",
      minWidth: 140,
      flex: 0.7,
      renderCell: (params) => {
        const v = (params.value || "user").toLowerCase()
        const cls = v === "admin" ? "status-chip status-chip--strong" : "status-chip status-chip--neutral"
        return <span className={cls}>{v}</span>
      },
    },

    {
      field: "joinedAt",
      headerName: "Joined",
      minWidth: 160,
      flex: 0.8,
      renderCell: (params) => <span className="font-medium text-gray-700">{formatDate(params.value)}</span>,
    },

    {
      field: "delete",
      headerName: "",
      minWidth: 90,
      flex: 0.45,
      sortable: false,
      renderCell: (params) => (
        <button
          onClick={() => {
            setUserId(params.id)
            setOpen(true)
          }}
          title="Delete User"
          type="button"
          className="btn-danger !h-10 !min-h-0 !w-10 !rounded-[14px] !p-0"
        >
          <AiOutlineDelete size={20} />
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

  const total = users?.length || 0
  const shown = rows.length

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full p-4 md:p-6">
          {/* GlamCart Header */}
          <div className="surface-card mb-5">
            <div className="px-5 py-4 md:px-6 md:py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-[22px] md:text-[26px] font-semibold text-[var(--color-text)]">All Users</h2>
                <p className="mt-1 text-sm text-[var(--color-muted)]">Manage users and roles.</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="status-chip status-chip--neutral">
                    Total: {total}
                  </span>
                  <span className="status-chip status-chip--muted">
                    Showing: {shown}
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
                    placeholder="Search by name, email, role, id..."
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
                <h3 className="text-lg font-semibold text-[var(--color-text)]">User List</h3>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  Showing {shown} of {total}
                </p>
              </div>

              <div className="hidden md:flex items-center gap-2 text-[var(--color-muted)] text-sm">
                <FiUsers />
                <span>All accounts</span>
              </div>
            </div>

            <div className="px-2 md:px-4 pb-4">
              {rows.length === 0 ? (
                <div className="py-14 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-accent-strong)]">
                    <FiUsers size={24} />
                  </div>
                  <h4 className="mt-4 text-lg font-semibold text-[var(--color-text)]">No users found</h4>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">{q ? `No users matching "${q}".` : "No users available."}</p>
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
                    sx={gridSx}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Delete Modal */}
          {open && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] p-4">
              <div className="surface-card w-full max-w-md p-6">
                <div className="w-full flex justify-end">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="btn-secondary !h-10 !min-h-0 !w-10 !rounded-[14px] !p-0"
                    title="Close"
                  >
                    <RxCross1 size={18} className="text-[var(--color-text)]" />
                  </button>
                </div>

                <div className="flex flex-col items-center justify-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#dcc0b4] bg-[#f3e2dc] text-[#8d4e3c]">
                    <FiAlertTriangle size={24} />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-[var(--color-text)]">Delete user?</h3>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    This action cannot be undone. The user will be removed permanently.
                  </p>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    className="btn-secondary !h-11 !w-full"
                    onClick={() => setOpen(false)}
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-danger !h-11 !w-full"
                    onClick={() => {
                      setOpen(false)
                      handleDelete(userId)
                    }}
                    type="button"
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

export default AllUsers
