import React from "react";

const Timer = ({ timer, setTimer, isPlaying, setIsPlaying }) => {
  return (
    <div className="p-4 bg-gray-200 shadow-md text-center">
      <p className="text-lg font-semibold">Timer: {timer}s</p>
      <div className="mt-2 flex gap-2 justify-center">
        <button className="px-3 py-1 bg-green-500 text-white rounded" onClick={() => setIsPlaying(true)}>
          Play
        </button>
        <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => setIsPlaying(false)}>
          Pause
        </button>
      </div>
    </div>
  );
};

export default Timer;
