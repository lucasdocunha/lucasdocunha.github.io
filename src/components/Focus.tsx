import { motion } from 'framer-motion';
import { Eye, ScanText, Brain, Network, Layers, Cpu, type LucideIcon } from 'lucide-react';
import { Reveal, spotlightMove } from '@/lib/motion';
import { useLang } from '@/lib/lang';
import type { FocusArea } from '@/content';

const ICONS: Record<FocusArea['icon'], LucideIcon> = { eye: Eye, scan: ScanText, brain: Brain, network: Network, layers: Layers, cpu: Cpu };

function Card({ area, i }: { area: FocusArea; i: number }) {
  const Icon = ICONS[area.icon];
  return (
    <motion.article
      onMouseMove={spotlightMove}
      initial={{ opacity: 0, y: 40, rotateX: 8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay: (i % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="spotlight group rounded-2xl border border-ink-800 bg-ink-900/60 p-6 md:p-7 [transform-style:preserve-3d]"
    >
      <div className="flex items-start justify-between">
        <span className="grid h-11 w-11 place-items-center rounded-xl border border-ink-700 bg-ink-850 text-ember-400 transition-all duration-500 group-hover:border-ember-500/50 group-hover:bg-ember-500/10 group-hover:rotate-[-6deg] group-hover:scale-110">
          <Icon size={20} strokeWidth={1.7} />
        </span>
        <span className="font-mono text-xs text-ink-600 transition-colors group-hover:text-ember-400">0{i + 1}</span>
      </div>
      <h3 className="mt-6 font-display text-xl font-semibold text-ink-100">{area.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-400">{area.blurb}</p>
      <motion.ul
        className="mt-5 flex flex-wrap gap-1.5"
        initial="hidden" whileInView="show" viewport={{ once: true }}
        variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.3 + (i % 3) * 0.1 } } }}
      >
        {area.topics.map((t) => (
          <motion.li key={t} variants={{ hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1 } }} className="chip group-hover:border-ink-600 group-hover:text-ink-100">
            {t}
          </motion.li>
        ))}
      </motion.ul>
    </motion.article>
  );
}

function Marquee({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items, ...items, ...items];
  return (
    <div className="mask-fade-x overflow-hidden">
      <div className={`flex w-max gap-3 ${reverse ? 'animate-marquee-rev' : 'animate-marquee'} hover:[animation-play-state:paused]`}>
        {doubled.map((t, i) => (
          <span key={i} className="whitespace-nowrap rounded-full border border-ink-800 px-4 py-2 font-mono text-xs text-ink-400 transition-colors hover:border-ember-500/50 hover:text-ember-300">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Focus() {
  const { c } = useLang();
  const f = c.focus;
  const half = Math.ceil(f.marquee.length / 2);
  return (
    <section id="focus" className="relative py-28 md:py-36">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">{f.eyebrow}</p>
          <h2 className="h2 mt-4 max-w-2xl">{f.title}</h2>
          <p className="mt-5 max-w-xl text-ink-400 leading-relaxed">{f.intro}</p>
        </Reveal>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 [perspective:1200px]">
          {f.areas.map((a, i) => <Card key={a.id} area={a} i={i} />)}
        </div>
      </div>
      <div className="mt-16 space-y-3">
        <Marquee items={f.marquee.slice(0, half)} />
        <Marquee items={f.marquee.slice(half)} reverse />
      </div>
    </section>
  );
}
