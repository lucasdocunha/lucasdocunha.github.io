import { FileText, ArrowUpRight } from 'lucide-react';
import Section from './Section';
import Reveal from './Reveal';
import { useLanguage } from '@/i18n/LanguageContext';
import { getData } from '@/data';

export default function Publications() {
  const { t, lang } = useLanguage();
  const { publications } = getData(lang);

  return (
    <Section id="publications" title={t.publications.title} heading={t.publications.heading}>
      <div className="space-y-4">
        {publications.map((pub, i) => (
          <Reveal key={pub.id} delay={i * 100}>
            <article className="card card-hover p-6 group">
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent-500/10 border border-accent-500/20 flex items-center justify-center shrink-0">
                  <FileText size={18} className="text-accent-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="badge-accent">{pub.year}</span>
                    <span className="text-gray-500 text-xs">{pub.venue}</span>
                  </div>

                  <h3 className="text-white font-semibold text-base mb-2 group-hover:text-accent-400 transition-colors">
                    {pub.title}
                  </h3>

                  <p className="text-gray-500 text-sm mb-3">
                    {pub.authors.join(', ')}
                  </p>

                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {pub.abstract}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      {pub.tags.map((tag, j) => (
                        <span key={j} className="badge">{tag}</span>
                      ))}
                    </div>
                    {(pub.link || pub.doi) && (
                      <a
                        href={pub.link || `https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary text-xs"
                      >
                        {t.publications.readPaper}
                        <ArrowUpRight size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {publications.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <FileText size={32} className="mx-auto mb-3 opacity-50" />
          <p>{t.publications.empty}</p>
        </div>
      )}
    </Section>
  );
}
