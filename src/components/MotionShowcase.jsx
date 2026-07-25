import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeInVariants, getDrivePreviewUrl, getDriveThumbnailUrl, getYoutubeThumbnailUrl } from '../utils/portfolioUtils'

export function MotionShowcaseItem({ item }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [thumbnailFailed, setThumbnailFailed] = useState(false)
  const isYoutube = item.id && item.id.length === 11
  const previewUrl = isYoutube
    ? `https://www.youtube.com/embed/${item.id}?autoplay=1&mute=1&modestbranding=1&rel=0`
    : getDrivePreviewUrl(item)

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
      ) : (
        <a
          className="group relative block aspect-video w-full overflow-hidden rounded-[20px] border border-teal/10 bg-black"
          href={previewUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${item.title || 'video preview'}`}
        >
          {thumbnailFailed ? (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-teal/20 to-panel px-6 text-center">
              <span className="text-sm font-extrabold uppercase tracking-[0.14em] text-teal">Open motion preview</span>
            </div>
          ) : (
            <img
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              src={getDriveThumbnailUrl(item, 1200)}
              alt={item.title || 'Motion preview'}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setThumbnailFailed(true)}
            />
          )}
          <span className="theme-card-soft absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-teal/30 text-xl text-foam shadow-glow backdrop-blur-xl transition group-hover:scale-110" aria-hidden="true">
            <span className="ml-0.5">&#9654;</span>
          </span>
          <span className="absolute bottom-3 left-3 rounded-full bg-abyss/80 px-3 py-1.5 text-xs font-bold text-foam backdrop-blur">Open video</span>
        </a>
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
