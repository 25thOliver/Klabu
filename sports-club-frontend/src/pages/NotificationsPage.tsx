import React, { useState } from 'react';

// Mock notifications (replace with real data integration)
const initialNotifications = [
  { id: 1, type: 'info', message: 'Welcome to the club!', date: '2024-06-01', read: false },
  { id: 2, type: 'success', message: 'Your payment was successful.', date: '2024-06-02', read: false },
  { id: 3, type: 'warning', message: 'Your membership is about to expire.', date: '2024-06-03', read: true },
  { id: 4, type: 'error', message: 'Failed to book the tennis court.', date: '2024-06-04', read: false },
];

const typeStyles = {
  info: 'bg-blue-100 text-blue-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };
  const markAsUnread = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: false } : n));
  };
  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <button
        className="bg-gray-200 px-4 py-2 rounded mb-4 hover:bg-gray-300"
        onClick={clearAll}
        disabled={notifications.length === 0}
      >
        Clear All
      </button>
      <ul>
        {notifications.length === 0 && <li className="text-gray-500">No notifications.</li>}
        {notifications.map(n => (
          <li
            key={n.id}
            className={`mb-3 p-4 border rounded flex items-center justify-between ${typeStyles[n.type]} ${n.read ? 'opacity-60' : ''}`}
          >
            <div>
              <div className="font-medium">{n.message}</div>
              <div className="text-xs text-gray-600">{n.date}</div>
            </div>
            <div className="flex gap-2 items-center">
              {n.read ? (
                <button
                  className="text-blue-600 underline text-xs"
                  onClick={() => markAsUnread(n.id)}
                >
                  Mark as Unread
                </button>
              ) : (
                <button
                  className="text-green-600 underline text-xs"
                  onClick={() => markAsRead(n.id)}
                >
                  Mark as Read
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsPage;
