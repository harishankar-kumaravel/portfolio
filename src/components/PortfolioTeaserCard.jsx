import { motion } from 'framer-motion'
import { useMouseGlow, getDriveThumbnailUrl } from '../utils/portfolioUtils'

export default function PortfolioTeaserCard({ categories }) {
  const { hoverProps, glowStyle, borderStyle, isHovered } = useMouseGlow()

  // Collect the first 6 portfolio item thumbnails for the grid preview
  const teaserItems = []
  if (categories && categories.length > 0) {
    categories.forEach(cat => {
      if (cat.items && cat.items.length > 0) {
        // Grab first couple of items from each category to show variety
        teaserItems.push(...cat.items.slice(0, 2))
      }
    })
  }

  // Slice to exactly 6 items (or pad with fallbacks if empty)
  const displayItems = teaserItems.slice(0, 6)
  while (displayItems.length < 6) {
    displayItems.push({ 
      id: 'fallback', 
      name: 'Work Sample', 
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop' 
    })
  }

  // Design software tools stack data
  const tools = [
    { name: 'Photoshop', label: 'Ps', color: 'bg-blue-500/10 border-blue-500/20 text-blue-400' },
    { name: 'Illustrator', label: 'Ai', color: 'bg-amber-500/10 border-amber-500/20 text-amber-400' },
    { name: 'After Effects', label: 'Ae', color: 'bg-purple-500/10 border-purple-500/20 text-purple-400' },
    { name: 'Premiere', label: 'Pr', color: 'bg-violet-500/10 border-violet-500/20 text-violet-450' },
    { name: 'Cinema 4D', label: 'C4D', color: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' },
    { name: 'Maya', label: 'My', color: 'bg-sky-500/10 border-sky-500/20 text-sky-400' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      {...hoverProps}
      className="relative overflow-hidden rounded-[36px] border border-teal/20 p-5 shadow-glow liquid-glass liquid-glass-hover flex flex-col justify-between"
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
          className="pointer-events-none absolute inset-0 z-20 rounded-[36px] border border-teal/45 transition-opacity duration-300"
          style={borderStyle}
        />
      )}

      {/* "Works With" Design Stack tools */}
      <div className="relative z-30 mb-4">
        <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-teal">
          Creative Design Stack
        </span>
        <h4 className="mt-1 text-sm font-bold text-foam">Works With</h4>
        
        {/* Row of software badges */}
        <div className="mt-3 flex flex-wrap gap-2">
          {tools.map(tool => (
            <div 
              key={tool.name}
              className={`flex h-8 px-2.5 items-center justify-center rounded-xl border font-bold text-xs ${tool.color} cursor-default`}
              title={tool.name}
            >
              {tool.label}
            </div>
          ))}
        </div>
      </div>

      {/* masonry/square grid preview of works fading into linear gradient */}
      <div className="relative overflow-hidden rounded-2xl border border-teal/10 bg-abyss/45 aspect-[16/6] xs:aspect-[16/5] sm:aspect-[16/4] lg:aspect-[16/7] z-30">
        
        {/* Thumbnails grid */}
        <div className="grid grid-cols-3 gap-2 p-2 h-full opacity-65 group-hover:opacity-85 transition-opacity duration-500">
          {displayItems.map((item, idx) => (
            <div 
              key={item.id + idx}
              className="w-full h-full overflow-hidden rounded-lg bg-panel/30 border border-teal/5"
            >
              <img
                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                src={getDriveThumbnailUrl(item, 300)}
                alt=""
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>

        {/* Fading Linear Gradient Overlay with centered View Portfolio button */}
        <div className="absolute inset-0 bg-gradient-to-t from-panel/95 via-panel/85 to-transparent dark:from-[#11151C]/95 dark:via-[#11151C]/80 dark:to-transparent z-40 flex items-center justify-center p-4">
          <motion.a
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.98 }}
            href="#portfolio"
            className="inline-flex items-center gap-2 rounded-full bg-teal px-5 py-2.5 text-xs font-extrabold text-white dark:text-abyss shadow-glow-teal hover:shadow-lg transition-all"
            id="teaser-view-portfolio-button"
          >
            <span>View Full Portfolio</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </motion.a>
        </div>
      </div>
    </motion.div>
  )
}
