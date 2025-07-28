import React, { createContext, useContext, useState, ReactNode } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  success: (title: string, message?: string, options?: Partial<Notification>) => void;
  error: (title: string, message?: string, options?: Partial<Notification>) => void;
  warning: (title: string, message?: string, options?: Partial<Notification>) => void;
  info: (title: string, message?: string, options?: Partial<Notification>) => void;
  dismiss: (id: string) => void;
  clear: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (
    type: NotificationType,
    title: string,
    message?: string,
    options?: Partial<Notification>
  ) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const duration = options?.duration ?? 5000;

    const notification: Notification = {
      id,
      type,
      title,
      message,
      duration,
      ...options
    };

    setNotifications(prev => [notification, ...prev]);

    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }
  };

  const success = (title: string, message?: string, options?: Partial<Notification>) => {
    addNotification('success', title, message, options);
  };

  const error = (title: string, message?: string, options?: Partial<Notification>) => {
    addNotification('error', title, message, { duration: 7000, ...options });
  };

  const warning = (title: string, message?: string, options?: Partial<Notification>) => {
    addNotification('warning', title, message, options);
  };

  const info = (title: string, message?: string, options?: Partial<Notification>) => {
    addNotification('info', title, message, options);
  };

  const dismiss = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clear = () => {
    setNotifications([]);
  };

  const value: NotificationContextType = {
    notifications,
    success,
    error,
    warning,
    info,
    dismiss,
    clear
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};