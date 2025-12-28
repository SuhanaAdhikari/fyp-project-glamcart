import React from "react";

const Loader = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-white">
      <div className="relative flex items-center justify-center w-24 h-24">
        <div className="absolute w-5 h-5 bg-blue-500 rounded-full animate-ping" />
        <div className="absolute w-5 h-5 bg-purple-500 rounded-full animate-pulse transform rotate-45" />
        <div className="absolute w-5 h-5 bg-teal-400 rounded-full animate-bounce transform rotate-90" />
        <div className="absolute w-5 h-5 bg-pink-500 rounded-full animate-ping transform rotate-135" />
      </div>
    </div>
  );
};

export default Loader;
