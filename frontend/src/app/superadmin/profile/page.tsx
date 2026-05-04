'use client';

import React, { useState } from 'react';
import { SuperAdminLayout } from '@/components/superadmin/Layout';
import { SuperAdminIcon } from '@/components/superadmin/Icon';
import { FormSubmit } from '@/components/superadmin/FormFields';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const profileSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().required('Email is required').email('Must be a valid email'),
  phone: Yup.string().required('Phone number is required'),
});

const passwordSchema = Yup.object({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, 'Must contain uppercase, lowercase, number, and special character'),
  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
});

type ProfileFormData = Yup.InferType<typeof profileSchema>;

export default function ProfilePage() {
  const [profileData] = useState({
    firstName: 'Super',
    lastName: 'Admin',
    email: 'admin@devflx.com',
    phone: '+92 300 0000000',
    avatar: 'https://api.dicebear.com/8.x/avataaars/svg?seed=SuperAdmin',
    joinDate: '2026-04-01',
  });
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(profileData.avatar);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async (values: ProfileFormData) => {
    try {
      console.log('Updating profile:', values);
      setNotification({ type: 'success', message: 'Profile updated successfully!' });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to update profile. Please try again.' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handlePasswordChange = async () => {
    try {
      console.log('Changing password');
      setNotification({ type: 'success', message: 'Password changed successfully!' });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to change password. Please try again.' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <SuperAdminLayout title="Profile">
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

        {/* Profile Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 md:flex-row">
            {/* Avatar Section */}
            <div className="text-center md:text-left">
              <div className="mx-auto mb-4 inline-flex md:mx-0">
                <img
                  src={avatarPreview}
                  alt="Profile Avatar"
                  className="h-24 w-24 rounded-full border-4 border-blue-100 shadow-md"
                />
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                <SuperAdminIcon name="upload" className="h-4 w-4" />
                Change Avatar
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
              <p className="mt-3 text-xs text-slate-500">JPG, PNG up to 5MB</p>
            </div>

            {/* Profile Info Section */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900">
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p className="mt-1 text-sm text-slate-600">Super Admin</p>
              <div className="mt-4 space-y-2 text-sm">
                <p className="text-slate-600">
                  <span className="font-medium text-slate-900">Email:</span> {profileData.email}
                </p>
                <p className="text-slate-600">
                  <span className="font-medium text-slate-900">Phone:</span> {profileData.phone}
                </p>
                <p className="text-slate-600">
                  <span className="font-medium text-slate-900">Member Since:</span> {profileData.joinDate}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="mb-6 text-xl font-bold text-slate-900">Edit Profile</h2>
          <Formik
            initialValues={{
              firstName: profileData.firstName,
              lastName: profileData.lastName,
              email: profileData.email,
              phone: profileData.phone,
            }}
            validationSchema={profileSchema}
            onSubmit={handleProfileUpdate}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-slate-900">
                      First Name
                    </label>
                    <Field
                      id="firstName"
                      name="firstName"
                      placeholder="Super"
                      className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    {errors.firstName && touched.firstName && (
                      <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-slate-900">
                      Last Name
                    </label>
                    <Field
                      id="lastName"
                      name="lastName"
                      placeholder="Admin"
                      className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    {errors.lastName && touched.lastName && (
                      <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-900">
                    Email
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@devflx.com"
                    className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.email && touched.email && (
                    <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-900">
                    Phone Number
                  </label>
                  <Field
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+92 300 0000000"
                    className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.phone && touched.phone && (
                    <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                  )}
                </div>

                <FormSubmit isLoading={isSubmitting} label="Update Profile" />
              </Form>
            )}
          </Formik>
        </div>

        {/* Change Password Form */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h2 className="mb-6 text-xl font-bold text-slate-900">Change Password</h2>
          <Formik
            initialValues={{
              currentPassword: '',
              newPassword: '',
              confirmPassword: '',
            }}
            validationSchema={passwordSchema}
            onSubmit={handlePasswordChange}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-900">
                    Current Password
                  </label>
                  <div className="relative mt-1">
                    <Field
                      id="currentPassword"
                      name="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-10 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                    >
                      <SuperAdminIcon name={showCurrentPassword ? 'eye' : 'eyeOff'} className="h-4 w-4" />
                    </button>
                  </div>
                  {errors.currentPassword && touched.currentPassword && (
                    <p className="mt-1 text-xs text-red-600">{errors.currentPassword}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-slate-900">
                    New Password
                  </label>
                  <div className="relative mt-1">
                    <Field
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-10 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                    >
                      <SuperAdminIcon name={showNewPassword ? 'eye' : 'eyeOff'} className="h-4 w-4" />
                    </button>
                  </div>
                  {errors.newPassword && touched.newPassword && (
                    <p className="mt-1 text-xs text-red-600">{errors.newPassword}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-900">
                    Confirm Password
                  </label>
                  <div className="relative mt-1">
                    <Field
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-10 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                    >
                      <SuperAdminIcon name={showConfirmPassword ? 'eye' : 'eyeOff'} className="h-4 w-4" />
                    </button>
                  </div>
                  {errors.confirmPassword && touched.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>

                <FormSubmit isLoading={isSubmitting} label="Change Password" />
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
