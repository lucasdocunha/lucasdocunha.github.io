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
    researchYears: string;
    researchDetail: string;
    workYears: string;
    workDetail: string;
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
    paper: string;
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
      skills: 'Competências',
      contact: 'Contato',
      downloadCV: 'Baixar CV',
    },
    hero: {
      greeting: 'Olá, eu sou',
      viewWork: 'Explorar Projetos',
      downloadCV: 'Currículo (PDF)',
      getInTouch: 'Entrar em Contato',
    },
    about: {
      title: 'Sobre Mim',
      heading: 'Trajetória Acadêmica e Profissional',
      education: 'Formação Acadêmica',
      objectives: 'Foco de Atuação',
      interests: 'Áreas de Especialização',
    },
    experience: {
      title: 'Experiência',
      heading: 'Trajetória e Atuação Profissional',
      notableProjects: 'Projetos Relevantes',
      empty: 'Nenhuma experiência cadastrada no momento.',
      researchYears: 'anos de pesquisa acadêmica',
      researchDetail: 'Lasin · 2× PIBIC · TCC · Liga de IA · PPGIA',
      workYears: 'anos de experiência profissional',
      workDetail: 'DATAKIE · MBRF (COEIA)',
    },
    research: {
      title: 'Pesquisa',
      heading: 'Investigação Científica e Publicações',
      lines: 'Linhas de Pesquisa',
      projects: 'Trajetória Acadêmica: TCC, Liga de IA, PIBIC e Mestrado',
      publications: 'Artigos e Publicações em Destaque',
      futureInterests: 'Direções Futuras de Investigação',
      readPaper: 'Acessar Artigo',
    },
    projects: {
      title: 'Projetos',
      heading: 'Engenharia e Pesquisa Aplicada',
      all: 'Todos',
      empty: 'Nenhum projeto cadastrado nesta categoria.',
      paper: 'Artigo',
    },
    publications: {
      title: 'Publicações',
      heading: 'Produção Acadêmica e Conferências',
      readPaper: 'Acessar Artigo',
      empty: 'Nenhuma publicação cadastrada no momento.',
    },
    skills: {
      title: 'Competências',
      heading: 'Stack Tecnológica e Domínio Conceitual',
    },
    resume: {
      title: 'Currículo',
      heading: 'Síntese Curricular',
      download: 'Download do Curriculum Vitae',
      downloadDescription: 'Versão completa em PDF estruturada com histórico acadêmico, experiência profissional e produção científica.',
      atAGlance: 'Visão Geral',
      recentRoles: 'Atuações Recentes',
      roles: 'cargos',
      degrees: 'títulos',
      papers: 'artigos',
      tools: 'tecnologias',
      experience: 'Experiência',
      education: 'Títulos Acadêmicos',
      publications: 'Publicações',
      skills: 'Competências',
      generatedFrom: 'Perfil acadêmico e profissional consolidado',
    },
    contact: {
      title: 'Contato',
      heading: 'Vamos Conversar',
      intro: 'Estou sempre aberto a parcerias de pesquisa acadêmica, projetos de Machine Learning de alto impacto na indústria e discussões técnicas inovadoras. Sinta-se à vontade para entrar em contato.',
      name: 'Nome Completo',
      namePlaceholder: 'Seu nome completo',
      email: 'Endereço de E-mail',
      emailPlaceholder: 'seu.email@exemplo.com',
      message: 'Mensagem',
      messagePlaceholder: 'Descreva sua proposta, projeto ou mensagem...',
      send: 'Enviar Mensagem',
      sending: 'Enviando mensagem...',
      success: 'Mensagem enviada com sucesso! Retornarei o contato o mais breve possível.',
      error: 'Ocorreu um erro ao enviar. Por favor, tente novamente ou envie um e-mail direto.',
      errorName: 'Por favor, informe seu nome.',
      errorEmail: 'Por favor, informe seu e-mail.',
      errorEmailInvalid: 'Por favor, informe um endereço de e-mail válido.',
      errorMessage: 'Por favor, preencha o campo de mensagem.',
    },
    footer: {
      backToTop: 'Voltar ao topo',
      builtWith: 'Desenvolvido com React, TypeScript e Tailwind CSS.',
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
      viewWork: 'Explore Projects',
      downloadCV: 'Curriculum Vitae',
      getInTouch: 'Get in Touch',
    },
    about: {
      title: 'About Me',
      heading: 'Academic & Professional Background',
      education: 'Education',
      objectives: 'Career Focus',
      interests: 'Areas of Expertise',
    },
    experience: {
      title: 'Experience',
      heading: 'Professional Track Record',
      notableProjects: 'Featured Projects',
      empty: 'No experience entries available at the moment.',
      researchYears: 'years of academic research',
      researchDetail: 'Lasin · 2× PIBIC · Thesis · AI League · PPGIA',
      workYears: 'years of professional experience',
      workDetail: 'DATAKIE · MBRF (COEIA)',
    },
    research: {
      title: 'Research',
      heading: 'Scientific Investigation & Publications',
      lines: 'Research Tracks',
      projects: 'Academic Path: Thesis, AI League, PIBIC & M.Sc.',
      publications: 'Featured Publications',
      futureInterests: 'Future Research Directions',
      readPaper: 'View Paper',
    },
    projects: {
      title: 'Projects',
      heading: 'Applied Engineering & Research Systems',
      all: 'All',
      empty: 'No projects available in this category.',
      paper: 'Paper',
    },
    publications: {
      title: 'Publications',
      heading: 'Peer-Reviewed Papers & Conference Proceedings',
      readPaper: 'View Paper',
      empty: 'No publications available at the moment.',
    },
    skills: {
      title: 'Skills',
      heading: 'Technical Stack & Core Competencies',
    },
    resume: {
      title: 'Resume',
      heading: 'Curriculum Overview',
      download: 'Download Curriculum Vitae',
      downloadDescription: 'Comprehensive PDF version detailing academic background, professional experience, publications, and technical skill set.',
      atAGlance: 'Overview at a Glance',
      recentRoles: 'Recent Positions',
      roles: 'roles',
      degrees: 'degrees',
      papers: 'papers',
      tools: 'skills',
      experience: 'Experience',
      education: 'Academic Degrees',
      publications: 'Publications',
      skills: 'Skills',
      generatedFrom: 'Up-to-date academic and professional profile',
    },
    contact: {
      title: 'Contact',
      heading: "Let's Connect",
      intro: 'I am always open to discussing academic research collaborations, industry Machine Learning initiatives, and technological challenges. Feel free to connect through any of the channels below.',
      name: 'Full Name',
      namePlaceholder: 'Your full name',
      email: 'Email Address',
      emailPlaceholder: 'your.email@example.com',
      message: 'Message',
      messagePlaceholder: 'Describe your inquiry, project, or collaboration proposal...',
      send: 'Send Message',
      sending: 'Sending message...',
      success: 'Thank you! Your message has been sent successfully. I will get back to you shortly.',
      error: 'An error occurred while sending. Please try again or reach out via email directly.',
      errorName: 'Please enter your full name.',
      errorEmail: 'Please enter your email address.',
      errorEmailInvalid: 'Please provide a valid email address.',
      errorMessage: 'Please include a message before submitting.',
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
