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

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location?: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
  projects?: string[];
}

export interface ResearchItem {
  id: string;
  title: string;
  lab: string;
  period: string;
  description: string;
  areas: string[];
}

export interface ResearchPublication {
  title: string;
  venue: string;
  year: string;
  authors: string[];
  link?: string;
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
  technologies: string[];
  image?: string;
  github?: string;
  demo?: string;
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
