import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../../services/logout'; // Đường dẫn đến logout.js

const UserInfoLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('profile');
  const [activeMobileMenu, setActiveMobileMenu] = useState(false);

  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const currentPath = pathParts[pathParts.length - 1];
    if (currentPath === 'profile') setActiveTab('profile');
    else if (currentPath === 'purchased-courses') setActiveTab('courses');
    else if (currentPath === 'orders') setActiveTab('orders');
    else if (currentPath === 'settings') setActiveTab('settings');
  }, [location.pathname]);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await logout(token); // Gọi hàm logout từ services
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  // Danh sách menu sidebar
  const menuItems = [
    { id: 'profile', label: 'Thông tin cá nhân', path: '/user/profile' },
    { id: 'courses', label: 'Khóa học đã mua', path: '/user/purchased-courses' },
  ];

  const handleMenuClick = (path) => {
    navigate(path);
    setActiveMobileMenu(false); // Đóng menu trên mobile khi chọn menu item
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-mono-950 pb-20">
      {/* Mobile Menu Toggle */}
      <div className="md:hidden bg-white p-4 shadow">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Tài khoản của tôi</h2>
          <button
            onClick={() => setActiveMobileMenu(!activeMobileMenu)}
            className="text-gray-600 hover:text-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {activeMobileMenu ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Sidebar - Desktop always visible, Mobile conditionally visible */}
      <div
        className={`${
          activeMobileMenu ? 'block' : 'hidden'
        } md:block md:w-64 bg-white shadow-md md:min-h-screen`}
      >
        <div className="p-6">
          {/* Menu Items */}
          <nav className="mt-8">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleMenuClick(item.path)}
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="mt-auto pt-8">
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-8">{children}</div>
    </div>
  );
};

export default UserInfoLayout;