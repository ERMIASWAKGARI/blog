import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaExternalLinkAlt, FaStar, FaTimes, FaExpand } from "react-icons/fa";
import PostHeader from "./PostCard/PostHeader";

interface Post {
  _id: string;
  title: string;
  author: string;
  textContent: string;
  imagePath?: string;
  createdAt: string;
  category: string;
  authorImage: string;
  ratingQuantity: number;
  averageRating: number;
}

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [showMediaPopup, setShowMediaPopup] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const openMediaPopup = () => {
    console.log("Opening popup"); // Debug log
    setShowMediaPopup(true);
  };

  const closeMediaPopup = () => {
    console.log("Closing popup"); // Debug log
    setShowMediaPopup(false);
  };

  useEffect(() => {
    console.log("Popup state changed to:", showMediaPopup); // Debug log
  }, [showMediaPopup]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        closeMediaPopup();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMediaPopup();
      }
    };

    if (showMediaPopup) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [showMediaPopup]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleImageClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    console.log("Image clicked"); // Debug log
    openMediaPopup();
  };

  const handleOverlayClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    console.log("Overlay clicked"); // Debug log
    openMediaPopup();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      AI: "from-purple-500 to-pink-500",
      "Software Development": "from-blue-500 to-cyan-500",
      "Cloud Computing": "from-orange-500 to-red-500",
      "Data Science": "from-green-500 to-emerald-500",
      Blockchain: "from-gray-700 to-gray-900",
      "Internet of Things (IoT)": "from-indigo-500 to-purple-600",
      DevOps: "from-yellow-500 to-orange-500",
      "Quantum Computing": "from-teal-500 to-blue-500",
      Cybersecurity: "from-red-500 to-pink-500",
    };
    return colors[category] || "from-gray-500 to-gray-700";
  };

  return (
    <>
      <article className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100/80 overflow-hidden flex flex-col h-full transform hover:-translate-y-2">
        {/* Image Section */}
        {post.imagePath && !imageError && (
          <div
            className="relative w-full aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden cursor-pointer"
            onClick={handleOverlayClick}
          >
            {/* Loading Skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            )}

            {/* Main Image */}
            <img
              ref={imageRef}
              src={post.imagePath}
              alt={post.title}
              onClick={handleImageClick}
              onLoad={handleImageLoad}
              onError={handleImageError}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 cursor-zoom-in ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* Overlay with Expand Icon */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                  <FaExpand className="w-5 h-5 text-gray-700" />
                </div>
              </div>
            </div>

            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span
                className={`bg-gradient-to-r ${getCategoryColor(
                  post.category
                )} text-white text-xs font-semibold px-3 py-2 rounded-full shadow-lg backdrop-blur-sm`}
              >
                {post.category}
              </span>
            </div>
          </div>
        )}

        {/* Fallback for missing image */}
        {(!post.imagePath || imageError) && (
          <div className="relative w-full aspect-video bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaStar className="w-8 h-8 text-white" />
                </div>
                <span className="text-gray-500 text-sm font-medium">
                  No Image Available
                </span>
              </div>
            </div>
            <div className="absolute top-4 left-4">
              <span
                className={`bg-gradient-to-r ${getCategoryColor(
                  post.category
                )} text-white text-xs font-semibold px-3 py-2 rounded-full shadow-lg`}
              >
                {post.category}
              </span>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Header with Rating and Date */}
          <div className="flex items-center justify-between mb-4">
            <PostHeader
              ratingQuantity={post.ratingQuantity}
              averageRating={post.averageRating}
            />
            <span className="text-xs text-gray-500 font-medium">
              {formatDate(post.createdAt)}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors duration-300 leading-tight">
            {post.title}
          </h3>

          {/* Content Preview */}
          <div className="flex-grow mb-4">
            <p className="text-gray-600 leading-relaxed text-sm">
              {post.textContent.length > 120 ? (
                <>
                  {post.textContent.slice(0, 120)}...
                  <Link
                    to={`/post/${post._id}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 ml-1 font-medium transition-colors duration-300 group/link"
                  >
                    Read more
                    <FaExternalLinkAlt className="w-3 h-3 ml-1 transform group-hover/link:translate-x-1 transition-transform duration-300" />
                  </Link>
                </>
              ) : (
                post.textContent
              )}
            </p>
          </div>

          {/* Footer with Author and CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <img
                src={post.authorImage}
                alt={post.author}
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
              />
              <span className="text-sm font-medium text-gray-700">
                {post.author}
              </span>
            </div>

            <Link
              to={`/post/${post._id}`}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              View Post
            </Link>
          </div>
        </div>
      </article>

      {/* Enhanced Media Popup - Fixed to show when showMediaPopup is true */}
      {showMediaPopup && post.imagePath && !imageError && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
          style={{ animation: "fadeIn 0.3s ease-out" }}
        >
          <div
            ref={popupRef}
            className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            style={{ animation: "zoomIn 0.3s ease-out" }}
          >
            <div className="relative">
              {/* Header */}
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-6 z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">
                      {post.title}
                    </h3>
                    <div className="flex items-center space-x-4">
                      <span className="text-white/80 text-sm">
                        by {post.author}
                      </span>
                      <span className="text-white/60 text-sm">
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={closeMediaPopup}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full p-3 transition-all duration-300 transform hover:scale-110 hover:rotate-90"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Image */}
              <div className="flex items-center justify-center min-h-[400px] max-h-[70vh] p-4">
                <img
                  src={post.imagePath}
                  alt={post.title}
                  className="w-full h-full object-contain max-h-[70vh]"
                />
              </div>

              {/* Footer */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6 z-10">
                <div className="flex items-center justify-between">
                  <span
                    className={`bg-gradient-to-r ${getCategoryColor(
                      post.category
                    )} text-white text-sm font-semibold px-3 py-1.5 rounded-full`}
                  >
                    {post.category}
                  </span>

                  <Link
                    to={`/post/${post._id}`}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                    onClick={closeMediaPopup}
                  >
                    <span>View Full Post</span>
                    <FaExternalLinkAlt className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS animations if using plain CSS */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoomIn {
          from { 
            opacity: 0;
            transform: scale(0.9);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default PostCard;
