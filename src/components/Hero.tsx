import { ArrowRight, FileDown, Mail, Linkedin, Github, GraduationCap } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { getData } from '@/data';
import AnimatedName from './AnimatedName';

const ICON_MAP: Record<string, typeof Linkedin> = {
  linkedin: Linkedin,
  github: Github,
  scholar: GraduationCap,
  mail: Mail,
};

export default function Hero() {
  const { t, lang } = useLanguage();
  const { profile } = getData(lang);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden grid-bg"
    >
      <div className="absolute inset-0 glow pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-base-950 pointer-events-none" />

      <div className="absolute top-1/4 right-[10%] w-64 h-64 bg-accent-500/5 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-1/4 left-[5%] w-48 h-48 bg-secondary-500/5 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '2s' }} />

      <div className="section-container relative z-10 pt-20">
        <div className="max-w-3xl">
          <p className="text-accent-500 text-sm mb-4 animate-fade-in-down">
            <span className="inline-block w-2 h-2 rounded-full bg-accent-400 animate-pulse-soft mr-2 align-middle" />
            {profile.location}
          </p>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-4 animate-fade-in-up font-serif">
            {t.hero.greeting}{' '}
            <AnimatedName name={profile.name} />
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
            {profile.headline}
          </p>

          <p className="text-base md:text-lg text-gray-400 leading-relaxed mb-8 max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
            {profile.description}
          </p>

          <div className="flex flex-wrap gap-3 mb-10 animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
            <a href="#projects" className="btn-primary">
              {t.hero.viewWork}
              <ArrowRight size={16} />
            </a>
            <a href={profile.cvUrl} download className="btn-secondary">
              <FileDown size={16} />
              {t.hero.downloadCV}
            </a>
            <a href="#contact" className="btn-secondary">
              <Mail size={16} />
              {t.hero.getInTouch}
            </a>
          </div>

          <div className="flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
            {profile.socials.map((social) => {
              const Icon = ICON_MAP[social.icon] ?? Mail;
              return (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 flex items-center justify-center rounded-lg border border-base-600 text-gray-400
                             hover:border-accent-500/50 hover:text-accent-400 hover:bg-accent-500/5
                             transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block z-20">
        <a
          href="#about"
          aria-label={lang === 'pt' ? 'Rolar para Sobre Mim' : 'Scroll to About'}
          className="group flex flex-col items-center gap-1.5 text-gray-500 hover:text-accent-400 transition-colors"
        >
          <div className="w-6 h-10 rounded-full border-2 border-base-600 group-hover:border-accent-500/60 transition-colors flex justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-accent-400 animate-bounce" />
          </div>
        </a>
      </div>
    </section>
  );
}
