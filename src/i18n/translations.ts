export type Language = 'pt' | 'en';

export interface TranslationStrings {
  nav: {
    home: string;
    about: string;
    experience: string;
    research: string;
    projects: string;
    publications: string;
    skills: string;
    contact: string;
    downloadCV: string;
  };
  hero: {
    greeting: string;
    viewWork: string;
    downloadCV: string;
    getInTouch: string;
  };
  about: {
    title: string;
    heading: string;
    education: string;
    objectives: string;
    interests: string;
  };
  experience: {
    title: string;
    heading: string;
    notableProjects: string;
    empty: string;
  };
  research: {
    title: string;
    heading: string;
    lines: string;
    projects: string;
    publications: string;
    futureInterests: string;
    readPaper: string;
  };
  projects: {
    title: string;
    heading: string;
    all: string;
    empty: string;
  };
  publications: {
    title: string;
    heading: string;
    readPaper: string;
    empty: string;
  };
  skills: {
    title: string;
    heading: string;
  };
  resume: {
    title: string;
    heading: string;
    download: string;
    downloadDescription: string;
    atAGlance: string;
    recentRoles: string;
    roles: string;
    degrees: string;
    papers: string;
    tools: string;
    experience: string;
    education: string;
    publications: string;
    skills: string;
    generatedFrom: string;
  };
  contact: {
    title: string;
    heading: string;
    intro: string;
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    message: string;
    messagePlaceholder: string;
    send: string;
    sending: string;
    success: string;
    error: string;
    errorName: string;
    errorEmail: string;
    errorEmailInvalid: string;
    errorMessage: string;
  };
  footer: {
    backToTop: string;
    builtWith: string;
  };
  langToggle: {
    label: string;
  };
}

export const translations: Record<Language, TranslationStrings> = {
  pt: {
    nav: {
      home: 'Início',
      about: 'Sobre',
      experience: 'Experiência',
      research: 'Pesquisa',
      projects: 'Projetos',
      publications: 'Publicações',
      skills: 'Skills',
      contact: 'Contato',
      downloadCV: 'Baixar CV',
    },
    hero: {
      greeting: 'Olá, eu sou',
      viewWork: 'Ver meus projetos',
      downloadCV: 'Baixar CV',
      getInTouch: 'Entrar em contato',
    },
    about: {
      title: 'Sobre Mim',
      heading: 'Um pouco sobre quem eu sou',
      education: 'Formação',
      objectives: 'Objetivos',
      interests: 'Interesses',
    },
    experience: {
      title: 'Experiência',
      heading: 'Trajetória profissional',
      notableProjects: 'Projetos relevantes',
      empty: 'Nenhuma experiência cadastrada ainda. Adicione em src/data/experience.json',
    },
    research: {
      title: 'Pesquisa',
      heading: 'Trabalho acadêmico e pesquisa',
      lines: 'Linhas de Pesquisa',
      projects: 'Projetos de Pesquisa',
      publications: 'Publicações de Pesquisa',
      futureInterests: 'Interesses Futuros',
      readPaper: 'Ler artigo',
    },
    projects: {
      title: 'Projetos',
      heading: 'O que eu construí',
      all: 'Todos',
      empty: 'Nenhum projeto nesta categoria ainda.',
    },
    publications: {
      title: 'Publicações',
      heading: 'Publicações acadêmicas',
      readPaper: 'Ler artigo',
      empty: 'Nenhuma publicação ainda. Adicione em src/data/publications.json',
    },
    skills: {
      title: 'Skills',
      heading: 'Tecnologias e conhecimento',
    },
    resume: {
      title: 'CV',
      heading: 'Curriculum Vitae',
      download: 'Baixar meu CV',
      downloadDescription: 'Versão completa em PDF com detalhes de formação, experiência e publicações.',
      atAGlance: 'Em resumo',
      recentRoles: 'Cargos recentes',
      roles: 'cargos',
      degrees: 'diplomas',
      papers: 'artigos',
      tools: 'ferramentas',
      experience: 'Experiência',
      education: 'Formação',
      publications: 'Publicações',
      skills: 'Skills',
      generatedFrom: 'Gerado a partir do LaTeX',
    },
    contact: {
      title: 'Contato',
      heading: 'Vamos conversar',
      intro: 'Estou sempre aberto a discutir colaborações de pesquisa, oportunidades na indústria ou projetos interessantes. Sinta-se à vontade para entrar em contato por qualquer um dos canais abaixo.',
      name: 'Nome',
      namePlaceholder: 'Seu nome',
      email: 'Email',
      emailPlaceholder: 'voce@exemplo.com',
      message: 'Mensagem',
      messagePlaceholder: 'Sua mensagem...',
      send: 'Enviar mensagem',
      sending: 'Enviando...',
      success: 'Mensagem enviada com sucesso! Entrarei em contato em breve.',
      error: 'Algo deu errado. Tente novamente ou me envie um email diretamente.',
      errorName: 'Por favor, digite seu nome',
      errorEmail: 'Por favor, digite seu email',
      errorEmailInvalid: 'Por favor, digite um email válido',
      errorMessage: 'Por favor, digite uma mensagem',
    },
    footer: {
      backToTop: 'Voltar ao topo',
      builtWith: 'Construído com React, TypeScript e Tailwind CSS.',
    },
    langToggle: {
      label: 'EN',
    },
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      experience: 'Experience',
      research: 'Research',
      projects: 'Projects',
      publications: 'Publications',
      skills: 'Skills',
      contact: 'Contact',
      downloadCV: 'Download CV',
    },
    hero: {
      greeting: 'Hello, I am',
      viewWork: 'View my work',
      downloadCV: 'Download CV',
      getInTouch: 'Get in touch',
    },
    about: {
      title: 'About Me',
      heading: 'A bit about who I am',
      education: 'Education',
      objectives: 'Objectives',
      interests: 'Interests',
    },
    experience: {
      title: 'Experience',
      heading: 'Professional trajectory',
      notableProjects: 'Notable projects',
      empty: 'No experience entries yet. Add them to src/data/experience.json',
    },
    research: {
      title: 'Research',
      heading: 'Academic & research work',
      lines: 'Research Lines',
      projects: 'Research Projects',
      publications: 'Research Publications',
      futureInterests: 'Future Research Interests',
      readPaper: 'Read paper',
    },
    projects: {
      title: 'Projects',
      heading: "Things I've built",
      all: 'All',
      empty: 'No projects in this category yet.',
    },
    publications: {
      title: 'Publications',
      heading: 'Academic publications',
      readPaper: 'Read paper',
      empty: 'No publications yet. Add them to src/data/publications.json',
    },
    skills: {
      title: 'Skills',
      heading: 'Technologies & knowledge',
    },
    resume: {
      title: 'CV',
      heading: 'Curriculum Vitae',
      download: 'Download my CV',
      downloadDescription: 'Full PDF version with complete details on education, experience, and publications.',
      atAGlance: 'At a glance',
      recentRoles: 'Recent roles',
      roles: 'roles',
      degrees: 'degrees',
      papers: 'papers',
      tools: 'tools',
      experience: 'Experience',
      education: 'Education',
      publications: 'Publications',
      skills: 'Skills',
      generatedFrom: 'Generated from LaTeX source',
    },
    contact: {
      title: 'Contact',
      heading: "Let's talk",
      intro: "I'm always open to discussing research collaborations, industry opportunities, or interesting projects. Feel free to reach out through any of the channels below.",
      name: 'Name',
      namePlaceholder: 'Your name',
      email: 'Email',
      emailPlaceholder: 'you@example.com',
      message: 'Message',
      messagePlaceholder: 'Your message...',
      send: 'Send message',
      sending: 'Sending...',
      success: "Message sent successfully! I'll get back to you soon.",
      error: 'Something went wrong. Please try again or email me directly.',
      errorName: 'Please enter your name',
      errorEmail: 'Please enter your email',
      errorEmailInvalid: 'Please enter a valid email address',
      errorMessage: 'Please enter a message',
    },
    footer: {
      backToTop: 'Back to top',
      builtWith: 'Built with React, TypeScript & Tailwind CSS.',
    },
    langToggle: {
      label: 'PT',
    },
  },
};
