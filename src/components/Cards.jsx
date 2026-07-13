import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  fadeInVariants, 
  useMouseGlow, 
  getDrivePreviewUrl, 
  getDriveThumbnailUrl,
  getYoutubeThumbnailUrl
} from '../utils/portfolioUtils'

export function HeroAction({ action }) {
  const isPrimary = action.variant === 'primary'
  const className = isPrimary
    ? 'inline-flex items-center justify-center rounded-full bg-teal px-6 py-4 font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg dark:text-abyss text-base'
    : 'inline-flex items-center justify-center rounded-full border border-teal/25 theme-card-soft px-6 py-4 font-bold text-foam shadow-sm transition hover:-translate-y-0.5 hover:border-teal/60 hover:text-teal hover:shadow-md text-base'

  return (
    <motion.a
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={className}
      href={action.href}
      target={action.external ? '_blank' : undefined}
      rel={action.external ? 'noreferrer' : undefined}
      download={action.download ? '' : undefined}
      id={`hero-action-${action.label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {action.label}
    </motion.a>
  )
}

export function HeroFocusCard({ item }) {
  return (
    <motion.div 
      variants={fadeInVariants}
      whileHover={{ y: -5, scale: 1.01 }}
      className="liquid-glass liquid-glass-hover flex flex-col justify-between overflow-hidden rounded-[32px] p-4 sm:p-6 shadow-glow lg:p-8 border border-teal/20"
    >
      <div>
        <span className="inline-block text-[0.78rem] font-extrabold uppercase tracking-[0.12em] text-teal">
          {item.title}
        </span>
        <h3 className="mt-4 text-3xl font-extrabold leading-tight text-foam sm:text-4xl">
          {item.company}
        </h3>
        <p className="mt-2 text-xl text-mist/85 font-medium">{item.period}</p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {item.stats.map((stat) => (
          <div key={stat.label} className="rounded-3xl border border-teal/10 theme-chip px-5 py-5">
            <p className="font-display text-5xl leading-none text-foam font-black">{stat.value}</p>
            <p className="mt-2 text-sm font-semibold text-mist/80">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-[0.78rem] font-extrabold uppercase tracking-[0.16em] text-teal">
            Top Clients
          </p>
          <ul className="mt-3 space-y-2 text-base leading-7 text-foam">
            {item.clients.map((client) => (
              <li key={client} className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 flex-none rounded-full bg-teal" />
                <span className="font-medium">{client}</span>
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
          id={`linkedin-focus-${item.company.toLowerCase().replace(/\s+/g, '-')}`}
        >
          View LinkedIn
        </motion.a>
      </div>

      <div className="mt-8 border-t border-teal/10 pt-5">
        <p className="text-base font-bold text-foam italic">"{item.quote}"</p>
        <p className="mt-3 text-sm leading-6 text-mist/75">{item.note}</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {item.services.map((service) => (
          <span
            key={service}
            className="rounded-full border border-teal/10 theme-chip px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-mist/80"
          >
            {service}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export function RecruiterQuickCard({ profile }) {
  const activeProfile = profile || {
    roleSought: 'Visual / Motion Designer',
    experience: '2+ Years (Agency & Brand)',
    location: 'India (Remote / Relocation)',
    keySoftware: 'After Effects, Premiere Pro, Photoshop, Illustrator, Maya'
  }

  return (
    <motion.div
      variants={fadeInVariants}
      whileHover={{ y: -5, scale: 1.01 }}
      className="liquid-glass liquid-glass-hover flex flex-col justify-between rounded-[32px] p-4 sm:p-6 shadow-glow border border-teal/20"
    >
      <div className="flex flex-col gap-6">
        <div>
          <span className="inline-block text-[0.78rem] font-extrabold uppercase tracking-[0.12em] text-teal">
            Hiring Fast Track
          </span>
          <h3 className="mt-4 text-2xl font-bold leading-tight text-foam">
            Quick Profile
          </h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-teal/10 pb-2">
            <span className="text-sm text-mist/75">Role sought</span>
            <span className="text-sm font-bold text-foam">{activeProfile.roleSought}</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-teal/10 pb-2">
            <span className="text-sm text-mist/75">Experience</span>
            <span className="text-sm font-bold text-foam">{activeProfile.experience}</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-teal/10 pb-2">
            <span className="text-sm text-mist/75">Location</span>
            <span className="text-sm font-bold text-foam">{activeProfile.location}</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-teal/10 pb-2">
            <span className="text-sm text-mist/75 whitespace-nowrap">Key Software</span>
            <span className="text-sm font-bold text-foam text-right">{activeProfile.keySoftware}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-teal/10 flex items-center justify-between gap-3">
        <span className="text-xs text-mist/60">Portfolio Updated 2026</span>
        <a
          href="https://www.linkedin.com/in/harishankar-k-1072b5232/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-teal hover:underline"
          id="recruiter-linkedin-link"
        >
          LinkedIn Profile &rarr;
        </a>
      </div>
    </motion.div>
  )
}

export function ServiceCard({ item }) {
  const { hoverProps, glowStyle, borderStyle, isHovered } = useMouseGlow()

  return (
    <motion.article
      variants={fadeInVariants}
      whileHover={{ y: -5 }}
      {...hoverProps}
      className="relative liquid-glass liquid-glass-hover rounded-3xl p-6 shadow-glow border border-teal/20"
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
          className="pointer-events-none absolute inset-0 z-20 rounded-3xl border border-teal/40 transition-opacity duration-300"
          style={borderStyle}
        />
      )}

      <span className="font-display text-4xl text-teal/70 font-black relative z-30">{item.number}</span>
      <h3 className="mt-6 text-xl font-bold text-foam relative z-30">{item.title}</h3>
      <p className="mt-3 text-sm leading-7 text-mist/80 relative z-30">{item.description}</p>
    </motion.article>
  )
}

export function CaseStudyCard({ item }) {
  const isPlayable = item.type === 'video' || item.type === 'animation'
  const { hoverProps, glowStyle, borderStyle, isHovered } = useMouseGlow()

  return (
    <motion.article
      variants={fadeInVariants}
      {...hoverProps}
      className="relative liquid-glass liquid-glass-hover overflow-hidden rounded-[30px] shadow-glow border border-teal/20"
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
          className="pointer-events-none absolute inset-0 z-20 rounded-[30px] border border-teal/40 transition-opacity duration-300"
          style={borderStyle}
        />
      )}

      <div className="theme-image-panel relative overflow-hidden border-b border-teal/10 z-30">
        {isPlayable ? (
          item.name && item.name.toLowerCase().endsWith('.gif') ? (
            <img
              className="block h-auto w-full object-contain"
              src={`https://drive.google.com/uc?id=${item.id}&export=download`}
              alt={`${item.title} preview`}
              loading="lazy"
            />
          ) : (
            <div className="relative w-full h-full overflow-hidden">
              <iframe
                className="aspect-video w-full border-0 bg-black"
                src={getDrivePreviewUrl(item)}
                title={`${item.title} video preview`}
                loading="lazy"
                allow="autoplay; fullscreen; encrypted-media"
                allowFullScreen
              />
              <div className="absolute top-0 left-0 w-full h-14 bg-black z-30 pointer-events-auto" />
            </div>
          )
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
      <div className="p-6 relative z-30">
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
              className="theme-chip rounded-full border border-teal/10 px-3 py-1.5 text-xs font-bold text-mist/80"
            >
              {step}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  )
}

export function ClientProjectCard({ item }) {
  const { hoverProps, glowStyle, borderStyle, isHovered } = useMouseGlow()

  const getClientTheme = (clientName) => {
    if (clientName.includes('Tata')) {
      return {
        bg: 'bg-blue-500/10 dark:bg-blue-400/10 border-blue-500/20 dark:border-blue-400/20 text-blue-600 dark:text-blue-400',
        bulletBg: 'bg-blue-500 dark:bg-blue-400',
        logoText: 'TS',
        sub: 'Steel & Industrial Branding'
      }
    }
    if (clientName.includes('Mizaj')) {
      return {
        bg: 'bg-amber-500/10 dark:bg-amber-400/10 border-amber-500/20 dark:border-amber-400/20 text-amber-600 dark:text-amber-400',
        bulletBg: 'bg-amber-500 dark:bg-amber-400',
        logoText: 'MZ',
        sub: 'Luxury Retail & Furniture'
      }
    }
    if (clientName.includes('Coromandel')) {
      return {
        bg: 'bg-emerald-500/10 dark:bg-emerald-400/10 border-emerald-500/20 dark:border-emerald-400/20 text-emerald-600 dark:text-emerald-400',
        bulletBg: 'bg-emerald-500 dark:bg-emerald-400',
        logoText: 'CF',
        sub: 'Agri-Solutions & Campaigns'
      }
    }
    return {
      bg: 'bg-teal/10 border-teal/20 text-teal',
      bulletBg: 'bg-teal',
      logoText: 'CP',
      sub: 'Visual Design'
    }
  }

  const theme = getClientTheme(item.client)

  return (
    <motion.article
      variants={fadeInVariants}
      whileHover={{ y: -6 }}
      {...hoverProps}
      className="relative flex flex-col justify-between overflow-hidden rounded-[30px] border border-teal/20 p-6 shadow-glow liquid-glass liquid-glass-hover"
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
          className="pointer-events-none absolute inset-0 z-20 rounded-[30px] border border-teal/40 transition-opacity duration-300"
          style={borderStyle}
        />
      )}

      <div className="relative z-30 flex flex-col h-full justify-between">
        <div>
          {/* Header */}
          <div className="mb-5 flex items-center gap-4 border-b border-teal/10 pb-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-display font-extrabold text-lg border ${theme.bg}`}>
              {theme.logoText}
            </div>
            <div>
              <h3 className="text-xl font-bold leading-tight text-foam">{item.client}</h3>
              <p className="mt-1 text-xs font-semibold text-mist/60">{theme.sub}</p>
            </div>
          </div>

          {/* Bullet points */}
          <ul className="space-y-3.5 text-sm leading-relaxed text-mist/80">
            {item.bullets.map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className={`mt-2 flex h-1.5 w-1.5 shrink-0 rounded-full ${theme.bulletBg}`} />
                <span className="text-mist/85 dark:text-mist/95">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.article>
  )
}

export function TestimonialCard({ item }) {
  const { hoverProps, glowStyle, borderStyle, isHovered } = useMouseGlow()

  return (
    <motion.article
      variants={fadeInVariants}
      whileHover={{ y: -5 }}
      {...hoverProps}
      className="relative liquid-glass liquid-glass-hover rounded-3xl p-6 shadow-glow border border-teal/20 flex flex-col justify-between"
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
          className="pointer-events-none absolute inset-0 z-20 rounded-3xl border border-teal/40 transition-opacity duration-300"
          style={borderStyle}
        />
      )}

      <div className="relative z-30">
        <svg className="w-8 h-8 text-teal/30 mb-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        <p className="text-base md:text-lg leading-8 text-foam/90 italic font-medium">
          "{item.quote}"
        </p>
      </div>

      <div className="mt-6 flex items-center gap-4 relative z-30 border-t border-teal/10 pt-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal/10 font-display font-black text-sm text-teal">
          {item.author.split(' ').map(n => n[0]).join('').toUpperCase()}
        </div>
        <div>
          <h4 className="font-bold text-foam text-base leading-none">{item.author}</h4>
          <p className="text-xs text-mist/60 mt-1">{item.role}, <span className="text-teal font-semibold">{item.company}</span></p>
        </div>
      </div>
    </motion.article>
  )
}

export function SkillBadge({ name }) {
  let glowColor = 'hover:border-teal/50 hover:shadow-[0_0_20px_rgba(20,184,166,0.2)]'
  let iconBg = 'bg-teal/10 text-teal'
  
  if (name.includes('Photoshop')) {
    glowColor = 'hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.25)]'
    iconBg = 'bg-blue-500/10 text-blue-500'
  } else if (name.includes('Illustrator')) {
    glowColor = 'hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.25)]'
    iconBg = 'bg-amber-500/10 text-amber-500'
  } else if (name.includes('After Effects')) {
    glowColor = 'hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]'
    iconBg = 'bg-purple-500/10 text-purple-500'
  } else if (name.includes('Premiere')) {
    glowColor = 'hover:border-violet-500/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.25)]'
    iconBg = 'bg-violet-500/10 text-violet-500'
  } else if (name.includes('Figma')) {
    glowColor = 'hover:border-rose-500/50 hover:shadow-[0_0_20px_rgba(244,63,94,0.25)]'
    iconBg = 'bg-rose-500/10 text-rose-500'
  } else if (name.includes('Cinema 4D')) {
    glowColor = 'hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]'
    iconBg = 'bg-cyan-500/10 text-cyan-500'
  } else if (name.toLowerCase().includes('maya')) {
    glowColor = 'hover:border-sky-500/50 hover:shadow-[0_0_20px_rgba(14,165,233,0.25)]'
    iconBg = 'bg-sky-500/10 text-sky-500'
  } else if (name.toLowerCase().includes('shillouette') || name.toLowerCase().includes('silhouette')) {
    glowColor = 'hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.25)]'
    iconBg = 'bg-red-500/10 text-red-500'
  }

  return (
    <motion.div
      variants={fadeInVariants}
      whileHover={{ y: -3, scale: 1.02 }}
      className={`theme-card-soft cursor-default rounded-3xl border border-teal/20 px-5 py-4 flex items-center gap-4 transition-all duration-300 ${glowColor} backdrop-blur-md`}
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl font-display font-black text-sm ${iconBg}`}>
        {name.split(' ').pop().substring(0, 2).toUpperCase()}
      </div>
      <div>
        <p className="font-bold text-foam text-base leading-none">{name}</p>
        <p className="text-xs text-mist/60 mt-1">Design tool</p>
      </div>
    </motion.div>
  )
}

export function ContactCard({ item }) {
  let icon = null
  
  if (item.label.toLowerCase() === 'email') {
    icon = (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-teal">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    )
  } else if (item.label.toLowerCase() === 'phone') {
    icon = (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-teal">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.622c0-1.137.705-2.14 1.773-2.511 1.025-.36 2.062.099 2.52 1.077l1.584 3.327c.4-.077.01.906-.277 1.18-.363.363-.429.9-.13 1.396l2.388 4.419a1.6 1.6 0 0 0 1.58.888c.456-.053.905-.316 1.247-.659l1.414-1.414a1.125 1.125 0 0 1 1.59 0l3.327 3.327c.977.458 1.437 1.495 1.078 2.52-.372 1.067-1.375 1.773-2.511 1.773-5.28 0-9.75-4.47-9.75-9.75 0-1.137.705-2.14 1.773-2.511z" />
      </svg>
    )
  } else {
    icon = (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-teal">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
      </svg>
    )
  }

  const { hoverProps, glowStyle, borderStyle, isHovered } = useMouseGlow()

  return (
    <motion.div 
      variants={fadeInVariants}
      whileHover={{ y: -4 }}
      {...hoverProps}
      className="relative liquid-glass liquid-glass-hover min-w-[220px] flex-1 rounded-3xl p-6 shadow-glow flex items-start gap-4"
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
          className="pointer-events-none absolute inset-0 z-20 rounded-3xl border border-teal/40 transition-opacity duration-300"
          style={borderStyle}
        />
      )}

      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal/10 relative z-30">
        {icon}
      </div>
      <div className="min-w-0 relative z-30">
        <span className="inline-block text-[0.78rem] font-extrabold uppercase tracking-[0.12em] text-teal">
          {item.label}
        </span>
        <a
          className="mt-1 block break-words text-base font-bold text-foam no-underline hover:text-teal hover:underline transition-colors"
          href={item.href}
          target={item.external ? '_blank' : undefined}
          rel={item.external ? 'noreferrer' : undefined}
        >
          {item.value}
        </a>
      </div>
    </motion.div>
  )
}
