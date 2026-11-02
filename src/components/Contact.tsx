import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, Copy, Check, Download, GraduationCap } from 'lucide-react';
import { Reveal, Magnetic } from '@/lib/motion';
import { useLang } from '@/lib/lang';
import { links } from '@/content';

export default function Contact() {
  const { c } = useLang();
  const k = c.contact;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(links.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { window.location.href = `mailto:${links.email}`; }
  };

  const socials = [
    { href: links.linkedin, label: 'LinkedIn', Icon: Linkedin },
    { href: links.github, label: 'GitHub', Icon: Github },
    { href: links.lattes, label: 'Lattes', Icon: GraduationCap },
    { href: links.cv, label: 'CV', Icon: Download },
  ];

  return (
    <section id="contact" className="relative overflow-hidden py-32 md:py-44">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[420px] bg-[radial-gradient(ellipse_at_bottom,rgba(255,107,61,0.16),transparent_65%)]" />
      <div className="wrap relative text-center">
        <Reveal>
          <p className="eyebrow">{k.eyebrow}</p>
          <h2 className="mt-5 font-display text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-ink-100">
            {k.title.split(' ').map((w, i) => (
              <motion.span
                key={w + i}
                className={`inline-block mr-[0.25em] ${i === k.title.split(' ').length - 1 ? 'text-gradient' : ''}`}
                initial={{ opacity: 0, y: 40, rotate: 4 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                {w}
              </motion.span>
            ))}
          </h2>
          <p className="mx-auto mt-6 max-w-md text-ink-400">{k.text}</p>
        </Reveal>

        <Reveal delay={0.15} className="mt-10 flex flex-col items-center gap-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Magnetic strength={0.25}>
              <a href={`mailto:${links.email}`} className="btn-primary text-base px-6 py-3"><Mail size={17} /> {links.email}</a>
            </Magnetic>
            <button onClick={copy} className="btn-ghost" aria-live="polite">
              {copied ? <Check size={15} className="text-amber-400" /> : <Copy size={15} />} {copied ? k.copied : k.copy}
            </button>
          </div>
          <div className="flex gap-3">
            {socials.map(({ href, label, Icon }) => (
              <Magnetic key={label} strength={0.5}>
                <a href={href} target="_blank" rel="noreferrer" aria-label={label}
                  className="grid h-12 w-12 place-items-center rounded-full border border-ink-700 text-ink-300 transition-colors hover:border-ember-400/60 hover:text-ember-300">
                  <Icon size={18} />
                </a>
              </Magnetic>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
