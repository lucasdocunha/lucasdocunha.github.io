import { useRef } from 'react';
import {
  Calendar,
  MapPin,
  CheckCircle2,
  ChevronRight,
  ArrowUpRight,
  Briefcase,
} from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Section from './Section';
import Reveal from './Reveal';
import { useLanguage } from '@/i18n/LanguageContext';
import { getData } from '@/data';
import type { ExperienceItem } from '@/types';

gsap.registerPlugin(useGSAP);

interface ExperienceCardProps {
  item: ExperienceItem;
  currentBadgeLabel: string;
}

function ExperienceCard({ item, currentBadgeLabel }: ExperienceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Subtle GSAP spotlight tracking following mouse coordinates
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="relative rounded-xl border border-base-750/90 bg-base-900/80 backdrop-blur-sm p-6 md:p-7
                 transition-all duration-300 hover:border-accent-500/40 hover:shadow-xl hover:shadow-accent-500/5
                 group overflow-hidden"
      style={{
        backgroundImage: `radial-gradient(500px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(132, 168, 110, 0.07), transparent 45%)`,
      }}
    >
      {/* Top Header: Role, Company & Status / Period */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight group-hover:text-accent-300 transition-colors">
              {item.role}
            </h3>
            {item.isCurrent && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent-500/10 border border-accent-500/30 text-xs font-semibold text-accent-300">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse-soft" />
                {currentBadgeLabel}
              </span>
            )}
          </div>
          <p className="text-base text-accent-400 font-medium">{item.company}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-base-800/80 border border-base-700/60 font-mono">
            <Calendar size={13} className="text-accent-400" />
            {item.period}
          </span>
          {item.location && (
            <span className="inline-flex items-center gap-1.5 text-gray-400">
              <MapPin size={13} className="text-gray-500" />
              {item.location}
            </span>
          )}
        </div>
      </div>

      {/* Institutional Context Badge */}
      {item.badge && (
        <div className="mb-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-base-800/60 border border-base-700/60 text-xs text-gray-300">
          <CheckCircle2 size={13} className="text-accent-400 shrink-0" />
          <span>{item.badge}</span>
        </div>
      )}

      {/* Description */}
      <p className="text-gray-300 text-sm leading-relaxed mb-4">{item.description}</p>

      {/* Bullet Points / Key Achievements */}
      <ul className="space-y-2 mb-5">
        {item.responsibilities.map((r, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-gray-400 leading-relaxed">
            <ChevronRight size={14} className="text-accent-500 mt-1 shrink-0" />
            <span>{r}</span>
          </li>
        ))}
      </ul>

      {/* Bottom Bar: Technologies & External Links */}
      <div className="pt-4 border-t border-base-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {item.technologies.map((tech, j) => (
            <span
              key={j}
              className="px-2.5 py-1 rounded-md bg-base-800/70 border border-base-700/60 text-xs text-gray-300 font-mono hover:text-white hover:border-accent-500/40 transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>

        {item.links && item.links.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.links.map((link, lIdx) => (
              <a
                key={lIdx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-xs px-3 py-1.5 h-7 gap-1.5"
              >
                {link.label}
                <ArrowUpRight size={12} />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Experience() {
  const { t, lang } = useLanguage();
  const { experience } = getData(lang);

  return (
    <Section id="experience" title={t.experience.title} heading={t.experience.heading}>
      <div className="space-y-6">
        {experience.map((item, idx) => (
          <Reveal key={item.id} delay={idx * 100}>
            <ExperienceCard
              item={item}
              currentBadgeLabel={t.experience.currentBadge}
            />
          </Reveal>
        ))}
      </div>

      {experience.length === 0 && (
        <div className="text-center py-12 text-gray-500 card p-6">
          <Briefcase size={32} className="mx-auto mb-3 opacity-40" />
          <p>{t.experience.empty}</p>
        </div>
      )}
    </Section>
  );
}
