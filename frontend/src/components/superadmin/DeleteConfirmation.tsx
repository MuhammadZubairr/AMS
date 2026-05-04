/**
 * Delete Confirmation Dialog
 */

import React from 'react';
import { Modal } from './Modal';

interface DeleteConfirmationProps {
  isOpen: boolean;
  title: string;
  message: string;
  itemName?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmation({
  isOpen,
  title,
  message,
  itemName,
  isLoading,
  onConfirm,
  onCancel,
}: DeleteConfirmationProps) {
  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onCancel}
      footer={
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      }
    >
      <div>
        <p className="text-slate-700">{message}</p>
        {itemName && <p className="mt-2 font-semibold text-slate-900">{itemName}</p>}
        <p className="mt-4 text-sm text-red-600">This action cannot be undone.</p>
      </div>
    </Modal>
  );
}
