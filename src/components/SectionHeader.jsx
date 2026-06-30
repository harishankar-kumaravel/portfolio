import { motion } from 'framer-motion'
import { fadeInVariants, sectionTitleClass } from '../utils/portfolioUtils'

export default function SectionHeader({ eyebrow, title }) {
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
