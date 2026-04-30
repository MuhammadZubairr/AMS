/**
 * Office Location Configuration
 * Store office coordinates and allowed radius
 */

const OFFICE_CONFIG = {
  latitude: 31.503586,
  longitude: 74.433875,
  radius: 200, // meters
  timezone: 'Asia/Karachi',
  lateTime: '09:15', // After 9:15 AM is marked as LATE
};

module.exports = OFFICE_CONFIG;
