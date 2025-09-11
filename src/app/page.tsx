"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Thermometer, Droplets, Wind, Activity, MapPin } from "lucide-react";
import ChartCard from "@/components/chart-card";
import IoTLineChart from "@/components/iot-line-chart";
import HelmetView from "./helmet/page";

export default function Home() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        `https://api.thingspeak.com/channels/${process.env.NEXT_PUBLIC_THINKSPEAK_CHANNEL_ID}/feeds.json?api_key=${process.env.NEXT_PUBLIC_THINKSPEAK_API_KEY}&results=50`
      );
      const json = await res.json();
      setData(json.feeds || []);
    }
    fetchData();
    const interval = setInterval(fetchData, 15000); // fetch every 15s
    return () => clearInterval(interval);
  }, []);

  const latest = data[data.length - 1] || {}; // Latest sensor reading

  return (
    <main className="p-6">
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="dashboard">📊 Dashboard</TabsTrigger>
          <TabsTrigger value="helmet">
            🪖 Helmet View
            {(parseInt(latest.field4) === 1 || parseFloat(latest.field3) > 2000) && (
              <span className="ml-2 text-red-600">⚠️</span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Dashboard */}
        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard
              title="Temperature"
              icon={<Thermometer className="text-red-500" />}
              latestValue={latest.field1}
              unit="°C"
              color="#ef4444"
            >
              <IoTLineChart data={data} dataKey="field1" color="#ef4444" />
            </ChartCard>

            <ChartCard
              title="Humidity"
              icon={<Droplets className="text-blue-500" />}
              latestValue={latest.field2}
              unit="%"
              color="#3b82f6"
            >
              <IoTLineChart data={data} dataKey="field2" color="#3b82f6" />
            </ChartCard>

            <ChartCard
              title="Gas"
              icon={<Wind className="text-gray-600" />}
              latestValue={latest.field3}
              unit="ppm"
              color="#6b7280"
            >
              <IoTLineChart data={data} dataKey="field3" color="#6b7280" />
            </ChartCard>

            <ChartCard
              title="Fall Detection"
              icon={<Activity className="text-yellow-500" />}
              latestValue={latest.field4}
              unit=""
              color="#f59e0b"
            >
              <IoTLineChart data={data} dataKey="field4" color="#f59e0b" />
            </ChartCard>

            <ChartCard
              title="Latitude"
              icon={<MapPin className="text-green-500" />}
              latestValue={latest.field5}
              unit=""
              color="#10b981"
            >
              <IoTLineChart data={data} dataKey="field5" color="#10b981" />
            </ChartCard>

            <ChartCard
              title="Longitude"
              icon={<MapPin className="text-purple-500" />}
              latestValue={latest.field6}
              unit=""
              color="#8b5cf6"
            >
              <IoTLineChart data={data} dataKey="field6" color="#8b5cf6" />
            </ChartCard>
          </div>
        </TabsContent>

        {/* Helmet Tab */}
        <TabsContent value="helmet">
          {/* Pass latest sensor data */}
          <HelmetView latest={latest} />
        </TabsContent>
      </Tabs>
    </main>
  );
}
