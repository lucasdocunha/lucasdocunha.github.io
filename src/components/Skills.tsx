import { Code, Brain, Eye, Cloud, FlaskConical, type LucideIcon } from 'lucide-react';
import Section from './Section';
import Reveal from './Reveal';
import { useLanguage } from '@/i18n/LanguageContext';
import { getData } from '@/data';

const ICON_MAP: Record<string, LucideIcon> = {
  code: Code,
  brain: Brain,
  eye: Eye,
  cloud: Cloud,
  'flask-conical': FlaskConical,
};

export default function Skills() {
  const { t, lang } = useLanguage();
  const { skills } = getData(lang);

  return (
    <Section id="skills" title={t.skills.title} heading={t.skills.heading}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {skills.map((category, i) => {
          const Icon = ICON_MAP[category.icon] ?? Code;
          return (
            <Reveal key={category.name} delay={i * 100}>
              <div className="card card-hover p-5 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-accent-500/10 border border-accent-500/20 flex items-center justify-center">
                    <Icon size={16} className="text-accent-400" />
                  </div>
                  <h3 className="text-white font-semibold text-sm">{category.name}</h3>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {category.skills.map((skill, j) => (
                    <span
                      key={j}
                      className="px-2.5 py-1 rounded-md bg-base-700/50 border border-base-600 text-xs text-gray-400
                                 hover:border-accent-500/30 hover:text-accent-300 hover:bg-accent-500/5
                                 transition-all duration-200 cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
