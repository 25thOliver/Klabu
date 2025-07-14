import { createContext, useState, useContext, useCallback } from "react";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const generateUniqueId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const addNotification = useCallback(({ type = "info", message, title, duration = 5000, id = generateUniqueId() }) => {
    const notification = { id, type, message, title, duration };
    setNotifications(prev => [...prev, notification]);

    // Auto-remove notification after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods
  const success = useCallback((message, title = "Success") => {
    addNotification({ type: "success", message, title });
  }, [addNotification]);

  const error = useCallback((message, title = "Error") => {
    addNotification({ type: "error", message, title });
  }, [addNotification]);

  const warning = useCallback((message, title = "Warning") => {
    addNotification({ type: "warning", message, title });
  }, [addNotification]);

  const info = useCallback((message, title = "Info") => {
    addNotification({ type: "info", message, title });
  }, [addNotification]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      clearAll,
      success,
      error,
      warning,
      info
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}; 