'use client';

import React, { useState } from 'react';
import { SuperAdminLayout } from '@/components/superadmin/Layout';
import { systemSettings as mockSettings } from '@/components/superadmin/mockData';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const settingsSchema = Yup.object({
  companyName: Yup.string().required('Company name is required'),
  officeAddress: Yup.string().required('Office address is required'),
  defaultOfficeRadius: Yup.number().required('Default radius is required').positive(),
  workStartTime: Yup.string().required('Work start time is required'),
  workEndTime: Yup.string().required('Work end time is required'),
});

type SettingsFormData = Yup.InferType<typeof settingsSchema>;

export default function SettingsPage() {
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSaveSettings = async (values: SettingsFormData) => {
    try {
      console.log('Saving settings:', values);
      setNotification({ type: 'success', message: 'Settings saved successfully!' });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to save settings. Please try again.' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <SuperAdminLayout title="Settings">
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
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
          <p className="mt-1 text-sm text-slate-600">Configure company information and system preferences.</p>
        </div>

        {/* Company Settings */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="mb-6 text-lg font-bold text-slate-900">Company Information</h2>
          <Formik
            initialValues={{
              companyName: mockSettings.companyName,
              officeAddress: mockSettings.officeAddress,
              defaultOfficeRadius: mockSettings.defaultOfficeRadius,
              workStartTime: mockSettings.workStartTime,
              workEndTime: mockSettings.workEndTime,
            }}
            validationSchema={settingsSchema}
            onSubmit={handleSaveSettings}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-6">
                {/* Company Details */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-slate-900">
                      Company Name
                    </label>
                    <Field
                      id="companyName"
                      name="companyName"
                      placeholder="DevFlx"
                      className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    {errors.companyName && touched.companyName && (
                      <p className="mt-1 text-xs text-red-600">{errors.companyName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="officeAddress" className="block text-sm font-medium text-slate-900">
                      Office Address
                    </label>
                    <Field
                      id="officeAddress"
                      name="officeAddress"
                      placeholder="North Avenue, Karachi, Pakistan"
                      className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    {errors.officeAddress && touched.officeAddress && (
                      <p className="mt-1 text-xs text-red-600">{errors.officeAddress}</p>
                    )}
                  </div>
                </div>

                {/* Working Hours */}
                <div className="border-t border-slate-100 pt-6">
                  <h3 className="mb-4 text-base font-semibold text-slate-900">Working Hours</h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label htmlFor="workStartTime" className="block text-sm font-medium text-slate-900">
                        Work Start Time
                      </label>
                      <Field
                        id="workStartTime"
                        name="workStartTime"
                        type="time"
                        className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      {errors.workStartTime && touched.workStartTime && (
                        <p className="mt-1 text-xs text-red-600">{errors.workStartTime}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="workEndTime" className="block text-sm font-medium text-slate-900">
                        Work End Time
                      </label>
                      <Field
                        id="workEndTime"
                        name="workEndTime"
                        type="time"
                        className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      {errors.workEndTime && touched.workEndTime && (
                        <p className="mt-1 text-xs text-red-600">{errors.workEndTime}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="defaultOfficeRadius" className="block text-sm font-medium text-slate-900">
                        Default Office Radius (m)
                      </label>
                      <Field
                        id="defaultOfficeRadius"
                        name="defaultOfficeRadius"
                        type="number"
                        placeholder="250"
                        className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      {errors.defaultOfficeRadius && touched.defaultOfficeRadius && (
                        <p className="mt-1 text-xs text-red-600">{errors.defaultOfficeRadius}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="border-t border-slate-100 pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* Information Cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">Current Version</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">v1.0.0</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">Last Updated</p>
            <p className="mt-2 text-base font-semibold text-slate-900">1 May 2026</p>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
