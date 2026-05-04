/**
 * Data Table Component for Super Admin
 */

import React from 'react';

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (value: any, item: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  onRowClick?: (item: T) => void;
  actions?: (item: T) => React.ReactNode;
}

export function DataTable<T extends { id: number | string }>({
  columns,
  data,
  isLoading,
  onRowClick,
  actions,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 animate-pulse rounded-2xl bg-slate-100" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return <p className="rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center text-slate-500 shadow-sm">No data available</p>;
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="whitespace-nowrap px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
              {actions && <th className="whitespace-nowrap px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item) => (
              <tr
                key={item.id}
                onClick={() => onRowClick?.(item)}
                className={`transition hover:bg-slate-50 ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {columns.map((col) => {
                  const value = (item as any)[col.key as string];
                  return (
                    <td key={String(col.key)} className="whitespace-nowrap px-5 py-4 text-sm text-slate-700">
                      {col.render ? col.render(value, item) : value}
                    </td>
                  );
                })}
                {actions && <td className="whitespace-nowrap px-5 py-4 text-sm">{actions(item)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
