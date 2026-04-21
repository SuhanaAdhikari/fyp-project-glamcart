import { Button } from "@material-ui/core"
import { DataGrid } from "@material-ui/data-grid"
import axios from "axios"
import React, { useEffect, useMemo, useState } from "react"
import { AiOutlineDelete } from "react-icons/ai"
import { RxCross1 } from "react-icons/rx"
import { useDispatch, useSelector } from "react-redux"
import Loader from "../Layout/Loader"
import { server } from "../../server"
import { toast } from "react-toastify"
import { FiPercent, FiTag, FiSearch, FiPlus } from "react-icons/fi"

const AllCoupons = () => {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [coupouns, setCoupouns] = useState([])
  const [minAmount, setMinAmout] = useState("")
  const [maxAmount, setMaxAmount] = useState("")
  const [selectedProducts, setSelectedProducts] = useState("")
  const [value, setValue] = useState("")
  const [search, setSearch] = useState("")

  const { seller } = useSelector((state) => state.seller)
  const { products } = useSelector((state) => state.products)

  const dispatch = useDispatch()

  useEffect(() => {
    if (!seller?._id) return

    setIsLoading(true)
    axios
      .get(`${server}/coupon/get-coupon/${seller._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setIsLoading(false)
        setCoupouns(res.data.couponCodes || [])
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [dispatch, seller?._id])

  const handleDelete = async (id) => {
    axios
      .delete(`${server}/coupon/delete-coupon/${id}`, { withCredentials: true })
      .then(() => {
        toast.success("Coupon code deleted succesfully!")
      })
    window.location.reload()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    await axios
      .post(
        `${server}/coupon/create-coupon-code`,
        {
          name,
          minAmount: minAmount === "" ? null : minAmount,
          maxAmount: maxAmount === "" ? null : maxAmount,
          selectedProducts: selectedProducts === "" ? null : selectedProducts,
          value,
          shopId: seller._id,
        },
        { withCredentials: true },
      )
      .then(() => {
        toast.success("Coupon code created successfully!")
        setOpen(false)
        window.location.reload()
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Something went wrong")
      })
  }

  const filteredCoupons = useMemo(() => {
    if (!search.trim()) return coupouns
    const q = search.toLowerCase()
    return coupouns.filter((c) => String(c?.name || "").toLowerCase().includes(q))
  }, [coupouns, search])

  const columns = [
    {
      field: "id",
      headerName: "Coupon ID",
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
      field: "name",
      headerName: "Coupon Code",
      minWidth: 200,
      flex: 1.1,
      renderCell: (params) => (
        <div className="flex items-center gap-2 min-w-0">
          <FiTag className="text-gray-500" />
          <span className="font-medium text-gray-900 truncate">{params.value}</span>
        </div>
      ),
    },
    {
      field: "price",
      headerName: "Discount",
      minWidth: 140,
      flex: 0.7,
      renderCell: (params) => (
        <span className="gc_price inline-flex items-center gap-2">
          <FiPercent />
          {params.value}
        </span>
      ),
    },
    {
      field: "Delete",
      flex: 0.35,
      minWidth: 90,
      headerName: "",
      sortable: false,
      renderCell: (params) => (
        <Button onClick={() => handleDelete(params.id)} className="gc_iconBtn" aria-label="Delete coupon">
          <AiOutlineDelete size={18} />
        </Button>
      ),
    },
  ]

  const rows = []
  filteredCoupons &&
    filteredCoupons.forEach((item) => {
      rows.push({
        id: item._id,
        name: item.name,
        price: item.value + " %",
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
            <div className="mb-6 flex flex-col gap-3">
              <div className="inline-flex items-center gap-2">
                <span className="gc_dot" />
                <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Marketing</p>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Coupon Codes</h2>
                  <p className="text-sm text-gray-600">Create and manage discount coupons for your shop.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search coupon..."
                      className="w-full sm:w-[260px] pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white
                                 focus:outline-none focus:border-[#a67861] focus:ring-2 focus:ring-[#ead7c8] transition"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="btn-primary !min-h-0 px-4 py-2.5 !rounded-xl !font-extrabold"
                  >
                    <FiPlus />
                    Create Coupon
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div
                className="h-[5px] w-full"
                style={{ background: "linear-gradient(90deg, var(--color-accent), var(--color-accent-strong))" }}
              />
              <div className="p-2 md:p-4">
                <DataGrid rows={rows} columns={columns} pageSize={10} disableSelectionOnClick autoHeight className="gc_grid" />
              </div>
            </div>

            {/* Empty state */}
            {rows.length === 0 && (
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <FiTag className="text-gray-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No coupons found</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {search ? "Try a different search term." : "Create your first coupon to boost sales."}
                </p>
              </div>
            )}

            {/* Modal */}
            {open && (
              <div className="fixed inset-0 bg-black/50 z-[20000] flex items-center justify-center p-4">
                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
                  {/* Modal header */}
                  <div className="accent-panel border-b border-[var(--color-border)] p-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-extrabold text-[var(--color-text)]">Create Coupon</h3>
                      <p className="text-[var(--color-muted)] text-sm mt-1">Set discount, limits and optional product.</p>
                    </div>
                    <button
                      onClick={() => setOpen(false)}
                      className="p-2 rounded-full hover:bg-[var(--color-surface)] transition text-[var(--color-text)]"
                      aria-label="Close"
                    >
                      <RxCross1 size={22} />
                    </button>
                  </div>

                  {/* Modal body */}
                  <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="text-sm font-semibold text-gray-700">
                            Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. NEWYEAR10"
                            className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200
                                       focus:outline-none focus:border-[#a67861] focus:ring-2 focus:ring-[#ead7c8] transition"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-gray-700">
                            Discount Percentage <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            required
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="10"
                            min="0"
                            className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200
                                       focus:outline-none focus:border-[#a67861] focus:ring-2 focus:ring-[#ead7c8] transition"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-gray-700">Selected Product</label>
                          <select
                            className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 bg-white
                                       focus:outline-none focus:border-[#a67861] focus:ring-2 focus:ring-[#ead7c8] transition"
                            value={selectedProducts}
                            onChange={(e) => setSelectedProducts(e.target.value)}
                          >
                            <option value="">All products (no selection)</option>
                            {products?.map((i) => (
                              <option value={i.name} key={i.name}>
                                {i.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-gray-700">Min Amount</label>
                          <input
                            type="number"
                            value={minAmount}
                            onChange={(e) => setMinAmout(e.target.value)}
                            placeholder="Optional"
                            min="0"
                            className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200
                                       focus:outline-none focus:border-[#a67861] focus:ring-2 focus:ring-[#ead7c8] transition"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-gray-700">Max Amount</label>
                          <input
                            type="number"
                            value={maxAmount}
                            onChange={(e) => setMaxAmount(e.target.value)}
                            placeholder="Optional"
                            min="0"
                            className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200
                                       focus:outline-none focus:border-[#a67861] focus:ring-2 focus:ring-[#ead7c8] transition"
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex flex-col sm:flex-row gap-3">
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="w-full sm:w-auto px-5 py-3 rounded-xl border border-gray-200 bg-white font-extrabold text-gray-800
                                     hover:bg-gray-50 transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn-primary !w-full sm:!flex-1 px-5 py-3 !rounded-xl !font-extrabold"
                        >
                          Create Coupon
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* GlamCart DataGrid styles */}
          <style jsx global>{`
            .gc_dot {
              width: 10px;
              height: 10px;
              border-radius: 999px;
              background: linear-gradient(90deg, var(--color-accent), var(--color-accent-strong));
              box-shadow: 0 0 0 3px rgba(166, 120, 97, 0.12);
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
              white-space: nowrap;
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

export default AllCoupons
