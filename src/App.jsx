import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
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
    ? 'inline-flex items-center justify-center rounded-full bg-teal px-5 py-3.5 font-bold text-abyss transition hover:bg-[#2ae1c0]'
    : 'inline-flex items-center justify-center rounded-full border border-teal/30 bg-white/5 px-5 py-3.5 font-bold text-foam transition hover:border-teal/60 hover:text-teal'

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
          <div key={stat.label} className="rounded-3xl border border-teal/20 bg-teal/10 px-5 py-5">
            <p className="font-display text-6xl leading-none text-foam">{stat.value}</p>
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
          className="inline-flex items-center justify-center rounded-full border border-teal/35 bg-white/5 px-5 py-3 text-sm font-bold text-foam transition hover:border-teal/70 hover:text-teal"
          href={item.linkedIn}
          target="_blank"
          rel="noreferrer"
        >
          View LinkedIn
        </motion.a>
      </div>

      <div className="mt-8 border-t border-white/10 pt-5">
        <p className="text-base font-bold text-foam">{item.quote}</p>
        <p className="mt-2 text-sm leading-6 text-mist/70">{item.note}</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {item.services.map((service) => (
          <span
            key={service}
            className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-mist/80"
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
          className="mt-5 max-w-3xl text-lg leading-9 text-mist/85"
        >
          {section.body}
        </motion.p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="liquid-glass overflow-hidden rounded-[32px] p-3 shadow-glow"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(88,255,222,0.2),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]">
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
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_54%,rgba(4,16,15,0.68))]" />
        </div>
      </motion.div>
    </div>
  )
}

function BrandLogo({ item }) {
  const [logoFailed, setLogoFailed] = useState(false)
  const showLogo = item.logoUrl && !logoFailed

  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-teal/25 bg-white/[0.06] text-center text-lg font-extrabold leading-none text-foam shadow-inner">
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
          <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-bold text-mist/70">
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
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-[#04100f] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-[#04100f] to-transparent" />
      
      <div className="animate-marquee flex gap-6">
        {marqueeItems.map((item, index) => (
          <BrandCard key={`${item.name}-${index}`} item={item} />
        ))}
      </div>
    </div>
  )
}

function PortfolioPlaceholder({ categoryTitle, index, aspect, image }) {
  const aspectClass =
    aspect === 'portrait'
      ? 'aspect-[4/5]'
      : aspect === 'square'
        ? 'aspect-square'
        : aspect === 'video'
          ? 'aspect-video'
          : 'aspect-[16/10]'

  return (
    <motion.div 
      variants={fadeInVariants}
      className="liquid-glass liquid-glass-hover flex min-w-[240px] flex-1 basis-[280px] overflow-hidden rounded-[24px] p-3 shadow-glow"
    >
      <div
        className={`relative ${aspectClass} w-full overflow-hidden rounded-[18px] border border-white/10 bg-[rgba(4,16,15,0.62)]`}
      >
        <img
          className="h-full w-full object-contain transition-transform duration-700 hover:scale-105"
          src={image}
          alt={`${categoryTitle} sample ${index}`}
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(4,16,15,0.72))]" />
        <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/10 bg-[rgba(4,16,15,0.48)] px-4 py-3 backdrop-blur-xl">
          <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.24em] text-teal">
            {categoryTitle}
          </p>
          <p className="mt-2 text-sm text-mist/80">Placeholder {index}</p>
        </div>
      </div>
    </motion.div>
  )
}

function PortfolioCategory({ category }) {
  const placeholders = Array.from({ length: category.count }, (_, index) => index + 1)
  const images = category.images || []

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
          className="rounded-full border border-teal/25 bg-white/10 px-4 py-2 text-sm font-semibold text-foam backdrop-blur-md"
        >
          {category.count} placeholders
        </motion.span>
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        {placeholders.map((index) => (
          <PortfolioPlaceholder
            key={`${category.title}-${index}`}
            categoryTitle={category.title}
            index={index}
            aspect={category.aspect}
            image={images[(index - 1) % images.length]}
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
  const isPortfolioPage = currentHash === '#portfolio'
  const homeNavigation = navigation.filter((item) => !item.page)
  const orderedSections = homeNavigation.map((item) => sections[item.id]).filter(Boolean)

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
    <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,rgba(88,255,222,0.18),transparent_20%),radial-gradient(circle_at_85%_18%,rgba(36,130,109,0.22),transparent_24%),radial-gradient(circle_at_50%_100%,rgba(9,95,79,0.18),transparent_30%),linear-gradient(180deg,#04100f_0%,#071715_38%,#0a2220_100%)] text-mist">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.28),transparent_78%)]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(98,255,228,0.26),transparent_58%)] blur-3xl" />
      <div className="pointer-events-none fixed -left-16 top-24 h-64 w-64 rounded-full bg-teal/20 blur-[120px]" />
      <div className="pointer-events-none fixed right-[-4rem] top-[18rem] h-80 w-80 rounded-full bg-cyan-300/10 blur-[140px]" />
      <div className="pointer-events-none fixed bottom-[-5rem] left-1/3 h-72 w-72 rounded-full bg-emerald-300/10 blur-[150px]" />

      <div className="relative w-full px-3 py-3 sm:px-5 lg:px-8">
        <header className="liquid-glass sticky top-3 z-20 flex min-h-[92px] w-full flex-col gap-6 rounded-[32px] px-6 py-6 shadow-glow md:flex-row md:items-center md:justify-between lg:px-10">
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
            <p className="mt-2 text-base text-mist/80">{meta.role}</p>
          </motion.div>

          <nav className="flex flex-wrap gap-4 text-sm font-medium text-mist sm:text-base">
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
                    <PortfolioCategory key={category.title} category={category} />
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
                        className="mt-6 max-w-3xl text-base leading-8 text-mist/80 lg:text-lg"
                      >
                        {hero.description}
                      </motion.p>
                    </div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="mt-7 flex flex-col gap-3 sm:flex-row"
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

                    {section.id === 'skills' ? (
                      <div className="mt-6 flex flex-wrap gap-3">
                        {section.items.map((item, idx) => (
                          <motion.span
                            key={item}
                            variants={fadeInVariants}
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                            className="rounded-full border border-teal/25 bg-white/10 px-4 py-3 font-bold text-foam backdrop-blur-md cursor-default"
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
    </div>
  )
}
