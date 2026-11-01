import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { Reveal } from '@/lib/motion';
import { useLang } from '@/lib/lang';

export default function Path() {
  const { c } = useLang();
  const p = c.path;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] });
  const line = useSpring(scrollYProgress, { stiffness: 90, damping: 22 });

  return (
    <section id="path" className="relative py-28 md:py-36">
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <p className="eyebrow">{p.eyebrow}</p>
          <h2 className="h2 mt-4">{p.title}</h2>
          <p className="mt-6 flex items-start gap-2 text-sm leading-relaxed text-ink-400">
            <GraduationCap size={16} className="mt-0.5 shrink-0 text-ember-400" />
            {p.education}
          </p>
        </Reveal>

        <div ref={ref} className="relative lg:col-span-8">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-ink-800" />
          <motion.div style={{ scaleY: line }} className="absolute left-[7px] top-2 bottom-2 w-px origin-top bg-gradient-to-b from-ember-500 via-amber-400 to-lilac-400" />
          <ol className="space-y-12">
            {p.roles.map((r, i) => (
              <motion.li
                key={r.role + r.org}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.8, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="relative pl-10"
              >
                <span className="absolute left-0 top-1.5 grid h-[15px] w-[15px] place-items-center rounded-full border border-ink-600 bg-ink-950">
                  <span className={`h-[7px] w-[7px] rounded-full ${r.current ? 'bg-ember-500' : 'bg-ink-600'}`} />
                  {r.current && <span className="absolute inset-0 animate-ping rounded-full border border-ember-500/50" />}
                </span>
                <div className="font-mono text-xs text-ink-400">{r.period}</div>
                <h3 className="mt-1 font-display text-xl font-semibold text-ink-100">
                  {r.role} <span className="text-ink-400 font-normal">· {r.org}</span>
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-400">{r.line}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
