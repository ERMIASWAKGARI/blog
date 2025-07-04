import moment from 'moment'
import React, { useEffect, useState } from 'react'
import {
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaTag,
  FaTimes,
  FaUser,
} from 'react-icons/fa'
import { BASE_URL } from '../../config'

interface Post {
  _id: string
  title: string
  textContent: string
  imagePath?: string
  videoContent?: string
  postedAt: string
  createdAt: string
  category: string
  author: string
  authorImage: string
  ratingQuantity: number
  averageRating: number
}

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  post: Post | null
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, post }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  useEffect(() => {
    if (isOpen) setCurrentIndex(0) // Reset carousel on open
  }, [isOpen])

  if (!post) return null

  const mediaItems = [
    ...(post.imagePath ? [{ type: 'image', src: post.imagePath }] : []),
    ...(post.videoContent ? [{ type: 'video', src: post.videoContent }] : []),
  ]

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? mediaItems.length - 1 : prevIndex - 1
    )
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === mediaItems.length - 1 ? 0 : prevIndex + 1
    )
  }

  return isOpen ? (
    <div className="fixed inset-0 z-50 flex justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-lg animate-fade-in-up max-h-screen overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 z-10"
        >
          <FaTimes size={22} />
        </button>

        {/* Media Carousel */}
        <div className="relative w-full h-80 bg-gray-100 flex items-center justify-center overflow-hidden">
          {mediaItems.length > 0 && (
            <>
              {mediaItems[currentIndex].type === 'image' ? (
                <img
                  src={`${BASE_URL}/${mediaItems[currentIndex].src}`}
                  alt={post.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <video
                  src={`${BASE_URL}/${mediaItems[currentIndex].src}`}
                  controls
                  className="w-full h-full object-contain"
                />
              )}
              {mediaItems.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-purple-600 p-2 rounded-full shadow hover:bg-purple-700"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-purple-600 p-2 rounded-full shadow hover:bg-purple-700"
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}
            </>
          )}
        </div>

        {/* Content */}
        <div className="p-6 text-gray-800">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h2 className="text-2xl font-bold text-gray-800">{post.title}</h2>
            <div className="flex items-center gap-1 text-sm text-yellow-500">
              <FaStar />
              <span>{post.averageRating?.toFixed(1) || '0.0'}</span>
              <span className="text-gray-500">({post.ratingQuantity})</span>
            </div>
          </div>

          <div className="mb-4 text-sm text-gray-500 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1">
              <FaUser className="text-purple-600" />
              {post.author}
            </div>
            <div className="flex items-center gap-1">
              <FaCalendarAlt className="text-purple-600" />
              {moment(post.postedAt).format('MMMM Do YYYY')}
            </div>
            <div className="flex items-center gap-1">
              <FaTag className="text-purple-600" />
              {post.category}
            </div>
          </div>

          {/* Text Content */}
          <div className="prose prose-sm max-w-none text-gray-700">
            {post.textContent.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  ) : null
}

export default Modal
