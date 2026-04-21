import React from "react";

const Loader = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-[var(--color-bg)]">
      <div className="relative flex items-center justify-center w-24 h-24">
        <div className="absolute w-5 h-5 bg-[var(--color-accent)] rounded-full animate-ping" />
        <div className="absolute w-5 h-5 bg-[var(--color-accent-strong)] rounded-full animate-pulse transform rotate-45" />
        <div className="absolute w-5 h-5 bg-[var(--color-panel)] rounded-full animate-bounce transform rotate-90" />
        <div className="absolute w-5 h-5 bg-[var(--color-border)] rounded-full animate-ping transform rotate-135" />
      </div>
    </div>
  );
};

export default Loader;
