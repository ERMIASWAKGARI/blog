import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTachometerAlt,
  FaUsers,
  FaClipboardList,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

interface SideNavbarProps {
  currentView: "dashboard" | "users" | "posts";
  setCurrentView: (view: "dashboard" | "users" | "posts") => void;
  fetchUsers: () => void;
  fetchPosts?: () => void;
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}

const SideNavbar: React.FC<SideNavbarProps> = ({
  currentView,
  setCurrentView,
  fetchUsers,
  fetchPosts,
  collapsed,
  setCollapsed,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/admin/login");
  };

  const navItems = [
    {
      label: "Dashboard",
      icon: <FaTachometerAlt />,
      action: () => {
        setCurrentView("dashboard");
        navigate("/admin/dashboard");
      },
      key: "dashboard",
    },
    {
      label: "Users",
      icon: <FaUsers />,
      action: () => {
        setCurrentView("users");
        fetchUsers();
      },
      key: "users",
    },
    {
      label: "Posts",
      icon: <FaClipboardList />,
      action: () => {
        setCurrentView("posts");
        fetchPosts && fetchPosts();
      },
      key: "posts",
    },
    {
      label: "Settings",
      icon: <FaCog />,
      action: () => {},
      key: "settings",
    },
    {
      label: "Logout",
      icon: <FaSignOutAlt />,
      action: handleLogout,
      key: "logout",
    },
  ];

  return (
    <div
      className={`fixed top-0 left-0 bottom-0 bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg z-50
        transition-all duration-300 ease-in-out ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* Top Section */}
      <div className="flex items-center justify-between h-20 px-4 border-b border-gray-700 bg-gray-900">
        {!collapsed && (
          <span className="text-white text-xl font-bold">Admin</span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white focus:outline-none ml-auto"
        >
          <FaBars className="w-5 h-5" />
        </button>
      </div>

      {/* Nav Items */}
      <nav className="mt-4 flex flex-col gap-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={item.action}
            className={`flex items-center ${
              collapsed ? "justify-center" : "justify-start"
            } gap-4 py-3 px-4 w-full text-sm
              ${
                currentView === item.key
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }
              transition-all duration-200 ease-in-out`}
          >
            <span className="text-lg">{item.icon}</span>
            {!collapsed && (
              <span className="whitespace-nowrap">{item.label}</span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default SideNavbar;
