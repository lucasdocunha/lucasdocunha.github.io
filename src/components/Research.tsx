import { FlaskConical, BookOpen, ArrowUpRight, Sparkles } from 'lucide-react';
import Section from './Section';
import Reveal from './Reveal';
import { useLanguage } from '@/i18n/LanguageContext';
import { getData } from '@/data';

export default function Research() {
  const { t, lang } = useLanguage();
  const { research } = getData(lang);

  return (
    <Section id="research" title={t.research.title} heading={t.research.heading}>
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        <Reveal>
          <div className="flex items-center gap-2 mb-5">
            <FlaskConical size={18} className="text-accent-400" />
            <h3 className="text-sm text-accent-500 uppercase tracking-wider font-medium">{t.research.lines}</h3>
          </div>
          <div className="space-y-3">
            {research.lines.map((line, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="card card-hover p-4">
                  <p className="text-white font-medium text-sm mb-1">{line.area}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{line.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="flex items-center gap-2 mb-5">
            <BookOpen size={18} className="text-accent-400" />
            <h3 className="text-sm text-accent-500 uppercase tracking-wider font-medium">{t.research.projects}</h3>
          </div>
          <div className="space-y-3">
            {research.projects.map((proj, i) => (
              <Reveal key={proj.id} delay={i * 80}>
                <div className="card card-hover p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-white font-medium text-sm">{proj.title}</p>
                    <span className="badge-accent shrink-0">{proj.period}</span>
                  </div>
                  <p className="text-accent-400 text-xs mb-2">{proj.lab}</p>
                  <p className="text-gray-400 text-sm leading-relaxed mb-3">{proj.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {proj.areas.map((area, j) => (
                      <span key={j} className="badge">{area}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>

      <Reveal delay={200}>
        <div className="flex items-center gap-2 mb-5">
          <BookOpen size={18} className="text-accent-400" />
          <h3 className="text-sm text-accent-500 uppercase tracking-wider font-medium">{t.research.publications}</h3>
        </div>
        <div className="space-y-3">
          {research.publications.map((pub, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="card card-hover p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm mb-1">{pub.title}</p>
                    <p className="text-gray-500 text-xs mb-2">
                      {pub.authors.join(', ')} · {pub.venue} · {pub.year}
                    </p>
                    {pub.abstract && (
                      <p className="text-gray-400 text-sm leading-relaxed">{pub.abstract}</p>
                    )}
                  </div>
                  {pub.link && (
                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary text-xs shrink-0"
                    >
                      {t.research.readPaper}
                      <ArrowUpRight size={14} />
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Reveal>

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
