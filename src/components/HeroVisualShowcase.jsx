import { motion } from 'framer-motion'
import { useMouseGlow, getDriveThumbnailUrl, deobfuscateMedia } from '../utils/portfolioUtils'

export default function HeroVisualShowcase({ onOpenMedia }) {
  const { hoverProps, glowStyle, borderStyle, isHovered } = useMouseGlow()

  // Featured campaign project details (Durashine Supreme)
  const rawFeaturedItem = {
    id: 'KlVS3sWclFTRZpVNwcmc0F3anhjZUhnSDdEb3ombPRVM',
    name: 'Durashine Supreme Campaign',
    type: 'image',
    thumbnail: 'https://drive.google.com/thumbnail?id=KlVS3sWclFTRZpVNwcmc0F3anhjZUhnSDdEb3ombPRVM&sz=w1600',
    href: 'https://drive.google.com/file/d/KlVS3sWclFTRZpVNwcmc0F3anhjZUhnSDdEb3ombPRVM/view?usp=sharing'
  }

  const featuredItem = deobfuscateMedia(rawFeaturedItem)

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.3 }}
      {...hoverProps}
      onClick={() => onOpenMedia(featuredItem)}
      className="relative cursor-pointer overflow-hidden rounded-[36px] border border-teal/20 p-4 shadow-glow liquid-glass liquid-glass-hover flex flex-col group justify-between"
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

      {/* Image Panel wrapper */}
      <div className="relative overflow-hidden aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] rounded-[28px] border border-teal/10 bg-abyss/40 z-30">
        <img
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={getDriveThumbnailUrl(featuredItem, 1000)}
          alt="Durashine Supreme Campaign Preview"
          loading="eager"
          referrerPolicy="no-referrer"
        />
        
        {/* Floating pill badge */}
        <div className="absolute top-4 left-4 z-40 theme-card-soft rounded-full border border-teal/20 px-3.5 py-1.5 text-[0.68rem] font-extrabold uppercase tracking-widest text-teal shadow-md backdrop-blur-xl">
          Featured Work
        </div>

        {/* View project overlay */}
        <div className="absolute inset-0 bg-abyss/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="theme-card-soft rounded-full border border-teal/30 px-5 py-2.5 text-xs font-bold text-foam shadow-glow backdrop-blur-xl flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <span>View Work Preview</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </div>
        </div>
      </div>

      {/* Info card footer */}
      <div className="mt-5 px-2 pb-1 relative z-30 flex justify-between items-end">
        <div>
          <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-teal">
            Tata BlueScope Campaign
          </span>
          <h3 className="mt-1.5 text-xl font-bold leading-tight text-foam group-hover:text-teal transition-colors">
            Durashine Supreme Visuals
          </h3>
          <p className="mt-1 text-xs text-mist/75 max-w-sm">
            Culturally resonant marketing campaign visuals designed for regional markets.
          </p>
        </div>
        <div className="hidden xs:flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal/10 border border-teal/20 text-teal group-hover:bg-teal group-hover:text-abyss transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
          </svg>
        </div>
      </div>
    </motion.div>
  )
}
