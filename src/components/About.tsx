import { GraduationCap, FlaskConical, BrainCircuit, Briefcase, Target, Lightbulb, Eye } from 'lucide-react';
import Section from './Section';
import Reveal from './Reveal';
import { useLanguage } from '@/i18n/LanguageContext';
import { getData } from '@/data';

const ICON_MAP: Record<string, typeof GraduationCap> = {
  'graduation-cap': GraduationCap,
  'flask-conical': FlaskConical,
  'brain-circuit': BrainCircuit,
  'briefcase': Briefcase,
  'eye': Eye,
};

export default function About() {
  const { t, lang } = useLanguage();
  const { about, education } = getData(lang);

  return (
    <Section id="about" title={t.about.title} heading={t.about.heading}>
      <div className="grid lg:grid-cols-3 gap-8">
        <Reveal className="lg:col-span-2">
          <p className="text-gray-400 leading-relaxed text-lg mb-6">{about.summary}</p>

          <div className="mt-8 space-y-4">
            <h3 className="text-sm text-accent-500 uppercase tracking-wider mb-3 font-medium">
              {t.about.education}
            </h3>
            {education.map((edu, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="card card-hover p-4">
                  <div className="flex items-start gap-3">
                    <GraduationCap size={18} className="text-accent-400 mt-1 shrink-0" />
                    <div>
                      <p className="text-white font-medium text-sm">{edu.degree}</p>
                      <p className="text-gray-500 text-sm">{edu.institution} · {edu.period}</p>
                      {edu.description && (
                        <p className="text-gray-400 text-sm mt-1">{edu.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>

        <Reveal delay={150} className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {about.highlights.map((h, i) => {
              const Icon = ICON_MAP[h.icon] ?? Briefcase;
              return (
                <Reveal key={i} delay={i * 80}>
                  <div className="card card-hover p-4 h-full">
                    <Icon size={20} className="text-accent-400 mb-3" />
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      {h.label}
                    </p>
                    <p className="text-sm text-white font-medium leading-snug">{h.value}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={300}>
            <div className="card p-4 border-accent-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Target size={16} className="text-accent-400" />
                <p className="text-xs text-accent-500 uppercase tracking-wider font-medium">{t.about.objectives}</p>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">{about.goals}</p>
            </div>
          </Reveal>

          <Reveal delay={400}>
            <div className="card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={16} className="text-accent-400" />
                <p className="text-xs text-accent-500 uppercase tracking-wider font-medium">{t.about.interests}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {about.interests.map((interest, i) => (
                  <span key={i} className="badge-accent">{interest}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </Reveal>
      </div>
    </Section>
  );
}
