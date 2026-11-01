import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { content, type Content, type Lang } from '@/content';

interface Ctx {
  lang: Lang;
  toggle: () => void;
  c: Content;
}

const LangContext = createContext<Ctx | null>(null);
const KEY = 'portfolio-lang';

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const s = localStorage.getItem(KEY);
      if (s === 'pt' || s === 'en') return s;
    } catch { /* storage indisponível */ }
    return navigator.language?.toLowerCase().startsWith('pt') ? 'pt' : 'en';
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    try { localStorage.setItem(KEY, lang); } catch { /* ignore */ }
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, toggle: () => setLang((l) => (l === 'pt' ? 'en' : 'pt')), c: content[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang fora do LangProvider');
  return ctx;
}
