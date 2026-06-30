import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { portfolio } from './data/portfolio'

// Import utilities
import {
  deobfuscatePortfolio,
  fadeInVariants,
  staggerContainer,
  sectionShell,
  DeferredSection
} from './utils/portfolioUtils'

// Import split components
import Header from './components/Header'
import HeroVisualShowcase from './components/HeroVisualShowcase'
import SectionHeader from './components/SectionHeader'
import Timeline from './components/Timeline'
import BrandsMarquee from './components/Brands'
import ContactForm from './components/ContactForm'
import PortfolioLightbox from './components/PortfolioLightbox'
import { PortfolioCategory } from './components/PortfolioComponents'
import AboutSection from './components/AboutSection'
import MotionShowcase from './components/MotionShowcase'
import PortfolioTeaserCard from './components/PortfolioTeaserCard'
import {
  HeroAction,
  HeroFocusCard,
  RecruiterQuickCard,
  ServiceCard,
  CaseStudyCard,
  ClientProjectCard,
  TestimonialCard,
  SkillBadge,
  ContactCard
} from './components/Cards'

export default function App() {
  const [portfolioData, setPortfolioData] = useState(() => deobfuscatePortfolio(portfolio))
  const { meta, navigation, hero, sections, portfolioPage } = portfolioData

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
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0)

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

  // Only display two primary actions in the hero to keep it clean and premium
  const cleanHeroActions = [
    hero.actions[0], // Explore Portfolio (Primary)
    hero.actions[5]  // Let's Work Together (Secondary)
  ].filter(Boolean)

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

      <div className="relative z-10 w-full max-w-[1800px] mx-auto px-4 py-4 sm:px-6 lg:px-8 xl:px-12">
        <Header 
          meta={meta} 
          isDarkMode={isDarkMode} 
          setIsDarkMode={setIsDarkMode} 
        />

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
                <div className="liquid-glass rounded-[36px] px-6 py-10 shadow-glow sm:px-8 lg:px-12 border border-teal/20">
                  <SectionHeader eyebrow={portfolioPage.eyebrow} title={portfolioPage.title} />
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-5 max-w-3xl text-base leading-8 text-mist/85 font-medium"
                  >
                    {portfolioPage.intro}
                  </motion.p>
                  
                  {/* Category Filter Tabs with active count */}
                  <div className="mt-8 flex flex-wrap gap-2.5 border-t border-teal/10 pt-8">
                    {portfolioPage.categories.map((category, index) => (
                      <button
                        key={category.title}
                        type="button"
                        onClick={() => setActiveCategoryIndex(index)}
                        className={`relative rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 cursor-pointer ${
                          activeCategoryIndex === index
                            ? 'bg-teal text-white dark:text-abyss shadow-glow-teal'
                            : 'theme-card-soft border border-teal/20 text-foam hover:border-teal/50 hover:text-teal'
                        }`}
                        id={`portfolio-tab-${category.title.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {category.title}
                        <span className="ml-2 text-xs opacity-75">
                          ({category.items?.length || category.images?.length || 0})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={portfolioPage.categories[activeCategoryIndex].title}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.35 }}
                    >
                      <PortfolioCategory
                        category={portfolioPage.categories[activeCategoryIndex]}
                        onOpenMedia={setSelectedMedia}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.section>
            ) : (
              <motion.div
                key="home-page"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Hero Section */}
                <section className="grid gap-6 pt-4 pb-2 lg:grid-cols-[1.45fr_0.9fr] lg:items-stretch lg:pt-6 lg:pb-3">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="liquid-glass flex flex-col justify-between rounded-[40px] px-5 py-6 sm:px-8 sm:py-8 lg:px-10 border border-teal/20 h-full"
                  >
                    <div>
                      {/* Immediate Joiner & Availability Indicator */}
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal/20 bg-teal/5 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-teal"
                      >
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal"></span>
                        </span>
                        Available for Freelance & Full-time Roles
                      </motion.div>

                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-2 text-[0.72rem] font-extrabold uppercase tracking-[0.25em] text-teal"
                      >
                        {hero.eyebrow}
                      </motion.p>
                      
                      <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="font-display text-4xl sm:text-6xl lg:max-w-[12ch] lg:text-[5.8rem] xl:text-[6.5rem] leading-[0.95] tracking-[-0.02em] text-foam font-black"
                      >
                        {hero.heading}
                      </motion.h2>
                      
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="mt-4 max-w-3xl text-base font-semibold leading-7 text-mist lg:text-lg"
                      >
                        {hero.description}
                      </motion.p>
                    </div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="mt-6 flex flex-col flex-wrap gap-3.5 sm:flex-row"
                    >
                      {cleanHeroActions.map((action) => (
                        <HeroAction key={action.label} action={action} />
                      ))}
                    </motion.div>
                  </motion.div>

                  {/* Right Column: Hero Visual Showcase + Portfolio Teaser */}
                  <div className="flex flex-col gap-6">
                    <HeroVisualShowcase onOpenMedia={setSelectedMedia} />
                    <PortfolioTeaserCard categories={portfolioPage.categories} />
                  </div>
                </section>

                {/* Highlights and Quick Profile Row (Widgets) */}
                <section className="grid gap-6 py-2 md:grid-cols-2">
                  {hero.highlights.map((item) => (
                    <HeroFocusCard key={item.title} item={item} />
                  ))}
                  <RecruiterQuickCard profile={portfolioData.quickProfile} />
                </section>

                {/* Subsections */}
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
                            className="mt-5 max-w-3xl text-base leading-8 text-mist/85 font-medium"
                          >
                            {section.body}
                          </motion.p>
                        ) : null}
                      </>
                    )}

                    {section.id === 'experience' ? (
                      <DeferredSection height="500px">
                        <Timeline items={section.items} />
                      </DeferredSection>
                    ) : null}

                    {section.id === 'services' ? (
                      <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {section.items.map((item) => (
                          <ServiceCard key={item.title} item={item} />
                        ))}
                      </div>
                    ) : null}

                    {section.id === 'case-studies' ? (
                      <DeferredSection height="600px">
                        <div className="mt-7 grid gap-5 xl:grid-cols-3">
                          {section.items.map((item) => (
                            <CaseStudyCard key={item.title} item={item} />
                          ))}
                        </div>
                        <div className="mt-8 flex justify-start">
                          <motion.a
                            variants={fadeInVariants}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center justify-center rounded-full bg-teal px-6 py-4 font-bold text-white shadow-md transition hover:shadow-lg dark:text-abyss text-base"
                            href={section.action.href}
                          >
                            {section.action.label}
                          </motion.a>
                        </div>
                      </DeferredSection>
                    ) : null}

                    {section.id === 'client-projects' ? (
                      <DeferredSection height="400px">
                        <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                          {section.items.map((item) => (
                            <ClientProjectCard key={item.client} item={item} />
                          ))}
                        </div>
                      </DeferredSection>
                    ) : null}

                    {section.id === 'motion' ? (
                      <DeferredSection height="500px">
                        <MotionShowcase section={section} />
                      </DeferredSection>
                    ) : null}

                    {section.id === 'skills' ? (
                      <DeferredSection height="400px">
                        <div className="mt-8 space-y-10">
                          {section.categories.map((category) => (
                            <div key={category.name} className="space-y-4">
                              <h3 className="text-lg font-extrabold uppercase tracking-[0.16em] text-teal border-b border-teal/10 pb-2">
                                {category.name}
                              </h3>
                              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                                {category.items.map((item) => (
                                  <SkillBadge key={item} name={item} />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </DeferredSection>
                    ) : null}

                    {section.id === 'testimonials' ? (
                      <DeferredSection height="350px">
                        <div className="mt-8 grid gap-6 md:grid-cols-2">
                          {section.items.map((item, index) => (
                            <TestimonialCard key={index} item={item} />
                          ))}
                        </div>
                      </DeferredSection>
                    ) : null}

                    {section.id === 'brands' ? (
                      <DeferredSection height="180px">
                        <motion.div variants={fadeInVariants}>
                          <BrandsMarquee items={section.items} />
                        </motion.div>
                      </DeferredSection>
                    ) : null}

                    {section.id === 'contact' ? (
                      <DeferredSection height="500px">
                        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
                          <div className="grid gap-4 sm:grid-cols-2">
                            {section.items.map((item) => (
                              <ContactCard key={item.label} item={item} />
                            ))}
                          </div>
                          <motion.div variants={fadeInVariants}>
                            <ContactForm />
                          </motion.div>
                        </div>
                      </DeferredSection>
                    ) : null}
                  </motion.section>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="px-2 py-8 text-center text-base text-mist/65">
          <p>&copy; {meta.copyright} &bull; Visual Design Portfolio</p>
        </footer>
      </div>

      <PortfolioLightbox media={selectedMedia} onClose={() => setSelectedMedia(null)} />
    </div>
  )
}
