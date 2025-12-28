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
      <div className="min-h-[70vh] flex items-center justify-center text-[#6b6f86]">
        Order not found.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff7fb] via-white to-[#f6f7ff] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-[#14152b]">
            Track Your Order
          </h1>
          <p className="text-sm text-[#6b6f86] mt-2">
            Order ID: <span className="font-mono">{order._id}</span>
          </p>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(20,21,43,0.10)] border border-[#edf0ff] p-8">
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
                      className={[
                        "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isActive
                          ? "bg-gradient-to-r from-[#ff5aa5] to-[#7b61ff] text-white shadow-lg"
                          : "bg-[#f0f2ff] text-[#9aa0c3]",
                      ].join(" ")}
                    >
                      <Icon size={20} />
                    </div>

                    {index !== STATUS_FLOW.length - 1 && (
                      <div
                        className={`w-[2px] h-10 ${
                          index < currentIndex
                            ? "bg-green-400"
                            : "bg-[#e8e9ff]"
                        }`}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pt-1">
                    <h3
                      className={`font-bold ${
                        isActive
                          ? "text-[#14152b]"
                          : "text-[#6b6f86]"
                      }`}
                    >
                      {meta.label}
                    </h3>
                    <p className="text-sm text-[#6b6f86]">
                      {meta.desc}
                    </p>

                    {isActive && (
                      <span className="inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full bg-[#fff1f4] text-[#d23a56]">
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
  )
}

export default TrackOrder
