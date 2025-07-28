import React from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Notification, NotificationType, useNotification } from '@/context/NotificationContext';
import { Button } from './button';

interface NotificationToastProps {
  notification: Notification;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'error':
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case 'info':
      return <Info className="h-5 w-5 text-blue-500" />;
    default:
      return <Info className="h-5 w-5 text-blue-500" />;
  }
};

const getNotificationStyles = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20';
    case 'error':
      return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20';
    case 'warning':
      return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20';
    case 'info':
      return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20';
    default:
      return 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/20';
  }
};

export const NotificationToast: React.FC<NotificationToastProps> = ({ notification }) => {
  const { dismiss } = useNotification();

  return (
    <div
      className={cn(
        'relative w-full max-w-sm rounded-lg border p-4 shadow-lg transition-all duration-300 ease-in-out',
        'transform animate-in slide-in-from-top-2',
        getNotificationStyles(notification.type)
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getNotificationIcon(notification.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-foreground">
            {notification.title}
          </h4>
          {notification.message && (
            <p className="mt-1 text-sm text-muted-foreground">
              {notification.message}
            </p>
          )}
          
          {notification.action && (
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  notification.action?.onClick();
                  dismiss(notification.id);
                }}
              >
                {notification.action.label}
              </Button>
            </div>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full"
          onClick={() => dismiss(notification.id)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export const NotificationContainer: React.FC = () => {
  const { notifications } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-h-screen overflow-y-auto">
      {notifications.map((notification) => (
        <NotificationToast key={notification.id} notification={notification} />
      ))}
    </div>
  );
};