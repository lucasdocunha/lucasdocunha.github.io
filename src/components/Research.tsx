import { FlaskConical, BookOpen, ArrowUpRight, Sparkles, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import Section from './Section';
import Reveal from './Reveal';
import { useLanguage } from '@/i18n/LanguageContext';
import { getData } from '@/data';

const hover = { whileHover: { y: -4 }, transition: { type: 'spring' as const, stiffness: 300, damping: 20 } };

export default function Research() {
  const { t, lang } = useLanguage();
  const { research } = getData(lang);

  return (
    <Section id="research" title={t.research.title} heading={t.research.heading}>
      {/* Academic trajectory: TCC, AI League, PIBICs, Master's */}
      <div className="flex items-center gap-2 mb-5">
        <GraduationCap size={18} className="text-accent-400" />
        <h3 className="text-sm text-accent-500 uppercase tracking-wider font-medium">{t.research.projects}</h3>
      </div>
      <div className="grid md:grid-cols-2 gap-4 mb-14">
        {research.projects.map((proj, i) => (
          <Reveal key={proj.id} delay={(i % 2) * 100} className={i === 0 ? 'md:col-span-2' : ''}>
            <motion.div {...hover} className="card card-hover p-5 h-full flex flex-col">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {proj.type && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-secondary-500/10 border border-secondary-500/30 text-xs font-semibold text-secondary-400">
                    {proj.type}
                  </span>
                )}
                {proj.status && (
                  <span className={`gap-1.5 ${proj.status === 'Finalizado' || proj.status === 'Completed' ? 'badge text-gray-300 border-base-600' : 'badge-accent'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${proj.status === 'Finalizado' || proj.status === 'Completed' ? 'bg-secondary-400' : 'bg-accent-400 animate-pulse-soft'}`} />
                    {proj.status}
                  </span>
                )}
                <span className="text-gray-500 text-xs ml-auto">{proj.period}</span>
              </div>
              <p className="text-white font-semibold text-base mb-1">{proj.title}</p>
              <p className="text-accent-400 text-xs mb-3">{proj.lab}</p>
              <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1">{proj.description}</p>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {proj.areas.map((area, j) => (
                    <span key={j} className="badge">{area}</span>
                  ))}
                </div>
                {proj.links && proj.links.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {proj.links.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary text-xs px-3 py-1.5"
                      >
                        {link.label}
                        <ArrowUpRight size={13} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Reveal>
          <div className="flex items-center gap-2 mb-5">
            <FlaskConical size={18} className="text-accent-400" />
            <h3 className="text-sm text-accent-500 uppercase tracking-wider font-medium">{t.research.lines}</h3>
          </div>
          <div className="space-y-3">
            {research.lines.map((line, i) => (
              <Reveal key={i} delay={i * 80}>
                <motion.div {...hover} className="card card-hover p-4">
                  <p className="text-white font-medium text-sm mb-1">{line.area}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{line.description}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="flex items-center gap-2 mb-5">
            <BookOpen size={18} className="text-accent-400" />
            <h3 className="text-sm text-accent-500 uppercase tracking-wider font-medium">{t.research.publications}</h3>
          </div>
          <div className="space-y-3">
            {research.publications.map((pub, i) => (
              <Reveal key={i} delay={i * 80}>
                <motion.div {...hover} className="card card-hover p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge-accent">{pub.venue}</span>
                    {pub.status && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-secondary-500/10 border border-secondary-500/30 text-xs font-semibold text-secondary-400">
                        {pub.status}
                      </span>
                    )}
                  </div>
                  <p className="text-white font-medium text-sm mb-1">{pub.title}</p>
                  <p className="text-gray-500 text-xs mb-2">{pub.authors.join(', ')} · {pub.year}</p>
                  {pub.abstract && (
                    <p className="text-gray-400 text-sm leading-relaxed mb-3">{pub.abstract}</p>
                  )}
                  {pub.link && (
                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary text-xs px-3 py-1.5"
                    >
                      {t.research.readPaper}
                      <ArrowUpRight size={13} />
                    </a>
                  )}
                </motion.div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>

      <Reveal delay={300}>
        <div className="mt-8 card p-5 border-accent-500/20">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-accent-400" />
            <p className="text-xs text-accent-500 uppercase tracking-wider font-medium">{t.research.futureInterests}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {research.futureInterests.map((interest, i) => (
              <span key={i} className="badge-accent">{interest}</span>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
