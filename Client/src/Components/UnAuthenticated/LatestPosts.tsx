import { motion } from "framer-motion";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FaClock, FaStar, FaUser } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import api from "../../axiosConfig";
import LoadingSpinner from "./LoadingSpinner";
import Modal from "./Modal";

interface Post {
  _id: string;
  title: string;
  textContent: string;
  imagePath: string;
  postedAt: string;
  createdAt: string;
  category: string;
  author: string;
  authorImage: string;
  ratingQuantity: number;
  averageRating: number;
  videoContent?: string;
}

const LatestPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const limit = 9;

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const url = `/post/getAllposts?page=${currentPage}&limit=${limit}`;
      const response = await api.get(url);

      if (response?.data?.data) {
        const newPosts = response.data.data;
        if (Array.isArray(newPosts)) {
          const filteredPosts = newPosts.filter(
            (newPost) =>
              !posts.some((existingPost) => existingPost._id === newPost._id)
          );
          setPosts((prevPosts) => [...prevPosts, ...filteredPosts]);
          setHasMore(filteredPosts.length === limit);
        } else {
          console.error("Received posts data is not an array:", newPosts);
          setHasMore(false);
        }
      } else {
        console.error("Invalid response format:", response);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (hasMore) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { y: 30, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    hover: {
      y: -5,
      transition: { duration: 0.2 },
    },
  };

  return (
    <section
      id="latest-posts"
      className="py-20 bg-gradient-to-b from-blue-50 to-white"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Latest <span className="text-purple-600">Tech Insights</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our most recent articles and stay updated with the latest
            in technology
          </p>
        </motion.div>

        {loading && currentPage === 1 ? (
          <div className="relative flex justify-center items-center min-h-[400px]">
            <LoadingSpinner loading={loading} />
          </div>
        ) : (
          <>
            <div className="relative">
              <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {posts.length === 0 ? (
                  <p className="text-center text-gray-500 col-span-3">
                    No posts available.
                  </p>
                ) : (
                  posts.map((post) => (
                    <motion.article
                      key={post._id}
                      variants={item}
                      whileHover="hover"
                      className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100"
                      onClick={() => handlePostClick(post)}
                    >
                      <div className="relative h-60 overflow-hidden">
                        {post.imagePath && !post.videoContent && (
                          <img
                            src={post.imagePath}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        )}
                        {post.videoContent && (
                          <video
                            src={post.videoContent}
                            controls
                            className="w-full h-full object-cover"
                          />
                        )}
                        <span className="absolute top-4 left-4 bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                          {post.category}
                        </span>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                          <div className="flex items-center">
                            <FaUser className="text-purple-500 mr-1" />
                            <span>{post.author}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center">
                            <FaClock className="text-purple-500 mr-1" />
                            <span>{moment(post.createdAt).fromNow()}</span>
                          </div>
                        </div>

                        <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.textContent}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <FaStar className="text-yellow-400" />
                            <span>
                              {post.averageRating?.toFixed(1) || "0.0"}
                              <span className="text-gray-400 ml-1">
                                ({post.ratingQuantity || 0})
                              </span>
                            </span>
                          </div>
                          <div className="flex items-center text-purple-600 font-medium text-sm group-hover:text-purple-800 transition-colors">
                            Read more
                            <FiArrowRight className="ml-1 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  ))
                )}
              </motion.div>

              {/* 🔒 Scoped overlay spinner for pagination loads (page > 1) */}
              {loading && currentPage > 1 && (
                <LoadingSpinner loading={loading} />
              )}
            </div>

            {hasMore && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="flex justify-center mt-16"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-full shadow-sm hover:shadow-md transition-all duration-300 disabled:opacity-70"
                >
                  {loading ? "Loading..." : "Load More Posts"}
                </motion.button>
              </motion.div>
            )}
          </>
        )}

        {selectedPost && (
          <Modal isOpen={true} onClose={handleCloseModal} post={selectedPost} />
        )}
      </div>
    </section>
  );
};

export default LatestPosts;
