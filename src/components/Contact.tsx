import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Mail, Linkedin, Github, GraduationCap, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Section from './Section';
import Reveal from './Reveal';
import { useLanguage } from '@/i18n/LanguageContext';
import { getData } from '@/data';

const ICON_MAP: Record<string, typeof Mail> = {
  linkedin: Linkedin,
  github: Github,
  scholar: GraduationCap,
  mail: Mail,
};

type Status = 'idle' | 'loading' | 'success' | 'error';

function AnimatedQuestionMark() {
  const qRef = useRef<HTMLSpanElement>(null);

  // Spin when the section comes into view
  useEffect(() => {
    if (!qRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          gsap.fromTo(
            qRef.current,
            { rotate: 0, scale: 0.7 },
            {
              rotate: 360,
              scale: 1,
              duration: 0.85,
              ease: 'back.out(2)',
              overwrite: 'auto',
            }
          );
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(qRef.current);
    return () => observer.disconnect();
  }, []);

  // Autonomous gentle floating animation
  useGSAP(
    () => {
      if (!qRef.current) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.to(qRef.current, {
          y: -5,
          duration: 1.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      });
      return () => mm.revert();
    },
    { scope: qRef }
  );

  // Interactive spin on hover / click
  const handleInteract = () => {
    if (!qRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.to(qRef.current, {
      rotate: '+=360',
      scale: 1.25,
      duration: 0.65,
      ease: 'back.out(2)',
      overwrite: 'auto',
      onComplete: () => {
        gsap.to(qRef.current, { scale: 1, duration: 0.25, ease: 'power2.out' });
      },
    });
  };

  return (
    <span
      ref={qRef}
      onMouseEnter={handleInteract}
      onClick={handleInteract}
      aria-hidden="true"
      title="Bora conversar?"
      className="inline-block text-accent-400 cursor-pointer ml-1 select-none will-change-transform origin-center hover:text-accent-300 transition-colors"
    >
      ?
    </span>
  );
}

export default function Contact() {
  const { t, lang } = useLanguage();
  const { contact } = getData(lang);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [status, setStatus] = useState<Status>('idle');

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = t.contact.errorName;
    if (!form.email.trim()) {
      e.email = t.contact.errorEmail;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = t.contact.errorEmailInvalid;
    }
    if (!form.message.trim()) e.message = t.contact.errorMessage;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 4000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const inputClass = (field: keyof typeof errors) =>
    `w-full bg-base-800/60 border rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600
     transition-all duration-200 outline-none
     ${errors[field] ? 'border-error-500' : 'border-base-600 focus:border-accent-500/50 focus:ring-1 focus:ring-accent-500/30'}`;

  return (
    <Section
      id="contact"
      title={t.contact.title}
      heading={
        <span className="inline-flex items-baseline">
          <span>{t.contact.heading}</span>
          <AnimatedQuestionMark />
        </span>
      }
    >
      <div className="grid lg:grid-cols-2 gap-8">
        <Reveal>
          <div className="space-y-6">
            <p className="text-gray-400 leading-relaxed">
              {t.contact.intro}
            </p>

            <div className="space-y-3">
              {contact.socials.map((social) => {
                const Icon = ICON_MAP[social.icon] ?? Mail;
                return (
                  <a
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 card card-hover p-4 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-accent-500/10 border border-accent-500/20 flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-accent-400" />
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium group-hover:text-accent-400 transition-colors">
                        {social.label}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{social.url.replace(/^mailto:/, '')}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <form onSubmit={handleSubmit} className="card p-6 space-y-4" noValidate>
            <div>
              <label htmlFor="name" className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">
                {t.contact.name}
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={t.contact.namePlaceholder}
                className={inputClass('name')}
              />
              {errors.name && <p className="text-error-400 text-xs mt-1.5">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">
                {t.contact.email}
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder={t.contact.emailPlaceholder}
                className={inputClass('email')}
              />
              {errors.email && <p className="text-error-400 text-xs mt-1.5">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="message" className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider">
                {t.contact.message}
              </label>
              <textarea
                id="message"
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder={t.contact.messagePlaceholder}
                className={`${inputClass('message')} resize-none`}
              />
              {errors.message && <p className="text-error-400 text-xs mt-1.5">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {t.contact.sending}
                </>
              ) : (
                <>
                  <Send size={16} />
                  {t.contact.send}
                </>
              )}
            </button>

            {status === 'success' && (
              <div className="flex items-center gap-2 text-success-400 text-sm animate-fade-in">
                <CheckCircle2 size={16} />
                {t.contact.success}
              </div>
            )}
            {status === 'error' && (
              <div className="flex items-center gap-2 text-error-400 text-sm animate-fade-in">
                <AlertCircle size={16} />
                {t.contact.error}
              </div>
            )}
          </form>
        </Reveal>
      </div>
    </Section>
  );
}
