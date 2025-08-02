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
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Your Posts</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link
            to="/profile/addPost"
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FaPlus /> New Post
          </Link>

          {posts.length > 0 && (
            <button
              onClick={() => setConfirmDeleteAll(true)}
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaTrash /> Clear All
            </button>
          )}
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <SuccessMessage
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <h3 className="text-xl font-medium text-gray-500 mb-4">
            You haven't created any posts yet
          </h3>
          <Link
            to="/profile/addPost"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            <FaPlus /> Create Your First Post
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

                  {/* Actions */}
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

          {/* Load More */}
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

      {/* Delete Confirmation Modals */}
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
