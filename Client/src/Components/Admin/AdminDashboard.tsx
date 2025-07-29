import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SideNavbar from "./SideNavbar";
import api from "../../axiosConfig";
import UsersView from "./UsersView";
import PostsView from "./PostsView";

const AdminDashboard: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentView, setCurrentView] = useState<
    "dashboard" | "users" | "posts"
  >("dashboard");

  const navigate = useNavigate();
  const location = useLocation();

  const fetchData = async () => {
    try {
      const userResponse = await api.get(`/admin`);
      setTotalUsers(userResponse.data.totalUsers);

      const postResponse = await api.get(`/admin/getAllposts`);
      setTotalPosts(postResponse.data.totalPosts);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const view = params.get("view") as "dashboard" | "users" | "posts";
    if (view) {
      setCurrentView(view);
    } else {
      navigate("/admin/dashboard?view=dashboard", { replace: true });
    }
  }, [location.search, navigate]);

  useEffect(() => {
    fetchData();
  }, [currentView]);

  return (
    <div className="flex h-screen bg-gray-100">
      <SideNavbar
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          navigate(`/admin/dashboard?view=${view}`);
        }}
        fetchUsers={fetchData}
        fetchPosts={fetchData}
      />
      <div className="main-content flex-1 p-6 md:p-10 bg-gray-50 overflow-y-auto">
        {currentView === "dashboard" ? (
          <>
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                Admin Dashboard
              </h2>
              <p className="text-gray-500 mt-2">
                Welcome back! Here's an overview of this platform stats.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Total Users
                </h3>
                <p className="text-3xl font-bold text-indigo-600">
                  {totalUsers}
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Total Posts
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  {totalPosts}
                </p>
              </div>
            </div>

            {/* Add more cards/metrics below if needed */}
          </>
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
