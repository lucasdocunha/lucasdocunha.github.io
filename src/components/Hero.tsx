import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Download, MapPin } from 'lucide-react';
import ConvCanvas from './ConvCanvas';
import { Scramble, Magnetic } from '@/lib/motion';
import { useLang } from '@/lib/lang';
import { links } from '@/content';

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const { c, lang } = useLang();
  const h = c.hero;
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 120]);
  const fade = useTransform(scrollY, [0, 500], [1, 0]);
  // modo desenho: a grade sobe acima dos textos e recebe o mouse
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    if (!drawing) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setDrawing(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawing]);

  return (
    <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* brilho de fundo */}
      <div className="pointer-events-none absolute -top-40 right-[-10%] h-[620px] w-[620px] rounded-full bg-ember-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-20%] left-[-10%] h-[520px] w-[520px] rounded-full bg-lilac-500/10 blur-[120px]" />

      <motion.div
        style={{ opacity: drawing ? 1 : fade }}
        className={`absolute inset-0 ${drawing ? 'z-20 pointer-events-auto' : ''}`}
      >
        <ConvCanvas
          interactive={drawing}
          onClose={() => setDrawing(false)}
          className={`h-full w-full ${drawing ? 'cursor-crosshair' : 'opacity-40 md:opacity-100'}`}
        />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/70 to-transparent md:via-ink-950/40" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950 to-transparent" />

      <motion.div style={{ y }} className="wrap relative z-10 w-full pt-24 pb-16" key={lang}>
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-ink-700 bg-ink-900/70 px-3 py-1 backdrop-blur"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-ember-500" />
          </span>
          <span className="font-mono text-[11px] tracking-wider text-ink-300">{h.kicker}</span>
        </motion.div>

        <h1 className="font-display text-ink-100 tracking-tight">
          <span className="block text-lg md:text-xl font-medium text-ink-400 mb-3">
            <Scramble text={h.name} delay={150} />
          </span>
          <span className="block text-[2.6rem] leading-[1.02] sm:text-6xl md:text-7xl lg:text-[4.75rem] font-semibold max-w-5xl">
            {h.headline.map((line, i) => (
              <span key={i} className="block overflow-hidden pb-1">
                <motion.span
                  className={`block ${i === 1 ? 'text-gradient' : ''}`}
                  initial={{ y: '110%' }} animate={{ y: 0 }}
                  transition={{ duration: 1, delay: 0.25 + i * 0.12, ease }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7, ease }}
          className="mt-7 max-w-xl text-base md:text-lg leading-relaxed text-ink-300"
        >
          {h.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.85, ease }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <Magnetic><a href="#focus" className="btn-primary">{h.ctaPrimary} <ArrowDown size={15} /></a></Magnetic>
          <Magnetic><a href={links.cv} target="_blank" rel="noreferrer" className="btn-ghost"><Download size={15} /> {h.ctaSecondary}</a></Magnetic>
          <Magnetic><button type="button" onClick={() => setDrawing(true)} className="btn-ghost">{lang === 'pt' ? 'Desenhar' : 'Draw'}</button></Magnetic>
          <span className="ml-1 inline-flex items-center gap-1.5 text-sm text-ink-400"><MapPin size={14} /> {h.location}</span>
        </motion.div>

        <motion.dl
          initial="hidden" animate="show"
          variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 1.05 } } }}
          className="mt-14 grid max-w-xl grid-cols-3 gap-4 border-t border-ink-800 pt-6"
        >
          {h.stats.map((s) => (
            <motion.div key={s.label} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }}>
              <dt className="font-display text-xl md:text-2xl font-semibold text-ink-100">{s.value}</dt>
              <dd className="mt-1 font-mono text-[11px] uppercase tracking-wider text-ink-400">{s.label}</dd>
            </motion.div>
          ))}
        </motion.dl>
      </motion.div>
    </section>
  );
}
