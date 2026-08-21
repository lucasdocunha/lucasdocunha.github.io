import { useEffect, useState } from 'react';
import { Menu, X, FileDown, Languages } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { getData } from '@/data';

export default function Navbar() {
  const { t, lang, toggleLang } = useLanguage();
  const { profile } = getData(lang);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('#home');

  const NAV_ITEMS = [
    { label: t.nav.home, href: '#home' },
    { label: t.nav.about, href: '#about' },
    { label: t.nav.experience, href: '#experience' },
    { label: t.nav.research, href: '#research' },
    { label: t.nav.projects, href: '#projects' },
    { label: t.nav.publications, href: '#publications' },
    { label: t.nav.skills, href: '#skills' },
    { label: t.nav.contact, href: '#contact' },
  ];

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const sections = NAV_ITEMS.map((n) => n.href.slice(1));
      const current = sections.find((id) => {
        const el = document.getElementById(id);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= 120 && rect.bottom >= 120;
      });
      if (current) setActive(`#${current}`);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-base-950/85 backdrop-blur-md border-b border-base-700/50'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        {/* Logo — simple initials, no code brackets */}
        <a href="#home" className="font-serif font-semibold text-white text-lg tracking-tight">
          {profile.name.replace(/\[.*?\]/g, '').trim() || 'Portfolio'}
        </a>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-7">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`nav-link ${active === item.href ? 'text-accent-400' : ''}`}
            >
              {item.label}
            </a>
          ))}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-accent-400 transition-colors px-2 py-1"
            aria-label="Toggle language"
          >
            <Languages size={15} />
            {t.langToggle.label}
          </button>
          <a href={profile.cvUrl} download className="btn-primary text-xs ml-2">
            <FileDown size={14} />
            {t.nav.downloadCV}
          </a>
        </div>

        {/* Mobile toggle */}
        <div className="lg:hidden flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-accent-400 transition-colors"
            aria-label="Toggle language"
          >
            <Languages size={15} />
            {t.langToggle.label}
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="text-gray-300 hover:text-white p-2"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          open ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        } bg-base-900/95 backdrop-blur-md border-b border-base-700/50`}
      >
        <div className="px-6 py-6 flex flex-col gap-4">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`text-sm font-medium transition-colors ${
                active === item.href ? 'text-accent-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              {item.label}
            </a>
          ))}
          <a
            href={profile.cvUrl}
            download
            onClick={() => setOpen(false)}
            className="btn-primary mt-2 w-fit"
          >
            <FileDown size={14} />
            {t.nav.downloadCV}
          </a>
        </div>
      </div>
    </header>
  );
}
