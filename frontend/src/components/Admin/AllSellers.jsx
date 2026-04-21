"use client"

import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { DataGrid } from "@material-ui/data-grid"
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai"
import { RxCross1 } from "react-icons/rx"
import axios from "axios"
import { server } from "../../server"
import { toast } from "react-toastify"
import { getAllSellers } from "../../redux/actions/sellers"
import { Link } from "react-router-dom"
import { BiErrorCircle } from "react-icons/bi"

const AllSellers = () => {
  const dispatch = useDispatch()
  const { sellers } = useSelector((state) => state.seller)
  const [open, setOpen] = useState(false)
  const [userId, setUserId] = useState("")

  useEffect(() => {
    dispatch(getAllSellers())
  }, [dispatch])

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${server}/shop/delete-seller/${id}`, { withCredentials: true })
      toast.success(res?.data?.message || "Seller deleted!")
      dispatch(getAllSellers())
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete seller!")
      console.error(err)
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const columns = [
    { field: "id", headerName: "Seller ID", minWidth: 150, flex: 0.7 },
    { field: "name", headerName: "Name", minWidth: 130, flex: 0.7 },
    { field: "email", headerName: "Email", type: "text", minWidth: 160, flex: 0.9 },
    { field: "address", headerName: "Seller Address", type: "text", minWidth: 180, flex: 0.9 },
    { field: "joinedAt", headerName: "Joined At", type: "text", minWidth: 130, flex: 0.8 },

    {
      field: "preview",
      flex: 0.4,
      minWidth: 120,
      headerName: "Preview",
      sortable: false,
      renderCell: (params) => (
        <Link to={`/shop/preview/${params.id}`}>
          <button
            className="btn-secondary !h-10 !min-h-0 !w-10 !rounded-[14px] !p-0"
            title="View shop details"
            type="button"
          >
            <AiOutlineEye size={20} className="text-[var(--color-text)]" />
          </button>
        </Link>
      ),
    },

    {
      field: "delete",
      flex: 0.4,
      minWidth: 120,
      headerName: "Delete",
      sortable: false,
      renderCell: (params) => (
        <button
          onClick={() => {
            setUserId(params.id)
            setOpen(true)
          }}
          className="btn-danger !h-10 !min-h-0 !w-10 !rounded-[14px] !p-0"
          title="Delete seller"
          type="button"
        >
          <AiOutlineDelete size={20} />
        </button>
      ),
    },
  ]

  const rows = []
  sellers?.forEach((item) => {
    rows.push({
      id: item._id,
      name: item?.name,
      email: item?.email,
      joinedAt: formatDate(item.createdAt),
      address: item.address,
    })
  })

  return (
    <div className="w-full p-4 md:p-6">
      <div className="surface-card overflow-hidden">
        <div className="px-5 py-4 md:px-6">
          <h3 className="text-[22px] font-semibold text-[var(--color-text)]">All Sellers</h3>
          <p className="mt-1 text-sm text-[var(--color-muted)]">Review registered shops across the marketplace.</p>
        </div>

        <div className="px-2 md:px-4 pb-4">
          <div className="surface-card-sm overflow-hidden bg-white">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
            rowsPerPageOptions={[10, 20, 50]}
            sx={{
              border: 0,
              "& .MuiDataGrid-columnHeaders": {
                borderBottom: "1px solid rgba(0,0,0,0.08)",
                fontWeight: 800,
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
              "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
                outline: "none",
              },
            }}
          />
          </div>
        </div>
      </div>

        {open && (
          <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000080] flex items-center justify-center h-screen transition-all duration-300">
            <div className="surface-card w-[95%] 800px:w-[40%] min-h-[20vh] p-6">
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
                  <BiErrorCircle size={26} />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-[var(--color-text)]">Delete seller?</h3>
                <p className="mt-2 text-sm text-[var(--color-muted)]">This action cannot be undone.</p>
              </div>

              <div className="w-full flex items-center justify-center gap-3 mt-6">
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
  )
}

export default AllSellers
