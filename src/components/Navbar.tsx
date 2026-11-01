import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Download } from 'lucide-react';
import { useLang } from '@/lib/lang';
import { links } from '@/content';

const IDS = ['focus', 'claude', 'research', 'path', 'contact'] as const;

export default function Navbar() {
  const { c, lang, toggle } = useLang();
  const [active, setActive] = useState<string>('');
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    IDS.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => { window.removeEventListener('scroll', onScroll); io.disconnect(); };
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${scrolled ? 'bg-ink-950/70 backdrop-blur-xl border-b border-ink-800/80' : ''}`}>
      <motion.div className="absolute left-0 top-0 h-[2px] w-full origin-left bg-gradient-to-r from-ember-500 via-amber-400 to-lilac-400" style={{ scaleX: progress }} />
      <nav className="wrap flex h-16 items-center justify-between">
        <a href="#top" className="font-display text-lg font-semibold text-ink-100 tracking-tight">
          lucas<span className="text-ember-500">.</span>cunha
        </a>
        <ul className="hidden md:flex items-center gap-1 rounded-full border border-ink-800 bg-ink-900/60 p-1">
          {IDS.map((id) => (
            <li key={id} className="relative">
              {active === id && (
                <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-ink-700" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
              )}
              <a href={`#${id}`} className={`relative z-10 block px-4 py-1.5 text-sm transition-colors ${active === id ? 'text-ink-100' : 'text-ink-400 hover:text-ink-100'}`}>
                {c.nav[id]}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <button onClick={toggle} className="rounded-full border border-ink-700 px-3 py-1.5 font-mono text-xs text-ink-300 hover:border-ember-400/60 hover:text-white transition-colors" aria-label="Trocar idioma / switch language">
            <span className={lang === 'pt' ? 'text-ember-400' : ''}>PT</span>
            <span className="mx-1 text-ink-600">/</span>
            <span className={lang === 'en' ? 'text-ember-400' : ''}>EN</span>
          </button>
          <a href={links.cv} target="_blank" rel="noreferrer" className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-ink-100 px-3.5 py-1.5 text-xs font-medium text-ink-950 hover:bg-white transition-colors">
            <Download size={13} /> {c.nav.cv}
          </a>
        </div>
      </nav>
    </header>
  );
}
