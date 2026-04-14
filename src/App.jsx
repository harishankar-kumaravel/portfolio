import { useEffect, useState } from 'react'
import { portfolio } from './data/portfolio'

const sectionShell =
  'liquid-glass liquid-glass-hover mt-6 animate-fade-up rounded-[36px] px-6 py-10 shadow-glow sm:px-8 lg:px-12'

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
    <article className="liquid-glass liquid-glass-hover rounded-3xl p-6 shadow-glow">
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
    <div className="liquid-glass liquid-glass-hover min-w-[220px] flex-1 rounded-3xl p-6 shadow-glow">
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

function PortfolioPlaceholder({ categoryTitle, index, aspect }) {
  const aspectClass =
    aspect === 'portrait'
      ? 'aspect-[4/5]'
      : aspect === 'square'
        ? 'aspect-square'
        : aspect === 'video'
          ? 'aspect-video'
          : 'aspect-[16/10]'

  return (
    <div className="liquid-glass liquid-glass-hover overflow-hidden rounded-[24px] p-3 shadow-glow">
      <div
        className={`relative ${aspectClass} overflow-hidden rounded-[18px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.03))]`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(88,255,222,0.24),transparent_24%),radial-gradient(circle_at_80%_20%,rgba(25,192,162,0.18),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:26px_26px] opacity-50" />
        <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/10 bg-[rgba(4,16,15,0.48)] px-4 py-3 backdrop-blur-xl">
          <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.24em] text-teal">
            {categoryTitle}
          </p>
          <p className="mt-2 text-sm text-mist/80">Placeholder {index}</p>
        </div>
      </div>
    </div>
  )
}

function PortfolioCategory({ category }) {
  const placeholders = Array.from({ length: category.count }, (_, index) => index + 1)

  return (
    <section className="liquid-glass animate-fade-up rounded-[32px] px-6 py-8 shadow-glow sm:px-8 lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.22em] text-teal">
            Category
          </p>
          <h3 className="mt-2 text-2xl font-bold text-foam sm:text-3xl">{category.title}</h3>
        </div>
        <span className="rounded-full border border-teal/25 bg-white/10 px-4 py-2 text-sm font-semibold text-foam backdrop-blur-md">
          {category.count} placeholders
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {placeholders.map((index) => (
          <PortfolioPlaceholder
            key={`${category.title}-${index}`}
            categoryTitle={category.title}
            index={index}
            aspect={category.aspect}
          />
        ))}
      </div>
    </section>
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
        <header className="liquid-glass sticky top-3 z-10 flex min-h-[92px] w-full flex-col gap-6 rounded-[32px] px-6 py-6 shadow-glow md:flex-row md:items-center md:justify-between lg:px-10">
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

        <main className="w-full">
          {isPortfolioPage ? (
            <section className="py-8 md:py-12">
              <div className="liquid-glass animate-fade-up rounded-[36px] px-6 py-10 shadow-glow sm:px-8 lg:px-12">
                <SectionHeader eyebrow={portfolioPage.eyebrow} title={portfolioPage.title} />
                <p className="mt-5 max-w-3xl text-base leading-8 text-mist/80">
                  {portfolioPage.intro}
                </p>
              </div>

              <div className="mt-6 grid gap-6">
                {portfolioPage.categories.map((category) => (
                  <PortfolioCategory key={category.title} category={category} />
                ))}
              </div>
            </section>
          ) : (
            <>
              <section className="grid min-h-[calc(100vh-8rem)] gap-6 py-8 lg:grid-cols-[1.45fr_0.9fr] lg:items-stretch lg:py-10">
                <div className="liquid-glass flex animate-fade-up flex-col justify-between rounded-[40px] px-6 py-10 shadow-glow sm:px-8 lg:px-12">
                  <div>
                    <p className="mb-3 text-[0.72rem] font-extrabold uppercase tracking-[0.25em] text-teal">
                      {hero.eyebrow}
                    </p>
                    <h2 className="font-display text-5xl leading-[0.92] tracking-[-0.02em] text-foam sm:text-6xl lg:max-w-[11ch] lg:text-[6.5rem] xl:text-[7.4rem]">
                      {hero.heading}
                    </h2>
                    <p className="mt-6 max-w-3xl text-base leading-8 text-mist/80 lg:text-lg">
                      {hero.description}
                    </p>
                  </div>
                  <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    {hero.actions.map((action) => (
                      <HeroAction key={action.label} action={action} />
                    ))}
                  </div>
                </div>

                <aside className="grid gap-4 animate-fade-up [animation-delay:120ms] lg:grid-rows-2">
                  {hero.highlights.map((item) => (
                    <div
                      key={item.title}
                      className="liquid-glass liquid-glass-hover flex min-h-[220px] flex-col justify-end rounded-[32px] p-6 shadow-glow lg:p-8"
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
                    <div className="mt-7 grid gap-4 xl:grid-cols-2">
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
                          className="rounded-full border border-teal/25 bg-white/10 px-4 py-3 font-bold text-foam backdrop-blur-md"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {section.id === 'contact' ? (
                    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
