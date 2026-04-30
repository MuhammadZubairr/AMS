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
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      }
    >
      <div>
        <p className="text-gray-700">{message}</p>
        {itemName && <p className="mt-2 font-semibold text-gray-900">{itemName}</p>}
        <p className="mt-4 text-sm text-red-600">This action cannot be undone.</p>
      </div>
    </Modal>
  );
}
