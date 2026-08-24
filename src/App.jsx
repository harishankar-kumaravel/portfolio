import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { portfolio } from './data/portfolio'
import { siteContent } from './data/siteContent'
import { deobfuscatePortfolio, getDriveThumbnailUrl } from './utils/portfolioUtils'
import PortfolioLightbox from './components/PortfolioLightbox'

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.65, ease: [0.2, 0.7, 0.2, 1] },
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 19 19 5m0 0H8m11 0v11" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0 4-4m-4 4-4-4M5 20h14" />
    </svg>
  )
}

function ThemeIcon({ dark }) {
  return dark ? (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="4" />
      <path strokeLinecap="round" d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4m0-14.2-1.4 1.4M6.3 17.7l-1.4 1.4" />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.4 15.2A8.5 8.5 0 0 1 8.8 3.6 8.5 8.5 0 1 0 20.4 15.2Z" />
    </svg>
  )
}

function Header({ dark, onThemeChange, portfolioView }) {
  return (
    <header className="site-header">
      <a className="brand-lockup" href={portfolioView ? '#' : '#top'} aria-label="Harishankar K, home">
        <span className="brand-mark">HK</span>
        <span className="brand-copy">
          <strong>Harishankar K</strong>
          <small>Visual designer</small>
        </span>
      </a>

      <nav className="primary-nav" aria-label="Primary navigation">
        {portfolioView ? (
          <a href="#selected-work">Back to home</a>
        ) : (
          <>
            <a href="#selected-work">Work</a>
            <a href="#services">Services</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </>
        )}
      </nav>

      <div className="header-actions">
        <a
          className={`header-portfolio-button${portfolioView ? ' is-active' : ''}`}
          href="#portfolio"
          aria-current={portfolioView ? 'page' : undefined}
        >
          <span /> Portfolio
        </a>
        <a className="header-resume-button" href="/resume.pdf" download aria-label="Download Resume">
          <DownloadIcon />
          <span>Resume</span>
        </a>
        <a className="availability-link" href="mailto:k.harish2323@gmail.com">
          <span /> Available
        </a>
        <button
          className="theme-toggle"
          type="button"
          onClick={() => onThemeChange(!dark)}
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <ThemeIcon dark={dark} />
        </button>
      </div>
    </header>
  )
}

function SectionHeading({ eyebrow, title, intro, inverse = false }) {
  return (
    <motion.div className={`section-heading${inverse ? ' section-heading--inverse' : ''}`} {...reveal}>
      <p className="section-label">{eyebrow}</p>
      <h2>{title}</h2>
      {intro ? <p className="section-intro">{intro}</p> : null}
    </motion.div>
  )
}

function WorkImage({ media, eager = false }) {
  const [failed, setFailed] = useState(false)

  if (!media || failed) {
    return <div className="image-fallback">HK / Selected work</div>
  }

  return (
    <img
      src={getDriveThumbnailUrl(media, 1600)}
      alt={media.name || 'Selected portfolio work'}
      loading={eager ? 'eager' : 'lazy'}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  )
}

function SelectedWork({ projects, media, onOpen }) {
  return (
    <section className="page-section work-section" id="selected-work">
      <SectionHeading
        eyebrow={siteContent.work.eyebrow}
        title={siteContent.work.title}
        intro={siteContent.work.intro}
      />

      <div className="project-list">
        {projects.map((project, index) => (
          <motion.article className={`project project--${index + 1}`} key={project.title} {...reveal}>
            <button className="project-image" type="button" onClick={() => onOpen(media[index])}>
              <WorkImage media={media[index]} />
              <span className="project-open">
                View project <ArrowIcon />
              </span>
            </button>
            <div className="project-copy">
              <p className="project-number">{project.number}</p>
              <div>
                <p className="project-discipline">{project.discipline}</p>
                <h3>{project.title}</h3>
                <p className="project-client">For {project.client}</p>
              </div>
              <p className="project-summary">{project.summary}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

function ArchivePreview({ categories, onOpen }) {
  const previews = categories.map((category) => ({ category, media: category.items?.[0] })).filter((item) => item.media)

  return (
    <section className="archive-preview">
      <div className="archive-preview__head">
        <div>
          <p className="section-label">Work archive</p>
          <h2>More formats.<br />More experiments.</h2>
        </div>
        <div className="archive-preview__intro">
          <p>Browse the wider collection of social posts, posters, banners, motion and printed work.</p>
          <a className="text-link" href="#portfolio">Open the full archive <ArrowIcon /></a>
        </div>
      </div>

      <div className="archive-preview__grid">
        {previews.map(({ category, media }, index) => (
          <button key={category.title} type="button" className={`archive-tile archive-tile--${index + 1}`} onClick={() => onOpen(media)}>
            <WorkImage media={media} />
            <span><b>{String(index + 1).padStart(2, '0')}</b>{category.title}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

function Services() {
  const { services } = siteContent

  return (
    <section className="services-section" id="services">
      <SectionHeading eyebrow={services.eyebrow} title={services.title} intro={services.intro} inverse />
      <div className="service-list">
        {services.items.map((service) => (
          <motion.article key={service.number} className="service-row" {...reveal}>
            <span>{service.number}</span>
            <h3>{service.title}</h3>
            <p>{service.text}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

function About() {
  const { about, stats } = siteContent

  return (
    <section className="page-section about-section" id="about">
      <SectionHeading eyebrow={about.eyebrow} title={about.title} />
      <div className="about-layout">
        <motion.figure className="portrait-frame" {...reveal}>
          <img src="/profile-photo.png" alt="Harishankar K" />
          <figcaption>Harishankar K · Visual designer</figcaption>
        </motion.figure>
        <motion.div className="about-copy" {...reveal}>
          {about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <div className="about-stats">
            {stats.map((stat) => (
              <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>
            ))}
          </div>
          <div className="capabilities">
            <p>Working toolkit</p>
            <ul>{about.capabilities.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Experience() {
  const { experience } = siteContent

  return (
    <section className="page-section experience-section">
      <SectionHeading eyebrow={experience.eyebrow} title={experience.title} />
      <div className="experience-list">
        {experience.items.map((item) => (
          <motion.article className="experience-row" key={`${item.company}-${item.period}`} {...reveal}>
            <p>{item.period}</p>
            <div><h3>{item.company}</h3><span>{item.role}</span></div>
            <p>{item.note}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

function Testimonials({ items }) {
  return (
    <section className="testimonials-section">
      <SectionHeading
        eyebrow="Client feedback"
        title="A few words from people I’ve worked with."
        intro="Feedback on collaboration, clarity and the quality of the final work."
      />
      <div className="testimonial-grid">
        {items.map((item) => (
          <motion.blockquote className="testimonial-card" key={`${item.author}-${item.company}`} {...reveal}>
            <span className="testimonial-mark" aria-hidden="true">“</span>
            <p>{item.quote}</p>
            <footer>
              <span>{item.author.slice(0, 1)}</span>
              <div>
                <strong>{item.author}</strong>
                <small>{item.role} · {item.company}</small>
              </div>
            </footer>
          </motion.blockquote>
        ))}
      </div>
    </section>
  )
}

function ClientWall({ clients }) {
  return (
    <section className="client-section">
      <div className="client-section__heading">
        <p className="section-label">Selected clients</p>
        <p>Work created independently and through agency collaborations.</p>
      </div>
      <div className="client-wall">
        {clients.slice(0, 12).map((client) => (
          <div className="client-logo" key={client.name}>
            <img src={client.logoUrl} alt={`${client.name} logo`} loading="lazy" />
            <span>{client.name}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function Contact() {
  const { contact } = siteContent

  return (
    <section className="contact-section" id="contact">
      <p className="section-label">{contact.eyebrow}</p>
      <h2>{contact.title}</h2>
      <div className="contact-bottom">
        <p>{contact.note}</p>
        <a className="contact-email" href={`mailto:${contact.email}`}>{contact.email}<ArrowIcon /></a>
        <div className="contact-links">
          <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a>
          <a href="https://www.behance.net/Harishankar_K" target="_blank" rel="noreferrer">Behance</a>
          <a href="https://www.linkedin.com/in/harishankar-k-1072b5232/" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="/resume.pdf" target="_blank" rel="noreferrer">Resume</a>
        </div>
      </div>
    </section>
  )
}

function HomePage({ data, onOpen }) {
  const caseStudies = data.sections['case-studies'].items

  return (
    <main>
      <section className="hero" id="top">
        <div className="hero-title">
          <p>{siteContent.hero.eyebrow}</p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            I make brands easier to <em>notice</em>—and harder to forget.
          </motion.h1>
        </div>
        <motion.aside className="hero-aside" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35, duration: 0.7 }}>
          <div className="hero-portrait"><img src="/profile-photo.png" alt="Harishankar K" /></div>
          <p>{siteContent.hero.intro}</p>
          <div className="hero-actions">
            <a className="button button--primary" href="#selected-work">See selected work <ArrowIcon /></a>
            <a className="button button--plain" href="mailto:k.harish2323@gmail.com">Start a conversation</a>
          </div>
        </motion.aside>
        <div className="hero-rail">
          <p><span /> {siteContent.hero.availability}</p>
          <div>{siteContent.stats.map((stat) => <p key={stat.label}><strong>{stat.value}</strong>{stat.label}</p>)}</div>
        </div>
      </section>

      <SelectedWork projects={siteContent.work.projects} media={caseStudies} onOpen={onOpen} />
      <ArchivePreview categories={data.portfolioPage.categories} onOpen={onOpen} />
      <Services />
      <About />
      <Experience />
      <Testimonials items={data.sections.testimonials.items} />
      <ClientWall clients={data.sections.brands.items} />
      <Contact />
    </main>
  )
}

function ArchiveItem({ media, category, index, onOpen }) {
  return (
    <button className="archive-item" type="button" onClick={() => onOpen(media)}>
      <WorkImage media={media} />
      <span>{String(index + 1).padStart(2, '0')} / {category}</span>
      {(media.type === 'video' || media.type === 'animation') ? <b>Play</b> : null}
    </button>
  )
}

function PortfolioPage({ categories, activeIndex, onCategoryChange, onOpen }) {
  const active = categories[activeIndex]
  const total = categories.reduce((sum, category) => sum + (category.items?.length || 0), 0)

  return (
    <main className="portfolio-page">
      <section className="portfolio-intro">
        <p className="section-label">Portfolio · Harishankar K</p>
        <h1>Selected work<br />portfolio.</h1>
        <div className="portfolio-intro__details">
          <p>This is my complete portfolio: {total} pieces across campaigns, social, print, display and motion. Choose a format below and open any project for a closer look.</p>
          <div className="portfolio-actions">
            <a className="resume-download" href="/resume.pdf" download>
              Download Resume <DownloadIcon />
            </a>
            <a className="portfolio-back-link" href="#selected-work">Back to home <ArrowIcon /></a>
          </div>
        </div>
      </section>

      <section className="portfolio-browser">
        <aside className="category-nav">
          <div className="category-nav__heading">
            <p>Choose a category</p>
            <span>Swipe to browse →</span>
          </div>
          <div className="category-nav__buttons">
            {categories.map((category, index) => (
              <button
                type="button"
                key={category.title}
                className={activeIndex === index ? 'is-active' : ''}
                onClick={() => onCategoryChange(index)}
              >
                <span>{category.title}</span>
                <b>{category.items?.length || 0}</b>
              </button>
            ))}
          </div>
        </aside>

        <div className="archive-results">
          <div className="archive-results__head">
            <p>{active.title}</p>
            <span>{active.items?.length || 0} pieces</span>
          </div>
          <div className="archive-masonry">
            {active.items?.map((media, index) => (
              <ArchiveItem key={media.id || index} media={media} category={active.title} index={index} onOpen={onOpen} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default function App() {
  const data = useMemo(() => deobfuscatePortfolio(portfolio), [])
  const [currentHash, setCurrentHash] = useState(() => window.location.hash)
  const [selectedMedia, setSelectedMedia] = useState(null)
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0)
  const [dark, setDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    return savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const portfolioView = currentHash === '#portfolio'

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    const syncHash = () => {
      const nextHash = window.location.hash
      setCurrentHash(nextHash)
      window.setTimeout(() => {
        if (nextHash === '#portfolio' || !nextHash) {
          window.scrollTo({ top: 0, behavior: 'instant' })
        } else {
          document.querySelector(nextHash)?.scrollIntoView({ behavior: 'instant' })
        }
      }, 0)
    }

    window.addEventListener('hashchange', syncHash)
    syncHash()
    return () => window.removeEventListener('hashchange', syncHash)
  }, [])

  return (
    <div className="site-frame">
      <Header dark={dark} onThemeChange={setDark} portfolioView={portfolioView} />
      {portfolioView ? (
        <PortfolioPage
          categories={data.portfolioPage.categories}
          activeIndex={activeCategoryIndex}
          onCategoryChange={setActiveCategoryIndex}
          onOpen={setSelectedMedia}
        />
      ) : (
        <HomePage data={data} onOpen={setSelectedMedia} />
      )}
      <footer className={`site-footer${portfolioView ? ' site-footer--portfolio' : ''}`}>
        <p>© 2026 Harishankar K</p>
        <p>{portfolioView ? 'Portfolio archive · 138 selected pieces' : 'Visual design · Campaigns · Motion'}</p>
        <a href="#top">Back to top ↑</a>
      </footer>
      <PortfolioLightbox media={selectedMedia} onClose={() => setSelectedMedia(null)} />
    </div>
  )
}
