"use client";

import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface IoTBarChartProps {
  data: unknown[];
  dataKey: string;
  color: string;
}

export default function IoTBarChart({ data, dataKey, color }: IoTBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="created_at"
          tickFormatter={(time) => new Date(time).toLocaleTimeString()}
          tick={{ fill: "#6b7280", fontSize: 12 }}
        />
        <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
        <Tooltip
          contentStyle={{ borderRadius: "0.75rem" }}
          labelFormatter={(time) => new Date(time).toLocaleString()}
        />
        <Bar dataKey={dataKey} fill={color} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
