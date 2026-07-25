import { useState, useEffect, useRef } from 'react'

// Section visual layout helper classes
export const sectionShell =
  'liquid-glass liquid-glass-hover mt-5 rounded-[28px] px-4 py-6 shadow-glow sm:mt-6 sm:rounded-[36px] sm:px-8 sm:py-8 lg:px-10'

export const sectionTitleClass =
  'font-display text-3xl leading-[0.98] tracking-[-0.02em] text-foam xs:text-4xl sm:text-5xl sm:leading-[1.0] md:text-6xl md:leading-[0.98] font-black'

// Framer Motion shared animations
export const fadeInVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.21, 0.45, 0.32, 0.9] }
  }
}

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    }
  }
}

// Enhancements that add motion only where a pointer/large display can support it.
export function useDesktopMotion() {
  const [isDesktopMotion, setIsDesktopMotion] = useState(false)

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px)')
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotionPreference = () => setIsDesktopMotion(desktopQuery.matches && !reducedMotionQuery.matches)

    updateMotionPreference()
    desktopQuery.addEventListener('change', updateMotionPreference)
    reducedMotionQuery.addEventListener('change', updateMotionPreference)

    return () => {
      desktopQuery.removeEventListener('change', updateMotionPreference)
      reducedMotionQuery.removeEventListener('change', updateMotionPreference)
    }
  }, [])

  return isDesktopMotion
}

// Deobfuscation helpers for Google Drive folder sync
export function deobfuscateId(obfuscated) {
  if (!obfuscated) return '';
  // Synced media IDs are base64-encoded (44 characters). Manually supplied
  // Google Drive IDs are already usable and must not be decoded again.
  if (obfuscated.length % 4 !== 0) return obfuscated;
  try {
    const reversed = obfuscated.split('').reverse().join('');
    const decoded = atob(reversed);
    return /^[A-Za-z0-9_-]{20,}$/.test(decoded) ? decoded : obfuscated;
  } catch (e) {
    return obfuscated;
  }
}

export function deobfuscateUrl(url) {
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

export function deobfuscateMedia(media) {
  if (!media) return media;
  return {
    ...media,
    id: deobfuscateId(media.id),
    thumbnail: deobfuscateUrl(media.thumbnail),
    href: deobfuscateUrl(media.href)
  };
}

export function deobfuscatePortfolio(data) {
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

// Media type and link utilities
export function isYoutubeMedia(media) {
  return Boolean(
    media?.href?.includes('youtube.com') ||
    media?.href?.includes('youtu.be') ||
    (media?.id && media.id.length === 11)
  )
}

export function isGifMedia(media) {
  const name = media?.name || ''
  return name.toLowerCase().endsWith('.gif')
}

export function getYoutubeId(media) {
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

export function getYoutubeThumbnailUrl(videoId) {
  return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
}

export function getMediaExternalUrl(media) {
  if (isYoutubeMedia(media)) {
    return media.href || `https://www.youtube.com/watch?v=${getYoutubeId(media)}`
  }
  return getDrivePreviewUrl(media)
}

export function getDriveThumbnailUrl(media, width = 1600) {
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

export function getDrivePreviewUrl(media) {
  if (media.href) {
    return media.href.replace(/\/view(\?.*)?$/, '/preview')
  }

  if (media.id) {
    return `https://drive.google.com/file/d/${media.id}/preview`
  }

  return media.thumbnail
}

// Mouse glow hover effect hook
export function useMouseGlow() {
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

// Deferred rendering wrapper using IntersectionObserver
export function DeferredSection({ children, height = '300px' }) {
  const shouldDefer = typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches
  const [isRendered, setIsRendered] = useState(() => !shouldDefer)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!shouldDefer || isRendered) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRendered(true)
          observer.disconnect()
        }
      },
      { rootMargin: '250px 0px' } // Load content slightly before it enters viewport
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [isRendered, shouldDefer])

  if (!shouldDefer) {
    return children
  }

  return (
    <div ref={containerRef} style={{ minHeight: isRendered ? 'auto' : height }}>
      {isRendered ? children : (
        <div className="w-full flex items-center justify-center border border-teal/5 bg-panel/10 rounded-[36px]" style={{ height }}>
          <div className="w-8 h-8 rounded-full border border-teal/20 border-t-teal animate-spin" />
        </div>
      )}
    </div>
  )
}
