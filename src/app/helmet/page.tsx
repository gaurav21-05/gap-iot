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
  alerts: { fall: string | null; gas: string | null };
}

// Helper function to validate sensor data for disaster conditions
const validateDisasterConditions = (field: SensorKey, value: any, prevData: any = {}) => {
  if (value === null || value === undefined) {
    return "⚠️ Missing sensor data - potential system failure";
  }

  const numValue = parseFloat(value);
  if (isNaN(numValue) && field !== "field4") {
    return "⚠️ Invalid sensor data (non-numeric) - check device";
  }

  switch (field) {
    case "field1": // Temperature (°C)
      if (numValue > 50) {
        return "🚨 High temperature detected (>50°C) - possible fire hazard";
      } else if (numValue < -20) {
        return "🚨 Low temperature detected (<-20°C) - freezing hazard";
      }
      break;
    case "field2": // Humidity (%)
      if (numValue < 10) {
        return "🚨 Low humidity detected (<10%) - increased fire risk";
      } else if (numValue > 90) {
        return "🚨 High humidity detected (>90%) - flood/mold risk";
      }
      break;
    case "field3": // Gas (ppm)
      if (numValue > 2000) {
        return "🚨 Critical gas level detected (>2000 ppm) - possible gas leak";
      } else if (numValue < 0) {
        return "⚠️ Invalid gas reading (<0 ppm) - sensor error";
      }
      break;
    case "field4": // Fall Detection
      if (value === "1") {
        return "🚨 Fall detected - immediate emergency response required";
      } else if (value !== "0" && value !== "1") {
        return "⚠️ Invalid fall detection value - check sensor";
      }
      break;
    case "field5": // Latitude
      if (numValue < -90 || numValue > 90) {
        return "⚠️ Invalid latitude - check GPS sensor";
      }
      if (prevData.field5 && Math.abs(numValue - parseFloat(prevData.field5)) > 0.1) {
        return "🚨 Significant location change detected - possible displacement";
      }
      break;
    case "field6": // Longitude
      if (numValue < -180 || numValue > 180) {
        return "⚠️ Invalid longitude - check GPS sensor";
      }
      if (prevData.field6 && Math.abs(numValue - parseFloat(prevData.field6)) > 0.1) {
        return "🚨 Significant location change detected - possible displacement";
      }
      break;
    default:
      return null;
  }
  return null;
};

export default function HelmetView({ latest = {}, alerts = { fall: null, gas: null } }: HelmetViewProps) {
  const [selectedSensor, setSelectedSensor] = useState<SensorKey | null>(null);
  const [view, setView] = useState<"side" | "top">("top");

  const sensors: {
    key: SensorKey;
    name: string;
    unit: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    { key: "field1", name: "Temperature", unit: "°C", icon: <Thermometer />, color: "#ef4444" },
    { key: "field2", name: "Humidity", unit: "%", icon: <Droplets />, color: "#3b82f6" },
    { key: "field3", name: "Gas", unit: "ppm", icon: <Wind />, color: "#fbbf24" },
    { key: "field4", name: "Fall", unit: "", icon: <Activity />, color: "#f59e0b" },
    { key: "field5", name: "Latitude", unit: "", icon: <MapPin />, color: "#10b981" },
    { key: "field6", name: "Longitude", unit: "", icon: <MapPin />, color: "#8b5cf6" },
  ];

  // Check for critical alerts
  const hasCriticalAlert = alerts.fall || alerts.gas;

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start p-6 text-white">
      {/* Critical Alert Banner */}
      {hasCriticalAlert && (
        <div className="w-full p-4 bg-red-600 text-white rounded mb-4 animate-pulse">
          {alerts.fall || alerts.gas || "🚨 Critical disaster detected - immediate action required"}
        </div>
      )}

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
        {sensors.map((sensor) => {
          const alertMessage = validateDisasterConditions(sensor.key, latest[sensor.key]);
          return (
            <button
              key={sensor.key}
              onClick={() => setSelectedSensor(sensor.key)}
              className={`flex flex-col items-start gap-2 p-3 rounded-lg shadow border transition ${
                selectedSensor === sensor.key
                  ? "bg-yellow-200 border-yellow-400 text-gray-900"
                  : alertMessage
                  ? "bg-red-100 border-red-400 text-red-900"
                  : "bg-gray-800 border-gray-700 text-white"
              }`}
            >
              <div className="flex items-center gap-2 w-full">
                {sensor.icon}
                <span className="font-medium">{sensor.name}</span>
                <span className="ml-auto">
                  {latest[sensor.key] ? `${latest[sensor.key]} ${sensor.unit}` : "N/A"}
                </span>
              </div>
              {alertMessage && (
                <span className="text-sm text-red-600">{alertMessage}</span>
              )}
            </button>
          );
        })}
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
  const getFillColor = (key: SensorKey) => {
    const alert = validateDisasterConditions(key, latest[key]);
    if (alert) return "#ef4444"; // Red for disaster
    return selectedSensor === key ? sensors.find(s => s.key === key)?.color || "#6b7280" : "#6b7280";
  };

  const sensors = [
    { key: "field1", color: "#ef4444" },
    { key: "field2", color: "#3b82f6" },
    { key: "field3", color: "#fbbf24" },
    { key: "field4", color: "#f59e0b" },
    { key: "field5", color: "#10b981" },
    { key: "field6", color: "#8b5cf6" },
  ];

  return (
    <svg
      viewBox="0 0 200 150"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Helmet Base */}
      <path
        d="M30,110 C50,30 150,30 170,110 C160,130 40,130 30,110 Z"
        fill="#4b5563"
        stroke="#d1d5db"
        strokeWidth="2"
      />

      {/* Temperature Zone */}
      <motion.path
        d="M60,60 C70,40 130,40 140,60 L140,80 C130,70 70,70 60,80 Z"
        fill={getFillColor("field1")}
        stroke="#d1d5db"
        strokeWidth="1"
        animate={validateDisasterConditions("field1", latest.field1) ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.6, repeat: validateDisasterConditions("field1", latest.field1) ? Infinity : 0 }}
      />

      {/* Humidity Zone */}
      <motion.path
        d="M50,80 C70,70 130,70 150,80 L150,100 C130,90 70,90 50,100 Z"
        fill={getFillColor("field2")}
        stroke="#d1d5db"
        strokeWidth="1"
        animate={validateDisasterConditions("field2", latest.field2) ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.6, repeat: validateDisasterConditions("field2", latest.field2) ? Infinity : 0 }}
      />

      {/* Gas Zone */}
      <motion.rect
        x="90"
        y="90"
        width="20"
        height="15"
        fill={getFillColor("field3")}
        stroke="#d1d5db"
        strokeWidth="1"
        animate={validateDisasterConditions("field3", latest.field3) ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.6, repeat: validateDisasterConditions("field3", latest.field3) ? Infinity : 0 }}
      />

      {/* Fall Alert - Border Glow */}
      <motion.path
        d="M30,110 C50,30 150,30 170,110 C160,130 40,130 30,110 Z"
        fill="none"
        stroke={validateDisasterConditions("field4", latest.field4) ? "#ef4444" : "transparent"}
        strokeWidth="4"
        animate={
          validateDisasterConditions("field4", latest.field4)
            ? { scale: [1, 1.05, 1], stroke: ["#ef4444", "#ffaaaa", "#ef4444"] }
            : {}
        }
        transition={{ duration: 0.6, repeat: validateDisasterConditions("field4", latest.field4) ? Infinity : 0 }}
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
  const getFillColor = (key: SensorKey) => {
    const alert = validateDisasterConditions(key, latest[key]);
    if (alert) return "#ef4444"; // Red for disaster
    return selectedSensor === key ? sensors.find(s => s.key === key)?.color || "#6b7280" : "#6b7280";
  };

  const sensors = [
    { key: "field1", color: "#ef4444" },
    { key: "field2", color: "#3b82f6" },
    { key: "field3", color: "#fbbf24" },
    { key: "field4", color: "#f59e0b" },
    { key: "field5", color: "#10b981" },
    { key: "field6", color: "#8b5cf6" },
  ];

  return (
    <svg
      viewBox="0 0 150 150"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Helmet Base */}
      <ellipse
        cx="75"
        cy="70"
        rx="50"
        ry="35"
        fill="#4b5563"
        stroke="#d1d5db"
        strokeWidth="2"
      />

      {/* Temperature Zone */}
      <motion.ellipse
        cx="75"
        cy="50"
        rx="20"
        ry="8"
        fill={getFillColor("field1")}
        stroke="#d1d5db"
        strokeWidth="1"
        animate={validateDisasterConditions("field1", latest.field1) ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.6, repeat: validateDisasterConditions("field1", latest.field1) ? Infinity : 0 }}
      />

      {/* Humidity Zone */}
      <motion.ellipse
        cx="75"
        cy="70"
        rx="20"
        ry="8"
        fill={getFillColor("field2")}
        stroke="#d1d5db"
        strokeWidth="1"
        animate={validateDisasterConditions("field2", latest.field2) ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.6, repeat: validateDisasterConditions("field2", latest.field2) ? Infinity : 0 }}
      />

      {/* Gas Zone */}
      <motion.ellipse
        cx="75"
        cy="90"
        rx="20"
        ry="8"
        fill={getFillColor("field3")}
        stroke="#d1d5db"
        strokeWidth="1"
        animate={validateDisasterConditions("field3", latest.field3) ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.6, repeat: validateDisasterConditions("field3", latest.field3) ? Infinity : 0 }}
      />

      {/* Fall Alert - Border Glow */}
      <motion.ellipse
        cx="75"
        cy="70"
        rx="50"
        ry="35"
        fill="none"
        stroke={validateDisasterConditions("field4", latest.field4) ? "#ef4444" : "transparent"}
        strokeWidth="4"
        animate={
          validateDisasterConditions("field4", latest.field4)
            ? { scale: [1, 1.05, 1], stroke: ["#ef4444", "#ffaaaa", "#ef4444"] }
            : {}
        }
        transition={{ duration: 0.6, repeat: validateDisasterConditions("field4", latest.field4) ? Infinity : 0 }}
      />
    </svg>
  );
}