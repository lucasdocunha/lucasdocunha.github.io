import { motion } from 'framer-motion';
import { ArrowUpRight, Github } from 'lucide-react';
import { Reveal, spotlightMove } from '@/lib/motion';
import { useLang } from '@/lib/lang';

export default function Research() {
  const { c } = useLang();
  const r = c.research;
  return (
    <section id="research" className="relative py-28 md:py-36">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">{r.eyebrow}</p>
          <h2 className="h2 mt-4 max-w-2xl">{r.title}</h2>
          <p className="mt-5 max-w-xl text-ink-400 leading-relaxed">{r.intro}</p>
        </Reveal>

        <div className="mt-14 divide-y divide-ink-800 border-y border-ink-800">
          {r.papers.map((p, i) => (
            <motion.article
              key={p.title}
              onMouseMove={spotlightMove}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="spotlight group grid gap-4 rounded-none px-2 py-8 md:grid-cols-12 md:gap-8 md:px-4"
            >
              <div className="md:col-span-3">
                <div className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-ink-100 transition-colors duration-500 group-hover:text-ember-400">
                  {p.venue}
                </div>
                <div className="mt-1 flex items-center gap-2 font-mono text-xs text-ink-400">
                  {p.year}
                  {p.status && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-lilac-400/30 bg-lilac-500/10 px-2 py-0.5 text-lilac-300">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lilac-400" />{p.status}
                    </span>
                  )}
                </div>
              </div>
              <div className="md:col-span-7">
                <h3 className="font-display text-lg md:text-xl font-medium leading-snug text-ink-100">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-400">{p.summary}</p>
              </div>
              <div className="flex items-start gap-2 md:col-span-2 md:justify-end">
                {p.link && (
                  <a href={p.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full border border-ink-700 px-3 py-1.5 text-xs text-ink-300 transition-colors hover:border-ember-400/60 hover:text-white">
                    {r.paper} <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                )}
                {p.code && (
                  <a href={p.code} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full border border-ink-700 px-3 py-1.5 text-xs text-ink-300 transition-colors hover:border-ember-400/60 hover:text-white">
                    <Github size={13} /> {r.code}
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
