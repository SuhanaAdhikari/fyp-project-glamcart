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
            className="h-10 w-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition"
            title="View shop details"
            type="button"
          >
            <AiOutlineEye size={20} className="text-gray-900" />
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
          className="h-10 w-10 rounded-xl hover:bg-rose-50 flex items-center justify-center transition"
          title="Delete seller"
          type="button"
        >
          <AiOutlineDelete size={20} className="text-rose-600" />
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
    <div className="w-full flex justify-center pt-5">
      <div className="w-[97%]">
        <h3 className="text-[22px] font-Poppins pb-2 border-b border-gray-200 mb-4">
          <span className="relative">
            All Sellers
            <span className="absolute bottom-[-8px] left-0 w-24 h-1 bg-black"></span>
          </span>
        </h3>

        <div className="w-full min-h-[45vh] bg-white rounded shadow-md border border-gray-200 overflow-hidden">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
            className="bg-white"
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

        {open && (
          <div className="w-full fixed top-0 left-0 z-[999] bg-[#00000080] flex items-center justify-center h-screen transition-all duration-300">
            <div className="w-[95%] 800px:w-[40%] min-h-[20vh] bg-white rounded-2xl shadow-2xl p-6">
              <div className="w-full flex justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="h-10 w-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition"
                  title="Close"
                >
                  <RxCross1 size={18} className="text-gray-700" />
                </button>
              </div>

              <div className="flex flex-col items-center justify-center text-center">
                <div className="h-14 w-14 rounded-2xl bg-rose-50 flex items-center justify-center">
                  <BiErrorCircle size={26} className="text-rose-600" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">Delete seller?</h3>
                <p className="mt-2 text-sm text-gray-500">This action cannot be undone.</p>
              </div>

              <div className="w-full flex items-center justify-center gap-3 mt-6">
                <button
                  className="flex-1 h-11 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-semibold transition"
                  onClick={() => setOpen(false)}
                  type="button"
                >
                  Cancel
                </button>

                <button
                  className="flex-1 h-11 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition"
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
    </div>
  )
}

export default AllSellers
