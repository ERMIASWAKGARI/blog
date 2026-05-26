/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import api from "../../axiosConfig";

interface RatingProps {
  postId: string | undefined;
  user: any;
}

const Rating: React.FC<RatingProps> = ({ postId, user }) => {
  const [userRating, setUserRating] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [ratingQuantity, setRatingQuantity] = useState<number>(0);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [isAuthor, setIsAuthor] = useState<boolean>(false);
  const [ratingId, setRatingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRatingData = async () => {
      if (!postId || !user?._id) return;

      try {
        setLoading(true);

        // Fetch post data including ratings
        const postResponse = await api.get(`/post/getPost/${postId}`);
        const post = postResponse.data.data.post;

        setAverageRating(post.averageRating || 0);
        setRatingQuantity(post.ratingQuantity || 0);
        setIsAuthor(String(post.user?._id) === String(user._id));

        // Fetch user's specific rating using the new endpoint
        try {
          const userRatingResponse = await api.get(`/rating/user/${postId}`);
          const userRatingData = userRatingResponse.data.data.data;

          if (userRatingData) {
            setUserRating(userRatingData.rating);
            setRatingId(userRatingData._id);
          } else {
            setUserRating(null);
            setRatingId(null);
          }
        } catch (error) {
          // If no rating found, this is normal
          setUserRating(null);
          setRatingId(null);
        }
      } catch (error) {
        console.error("Error fetching rating data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatingData();
  }, [postId, user?._id]);

  const renderStars = (rating: number, interactive: boolean = false) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (interactive) {
        // Interactive stars for rating modal
        stars.push(
          <button
            key={i}
            onClick={() => setSelectedRating(i)}
            className="focus:outline-none"
          >
            {i <= selectedRating ? (
              <FaStar className="w-8 h-8 text-yellow-400 cursor-pointer hover:scale-110 transition-transform duration-200" />
            ) : (
              <FaRegStar className="w-8 h-8 text-yellow-400 cursor-pointer hover:scale-110 transition-transform duration-200" />
            )}
          </button>,
        );
      } else {
        // Display stars for showing ratings
        if (i <= Math.floor(rating)) {
          stars.push(<FaStar key={i} className="w-6 h-6 text-yellow-400" />);
        } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
          stars.push(
            <FaStarHalfAlt key={i} className="w-6 h-6 text-yellow-400" />,
          );
        } else {
          stars.push(<FaRegStar key={i} className="w-6 h-6 text-yellow-400" />);
        }
      }
    }
    return stars;
  };

  const openRatingModal = () => {
    setSelectedRating(userRating || 0);
    setShowRatingModal(true);
  };

  const closeRatingModal = () => {
    setShowRatingModal(false);
  };

  const submitRating = async () => {
    if (!postId || !user?._id || selectedRating === 0) return;

    try {
      setLoading(true);
      const ratingData = {
        post: postId,
        rating: selectedRating,
      };

      let response;

      if (userRating === null) {
        // Create new rating
        response = await api.post(`/rating`, ratingData);
        setRatingId(response.data.data.data._id);
      } else {
        // Update existing rating
        response = await api.patch(`/rating/${ratingId}`, ratingData);
      }

      // Update local state
      setUserRating(selectedRating);
      setShowRatingModal(false);

      // Refresh post data to get updated averages
      const postResponse = await api.get(`/post/getPost/${postId}`);
      const post = postResponse.data.data.post;
      setAverageRating(post.averageRating || 0);
      setRatingQuantity(post.ratingQuantity || 0);
    } catch (error: any) {
      console.error("Error submitting rating:", error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteRating = async () => {
    if (!ratingId) return;

    try {
      setLoading(true);
      await api.delete(`/rating/${ratingId}`);

      // Update local state
      setUserRating(null);
      setRatingId(null);
      setShowDeleteModal(false);

      // Refresh post data
      const response = await api.get(`/post/getPost/${postId}`);
      const post = response.data.data.post;
      setAverageRating(post.averageRating || 0);
      setRatingQuantity(post.ratingQuantity || 0);
    } catch (error) {
      console.error("Error deleting rating:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !userRating && !averageRating) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Average Rating Display */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Community Rating
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {renderStars(averageRating)}
                <span className="text-2xl font-bold text-gray-900 ml-2">
                  {averageRating.toFixed(1)}
                </span>
              </div>
              <div className="text-gray-600">
                <span className="font-semibold">{ratingQuantity}</span>
                {ratingQuantity === 1 ? " rating" : " ratings"}
              </div>
            </div>
          </div>

          {ratingQuantity > 0 && (
            <div className="text-right">
              <div className="text-sm text-gray-600">Distribution</div>
              <div className="text-lg font-bold text-purple-600">
                {((averageRating / 5) * 100).toFixed(0)}% Positive
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Rating Section - Only show if user is not the author */}
      {!isAuthor && user?._id && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Your Rating
          </h3>

          {userRating !== null ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                {renderStars(userRating)}
                <span className="text-lg font-semibold text-gray-900">
                  {userRating.toFixed(1)}
                </span>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={openRatingModal}
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-6 py-2 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Update Rating
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  disabled={loading}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-2 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-gray-600">You haven't rated this post yet.</p>
              <button
                onClick={openRatingModal}
                disabled={loading}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Your Rating
              </button>
            </div>
          )}
        </div>
      )}

      {/* Show message if user is author */}
      {isAuthor && (
        <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
          <p className="text-yellow-800 text-center">
            You cannot rate your own post.
          </p>
        </div>
      )}

      {/* Show message if user is not logged in */}
      {!user?._id && (
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
          <p className="text-blue-800 text-center">
            Please log in to rate this post.
          </p>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {userRating === null ? "Add Rating" : "Update Rating"}
            </h2>
            <p className="text-gray-600 mb-6">How would you rate this post?</p>

            <div className="flex justify-center mb-6">
              <div className="flex space-x-2">
                {renderStars(selectedRating, true)}
              </div>
            </div>

            <div className="text-center mb-6">
              <span className="text-3xl font-bold text-yellow-500">
                {selectedRating.toFixed(1)}
              </span>
              <span className="text-gray-500 ml-1">/ 5.0</span>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={closeRatingModal}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl transition-colors duration-300 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={submitRating}
                disabled={loading || selectedRating === 0}
                className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white py-3 px-4 rounded-xl transition-all duration-300 font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Saving..."
                  : userRating === null
                    ? "Submit Rating"
                    : "Update Rating"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in duration-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Remove Rating
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove your rating? This action cannot be
              undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl transition-colors duration-300 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteRating}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-3 px-4 rounded-xl transition-all duration-300 font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Removing..." : "Remove Rating"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rating;
