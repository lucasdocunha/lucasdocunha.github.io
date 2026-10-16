import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react';
import { translations, type Language, type TranslationStrings } from './translations';

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  /** True while the page is fading out before the language actually changes. */
  isSwitching: boolean;
  t: TranslationStrings;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = 'portfolio-lang';
/** Must match the fade-out duration used in App.tsx. */
export const LANG_FADE_MS = 220;

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'pt';
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'en' || stored === 'pt' ? stored : 'pt';
  });
  const [isSwitching, setIsSwitching] = useState(false);
  const timer = useRef<number>();

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Fade out, swap the language, then let App fade back in.
  const setLang = (next: Language) => {
    if (next === lang || isSwitching) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setLangState(next);
      return;
    }
    setIsSwitching(true);
    timer.current = window.setTimeout(() => {
      setLangState(next);
      setIsSwitching(false);
    }, LANG_FADE_MS);
  };
  const toggleLang = () => setLang(lang === 'pt' ? 'en' : 'pt');

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, isSwitching, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
