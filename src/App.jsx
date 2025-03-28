import { useState } from "react";
import CanvasEditor from "./components/CanvasEditor";
import LeftMenu from "./components/LeftMenu";

function App() {
  const [selectedObject, setSelectedObject] = useState(null);
  const [timer, setTimer] = useState(0);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <LeftMenu selectedObject={selectedObject} setTimer={setTimer} />
      <div className="flex-1 p-4">
        <CanvasEditor onSelectObject={setSelectedObject} selectedObject={selectedObject} timer={timer} />
      </div>
    </div>
  );
}

export default App;
