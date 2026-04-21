// ShopProfileData.jsx (AllProducts)
import React, { useEffect, useMemo, useState } from "react"
import { Button } from "@material-ui/core"
import { DataGrid } from "@material-ui/data-grid"
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai"
import { FiSearch, FiPlus, FiPackage } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { getAllProductsShop, deleteProduct } from "../../redux/actions/product"
import Loader from "../Layout/Loader"
import { toast } from "react-toastify"

const AllProducts = () => {
  const { products, isLoading } = useSelector((state) => state.products)
  const { seller } = useSelector((state) => state.seller)
  const dispatch = useDispatch()

  const [localProducts, setLocalProducts] = useState([])
  const [q, setQ] = useState("")
  const [stockFilter, setStockFilter] = useState("all") // all | low | out | in

  useEffect(() => {
    if (seller?._id) dispatch(getAllProductsShop(seller._id))
  }, [dispatch, seller?._id])

  useEffect(() => {
    setLocalProducts(products || [])
  }, [products])

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?")
    if (!confirmDelete) return

    try {
      await dispatch(deleteProduct(id))
      toast.success("Product deleted successfully!")
      setLocalProducts((prev) => prev.filter((item) => item._id !== id))
    } catch (error) {
      toast.error("Failed to delete product!")
      console.error(error)
    }
  }

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase()
    return (localProducts || [])
      .filter((p) => {
        if (!text) return true
        return (
          (p?.name || "").toLowerCase().includes(text) ||
          (p?._id || "").toLowerCase().includes(text)
        )
      })
      .filter((p) => {
        const st = Number(p?.stock || 0)
        if (stockFilter === "low") return st > 0 && st < 10
        if (stockFilter === "out") return st === 0
        if (stockFilter === "in") return st >= 10
        return true
      })
  }, [localProducts, q, stockFilter])

  const rows = useMemo(() => {
    return filtered.map((item) => ({
      id: item._id,
      name: item.name,
      price: item.discountPrice ?? item.originalPrice ?? 0,
      Stock: item.stock ?? 0,
      sold: item.sold_out ?? 0,
    }))
  }, [filtered])

  const columns = [
    { field: "id", headerName: "Product ID", minWidth: 190, flex: 1 },

    {
      field: "name",
      headerName: "Name",
      minWidth: 220,
      flex: 1.4,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] text-[var(--color-accent-strong)]">
            <FiPackage size={18} />
          </span>
          <div className="leading-tight">
            <div className="font-semibold text-[var(--color-text)]">{params.value}</div>
            <div className="text-xs text-[var(--color-muted)]">Listed product</div>
          </div>
        </div>
      ),
    },

    {
      field: "price",
      headerName: "Price",
      minWidth: 140,
      flex: 0.7,
      type: "number",
      valueFormatter: (p) => `Rs. ${p.value}`,
      renderCell: (params) => (
        <span className="font-semibold text-[var(--color-text)]">Rs. {params.value}</span>
      ),
    },

    {
      field: "Stock",
      headerName: "Stock",
      minWidth: 120,
      flex: 0.6,
      type: "number",
      renderCell: (params) => {
        const v = Number(params.value || 0)
        const label = v === 0 ? "Out" : v < 10 ? "Low" : "In stock"

        return (
          <div className="flex items-center gap-2">
            <span className={v === 0 ? "status-chip status-chip--danger" : v < 10 ? "status-chip status-chip--muted" : "status-chip status-chip--success"}>
              {label}
            </span>
            <span className="text-sm font-semibold text-[var(--color-text)]">{v}</span>
          </div>
        )
      },
    },

    {
      field: "sold",
      headerName: "Sold",
      minWidth: 110,
      flex: 0.6,
      type: "number",
      renderCell: (params) => (
        <span className="font-medium text-[var(--color-muted)]">{params.value}</span>
      ),
    },

    {
      field: "Preview",
      flex: 0.45,
      minWidth: 90,
      headerName: "",
      sortable: false,
      renderCell: (params) => (
        <Link to={`/product/${params.id}`}>
          <Button className="!min-w-[40px] !h-[40px] !rounded-xl !p-0 hover:!bg-[var(--color-surface-soft)]">
            <AiOutlineEye size={20} className="text-[var(--color-text)]" />
          </Button>
        </Link>
      ),
    },

    {
      field: "Delete",
      flex: 0.45,
      minWidth: 90,
      headerName: "",
      sortable: false,
      renderCell: (params) => (
        <Button
          onClick={() => handleDelete(params.id)}
          className="!min-w-[40px] !h-[40px] !rounded-xl !p-0 hover:!bg-[var(--color-accent-soft)]"
        >
          <AiOutlineDelete size={20} className="text-[var(--color-accent-strong)]" />
        </Button>
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
    "& .MuiDataGrid-footerContainer": {
      borderTop: "1px solid rgba(0,0,0,0.08)",
    },
    "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
      outline: "none",
    },
  }

  const totalCount = localProducts?.length || 0
  const lowCount = (localProducts || []).filter((p) => (p?.stock || 0) > 0 && (p?.stock || 0) < 10).length
  const outCount = (localProducts || []).filter((p) => (p?.stock || 0) === 0).length

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
                <h2 className="text-[22px] md:text-[26px] font-semibold text-[var(--color-text)]">
                  All Products
                </h2>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  Manage your listings, stock, and pricing quickly.
                </p>

                {/* Stats chips */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="status-chip status-chip--neutral">
                    Total: {totalCount}
                  </span>
                  <span className="status-chip status-chip--muted">
                    Low stock: {lowCount}
                  </span>
                  <span className="status-chip status-chip--danger">
                    Out of stock: {outCount}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  to="/dashboard-create-product"
                  className="btn-primary"
                >
                  <FiPlus size={16} />
                  Add Product
                </Link>
              </div>
            </div>

            {/* Toolbar: Search + Filter */}
            <div className="px-5 pb-5 md:px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <div className="flex h-12 items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4">
                    <FiSearch className="text-[var(--color-muted)]" />
                    <input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="Search by product name or ID..."
                      className="w-full bg-transparent text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-muted)]"
                    />
                  </div>
                </div>

                <div>
                  <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                    className="field-select !min-h-[48px]"
                  >
                    <option value="all">All stock</option>
                    <option value="in">In stock (10+)</option>
                    <option value="low">Low stock (1–9)</option>
                    <option value="out">Out of stock (0)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="surface-card overflow-hidden">
            <div className="px-5 py-4 md:px-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-text)]">Product List</h3>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  Showing {rows.length} of {totalCount}
                </p>
              </div>
            </div>

            <div className="px-2 md:px-4 pb-4">
              <div className="surface-card-sm overflow-hidden bg-white">
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={10}
                  disableSelectionOnClick
                  autoHeight
                  sx={gridSx}
                />
              </div>

              {rows.length === 0 && (
                <div className="px-4 py-10 text-center text-sm text-[var(--color-muted)]">
                  No products found. Try another search or add a new product.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AllProducts
