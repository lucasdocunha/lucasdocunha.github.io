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

  const categories = useMemo(() => {
    const cats = Array.from(new Set(projects.map((p) => p.category)));
    return [t.projects.all, ...cats];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const [filter, setFilter] = useState(t.projects.all);

  const filtered = filter === t.projects.all
    ? projects
    : projects.filter((p) => p.category === filter);

  return (
    <Section id="projects" title={t.projects.title} heading={t.projects.heading}>
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs transition-all duration-200 ${
              filter === cat
                ? 'bg-accent-500 text-base-950 font-medium'
                : 'bg-base-800/60 text-gray-400 border border-base-700 hover:border-accent-500/40 hover:text-white'
            }`}
          >
            {cat}
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

              <span className="badge-accent mb-2 w-fit">{project.category}</span>

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
