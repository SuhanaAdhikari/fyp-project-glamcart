import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { server } from "../../server";

const CountDown = ({ data }) => {
  const [timeLeft, setTimeLeft] = useState({});
  const [isDeleted, setIsDeleted] = useState(false);

  const calculateTimeLeft = useCallback(() => {
    if (!data?.Finish_Date) return { total: 0 };
    const difference = new Date(data.Finish_Date) - new Date();

    return {
      total: difference,
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }, [data?.Finish_Date]);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const updatedTimeLeft = calculateTimeLeft();
      setTimeLeft(updatedTimeLeft);

      if (updatedTimeLeft.total <= 0 && !isDeleted) {
        axios
          .delete(`${server}/event/delete-shop-event/${data._id}`)
          .then(() => {
            console.log("Event deleted successfully.");
            setIsDeleted(true);
          })
          .catch((err) => {
            console.error("Error deleting event:", err.response?.data || err.message);
            setIsDeleted(true); // Prevent retry loop
          });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [data._id, isDeleted, calculateTimeLeft]);

  const timerComponents = Object.entries(timeLeft)
    .filter(([key, value]) => key !== "total" && value >= 0)
    .map(([key, value]) => (
      <span key={key} className="text-[25px] text-[#475ad2]">
        {value} {key}{" "}
      </span>
    ));

  return (
    <div>
      {timeLeft.total > 0 ? (
        timerComponents
      ) : (
        <span className="text-red-500 text-[25px]">Time's Up</span>
      )}
    </div>
  );
};

export default CountDown;
