import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useParams } from "react-router-dom"
import { getAllProductsShop } from "../../redux/actions/product"
import ProductCard from "../Route/ProductCard/ProductCard"
import Ratings from "../Products/Ratings"
import { getAllEventsShop } from "../../redux/actions/event"
import { FiPackage, FiCalendar, FiStar, FiGrid, FiRefreshCcw } from "react-icons/fi"

const ShopProfileData = ({ isOwner }) => {
  const { products } = useSelector((state) => state.products)
  const { events } = useSelector((state) => state.events)
  const { id } = useParams()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    Promise.all([dispatch(getAllProductsShop(id)), dispatch(getAllEventsShop(id))]).then(() => {
      setIsLoading(false)
    })
  }, [dispatch, id])

  const [active, setActive] = useState(1)
  const allReviews = products && products.flatMap((product) => product.reviews)

  const tabs = [
    { id: 1, name: "Shop Products", icon: <FiPackage /> },
    { id: 2, name: "Running Events", icon: <FiCalendar /> },
    { id: 3, name: "Shop Reviews", icon: <FiStar /> },
  ]

  const refresh = () => {
    setIsLoading(true)
    Promise.all([dispatch(getAllProductsShop(id)), dispatch(getAllEventsShop(id))]).then(() => {
      setIsLoading(false)
    })
  }

  return (
    <div className="w-full">
      {/* GlamCart5 Header + Tabs */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="h-[6px] w-full gc5_topBar" />

        <div className="p-4 md:p-6 relative">
          <div className="gc5_glow" />

          <div className="relative flex flex-col gap-4">
            {/* Top Row */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-2">
                  <span className="gc5_dot" />
                  <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Shop</p>
                </div>
                <h2 className="mt-1 text-2xl md:text-3xl font-extrabold text-gray-900">Shop Profile</h2>
                <p className="text-sm text-gray-600 mt-1">Browse products, events, and reviews.</p>
              </div>

              <div className="flex items-center gap-2">
                <button type="button" onClick={refresh} className="gc5_btn" title="Refresh">
                  <FiRefreshCcw />
                  <span className="hidden sm:inline">Refresh</span>
                </button>

                {isOwner && (
                  <Link to="/dashboard" className="gc5_btnPrimary" title="Go Dashboard">
                    <FiGrid />
                    <span>Go Dashboard</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const isActive = active === tab.id
                const count =
                  tab.id === 1
                    ? products?.length || 0
                    : tab.id === 2
                      ? events?.length || 0
                      : allReviews?.length || 0

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActive(tab.id)}
                    className={`gc5_tab ${isActive ? "gc5_tabActive" : ""}`}
                  >
                    <span className={`gc5_tabIcon ${isActive ? "gc5_tabIconActive" : ""}`}>{tab.icon}</span>
                    <span className="gc5_tabText">{tab.name}</span>
                    <span className={`gc5_tabCount ${isActive ? "gc5_tabCountActive" : ""}`}>{count}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6">
        {isLoading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
            </div>
            <p className="text-sm font-semibold text-gray-700">Loading shop data...</p>
          </div>
        ) : (
          <>
            {/* Products */}
            {active === 1 && (
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="p-4 md:p-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products && products.length > 0 ? (
                      products.map((i, index) => (
                        <div key={index} className="transform hover:-translate-y-1 transition-transform duration-300">
                          <ProductCard data={i} isShop={true} />
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <FiPackage className="text-gray-700 text-2xl" />
                        </div>
                        <h3 className="text-lg font-extrabold text-gray-900">No Products Available</h3>
                        <p className="text-sm text-gray-600 mt-1">This shop hasn&apos;t added any products yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Events */}
            {active === 2 && (
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="p-4 md:p-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {events && events.length > 0 ? (
                      events.map((i, index) => (
                        <div key={index} className="transform hover:-translate-y-1 transition-transform duration-300">
                          <ProductCard data={i} isShop={true} isEvent={true} />
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <FiCalendar className="text-gray-700 text-2xl" />
                        </div>
                        <h3 className="text-lg font-extrabold text-gray-900">No Events Available</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          This shop doesn&apos;t have any running events at the moment.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Reviews */}
            {active === 3 && (
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="p-4 md:p-6">
                  {allReviews && allReviews.length > 0 ? (
                    <div className="space-y-4">
                      {allReviews.map((item, index) => (
                        <div key={index} className="gc5_reviewCard">
                          <img
                            src={`${item.user.avatar?.url || "/placeholder.svg?height=100&width=100&query=user"}`}
                            className="gc5_reviewAvatar"
                            alt={item.user.name}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 flex-wrap">
                              <h1 className="font-extrabold text-gray-900 truncate">{item.user.name}</h1>
                              <div className="shrink-0">
                                <Ratings rating={item.rating} />
                              </div>
                            </div>

                            <div className="gc5_reviewBubble">
                              <p className="text-sm font-semibold text-gray-800 break-words">{item?.comment}</p>
                            </div>

                            <p className="text-xs font-semibold text-gray-500 mt-2">2 days ago</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <FiStar className="text-gray-700 text-2xl" />
                      </div>
                      <h3 className="text-lg font-extrabold text-gray-900">No Reviews Yet</h3>
                      <p className="text-sm text-gray-600 mt-1">This shop hasn&apos;t received any reviews yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* GlamCart5 CSS */}
      <style jsx global>{`
        .gc5_topBar {
          background: linear-gradient(90deg, #ec4899, #a855f7, #7c3aed);
        }

        .gc5_glow {
          position: absolute;
          inset: -60px;
          background: radial-gradient(circle at 18% 24%, rgba(236, 72, 153, 0.16), transparent 45%),
            radial-gradient(circle at 72% 18%, rgba(168, 85, 247, 0.16), transparent 45%),
            radial-gradient(circle at 60% 85%, rgba(124, 58, 237, 0.12), transparent 45%);
          pointer-events: none;
        }

        .gc5_dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: linear-gradient(90deg, #ec4899, #a855f7);
          box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.12);
          display: inline-block;
        }

        .gc5_btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          border-radius: 14px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          background: #fff;
          font-weight: 900;
          color: #111827;
          box-shadow: 0 10px 20px rgba(17, 24, 39, 0.08);
          transition: 160ms ease;
        }
        .gc5_btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 14px 28px rgba(17, 24, 39, 0.12);
        }

        .gc5_btnPrimary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 16px;
          font-weight: 900;
          color: #fff;
          background: linear-gradient(90deg, #ec4899, #a855f7, #7c3aed);
          box-shadow: 0 18px 30px rgba(17, 24, 39, 0.16);
          border: 1px solid rgba(255, 255, 255, 0.25);
          transition: 160ms ease;
          white-space: nowrap;
        }
        .gc5_btnPrimary:hover {
          transform: translateY(-1px);
          box-shadow: 0 22px 40px rgba(17, 24, 39, 0.2);
        }

        .gc5_tab {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 16px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          background: #fff;
          color: #111827;
          font-weight: 900;
          transition: 160ms ease;
        }
        .gc5_tab:hover {
          transform: translateY(-1px);
          box-shadow: 0 14px 28px rgba(17, 24, 39, 0.1);
        }
        .gc5_tabActive {
          background: linear-gradient(
            90deg,
            rgba(236, 72, 153, 0.1),
            rgba(168, 85, 247, 0.1),
            rgba(124, 58, 237, 0.08)
          );
          border-color: rgba(168, 85, 247, 0.35);
          box-shadow: 0 16px 30px rgba(17, 24, 39, 0.12);
        }

        .gc5_tabIcon {
          width: 34px;
          height: 34px;
          border-radius: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(17, 24, 39, 0.06);
          color: #111827;
        }
        .gc5_tabIconActive {
          background: linear-gradient(90deg, rgba(236, 72, 153, 0.18), rgba(168, 85, 247, 0.18));
          color: #111827;
        }

        .gc5_tabText {
          font-size: 14px;
          line-height: 1;
        }

        .gc5_tabCount {
          margin-left: 2px;
          font-size: 12px;
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(17, 24, 39, 0.06);
          border: 1px solid rgba(0, 0, 0, 0.06);
          line-height: 1;
        }
        .gc5_tabCountActive {
          background: linear-gradient(90deg, rgba(236, 72, 153, 0.16), rgba(168, 85, 247, 0.16));
          border-color: rgba(168, 85, 247, 0.25);
        }

        .gc5_reviewCard {
          display: flex;
          gap: 14px;
          padding: 14px;
          border-radius: 18px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          background: linear-gradient(
            90deg,
            rgba(236, 72, 153, 0.05),
            rgba(168, 85, 247, 0.05),
            rgba(124, 58, 237, 0.04)
          );
          box-shadow: 0 12px 26px rgba(17, 24, 39, 0.08);
        }

        .gc5_reviewAvatar {
          width: 58px;
          height: 58px;
          border-radius: 999px;
          object-fit: cover;
          border: 2px solid rgba(0, 0, 0, 0.06);
          box-shadow: 0 10px 18px rgba(17, 24, 39, 0.12);
        }

        .gc5_reviewBubble {
          margin-top: 10px;
          border-radius: 16px;
          padding: 10px 12px;
          background: #fff;
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 10px 18px rgba(17, 24, 39, 0.06);
        }
      `}</style>
    </div>
  )
}

export default ShopProfileData
