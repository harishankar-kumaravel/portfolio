import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'
import { fadeInVariants, staggerContainer } from '../utils/portfolioUtils'

export default function AboutSection({ section }) {
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
