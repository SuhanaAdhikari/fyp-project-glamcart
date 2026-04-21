import React from "react"
import { Button } from "@material-ui/core"
import { DataGrid } from "@material-ui/data-grid"
import { useEffect, useState, useCallback } from "react" // ✅ add useCallback
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai"
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

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllProductsShop(seller._id))
    }
  }, [dispatch, seller?._id])

  useEffect(() => {
    setLocalProducts(products)
  }, [products])

  // ✅ ONLY CHANGE: wrap handleDelete in useCallback
  const handleDelete = useCallback(
    async (id) => {
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
    },
    [dispatch]
  )

  const columns = [
    { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
      renderCell: (params) => {
        return <div className="font-medium text-[var(--color-text)]">{params.value}</div>
      },
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 100,
      flex: 0.6,
      renderCell: (params) => {
        return <div className="font-semibold text-[var(--color-accent-strong)]">{params.value}</div>
      },
    },
    {
      field: "Stock",
      headerName: "Stock",
      type: "number",
      minWidth: 80,
      flex: 0.5,
      renderCell: (params) => {
        const stock = Number(params.value || 0)
        return (
          <div className={stock < 10 ? "status-chip status-chip--danger" : "status-chip status-chip--success"}>
            {stock}
          </div>
        )
      },
    },
    {
      field: "sold",
      headerName: "Sold out",
      type: "number",
      minWidth: 130,
      flex: 0.6,
      renderCell: (params) => {
        return <div className="font-medium text-[var(--color-muted)]">{params.value}</div>
      },
    },
    {
      field: "Preview",
      flex: 0.5,
      minWidth: 100,
      headerName: "",
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/product/${params.id}`}>
            <Button className="!p-2 !min-w-[40px] !rounded-full hover:!bg-[var(--color-surface-soft)]">
              <AiOutlineEye size={20} className="text-[var(--color-accent-strong)]" />
            </Button>
          </Link>
        )
      },
    },
    {
      field: "Delete",
      flex: 0.5,
      minWidth: 100,
      headerName: "",
      sortable: false,
      renderCell: (params) => {
        return (
          <Button
            onClick={() => handleDelete(params.id)}
            className="!p-2 !min-w-[40px] !rounded-full hover:!bg-[var(--color-accent-soft)]"
          >
            <AiOutlineDelete size={20} className="text-[var(--color-accent-strong)]" />
          </Button>
        )
      },
    },
  ]

  const row = []

  localProducts &&
    localProducts.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: "Rs." + item.discountPrice,
        Stock: item.stock,
        sold: item.sold_out,
      })
    })

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full px-8 pt-6 mt-6">
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6">All Products</h2>
          <div className="surface-card overflow-hidden">
            <DataGrid
              rows={row}
              columns={columns}
              pageSize={10}
              disableSelectionOnClick
              autoHeight
              className="bg-white rounded-xl"
            />
          </div>

          <style jsx global>{`
            .MuiDataGrid-root {
              border: none !important;
            }
            .MuiDataGrid-columnHeaders {
              background-color: var(--color-surface-soft);
              color: var(--color-text);
              font-weight: 600;
            }
            .MuiDataGrid-footerContainer {
              background-color: var(--color-surface-soft);
              border-top: none;
            }
            .MuiDataGrid-cell:focus,
            .MuiDataGrid-cell:focus-within {
              outline: none !important;
            }
            .MuiDataGrid-row:hover {
              background-color: var(--color-surface-soft) !important;
            }
          `}</style>
        </div>
      )}
    </>
  )
}

export default AllProducts
