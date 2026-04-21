"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { DataGrid } from "@material-ui/data-grid"
import { toast } from "react-toastify"
import axios from "axios"
import { server } from "../../server"
import { getAllSellers } from "../../redux/actions/sellers"
import { MdCheckCircleOutline } from "react-icons/md"

const VendorApprovals = () => {
  const dispatch = useDispatch()
  const { sellers, isLoading } = useSelector((state) => state.seller)
  const [approvingId, setApprovingId] = useState("")

  useEffect(() => {
    dispatch(getAllSellers())
  }, [dispatch])

  const pendingSellers = useMemo(
    () => (sellers || []).filter((s) => s?.isApproved === false),
    [sellers],
  )

  const handleApprove = async (id) => {
    try {
      setApprovingId(id)
      const res = await axios.put(
        `${server}/shop/approve-seller/${id}`,
        {},
        { withCredentials: true },
      )
      toast.success(res?.data?.message || "Seller approved")
      dispatch(getAllSellers())
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to approve seller")
    } finally {
      setApprovingId("")
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const columns = [
    { field: "id", headerName: "Seller ID", minWidth: 150, flex: 0.7 },
    { field: "name", headerName: "Name", minWidth: 140, flex: 0.7 },
    { field: "email", headerName: "Email", minWidth: 180, flex: 0.9 },
    { field: "address", headerName: "Address", minWidth: 180, flex: 0.9 },
    { field: "joinedAt", headerName: "Registered", minWidth: 130, flex: 0.7 },
    {
      field: "approve",
      headerName: "Approve",
      minWidth: 140,
      flex: 0.6,
      sortable: false,
      renderCell: (params) => (
        <button
          type="button"
          disabled={approvingId === params.id}
          onClick={() => handleApprove(params.id)}
          className="h-10 px-3 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <MdCheckCircleOutline size={18} />
          Approve
        </button>
      ),
    },
  ]

  const rows = pendingSellers.map((item) => ({
    id: item._id,
    name: item?.name,
    email: item?.email,
    address: item?.address,
    joinedAt: formatDate(item.createdAt),
  }))

  return (
    <div className="w-full flex justify-center pt-5">
      <div className="w-[97%]">
        <h3 className="text-[22px] font-Poppins pb-2 border-b border-gray-200 mb-4">
          <span className="relative">
            Vendor Approvals
            <span className="absolute bottom-[-8px] left-0 w-28 h-1 bg-black"></span>
          </span>
        </h3>

        <div className="w-full min-h-[45vh] bg-white rounded shadow-md border border-gray-200 overflow-hidden">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
            loading={isLoading}
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

        {pendingSellers.length === 0 && !isLoading && (
          <div className="mt-4 text-sm text-gray-500">
            No pending vendor registrations.
          </div>
        )}
      </div>
    </div>
  )
}

export default VendorApprovals
