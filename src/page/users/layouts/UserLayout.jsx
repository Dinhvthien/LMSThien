import React from 'react';
import Navbar from '../../users/components/Navbar'; // Adjust path based on your project structure
import Footer from '../../users/components/Footer'; 
const UserLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="pt-16">{children}</main>
      <Footer/>
    </div>
  );
};

export default UserLayout;