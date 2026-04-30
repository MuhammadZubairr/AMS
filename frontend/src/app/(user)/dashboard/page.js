'use client';

import { useEffect, useState } from 'react';
import EmployeeLayout from '@/components/employee/Layout';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;
  const dp = ((lat2 - lat1) * Math.PI) / 180;
  const dl = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dp / 2) * Math.sin(dp / 2) + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) * Math.sin(dl / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export default function DashboardPage() {
  const [mode, setMode] = useState(null);
  const [coords, setCoords] = useState(null);
  const [distanceText, setDistanceText] = useState('');
  const [today, setToday] = useState({ checked_in: false, checked_out: false, status: 'Not Marked' });
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    fetchToday();
  }, []);

  const fetchToday = async () => {
    try {
      const response = await fetch(`${API_URL}/api/attendance/today`, { credentials: 'include' });
      const data = await response.json();
      if (data.ok) {
        setToday({
          checked_in: !!data.data.checked_in,
          checked_out: !!data.data.checked_out,
          status: data.data.status || 'Not Marked',
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Could not load today status' });
    }
  };

  const getLocation = () => {
    setLocating(true);
    setDistanceText('');

    if (!navigator.geolocation) {
      setMessage({ type: 'error', text: 'GPS is not supported on this device' });
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const current = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setCoords(current);

        const officeLat = 31.503586;
        const officeLon = 74.433875;
        const meters = Math.round(calculateDistance(current.latitude, current.longitude, officeLat, officeLon));
        setDistanceText(meters <= 200 ? `Valid office location (${meters}m)` : `Outside office area (${meters}m)`);
        setLocating(false);
      },
      () => {
        setMessage({ type: 'error', text: 'Unable to fetch location. Enable GPS and retry.' });
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const submitAttendance = async (type) => {
    if (!mode) {
      setMessage({ type: 'error', text: 'Select Office or Remote mode first' });
      return;
    }

    if (mode === 'OFFICE' && !coords) {
      setMessage({ type: 'error', text: 'Office mode requires GPS validation' });
      return;
    }

    setBusy(true);
    setMessage(null);

    const body = { mode };
    if (mode === 'OFFICE' && coords) {
      body.latitude = coords.latitude;
      body.longitude = coords.longitude;
    }

    try {
      const response = await fetch(`${API_URL}/api/attendance/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      const data = await response.json();

      if (!data.ok) {
        setMessage({ type: 'error', text: data.data?.message || data.error || 'Action failed' });
      } else {
        setMessage({ type: 'success', text: type === 'check-in' ? 'Check in successful' : 'Check out successful' });
        await fetchToday();
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Request failed. Please retry.' });
    } finally {
      setBusy(false);
    }
  };

  const normalizedStatus = today.status?.toLowerCase();
  const statusText = normalizedStatus === 'present' || normalizedStatus === 'late' ? 'Present' : today.status;

  return (
    <EmployeeLayout title="Dashboard">
      <div className="space-y-4">
        <div className="rounded-2xl border border-blue-100 bg-white p-4">
          <p className="text-sm text-slate-600">Today Status</p>
          <p className="mt-1 text-2xl font-bold text-blue-700">{statusText}</p>
          <p className="mt-2 text-sm text-slate-600">
            {today.checked_in ? 'Checked In' : 'Not Checked In'} | {today.checked_out ? 'Checked Out' : 'Not Checked Out'}
          </p>
        </div>

        {message && (
          <div className={`rounded-xl border px-4 py-3 text-sm ${message.type === 'success' ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <div className="rounded-2xl border border-blue-100 bg-white p-4">
          <p className="text-sm font-semibold text-slate-700">Select Mode</p>
          <div className="mt-3 grid grid-cols-1 gap-3">
            <button
              type="button"
              onClick={() => {
                setMode('OFFICE');
                setCoords(null);
                setDistanceText('');
              }}
              className={`rounded-xl border px-4 py-4 text-left text-base font-semibold ${mode === 'OFFICE' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-700'}`}
            >
              Work From Office
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('REMOTE');
                setCoords(null);
                setDistanceText('');
              }}
              className={`rounded-xl border px-4 py-4 text-left text-base font-semibold ${mode === 'REMOTE' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-700'}`}
            >
              Work From Home
            </button>
          </div>
        </div>

        {mode === 'OFFICE' && (
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <button
              type="button"
              onClick={getLocation}
              disabled={locating}
              className="w-full rounded-xl bg-blue-600 px-4 py-4 text-base font-bold text-white disabled:bg-blue-400"
            >
              {locating ? 'Requesting GPS...' : 'Request GPS Location'}
            </button>
            {distanceText && (
              <p className={`mt-3 rounded-lg px-3 py-2 text-sm font-semibold ${distanceText.includes('Valid') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {distanceText}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => submitAttendance('check-in')}
            disabled={busy || today.checked_in || !mode || (mode === 'OFFICE' && !coords)}
            className="h-14 rounded-xl bg-blue-600 text-lg font-bold text-white disabled:bg-slate-300"
          >
            CHECK IN
          </button>
          <button
            type="button"
            onClick={() => submitAttendance('check-out')}
            disabled={busy || !today.checked_in || today.checked_out || !mode || (mode === 'OFFICE' && !coords)}
            className="h-14 rounded-xl bg-slate-800 text-lg font-bold text-white disabled:bg-slate-300"
          >
            CHECK OUT
          </button>
        </div>
      </div>
    </EmployeeLayout>
  );
}
