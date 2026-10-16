import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';

export interface SectionMeta {
  id: string;
  pt: string;
  en: string;
}

export const SECTIONS: SectionMeta[] = [
  { id: 'home', pt: 'Início', en: 'Home' },
  { id: 'about', pt: 'Sobre', en: 'About' },
  { id: 'experience', pt: 'Trajetória', en: 'Experience' },
  { id: 'research', pt: 'Pesquisa', en: 'Research' },
  { id: 'projects', pt: 'Projetos', en: 'Projects' },
  { id: 'publications', pt: 'Publicações', en: 'Publications' },
  { id: 'skills', pt: 'Competências', en: 'Skills' },
  { id: 'resume', pt: 'Síntese', en: 'Resume' },
  { id: 'contact', pt: 'Contato', en: 'Contact' },
];

const NAV_HEIGHT = 64; // height of fixed navbar
const COOLDOWN_MS = 750; // debounce between wheel section steps

export default function SectionScroller() {
  const { lang } = useLanguage();
  const [activeIdx, setActiveIdx] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const isLockedRef = useRef(false);
  const lockTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate target scroll Y coordinate for a given section index
  const getSectionTop = useCallback((idx: number): number => {
    if (idx < 0) return 0;
    if (idx >= SECTIONS.length) {
      return document.documentElement.scrollHeight;
    }
    const el = document.getElementById(SECTIONS[idx].id);
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    return Math.max(0, rect.top + window.scrollY - NAV_HEIGHT);
  }, []);

  // Smoothly scroll to a section by index
  const scrollToIdx = useCallback(
    (targetIdx: number, durationLock = COOLDOWN_MS) => {
      const clamped = Math.max(0, Math.min(SECTIONS.length - 1, targetIdx));
      const targetY = getSectionTop(clamped);

      isLockedRef.current = true;
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current);

      window.scrollTo({
        top: targetY,
        behavior: 'smooth',
      });
      setActiveIdx(clamped);

      lockTimerRef.current = setTimeout(() => {
        isLockedRef.current = false;
      }, durationLock);
    },
    [getSectionTop]
  );

  // Synchronize active dot with actual scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (isLockedRef.current) return;
      const scrollY = window.scrollY;

      let found = 0;
      for (let i = 0; i < SECTIONS.length; i++) {
        const el = document.getElementById(SECTIONS[i].id);
        if (!el) continue;
        const top = el.offsetTop - NAV_HEIGHT - 40;
        const bottom = top + el.offsetHeight;
        if (scrollY >= top && scrollY < bottom) {
          found = i;
          break;
        }
      }
      setActiveIdx(found);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Section-by-section wheel navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Don't hijack if user is typing in form elements
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') {
        return;
      }

      // Ignore subtle trackpad micro-movements
      if (Math.abs(e.deltaY) < 30) return;

      if (isLockedRef.current) {
        e.preventDefault();
        return;
      }

      const scrollY = window.scrollY;
      const viewportH = window.innerHeight;

      // Find which section is currently on screen
      let currentIdx = 0;
      for (let i = 0; i < SECTIONS.length; i++) {
        const el = document.getElementById(SECTIONS[i].id);
        if (!el) continue;
        const top = el.offsetTop - NAV_HEIGHT - 30;
        const bottom = top + el.offsetHeight;
        if (scrollY >= top && scrollY < bottom) {
          currentIdx = i;
          break;
        }
      }

      const currentEl = document.getElementById(SECTIONS[currentIdx].id);
      if (!currentEl) return;

      const sectionTop = currentEl.offsetTop - NAV_HEIGHT;
      const sectionBottom = sectionTop + currentEl.offsetHeight;
      const isTallSection = currentEl.offsetHeight > viewportH + 80;

      // Scrolling Down
      if (e.deltaY > 0) {
        if (isTallSection && scrollY + viewportH < sectionBottom - 80) {
          // Scroll down within this long section first before jumping to next
          isLockedRef.current = true;
          const stepDown = Math.min(viewportH * 0.7, sectionBottom - (scrollY + viewportH));
          window.scrollBy({ top: stepDown, behavior: 'smooth' });
          if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
          lockTimerRef.current = setTimeout(() => {
            isLockedRef.current = false;
          }, 350);
          e.preventDefault();
        } else if (currentIdx < SECTIONS.length - 1) {
          // Jump cleanly to next section
          e.preventDefault();
          scrollToIdx(currentIdx + 1);
        }
      }
      // Scrolling Up
      else if (e.deltaY < 0) {
        if (isTallSection && scrollY > sectionTop + 80) {
          // Scroll up within this long section first before jumping to previous
          isLockedRef.current = true;
          const stepUp = Math.min(viewportH * 0.7, scrollY - sectionTop);
          window.scrollBy({ top: -stepUp, behavior: 'smooth' });
          if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
          lockTimerRef.current = setTimeout(() => {
            isLockedRef.current = false;
          }, 350);
          e.preventDefault();
        } else if (currentIdx > 0) {
          // Jump cleanly to previous section
          e.preventDefault();
          scrollToIdx(currentIdx - 1);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    };
  }, [scrollToIdx]);

  // Keyboard navigation (ArrowDown, ArrowUp, PageDown, PageUp)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea') return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        scrollToIdx(activeIdx + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        scrollToIdx(activeIdx - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIdx, scrollToIdx]);

  return (
    <>
      {/* Floating Vertical Section Dots Navigation */}
      <nav
        aria-label="Navegação entre seções"
        className="fixed right-3 md:right-5 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col items-center gap-3.5
                   p-2 rounded-full bg-base-950/40 backdrop-blur-md border border-base-700/40 shadow-xl"
      >
        {SECTIONS.map((sec, idx) => {
          const isActive = activeIdx === idx;
          const label = lang === 'pt' ? sec.pt : sec.en;

          return (
            <div
              key={sec.id}
              className="relative flex items-center justify-center"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip on hover */}
              <AnimatePresence>
                {hoveredIdx === idx && (
                  <motion.div
                    initial={{ opacity: 0, x: 10, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 6, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-7 px-2.5 py-1 rounded-md bg-base-900/95 border border-base-700
                               text-xs font-medium text-white whitespace-nowrap shadow-lg pointer-events-none"
                  >
                    {label}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dot Button */}
              <button
                type="button"
                onClick={() => scrollToIdx(idx)}
                aria-label={`Ir para a seção ${label}`}
                aria-current={isActive ? 'true' : undefined}
                className="relative flex items-center justify-center p-1 group focus:outline-none"
              >
                <span
                  className={`block transition-all duration-300 rounded-full ${
                    isActive
                      ? 'w-2 h-6 bg-accent-400 shadow-md shadow-accent-400/40'
                      : 'w-2 h-2 bg-base-500/50 group-hover:bg-accent-400/80 group-hover:scale-125'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </nav>

      {/* Floating Next-Section Indicator (bottom right corner, subtle) */}
      {activeIdx < SECTIONS.length - 1 && (
        <motion.button
          type="button"
          onClick={() => scrollToIdx(activeIdx + 1)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 z-30 hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full
                     bg-base-900/80 backdrop-blur-md border border-base-700/60 text-xs text-gray-400
                     hover:text-accent-400 hover:border-accent-500/40 transition-all shadow-lg"
          aria-label={lang === 'pt' ? 'Próxima seção' : 'Next section'}
        >
          <span>{lang === 'pt' ? 'Próxima' : 'Next'}</span>
          <ChevronDown size={14} className="animate-bounce" />
        </motion.button>
      )}
    </>
  );
}
