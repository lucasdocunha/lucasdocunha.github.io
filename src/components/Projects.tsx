import { useState, useMemo } from 'react';
import { Github, ExternalLink, FolderGit2, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import Section from './Section';
import Reveal from './Reveal';
import { useLanguage } from '@/i18n/LanguageContext';
import { getData } from '@/data';

export default function Projects() {
  const { t, lang } = useLanguage();
  const { projects } = getData(lang);

  const categoryFilters = useMemo(() => [
    { key: 'all', label: t.projects.all },
    { key: 'cv', label: lang === 'pt' ? 'Visão Computacional' : 'Computer Vision' },
    { key: 'ml', label: 'Machine Learning' },
    { key: 'research', label: lang === 'pt' ? 'Pesquisa' : 'Research' },
  ], [lang, t.projects.all]);

  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return projects;

    const targetTag =
      activeCategory === 'cv'
        ? (lang === 'pt' ? 'Visão Computacional' : 'Computer Vision')
        : activeCategory === 'ml'
        ? 'Machine Learning'
        : (lang === 'pt' ? 'Pesquisa' : 'Research');

    return projects.filter((p) => {
      const matchCategory = p.category === targetTag;
      const matchTag = p.tags && p.tags.includes(targetTag);
      return matchCategory || matchTag;
    });
  }, [projects, activeCategory, lang]);

  const handleTagClick = (tag: string) => {
    if (tag === 'Visão Computacional' || tag === 'Computer Vision') {
      setActiveCategory('cv');
    } else if (tag === 'Pesquisa' || tag === 'Research') {
      setActiveCategory('research');
    } else if (tag === 'Machine Learning') {
      setActiveCategory('ml');
    }
  };

  return (
    <Section id="projects" title={t.projects.title} heading={t.projects.heading}>
      <div className="flex flex-wrap gap-2 mb-8">
        {categoryFilters.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-3.5 py-1.5 rounded-lg text-xs transition-all duration-200 ${
              activeCategory === cat.key
                ? 'bg-accent-500 text-base-950 font-medium shadow-md shadow-accent-500/20'
                : 'bg-base-800/60 text-gray-400 border border-base-700 hover:border-accent-500/40 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((project, i) => (
          <Reveal key={project.id} delay={i * 80}>
            <motion.article
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="card card-hover p-5 h-full flex flex-col group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-accent-500/10 border border-accent-500/20 flex items-center justify-center">
                  <FolderGit2 size={18} className="text-accent-400" />
                </div>
                <div className="flex gap-2">
                  {project.paper && (
                    <a
                      href={project.paper}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t.projects.paper}
                      title={t.projects.paper}
                      className="text-gray-500 hover:text-accent-400 transition-colors"
                    >
                      <FileText size={18} />
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub repository"
                      className="text-gray-500 hover:text-accent-400 transition-colors"
                    >
                      <Github size={18} />
                    </a>
                  )}
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Live demo"
                      className="text-gray-500 hover:text-accent-400 transition-colors"
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {(project.tags || [project.category]).map((tag) => {
                  const isFilterable =
                    tag === 'Visão Computacional' ||
                    tag === 'Computer Vision' ||
                    tag === 'Pesquisa' ||
                    tag === 'Research' ||
                    tag === 'Machine Learning';

                  const isActive =
                    (activeCategory === 'cv' && (tag === 'Visão Computacional' || tag === 'Computer Vision')) ||
                    (activeCategory === 'research' && (tag === 'Pesquisa' || tag === 'Research')) ||
                    (activeCategory === 'ml' && tag === 'Machine Learning');

                  return (
                    <button
                      key={tag}
                      type="button"
                      disabled={!isFilterable}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isFilterable) handleTagClick(tag);
                      }}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border transition-all ${
                        isActive
                          ? 'bg-accent-500/25 border-accent-400 text-accent-300 shadow-sm shadow-accent-500/10'
                          : isFilterable
                          ? 'bg-accent-500/10 border-accent-500/20 text-accent-400 hover:border-accent-500/40 hover:bg-accent-500/15 cursor-pointer'
                          : 'bg-base-800/80 border-base-700 text-gray-300 cursor-default'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>

              <h3 className="text-white font-semibold text-base mb-2 group-hover:text-accent-400 transition-colors">
                {project.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-auto">
                {project.technologies.map((tech, j) => (
                  <span key={j} className="badge">{tech}</span>
                ))}
              </div>
            </motion.article>
          </Reveal>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <FolderGit2 size={32} className="mx-auto mb-3 opacity-50" />
          <p>{t.projects.empty}</p>
        </div>
      )}
    </Section>
  );
}
