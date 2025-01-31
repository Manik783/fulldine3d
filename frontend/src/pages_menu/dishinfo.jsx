import { useState } from "react";
import { Camera } from "lucide-react";

export default function dishinfo() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="max-w-2xl mx-auto p-5 font-sans">
      <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
        {/* Image Container */}
        <div className="relative">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-26%20at%2011.50.32%E2%80%AFPM-EqGdaY5CQYXlhIS7ieR3nZZ77tnWJ2.png"
            alt="Paneer Paratha with rice and curry"
            className="w-full h-[300px] object-cover"
          />

          {/* Button Container */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between gap-3">
            <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg hover:-translate-y-0.5 transition-transform duration-200">
              <Camera className="w-4 h-4 text-red-500" />
              <span className="text-red-500 font-medium">View in AR</span>
            </button>
            <button className="bg-white px-4 py-2 rounded-full shadow-lg text-red-500 font-medium hover:-translate-y-0.5 transition-transform duration-200">
              3D
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          {/* Veg Indicator */}
          <div className="text-green-600">●</div>

          {/* Title */}
          <h2 className="text-2xl font-semibold">Paneer Paratha</h2>

          {/* Price and Serves */}
          <div className="flex gap-4">
            <p className="text-lg font-semibold">₹ 150</p>
            <p className="text-gray-600">Serves 2</p>
          </div>

          {/* Description */}
          <p className="text-gray-700 leading-relaxed">
            Lorem ipsum odor amet, consectetuer adipiscing elit. Gravida turpis
            consequat diam enim enim non facilisi. Magna quisque tortor ac id
            pulvinar, etiam placerat magna
            {!isExpanded && (
              <button
                className="text-red-500 ml-1 hover:underline focus:outline-none"
                onClick={() => setIsExpanded(true)}
              >
                ...Read more
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
