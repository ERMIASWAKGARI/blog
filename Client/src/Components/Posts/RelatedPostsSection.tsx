import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaClock, FaEye } from "react-icons/fa";
import { Post } from "../../Pages/PostDetail";
import moment from "moment";

interface RelatedPostsProps {
  relatedPosts: Post[];
  category: string;
}

const RelatedPostsSection: React.FC<RelatedPostsProps> = ({
  relatedPosts,
  category,
}) => {
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    if (relatedPosts.length > 0) {
      setDisplayedPosts(relatedPosts.slice(0, visibleCount));
    }
  }, [relatedPosts, visibleCount]);

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, relatedPosts.length));
  };

  const hasMorePosts = visibleCount < relatedPosts.length;

  if (relatedPosts.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Related Posts</h2>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaEye className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-500">No related posts found</p>
          <p className="text-gray-400 text-sm mt-1">
            Check back later for more content
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sticky top-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Related Posts</h2>
        <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
          {category}
        </span>
      </div>

      <div className="space-y-4">
        {displayedPosts.map((post) => (
          <Link
            key={post._id}
            to={`/post/${post._id}`}
            className="block group hover:no-underline"
          >
            <div className="flex space-x-4 p-3 rounded-xl transition-all duration-300 group-hover:bg-gray-50 group-hover:shadow-md border border-transparent group-hover:border-gray-200">
              {post.imagePath && (
                <img
                  src={post.imagePath.split(",")[0]}
                  alt={post.title}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
              )}

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-300 line-clamp-2 text-sm leading-tight mb-1">
                  {post.title}
                </h3>

                <div className="flex items-center space-x-3 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <FaClock className="w-3 h-3" />
                    <span>{moment(post.createdAt).fromNow()}</span>
                  </div>

                  {post.averageRating > 0 && (
                    <div className="flex items-center space-x-1">
                      <div className="flex items-center space-x-0.5">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < Math.floor(post.averageRating)
                                ? "bg-yellow-400"
                                : "bg-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span>({post.ratingQuantity})</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {hasMorePosts && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={loadMore}
            className="w-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 py-3 px-4 rounded-xl transition-all duration-300 font-semibold flex items-center justify-center space-x-2 group"
          >
            <span>Load More</span>
            <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      )}

      {!hasMorePosts && relatedPosts.length > 3 && (
        <div className="mt-4 text-center">
          <p className="text-gray-500 text-sm">All related posts loaded</p>
        </div>
      )}
    </div>
  );
};

export default RelatedPostsSection;
