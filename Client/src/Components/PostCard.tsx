import { faEye } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import React, { useEffect, useRef, useState } from 'react'
import { FaArrowLeft, FaArrowRight, FaRegBookmark } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import AuthorInfo from './PostCard/AuthorInfo'
import MediaPopup from './PostCard/MediaPopup'
import PostHeader from './PostCard/PostHeader'

import generic_image from '../../public/generic_user_place_holder.jpg'

interface Post {
  _id: string
  title: string
  author: string
  textContent: string
  imagePath?: string
  videoContent?: string
  createdAt: string
  category: string
  authorImage: string
  ratingQuantity: number
  averageRating: number
}

interface PostCardProps {
  post: Post
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [showMediaPopup, setShowMediaPopup] = useState(false)
  const [popupMedia, setPopupMedia] = useState<string | null>(null)
  const [popupMediaType, setPopupMediaType] = useState<
    'image' | 'video' | null
  >(null)
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const popupRef = useRef<HTMLDivElement>(null)

  const mediaItems = [
    { type: 'image', url: post.imagePath },
    { type: 'video', url: post.videoContent },
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        closeMediaPopup()
      }
    }
    if (showMediaPopup)
      document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showMediaPopup])

  const openMediaPopup = (mediaUrl: string, type: string) => {
    setPopupMedia(mediaUrl)
    setPopupMediaType(type as 'image' | 'video')
    setShowMediaPopup(true)
  }

  const closeMediaPopup = () => {
    setShowMediaPopup(false)
    setPopupMedia(null)
    setPopupMediaType(null)
  }

  const handlePreviousMedia = () => {
    setCurrentMediaIndex((prev) => Math.max(prev - 1, 0))
  }

  const handleNextMedia = () => {
    setCurrentMediaIndex((prev) => Math.min(prev + 1, mediaItems.length - 1))
  }

  return (
    <Card className="rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg bg-white">
      <div className="relative w-full pt-[56.25%] bg-gray-100 overflow-hidden group">
        {mediaItems.length > 0 && (
          <CardMedia
            component={
              mediaItems[currentMediaIndex].type === 'image' ? 'img' : 'video'
            }
            image={mediaItems[currentMediaIndex].url}
            title={post.title}
            onClick={() =>
              openMediaPopup(
                mediaItems[currentMediaIndex].url ?? '',
                mediaItems[currentMediaIndex].type
              )
            }
            className="absolute top-0 left-0 w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
            controls={mediaItems[currentMediaIndex].type === 'video'}
          />
        )}
        {mediaItems.length > 1 && (
          <div className="absolute top-1/2 left-0 w-full flex justify-between px-4 z-10 transform -translate-y-1/2">
            <FaArrowLeft
              onClick={handlePreviousMedia}
              className={`bg-white/70 hover:bg-white text-gray-700 rounded-full p-2 cursor-pointer shadow-md transition ${
                currentMediaIndex === 0
                  ? 'opacity-0 pointer-events-none'
                  : 'opacity-100'
              }`}
              size={28}
            />
            <FaArrowRight
              onClick={handleNextMedia}
              className={`bg-white/70 hover:bg-white text-gray-700 rounded-full p-2 cursor-pointer shadow-md transition ${
                currentMediaIndex === mediaItems.length - 1
                  ? 'opacity-0 pointer-events-none'
                  : 'opacity-100'
              }`}
              size={28}
            />
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <FaRegBookmark className="text-purple-500" />
          <span className="bg-purple-100 text-purple-600 text-xs font-semibold px-3 py-1 rounded-full uppercase">
            {post.category}
          </span>
        </div>

        <Typography variant="h6" className="font-bold mb-1 text-gray-800">
          {post.title}
        </Typography>

        <Typography variant="body2" className="text-gray-600 leading-snug">
          {post.textContent.length > 50 ? (
            <>
              {post.textContent.substring(0, 50)}...
              <Link
                to={`/post/${post._id}`}
                className="text-purple-500 ml-1 inline-flex items-center font-medium hover:underline"
              >
                <FontAwesomeIcon icon={faEye} className="mr-1" />
                See more
              </Link>
            </>
          ) : (
            post.textContent
          )}
        </Typography>
      </CardContent>

      <div className="px-4 pb-4">
        <PostHeader
          ratingQuantity={post.ratingQuantity}
          averageRating={post.averageRating}
        />
        <AuthorInfo
          author={post.author}
          authorImage={generic_image}
          createdAt={post.createdAt}
        />
      </div>

      <MediaPopup
        showMediaPopup={showMediaPopup}
        popupRef={popupRef}
        closeMediaPopup={closeMediaPopup}
        renderMediaContent={() => {
          if (popupMediaType === 'image') {
            return (
              <img
                src={popupMedia ?? ''}
                alt="Popup"
                className="w-full h-full object-contain rounded-lg"
              />
            )
          } else if (popupMediaType === 'video') {
            return (
              <video
                src={popupMedia ?? ''}
                className="w-full h-full object-contain rounded-lg"
                controls
              />
            )
          }
          return null
        }}
      />
    </Card>
  )
}

export default PostCard
