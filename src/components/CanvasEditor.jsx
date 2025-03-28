import { useEffect, useRef, useState } from "react";

const CanvasEditor = ({ onSelectObject, selectedObject, timer }) => {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);
  const [videoElements, setVideoElements] = useState([]);

  // Initialize fabric after first render
  useEffect(() => {
    const initCanvas = async () => {
      const canvas = canvasRef.current;
      if (!canvas || !window.fabric) return;

      // Set initial canvas size
      canvas.width = 800;
      canvas.height = 600;

      try {
        // Initialize fabric canvas
        const fabricCanvas = new window.fabric.Canvas(canvas, {
          width: 800,
          height: 600,
          backgroundColor: '#ffffff',
          preserveObjectStacking: true
        });
        
        // Enable object movement
        fabricCanvas.on("object:moving", (e) => {
          const obj = e.target;
          onSelectObject(obj);
        });

        // Enable object scaling
        fabricCanvas.on("object:scaling", (e) => {
          const obj = e.target;
          onSelectObject(obj);
        });

        fabricCanvas.on("selection:created", (e) => {
          onSelectObject(e.selected[0]);
        });

        fabricCanvas.on("selection:cleared", () => {
          onSelectObject(null);
        });

        setFabricCanvas(fabricCanvas);
      } catch (error) {
        console.error("Failed to initialize Fabric.js:", error);
      }
    };

    // Wait for fabric to be available
    if (window.fabric) {
      initCanvas();
    } else {
      // If fabric isn't loaded yet, wait a bit and try again
      const timer = setTimeout(initCanvas, 100);
      return () => clearTimeout(timer);
    }

    return () => {
      if (fabricCanvas) {
        fabricCanvas.dispose();
      }
      // Cleanup video elements and object URLs
      videoElements.forEach(video => {
        if (video.src) {
          URL.revokeObjectURL(video.src);
        }
      });
    };
  }, []);

  // Apply width/height changes
  useEffect(() => {
    if (selectedObject && fabricCanvas) {
      fabricCanvas.renderAll();
    }
  }, [selectedObject, fabricCanvas]);

  // Apply visibility based on timer
  useEffect(() => {
    if (fabricCanvas) {
      fabricCanvas.getObjects().forEach(obj => {
        const startTime = obj.startTime || 0;
        const endTime = obj.endTime || 10;
        obj.set("visible", timer >= startTime && timer <= endTime);
      });
      fabricCanvas.renderAll();
    }
  }, [timer]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !window.fabric || !fabricCanvas) return;

    if (file.type.startsWith('image/')) {
      // Handle image upload using FileReader
      const reader = new FileReader();
      reader.onload = (event) => {
        window.fabric.Image.fromURL(event.target.result, (img) => {
          // Calculate dimensions to fit within canvas while maintaining aspect ratio
          const maxWidth = 400;  // Max width we want to allow
          const maxHeight = 300; // Max height we want to allow
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            const ratio = maxWidth / width;
            width = maxWidth;
            height = height * ratio;
          }
          
          if (height > maxHeight) {
            const ratio = maxHeight / height;
            height = maxHeight;
            width = width * ratio;
          }

          img.set({
            left: (fabricCanvas.width - width) / 2,
            top: (fabricCanvas.height - height) / 2,
            scaleX: width / img.width,
            scaleY: height / img.height,
            startTime: 0,
            endTime: 10
          });
          
          fabricCanvas.add(img);
          fabricCanvas.setActiveObject(img);
          onSelectObject(img);
          fabricCanvas.renderAll();
        });
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('video/')) {
      // Handle video upload using object URL
      const objectUrl = URL.createObjectURL(file);
      const videoElement = document.createElement('video');
      videoElement.crossOrigin = "anonymous";
      
      videoElement.onloadedmetadata = () => {
        // Calculate dimensions to fit within canvas while maintaining aspect ratio
        const maxWidth = 400;  // Max width we want to allow
        const maxHeight = 300; // Max height we want to allow
        let width = videoElement.videoWidth;
        let height = videoElement.videoHeight;
        
        if (width > maxWidth) {
          const ratio = maxWidth / width;
          width = maxWidth;
          height = height * ratio;
        }
        
        if (height > maxHeight) {
          const ratio = maxHeight / height;
          height = maxHeight;
          width = width * ratio;
        }

        const fabricVideo = new window.fabric.Image(videoElement, {
          left: (fabricCanvas.width - width) / 2,
          top: (fabricCanvas.height - height) / 2,
          scaleX: width / videoElement.videoWidth,
          scaleY: height / videoElement.videoHeight,
          startTime: 0,
          endTime: 10,
          objectCaching: false
        });
        
        fabricCanvas.add(fabricVideo);
        fabricCanvas.setActiveObject(fabricVideo);
        onSelectObject(fabricVideo);
        fabricCanvas.renderAll();

        // Ensure video keeps playing
        fabricCanvas.on('after:render', () => {
          fabricCanvas.contextContainer.drawImage(videoElement, 
            fabricVideo.left, 
            fabricVideo.top, 
            width, 
            height
          );
        });
      };

      videoElement.src = objectUrl;
      videoElement.autoplay = true;
      videoElement.loop = true;
      videoElement.muted = true; // Mute to allow autoplay
      videoElement.play().catch(console.error);
      
      // Add to video elements array for cleanup
      setVideoElements(prev => [...prev, videoElement]);
    }
  };

  return (
    <div className="relative">
      <div className="mb-4 flex gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*,video/*"
          className="hidden"
        />
        <button 
          onClick={() => fileInputRef.current.click()} 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Upload Media
        </button>
      </div>
      <div className="border border-gray-300 bg-white inline-block">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default CanvasEditor;
