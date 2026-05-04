'use client';

import React, { useState } from 'react';
import { SuperAdminLayout } from '@/components/superadmin/Layout';
import { SuperAdminIcon } from '@/components/superadmin/Icon';
import { Modal } from '@/components/superadmin/Modal';
import { FormField, FormSubmit } from '@/components/superadmin/FormFields';
import { DeleteConfirmation } from '@/components/superadmin/DeleteConfirmation';
import { officeLocations as mockOfficeLocations } from '@/components/superadmin/mockData';
import { OfficeLocationRecord } from '@/types/superadmin';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const officeLocationSchema = Yup.object({
  officeName: Yup.string().required('Office name is required').min(2, 'Name must be at least 2 characters'),
  latitude: Yup.string().required('Latitude is required'),
  longitude: Yup.string().required('Longitude is required'),
  radius: Yup.number().required('Radius is required').positive('Radius must be positive').typeError('Radius must be a number'),
});

type OfficeLocationFormData = Yup.InferType<typeof officeLocationSchema>;

export default function OfficeLocationPage() {
  const [locations, setLocations] = useState<OfficeLocationRecord[]>(mockOfficeLocations);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<OfficeLocationRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const filteredLocations = locations.filter((loc) => loc.officeName.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleCreateLocation = (values: OfficeLocationFormData) => {
    const newLocation: OfficeLocationRecord = {
      id: Math.max(...locations.map((l) => l.id), 0) + 1,
      officeName: values.officeName,
      latitude: values.latitude,
      longitude: values.longitude,
      radius: Number(values.radius),
    };
    setLocations([...locations, newLocation]);
    setNotification({ type: 'success', message: 'Office location added successfully' });
    setIsCreateModalOpen(false);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleEditLocation = (values: OfficeLocationFormData) => {
    if (!selectedLocation) return;
    setLocations(
      locations.map((loc) =>
        loc.id === selectedLocation.id
          ? {
              ...loc,
              officeName: values.officeName,
              latitude: values.latitude,
              longitude: values.longitude,
              radius: Number(values.radius),
            }
          : loc
      )
    );
    setNotification({ type: 'success', message: 'Office location updated successfully' });
    setIsEditModalOpen(false);
    setSelectedLocation(null);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteLocation = () => {
    if (!selectedLocation) return;
    setLocations(locations.filter((loc) => loc.id !== selectedLocation.id));
    setNotification({ type: 'success', message: 'Office location deleted successfully' });
    setIsDeleteConfirmOpen(false);
    setSelectedLocation(null);
    setTimeout(() => setNotification(null), 3000);
  };

  const openEditModal = (location: OfficeLocationRecord) => {
    setSelectedLocation(location);
    setIsEditModalOpen(true);
  };

  const openDeleteConfirm = (location: OfficeLocationRecord) => {
    setSelectedLocation(location);
    setIsDeleteConfirmOpen(true);
  };

  return (
    <SuperAdminLayout title="Office Locations">
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
            <h1 className="text-2xl font-bold text-slate-900">Office Locations</h1>
            <p className="mt-1 text-sm text-slate-600">Manage office locations for GPS attendance verification.</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-create-action inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold"
          >
            <SuperAdminIcon name="location" className="h-4 w-4" />
            Add Location
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <SuperAdminIcon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search office locations..."
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
                    Office Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                    Latitude
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                    Longitude
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                    Radius (m)
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((location) => (
                    <tr key={location.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{location.officeName}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{location.latitude}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{location.longitude}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{location.radius} m</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(location)}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => openDeleteConfirm(location)}
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
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-600">
                      No office locations found
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
        <Modal isOpen={isCreateModalOpen} title="Add Office Location" onClose={() => setIsCreateModalOpen(false)}>
          <Formik
            initialValues={{ officeName: '', latitude: '', longitude: '', radius: 0 }}
            validationSchema={officeLocationSchema}
            onSubmit={handleCreateLocation}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-4">
                <FormField
                  name="officeName"
                  label="Office Name"
                  placeholder="e.g., DevFlx HQ"
                  error={errors.officeName}
                  touched={touched.officeName}
                />
                <FormField
                  name="latitude"
                  label="Latitude"
                  placeholder="e.g., 24.8607"
                  error={errors.latitude}
                  touched={touched.latitude}
                />
                <FormField
                  name="longitude"
                  label="Longitude"
                  placeholder="e.g., 67.0011"
                  error={errors.longitude}
                  touched={touched.longitude}
                />
                <FormField
                  name="radius"
                  label="Allowed Radius (meters)"
                  type="number"
                  placeholder="e.g., 250"
                  error={errors.radius}
                  touched={touched.radius}
                />
                <FormSubmit isLoading={isSubmitting} label="Add Location" />
              </Form>
            )}
          </Formik>
        </Modal>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedLocation && (
        <Modal isOpen={isEditModalOpen} title="Edit Office Location" onClose={() => setIsEditModalOpen(false)}>
          <Formik
            initialValues={{
              officeName: selectedLocation.officeName,
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
              radius: selectedLocation.radius,
            }}
            validationSchema={officeLocationSchema}
            onSubmit={handleEditLocation}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-4">
                <FormField
                  name="officeName"
                  label="Office Name"
                  placeholder="e.g., DevFlx HQ"
                  error={errors.officeName}
                  touched={touched.officeName}
                />
                <FormField
                  name="latitude"
                  label="Latitude"
                  placeholder="e.g., 24.8607"
                  error={errors.latitude}
                  touched={touched.latitude}
                />
                <FormField
                  name="longitude"
                  label="Longitude"
                  placeholder="e.g., 67.0011"
                  error={errors.longitude}
                  touched={touched.longitude}
                />
                <FormField
                  name="radius"
                  label="Allowed Radius (meters)"
                  type="number"
                  placeholder="e.g., 250"
                  error={errors.radius}
                  touched={touched.radius}
                />
                <FormSubmit isLoading={isSubmitting} label="Update Location" />
              </Form>
            )}
          </Formik>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {isDeleteConfirmOpen && selectedLocation && (
        <DeleteConfirmation
          isOpen={isDeleteConfirmOpen}
          onConfirm={handleDeleteLocation}
          onCancel={() => setIsDeleteConfirmOpen(false)}
          title="Delete Office Location?"
          message={`Are you sure you want to delete "${selectedLocation.officeName}"? This action cannot be undone.`}
        />
      )}
    </SuperAdminLayout>
  );
}
