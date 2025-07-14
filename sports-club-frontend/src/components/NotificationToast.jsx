import { useNotification } from "../context/NotificationContext";

const NotificationToast = () => {
  const { notifications, removeNotification } = useNotification();

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "⚠";
      case "info":
        return "ℹ";
      default:
        return "ℹ";
    }
  };

  const getStyles = (type) => {
    const baseStyles = "flex items-center p-4 mb-2 rounded-lg shadow-lg transition-all duration-300 animate-slide-in-right";
    
    switch (type) {
      case "success":
        return `${baseStyles} bg-green-100 border-l-4 border-green-500 text-green-700`;
      case "error":
        return `${baseStyles} bg-red-100 border-l-4 border-red-500 text-red-700`;
      case "warning":
        return `${baseStyles} bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700`;
      case "info":
        return `${baseStyles} bg-blue-100 border-l-4 border-blue-500 text-blue-700`;
      default:
        return `${baseStyles} bg-gray-100 border-l-4 border-gray-500 text-gray-700`;
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-96 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={getStyles(notification.type)}
        >
          <div className="flex-shrink-0 mr-3 text-lg font-bold">
            {getIcon(notification.type)}
          </div>
          <div className="flex-1">
            {notification.title && (
              <div className="font-semibold text-sm">{notification.title}</div>
            )}
            <div className="text-sm">{notification.message}</div>
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast; 