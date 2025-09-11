"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Thermometer,
  Droplets,
  Wind,
  Activity,
  MapPin,
} from "lucide-react";

type SensorKey =
  | "field1"
  | "field2"
  | "field3"
  | "field4"
  | "field5"
  | "field6";

interface HelmetViewProps {
  latest: any;
}

export default function HelmetView({ latest }: HelmetViewProps) {
  const [selectedSensor, setSelectedSensor] = useState<SensorKey | null>(null);
  const [view, setView] = useState<"side" | "top">("top");

  const sensors: {
    key: SensorKey;
    name: string;
    unit: string;
    icon: React.ReactNode;
  }[] = [
    { key: "field1", name: "Temperature", unit: "°C", icon: <Thermometer /> },
    { key: "field2", name: "Humidity", unit: "%", icon: <Droplets /> },
    { key: "field3", name: "Gas", unit: "ppm", icon: <Wind /> },
    { key: "field4", name: "Fall", unit: "", icon: <Activity /> },
    { key: "field5", name: "Latitude", unit: "", icon: <MapPin /> },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start  p-6 text-white">
      {/* Left Panel: Helmet & Toggle */}
      <div className="flex flex-col items-center">
        {/* View Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setView("side")}
            className={`px-4 py-2 rounded ${
              view === "side" ? "bg-blue-600 text-white" : "bg-gray-700"
            }`}
          >
            Side View
          </button>
          <button
            onClick={() => setView("top")}
            className={`px-4 py-2 rounded ${
              view === "top" ? "bg-blue-600 text-white" : "bg-gray-700"
            }`}
          >
            Top View
          </button>
        </div>

        {/* Helmet SVG */}
        <div className="w-80 h-80 relative">
          {view === "side" ? (
            <SideHelmetSVG selectedSensor={selectedSensor} latest={latest} />
          ) : (
            <TopHelmetSVG selectedSensor={selectedSensor} latest={latest} />
          )}
        </div>
      </div>

      {/* Right Panel: Sensor List */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        {sensors.map((sensor) => (
          <button
            key={sensor.key}
            onClick={() => setSelectedSensor(sensor.key)}
            className={`flex items-center gap-2 p-3 rounded-lg shadow border transition ${
              selectedSensor === sensor.key
                ? "bg-yellow-200 border-yellow-400 text-gray-900"
                : "bg-gray-800 border-gray-700 text-white"
            }`}
          >
            {sensor.icon}
            <span className="font-medium">{sensor.name}</span>
            <span className="ml-auto">
              {latest[sensor.key]} {sensor.unit}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ----------------- Side View SVG ----------------- */
function SideHelmetSVG({
  selectedSensor,
  latest,
}: {
  selectedSensor: SensorKey | null;
  latest: any;
}) {
  return (
    <svg
      viewBox="0 0 200 150"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Updated Helmet Base with more curved structure */}
      <path
        d="M30,110 C50,30 150,30 170,110 C160,130 40,130 30,110 Z"
        fill="#4b5563"
        stroke="#d1d5db"
        strokeWidth="2"
      />

      {/* Temperature Zone - Adjusted to fit new structure */}
      <motion.path
        d="M60,60 C70,40 130,40 140,60 L140,80 C130,70 70,70 60,80 Z"
        fill={selectedSensor === "field1" ? "#ef4444" : "#6b7280"}
        stroke="#d1d5db"
        strokeWidth="1"
        transition={{ duration: 0.3 }}
      />

      {/* Humidity Zone - Adjusted to fit new structure */}
      <motion.path
        d="M50,80 C70,70 130,70 150,80 L150,100 C130,90 70,90 50,100 Z"
        fill={selectedSensor === "field2" ? "#3b82f6" : "#6b7280"}
        stroke="#d1d5db"
        strokeWidth="1"
        transition={{ duration: 0.3 }}
      />

      {/* Gas Zone - Adjusted to fit new structure */}
      <motion.rect
        x="90"
        y="90"
        width="20"
        height="15"
        fill={selectedSensor === "field3" ? "#fbbf24" : "#6b7280"}
        stroke="#d1d5db"
        strokeWidth="1"
        transition={{ duration: 0.3 }}
      />

      {/* Fall Alert - border glow */}
      <motion.path
        d="M30,110 C50,30 150,30 170,110 C160,130 40,130 30,110 Z"
        fill="none"
        stroke={latest.field4 === 1 ? "#ef4444" : "transparent"}
        strokeWidth="4"
        animate={
          latest.field4 === 1
            ? { scale: [1, 1.05, 1], stroke: ["#ef4444", "#ffaaaa", "#ef4444"] }
            : undefined
        }
        transition={{ duration: 0.6, repeat: latest.field4 === 1 ? Infinity : 0 }}
      />
    </svg>
  );
}

/* ----------------- Top View SVG ----------------- */
function TopHelmetSVG({
  selectedSensor,
  latest,
}: {
  selectedSensor: SensorKey | null;
  latest: any;
}) {
  return (
    <svg
      viewBox="0 0 150 150"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Updated Helmet Base with more rounded top */}
      <ellipse
        cx="75"
        cy="70"
        rx="50"
        ry="35"
        fill="#4b5563"
        stroke="#d1d5db"
        strokeWidth="2"
      />

      {/* Temperature Zone - Adjusted to fit new structure */}
      <motion.ellipse
        cx="75"
        cy="50"
        rx="20"
        ry="8"
        fill={selectedSensor === "field1" ? "#ef4444" : "#6b7280"}
        stroke="#d1d5db"
        strokeWidth="1"
        transition={{ duration: 0.3 }}
      />

      {/* Humidity Zone - Adjusted to fit new structure */}
      <motion.ellipse
        cx="75"
        cy="70"
        rx="20"
        ry="8"
        fill={selectedSensor === "field2" ? "#3b82f6" : "#6b7280"}
        stroke="#d1d5db"
        strokeWidth="1"
        transition={{ duration: 0.3 }}
      />

      {/* Gas Zone - Adjusted to fit new structure */}
      <motion.ellipse
        cx="75"
        cy="90"
        rx="20"
        ry="8"
        fill={selectedSensor === "field3" ? "#fbbf24" : "#6b7280"}
        stroke="#d1d5db"
        strokeWidth="1"
        transition={{ duration: 0.3 }}
      />

      {/* Fall Alert - border glow */}
      <motion.ellipse
        cx="75"
        cy="70"
        rx="50"
        ry="35"
        fill="none"
        stroke={latest.field4 === 1 ? "#ef4444" : "transparent"}
        strokeWidth="4"
        animate={
          latest.field4 === 1
            ? { scale: [1, 1.05, 1], stroke: ["#ef4444", "#ffaaaa", "#ef4444"] }
            : undefined
        }
        transition={{ duration: 0.6, repeat: latest.field4 === 1 ? Infinity : 0 }}
      />
    </svg>
  );
}