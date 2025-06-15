import React from 'react';
import Sidebar from '../components/Sidebar';
import { useState } from 'react';
import Header from '../components/Header';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import parseJwt from '../../../utils/parseJwt';


const AdminLayout = ({ children }) => {
   const [isCollapsed, setIsCollapsed] = useState(false);
     const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Nếu không có token hoặc không phải ROLE_ADMIN thì redirect
    const userInfo = parseJwt(token);
    if (userInfo?.scope === 'ROLE_USER') {
          navigate('/access-denied');
    }
  }, [navigate]);
  return (
    <div>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed}/>
      <Header  isCollapsed={isCollapsed}/>
      <div   className={`transition-all duration-300 flex-1 ${
          isCollapsed ? 'ml-20' : 'ml-64'
        } p-4 mt-15`}>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;