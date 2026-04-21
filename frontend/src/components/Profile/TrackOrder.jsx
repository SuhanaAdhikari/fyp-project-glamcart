import React, { useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { getAllOrdersOfUser } from "../../redux/actions/order"
import {
  FiPackage,
  FiTruck,
  FiMapPin,
  FiCheckCircle,
  FiRefreshCw,
} from "react-icons/fi"

const STATUS_FLOW = [
  "Processing",
  "Transferred to delivery partner",
  "Shipping",
  "Received",
  "On the way",
  "Delivered",
  "Processing refund",
  "Refund Success",
]

const STATUS_META = {
  Processing: {
    label: "Order Confirmed",
    desc: "We’ve received your order and started preparing it.",
    icon: FiPackage,
  },
  "Transferred to delivery partner": {
    label: "Assigned to Courier",
    desc: "Your order has been handed over to our delivery partner.",
    icon: FiTruck,
  },
  Shipping: {
    label: "Shipping",
    desc: "Your order is moving through our delivery network.",
    icon: FiTruck,
  },
  Received: {
    label: "Arrived in Your City",
    desc: "Your package has reached your local hub.",
    icon: FiMapPin,
  },
  "On the way": {
    label: "Out for Delivery",
    desc: "Our delivery partner is heading to your address.",
    icon: FiTruck,
  },
  Delivered: {
    label: "Delivered",
    desc: "Your order has been delivered successfully.",
    icon: FiCheckCircle,
  },
  "Processing refund": {
    label: "Refund Processing",
    desc: "We’re processing your refund request.",
    icon: FiRefreshCw,
  },
  "Refund Success": {
    label: "Refund Completed",
    desc: "Your refund has been completed successfully.",
    icon: FiCheckCircle,
  },
}

const TrackOrder = () => {
  const { orders } = useSelector((state) => state.order)
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const { id } = useParams()

  useEffect(() => {
    if (user?._id) {
      dispatch(getAllOrdersOfUser(user._id))
    }
  }, [dispatch, user?._id])

  const order = orders?.find((item) => item._id === id)

  const currentIndex = useMemo(() => {
    if (!order) return -1
    return STATUS_FLOW.indexOf(order.status)
  }, [order])

  if (!order) {
    return (
      <div className="page-shell">
        <div className="section-shell py-12">
          <div className="surface-card flex min-h-[360px] items-center justify-center text-[var(--color-muted)]">
            Order not found.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <div className="section-shell px-4 py-10">
        <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <span className="eyebrow">Order tracking</span>
          <h1 className="mt-5 text-3xl font-extrabold text-[var(--color-text)]">
            Track Your Order
          </h1>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Order ID: <span className="font-mono text-[var(--color-text)]">{order._id}</span>
          </p>
        </div>

        {/* Timeline */}
        <div className="surface-card p-8">
          <div className="space-y-8">
            {STATUS_FLOW.map((status, index) => {
              const meta = STATUS_META[status]
              if (!meta) return null

              const Icon = meta.icon
              const isCompleted = index < currentIndex
              const isActive = index === currentIndex

              return (
                <div key={status} className="flex gap-5 items-start">
                  {/* Icon */}
                  <div className="flex flex-col items-center">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full border transition-all"
                      style={
                        isCompleted || isActive
                          ? {
                              background: "var(--color-accent-strong)",
                              borderColor: "var(--color-accent-strong)",
                              color: "#ffffff",
                              boxShadow: "0 16px 30px rgba(136, 94, 74, 0.18)",
                            }
                          : {
                              background: "var(--color-surface-soft)",
                              borderColor: "var(--color-border)",
                              color: "var(--color-muted)",
                            }
                      }
                    >
                      <Icon size={20} />
                    </div>

                    {index !== STATUS_FLOW.length - 1 && (
                      <div
                        className="h-10 w-[2px]"
                        style={{
                          background: index < currentIndex ? "var(--color-accent)" : "var(--color-border)",
                        }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pt-1">
                    <h3
                      className={`font-bold ${isActive ? "text-[var(--color-text)]" : "text-[var(--color-muted)]"}`}
                    >
                      {meta.label}
                    </h3>
                    <p className="text-sm text-[var(--color-muted)]">
                      {meta.desc}
                    </p>

                    {isActive && (
                      <span className="status-chip status-chip--primary mt-2">
                        Current Status
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default TrackOrder
