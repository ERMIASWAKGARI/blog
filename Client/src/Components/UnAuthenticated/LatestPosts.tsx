import { motion } from 'framer-motion'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { FaClock, FaStar, FaUser } from 'react-icons/fa'
import api from '../../axiosConfig'
import LoadingSpinner from './LoadingSpinner'
import Modal from './Modal'

interface Post {
  _id: string
  title: string
  textContent: string
  imagePath: string
  postedAt: string
  createdAt: string
  category: string
  author: string
  authorImage: string
  ratingQuantity: number
  averageRating: number
  videoContent?: string
}

const LatestPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const limit = 9

  useEffect(() => {
    fetchPosts()
  }, [currentPage])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const url = `/post/getAllposts?page=${currentPage}&limit=${limit}`
      const response = await api.get(url)

      if (response?.data?.data) {
        const newPosts = response.data.data
        if (Array.isArray(newPosts)) {
          // Filter out any posts that are already in the state
          const filteredPosts = newPosts.filter(
            (newPost) =>
              !posts.some((existingPost) => existingPost._id === newPost._id)
          )
          setPosts((prevPosts) => [...prevPosts, ...filteredPosts])
          setHasMore(filteredPosts.length === limit)
        } else {
          console.error('Received posts data is not an array:', newPosts)
          setHasMore(false)
        }
      } else {
        console.error('Invalid response format:', response)
        setHasMore(false)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  const handleLoadMore = () => {
    if (hasMore) {
      setCurrentPage((prevPage) => prevPage + 1)
    }
  }

  const handlePostClick = (post: Post) => {
    setSelectedPost(post)
  }

  const handleCloseModal = () => {
    setSelectedPost(null)
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  return (
    <section
      id="latest-posts"
      className="py-16 bg-gradient-to-b from-blue-50 to-white text-black"
    >
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
        >
          Latest Posts
        </motion.h2>

        {loading && currentPage === 1 ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner loading={loading} />
          </div>
        ) : (
          <>
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid md:grid-cols-3 gap-8"
            >
              {posts.length === 0 ? (
                <p className="text-center text-gray-500 col-span-3">
                  No posts available.
                </p>
              ) : (
                posts.map((post) => (
                  <motion.div
                    key={post._id}
                    variants={item}
                    whileHover={{ scale: 1.02 }}
                    className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-200"
                    onClick={() => handlePostClick(post)}
                  >
                    <div className="relative h-52 overflow-hidden">
                      {post.imagePath && !post.videoContent && (
                        <img
                          src={post.imagePath}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      {post.videoContent && (
                        <video
                          src={post.videoContent}
                          controls
                          className="w-full h-full object-cover"
                        />
                      )}
                      <span className="absolute top-3 left-3 bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                        {post.category}
                      </span>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-semibold mb-2 text-gray-800 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {post.textContent}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <FaUser className="text-purple-500" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaClock className="text-purple-500" />
                          <span>{moment(post.createdAt).fromNow()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <FaStar className="text-yellow-400" />
                          <span>
                            {post.averageRating?.toFixed(1) || '0.0'} (
                            {post.ratingQuantity || 0})
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePostClick(post)
                          }}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                          Read More →
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>

            {hasMore && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center mt-12"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLoadMore}
                  className="group relative inline-flex items-center px-8 py-3 overflow-hidden text-lg font-medium text-indigo-600 border-2 border-indigo-600 rounded-full hover:text-white"
                >
                  <span className="absolute left-0 w-full h-0 transition-all bg-indigo-600 opacity-100 group-hover:h-full group-hover:top-0 duration-300 ease-out"></span>
                  <span className="relative">Load More Posts</span>
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
  )
}

export default LatestPosts
