import React, { useState, useEffect } from 'react';
import '../components/Notification.css';

const Notification = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  // Xác định màu sắc dựa trên type
  const typeStyles = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-black',
    info: 'bg-blue-500 text-white',
  };

  return (
    <div
      className={`notification fixed top-20 right-5 min-w-[200px] max-w-sm p-4 rounded-lg shadow-lg flex items-center justify-between ${typeStyles[type]}`}
    >
      <span className="text-sm">{message}</span>
      <button
        className="ml-3 text-lg font-medium hover:opacity-80 transition-opacity"
        onClick={() => {
          setIsVisible(false);
          if (onClose) onClose();
        }}
      >
        ×
      </button>
    </div>
  );
};

export default Notification;