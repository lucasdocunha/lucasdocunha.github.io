import { useRef } from 'react';
import {
  Calendar,
  MapPin,
  CheckCircle2,
  ArrowUpRight,
  Briefcase,
  Bot,
  Building2,
  GraduationCap,
  Layers,
  Zap,
  Sparkles,
  Brain,
  Award,
  FileText,
} from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { motion } from 'framer-motion';
import Section from './Section';
import { useLanguage } from '@/i18n/LanguageContext';
import { getData } from '@/data';
import type { ExperienceItem } from '@/types';

gsap.registerPlugin(useGSAP);

interface ExperienceCardProps {
  item: ExperienceItem;
  currentBadgeLabel: string;
}

const achievementIcons = [Layers, Zap, Sparkles, Brain, Award, FileText];

function getRoleIcon(id: string) {
  switch (id) {
    case 'exp-datakie':
      return Bot;
    case 'exp-mbrf':
      return Building2;
    case 'exp-pesquisa':
      return GraduationCap;
    default:
      return Briefcase;
  }
}

function ExperienceCard({ item, currentBadgeLabel }: ExperienceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rotXTo = useRef<gsap.QuickToFunc | null>(null);
  const rotYTo = useRef<gsap.QuickToFunc | null>(null);

  const RoleIcon = getRoleIcon(item.id);

  // Setup GSAP 3D interactive tilt quickTo
  useGSAP(
    () => {
      if (!cardRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      rotXTo.current = gsap.quickTo(cardRef.current, 'rotateX', { duration: 0.35, ease: 'power2.out' });
      rotYTo.current = gsap.quickTo(cardRef.current, 'rotateY', { duration: 0.35, ease: 'power2.out' });
    },
    { scope: cardRef }
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // CSS variables for cursor spotlight gradient
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);

    // Subtle 3D tilt calculation (max 3 degrees)
    if (rotXTo.current && rotYTo.current) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotX = -((y - centerY) / centerY) * 3;
      const rotY = ((x - centerX) / centerX) * 3;
      rotXTo.current(rotX);
      rotYTo.current(rotY);
    }
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    if (rotXTo.current && rotYTo.current) {
      rotXTo.current(0);
      rotYTo.current(0);
    }
  };

  return (
    <div className="relative group [perspective:1200px]">
      {/* Desktop Timeline Node Connector */}
      <div
        aria-hidden="true"
        className="hidden md:flex absolute -left-12 top-6 w-8 h-8 rounded-full bg-base-900 border-2 border-accent-500/40 items-center justify-center shadow-lg shadow-accent-500/10 group-hover:border-accent-400 group-hover:scale-110 group-hover:bg-accent-500/15 transition-all duration-300 z-10"
      >
        <RoleIcon size={14} className="text-accent-400 group-hover:text-accent-300 transition-colors" />
        {item.isCurrent && (
          <span className="absolute -inset-1 rounded-full border border-accent-400/40 animate-ping opacity-60" />
        )}
      </div>

      {/* Main Interactive Card */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative rounded-xl border border-base-750/90 bg-base-900/80 backdrop-blur-sm p-6 md:p-7
                   transition-all duration-300 hover:border-accent-500/40 hover:shadow-xl hover:shadow-accent-500/5
                   overflow-hidden transform-gpu will-change-transform"
        style={{
          transformStyle: 'preserve-3d',
          backgroundImage: `radial-gradient(550px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(132, 168, 110, 0.08), transparent 45%)`,
        }}
      >
        {/* Top Header: Role Icon + Role Name + Company + Period + Status */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-accent-500/10 border border-accent-500/25 flex items-center justify-center shrink-0 group-hover:border-accent-400/50 group-hover:bg-accent-500/15 group-hover:scale-105 transition-all duration-300 shadow-sm shadow-accent-500/10">
              <RoleIcon size={20} className="text-accent-400" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight group-hover:text-accent-300 transition-colors">
                  {item.role}
                </h3>
                {item.isCurrent && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent-500/10 border border-accent-500/30 text-xs font-semibold text-accent-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse-soft" />
                    {currentBadgeLabel}
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-accent-400">{item.company}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-400 shrink-0 sm:self-start">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-base-800/80 border border-base-700/60 font-mono text-gray-300">
              <Calendar size={12} className="text-accent-400" />
              {item.period}
            </span>
            {item.location && (
              <span className="inline-flex items-center gap-1 text-gray-400">
                <MapPin size={12} className="text-gray-500" />
                {item.location}
              </span>
            )}
          </div>
        </div>

        {/* Institutional Context Badge */}
        {item.badge && (
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-base-800/60 border border-base-700/70 text-xs font-medium text-gray-200">
            <CheckCircle2 size={13} className="text-accent-400 shrink-0" />
            <span>{item.badge}</span>
          </div>
        )}

        {/* Executive Summary with subtle accent border */}
        <div className="relative pl-3.5 mb-4 border-l-2 border-accent-500/40">
          <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
        </div>

        {/* Key Deliverables & Responsibilities (Interactive Micro-Cards) */}
        <div className="space-y-2.5 mb-5">
          {item.responsibilities.map((r, i) => {
            const Icon = achievementIcons[i % achievementIcons.length];
            return (
              <motion.div
                key={i}
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="group/item flex items-start gap-3 p-3 rounded-lg bg-base-850/50 border border-base-750/70 hover:border-accent-500/30 hover:bg-base-800/60 transition-all duration-200"
              >
                <div className="w-6 h-6 rounded-md bg-accent-500/10 border border-accent-500/20 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:border-accent-400/40 group-hover/item:bg-accent-500/20 transition-colors">
                  <Icon size={12} className="text-accent-400" />
                </div>
                <span className="text-xs sm:text-sm text-gray-300 leading-relaxed group-hover/item:text-white transition-colors">
                  {r}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Bar: Technologies & External Links */}
        <div className="pt-4 border-t border-base-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {item.technologies.map((tech, j) => (
              <motion.span
                key={j}
                whileHover={{ y: -2, scale: 1.04 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="px-2.5 py-1 rounded-md bg-base-800/70 border border-base-700/60 text-xs text-gray-300 font-mono hover:text-white hover:border-accent-500/40 hover:bg-base-750/80 transition-colors cursor-default"
              >
                {tech}
              </motion.span>
            ))}
          </div>

          {item.links && item.links.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.links.map((link, lIdx) => (
                <motion.a
                  key={lIdx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-secondary text-xs px-3 py-1.5 h-7 gap-1.5 shadow-sm shadow-accent-500/5 hover:border-accent-400"
                >
                  {link.label}
                  <ArrowUpRight size={12} />
                </motion.a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Experience() {
  const { t, lang } = useLanguage();
  const { experience } = getData(lang);
  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP entrance stagger animation for timeline spine and cards
  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (!containerRef.current) return;

      const cards = containerRef.current.querySelectorAll('.experience-card-wrapper');
      const spine = containerRef.current.querySelector('.experience-timeline-spine');

      if (spine) {
        gsap.fromTo(
          spine,
          { scaleY: 0, transformOrigin: 'top center' },
          { scaleY: 1, duration: 0.8, ease: 'power3.out' }
        );
      }

      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.14,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
          }
        );
      }
    },
    { scope: containerRef, dependencies: [lang] }
  );

  return (
    <Section id="experience" title={t.experience.title} heading={t.experience.heading}>
      <div ref={containerRef} className="relative pl-0 md:pl-12">
        {/* Desktop Vertical Timeline Spine */}
        <div
          aria-hidden="true"
          className="experience-timeline-spine hidden md:block absolute left-4 top-4 bottom-4 w-[2px] bg-gradient-to-b from-accent-400 via-accent-500/30 to-base-800 rounded-full"
        />

        <div className="space-y-7">
          {experience.map((item) => (
            <div key={item.id} className="experience-card-wrapper">
              <ExperienceCard
                item={item}
                currentBadgeLabel={t.experience.currentBadge}
              />
            </div>
          ))}
        </div>

        {experience.length === 0 && (
          <div className="text-center py-12 text-gray-500 card p-6">
            <Briefcase size={32} className="mx-auto mb-3 opacity-40" />
            <p>{t.experience.empty}</p>
          </div>
        )}
      </div>
    </Section>
  );
}
