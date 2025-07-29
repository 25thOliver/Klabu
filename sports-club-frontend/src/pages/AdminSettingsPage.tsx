import React, { useState } from 'react';

const AdminSettingsPage = () => {
  // State for club info (replace with real data integration)
  const [clubInfo, setClubInfo] = useState({
    name: '',
    address: '',
    contact: '',
  });
  // State for password change
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  // State for notification preferences
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
  });

  // Handlers (replace with real API calls)
  const handleClubInfoChange = (e) => {
    setClubInfo({ ...clubInfo, [e.target.name]: e.target.value });
  };
  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };
  const handleNotificationsChange = (e) => {
    setNotifications({ ...notifications, [e.target.name]: e.target.checked });
  };
  const handleSaveClubInfo = (e) => {
    e.preventDefault();
    alert('Club info saved (mock)!');
  };
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert('New passwords do not match!');
      return;
    }
    alert('Password changed (mock)!');
  };
  const handleSaveNotifications = (e) => {
    e.preventDefault();
    alert('Notification preferences saved (mock)!');
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      {/* Club Info */}
      <form className="mb-8 bg-white p-6 rounded shadow" onSubmit={handleSaveClubInfo}>
        <h2 className="text-lg font-semibold mb-4">Club Information</h2>
        <input
          className="border p-2 mb-3 w-full rounded"
          type="text"
          name="name"
          placeholder="Club Name"
          value={clubInfo.name}
          onChange={handleClubInfoChange}
          required
        />
        <input
          className="border p-2 mb-3 w-full rounded"
          type="text"
          name="address"
          placeholder="Address"
          value={clubInfo.address}
          onChange={handleClubInfoChange}
        />
        <input
          className="border p-2 mb-4 w-full rounded"
          type="text"
          name="contact"
          placeholder="Contact Info"
          value={clubInfo.contact}
          onChange={handleClubInfoChange}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
          Save Club Info
        </button>
      </form>
      {/* Change Password */}
      <form className="mb-8 bg-white p-6 rounded shadow" onSubmit={handleChangePassword}>
        <h2 className="text-lg font-semibold mb-4">Change Password</h2>
        <input
          className="border p-2 mb-3 w-full rounded"
          type="password"
          name="current"
          placeholder="Current Password"
          value={passwords.current}
          onChange={handlePasswordChange}
          required
        />
        <input
          className="border p-2 mb-3 w-full rounded"
          type="password"
          name="new"
          placeholder="New Password"
          value={passwords.new}
          onChange={handlePasswordChange}
          required
        />
        <input
          className="border p-2 mb-4 w-full rounded"
          type="password"
          name="confirm"
          placeholder="Confirm New Password"
          value={passwords.confirm}
          onChange={handlePasswordChange}
          required
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
          Change Password
        </button>
      </form>
      {/* Notification Preferences */}
      <form className="bg-white p-6 rounded shadow" onSubmit={handleSaveNotifications}>
        <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
        <label className="flex items-center mb-3">
          <input
            type="checkbox"
            name="email"
            checked={notifications.email}
            onChange={handleNotificationsChange}
            className="mr-2"
          />
          Email Notifications
        </label>
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            name="sms"
            checked={notifications.sms}
            onChange={handleNotificationsChange}
            className="mr-2"
          />
          SMS Notifications
        </label>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">
          Save Preferences
        </button>
      </form>
    </div>
  );
};

export default AdminSettingsPage;
