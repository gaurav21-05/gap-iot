"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Thermometer, Droplets, Wind, Activity, MapPin } from "lucide-react";
import ChartCard from "@/components/chart-card";
import IoTLineChart from "@/components/iot-line-chart";
import HelmetView from "./helmet/page";

// Helper function to validate sensor data for disaster conditions
const validateDisasterConditions = (field: string, value: string | null | undefined, prevData = {}) => {
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
    //   if (prevData.field5 && Math.abs(numValue - parseFloat(prevData.field5)) > 0.1) {
    //     return "🚨 Significant location change detected - possible displacement";
    //   }
    //   break;
    // case "field6": // Longitude
    //   if (numValue < -180 || numValue > 180) {
    //     return "⚠️ Invalid longitude - check GPS sensor";
    //   }
    //   if (prevData.field6 && Math.abs(numValue - parseFloat(prevData.field6)) > 0.1) {
    //     return "🚨 Significant location change detected - possible displacement";
    //   }
    //   break;
    default:
      return null;
  }
  return null;
};

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          `https://api.thingspeak.com/channels/${process.env.NEXT_PUBLIC_THINKSPEAK_CHANNEL_ID}/feeds.json?api_key=${process.env.NEXT_PUBLIC_THINKSPEAK_API_KEY}&results=50`
        );
        if (!res.ok) {
          throw new Error(`API request failed: ${res.status}`);
        }
        const json = await res.json();
        setData(json.feeds || []);
        setError(null);
      } catch (err) {
        setError("Failed to fetch sensor data - check network or API");
        console.error(err);
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 15000); // Fetch every 15s
    return () => clearInterval(interval);
  }, []);

  const latest = data[data.length - 1] || {};
  const previous = data[data.length - 2] || {}; // For location change detection

  // Check for critical disaster conditions (for Helmet tab and global alerts)
  const isCriticalDisaster =
    validateDisasterConditions("field4", latest.field4) === "🚨 Fall detected - immediate emergency response required" ||
    validateDisasterConditions("field3", latest.field3)?.includes("Critical gas level");

  return (
    <main className="p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          🚨 {error}
        </div>
      )}
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="dashboard">📊 Dashboard</TabsTrigger>
          <TabsTrigger value="helmet">
            🪖 Helmet View
            {isCriticalDisaster && (
              <span className="ml-2 text-red-600 animate-pulse">🚨</span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Dashboard */}
        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard
              title="Temperature"
              icon={<Thermometer className="text-red-500" />}
              latestValue={latest.field1 || "N/A"}
              unit="°C"
              color="#ef4444"
            >
              {validateDisasterConditions("field1", latest.field1) && (
                <div className="p-2 bg-red-100 text-red-700 rounded mb-2">
                  {validateDisasterConditions("field1", latest.field1)}
                </div>
              )}
              <IoTLineChart data={data} dataKey="field1" color="#ef4444" />
            </ChartCard>

            <ChartCard
              title="Humidity"
              icon={<Droplets className="text-blue-500" />}
              latestValue={latest.field2 || "N/A"}
              unit="%"
              color="#3b82f6"
            >
              {validateDisasterConditions("field2", latest.field2) && (
                <div className="p-2 bg-red-100 text-red-700 rounded mb-2">
                  {validateDisasterConditions("field2", latest.field2)}
                </div>
              )}
              <IoTLineChart data={data} dataKey="field2" color="#3b82f6" />
            </ChartCard>

            <ChartCard
              title="Gas"
              icon={<Wind className="text-gray-600" />}
              latestValue={latest.field3 || "N/A"}
              unit="ppm"
              color="#6b7280"
            >
              {validateDisasterConditions("field3", latest.field3) && (
                <div className="p-2 bg-red-100 text-red-700 rounded mb-2">
                  {validateDisasterConditions("field3", latest.field3)}
                </div>
              )}
              <IoTLineChart data={data} dataKey="field3" color="#6b7280" />
            </ChartCard>

            <ChartCard
              title="Fall Detection"
              icon={<Activity className="text-yellow-500" />}
              latestValue={latest.field4 || "N/A"}
              unit=""
              color="#f59e0b"
            >
              {validateDisasterConditions("field4", latest.field4) && (
                <div className="p-2 bg-red-100 text-red-700 rounded mb-2">
                  {validateDisasterConditions("field4", latest.field4)}
                </div>
              )}
              <IoTLineChart data={data} dataKey="field4" color="#f59e0b" />
            </ChartCard>

            <ChartCard
              title="Latitude"
              icon={<MapPin className="text-green-500" />}
              latestValue={latest.field5 || "N/A"}
              unit=""
              color="#10b981"
            >
              {validateDisasterConditions("field5", latest.field5, previous) && (
                <div className="p-2 bg-red-100 text-red-700 rounded mb-2">
                  {validateDisasterConditions("field5", latest.field5, previous)}
                </div>
              )}
              <IoTLineChart data={data} dataKey="field5" color="#10b981" />
            </ChartCard>

            <ChartCard
              title="Longitude"
              icon={<MapPin className="text-purple-500" />}
              latestValue={latest.field6 || "N/A"}
              unit=""
              color="#8b5cf6"
            >
              {validateDisasterConditions("field6", latest.field6, previous) && (
                <div className="p-2 bg-red-100 text-red-700 rounded mb-2">
                  {validateDisasterConditions("field6", latest.field6, previous)}
                </div>
              )}
              <IoTLineChart data={data} dataKey="field6" color="#8b5cf6" />
            </ChartCard>
          </div>
        </TabsContent>

        {/* Helmet Tab */}
        <TabsContent value="helmet">
          <HelmetView
            latest={latest}
            alerts={{
              fall: validateDisasterConditions("field4", latest.field4),
              gas: validateDisasterConditions("field3", latest.field3),
            }}
          />
        </TabsContent>
      </Tabs>
    </main>
  );
}