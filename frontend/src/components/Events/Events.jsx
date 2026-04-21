import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import EventCard from "./EventCard";

const Events = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);

  if (isLoading) {
    return (
      <section className="section-shell py-14">
        <div className="section-frame">
          <div className="surface-card p-8 text-center text-[#6b7280]">Loading events...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-shell py-14">
      <div className="section-frame">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <span className="eyebrow">Offers</span>
            <h2 className="section-heading mt-4">Current event deals</h2>
            <p className="section-copy mt-3 max-w-2xl">
              Time-based offers stay focused in one main card, now with fuller spacing so the section feels less compressed.
            </p>
          </div>

          <Link to="/events" className="btn-secondary w-fit">
            View event page
          </Link>
        </div>

        <div className="mt-8">
          {allEvents?.length ? (
            <EventCard data={allEvents[0]} />
          ) : (
            <div className="surface-card p-10 text-center">
              <h3 className="text-xl font-semibold text-[#1f2937]">No live events</h3>
              <p className="mt-3 text-[#6b7280]">New offers will appear here when they are published.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Events;
