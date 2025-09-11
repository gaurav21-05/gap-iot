"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface IoTLineChartProps {
  data: unknown[];
  dataKey: string;
  color: string;
}

export default function IoTLineChart({ data, dataKey, color }: IoTLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
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
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
