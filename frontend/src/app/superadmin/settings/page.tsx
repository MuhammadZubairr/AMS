'use client';

import React from 'react';
import { SuperAdminLayout } from '@/components/superadmin/Layout';
import { Formik, Form } from 'formik';
import * as yup from 'yup';

const schema = yup.object({
  minLength: yup.number().min(6).required('Required'),
  requireUpper: yup.boolean(),
  requireLower: yup.boolean(),
  requireNumber: yup.boolean(),
  requireSpecial: yup.boolean(),
});

export default function SettingsPage() {
  return (
    <SuperAdminLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">System and password policy settings</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="font-semibold mb-4">Password Policy</h2>
          <Formik
            initialValues={{ minLength: 8, requireUpper: true, requireLower: true, requireNumber: true, requireSpecial: true }}
            validationSchema={schema}
            onSubmit={(_values) => {
              // currently frontend-only; persist via API later
              alert('Settings saved (frontend-only)');
            }}
          >
            {({ values, handleChange, isSubmitting }) => (
              <Form className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="w-40 text-sm text-gray-700">Min Length</label>
                  <input name="minLength" type="number" value={values.minLength} onChange={handleChange} className="px-3 py-2 border rounded-lg" />
                </div>

                <div className="flex items-center gap-4">
                  <label className="w-40 text-sm text-gray-700">Require Uppercase</label>
                  <input name="requireUpper" type="checkbox" checked={values.requireUpper} onChange={handleChange} />
                </div>

                <div className="flex items-center gap-4">
                  <label className="w-40 text-sm text-gray-700">Require Lowercase</label>
                  <input name="requireLower" type="checkbox" checked={values.requireLower} onChange={handleChange} />
                </div>

                <div className="flex items-center gap-4">
                  <label className="w-40 text-sm text-gray-700">Require Number</label>
                  <input name="requireNumber" type="checkbox" checked={values.requireNumber} onChange={handleChange} />
                </div>

                <div className="flex items-center gap-4">
                  <label className="w-40 text-sm text-gray-700">Require Special</label>
                  <input name="requireSpecial" type="checkbox" checked={values.requireSpecial} onChange={handleChange} />
                </div>

                <div className="pt-4">
                  <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save</button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
