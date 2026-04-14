import { useEffect, useState } from 'react'
import { portfolio } from './data/portfolio'

const sectionShell =
  'mt-6 animate-fade-up rounded-[32px] border border-white/10 bg-white/5 px-5 py-8 shadow-glow backdrop-blur-xl sm:px-8'

const sectionTitleClass =
  'font-display text-4xl leading-none tracking-[-0.02em] text-foam sm:text-5xl md:text-6xl'

function SectionHeader({ eyebrow, title }) {
  return (
    <>
      <p className="mb-2 text-[0.72rem] font-extrabold uppercase tracking-[0.25em] text-teal">
        {eyebrow}
      </p>
      <h2 className={sectionTitleClass}>{title}</h2>
    </>
  )
}

function HeroAction({ action }) {
  const isPrimary = action.variant === 'primary'
  const className = isPrimary
    ? 'inline-flex items-center justify-center rounded-full bg-teal px-5 py-3.5 font-bold text-abyss transition hover:-translate-y-0.5 hover:bg-[#2ae1c0]'
    : 'inline-flex items-center justify-center rounded-full border border-teal/30 bg-white/5 px-5 py-3.5 font-bold text-foam transition hover:-translate-y-0.5 hover:border-teal/60 hover:text-teal'

  return (
    <a
      className={className}
      href={action.href}
      target={action.external ? '_blank' : undefined}
      rel={action.external ? 'noreferrer' : undefined}
    >
      {action.label}
    </a>
  )
}

function ExperienceCard({ item }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-black/10 p-6 shadow-glow">
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
    </article>
  )
}

function ContactCard({ item }) {
  return (
    <div className="min-w-[220px] flex-1 rounded-3xl border border-white/10 bg-black/10 p-6 shadow-glow">
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
    </div>
  )
}

function PortfolioProjectCard({ project }) {
  return (
    <article className="rounded-[28px] border border-white/10 bg-black/10 p-6 shadow-glow">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.22em] text-teal">
            {project.category}
          </p>
          <h3 className="mt-3 text-2xl font-bold text-foam sm:text-3xl">{project.title}</h3>
        </div>
        <span className="rounded-full border border-teal/20 bg-teal/10 px-4 py-2 text-sm font-semibold text-foam">
          {project.year}
        </span>
      </div>

      <p className="mt-5 max-w-2xl text-base leading-8 text-mist/80">{project.description}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        {project.services.map((service) => (
          <span
            key={service}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-mist"
          >
            {service}
          </span>
        ))}
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
        <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.22em] text-teal">
          Outcome
        </p>
        <p className="mt-3 text-base leading-8 text-mist/80">{project.outcome}</p>
      </div>
    </article>
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(25,192,162,0.16),transparent_28%),radial-gradient(circle_at_85%_18%,rgba(36,130,109,0.18),transparent_20%),linear-gradient(180deg,#071412_0%,#0a1a17_45%,#0b2420_100%)] text-mist">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.28),transparent_78%)]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(25,192,162,0.22),transparent_58%)] blur-3xl" />

      <div className="relative mx-auto w-[min(1120px,calc(100%-32px))] py-6">
        <header className="sticky top-4 z-10 flex flex-col gap-6 rounded-[28px] border border-white/10 bg-[rgba(12,31,28,0.72)] px-7 py-6 shadow-glow backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-[0.72rem] font-extrabold uppercase tracking-[0.25em] text-teal">
              {meta.label}
            </p>
            <h1 className="font-display text-5xl leading-[0.95] tracking-[-0.02em] text-foam sm:text-6xl">
              {meta.title}
            </h1>
            <p className="mt-2 text-base text-mist/80">{meta.role}</p>
          </div>

          <nav className="flex flex-wrap gap-4 text-sm font-medium text-mist sm:text-base">
            {navigation.map((item) => (
              <a
                key={item.id}
                className="transition hover:text-teal"
                href={item.page === 'portfolio' ? '#portfolio' : item.page === 'home' ? '#' : `#${item.id}`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </header>

        <main className="px-2">
          {isPortfolioPage ? (
            <section className="py-10 md:py-16">
              <div className="animate-fade-up rounded-[32px] border border-white/10 bg-white/5 px-5 py-8 shadow-glow backdrop-blur-xl sm:px-8">
                <SectionHeader eyebrow={portfolioPage.eyebrow} title={portfolioPage.title} />
                <p className="mt-5 max-w-3xl text-base leading-8 text-mist/80">
                  {portfolioPage.intro}
                </p>
              </div>

              <div className="mt-6 grid gap-6">
                {portfolioPage.projects.map((project) => (
                  <PortfolioProjectCard key={project.title} project={project} />
                ))}
              </div>
            </section>
          ) : (
            <>
              <section className="grid gap-7 py-10 md:grid-cols-[1.5fr_0.9fr] md:items-stretch md:py-16">
                <div className="animate-fade-up">
                  <p className="mb-3 text-[0.72rem] font-extrabold uppercase tracking-[0.25em] text-teal">
                    {hero.eyebrow}
                  </p>
                  <h2 className="font-display text-5xl leading-[0.94] tracking-[-0.02em] text-foam sm:text-6xl lg:max-w-[10ch] lg:text-[5.8rem]">
                    {hero.heading}
                  </h2>
                  <p className="mt-6 max-w-2xl text-base leading-8 text-mist/80">
                    {hero.description}
                  </p>
                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    {hero.actions.map((action) => (
                      <HeroAction key={action.label} action={action} />
                    ))}
                  </div>
                </div>

                <aside className="grid gap-4 animate-fade-up [animation-delay:120ms]">
                  {hero.highlights.map((item) => (
                    <div
                      key={item.title}
                      className="min-h-40 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glow backdrop-blur-xl"
                    >
                      <span className="inline-block text-[0.78rem] font-extrabold uppercase tracking-[0.12em] text-teal">
                        {item.title}
                      </span>
                      <p className="mt-3 text-base leading-8 text-mist/80">{item.body}</p>
                    </div>
                  ))}
                </aside>
              </section>

              {orderedSections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className={`${sectionShell}${section.id === 'contact' ? ' mb-6' : ''}`}
                >
                  <SectionHeader eyebrow={section.eyebrow} title={section.title} />

                  {section.body ? (
                    <p className="mt-5 max-w-3xl text-base leading-8 text-mist/80">{section.body}</p>
                  ) : null}

                  {section.id === 'experience' ? (
                    <div className="mt-7 grid gap-4">
                      {section.items.map((item) => (
                        <ExperienceCard key={item.company} item={item} />
                      ))}
                    </div>
                  ) : null}

                  {section.id === 'skills' ? (
                    <div className="mt-6 flex flex-wrap gap-3">
                      {section.items.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-teal/25 bg-teal/10 px-4 py-3 font-bold text-foam"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {section.id === 'contact' ? (
                    <div className="mt-6 flex flex-wrap gap-4">
                      {section.items.map((item) => (
                        <ContactCard key={item.label} item={item} />
                      ))}
                    </div>
                  ) : null}
                </section>
              ))}
            </>
          )}
        </main>

        <footer className="px-2 py-5 text-center text-base text-mist/65">
          <p>&copy; {meta.copyright}</p>
        </footer>
      </div>
    </div>
  )
}
