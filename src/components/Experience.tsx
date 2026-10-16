import { useState, useRef, useEffect } from 'react';
import {
  Briefcase,
  FlaskConical,
  Sparkles,
  Layers,
  Cpu,
  Bot,
  Eye,
  Zap,
  Brain,
  ArrowUpRight,
  MapPin,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Section from './Section';
import Reveal from './Reveal';
import { useLanguage } from '@/i18n/LanguageContext';
import { getData } from '@/data';
import type { ExperienceItem } from '@/types';

gsap.registerPlugin(useGSAP);

const PILLAR_ICONS: Record<string, typeof Brain> = {
  brain: Brain,
  layers: Layers,
  cpu: Cpu,
  bot: Bot,
  eye: Eye,
  sparkles: Sparkles,
  zap: Zap,
};

type TrackFilter = 'corporate' | 'research' | 'all';

interface ExperienceCardProps {
  item: ExperienceItem;
  index: number;
  currentBadgeLabel: string;
  pillarsTitle: string;
}

function ExperienceCard({ item, index, currentBadgeLabel, pillarsTitle }: ExperienceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // GSAP smooth spotlight tracking on mouse move
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
      className="relative rounded-2xl border border-base-700/80 bg-base-900/90 backdrop-blur-md p-6 md:p-8
                 transition-all duration-300 hover:border-accent-500/50 hover:shadow-2xl hover:shadow-accent-500/10
                 group overflow-hidden"
      style={{
        backgroundImage: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(132, 168, 110, 0.08), transparent 45%)`,
      }}
    >
      {/* Subtle border spotlight sheen */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(132, 168, 110, 0.3), transparent 45%)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1px',
        }}
      />

      <div className="grid lg:grid-cols-12 gap-8 relative z-10">
        {/* Left Column: Organization, Role, Period & Impact Metrics (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-base-800 pb-6 lg:pb-0 lg:pr-8">
          <div>
            {/* Top row: Track pill + Period / Current status badge */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
                  item.track === 'research'
                    ? 'bg-secondary-500/15 border border-secondary-500/30 text-secondary-400'
                    : 'bg-accent-500/15 border border-accent-500/30 text-accent-400'
                }`}
              >
                {item.track === 'research' ? (
                  <>
                    <FlaskConical size={12} />
                    Pesquisa & P&D
                  </>
                ) : (
                  <>
                    <Briefcase size={12} />
                    Atuação Corporativa
                  </>
                )}
              </span>

              {item.isCurrent ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent-500/10 border border-accent-500/30 text-xs font-semibold text-accent-300">
                  <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse-soft" />
                  {currentBadgeLabel}
                </span>
              ) : null}
            </div>

            {/* Role & Company Heading */}
            <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight group-hover:text-accent-300 transition-colors">
              {item.role}
            </h3>
            <p className="text-base text-accent-400 font-medium mt-1">{item.company}</p>

            {/* Period & Location Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mt-2.5">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} className="text-gray-500" />
                {item.period}
              </span>
              {item.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-gray-500" />
                  {item.location}
                </span>
              )}
            </div>

            {/* Institutional Badge / Strategic Partner */}
            {item.badge && (
              <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-base-800/80 border border-base-700/80 text-xs font-medium text-gray-300 shadow-sm">
                <CheckCircle2 size={13} className="text-accent-400 shrink-0" />
                <span>{item.badge}</span>
              </div>
            )}
          </div>

          {/* Key Impact Metrics Grid */}
          {item.metrics && item.metrics.length > 0 && (
            <div className="mt-6 pt-6 border-t border-base-800/80">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
                <Sparkles size={13} className="text-accent-400" />
                Métricas & Impacto Concreto
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2.5">
                {item.metrics.map((metric, mIdx) => (
                  <div
                    key={mIdx}
                    className="p-3 rounded-xl bg-base-850/80 border border-base-750/70 hover:border-accent-500/30 transition-colors"
                  >
                    <p className="text-xl md:text-2xl font-bold text-accent-300 font-serif leading-none">
                      {metric.value}
                    </p>
                    <p className="text-xs font-semibold text-white mt-1 leading-tight">{metric.label}</p>
                    {metric.detail && (
                      <p className="text-[11px] text-gray-400 mt-0.5 leading-snug line-clamp-2">{metric.detail}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Executive Scope, Architectural Pillars & Tech Stack (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          {/* Executive Summary */}
          <div>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">{item.description}</p>
          </div>

          {/* Structured Architectural Pillars with Icons */}
          {item.pillars && item.pillars.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <Layers size={13} className="text-accent-400" />
                {pillarsTitle}
              </p>
              <div className="grid gap-2.5">
                {item.pillars.map((pillar, pIdx) => {
                  const Icon = (pillar.icon && PILLAR_ICONS[pillar.icon]) || Cpu;
                  return (
                    <div
                      key={pIdx}
                      className="p-3.5 rounded-xl bg-base-850/60 border border-base-750/60 hover:bg-base-800/80 hover:border-accent-500/30 transition-all duration-200 flex items-start gap-3.5 group/pillar"
                    >
                      <div className="w-8 h-8 rounded-lg bg-accent-500/10 border border-accent-500/20 flex items-center justify-center shrink-0 mt-0.5 group-hover/pillar:bg-accent-500/20 transition-colors">
                        <Icon size={16} className="text-accent-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white group-hover/pillar:text-accent-300 transition-colors">
                          {pillar.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{pillar.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notable Projects Chips */}
          {item.projects && item.projects.length > 0 && (
            <div className="pt-2">
              <p className="text-xs font-medium text-gray-400 mb-2">Entregas de Destaque:</p>
              <div className="flex flex-wrap gap-2">
                {item.projects.map((proj, pIdx) => (
                  <span
                    key={pIdx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-base-800 border border-base-700 text-xs text-gray-300 font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-400" />
                    {proj}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Bar: Tech Stack Badges & External Links */}
          <div className="pt-4 border-t border-base-800/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-1.5">
              {item.technologies.map((tech, tIdx) => (
                <span
                  key={tIdx}
                  className="px-2.5 py-1 rounded-md bg-base-800/80 border border-base-700/60 text-xs text-gray-300 font-mono hover:text-white hover:border-accent-500/40 transition-colors"
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
                    className="btn-secondary text-xs px-3 py-1.5 h-8 gap-1.5"
                  >
                    {link.label}
                    <ArrowUpRight size={13} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
  const { t, lang } = useLanguage();
  const { experience } = getData(lang);
  const [activeTrack, setActiveTrack] = useState<TrackFilter>('corporate');
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  // Filter items according to active dual-track tab
  const filteredExperience = experience.filter((item) => {
    if (activeTrack === 'all') return true;
    return item.track === activeTrack;
  });

  // GSAP animation on track switch: smooth entrance of new cards
  useEffect(() => {
    if (!cardsContainerRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cards = cardsContainerRef.current.querySelectorAll('.experience-card-item');

    gsap.fromTo(
      cards,
      { opacity: 0, y: 24, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.45,
        stagger: 0.08,
        ease: 'power2.out',
        overwrite: 'auto',
      }
    );
  }, [activeTrack, lang]);

  return (
    <Section id="experience" title={t.experience.title} heading={t.experience.heading}>
      {/* Top Summary Stats Cards */}
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {[
          {
            icon: Briefcase,
            value: 2,
            label: t.experience.workYears,
            detail: t.experience.workDetail,
            trackTarget: 'corporate' as TrackFilter,
          },
          {
            icon: FlaskConical,
            value: 4,
            label: t.experience.researchYears,
            detail: t.experience.researchDetail,
            trackTarget: 'research' as TrackFilter,
          },
        ].map((stat, i) => (
          <Reveal key={i} delay={i * 120}>
            <button
              type="button"
              onClick={() => setActiveTrack(stat.trackTarget)}
              className={`w-full text-left card p-6 flex items-center gap-5 transition-all duration-300 ${
                activeTrack === stat.trackTarget
                  ? 'border-accent-500/60 bg-base-800/90 shadow-lg shadow-accent-500/10'
                  : 'card-hover'
              }`}
            >
              <div className="w-14 h-14 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center shrink-0">
                <stat.icon size={24} className="text-accent-400" />
              </div>
              <div>
                <p className="text-white">
                  <span className="text-4xl font-bold font-serif text-accent-400 mr-2 align-middle">{stat.value}</span>
                  <span className="text-base font-medium align-middle">{stat.label}</span>
                </p>
                <p className="text-gray-400 text-sm mt-1">{stat.detail}</p>
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      {/* Dual-Track Segmented Controller */}
      <Reveal delay={150}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="inline-flex p-1.5 rounded-xl bg-base-900 border border-base-800 shadow-inner">
            {[
              { id: 'corporate', label: t.experience.tabCorporate, icon: Briefcase },
              { id: 'research', label: t.experience.tabResearch, icon: FlaskConical },
              { id: 'all', label: t.experience.tabAll, icon: Layers },
            ].map((tab) => {
              const isActive = activeTrack === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTrack(tab.id as TrackFilter)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 select-none ${
                    isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTrackPill"
                      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                      className="absolute inset-0 rounded-lg bg-accent-500/20 border border-accent-500/50 shadow-sm"
                    />
                  )}
                  <Icon size={14} className={isActive ? 'text-accent-400 relative z-10' : 'text-gray-500 relative z-10'} />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <p className="text-xs text-gray-500 font-medium">
            Exibindo <span className="text-accent-400 font-bold">{filteredExperience.length}</span> marco(s) de carreira
          </p>
        </div>
      </Reveal>

      {/* Full-Width Bento Cards Container */}
      <div ref={cardsContainerRef} className="space-y-6">
        {filteredExperience.map((item, idx) => (
          <div key={item.id} className="experience-card-item">
            <ExperienceCard
              item={item}
              index={idx}
              currentBadgeLabel={t.experience.currentBadge}
              pillarsTitle={t.experience.pillarsTitle}
            />
          </div>
        ))}
      </div>

      {filteredExperience.length === 0 && (
        <div className="text-center py-16 text-gray-500 card p-8">
          <Briefcase size={36} className="mx-auto mb-3 opacity-40" />
          <p>{t.experience.empty}</p>
        </div>
      )}
    </Section>
  );
}
