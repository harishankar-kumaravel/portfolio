import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { portfolio } from './data/portfolio'

function deobfuscateId(obfuscated) {
  if (!obfuscated) return '';
  try {
    const reversed = obfuscated.split('').reverse().join('');
    return atob(reversed);
  } catch (e) {
    return obfuscated;
  }
}

function deobfuscateUrl(url) {
  if (typeof url !== 'string') return url;
  
  const thumbMatch = url.match(/(https:\/\/drive\.google\.com\/thumbnail\?id=)([^&]+)(.*)/);
  if (thumbMatch) {
    return `${thumbMatch[1]}${deobfuscateId(thumbMatch[2])}${thumbMatch[3]}`;
  }
  
  const fileMatch = url.match(/(https:\/\/drive\.google\.com\/file\/d\/)([^\/]+)(\/.*)/);
  if (fileMatch) {
    return `${fileMatch[1]}${deobfuscateId(fileMatch[2])}${fileMatch[3]}`;
  }
  
  return url;
}

function deobfuscateMedia(media) {
  if (!media) return media;
  return {
    ...media,
    id: deobfuscateId(media.id),
    thumbnail: deobfuscateUrl(media.thumbnail),
    href: deobfuscateUrl(media.href)
  };
}

function deobfuscatePortfolio(data) {
  const copy = { ...data };
  
  if (copy.sections) {
    copy.sections = { ...copy.sections };
    
    if (copy.sections['case-studies'] && Array.isArray(copy.sections['case-studies'].items)) {
      copy.sections['case-studies'] = {
        ...copy.sections['case-studies'],
        items: copy.sections['case-studies'].items.map(deobfuscateMedia)
      };
    }
    
    if (copy.sections.motion && Array.isArray(copy.sections.motion.items)) {
      copy.sections.motion = {
        ...copy.sections.motion,
        items: copy.sections.motion.items.map(deobfuscateMedia)
      };
    }
  }
  
  if (copy.portfolioPage && Array.isArray(copy.portfolioPage.categories)) {
    copy.portfolioPage = {
      ...copy.portfolioPage,
      categories: copy.portfolioPage.categories.map(category => ({
        ...category,
        items: Array.isArray(category.items) ? category.items.map(deobfuscateMedia) : []
      }))
    };
  }
  
  return copy;
}

const sectionShell =
  'liquid-glass liquid-glass-hover mt-6 rounded-[36px] px-6 py-10 shadow-glow sm:px-8 lg:px-12'

const sectionTitleClass =
  'font-display text-4xl leading-snug tracking-[-0.02em] text-foam sm:text-5xl sm:leading-snug md:text-6xl md:leading-tight font-black'

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
      staggerChildren: 0.08,
    }
  }
}

function useMouseGlow() {
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setCoords({ x, y })
  }

  const hoverProps = {
    onMouseMove: handleMouseMove,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  }

  const glowStyle = isHovered
    ? {
        background: `radial-gradient(150px circle at ${coords.x}px ${coords.y}px, rgba(6, 182, 212, 0.12), transparent 80%)`,
      }
    : {}

  const borderStyle = isHovered
    ? {
        maskImage: `radial-gradient(120px circle at ${coords.x}px ${coords.y}px, black 30%, transparent 80%)`,
        WebkitMaskImage: `radial-gradient(120px circle at ${coords.x}px ${coords.y}px, black 30%, transparent 80%)`,
      }
    : {}

  return { hoverProps, glowStyle, borderStyle, isHovered }
}

function SectionHeader({ eyebrow, title }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeInVariants}
    >
      <p className="mb-2.5 text-[0.72rem] font-extrabold uppercase tracking-[0.25em] text-teal">
        {eyebrow}
      </p>
      <h2 className={sectionTitleClass}>{title}</h2>
    </motion.div>
  )
}

function HeroAction({ action }) {
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
      className="liquid-glass liquid-glass-hover flex flex-col justify-between overflow-hidden rounded-[32px] p-6 shadow-glow lg:p-8 border border-teal/20"
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

function RecruiterQuickCard({ profile }) {
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
      className="liquid-glass liquid-glass-hover flex flex-col justify-between rounded-[32px] p-6 shadow-glow border border-teal/20"
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
          <div className="flex items-center justify-between border-b border-teal/10 pb-2">
            <span className="text-sm text-mist/75">Role sought</span>
            <span className="text-sm font-bold text-foam">{activeProfile.roleSought}</span>
          </div>
          <div className="flex items-center justify-between border-b border-teal/10 pb-2">
            <span className="text-sm text-mist/75">Experience</span>
            <span className="text-sm font-bold text-foam">{activeProfile.experience}</span>
          </div>
          <div className="flex items-center justify-between border-b border-teal/10 pb-2">
            <span className="text-sm text-mist/75">Location</span>
            <span className="text-sm font-bold text-foam">{activeProfile.location}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
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
        >
          LinkedIn Profile &rarr;
        </a>
      </div>
    </motion.div>
  )
}

function Timeline({ items }) {
  return (
    <div className="relative mt-8 border-l border-teal/20 pl-6 ml-4 md:ml-8 space-y-12">
      {/* Decorative vertical glow line */}
      <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-gradient-to-b from-teal via-teal/50 to-transparent pointer-events-none" />

      {items.map((item) => (
        <motion.div
          key={item.company}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInVariants}
          className="relative"
        >
          {/* Timeline Node */}
          <div className="absolute -left-[31px] top-1.5 flex h-[12px] w-[12px] items-center justify-center">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-45"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-teal"></span>
            </span>
          </div>

          <div className="liquid-glass liquid-glass-hover rounded-3xl p-6 shadow-glow">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-foam leading-tight">{item.company}</h3>
                <p className="mt-1 text-sm font-semibold text-teal">{item.role}</p>
              </div>
              <span className="rounded-full border border-teal/25 bg-teal/5 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-teal">
                {item.period}
              </span>
            </div>
            
            <ul className="mt-4 space-y-2.5 pl-4 text-base leading-7 text-mist/85 list-disc marker:text-teal/70">
              {item.points.map((point, idx) => (
                <li key={idx} className="pl-1">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function SkillBadge({ name }) {
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

function ContactCard({ item }) {
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

function ServiceCard({ item }) {
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

function CaseStudyCard({ item }) {
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
              <div className="absolute top-0 left-0 w-full h-14 bg-transparent z-30 pointer-events-auto" />
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

function MotionShowcaseItem({ item }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const isYoutube = item.id && item.id.length === 11
  const isGif = item.name && item.name.toLowerCase().endsWith('.gif')
  const previewUrl = isYoutube
    ? `https://www.youtube.com/embed/${item.id}?autoplay=1&mute=1&modestbranding=1&rel=0`
    : `https://drive.google.com/file/d/${item.id}/preview`

  return (
    <motion.article
      key={item.id}
      variants={fadeInVariants}
      className="liquid-glass overflow-hidden rounded-[28px] p-3 shadow-glow border border-teal/20"
    >
      {isYoutube ? (
        isPlaying ? (
          <iframe
            className="aspect-video w-full rounded-[20px] border-0 bg-black"
            src={previewUrl}
            title={item.title || item.name}
            loading="lazy"
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            className="relative block aspect-video w-full overflow-hidden rounded-[20px] border border-teal/10 bg-black cursor-pointer text-left p-0"
            onClick={() => setIsPlaying(true)}
            aria-label={`Play ${item.title || item.name}`}
          >
            <img
              className="h-full w-full object-contain"
              src={getYoutubeThumbnailUrl(item.id)}
              alt=""
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <span className="theme-card-soft absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-teal/30 text-2xl text-foam shadow-glow backdrop-blur-xl transition hover:scale-110">
              <span className="ml-1" aria-hidden="true">&#9654;</span>
            </span>
          </button>
        )
      ) : isGif ? (
        <img
          className="aspect-video w-full rounded-[20px] bg-black object-contain"
          src={`https://drive.google.com/uc?id=${item.id}&export=download`}
          alt={item.title || item.name}
          loading="lazy"
        />
      ) : (
        <div className="relative w-full h-full overflow-hidden rounded-[20px]">
          <iframe
            className="aspect-video w-full rounded-[20px] border-0 bg-black"
            src={previewUrl}
            title={item.title || item.name}
            loading="lazy"
            allow="autoplay; fullscreen; encrypted-media"
            allowFullScreen
          />
          <div className="absolute top-0 left-0 w-full h-14 bg-transparent z-30 pointer-events-auto" />
        </div>
      )}
      <h3 className="px-3 pb-2 pt-4 text-lg font-bold text-foam">{item.title || item.name}</h3>
    </motion.article>
  )
}

function MotionShowcase({ section }) {
  return (
    <div className="mt-7 grid gap-4 lg:grid-cols-2">
      {section.items.map((item) => (
        <MotionShowcaseItem key={item.id} item={item} />
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
              <p className="text-xl font-extrabold text-foam">{fact.value}</p>
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
        className="liquid-glass overflow-hidden rounded-[32px] p-3 shadow-glow border border-teal/20"
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

function BrandsMarquee({ items }) {
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

function isYoutubeMedia(media) {
  return Boolean(
    media?.href?.includes('youtube.com') ||
    media?.href?.includes('youtu.be') ||
    (media?.id && media.id.length === 11)
  )
}

function isGifMedia(media) {
  const name = media?.name || ''
  return name.toLowerCase().endsWith('.gif')
}

function getYoutubeId(media) {
  if (!media) return ''
  if (media.id && media.id.length === 11) {
    return media.id
  }
  const url = media.href || media.thumbnail
  if (typeof url === 'string') {
    const watchMatch = url.match(/[?&]v=([^&#?]+)/)
    if (watchMatch && watchMatch[1].length === 11) {
      return watchMatch[1]
    }
    const shortMatch = url.match(/youtu\.be\/([^&#?]+)/)
    if (shortMatch && shortMatch[1].length === 11) {
      return shortMatch[1]
    }
    const embedMatch = url.match(/embed\/([^&#?]+)/)
    if (embedMatch && embedMatch[1].length === 11) {
      return embedMatch[1]
    }
    const thumbMatch = url.match(/\/vi\/([^&#?\/]+)/)
    if (thumbMatch && thumbMatch[1].length === 11) {
      return thumbMatch[1]
    }
  }
  return ''
}

function getYoutubeThumbnailUrl(videoId) {
  return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
}

function getMediaExternalUrl(media) {
  if (isYoutubeMedia(media)) {
    return media.href || `https://www.youtube.com/watch?v=${getYoutubeId(media)}`
  }
  return getDrivePreviewUrl(media)
}

function getDriveThumbnailUrl(media, width = 1600) {
  if (!media) return ''
  if (isYoutubeMedia(media)) {
    const videoId = getYoutubeId(media)
    return getYoutubeThumbnailUrl(videoId)
  }
  const id = media.id || (typeof media.thumbnail === 'string' && media.thumbnail.match(/[?&]id=([A-Za-z0-9_-]{20,})/)?.[1])
  if (id) {
    return `https://lh3.googleusercontent.com/d/${id}=w${width}`
  }
  return media.thumbnail
}

function MediaThumbnail({ media, categoryTitle, index }) {
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  if (hasError || !media.thumbnail) {
    return (
      <div className="flex h-full w-full items-center justify-center px-5 text-center min-h-[220px]">
        <span className="text-sm font-extrabold uppercase tracking-[0.18em] text-foam/80">
          {media.type === 'video' ? 'Video' : media.type === 'animation' ? 'Animation' : 'Portfolio'}
        </span>
      </div>
    )
  }

  return (
    <div className={`relative w-full overflow-hidden bg-panel/30 ${!isLoaded ? 'min-h-[220px]' : ''}`}>
      {/* Glassmorphic Shimmer Loader */}
      {!isLoaded && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6">
          {/* Moving shimmer bar */}
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-teal/10 to-transparent" />
          
          {/* Glassmorphic inner shape */}
          <div className="w-12 h-12 rounded-full border border-teal/20 bg-teal/5 flex items-center justify-center mb-3">
            <svg className="w-5 h-5 text-teal/40 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal/50 animate-pulse">
            Loading visual...
          </span>
        </div>
      )}

      <img
        className={`block h-auto w-full select-none object-contain transition-all duration-700 hover:scale-105 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        src={getDriveThumbnailUrl(media, 900)}
        alt={media.name || `${categoryTitle} sample ${index}`}
        loading="lazy"
        draggable="false"
        referrerPolicy="no-referrer"
        onContextMenu={(event) => event.preventDefault()}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
    </div>
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
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    setIsPlaying(false)
  }, [media])

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
  const isYoutube = isYoutubeMedia(media)
  const previewUrl = getMediaExternalUrl(media)

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
            </div>

            <div className="flex flex-wrap items-center gap-3">
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
              isYoutube ? (
                isPlaying ? (
                  <iframe
                    className="h-full min-h-[62vh] w-full rounded-[18px] border-0 bg-black"
                    src={`https://www.youtube.com/embed/${getYoutubeId(media)}?autoplay=1&mute=1&modestbranding=1&rel=0`}
                    title={media.name || 'Video preview'}
                    allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                    allowFullScreen
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <button
                    className="relative block max-h-full max-w-full overflow-hidden rounded-[18px] border border-teal/10 bg-black cursor-pointer text-left p-0"
                    onClick={() => setIsPlaying(true)}
                    aria-label={`Play ${media.name || 'video'}`}
                  >
                    <img
                      className="max-h-[76vh] w-full select-none object-contain"
                      src={getDriveThumbnailUrl(media)}
                      alt={media.name || 'Video preview'}
                      draggable="false"
                      referrerPolicy="no-referrer"
                      onContextMenu={(event) => event.preventDefault()}
                    />
                    <span className="theme-card-soft absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-teal/30 text-2xl text-foam shadow-glow backdrop-blur-xl transition hover:scale-110">
                      <span className="ml-1" aria-hidden="true">&#9654;</span>
                    </span>
                  </button>
                )
              ) : isGifMedia(media) ? (
                <img
                  className="max-h-full max-w-full select-none object-contain"
                  src={`https://drive.google.com/uc?id=${media.id}&export=download`}
                  alt={media.name || 'Animation preview'}
                  draggable="false"
                  referrerPolicy="no-referrer"
                  onContextMenu={(event) => event.preventDefault()}
                />
              ) : (
                <div className="relative w-full h-full min-h-[62vh] overflow-hidden rounded-[18px]">
                  <iframe
                    className="h-full w-full rounded-[18px] border-0 bg-black"
                    src={previewUrl}
                    title={media.name || 'Video preview'}
                    allow="autoplay; fullscreen; encrypted-media"
                    allowFullScreen
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-0 left-0 w-full h-14 bg-transparent z-30 pointer-events-auto" />
                </div>
              )
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
  const { hoverProps, glowStyle, borderStyle, isHovered } = useMouseGlow()

  return (
    <motion.div 
      variants={fadeInVariants}
      {...hoverProps}
      className="relative liquid-glass liquid-glass-hover mb-4 inline-block w-full break-inside-avoid overflow-hidden rounded-[24px] p-3 shadow-glow border border-teal/20"
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
          className="pointer-events-none absolute inset-0 z-20 rounded-[24px] border border-teal/40 transition-opacity duration-300"
          style={borderStyle}
        />
      )}

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
      className="liquid-glass rounded-[32px] px-6 py-8 shadow-glow sm:px-8 lg:px-10 border border-teal/20"
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

      <div className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5">
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
        <header className="liquid-glass relative md:sticky top-3 z-30 flex min-h-[92px] w-full flex-col gap-6 rounded-[32px] px-6 py-6 shadow-glow md:flex-row md:items-center md:justify-between lg:px-10 border border-teal/20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="mb-2 text-[0.72rem] font-extrabold uppercase tracking-[0.25em] text-teal">
              {meta.label}
            </p>
            <h1 className="font-display text-5xl leading-tight tracking-[-0.02em] text-foam sm:text-6xl font-black">
              {meta.title}
            </h1>
            <p className="mt-2 text-base font-semibold text-mist">{meta.role}</p>
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

            <motion.a
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.98 }}
              href="https://drive.google.com/file/d/1gYT0gGjeS0-VmiJIcGpjmvRVNnhz4O_S/view?usp=drive_link"
              target="_blank"
              rel="noreferrer"
              className="theme-card-soft inline-flex h-12 items-center gap-2 rounded-full border border-teal/20 px-5 text-sm font-bold text-foam backdrop-blur-md transition-colors hover:border-teal/50 hover:text-teal"
              title="View Resume"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-teal">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              <span>Resume</span>
            </motion.a>

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
                        className={`relative rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 ${
                          activeCategoryIndex === index
                            ? 'bg-teal text-white dark:text-abyss shadow-glow-teal'
                            : 'theme-card-soft border border-teal/20 text-foam hover:border-teal/50 hover:text-teal'
                        }`}
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
                <section className="grid min-h-[calc(100vh-8rem)] gap-6 py-8 lg:grid-cols-[1.45fr_0.9fr] lg:items-stretch lg:py-10">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="liquid-glass flex flex-col justify-between rounded-[40px] px-6 py-10 shadow-glow sm:px-8 lg:px-12 border border-teal/20"
                  >
                    <div>
                      {/* Immediate Joiner & Availability Indicator */}
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal/20 bg-teal/5 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-teal"
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
                        className="mb-3 text-[0.72rem] font-extrabold uppercase tracking-[0.25em] text-teal"
                      >
                        {hero.eyebrow}
                      </motion.p>
                      
                      <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="font-display text-5xl leading-snug tracking-[-0.02em] text-foam sm:text-6xl sm:leading-snug lg:max-w-[12ch] lg:text-[5.8rem] lg:leading-[1.2] xl:text-[6.5rem] xl:leading-[1.2] font-black"
                      >
                        {hero.heading}
                      </motion.h2>
                      
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="mt-6 max-w-3xl text-base font-semibold leading-8 text-mist lg:text-lg"
                      >
                        {hero.description}
                      </motion.p>
                    </div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="mt-8 flex flex-col flex-wrap gap-3.5 sm:flex-row"
                    >
                      {hero.actions.map((action) => (
                        <HeroAction key={action.label} action={action} />
                      ))}
                    </motion.div>
                  </motion.div>

                  {/* Sidebar Cards Stack */}
                  <motion.aside 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="grid gap-6 lg:grid-rows-2"
                  >
                    {hero.highlights.map((item) => (
                      <HeroFocusCard key={item.title} item={item} />
                    ))}
                    <RecruiterQuickCard profile={portfolioData.quickProfile} />
                  </motion.aside>
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
                      <Timeline items={section.items} />
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
                      </>
                    ) : null}

                    {section.id === 'motion' ? <MotionShowcase section={section} /> : null}

                    {section.id === 'skills' ? (
                      <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                        {section.items.map((item) => (
                          <SkillBadge key={item} name={item} />
                        ))}
                      </div>
                    ) : null}

                    {section.id === 'brands' ? (
                      <motion.div variants={fadeInVariants}>
                        <BrandsMarquee items={section.items} />
                      </motion.div>
                    ) : null}

                    {section.id === 'contact' ? (
                      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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

        <footer className="px-2 py-8 text-center text-base text-mist/65">
          <p>&copy; {meta.copyright} &bull; Visual Design Portfolio</p>
        </footer>
      </div>

      <PortfolioLightbox media={selectedMedia} onClose={() => setSelectedMedia(null)} />
    </div>
  )
}
