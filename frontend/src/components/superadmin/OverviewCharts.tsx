'use client';

import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export type ChartDatum = {
  name: string;
  value: number;
  color?: string;
};

const defaultPieColors = ['#2563EB', '#EF4444', '#8B5CF6', '#10B981'];

export function AttendanceOverviewCharts({ data }: { data: ChartDatum[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Attendance overview</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">Today&apos;s work mode split</h3>
        </div>
        <div className="h-72" style={{ minHeight: 288 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={64}
                outerRadius={100}
                paddingAngle={4}
                cornerRadius={8}
                stroke="#ffffff"
                strokeWidth={2}
              >
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={entry.color || defaultPieColors[index % defaultPieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Attendance health</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">Trend snapshot</h3>
        </div>
        <div className="h-72" style={{ minHeight: 288 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export function ReportChartCard({
  title,
  subtitle,
  data,
  type,
}: {
  title: string;
  subtitle: string;
  data: ChartDatum[];
  type: 'bar' | 'line';
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">{subtitle}</p>
        <h3 className="mt-2 text-lg font-semibold text-slate-900">{title}</h3>
      </div>
      <div className="h-72" style={{ minHeight: 288 }}>
        <ResponsiveContainer width="100%" height="100%">
          {type === 'bar' ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#2563EB" />
            </BarChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
