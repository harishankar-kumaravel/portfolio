import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeInVariants } from '../utils/portfolioUtils'

export function BrandLogo({ item }) {
  const [logoFailed, setLogoFailed] = useState(false)
  const showLogo = item.logoUrl && !logoFailed

  return (
    <div className="theme-card-soft flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-teal/20 text-center text-lg font-extrabold leading-none text-foam shadow-sm">
      {showLogo ? (
        <img
          className="h-full w-full object-contain p-2 transition-transform duration-500 hover:scale-110"
          src={item.logoUrl}
          alt={`${item.name} logo`}
          loading="lazy"
          onError={() => setLogoFailed(true)}
        />
      ) : (
        <span className="opacity-70">{item.logo}</span>
      )}
    </div>
  )
}

export function BrandCard({ item }) {
  const CardTag = item.linkedIn ? 'a' : 'article'

  return (
    <motion.div
      variants={fadeInVariants}
      className="min-w-[280px]"
    >
      <CardTag
        className="liquid-glass liquid-glass-hover flex h-full flex-col justify-between rounded-3xl p-5 no-underline shadow-glow border border-teal/20"
        href={item.linkedIn}
        target={item.linkedIn ? '_blank' : undefined}
        rel={item.linkedIn ? 'noreferrer' : undefined}
      >
        <div className="flex items-start justify-between gap-4">
          <BrandLogo item={item} />
          <span className="theme-chip rounded-full border border-teal/10 px-3 py-1 text-xs font-bold text-mist/75">
            {item.location}
          </span>
        </div>

        <div className="mt-6">
          <p className="text-xl font-bold leading-tight text-foam">{item.name}</p>
          <p className="mt-3 text-sm font-semibold uppercase tracking-[0.16em] text-teal">{item.type}</p>
        </div>
      </CardTag>
    </motion.div>
  )
}

export default function BrandsMarquee({ items }) {
  const marqueeItems = [...items, ...items, ...items]
  
  return (
    <div className="relative mt-8 w-full overflow-hidden py-4">
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-abyss to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-abyss to-transparent" />
      
      <div className="animate-marquee flex gap-6">
        {marqueeItems.map((item, index) => (
          <BrandCard key={`${item.name}-${index}`} item={item} />
        ))}
      </div>
    </div>
  )
}
