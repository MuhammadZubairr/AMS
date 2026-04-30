/**
 * Data Table Component for Super Admin
 */

import React from 'react';
import { Badge } from './Badge';

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
      <div className="animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-gray-200 mb-2 rounded"></div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return <p className="text-center py-8 text-gray-500">No data available</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-6 py-3 text-left text-sm font-semibold text-gray-700"
                style={{ width: col.width }}
              >
                {col.label}
              </th>
            ))}
            {actions && <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              onClick={() => onRowClick?.(item)}
              className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
            >
              {columns.map((col) => {
                const value = (item as any)[col.key as string];
                return (
                  <td key={String(col.key)} className="px-6 py-4 text-sm text-gray-700">
                    {col.render ? col.render(value, item) : value}
                  </td>
                );
              })}
              {actions && <td className="px-6 py-4 text-sm">{actions(item)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
