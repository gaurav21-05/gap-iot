"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ChartCardProps {
  title: string;
  icon?: ReactNode;
  latestValue?: string | number;
  unit?: string;
  children: ReactNode;
  color?: string;
}

export default function ChartCard({
  title,
  icon,
  latestValue,
  unit,
  children,
  color = "#6366f1",
}: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 flex flex-col gap-4 hover:shadow-xl transition"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <span className="w-6 h-6">{icon}</span>}
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {title}
          </h2>
        </div>

        {/* Animated Latest Value */}
        {latestValue !== undefined && (
          <motion.span
            key={latestValue} // triggers animation when value changes
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-xl font-bold"
            style={{ color }}
          >
            {latestValue} {unit}
          </motion.span>
        )}
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="h-64"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
