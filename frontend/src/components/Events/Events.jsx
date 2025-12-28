import React from "react"
import { useSelector } from "react-redux"
import styles from "../../styles/styles"
import EventCard from "./EventCard"

const Events = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events)

  if (isLoading) {
    return (
      <div className="min-h-[50vh] bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-[3px] border-gray-200 border-t-[#1a2240] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <section className="py-14 relative">
      {/* subtle background like GlamCart (not too bright) */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-pink-50 via-white to-violet-50" />

      <div className={`${styles.section}`}>
        {/* ================= Header (New, premium) ================= */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-pink-500 to-violet-600" />
              <span className="text-xs md:text-sm font-semibold text-gray-800 tracking-wide">Limited Drops</span>
            </div>

            <h1 className="mt-4 text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              Popular Events
            </h1>

            <p className="mt-2 text-sm md:text-base text-gray-600 max-w-[700px]">
              Don&apos;t miss exclusive offers and limited-time deals — curated drops updated regularly.
            </p>
          </div>

          {/* right info chip */}
          <div className="w-full md:w-[360px]">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900">Event Status</p>
                <span className="text-xs font-semibold text-gray-500">
                  {allEvents?.length ? `${allEvents.length} live` : "No live events"}
                </span>
              </div>

              <div className="mt-3 h-[3px] w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r from-pink-500 to-violet-600 ${
                    allEvents?.length ? "w-[72%]" : "w-[22%]"
                  }`}
                />
              </div>

              <p className="mt-3 text-xs text-gray-500">
                Tip: Open an event to see discounts & timing.
              </p>
            </div>
          </div>
        </div>

        {/* ================= Content Container (New layout) ================= */}
        <div className="relative">
          {/* outer glass frame */}
          <div className="absolute inset-0 rounded-[28px] bg-white/60 backdrop-blur-md border border-gray-200" />
          <div className="relative rounded-[28px] p-4 sm:p-6">
            {allEvents && allEvents.length > 0 ? (
              <div className="space-y-8">
                {/* Featured */}
                <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
                  <div className="h-[5px] w-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-600" />
                  <div className="p-4 sm:p-6">
                    <EventCard data={allEvents[0]} />
                  </div>
                </div>

                {/* More events (if you later want list below, it will fit same theme) */}
                {/* Example placeholder: */}
                {/* <div className="grid md:grid-cols-2 gap-6">
                  {allEvents.slice(1, 5).map((e) => (
                    <div key={e._id} className="rounded-2xl bg-white border border-gray-200 shadow-sm p-4">
                      <EventCard data={e} />
                    </div>
                  ))}
                </div> */}
              </div>
            ) : (
              <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-10 text-center">
                <div className="w-16 h-16 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>

                <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-2">
                  No Events Available
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  We&apos;re preparing new drops and exclusive offers. Check back soon.
                </p>

                <button className="mt-6 px-6 py-3 rounded-xl font-semibold text-white bg-[#1a2240] hover:bg-black transition-colors">
                  Notify Me About Events
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Events
