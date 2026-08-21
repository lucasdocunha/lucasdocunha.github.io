import { FileDown, FileText, Briefcase, GraduationCap, Award, Code } from 'lucide-react';
import Section from './Section';
import Reveal from './Reveal';
import { useLanguage } from '@/i18n/LanguageContext';
import { getData } from '@/data';

export default function Resume() {
  const { t, lang } = useLanguage();
  const { profile, experience, education, publications, skills } = getData(lang);

  const stats = [
    { icon: Briefcase, label: t.resume.experience, value: experience.length, suffix: t.resume.roles },
    { icon: GraduationCap, label: t.resume.education, value: education.length, suffix: t.resume.degrees },
    { icon: Award, label: t.resume.publications, value: publications.length, suffix: t.resume.papers },
    { icon: Code, label: t.resume.skills, value: skills.reduce((sum, c) => sum + c.skills.length, 0), suffix: t.resume.tools },
  ];

  return (
    <Section id="resume" title={t.resume.title} heading={t.resume.heading}>
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <Reveal>
          <div className="card p-6 border-accent-500/20 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center mb-4">
              <FileText size={28} className="text-accent-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">{t.resume.download}</h3>
            <p className="text-gray-500 text-sm mb-5">
              {t.resume.downloadDescription}
            </p>
            <a href={profile.cvUrl} download className="btn-primary w-full justify-center">
              <FileDown size={16} />
              {t.nav.downloadCV} (PDF)
            </a>
            <p className="text-xs text-gray-600 mt-3">
              {t.resume.generatedFrom}
            </p>
          </div>
        </Reveal>

        <Reveal delay={150} className="lg:col-span-2">
          <div className="card p-6">
            <h3 className="text-sm text-accent-500 uppercase tracking-wider mb-5 font-medium">
              {t.resume.atAGlance}
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <Reveal key={i} delay={i * 80}>
                    <div className="text-center p-4 rounded-lg bg-base-800/40 border border-base-700">
                      <Icon size={20} className="text-accent-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            <div className="space-y-3 pt-4 border-t border-base-700">
              <h4 className="text-sm text-gray-400 font-medium">{t.resume.recentRoles}</h4>
              {experience.slice(0, 2).map((exp, i) => (
                <Reveal key={exp.id} delay={i * 80}>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-400 mt-2 shrink-0" />
                    <div>
                      <p className="text-sm text-white font-medium">{exp.role}</p>
                      <p className="text-xs text-gray-500">{exp.company} · {exp.period}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
