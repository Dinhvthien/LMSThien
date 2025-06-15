import { NavLink } from "react-router-dom";
import { Menu, ChevronLeft } from "@mui/icons-material";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  return (
    <div
      className={`h-screen bg-black text-white fixed top-0 left-0 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="p-7 flex justify-between items-center">
        {!isCollapsed && <h2 className="text-xl text-amber-50 font-bold">Admin</h2>}
        <button onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <Menu /> : <ChevronLeft />}
        </button>
      </div>
      <nav className="mt-8">
        <ul>
          <li>
            <NavLink
              to="/admin/dashboard"
              end
              className={({ isActive }) =>
                `block p-4 hover:bg-gray-800 ${isActive ? "bg-gray-700" : ""}`
              }
            >
              <span className="text-2xl w-8 pr-3">🏠</span>
              {!isCollapsed && <span>Dashboard</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `block p-4 hover:bg-gray-800 ${isActive ? "bg-gray-700" : ""}`
              }
            >
              <span className="text-2xl w-8 pr-3 ">👥</span>
              {!isCollapsed && <span>Users</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/courses"
              className={({ isActive }) =>
                `block p-4 hover:bg-gray-800 ${isActive ? "bg-gray-700" : ""}`
              }
            >
              <span className="text-2xl w-8 pr-3 ">📚</span>
              {!isCollapsed && <span>Courses</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/settings"
              className={({ isActive }) =>
                `block p-4 hover:bg-gray-800 ${isActive ? "bg-gray-700" : ""}`
              }
            >
              <span className="text-2xl w-8 pr-3">⚙️</span>
              {!isCollapsed && <span>Settings</span>}
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
