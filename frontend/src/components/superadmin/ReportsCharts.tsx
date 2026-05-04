'use client';

import React from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export function MonthlyLine({ data }: { data: any[] }) {
  return (
    <div className="h-72" style={{ minHeight: 288 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis dataKey="label" stroke="#64748B" />
          <YAxis stroke="#64748B" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DepartmentBar({ data }: { data: any[] }) {
  return (
    <div className="h-72" style={{ minHeight: 288 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis dataKey="label" stroke="#64748B" />
          <YAxis stroke="#64748B" />
          <Tooltip />
          <Bar dataKey="value" fill="#2563EB" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function WorkmodePie({ data, colors = ['#2563EB', '#8B5CF6'] }: { data: any[]; colors?: string[] }) {
  return (
    <div className="h-72" style={{ minHeight: 288 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={100} label>
            {data.map((_, idx) => (
              <Cell key={idx} fill={colors[idx % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
