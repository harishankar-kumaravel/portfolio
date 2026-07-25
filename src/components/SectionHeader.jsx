import { motion } from 'framer-motion'
import { fadeInVariants, sectionTitleClass, useDesktopMotion } from '../utils/portfolioUtils'

export default function SectionHeader({ eyebrow, title }) {
  const desktopMotion = useDesktopMotion()

  return (
    <motion.div
      initial={desktopMotion ? 'hidden' : false}
      whileInView={desktopMotion ? 'visible' : undefined}
      viewport={desktopMotion ? { once: true, margin: "-100px" } : undefined}
      variants={fadeInVariants}
    >
      <p className="mb-2.5 text-[0.72rem] font-extrabold uppercase tracking-[0.25em] text-teal">
        {eyebrow}
      </p>
      <h2 className={sectionTitleClass}>{title}</h2>
    </motion.div>
  )
}
