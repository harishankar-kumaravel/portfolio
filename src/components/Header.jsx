import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header({ meta, isDarkMode, setIsDarkMode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Minimal set of visible nav links
  const minimalNav = [
    { id: 'portfolio', label: 'Portfolio', href: '#portfolio' },
    { id: 'about', label: 'About', href: '#about' },
    { id: 'contact', label: 'Contact', href: '#contact' },
  ]

  return (
    <header className="liquid-glass relative md:sticky top-3 z-30 flex w-full flex-col gap-4 rounded-[32px] px-5 py-5 sm:px-6 shadow-glow border border-teal/20 backdrop-blur-xl transition-all duration-300">
      
      {/* Top Bar containing Brand & Actions */}
      <div className="flex items-center justify-between w-full">
        {/* Left Side: Brand Name & Label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="min-w-0"
        >
          <p className="mb-1 text-[0.65rem] font-extrabold uppercase tracking-[0.25em] text-teal">
            {meta.label}
          </p>
          <h1 className="font-display text-2xl sm:text-3xl leading-none tracking-[-0.02em] text-foam font-black">
            <a href="#" className="hover:text-teal transition-colors">{meta.title}</a>
          </h1>
          <p className="mt-1 text-xs font-semibold text-mist hidden sm:block">{meta.role}</p>
        </motion.div>

        {/* Right Side: Desktop Nav + Universal Buttons */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Desktop Navigation: Minimal Links Only */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-mist">
            {minimalNav.map((item, index) => (
              <motion.a
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 * index }}
                key={item.id}
                className="transition hover:text-teal py-1"
                href={item.href}
                id={`nav-link-${item.id}`}
              >
                {item.label}
              </motion.a>
            ))}
          </nav>

          {/* Action buttons always visible */}
          <div className="flex items-center gap-2.5">
            {/* Resume button */}
            <motion.a
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.98 }}
              href="https://drive.google.com/file/d/1gYT0gGjeS0-VmiJIcGpjmvRVNnhz4O_S/view?usp=drive_link"
              target="_blank"
              rel="noreferrer"
              className="theme-card-soft inline-flex h-10 items-center gap-2 rounded-full border border-teal/20 px-4 text-xs sm:text-sm font-bold text-foam backdrop-blur-md transition-colors hover:border-teal/50 hover:text-teal"
              title="View Resume"
              id="header-resume-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-teal">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              <span className="hidden xs:inline">Resume</span>
            </motion.a>

            {/* Dark Mode toggle */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="theme-card-soft flex h-10 w-10 items-center justify-center rounded-full border border-teal/20 text-teal backdrop-blur-md transition-colors hover:border-teal/50 cursor-pointer"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              type="button"
              id="dark-mode-toggle"
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M3 12h2.25m.386-6.364l1.591 1.591M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </motion.button>

            {/* Hamburger Menu Toggle (Visible only on mobile/tablet) */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="theme-card-soft flex md:hidden h-10 w-10 items-center justify-center rounded-full border border-teal/20 text-teal backdrop-blur-md transition-colors hover:border-teal/50 cursor-pointer"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
              type="button"
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Slide down Navigation Overlay (Visible on mobile/tablet when toggled) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-teal/10 mt-2 pt-2"
          >
            <nav className="flex flex-col gap-2 py-2 text-base font-bold text-mist/90 pl-2">
              {minimalNav.map((item, index) => (
                <motion.a
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.03 * index }}
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="transition hover:text-teal py-1.5 w-full block text-left"
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
