import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { fadeInVariants, staggerContainer, useMouseGlow } from '../utils/portfolioUtils'
import { MediaThumbnail } from './PortfolioLightbox'

export function PortfolioPlaceholder({ categoryTitle, index, item, onOpen }) {
  const media = typeof item === 'string' ? { name: `Work ${index}`, thumbnail: item } : item
  const isPlayable = media.type === 'video' || media.type === 'animation'
  const { hoverProps, glowStyle, borderStyle, isHovered } = useMouseGlow()

  return (
    <motion.div 
      variants={fadeInVariants}
      {...hoverProps}
      className="relative liquid-glass liquid-glass-hover mb-4 inline-block w-full break-inside-avoid overflow-hidden rounded-[24px] p-3 shadow-glow border border-teal/20"
    >
      {/* Premium cursor follow glow effect */}
      {isHovered && (
        <div 
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
          style={glowStyle}
        />
      )}
      
      {/* Animated glowing border */}
      {isHovered && (
        <div 
          className="pointer-events-none absolute inset-0 z-20 rounded-[24px] border border-teal/40 transition-opacity duration-300"
          style={borderStyle}
        />
      )}

      <button
        className={`relative block w-full overflow-hidden rounded-[18px] border border-teal/10 bg-panel p-0 text-left ${isPlayable ? 'cursor-pointer' : 'cursor-zoom-in'}`}
        type="button"
        onClick={() => onOpen(media)}
        onContextMenu={(event) => event.preventDefault()}
        aria-label={isPlayable ? `Play ${categoryTitle} sample ${index}` : `Preview ${categoryTitle} sample ${index}`}
      >
        <MediaThumbnail media={media} categoryTitle={categoryTitle} index={index} />
        <div className="theme-overlay-fade pointer-events-none absolute inset-0" />
        {isPlayable ? (
          <>
            <div className="theme-card-soft absolute right-4 top-4 rounded-full border border-teal/20 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-foam shadow-sm backdrop-blur-xl">
              {media.type === 'video' ? 'Video' : 'Animation'}
            </div>
            <div className="theme-card-soft absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-teal/30 text-2xl text-foam shadow-glow backdrop-blur-xl">
              <span className="ml-1" aria-hidden="true">&#9654;</span>
            </div>
          </>
        ) : null}
      </button>
    </motion.div>
  )
}

export function PortfolioCategory({ category, onOpenMedia }) {
  const items = category.items || (category.images || []).map((image) => ({ thumbnail: image }))
  const [limit, setLimit] = useState(12)

  // Reset pagination limit when category changes
  useEffect(() => {
    setLimit(12)
  }, [category.title])

  if (!items.length) {
    return null
  }

  const paginatedItems = items.slice(0, limit)

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={staggerContainer}
      className="liquid-glass rounded-[32px] px-6 py-8 shadow-glow sm:px-8 lg:px-10 border border-teal/20"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <motion.div variants={fadeInVariants}>
          <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.22em] text-teal">
            Category
          </p>
          <h3 className="mt-2 text-2xl font-bold text-foam sm:text-3xl">{category.title}</h3>
        </motion.div>
        <motion.span 
          variants={fadeInVariants}
          className="theme-card-soft rounded-full border border-teal/25 px-4 py-2 text-sm font-semibold text-foam backdrop-blur-md"
        >
          {items.length} items
        </motion.span>
      </div>

      <div className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5">
        {paginatedItems.map((item, index) => (
          <PortfolioPlaceholder
            key={item.id || `${category.title}-${index}`}
            categoryTitle={category.title}
            index={index + 1}
            item={item}
            onOpen={onOpenMedia}
          />
        ))}
      </div>

      {items.length > limit && (
        <div className="mt-8 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => setLimit(prev => prev + 12)}
            className="inline-flex items-center justify-center rounded-full bg-teal px-6 py-3.5 font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg dark:text-abyss text-sm cursor-pointer"
          >
            Load More Work ({items.length - limit} remaining)
          </motion.button>
        </div>
      )}
    </motion.section>
  )
}
