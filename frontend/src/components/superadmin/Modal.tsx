/**
 * Modal Component for Super Admin
 */

import React from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

export function Modal({ isOpen, title, children, onClose, footer, size = 'md' }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
      <div className={`max-h-[90vh] w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl ${sizeClasses[size]}`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <button onClick={onClose} className="text-2xl leading-none text-slate-500 transition hover:text-slate-700">
            ×
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-140px)] overflow-y-auto p-6">{children}</div>

        {/* Footer - optional button group */}
        {footer && <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}
