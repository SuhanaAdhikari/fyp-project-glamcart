import React, { useEffect } from "react";
import AdminWorkspace from "../components/Admin/Layout/AdminWorkspace";
import { DataGrid } from "@material-ui/data-grid";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../redux/actions/order";

const AdminDashboardOrders = () => {
  const dispatch = useDispatch();

  const { adminOrders } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
  }, [dispatch]);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      renderCell: (params) => {
        const value = params.value;
        const cls =
          value === "Delivered"
            ? "status-chip status-chip--success"
            : value === "Processing"
              ? "status-chip status-chip--neutral"
              : "status-chip status-chip--danger";

        return <span className={cls}>{value}</span>;
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },
    {
        field: "createdAt",
        headerName: "Order Date",
        type: "number",
        minWidth: 130,
        flex: 0.8,
      },
  ];

  const row = [];
  adminOrders &&
    adminOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item?.cart?.reduce((acc, item) => acc + item.qty, 0),
        total: item?.totalPrice + " $",
        status: item?.status,
        createdAt: item?.createdAt.slice(0,10),
      });
    });
  return (
    <AdminWorkspace active={2}>
      <div className="w-full min-h-[45vh] p-4 md:p-6">
        <div className="surface-card overflow-hidden p-3 md:p-4">
          <div className="mb-4 px-2">
            <h2 className="text-[22px] font-[800] text-[var(--color-text)]">Order Management</h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">Review every platform order in one streamlined table.</p>
          </div>

          <div className="surface-card-sm overflow-hidden bg-white">
            <div className="w-full flex justify-center">
              <DataGrid
                rows={row}
                columns={columns}
                pageSize={4}
                disableSelectionOnClick
                autoHeight
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
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </AdminWorkspace>
  );
};

export default AdminDashboardOrders;
