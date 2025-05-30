import { motion } from 'framer-motion'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { FaClock, FaStar, FaUser } from 'react-icons/fa'
import { ClipLoader } from 'react-spinners'
import api from '../../axiosConfig'
import { BASE_URL } from '../../config'
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
            <ClipLoader size={50} color={'#6b21a8'} loading={loading} />
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
                    whileHover={{
                      scale: 1.03,
                      transition: { duration: 0.2 },
                    }}
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                    onClick={() => handlePostClick(post)}
                  >
                    <div className="relative">
                      {post.imagePath && !post.videoContent && (
                        <img
                          src={`${BASE_URL}/${post.imagePath}`}
                          alt={post.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      {post.videoContent && (
                        <video
                          src={`${BASE_URL}/${post.videoContent}`}
                          controls
                          className="w-full h-48 object-cover"
                        ></video>
                      )}
                      <div className="absolute top-4 right-4">
                        <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3 line-clamp-2 hover:text-purple-600 transition-colors duration-200">
                        {post.title}
                      </h3>

                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {post.textContent}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <FaUser className="text-purple-500 mr-2" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center">
                          <FaClock className="text-purple-500 mr-2" />
                          <span>{moment(post.createdAt).fromNow()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FaStar className="text-yellow-400 mr-1" />
                          <span className="text-gray-600">
                            {post.averageRating?.toFixed(1) || '0.0'} (
                            {post.ratingQuantity || 0})
                          </span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePostClick(post)
                          }}
                          className="text-purple-600 font-semibold hover:text-purple-700 transition-colors duration-200"
                        >
                          Read more →
                        </motion.button>
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
