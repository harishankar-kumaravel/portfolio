import { motion } from 'framer-motion'
import { fadeInVariants } from '../utils/portfolioUtils'

export default function Timeline({ items }) {
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
