import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { portfolio } from './data/portfolio'

const sectionShell =
  'liquid-glass liquid-glass-hover mt-6 rounded-[36px] px-6 py-10 shadow-glow sm:px-8 lg:px-12'

const sectionTitleClass =
  'font-display text-4xl leading-none tracking-[-0.02em] text-foam sm:text-5xl md:text-6xl'

const fadeInVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.21, 0.45, 0.32, 0.9] }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
}

function SectionHeader({ eyebrow, title }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeInVariants}
    >
      <p className="mb-2 text-[0.72rem] font-extrabold uppercase tracking-[0.25em] text-teal">
        {eyebrow}
      </p>
      <h2 className={sectionTitleClass}>{title}</h2>
    </motion.div>
  )
}

function HeroAction({ action }) {
  const isPrimary = action.variant === 'primary'
  const className = isPrimary
    ? 'inline-flex items-center justify-center rounded-full bg-teal px-5 py-3.5 font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg dark:text-abyss'
    : 'inline-flex items-center justify-center rounded-full border border-teal/25 theme-card-soft px-5 py-3.5 font-bold text-foam shadow-sm transition hover:-translate-y-0.5 hover:border-teal/60 hover:text-teal hover:shadow-md'

  return (
    <motion.a
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={className}
      href={action.href}
      target={action.external ? '_blank' : undefined}
      rel={action.external ? 'noreferrer' : undefined}
    >
      {action.label}
    </motion.a>
  )
}

function HeroFocusCard({ item }) {
  return (
    <motion.div 
      variants={fadeInVariants}
      whileHover={{ y: -5, scale: 1.01 }}
      className="liquid-glass liquid-glass-hover flex min-h-[520px] flex-col justify-between overflow-hidden rounded-[32px] p-6 shadow-glow lg:p-8"
    >
      <div>
        <span className="inline-block text-[0.78rem] font-extrabold uppercase tracking-[0.12em] text-teal">
          {item.title}
        </span>
        <h3 className="mt-4 text-3xl font-extrabold leading-tight text-foam sm:text-4xl">
          {item.company}
        </h3>
        <p className="mt-2 text-xl text-mist/80">{item.period}</p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {item.stats.map((stat) => (
          <div key={stat.label} className="rounded-3xl border border-teal/10 theme-chip px-5 py-5">
            <p className="font-sans text-6xl leading-none text-foam">{stat.value}</p>
            <p className="mt-2 text-lg font-semibold text-mist/85">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-[0.78rem] font-extrabold uppercase tracking-[0.16em] text-teal">
            Top Clients
          </p>
          <ul className="mt-4 space-y-2 text-lg leading-7 text-foam">
            {item.clients.map((client) => (
              <li key={client} className="flex gap-3">
                <span className="mt-2 h-2 w-2 flex-none rounded-full bg-teal" />
                <span>{client}</span>
              </li>
            ))}
          </ul>
        </div>

        <motion.a
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center justify-center rounded-full border border-teal/25 theme-card-soft px-5 py-3 text-sm font-bold text-foam shadow-sm transition hover:border-teal/70 hover:text-teal"
          href={item.linkedIn}
          target="_blank"
          rel="noreferrer"
        >
          View LinkedIn
        </motion.a>
      </div>

      <div className="mt-8 border-t border-teal/10 pt-5">
        <p className="text-base font-bold text-foam">{item.quote}</p>
        <p className="mt-2 text-sm leading-6 text-mist/70">{item.note}</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {item.services.map((service) => (
          <span
            key={service}
            className="rounded-full border border-teal/10 theme-chip px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-mist/80"
          >
            {service}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

function ExperienceCard({ item }) {
  return (
    <motion.article 
      variants={fadeInVariants}
      className="liquid-glass liquid-glass-hover rounded-3xl p-6 shadow-glow"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="text-2xl font-bold text-foam">{item.company}</h3>
        <p className="m-0 text-base text-mist/75">{item.role}</p>
      </div>
      <span className="mt-3 inline-block text-[0.78rem] font-extrabold uppercase tracking-[0.12em] text-teal">
        {item.period}
      </span>
      <ul className="mt-4 space-y-2 pl-5 text-base leading-7 text-mist/80 marker:text-teal">
        {item.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </motion.article>
  )
}

function ContactCard({ item }) {
  return (
    <motion.div 
      variants={fadeInVariants}
      className="liquid-glass liquid-glass-hover min-w-[220px] flex-1 rounded-3xl p-6 shadow-glow"
    >
      <span className="inline-block text-[0.78rem] font-extrabold uppercase tracking-[0.12em] text-teal">
        {item.label}
      </span>
      <a
        className="mt-3 block break-words text-base text-foam no-underline"
        href={item.href}
        target={item.external ? '_blank' : undefined}
        rel={item.external ? 'noreferrer' : undefined}
      >
        {item.value}
      </a>
    </motion.div>
  )
}

function ServiceCard({ item }) {
  return (
    <motion.article
      variants={fadeInVariants}
      whileHover={{ y: -5 }}
      className="liquid-glass liquid-glass-hover rounded-3xl p-6 shadow-glow"
    >
      <span className="font-display text-4xl text-teal/70">{item.number}</span>
      <h3 className="mt-7 text-xl font-bold text-foam">{item.title}</h3>
      <p className="mt-3 text-sm leading-7 text-mist/80">{item.description}</p>
    </motion.article>
  )
}

function CaseStudyCard({ item }) {
  const isPlayable = item.type === 'video' || item.type === 'animation'

  return (
    <motion.article
      variants={fadeInVariants}
      className="liquid-glass liquid-glass-hover overflow-hidden rounded-[30px] shadow-glow"
    >
      <div className="theme-image-panel relative overflow-hidden border-b border-teal/10">
        {isPlayable ? (
          <iframe
            className="aspect-video w-full border-0 bg-black"
            src={getDrivePreviewUrl(item)}
            title={`${item.title} video preview`}
            loading="lazy"
            allow="autoplay; fullscreen; encrypted-media"
            allowFullScreen
          />
        ) : (
          <>
            <img
              className="block h-auto w-full object-contain transition-transform duration-700 hover:scale-105"
              src={getDriveThumbnailUrl(item)}
              alt={`${item.title} preview`}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="theme-overlay-fade pointer-events-none absolute inset-0" />
          </>
        )}
      </div>
      <div className="p-6">
        <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.18em] text-teal">
          {item.category}
        </p>
        <h3 className="mt-3 text-2xl font-bold leading-tight text-foam">{item.title}</h3>
        <dl className="mt-6 space-y-4 text-sm leading-7 text-mist/80">
          <div>
            <dt className="font-extrabold uppercase tracking-[0.12em] text-teal">Challenge</dt>
            <dd className="mt-1">{item.challenge}</dd>
          </div>
          <div>
            <dt className="font-extrabold uppercase tracking-[0.12em] text-teal">Goal</dt>
            <dd className="mt-1">{item.goal}</dd>
          </div>
          <div>
            <dt className="font-extrabold uppercase tracking-[0.12em] text-teal">Final Output</dt>
            <dd className="mt-1">{item.output}</dd>
          </div>
          <div>
            <dt className="font-extrabold uppercase tracking-[0.12em] text-teal">Result</dt>
            <dd className="mt-1">{item.result}</dd>
          </div>
        </dl>
        <div className="mt-5 flex flex-wrap gap-2">
          {item.process.map((step) => (
            <span
              key={step}
              className="theme-chip rounded-full border border-teal/10 px-3 py-2 text-xs font-bold text-mist/80"
            >
              {step}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  )
}

function MotionShowcase({ section }) {
  return (
    <div className="mt-7 grid gap-4 lg:grid-cols-2">
      {section.items.map((item) => (
        <motion.article
          key={item.id}
          variants={fadeInVariants}
          className="liquid-glass overflow-hidden rounded-[28px] p-3 shadow-glow"
        >
          <iframe
            className="aspect-video w-full rounded-[20px] border-0 bg-black"
            src={`https://drive.google.com/file/d/${item.id}/preview`}
            title={item.title}
            loading="lazy"
            allow="autoplay; fullscreen; encrypted-media"
            allowFullScreen
          />
          <h3 className="px-3 pb-2 pt-4 text-lg font-bold text-foam">{item.title}</h3>
        </motion.article>
      ))}
    </div>
  )
}

function AboutSection({ section }) {
  const [portraitFailed, setPortraitFailed] = useState(false)
  const showPortrait = section.portrait && !portraitFailed

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <SectionHeader eyebrow={section.eyebrow} title={section.title} />
        <motion.p 
          variants={fadeInVariants}
          className="mt-5 max-w-3xl text-lg leading-9 text-mist/90"
        >
          {section.body}
        </motion.p>
        <motion.div variants={fadeInVariants} className="mt-7 grid gap-3 sm:grid-cols-3">
          {section.facts.map((fact) => (
            <div key={fact.label} className="theme-card-soft rounded-2xl border border-teal/10 px-4 py-4">
              <p className="text-lg font-extrabold text-foam">{fact.value}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-mist/70">
                {fact.label}
              </p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="liquid-glass overflow-hidden rounded-[32px] p-3 shadow-glow"
      >
        <div className="theme-image-panel relative aspect-[4/5] overflow-hidden rounded-[24px] border border-teal/10">
          {showPortrait ? (
            <img
              className="h-full w-full object-cover"
              src={section.portrait}
              alt={`${section.name} portrait`}
              onError={() => setPortraitFailed(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-display text-7xl text-foam/80">HK</span>
            </div>
          )}
          <div className="theme-overlay-fade pointer-events-none absolute inset-0 opacity-40 dark:opacity-75" />
        </div>
      </motion.div>
    </div>
  )
}

function BrandLogo({ item }) {
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

function BrandCard({ item }) {
  const CardTag = item.linkedIn ? 'a' : 'article'

  return (
    <motion.div
      variants={fadeInVariants}
      className="min-w-[280px]"
    >
      <CardTag
        className="liquid-glass liquid-glass-hover flex h-full flex-col justify-between rounded-3xl p-5 no-underline shadow-glow"
        href={item.linkedIn}
        target={item.linkedIn ? '_blank' : undefined}
        rel={item.linkedIn ? 'noreferrer' : undefined}
      >
        <div className="flex items-start justify-between gap-4">
          <BrandLogo item={item} />
          <span className="theme-chip rounded-full border border-teal/10 px-3 py-1 text-xs font-bold text-mist/70">
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

function BrandsMarquee({ items }) {
  // Triple the items to ensure seamless loop
  const marqueeItems = [...items, ...items, ...items]
  
  return (
    <div className="relative mt-8 w-full overflow-hidden py-4">
      {/* Gradient masks for smooth fade in/out */}
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

function getDriveThumbnailUrl(media, width = 1600) {
  if (!media) return ''
  const id = media.id || (typeof media.thumbnail === 'string' && media.thumbnail.match(/[?&]id=([A-Za-z0-9_-]{20,})/)?.[1])
  if (id) {
    return `https://lh3.googleusercontent.com/d/${id}=w${width}`
  }
  return media.thumbnail
}

function MediaThumbnail({ media, categoryTitle, index }) {
  const [hasError, setHasError] = useState(false)

  if (hasError || !media.thumbnail) {
    return (
      <div className="flex h-full w-full items-center justify-center px-5 text-center">
        <span className="text-sm font-extrabold uppercase tracking-[0.18em] text-foam/80">
          {media.type === 'video' ? 'Video' : media.type === 'animation' ? 'Animation' : 'Portfolio'}
        </span>
      </div>
    )
  }

  return (
    <img
      className="block h-auto w-full select-none object-contain transition-transform duration-700 hover:scale-105"
      src={getDriveThumbnailUrl(media, 900)}
      alt={media.name || `${categoryTitle} sample ${index}`}
      loading="lazy"
      draggable="false"
      referrerPolicy="no-referrer"
      onContextMenu={(event) => event.preventDefault()}
      onError={() => setHasError(true)}
    />
  )
}

function getDrivePreviewUrl(media) {
  if (media.href) {
    return media.href.replace(/\/view(\?.*)?$/, '/preview')
  }

  if (media.id) {
    return `https://drive.google.com/file/d/${media.id}/preview`
  }

  return media.thumbnail
}

function PortfolioLightbox({ media, onClose }) {
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
  const previewUrl = getDrivePreviewUrl(media)

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
              <h3 className="mt-1 truncate text-base font-bold text-foam sm:text-lg">{media.name}</h3>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {isPlayable ? (
                <a
                  className="theme-card-soft inline-flex h-11 items-center justify-center rounded-full border border-teal/20 px-4 text-sm font-bold text-foam transition hover:border-teal/60 hover:text-teal"
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open in new tab
                </a>
              ) : null}
              <button
                className="theme-card-soft flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-teal/20 text-2xl leading-none text-foam transition hover:border-teal/60 hover:text-teal"
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
              <iframe
                className="h-full min-h-[62vh] w-full rounded-[18px] border-0 bg-black"
                src={previewUrl}
                title={media.name || 'Drive video preview'}
                allow="autoplay; fullscreen; encrypted-media"
                allowFullScreen
                referrerPolicy="no-referrer"
              />
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

function PortfolioPlaceholder({ categoryTitle, index, item, onOpen }) {
  const media = typeof item === 'string' ? { name: `Work ${index}`, thumbnail: item } : item
  const isPlayable = media.type === 'video' || media.type === 'animation'

  return (
    <motion.div 
      variants={fadeInVariants}
      className="liquid-glass liquid-glass-hover mb-4 inline-block w-full break-inside-avoid overflow-hidden rounded-[24px] p-3 shadow-glow"
    >
      <button
        className={`relative block w-full overflow-hidden rounded-[18px] border border-teal/10 bg-panel p-0 text-left ${isPlayable ? 'cursor-pointer' : 'cursor-zoom-in'}`}
        type="button"
        onClick={() => onOpen(media)}
        onContextMenu={(event) => event.preventDefault()}
        title={media.name}
        aria-label={isPlayable ? `Play ${media.name}` : `Preview ${media.name}`}
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

function PortfolioCategory({ category, onOpenMedia }) {
  const items = category.items || (category.images || []).map((image) => ({ thumbnail: image }))

  if (!items.length) {
    return null
  }

  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={staggerContainer}
      className="liquid-glass rounded-[32px] px-6 py-8 shadow-glow sm:px-8 lg:px-10"
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

      <div className="mt-6 columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5">
        {items.map((item, index) => (
          <PortfolioPlaceholder
            key={item.id || `${category.title}-${index}`}
            categoryTitle={category.title}
            index={index + 1}
            item={item}
            onOpen={onOpenMedia}
          />
        ))}
      </div>
    </motion.section>
  )
}

export default function App() {
  const { meta, navigation, hero, sections, portfolioPage } = portfolio
  const [currentHash, setCurrentHash] = useState(() =>
    typeof window !== 'undefined' ? window.location.hash : '',
  )
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme')
      return saved !== 'light'
    }
    return true
  })
  const [selectedMedia, setSelectedMedia] = useState(null)

  const isPortfolioPage = currentHash === '#portfolio'
  const homeNavigation = navigation.filter((item) => !item.page)
  const orderedSections = homeNavigation.map((item) => sections[item.id]).filter(Boolean)

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDarkMode])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const syncHash = () => setCurrentHash(window.location.hash)

    window.addEventListener('hashchange', syncHash)

    return () => {
      window.removeEventListener('hashchange', syncHash)
    }
  }, [])

  return (
    <div className="theme-page-bg min-h-screen overflow-x-hidden text-mist transition-colors duration-300">
      {/* Background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="theme-grid-bg absolute inset-0" />
        <div className="theme-hero-glow absolute inset-x-0 top-0 h-[500px] blur-3xl" />
        
        {/* Animated Orbs */}
        <div className="theme-orb-a absolute -left-24 top-24 h-96 w-96 rounded-full blur-[120px]" />
        <div className="theme-orb-b absolute right-[-6rem] top-[15rem] h-[500px] w-[500px] rounded-full blur-[140px]" />
        <div className="theme-orb-c absolute bottom-[-10rem] left-1/4 h-[600px] w-[600px] rounded-full blur-[160px]" />
      </div>

      <div className="relative z-10 w-full px-3 py-3 sm:px-5 lg:px-8">
        <header className="liquid-glass sticky top-3 z-30 flex min-h-[92px] w-full flex-col gap-6 rounded-[32px] px-6 py-6 shadow-glow md:flex-row md:items-center md:justify-between lg:px-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="mb-2 text-[0.72rem] font-extrabold uppercase tracking-[0.25em] text-teal">
              {meta.label}
            </p>
            <h1 className="font-display text-5xl leading-[0.95] tracking-[-0.02em] text-foam sm:text-6xl">
              {meta.title}
            </h1>
            <p className="mt-2 text-base font-medium text-mist">{meta.role}</p>
          </motion.div>

          <div className="flex flex-wrap items-center gap-6">
            <nav className="flex flex-wrap gap-4 text-sm font-bold text-mist sm:text-base">
              {navigation.map((item, index) => (
                <motion.a
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  key={item.id}
                  className="transition hover:text-teal"
                  href={item.page === 'portfolio' ? '#portfolio' : item.page === 'home' ? '#' : `#${item.id}`}
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="theme-card-soft flex h-12 w-12 items-center justify-center rounded-full border border-teal/20 text-teal backdrop-blur-md transition-colors hover:border-teal/50"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              type="button"
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M3 12h2.25m.386-6.364l1.591 1.591M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </motion.button>
          </div>
        </header>

        <main className="w-full">
          <AnimatePresence mode="wait">
            {isPortfolioPage ? (
              <motion.section 
                key="portfolio-page"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="py-8 md:py-12"
              >
                <div className="liquid-glass rounded-[36px] px-6 py-10 shadow-glow sm:px-8 lg:px-12">
                  <SectionHeader eyebrow={portfolioPage.eyebrow} title={portfolioPage.title} />
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-5 max-w-3xl text-base leading-8 text-mist/80"
                  >
                    {portfolioPage.intro}
                  </motion.p>
                </div>

                <div className="mt-6 grid gap-6">
                  {portfolioPage.categories.map((category) => (
                    <PortfolioCategory
                      key={category.title}
                      category={category}
                      onOpenMedia={setSelectedMedia}
                    />
                  ))}
                </div>
              </motion.section>
            ) : (
              <motion.div
                key="home-page"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <section className="grid min-h-[calc(100vh-8rem)] gap-6 py-8 lg:grid-cols-[1.45fr_0.9fr] lg:items-stretch lg:py-10">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="liquid-glass flex flex-col justify-between rounded-[40px] px-6 py-10 shadow-glow sm:px-8 lg:px-12"
                  >
                    <div>
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-3 text-[0.72rem] font-extrabold uppercase tracking-[0.25em] text-teal"
                      >
                        {hero.eyebrow}
                      </motion.p>
                      <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="font-display text-5xl leading-[0.92] tracking-[-0.02em] text-foam sm:text-6xl lg:max-w-[11ch] lg:text-[6.5rem] xl:text-[7.4rem]"
                      >
                        {hero.heading}
                      </motion.h2>
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="mt-6 max-w-3xl text-base font-medium leading-8 text-mist lg:text-lg"
                      >
                        {hero.description}
                      </motion.p>
                    </div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="mt-7 flex flex-col flex-wrap gap-3 sm:flex-row"
                    >
                      {hero.actions.map((action) => (
                        <HeroAction key={action.label} action={action} />
                      ))}
                    </motion.div>
                  </motion.div>

                  <motion.aside 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="grid gap-4 lg:grid-rows-1"
                  >
                    {hero.highlights.map((item) => (
                      <HeroFocusCard key={item.title} item={item} />
                    ))}
                  </motion.aside>
                </section>

                {orderedSections.map((section) => (
                  <motion.section
                    key={section.id}
                    id={section.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className={`${sectionShell}${section.id === 'contact' ? ' mb-6' : ''}`}
                  >
                    {section.id === 'about' ? (
                      <AboutSection section={section} />
                    ) : (
                      <>
                        <SectionHeader eyebrow={section.eyebrow} title={section.title} />

                        {section.body ? (
                          <motion.p 
                            variants={fadeInVariants}
                            className="mt-5 max-w-3xl text-base leading-8 text-mist/80"
                          >
                            {section.body}
                          </motion.p>
                        ) : null}
                      </>
                    )}

                    {section.id === 'experience' ? (
                      <div className="mt-7 grid gap-4 xl:grid-cols-2">
                        {section.items.map((item) => (
                          <ExperienceCard key={item.company} item={item} />
                        ))}
                      </div>
                    ) : null}

                    {section.id === 'services' ? (
                      <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {section.items.map((item) => (
                          <ServiceCard key={item.title} item={item} />
                        ))}
                      </div>
                    ) : null}

                    {section.id === 'case-studies' ? (
                      <>
                        <div className="mt-7 grid gap-5 xl:grid-cols-3">
                          {section.items.map((item) => (
                            <CaseStudyCard key={item.title} item={item} />
                          ))}
                        </div>
                        <motion.a
                          variants={fadeInVariants}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className="mt-7 inline-flex items-center justify-center rounded-full bg-teal px-5 py-3.5 font-bold text-white shadow-md transition hover:shadow-lg dark:text-abyss"
                          href={section.action.href}
                        >
                          {section.action.label}
                        </motion.a>
                      </>
                    ) : null}

                    {section.id === 'motion' ? <MotionShowcase section={section} /> : null}

                    {section.id === 'skills' ? (
                      <div className="mt-6 flex flex-wrap gap-3">
                        {section.items.map((item) => (
                          <motion.span
                            key={item}
                            variants={fadeInVariants}
                            whileHover={{ scale: 1.05 }}
                            className="theme-card-soft cursor-default rounded-full border border-teal/25 px-4 py-3 font-bold text-foam backdrop-blur-md"
                          >
                            {item}
                          </motion.span>
                        ))}
                      </div>
                    ) : null}

                    {section.id === 'brands' ? (
                      <motion.div variants={fadeInVariants}>
                        <BrandsMarquee items={section.items} />
                      </motion.div>
                    ) : null}

                    {section.id === 'contact' ? (
                      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {section.items.map((item) => (
                          <ContactCard key={item.label} item={item} />
                        ))}
                      </div>
                    ) : null}
                  </motion.section>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="px-2 py-5 text-center text-base text-mist/65">
          <p>&copy; {meta.copyright}</p>
        </footer>
      </div>

      <PortfolioLightbox media={selectedMedia} onClose={() => setSelectedMedia(null)} />
    </div>
  )
}
