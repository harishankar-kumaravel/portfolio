import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  isYoutubeMedia,
  isGifMedia,
  getYoutubeId,
  getMediaExternalUrl,
  getDriveThumbnailUrl,
  getDrivePreviewUrl
} from '../utils/portfolioUtils'

export function MediaThumbnail({ media, categoryTitle, index }) {
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  if (hasError || !media.thumbnail) {
    return (
      <div className="flex h-full w-full items-center justify-center px-5 text-center min-h-[220px]">
        <span className="text-sm font-extrabold uppercase tracking-[0.18em] text-foam/80">
          {media.type === 'video' ? 'Video' : media.type === 'animation' ? 'Animation' : 'Portfolio'}
        </span>
      </div>
    )
  }

  return (
    <div className={`relative w-full overflow-hidden bg-panel/30 ${!isLoaded ? 'min-h-[220px]' : ''}`}>
      {/* Glassmorphic Shimmer Loader */}
      {!isLoaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 bg-abyss/45 backdrop-blur-md">
          {/* Moving shimmer bar */}
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-teal/10 to-transparent" />
          
          {/* Glassmorphic inner shape */}
          <div className="w-12 h-12 rounded-full border border-teal/20 bg-teal/5 flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-teal/40 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal/50 animate-pulse">
            Loading visual...
          </span>
        </div>
      )}

      <img
        className={`block h-auto w-full select-none object-contain transition-all duration-700 hover:scale-105 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        src={getDriveThumbnailUrl(media, 900)}
        alt={(media.name || '').replace(/\.[a-z0-9]+$/i, '').replace(/[_-]+/g, ' ').trim() || `${categoryTitle} sample ${index}`}
        loading="lazy"
        draggable="false"
        referrerPolicy="no-referrer"
        onContextMenu={(event) => event.preventDefault()}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
    </div>
  )
}

export default function PortfolioLightbox({ media, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    setIsPlaying(false)
  }, [media])

  useEffect(() => {
    if (!media || typeof window === 'undefined') {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }

      if ((event.ctrlKey || event.metaKey) && ['s', 'S'].includes(event.key)) {
        event.preventDefault()
      }
    }
    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [media, onClose])

  if (!media) {
    return null
  }

  const isPlayable = media.type === 'video' || media.type === 'animation'
  const isYoutube = isYoutubeMedia(media)
  const previewUrl = getMediaExternalUrl(media)

  return (
    <AnimatePresence>
      <motion.div
        key="portfolio-lightbox"
        className="fixed inset-0 z-50 flex items-center justify-center bg-abyss/90 px-3 py-4 backdrop-blur-2xl sm:px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        onContextMenu={(event) => event.preventDefault()}
        role="dialog"
        aria-modal="true"
        aria-label={media.name || 'Portfolio preview'}
      >
        <motion.div
          className="relative flex h-full max-h-[94vh] w-full max-w-7xl flex-col overflow-hidden rounded-[28px] border border-teal/20 bg-panel shadow-glow"
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.25 }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex flex-col gap-3 border-b border-teal/10 px-4 py-3 sm:px-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-teal">
                {isPlayable ? (media.type === 'video' ? 'Video Preview' : 'Animation Preview') : 'Image Preview'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                className="theme-card-soft flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-teal/20 text-2xl leading-none text-foam transition hover:border-teal/60 hover:text-teal cursor-pointer"
                type="button"
                onClick={onClose}
                aria-label="Close preview"
              >
                &times;
              </button>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center bg-abyss/55 p-3 sm:p-5">
            {isPlayable ? (
              isYoutube ? (
                isPlaying ? (
                  <iframe
                    className="h-full min-h-[62vh] w-full rounded-[18px] border-0 bg-black"
                    src={`https://www.youtube.com/embed/${getYoutubeId(media)}?autoplay=1&mute=1&modestbranding=1&rel=0`}
                    title={media.name || 'Video preview'}
                    allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                    allowFullScreen
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <button
                    className="relative block max-h-full max-w-full overflow-hidden rounded-[18px] border border-teal/10 bg-black cursor-pointer text-left p-0"
                    onClick={() => setIsPlaying(true)}
                    aria-label={`Play ${media.name || 'video'}`}
                  >
                    <img
                      className="max-h-[76vh] w-full select-none object-contain"
                      src={getDriveThumbnailUrl(media)}
                      alt={media.name || 'Video preview'}
                      draggable="false"
                      referrerPolicy="no-referrer"
                      onContextMenu={(event) => event.preventDefault()}
                    />
                    <span className="theme-card-soft absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-teal/30 text-2xl text-foam shadow-glow backdrop-blur-xl transition hover:scale-110">
                      <span className="ml-1" aria-hidden="true">&#9654;</span>
                    </span>
                  </button>
                )
              ) : isGifMedia(media) ? (
                <img
                  className="max-h-full max-w-full select-none object-contain"
                  src={`https://drive.google.com/uc?id=${media.id}&export=download`}
                  alt={media.name || 'Animation preview'}
                  draggable="false"
                  referrerPolicy="no-referrer"
                  onContextMenu={(event) => event.preventDefault()}
                />
              ) : (
                <div className="relative w-full h-full min-h-[62vh] overflow-hidden rounded-[18px]">
                  <iframe
                    className="h-full w-full rounded-[18px] border-0 bg-black"
                    src={previewUrl}
                    title={media.name || 'Video preview'}
                    allow="autoplay; fullscreen; encrypted-media"
                    allowFullScreen
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-0 left-0 w-full h-14 bg-transparent z-30 pointer-events-auto" />
                </div>
              )
            ) : (
              <img
                className="max-h-full max-w-full select-none object-contain"
                src={getDriveThumbnailUrl(media)}
                alt={media.name || 'Portfolio work'}
                draggable="false"
                referrerPolicy="no-referrer"
                onContextMenu={(event) => event.preventDefault()}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
