import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeInVariants, getYoutubeThumbnailUrl } from '../utils/portfolioUtils'

export function MotionShowcaseItem({ item }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const isYoutube = item.id && item.id.length === 11
  const isGif = item.name && item.name.toLowerCase().endsWith('.gif')
  const previewUrl = isYoutube
    ? `https://www.youtube.com/embed/${item.id}?autoplay=1&mute=1&modestbranding=1&rel=0`
    : `https://drive.google.com/file/d/${item.id}/preview`

  return (
    <motion.article
      key={item.id}
      variants={fadeInVariants}
      className="liquid-glass overflow-hidden rounded-[28px] p-3 shadow-glow border border-teal/20"
    >
      {isYoutube ? (
        isPlaying ? (
          <iframe
            className="aspect-video w-full rounded-[20px] border-0 bg-black"
            src={previewUrl}
            title={item.title || "Video preview"}
            loading="lazy"
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            className="relative block aspect-video w-full overflow-hidden rounded-[20px] border border-teal/10 bg-black cursor-pointer text-left p-0 w-full"
            onClick={() => setIsPlaying(true)}
            aria-label={item.title ? `Play ${item.title}` : "Play video"}
          >
            <img
              className="h-full w-full object-contain"
              src={getYoutubeThumbnailUrl(item.id)}
              alt=""
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <span className="theme-card-soft absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-teal/30 text-2xl text-foam shadow-glow backdrop-blur-xl transition hover:scale-110">
              <span className="ml-1" aria-hidden="true">&#9654;</span>
            </span>
          </button>
        )
      ) : isGif ? (
        <img
          className="aspect-video w-full rounded-[20px] bg-black object-contain"
          src={`https://drive.google.com/uc?id=${item.id}&export=download`}
          alt={item.title || "Animation preview"}
          loading="lazy"
        />
      ) : (
        <div className="relative w-full h-full overflow-hidden rounded-[20px]">
          <iframe
            className="aspect-video w-full rounded-[20px] border-0 bg-black"
            src={previewUrl}
            title={item.title || "Video preview"}
            loading="lazy"
            allow="autoplay; fullscreen; encrypted-media"
            allowFullScreen
          />
          <div className="absolute top-0 left-0 w-full h-14 bg-black z-30 pointer-events-auto" />
        </div>
      )}
      {item.title && <h3 className="px-3 pb-2 pt-4 text-lg font-bold text-foam">{item.title}</h3>}
    </motion.article>
  )
}

export default function MotionShowcase({ section }) {
  return (
    <div className="mt-7 grid gap-4 lg:grid-cols-2">
      {section.items.map((item) => (
        <MotionShowcaseItem key={item.id} item={item} />
      ))}
    </div>
  )
}
