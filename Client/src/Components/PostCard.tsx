import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
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
  const popupRef = useRef<HTMLDivElement>(null);

  const toggleMediaPopup = () => {
    setShowMediaPopup(!showMediaPopup);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setShowMediaPopup(false);
      }
    };

    if (showMediaPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMediaPopup]);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md border border-gray-100 flex flex-col h-full">
      {post.imagePath && (
        <div className="relative w-full aspect-video bg-gray-100 cursor-pointer overflow-hidden">
          <img
            src={post.imagePath}
            alt={post.title}
            onClick={toggleMediaPopup}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-3">
          <span className="bg-indigo-50 text-indigo-600 text-xs font-medium px-2.5 py-1 rounded-full">
            {post.category}
          </span>
          <PostHeader
            ratingQuantity={post.ratingQuantity}
            averageRating={post.averageRating}
          />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {post.title}
        </h3>

        <div className="flex-grow">
          <p className="text-gray-600 text-sm mb-4">
            {post.textContent.length > 150 ? (
              <>
                {post.textContent.slice(0, 100)}...
                <Link
                  to={`/post/${post._id}`}
                  className="text-indigo-600 hover:text-indigo-800 ml-1"
                >
                  Read more
                </Link>
              </>
            ) : (
              post.textContent
            )}
          </p>
        </div>
      </div>

      {showMediaPopup && post.imagePath && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div
            ref={popupRef}
            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-xl"
          >
            <div className="relative w-full h-full">
              <img
                src={post.imagePath}
                alt={post.title}
                className="w-full h-full object-contain max-h-[80vh]"
              />
              <button
                onClick={toggleMediaPopup}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
