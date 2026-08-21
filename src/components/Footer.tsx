import { Mail, Linkedin, Github, GraduationCap, ArrowUp } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import { getData } from '@/data';

const ICON_MAP: Record<string, typeof Mail> = {
  linkedin: Linkedin,
  github: Github,
  scholar: GraduationCap,
  mail: Mail,
};

export default function Footer() {
  const { t, lang } = useLanguage();
  const { profile, contact } = getData(lang);

  return (
    <footer className="border-t border-base-700/50 bg-base-950">
      <div className="section-container py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="font-serif text-white font-semibold text-sm">
              {profile.name}
            </p>
            <p className="text-gray-500 text-xs mt-1">{profile.tagline}</p>
          </div>

          <div className="flex items-center gap-3">
            {contact.socials.map((social) => {
              const Icon = ICON_MAP[social.icon] ?? Mail;
              return (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-base-600 text-gray-400
                             hover:border-accent-500/50 hover:text-accent-400 transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              );
            })}
          </div>

          <a
            href="#home"
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-accent-400 transition-colors"
          >
            {t.footer.backToTop}
            <ArrowUp size={14} />
          </a>
        </div>

        <div className="mt-8 pt-6 border-t border-base-800 text-center">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} {profile.name}. {t.footer.builtWith}
          </p>
        </div>
      </div>
    </footer>
  );
}
