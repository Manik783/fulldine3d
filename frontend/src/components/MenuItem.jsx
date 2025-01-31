import { useState, useRef } from "react";
import "@google/model-viewer/dist/model-viewer";

const MenuItem = ({ item }) => {
  const [isModelVisible, setIsModelVisible] = useState(false);
  const modelViewerRef = useRef(null);

  const loadAR = () => {
    if (modelViewerRef.current) {
      setIsModelVisible(true);
      modelViewerRef.current.activateAR();
    }
  };

  const load3D = () => {
    setIsModelVisible(true);
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mb-6 p-4">
      <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden mb-4">
        {!isModelVisible ? (
          <img
            src={item.staticImage}
            alt={`${item.name} preview`}
            className="w-full h-full object-cover"
          />
        ) : (
          <model-viewer
            ref={modelViewerRef}
            src={item.glbModel}
            ios-src={item.usdzModel}
            ar
            ar-modes="scene-viewer quick-look"
            camera-controls
            alt={`A 3D model of ${item.name}`}
            className="w-full h-full"
          />
        )}
      </div>

      <div className="flex space-x-4 mb-4">
        <button
          onClick={loadAR}
          className="flex-1 bg-brand-red text-white py-2 rounded-full hover:bg-red-600 transition"
        >
          View on Your Table
        </button>
        <button
          onClick={load3D}
          className="flex-1 bg-brand-red text-white py-2 rounded-full hover:bg-red-600 transition"
        >
          3D
        </button>
      </div>

      <div className="text-left">
        <h2 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h2>
        <p className="text-lg font-semibold text-gray-900 mb-2">
          Rs. {item.price}
        </p>
        <p className="text-sm text-gray-600 mb-2">{item.servingInfo}</p>
        <p className="text-gray-700 mb-2">{item.description}</p>
        <span className="text-brand-red cursor-pointer">Read More</span>
      </div>
    </div>
  );
};

export default MenuItem;
