import { Briefcase, ChevronRight } from 'lucide-react';
import Section from './Section';
import Reveal from './Reveal';
import { useLanguage } from '@/i18n/LanguageContext';
import { getData } from '@/data';

export default function Experience() {
  const { t, lang } = useLanguage();
  const { experience } = getData(lang);

  return (
    <Section id="experience" title={t.experience.title} heading={t.experience.heading}>
      <div className="relative">
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent-500/40 via-base-600 to-transparent md:-translate-x-1/2" />

        <div className="space-y-12">
          {experience.map((exp, i) => {
            const isLeft = i % 2 === 0;
            return (
              <Reveal key={exp.id} delay={i * 100}>
                <div className={`relative flex flex-col md:flex-row ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="absolute left-4 md:left-1/2 top-2 -translate-x-1/2 z-10">
                    <div className="w-3 h-3 rounded-full bg-accent-400 ring-4 ring-base-950 animate-pulse-soft" />
                  </div>

                  <div className={`pl-12 md:pl-0 md:w-1/2 ${isLeft ? 'md:pr-12' : 'md:pl-12'}`}>
                    <div className="card card-hover p-6 group">
                      <span className="badge-accent mb-3 inline-block">{exp.period}</span>

                      <h3 className="text-lg font-bold text-white mb-1">{exp.role}</h3>
                      <p className="text-accent-400 text-sm mb-1">{exp.company}</p>
                      {exp.location && (
                        <p className="text-gray-500 text-xs mb-3">{exp.location}</p>
                      )}

                      <p className="text-gray-400 text-sm leading-relaxed mb-4">{exp.description}</p>

                      <ul className="space-y-1.5 mb-4">
                        {exp.responsibilities.map((r, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-gray-400">
                            <ChevronRight size={14} className="text-accent-500 mt-0.5 shrink-0" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap gap-1.5">
                        {exp.technologies.map((tech, j) => (
                          <span key={j} className="badge">{tech}</span>
                        ))}
                      </div>

                      {exp.projects && exp.projects.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-base-700">
                          <p className="text-xs text-gray-500 mb-1">{t.experience.notableProjects}</p>
                          {exp.projects.map((p, j) => (
                            <p key={j} className="text-sm text-gray-400">· {p}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="hidden md:block md:w-1/2" />
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      {experience.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Briefcase size={32} className="mx-auto mb-3 opacity-50" />
          <p>{t.experience.empty}</p>
        </div>
      )}
    </Section>
  );
}
