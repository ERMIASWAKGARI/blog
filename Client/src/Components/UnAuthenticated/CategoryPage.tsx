import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../axiosConfig'
import Modal from './Modal'
import Navbar from './Navbar'

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
}

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>()
  const navigate = useNavigate()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const limit = 6

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      try {
        const response = await api.get(
          `/post/getAllposts?category=${category}&limit=${limit}&page=${currentPage}`
        )
        const data = await response.data

        if (response.status === 200) {
          const newPosts = data.data
          if (Array.isArray(newPosts)) {
            setPosts((prevPosts = []) => {
              const uniquePosts = newPosts.filter(
                (newPost) => !prevPosts.some((post) => post._id === newPost._id)
              )
              return [...prevPosts, ...uniquePosts]
            })
            setHasMore(newPosts.length === limit)
          }
        }
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [category, currentPage])

  const handleLoadMore = () => {
    if (hasMore) {
      setCurrentPage((prevPage) => prevPage + 1)
    }
  }

  const handlePostClick = (post: Post) => setSelectedPost(post)
  const handleCloseModal = () => setSelectedPost(null)

  return (
    <>
      <Navbar />
      <section className="py-32 bg-gradient-to-br from-gray-50 to-gray-100 text-black min-h-screen">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <button
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition mb-6"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-12 uppercase tracking-wide">
            {category} Posts
          </h2>

          {loading && currentPage === 1 ? (
            <div className="flex justify-center items-center h-40">
              <span className="text-gray-500 text-lg">Loading posts...</span>
            </div>
          ) : posts.length === 0 ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500 text-lg">No posts available.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <div
                    key={post._id}
                    onClick={() => handlePostClick(post)}
                    className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden"
                  >
                    <img
                      src={post.imagePath}
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-5">
                      <h3 className="text-xl font-semibold mb-2 text-gray-800 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {post.textContent.substring(0, 100)}...
                      </p>
                      <span className="text-sm text-blue-500 font-medium hover:underline">
                        Read more →
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={handleLoadMore}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-full shadow-md transition-transform duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'See More'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <Modal
          isOpen={!!selectedPost}
          onClose={handleCloseModal}
          post={selectedPost}
        />
      </section>
    </>
  )
}

export default CategoryPage
