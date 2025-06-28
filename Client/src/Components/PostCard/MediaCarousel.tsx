import React from 'react'
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'
import { BASE_URL } from '../../config'

interface MediaCarouselProps {
  imagePath?: string
  videoPath?: string
  title: string
}

const normalizePath = (path?: string) => path?.replace(/\\/g, '/')

const MediaCarousel: React.FC<MediaCarouselProps> = ({
  imagePath,
  videoPath,
  title,
}) => {
  const media = []

  if (imagePath) {
    media.push({
      type: 'image',
      url: `${BASE_URL}${normalizePath(imagePath)}`,
    })
  }

  if (videoPath) {
    media.push({
      type: 'video',
      url: `${BASE_URL}${normalizePath(videoPath)}`,
    })
  }

  if (media.length === 0) {
    return (
      <img
        src="/fallback.jpg"
        alt="No media"
        className="w-full h-64 object-cover rounded-t-2xl"
      />
    )
  }

  return (
    <Swiper className="rounded-t-2xl" spaceBetween={0} slidesPerView={1}>
      {media.map((item, i) => (
        <SwiperSlide key={i}>
          {item.type === 'image' ? (
            <img
              src={item.url}
              alt={title}
              className="w-full h-64 object-cover cursor-pointer"
            />
          ) : (
            <video
              src={item.url}
              controls
              className="w-full h-64 object-cover"
            />
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default MediaCarousel
