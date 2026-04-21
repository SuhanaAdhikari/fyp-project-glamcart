import React, { useEffect, useMemo } from "react";
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from "react-icons/ai";
import { Link } from "react-router-dom";
import { MdBorderClear } from "react-icons/md";
import { FiPackage } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { getAllProductsShop } from "../../redux/actions/product";
import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";

const DashboardHero = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    if (seller && seller._id) {
      dispatch(getAllOrdersOfShop(seller._id));
      dispatch(getAllProductsShop(seller._id));
    }
  }, [dispatch, seller]);

  const availableBalance = seller?.availableBalance ? seller.availableBalance.toFixed(2) : "0.00";

  const columns = useMemo(
    () => [
      { field: "id", headerName: "Order ID", minWidth: 170, flex: 0.9 },
      {
        field: "status",
        headerName: "Status",
        minWidth: 140,
        flex: 0.6,
        cellClassName: (params) =>
          params.getValue(params.id, "status") === "Delivered" ? "gc_statusDelivered" : "gc_statusOther",
      },
      {
        field: "itemsQty",
        headerName: "Items",
        type: "number",
        minWidth: 110,
        flex: 0.4,
      },
      {
        field: "total",
        headerName: "Total",
        minWidth: 140,
        flex: 0.5,
      },
      {
        field: " ",
        flex: 0.4,
        minWidth: 90,
        headerName: "",
        sortable: false,
        renderCell: (params) => (
          <Link to={`/dashboard/order/${params.id}`}>
            <Button className="gc_viewBtn" aria-label="View order">
              <AiOutlineArrowRight size={18} />
            </Button>
          </Link>
        ),
      },
    ],
    []
  );

  const row = useMemo(() => {
    const r = [];
    orders?.forEach((item) => {
      r.push({
        id: item._id,
        itemsQty: item.cart.reduce((acc, it) => acc + it.qty, 0),
        total: `Rs.${item.totalPrice}`,
        status: item.status,
      });
    });
    return r;
  }, [orders]);

  return (
    <div className="w-full p-4 md:p-8">
      <div className="mb-6 flex flex-col gap-2">
        <span className="workspace-kicker">Seller dashboard</span>
        <h3 className="text-[22px] font-extrabold text-[var(--color-text)] md:text-[26px]">Overview</h3>
        <p className="max-w-2xl text-sm text-[var(--color-muted)]">
          Track revenue, orders and products at a glance, then jump into the latest shop activity instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="surface-card p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-sm"
                style={{ background: "var(--color-accent-strong)" }}
              >
                <AiOutlineMoneyCollect size={22} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-text)]">Balance</p>
                <p className="text-xs text-[var(--color-muted)]">Includes 10% service charge</p>
              </div>
            </div>

            <span className="muted-chip">Available</span>
          </div>

          <div className="mt-4">
            <p className="text-3xl font-extrabold text-[var(--color-text)]">Rs.{availableBalance}</p>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <Link
              to="/dashboard-withdraw-money"
              className="text-sm font-semibold text-[var(--color-accent-strong)] underline decoration-[var(--color-border)] underline-offset-4 transition hover:opacity-80"
            >
              Withdraw
            </Link>

            <div className="h-[3px] w-28 overflow-hidden rounded-full bg-[var(--color-panel)]">
              <div className="h-full w-[58%]" style={{ background: "var(--color-accent-strong)" }} />
            </div>
          </div>
        </div>

        <div className="surface-card-sm bg-white p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-sm"
                style={{ background: "var(--color-accent)" }}
              >
                <MdBorderClear size={22} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-text)]">Orders</p>
                <p className="text-xs text-[var(--color-muted)]">Total received</p>
              </div>
            </div>

            <span className="muted-chip">All time</span>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <p className="text-3xl font-extrabold text-[var(--color-text)]">{orders?.length || 0}</p>
            <Link
              to="/dashboard-orders"
              className="text-sm font-semibold text-[var(--color-accent-strong)] underline decoration-[var(--color-border)] underline-offset-4 transition hover:opacity-80"
            >
              View
            </Link>
          </div>

          <div className="mt-4 h-[3px] w-full overflow-hidden rounded-full bg-[var(--color-panel)]">
            <div className="h-full w-[72%]" style={{ background: "var(--color-accent)" }} />
          </div>
        </div>

        <div className="surface-card-sm bg-white p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-sm"
                style={{ background: "var(--color-accent-strong)" }}
              >
                <FiPackage size={22} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-text)]">Products</p>
                <p className="text-xs text-[var(--color-muted)]">In your catalog</p>
              </div>
            </div>

            <span className="muted-chip">Live</span>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <p className="text-3xl font-extrabold text-[var(--color-text)]">{products?.length || 0}</p>
            <Link
              to="/dashboard-products"
              className="text-sm font-semibold text-[var(--color-accent-strong)] underline decoration-[var(--color-border)] underline-offset-4 transition hover:opacity-80"
            >
              Manage
            </Link>
          </div>

          <div className="mt-4 h-[3px] w-full overflow-hidden rounded-full bg-[var(--color-panel)]">
            <div className="h-full w-[45%]" style={{ background: "var(--color-accent-strong)" }} />
          </div>
        </div>
      </div>

      <div className="mb-3 mt-10 flex items-end justify-between">
        <div>
          <h3 className="text-[22px] font-extrabold text-[var(--color-text)] md:text-[24px]">Latest Orders</h3>
          <p className="text-sm text-[var(--color-muted)]">Quick view of your most recent transactions.</p>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <span className="text-xs font-semibold text-[var(--color-muted)]">Updated live</span>
          <span className="h-2 w-2 animate-pulse rounded-full" style={{ background: "var(--color-accent-strong)" }} />
        </div>
      </div>

      <div className="surface-card w-full overflow-hidden bg-white">
        <DataGrid rows={row} columns={columns} pageSize={10} disableSelectionOnClick autoHeight className="gc_grid" />
      </div>

      <style jsx global>{`
        .gc_statusDelivered {
          color: #2f6756 !important;
          font-weight: 600 !important;
        }
        .gc_statusOther {
          color: #8b5f45 !important;
          font-weight: 600 !important;
        }

        .gc_viewBtn {
          min-width: auto !important;
          padding: 6px 10px !important;
          border-radius: 999px !important;
          background: var(--color-surface-soft) !important;
          color: var(--color-text) !important;
          border: 1px solid var(--color-border) !important;
          transition: 160ms ease !important;
        }
        .gc_viewBtn:hover {
          background: var(--color-accent-soft) !important;
        }
      `}</style>
    </div>
  );
};

export default DashboardHero;
