import { useState, useRef } from 'react';
import { Briefcase, ChevronRight, FlaskConical } from 'lucide-react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Section from './Section';
import Reveal from './Reveal';
import { useLanguage } from '@/i18n/LanguageContext';
import { getData } from '@/data';

export default function Experience() {
  const { t, lang } = useLanguage();
  const { experience } = getData(lang);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!beamRef.current) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          beamRef.current,
          { top: '-10%', opacity: 0 },
          {
            top: '100%',
            opacity: 1,
            duration: 4,
            repeat: -1,
            ease: 'power1.inOut',
          }
        );
      });
      return () => mm.revert();
    },
    { scope: trackRef }
  );

  return (
    <Section id="experience" title={t.experience.title} heading={t.experience.heading}>
      <div className="grid sm:grid-cols-2 gap-4 mb-14">
        {[
          { icon: FlaskConical, value: 4, label: t.experience.researchYears, detail: t.experience.researchDetail },
          { icon: Briefcase, value: 2, label: t.experience.workYears, detail: t.experience.workDetail },
        ].map((stat, i) => (
          <Reveal key={i} delay={i * 120}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="card card-hover p-6 flex items-center gap-5 h-full"
            >
              <div className="w-14 h-14 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center shrink-0">
                <stat.icon size={24} className="text-accent-400" />
              </div>
              <div>
                <p className="text-white">
                  <span className="text-4xl font-bold font-serif text-accent-400 mr-2 align-middle">{stat.value}</span>
                  <span className="text-base font-medium align-middle">{stat.label}</span>
                </p>
                <p className="text-gray-500 text-sm mt-1">{stat.detail}</p>
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>

      <div ref={trackRef} className="relative">
        {/* Base Timeline Bar */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-base-800 -translate-x-1/2 overflow-hidden pointer-events-none rounded-full">
          {/* Animated GSAP glowing beam */}
          <div
            ref={beamRef}
            className="absolute left-0 w-full h-32 bg-gradient-to-b from-transparent via-accent-400 to-transparent shadow-[0_0_12px_rgba(132,168,110,0.9)]"
          />
        </div>

        <div className="space-y-12">
          {experience.map((exp, i) => {
            const isLeft = i % 2 === 0;
            const isHovered = hoveredIdx === i;

            return (
              <Reveal key={exp.id} delay={i * 100}>
                <div
                  className={`relative flex flex-col md:flex-row ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {/* Timeline Interactive Node */}
                  <div
                    className={`absolute left-4 md:left-1/2 top-2 -translate-x-1/2 z-10 transition-all duration-300 ${
                      isHovered ? 'scale-125' : 'scale-100'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                        isHovered
                          ? 'bg-accent-300 ring-8 ring-accent-400/40 shadow-[0_0_16px_rgba(132,168,110,0.9)]'
                          : 'bg-accent-400 ring-4 ring-base-950 animate-pulse-soft'
                      }`}
                    />
                  </div>

                  <div className={`pl-12 md:pl-0 md:w-1/2 ${isLeft ? 'md:pr-12' : 'md:pl-12'}`}>
                    <div
                      className={`card p-6 group transition-all duration-300 ${
                        isHovered
                          ? 'border-accent-500/60 bg-base-800/90 shadow-xl shadow-accent-500/10 -translate-y-1'
                          : 'card-hover'
                      }`}
                    >
                      <span className="badge-accent mb-3 inline-block">{exp.period}</span>

                      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-accent-300 transition-colors">
                        {exp.role}
                      </h3>
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
