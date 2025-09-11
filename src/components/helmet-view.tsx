"use client";

import { motion } from "framer-motion";

export default function HelmetView({ latest }: { latest: any }) {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      {/* Helmet Shape (SVG Simplified) */}
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        className="w-64 h-64"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Helmet base */}
        <motion.ellipse
          cx="100"
          cy="100"
          rx="80"
          ry="60"
          fill="#facc15"
          stroke="#374151"
          strokeWidth="4"
          animate={{
            scale: latest.field4 === 1 ? [1, 1.05, 1] : 1, // pulse if fall
          }}
          transition={{ repeat: Infinity, duration: 1 }}
        />

        {/* Gas sensor glow (front) */}
        <motion.circle
          cx="100"
          cy="130"
          r="15"
          fill="rgba(234,179,8,0.6)"
          animate={{
            opacity: latest.field3 > 2000 ? [0.5, 1, 0.5] : 0.2,
            scale: latest.field3 > 2000 ? [1, 1.3, 1] : 1,
          }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />

        {/* GPS indicator (side) */}
        <motion.circle
          cx="170"
          cy="100"
          r="8"
          fill="#3b82f6"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      </motion.svg>

      {/* Live Values Below Helmet */}
      <div className="mt-6 grid grid-cols-2 gap-4 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-md">
          <p className="text-sm text-gray-500">Temp</p>
          <p className="text-xl font-bold text-red-500">{latest.field1} °C</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-md">
          <p className="text-sm text-gray-500">Humidity</p>
          <p className="text-xl font-bold text-blue-500">{latest.field2} %</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-md">
          <p className="text-sm text-gray-500">Gas</p>
          <p className="text-xl font-bold text-yellow-500">{latest.field3}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-md">
          <p className="text-sm text-gray-500">Fall</p>
          <p
            className={`text-xl font-bold ${
              latest.field4 === 1 ? "text-red-600" : "text-green-600"
            }`}
          >
            {latest.field4 === 1 ? "⚠️ FALL" : "Safe"}
          </p>
        </div>
      </div>
    </div>
  );
}
