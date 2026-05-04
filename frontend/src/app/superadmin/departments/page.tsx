'use client';

import React, { useState } from 'react';
import { SuperAdminLayout } from '@/components/superadmin/Layout';
import { SuperAdminIcon } from '@/components/superadmin/Icon';
import { Modal } from '@/components/superadmin/Modal';
import { FormField, FormSubmit } from '@/components/superadmin/FormFields';
import { DeleteConfirmation } from '@/components/superadmin/DeleteConfirmation';
import { departments as mockDepartments } from '@/components/superadmin/mockData';
import { DepartmentRecord } from '@/types/superadmin';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const departmentSchema = Yup.object({
  name: Yup.string().required('Department name is required').min(2, 'Name must be at least 2 characters'),
});

type DepartmentFormData = Yup.InferType<typeof departmentSchema>;

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<DepartmentRecord[]>(mockDepartments);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const filteredDepartments = departments.filter((dept) => dept.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleCreateDepartment = (values: DepartmentFormData) => {
    const newDepartment: DepartmentRecord = {
      id: Math.max(...departments.map((d) => d.id), 0) + 1,
      name: values.name,
      totalEmployees: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setDepartments([...departments, newDepartment]);
    setNotification({ type: 'success', message: 'Department created successfully' });
    setIsCreateModalOpen(false);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleEditDepartment = (values: DepartmentFormData) => {
    if (!selectedDepartment) return;
    setDepartments(
      departments.map((dept) => (dept.id === selectedDepartment.id ? { ...dept, name: values.name } : dept))
    );
    setNotification({ type: 'success', message: 'Department updated successfully' });
    setIsEditModalOpen(false);
    setSelectedDepartment(null);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteDepartment = () => {
    if (!selectedDepartment) return;
    setDepartments(departments.filter((dept) => dept.id !== selectedDepartment.id));
    setNotification({ type: 'success', message: 'Department deleted successfully' });
    setIsDeleteConfirmOpen(false);
    setSelectedDepartment(null);
    setTimeout(() => setNotification(null), 3000);
  };

  const openEditModal = (department: DepartmentRecord) => {
    setSelectedDepartment(department);
    setIsEditModalOpen(true);
  };

  const openDeleteConfirm = (department: DepartmentRecord) => {
    setSelectedDepartment(department);
    setIsDeleteConfirmOpen(true);
  };

  return (
    <SuperAdminLayout title="Departments">
      <div className="space-y-6">
        {/* Notification */}
        {notification && (
          <div
            className={`rounded-2xl px-4 py-3 text-sm font-medium text-white ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {notification.message}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Departments</h1>
            <p className="mt-1 text-sm text-slate-600">Manage company departments and view employee counts.</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-create-action inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold"
          >
            <SuperAdminIcon name="users" className="h-4 w-4" />
            Create Department
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <SuperAdminIcon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search departments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-500 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                    Department Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                    Total Employees
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                    Created Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDepartments.length > 0 ? (
                  filteredDepartments.map((department) => (
                    <tr key={department.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{department.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{department.totalEmployees} employees</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{department.createdAt}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(department)}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => openDeleteConfirm(department)}
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-600">
                      No departments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <Modal isOpen={isCreateModalOpen} title="Create Department" onClose={() => setIsCreateModalOpen(false)}>
          <Formik initialValues={{ name: '' }} validationSchema={departmentSchema} onSubmit={handleCreateDepartment}>
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-4">
                <FormField
                  name="name"
                  label="Department Name"
                  placeholder="e.g., Engineering"
                  error={errors.name}
                  touched={touched.name}
                />
                <FormSubmit isLoading={isSubmitting} label="Create Department" />
              </Form>
            )}
          </Formik>
        </Modal>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedDepartment && (
        <Modal isOpen={isEditModalOpen} title="Edit Department" onClose={() => setIsEditModalOpen(false)}>
          <Formik
            initialValues={{ name: selectedDepartment.name }}
            validationSchema={departmentSchema}
            onSubmit={handleEditDepartment}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-4">
                <FormField
                  name="name"
                  label="Department Name"
                  placeholder="e.g., Engineering"
                  error={errors.name}
                  touched={touched.name}
                />
                <FormSubmit isLoading={isSubmitting} label="Update Department" />
              </Form>
            )}
          </Formik>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {isDeleteConfirmOpen && selectedDepartment && (
        <DeleteConfirmation
          isOpen={isDeleteConfirmOpen}
          onConfirm={handleDeleteDepartment}
          onCancel={() => setIsDeleteConfirmOpen(false)}
          title="Delete Department?"
          message={`Are you sure you want to delete "${selectedDepartment.name}"? This action cannot be undone.`}
        />
      )}
    </SuperAdminLayout>
  );
}
