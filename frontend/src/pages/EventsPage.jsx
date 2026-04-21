import React from "react";
import { useSelector } from "react-redux";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import Loader from "../components/Layout/Loader";
import EventCard from "../components/Events/EventCard";

const EventsPage = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);

  if (isLoading) return <Loader />;

  return (
    <div className="page-shell">
      <Header activeHeading={4} />
      <section className="section-shell py-10">
        <div className="flex flex-col gap-2">
          <h1 className="section-heading">Offers and events</h1>
          <p className="section-copy">See the current time-limited promotions in one simple layout.</p>
        </div>

        <div className="mt-8">
          {allEvents?.length ? (
            <EventCard data={allEvents[0]} />
          ) : (
            <div className="surface-card p-10 text-center text-[#6b7280]">No events are available right now.</div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default EventsPage;
