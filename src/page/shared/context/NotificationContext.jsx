// src/context/NotificationContext.js
import React, { createContext, useState, useCallback, useContext } from 'react';
import Notification from '../components/Notification';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = 'info', duration = 3000) => {
    setNotification({ message, type, duration });
  }, []);

  const handleClose = () => setNotification(null);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={handleClose}
        />
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
