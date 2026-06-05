'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { listenToPortfolio } from '../services/portfolioService';
import { portfolio as fallbackPortfolio } from '../data/portfolio';
import { 
  PortfolioData, 
  HeroHighlight, 
  HeroAction as HeroActionType, 
  ExperienceItem, 
  ContactItem, 
  ServiceItem, 
  CaseStudyItem,
  MotionItem,
  BrandItem
} from '../types/portfolio';

// CSS utilities mapped from the main style system
const sectionShell =
  'liquid-glass liquid-glass-hover mt-6 rounded-[36px] px-6 py-10 shadow-glow sm:px-8 lg:px-12';

const sectionTitleClass =
  'font-display text-4xl leading-snug tracking-[-0.02em] text-foam sm:text-5xl sm:leading-snug md:text-6xl md:leading-tight font-black';

const fadeInVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.21, 0.45, 0.32, 0.9] as const }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    }
  }
};

// --- COMPONENT HELPERS ---

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
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
  );
}

function HeroAction({ action }: { action: HeroActionType }) {
  const isPrimary = action.variant === 'primary';
  const className = isPrimary
    ? 'inline-flex items-center justify-center rounded-full bg-teal px-6 py-4 font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg dark:text-abyss text-base'
    : 'inline-flex items-center justify-center rounded-full border border-teal/25 theme-card-soft px-6 py-4 font-bold text-foam shadow-sm transition hover:-translate-y-0.5 hover:border-teal/60 hover:text-teal hover:shadow-md text-base';

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
  );
}

function HeroFocusCard({ item }: { item: HeroHighlight }) {
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
  );
}

function RecruiterQuickCard({ profile }: { profile: any }) {
  const activeProfile = profile || {
    roleSought: 'Visual / Motion Designer',
    experience: '2+ Years (Agency & Brand)',
    location: 'India (Remote / Relocation)',
    keySoftware: 'After Effects, Premiere Pro, Photoshop, Illustrator, Maya'
  };

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
  );
}

function Timeline({ items }: { items: ExperienceItem[] }) {
  return (
    <div className="relative mt-8 border-l border-teal/20 pl-6 ml-4 md:ml-8 space-y-12">
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
  );
}

function SkillBadge({ name }: { name: string }) {
  const [isHovered, setIsHovered] = useState(false);

  let icon = '⚡';
  if (name.includes('Photoshop')) icon = '🎨';
  else if (name.includes('Illustrator')) icon = '📐';
  else if (name.includes('After Effects')) icon = '🎬';
  else if (name.includes('Premiere Pro')) icon = '✂️';
  else if (name.includes('Figma')) icon = '❖';
  else if (name.includes('Cinema 4D') || name.toLowerCase().includes('maya')) icon = '🧊';
  else if (name.includes('HTML') || name.includes('CSS') || name.includes('Design')) icon = '💻';

  return (
    <motion.div
      variants={fadeInVariants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02, y: -2 }}
      className="liquid-glass liquid-glass-hover flex items-center justify-between rounded-2xl p-4 border border-teal/15 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <span className="text-sm font-bold text-foam">{name}</span>
      </div>
      <motion.div
        animate={{ scale: isHovered ? 1.1 : 1, opacity: isHovered ? 1 : 0.4 }}
        className="text-[0.65rem] font-extrabold uppercase tracking-wider text-teal"
      >
        Tools
      </motion.div>
    </motion.div>
  );
}

function ContactCard({ item }: { item: ContactItem }) {
  return (
    <motion.div
      variants={fadeInVariants}
      whileHover={{ y: -3 }}
      className="liquid-glass liquid-glass-hover rounded-3xl p-5 border border-teal/15 shadow-sm"
    >
      <p className="text-xs font-extrabold uppercase tracking-widest text-teal">{item.label}</p>
      <p className="mt-2 text-base font-black text-foam truncate">{item.value}</p>
      <a
        className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-bold text-teal hover:underline"
        href={item.href}
        target={item.external ? '_blank' : undefined}
        rel={item.external ? 'noreferrer' : undefined}
      >
        Get in touch &rarr;
      </a>
    </motion.div>
  );
}

function ServiceCard({ item }: { item: ServiceItem }) {
  return (
    <motion.div
      variants={fadeInVariants}
      whileHover={{ y: -4 }}
      className="liquid-glass liquid-glass-hover flex flex-col justify-between rounded-[32px] p-6 lg:p-8 border border-teal/15 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div className="theme-card-soft flex h-12 w-12 items-center justify-center rounded-2xl border border-teal/20 text-lg font-bold text-teal">
          {item.number}
        </div>
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-bold text-foam tracking-tight leading-snug">{item.title}</h3>
        <p className="mt-3.5 text-sm leading-6 text-mist/80">{item.description}</p>
      </div>
    </motion.div>
  );
}

function CaseStudyCard({ item }: { item: CaseStudyItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div
        variants={fadeInVariants}
        whileHover={{ y: -5 }}
        className="liquid-glass liquid-glass-hover flex flex-col justify-between overflow-hidden rounded-[32px] p-6 shadow-glow border border-teal/15 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div className="space-y-4">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-teal/10 bg-panel">
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover select-none transition duration-500 hover:scale-102"
              loading="lazy"
              draggable="false"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <span className="text-[0.68rem] font-extrabold uppercase tracking-wider text-teal">
              {item.category}
            </span>
            <h3 className="mt-2 text-xl font-bold text-foam tracking-tight leading-snug">{item.title}</h3>
          </div>
        </div>
        
        <div className="mt-6 flex justify-between items-center pt-4 border-t border-teal/10">
          <span className="text-xs text-mist/60 font-semibold">View Case Study</span>
          <span className="text-teal font-extrabold text-sm">&rarr;</span>
        </div>
      </motion.div>

      {/* Case Study Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-abyss/85 p-4 backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[32px] border border-teal/20 bg-panel p-6 sm:p-8 shadow-glow"
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start border-b border-teal/10 pb-4 mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-teal">{item.category}</span>
                  <h2 className="text-2xl font-black text-foam mt-1">{item.title}</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="theme-card-soft w-10 h-10 flex items-center justify-center rounded-full border border-teal/20 text-foam text-xl hover:border-teal/50 hover:text-teal transition"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-6 text-sm sm:text-base leading-relaxed text-mist/90">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-teal mb-1">Challenge</h4>
                      <p>{item.challenge}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-teal mb-1">Goal</h4>
                      <p>{item.goal}</p>
                    </div>
                  </div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-teal/10 bg-abyss">
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="border-t border-teal/10 pt-4 grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-teal mb-2">Process & Steps</h4>
                    <ul className="list-disc pl-4 space-y-1">
                      {item.process.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-teal mb-1">Output</h4>
                      <p>{item.output}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-teal mb-1">Result</h4>
                      <p className="font-semibold text-foam">{item.result}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MotionShowcase({ section }: { section: any }) {
  return (
    <div className="mt-8 grid gap-6 md:grid-cols-2">
      {section.items.map((video: MotionItem) => (
        <motion.div
          key={video.id}
          variants={fadeInVariants}
          className="liquid-glass rounded-3xl p-4 border border-teal/15 shadow-glow"
        >
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-teal/10 bg-black">
            <iframe
              className="absolute inset-0 h-full w-full border-0"
              src={`https://drive.google.com/file/d/${video.id}/preview`}
              title={video.title}
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>
          <h3 className="mt-4 text-center text-sm font-bold text-foam uppercase tracking-wider">
            {video.title}
          </h3>
        </motion.div>
      ))}
    </div>
  );
}

function AboutSection({ section }: { section: any }) {
  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
      <div className="lg:col-span-7 space-y-6">
        <span className="text-[0.72rem] font-extrabold uppercase tracking-[0.25em] text-teal">
          {section.eyebrow}
        </span>
        <h2 className="text-4xl font-black text-foam leading-tight tracking-tight sm:text-5xl">
          {section.title}
        </h2>
        <p className="text-base leading-8 text-mist/85 font-medium whitespace-pre-line">
          {section.body}
        </p>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-teal/10">
          {section.facts.map((fact: any) => (
            <div key={fact.label} className="text-left">
              <p className="font-display text-4xl leading-none text-foam font-black">{fact.value}</p>
              <p className="mt-2 text-xs font-extrabold uppercase tracking-wider text-teal">{fact.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-5 flex justify-center lg:justify-end">
        <div className="theme-image-panel relative aspect-square w-full max-w-[340px] rounded-[48px] p-4 shadow-glow border border-teal/20">
          <div className="h-full w-full overflow-hidden rounded-[36px] bg-[#07090C] border border-teal/10 relative">
            {section.portrait && (
              <img
                src={section.portrait}
                alt={section.name}
                className="h-full w-full object-cover select-none"
                draggable="false"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-abyss/45 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}

function BrandLogo({ item }: { item: BrandItem }) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !item.logoUrl) {
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal/10 text-teal font-extrabold text-sm border border-teal/20 select-none">
        {item.logo}
      </div>
    );
  }

  return (
    <img
      src={item.logoUrl}
      alt={`${item.name} logo`}
      className="h-12 w-12 select-none object-contain rounded-xl border border-teal/15 bg-[#11151C]/40 p-1"
      draggable="false"
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
    />
  );
}

function BrandCard({ item }: { item: BrandItem }) {
  return (
    <div className="liquid-glass flex w-[280px] shrink-0 items-center gap-4 rounded-2xl px-5 py-4 border border-teal/10">
      <BrandLogo item={item} />
      <div className="min-w-0">
        <h4 className="text-sm font-bold text-foam truncate leading-tight">{item.name}</h4>
        <p className="mt-1 text-xs text-mist/65 font-medium truncate">{item.type} &bull; {item.location}</p>
      </div>
      {item.linkedIn && (
        <a
          href={item.linkedIn}
          target="_blank"
          rel="noreferrer"
          className="ml-auto text-teal hover:text-[#22d3ee] font-black text-sm"
          title="LinkedIn Profile"
        >
          &rarr;
        </a>
      )}
    </div>
  );
}

function BrandsMarquee({ items }: { items: BrandItem[] }) {
  // Triple the items to make the continuous loop infinite on wide screens
  const marqueeItems = [...items, ...items, ...items];

  return (
    <div className="relative w-full overflow-hidden py-4">
      {/* Side gradients to fade out edge scrolling */}
      <div className="absolute top-0 bottom-0 left-0 z-10 w-24 bg-gradient-to-r from-abyss to-transparent pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 z-10 w-24 bg-gradient-to-l from-abyss to-transparent pointer-events-none" />
      
      <div className="animate-marquee flex gap-4">
        {marqueeItems.map((item, idx) => (
          <BrandCard key={`${item.name}-${idx}`} item={item} />
        ))}
      </div>
    </div>
  );
}

function getDriveThumbnailUrl(media: any, width = 1600) {
  if (!media) return '';
  const id = media.id || (typeof media.thumbnail === 'string' && media.thumbnail.match(/[?&]id=([A-Za-z0-9_-]{20,})/)?.[1]);
  if (id) {
    return `https://lh3.googleusercontent.com/d/${id}=w${width}`;
  }
  return media.thumbnail;
}

function MediaThumbnail({ media, categoryTitle, index }: { media: any; categoryTitle: string; index: number }) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !media.thumbnail) {
    return (
      <div className="flex h-full w-full items-center justify-center px-5 text-center min-h-[220px]">
        <span className="text-sm font-extrabold uppercase tracking-[0.18em] text-foam/80">
          {media.type === 'video' ? 'Video' : media.type === 'animation' ? 'Animation' : 'Portfolio'}
        </span>
      </div>
    );
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
  );
}

function getDrivePreviewUrl(media: any) {
  if (media.href) {
    return media.href.replace(/\/view(\?.*)?$/, '/preview');
  }

  if (media.id) {
    return `https://drive.google.com/file/d/${media.id}/preview`;
  }

  return media.thumbnail;
}

function PortfolioLightbox({ media, onClose }: { media: any; onClose: () => void }) {
  useEffect(() => {
    if (!media || typeof window === 'undefined') {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
      if ((event.ctrlKey || event.metaKey) && ['s', 'S'].includes(event.key)) {
        event.preventDefault();
      }
    };
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [media, onClose]);

  if (!media) return null;

  const isPlayable = media.type === 'video' || media.type === 'animation';
  const previewUrl = getDrivePreviewUrl(media);

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
  );
}

function PortfolioPlaceholder({ categoryTitle, index, item, onOpen }: { categoryTitle: string; index: number; item: any; onOpen: (media: any) => void }) {
  const media = typeof item === 'string' ? { name: `Work ${index}`, thumbnail: item } : item;
  const isPlayable = media.type === 'video' || media.type === 'animation';

  return (
    <motion.div 
      variants={fadeInVariants}
      className="liquid-glass liquid-glass-hover mb-4 inline-block w-full break-inside-avoid overflow-hidden rounded-[24px] p-3 shadow-glow border border-teal/20"
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
  );
}

function PortfolioCategory({ category, onOpenMedia }: { category: any; onOpenMedia: (media: any) => void }) {
  const items = category.items || (category.images || []).map((image: any) => ({ thumbnail: image }));

  if (!items.length) {
    return null;
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
        {items.map((item: any, index: number) => (
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
  );
}

// --- LOADING SKELETON ---

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#94A3B8] p-6 sm:p-12 font-sans space-y-12">
      <div className="max-w-7xl mx-auto space-y-12 animate-pulse">
        {/* Nav Skeleton */}
        <div className="flex justify-between items-center border-b border-[#1E293B] pb-6">
          <div className="h-6 w-32 bg-[#1E293B] rounded-lg" />
          <div className="flex gap-4">
            <div className="h-4 w-12 bg-[#1E293B] rounded-lg" />
            <div className="h-4 w-12 bg-[#1E293B] rounded-lg" />
            <div className="h-4 w-12 bg-[#1E293B] rounded-lg" />
          </div>
        </div>

        {/* Hero Stack Skeleton */}
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-6">
            <div className="h-4 w-24 bg-[#1E293B] rounded-lg" />
            <div className="h-14 w-full bg-[#1E293B] rounded-2xl" />
            <div className="h-24 w-full bg-[#1E293B] rounded-2xl" />
            <div className="flex gap-4">
              <div className="h-12 w-36 bg-[#1E293B] rounded-full" />
              <div className="h-12 w-36 bg-[#1E293B] rounded-full" />
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="h-[340px] w-full bg-[#1E293B] rounded-[48px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---

export default function Home() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(fallbackPortfolio);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentHash, setCurrentHash] = useState('');

  // Subscribe to real-time updates from Firestore
  useEffect(() => {
    const unsubscribe = listenToPortfolio((data) => {
      setPortfolioData(data);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sync window URL hashes for tabs
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentHash(window.location.hash);
      const handleHashChange = () => setCurrentHash(window.location.hash);
      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
    }
  }, []);

  // Theme Toggler effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const { meta, navigation, hero, sections, portfolioPage } = portfolioData;
  const isPortfolioPage = currentHash === '#portfolio';
  
  // Filter sections visible on home layout
  const homeNavigation = navigation.filter((item) => !item.page);
  const orderedSections = homeNavigation
    .map((item) => {
      const sec = (sections as any)[item.id];
      if (sec) sec.id = item.id;
      return sec;
    })
    .filter(Boolean);

  return (
    <div className="theme-page-bg min-h-screen relative font-sans transition-colors duration-500 selection:bg-teal selection:text-white dark:selection:text-abyss">
      {/* Background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="theme-grid-bg absolute inset-0" />
        <div className="theme-hero-glow absolute inset-x-0 top-0 h-[500px] blur-3xl" />
        
        {/* Animated Orbs */}
        <div className="theme-orb-a absolute -left-24 top-24 h-96 w-96 rounded-full blur-[120px]" />
        <div className="theme-orb-b absolute right-[-6rem] top-[15rem] h-[500px] w-[500px] rounded-full blur-[140px]" />
        <div className="theme-orb-c absolute bottom-[-10rem] left-1/4 h-[600px] w-[600px] rounded-full blur-[160px]" />
      </div>

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-40 w-full bg-abyss/45 backdrop-blur-md border-b border-teal/10">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#" className="font-display text-lg font-black tracking-tight text-foam">
            {meta.title}
          </a>

          <nav className="hidden md:flex gap-6 text-sm font-semibold">
            {navigation.map((item) => (
              <a
                key={item.id}
                href={item.page ? `#${item.page}` : `#${item.id}`}
                className="text-mist hover:text-teal transition"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {/* Dark Mode toggle switch */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="theme-card-soft flex h-9 w-9 items-center justify-center rounded-full border border-teal/15 text-foam hover:border-teal/40 transition text-sm"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? '🌙' : '☀️'}
            </button>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full bg-teal px-4 py-2 text-xs font-bold text-white shadow-sm hover:-translate-y-0.5 transition dark:text-abyss"
            >
              Hire Me
            </a>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 sm:py-20 lg:px-8 relative z-10">
        <AnimatePresence mode="wait">
          {!isPortfolioPage ? (
            <motion.div
              key="home-sections"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="space-y-24 sm:space-y-36"
            >
              {/* HERO SECTION */}
              <section className="grid gap-10 lg:grid-cols-12 lg:items-center">
                {/* Hero Left Content */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Status chip */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 rounded-full border border-teal/20 bg-teal/5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-teal"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-teal"></span>
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
                </div>

                {/* Hero Right Aside Stack */}
                <motion.aside 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="lg:col-span-5 grid gap-6 lg:grid-rows-2"
                >
                  {hero.highlights.map((item) => (
                    <HeroFocusCard key={item.title} item={item} />
                  ))}
                  <RecruiterQuickCard profile={portfolioData.quickProfile} />
                </motion.aside>
              </section>

              {/* DYNAMIC ORDERED SUBSECTIONS */}
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

                  {section.id === 'services' && (
                    <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {section.items.map((item: ServiceItem) => (
                        <ServiceCard key={item.title} item={item} />
                      ))}
                    </div>
                  )}

                  {section.id === 'case-studies' && (
                    <>
                      <div className="mt-7 grid gap-5 xl:grid-cols-3">
                        {section.items.map((item: CaseStudyItem) => (
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
                  )}

                  {section.id === 'motion' && <MotionShowcase section={section} />}

                  {section.id === 'experience' && <Timeline items={section.items} />}

                  {section.id === 'skills' && (
                    <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                      {section.items.map((item: string) => (
                        <SkillBadge key={item} name={item} />
                      ))}
                    </div>
                  )}

                  {section.id === 'brands' && (
                    <motion.div variants={fadeInVariants}>
                      <BrandsMarquee items={section.items} />
                    </motion.div>
                  )}

                  {section.id === 'contact' && (
                    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      {section.items.map((item: ContactItem) => (
                        <ContactCard key={item.label} item={item} />
                      ))}
                    </div>
                  )}
                </motion.section>
              ))}
            </motion.div>
          ) : (
            /* DYNAMIC CATEGORY PORTFOLIO PAGE */
            <motion.div
              key="portfolio-categories"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
              className="space-y-16"
            >
              {/* Category Page Title */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                  <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.25em] text-teal">
                    {portfolioPage.eyebrow}
                  </p>
                  <h2 className="text-4xl sm:text-5xl font-black text-foam tracking-tight leading-tight mt-2">{portfolioPage.title}</h2>
                  <p className="mt-4 text-base max-w-2xl leading-7 text-mist/85 font-medium">{portfolioPage.intro}</p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="#"
                    className="inline-flex items-center justify-center rounded-full border border-teal/20 px-5 py-3 text-sm font-bold text-foam shadow-sm hover:border-teal/55 hover:text-teal transition"
                  >
                    &larr; Back to Home
                  </a>
                </div>
              </div>

              {/* Horizontal Category Selector */}
              <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-thin border-b border-teal/10">
                {portfolioPage.categories.map((cat, idx) => (
                  <button
                    key={cat.title}
                    onClick={() => setActiveCategoryIndex(idx)}
                    className={`px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition ${
                      activeCategoryIndex === idx
                        ? 'bg-[#06B6D4]/10 border border-[#06B6D4] text-[#06B6D4]'
                        : 'border border-transparent text-[#94A3B8] hover:bg-[#11151C]'
                    }`}
                  >
                    {cat.title} ({cat.count || 0})
                  </button>
                ))}
              </div>

              {/* Render Selected Category Grid */}
              {portfolioPage.categories[activeCategoryIndex] && (
                <PortfolioCategory
                  category={portfolioPage.categories[activeCategoryIndex]}
                  onOpenMedia={setSelectedMedia}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="px-4 py-8 text-center text-sm text-mist/65 border-t border-teal/10 mt-16 relative z-10">
        <p>&copy; {meta.copyright} &bull; Portfolio Website. Built with Next.js & Firebase.</p>
      </footer>

      {/* Lightbox Modal */}
      <PortfolioLightbox media={selectedMedia} onClose={() => setSelectedMedia(null)} />
    </div>
  );
}
