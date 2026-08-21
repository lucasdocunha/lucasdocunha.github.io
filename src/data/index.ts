import profilePt from '@/data/pt/profile.json';
import educationPt from '@/data/pt/education.json';
import aboutPt from '@/data/pt/about.json';
import experiencePt from '@/data/pt/experience.json';
import researchPt from '@/data/pt/research.json';
import projectsPt from '@/data/pt/projects.json';
import publicationsPt from '@/data/pt/publications.json';
import skillsPt from '@/data/pt/skills.json';
import contactPt from '@/data/pt/contact.json';

import profileEn from '@/data/en/profile.json';
import educationEn from '@/data/en/education.json';
import aboutEn from '@/data/en/about.json';
import experienceEn from '@/data/en/experience.json';
import researchEn from '@/data/en/research.json';
import projectsEn from '@/data/en/projects.json';
import publicationsEn from '@/data/en/publications.json';
import skillsEn from '@/data/en/skills.json';
import contactEn from '@/data/en/contact.json';

import type { Language } from '@/i18n/translations';
import type {
  Profile,
  EducationItem,
  About,
  ExperienceItem,
  Research,
  ProjectItem,
  PublicationItem,
  SkillCategory,
  ContactInfo,
} from '@/types';

const dataStore = {
  pt: {
    profile: profilePt as Profile,
    education: educationPt as EducationItem[],
    about: aboutPt as About,
    experience: experiencePt as ExperienceItem[],
    research: researchPt as Research,
    projects: projectsPt as ProjectItem[],
    publications: publicationsPt as PublicationItem[],
    skills: skillsPt as SkillCategory[],
    contact: contactPt as ContactInfo,
  },
  en: {
    profile: profileEn as Profile,
    education: educationEn as EducationItem[],
    about: aboutEn as About,
    experience: experienceEn as ExperienceItem[],
    research: researchEn as Research,
    projects: projectsEn as ProjectItem[],
    publications: publicationsEn as PublicationItem[],
    skills: skillsEn as SkillCategory[],
    contact: contactEn as ContactInfo,
  },
};

export function getData(lang: Language) {
  return dataStore[lang];
}
