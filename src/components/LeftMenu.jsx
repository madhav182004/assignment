import { useEffect, useRef, useState } from "react";

const LeftMenu = ({ selectedObject, setTimer }) => {
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const intervalRef = useRef(null);

  // Update state when selected object changes
  useEffect(() => {
    if (selectedObject) {
      setWidth(Math.round(selectedObject.getScaledWidth()));
      setHeight(Math.round(selectedObject.getScaledHeight()));
      setStartTime(selectedObject.startTime || 0);
      setEndTime(selectedObject.endTime || 10);
    }
  }, [selectedObject]);

  // Handle timer cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Update Width/Height
  const updateSize = () => {
    if (selectedObject) {
      const scaleX = width / selectedObject.width;
      const scaleY = height / selectedObject.height;
      selectedObject.set({
        scaleX: scaleX,
        scaleY: scaleY
      });
      selectedObject.canvas.renderAll();
    }
  };

  // Update timing
  const updateTiming = () => {
    if (selectedObject) {
      selectedObject.set({
        startTime: Number(startTime),
        endTime: Number(endTime)
      });
      selectedObject.canvas.renderAll();
    }
  };

  // Start Timer
  const playTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setIsPlaying(true);
    setCurrentTime(0);
    setTimer(0);
    
    intervalRef.current = setInterval(() => {
      setCurrentTime(prev => {
        const next = prev + 1;
        if (next >= endTime) {
          clearInterval(intervalRef.current);
          setIsPlaying(false);
          return prev;
        }
        return next;
      });
      
      setTimer(prev => prev + 1);
    }, 1000);
  };

  // Reset Timer
  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setTimer(0);
  };

  return (
    <div className="w-72 p-4 bg-gray-800 text-white flex flex-col gap-4">
      <h2 className="text-lg font-bold">Media Controls</h2>

      <div className="border-b border-gray-600 pb-4">
        <h3 className="text-sm font-semibold mb-2">Size</h3>
        <div className="space-y-2">
          <div>
            <label className="block text-sm">Width:</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                onBlur={updateSize}
                className="w-full p-2 rounded bg-gray-700 text-white"
                disabled={!selectedObject}
              />
              <span className="text-sm self-center">px</span>
            </div>
          </div>

          <div>
            <label className="block text-sm">Height:</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                onBlur={updateSize}
                className="w-full p-2 rounded bg-gray-700 text-white"
                disabled={!selectedObject}
              />
              <span className="text-sm self-center">px</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-600 pb-4">
        <h3 className="text-sm font-semibold mb-2">Timing</h3>
        <div className="space-y-2">
          <div>
            <label className="block text-sm">Start Time (seconds):</label>
            <input
              type="number"
              value={startTime}
              onChange={(e) => setStartTime(Number(e.target.value))}
              onBlur={updateTiming}
              className="w-full p-2 rounded bg-gray-700 text-white"
              min="0"
              disabled={!selectedObject}
            />
          </div>

          <div>
            <label className="block text-sm">End Time (seconds):</label>
            <input
              type="number"
              value={endTime}
              onChange={(e) => setEndTime(Number(e.target.value))}
              onBlur={updateTiming}
              className="w-full p-2 rounded bg-gray-700 text-white"
              min="0"
              disabled={!selectedObject}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-center text-xl font-mono">
          {currentTime.toString().padStart(2, '0')}s
        </div>
        <div className="flex gap-2">
          <button
            onClick={playTimer}
            className="flex-1 px-4 py-2 bg-green-600 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isPlaying || !selectedObject}
          >
            Play
          </button>
          <button
            onClick={resetTimer}
            className="flex-1 px-4 py-2 bg-red-600 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!currentTime}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftMenu;
