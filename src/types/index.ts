export interface SocialLink {
  label: string;
  url: string;
  icon: string;
}

export interface Profile {
  name: string;
  headline: string;
  tagline: string;
  description: string;
  location: string;
  email: string;
  cvUrl: string;
  socials: SocialLink[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  description?: string;
}

export interface AboutHighlight {
  label: string;
  value: string;
  icon: string;
}

export interface About {
  summary: string;
  highlights: AboutHighlight[];
  interests: string[];
  goals: string;
}

export interface ExperienceMetric {
  value: string;
  label: string;
  detail?: string;
}

export interface ExperiencePillar {
  title: string;
  description: string;
  icon?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  isCurrent?: boolean;
  location?: string;
  badge?: string;
  track?: 'corporate' | 'research';
  description: string;
  metrics?: ExperienceMetric[];
  pillars?: ExperiencePillar[];
  responsibilities: string[];
  technologies: string[];
  projects?: string[];
  links?: LinkItem[];
}

export interface LinkItem {
  label: string;
  url: string;
}

export interface ResearchItem {
  id: string;
  /** Short badge such as "TCC", "PIBIC", "Mestrado", "Liga de IA" */
  type?: string;
  /** Optional status badge, e.g. "Em andamento" */
  status?: string;
  title: string;
  lab: string;
  period: string;
  description: string;
  areas: string[];
  links?: LinkItem[];
}

export interface ResearchPublication {
  title: string;
  venue: string;
  year: string;
  authors: string[];
  link?: string;
  status?: string;
  abstract?: string;
}

export interface ResearchLine {
  area: string;
  description: string;
}

export interface Research {
  lines: ResearchLine[];
  projects: ResearchItem[];
  publications: ResearchPublication[];
  futureInterests: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags?: string[];
  technologies: string[];
  image?: string;
  github?: string;
  demo?: string;
  paper?: string;
  featured?: boolean;
}

export interface PublicationItem {
  id: string;
  title: string;
  authors: string[];
  year: string;
  venue: string;
  doi?: string;
  link?: string;
  status?: string;
  note?: string;
  abstract: string;
  tags: string[];
}

export interface SkillCategory {
  name: string;
  icon: string;
  skills: string[];
}

export interface ContactInfo {
  email: string;
  socials: SocialLink[];
}
