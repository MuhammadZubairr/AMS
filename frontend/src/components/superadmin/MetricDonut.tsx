'use client';

import React, { memo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface MetricDonutProps {
  title: string;
  value: number;
  color: string;
  isFocused?: boolean;
  onClick?: () => void;
}

/**
 * MetricDonut Component
 * Memoized to prevent unnecessary re-renders when parent updates
 * Only re-renders if props actually change
 */
const MetricDonut = memo(function MetricDonut({ 
  title, 
  value, 
  color, 
  isFocused, 
  onClick 
}: MetricDonutProps) {
  const maxValue = 250;
  const chartData = [
    { name: title, value },
    { name: 'Remaining', value: Math.max(maxValue - value, 0) },
  ];

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-slate-200 bg-white p-3 transition-all duration-200 cursor-pointer ${
        isFocused ? 'shadow-2xl ring-2 ring-blue-400 scale-105' : 'shadow-sm hover:shadow-md'
      }`}
    >
      <div className={`relative w-full ${isFocused ? 'h-48' : 'h-40'}`} style={{ minHeight: isFocused ? 192 : 160 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              innerRadius={isFocused ? 36 : 32}
              outerRadius={isFocused ? 58 : 48}
              startAngle={90}
              endAngle={-270}
              cornerRadius={8}
              stroke="#ffffff"
              strokeWidth={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={entry.name} fill={index === 0 ? color : '#F1F5F9'} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}`} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xl font-bold text-slate-900">{value}</span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Today</span>
          <span className="mt-0.5 text-[10px] text-slate-500">of {maxValue}</span>
        </div>
      </div>
      <p className="mt-2 text-xs font-semibold text-center text-slate-900">{title}</p>
    </div>
  );
});

export default MetricDonut;
