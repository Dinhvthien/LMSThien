import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { adminRoutes } from './page/admins/routers/adminRoutes';
import { userRoutes } from './page/users/routers/userRoutes';
import { AuthProvider } from './page/shared/context/AuthContext';
import { NotificationProvider } from './page/shared/context/NotificationContext';
import AccessDeniedPage from './page/users/pages/AccessDeniedPage';

function App() {
  return (
  <AuthProvider>
      <NotificationProvider>
        <Routes>  
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/access-denied" element={<AccessDeniedPage />} />
          {adminRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          {userRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          <Route path="*" element={<div>404 - Trang không tồn tại</div>} />
        </Routes>
      </NotificationProvider>
      </AuthProvider>
  );
}

export default App;