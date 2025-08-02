import React, { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaStar } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import SuccessMessage from "./SuccessMessage";
import api from "../../../axiosConfig";
import moment from "moment";

interface Post {
  _id: string;
  title: string;
  author: string;
  category: string;
  createdAt: string;
  averageRating: number;
  textContent: string;
  imagePath: string;
  videoContent?: string;
}

const UserPosts: React.FC<{
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
}> = ({ posts, setPosts }) => {
  const [visiblePostsCount, setVisiblePostsCount] = useState(4);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const navigate = useNavigate();

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleLoadMore = () => setVisiblePostsCount((prev) => prev + 4);
  const handleEdit = (postId: string) =>
    navigate(`/profile/editPost/${postId}`);

  const handleDelete = async (postId: string) => {
    try {
      await api.delete(`/post/deletePost/${postId}`);
      setPosts((prev) => prev.filter((post) => post._id !== postId));
      setSuccessMessage("Post deleted successfully!");
      setPostToDelete(null);
    } catch (error) {
      console.error(
        "Error deleting post:",
        axios.isAxiosError(error) ? error.response?.data : error
      );
    }
  };

  const handleDeleteAllPosts = async () => {
    try {
      await api.delete("/post/deleteAllMyPost");
      setPosts([]);
      setSuccessMessage("All posts deleted successfully!");
      setConfirmDeleteAll(false);
    } catch (error) {
      console.error(
        "Error deleting all posts:",
        axios.isAxiosError(error) ? error.response?.data : error
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Your Posts</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {posts.length > 0 && (
            <>
              <Link
                to="/profile/addPost"
                className="flex items-center justify-center gap-2
                   bg-gradient-to-r from-indigo-600 to-purple-600
                   hover:from-indigo-700 hover:to-purple-700
                   text-white font-medium text-sm
                   px-4 py-2.5 rounded-lg
                   shadow-sm hover:shadow-md
                   transition-all duration-200 scale-[0.95] hover:scale-[1]"
              >
                <FaPlus className="h-4 w-4" />
                <span>New Post</span>
              </Link>

              <button
                onClick={() => setConfirmDeleteAll(true)}
                className="flex items-center justify-center gap-2
                   bg-red-500 hover:bg-red-600
                   text-white font-medium text-sm
                   px-4 py-2.5 rounded-lg
                   shadow-sm hover:shadow-md
                   transition-all duration-200 scale-[0.95] hover:scale-[1]"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>{" "}
                <span>Clear All</span>
              </button>
            </>
          )}
        </div>
      </div>

      {successMessage && (
        <SuccessMessage
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}

      {posts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <h3 className="text-xl font-medium text-gray-500 mb-4">
            You haven't created any posts yet
          </h3>
          <Link
            to="/profile/addPost"
            className="inline-flex items-center gap-2.5
             bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700
             text-white font-medium text-sm sm:text-base
             px-5 py-2.5 sm:px-6 sm:py-3
             rounded-lg shadow-sm
             hover:shadow-md hover:scale-[1.02]
             active:scale-[0.98]
             focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
             transition-all duration-200 ease-in-out"
          >
            <FaPlus className="h-4 w-4" />
            <span>Create Your First Post</span>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {sortedPosts.slice(0, visiblePostsCount).map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Media */}
                {post.imagePath ? (
                  <img
                    src={post.imagePath}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                ) : post.videoContent ? (
                  <video controls className="w-full h-48 object-cover bg-black">
                    <source src={post.videoContent} type="video/mp4" />
                  </video>
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">No media</span>
                  </div>
                )}

                {/* Content */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                      {post.title}
                    </h3>
                    <span className="flex items-center text-amber-500 bg-amber-50 px-2 py-1 rounded-full text-sm">
                      <FaStar className="mr-1" />
                      {post.averageRating.toFixed(1)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>{post.category}</span>
                    <span>{moment(post.createdAt).fromNow()}</span>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.textContent}
                  </p>

                  <div className="flex justify-between items-center border-t pt-4">
                    <Link
                      to={`/post/${post._id}`}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      View Details
                    </Link>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(post._id)}
                        className="text-gray-600 hover:text-indigo-600 p-2 rounded-full hover:bg-indigo-50"
                        aria-label="Edit post"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => setPostToDelete(post._id)}
                        className="text-gray-600 hover:text-red-600 p-2 rounded-full hover:bg-red-50"
                        aria-label="Delete post"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {visiblePostsCount < posts.length && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleLoadMore}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-lg transition-colors"
              >
                Load More Posts
              </button>
            </div>
          )}
        </>
      )}

      {postToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Delete Post?
            </h3>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. Are you sure you want to delete this
              post?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPostToDelete(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(postToDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteAll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Delete All Posts?
            </h3>
            <p className="text-gray-600 mb-6">
              This will permanently delete all your posts. This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteAll(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAllPosts}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPosts;
