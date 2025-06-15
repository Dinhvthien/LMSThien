const Header = ({ isCollapsed }) => {
  return (
    <div
      className={`bg-white shadow p-4 flex justify-between items-center fixed top-0 z-10 transition-all duration-300 ${
        isCollapsed ? 'left-20' : 'left-64'
      } right-0`}
    >
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      <div className="flex items-center space-x-4">
        <span className="text-gray-600">Admin User</span>
        <button className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>
    </div>
  );
};

export default Header;
