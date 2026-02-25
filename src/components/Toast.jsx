import React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export const Toast = () => {
  const { notifications, removeNotification } = useNotification();

  const getStyle = (type) => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 text-green-800 shadow-lg hover:shadow-xl';
      case 'error':
        return 'bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 text-red-800 shadow-lg hover:shadow-xl';
      case 'warning':
        return 'bg-gradient-to-r from-amber-50 to-amber-100 border-l-4 border-amber-500 text-amber-800 shadow-lg hover:shadow-xl';
      default:
        return 'bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 text-blue-800 shadow-lg hover:shadow-xl';
    }
  };

  const getIcon = (type) => {
    const iconClass = 'w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0';
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconClass} text-green-600`} />;
      case 'error':
        return <AlertCircle className={`${iconClass} text-red-600`} />;
      case 'warning':
        return <AlertTriangle className={`${iconClass} text-amber-600`} />;
      default:
        return <Info className={`${iconClass} text-blue-600`} />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm sm:max-w-md pointer-events-none px-3 sm:px-0">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-start gap-3 p-4 sm:p-5 rounded-lg border pointer-events-auto transition-all duration-300 animate-slide-up backdrop-blur-sm ${getStyle(
            notification.type
          )}`}
        >
          {getIcon(notification.type)}
          <span className="flex-1 text-sm sm:text-base font-semibold leading-relaxed">
            {notification.message}
          </span>
          <button
            onClick={() => removeNotification(notification.id)}
            className="ml-2 p-1 hover:bg-white/30 rounded transition-all flex-shrink-0"
            aria-label="Close notification"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
