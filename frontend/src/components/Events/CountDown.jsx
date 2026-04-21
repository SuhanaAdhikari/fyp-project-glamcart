import React, { useEffect, useState } from "react";

const getTimeLeft = (finishDate) => {
  if (!finishDate) return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };

  const difference = new Date(finishDate) - new Date();

  if (difference <= 0) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    total: difference,
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

const CountDown = ({ data, onTimeUpChange }) => {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(data?.Finish_Date));

  useEffect(() => {
    const updateTime = () => {
      const nextValue = getTimeLeft(data?.Finish_Date);
      setTimeLeft(nextValue);
      if (onTimeUpChange) onTimeUpChange(nextValue.total <= 0);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [data?.Finish_Date, onTimeUpChange]);

  if (timeLeft.total <= 0) {
    return <span className="text-sm font-semibold text-[#b91c1c]">Offer ended</span>;
  }

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {units.map((unit) => (
        <div key={unit.label} className="surface-card-sm bg-white p-3 text-center">
          <p className="text-lg font-bold text-[#1f2937]">{unit.value}</p>
          <p className="text-xs uppercase tracking-[0.2em] text-[#6b7280]">{unit.label}</p>
        </div>
      ))}
    </div>
  );
};

export default CountDown;
