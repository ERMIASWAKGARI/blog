import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SideNavbar from "./SideNavbar";
import api from "../../axiosConfig";
import UsersView from "./UsersView";
import PostsView from "./PostsView";
import { FiUsers, FiFileText, FiActivity, FiTrendingUp } from "react-icons/fi";

const AdminDashboard: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<
    "dashboard" | "users" | "posts"
  >("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const fetchData = async (view: "dashboard" | "users" | "posts") => {
    setLoading(true);
    try {
      const [userResponse, postResponse, activityResponse] = await Promise.all([
        api.get(`/admin`),
        api.get(`/admin/getAllposts`),
        view === "dashboard"
          ? api.get(`/admin/recent-activity`)
          : Promise.resolve({ data: { activities: [] } }),
      ]);

      setTotalUsers(userResponse.data.totalUsers);
      setTotalPosts(postResponse.data.totalPosts);
      setActiveUsers(userResponse.data.activeUsers || 0);

      // Only set recent activity if we're on the dashboard view
      if (view === "dashboard") {
        setRecentActivity(activityResponse.data.activities || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const view = params.get("view") as "dashboard" | "users" | "posts";
    if (view && view !== currentView) {
      setCurrentView(view);
      fetchData(view);
    } else if (!view) {
      navigate("/admin/dashboard?view=dashboard", { replace: true });
    }
  }, [location.search]);

  const handleViewChange = (view: "dashboard" | "users" | "posts") => {
    navigate(`/admin/dashboard?view=${view}`);
    // Don't setCurrentView here - let the useEffect handle it
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SideNavbar
        currentView={currentView}
        setCurrentView={handleViewChange}
        fetchUsers={() => fetchData("users")}
        fetchPosts={() => fetchData("posts")}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 flex-1 ${
          sidebarCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        {currentView === "dashboard" ? (
          <div className="p-6 md:p-8 lg:p-10">
            {/* Header */}
            <div className="mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    Dashboard Overview
                  </h1>
                  <p className="text-gray-500 mt-2">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <button
                  onClick={() => fetchData(currentView)}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <FiActivity className="mr-2" />
                  Refresh Data
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border-l-4 border-indigo-500">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                    <FiUsers size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total Users
                    </p>
                    {loading ? (
                      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mt-1"></div>
                    ) : (
                      <p className="text-2xl font-bold text-gray-800">
                        {totalUsers.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border-l-4 border-green-500">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                    <FiFileText size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total Posts
                    </p>
                    {loading ? (
                      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mt-1"></div>
                    ) : (
                      <p className="text-2xl font-bold text-gray-800">
                        {totalPosts.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border-l-4 border-blue-500">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                    <FiUsers size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Active Users
                    </p>
                    {loading ? (
                      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mt-1"></div>
                    ) : (
                      <p className="text-2xl font-bold text-gray-800">
                        {activeUsers.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border-l-4 border-purple-500">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                    <FiTrendingUp size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Growth Rate
                    </p>
                    {loading ? (
                      <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mt-1"></div>
                    ) : (
                      <p className="text-2xl font-bold text-gray-800">
                        {totalUsers > 0
                          ? `${Math.round((activeUsers / totalUsers) * 100)}%`
                          : "0%"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Recent Activity
                </h3>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="h-12 bg-gray-200 rounded animate-pulse"
                      ></div>
                    ))}
                  </div>
                ) : recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-start pb-4 border-b border-gray-100 last:border-0"
                      >
                        <div className="p-2 rounded-full bg-indigo-100 text-indigo-600 mr-3">
                          {activity.type === "user" ? (
                            <FiUsers size={16} />
                          ) : (
                            <FiFileText size={16} />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">
                            {activity.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No recent activity found</p>
                  </div>
                )}
              </div>

              {/* Quick Stats Chart (Placeholder) */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  User Growth
                </h3>
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                  <p className="text-gray-500">
                    Chart visualization would appear here
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : currentView === "users" ? (
          <UsersView />
        ) : (
          <PostsView />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
