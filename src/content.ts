// Todo o texto do site vive aqui (PT + EN). Edite à vontade.

export type Lang = 'pt' | 'en';

export const links = {
  email: 'lucas.ocunha@hotmail.com',
  linkedin: 'https://www.linkedin.com/in/lucasdoc/',
  github: 'https://github.com/lucasdocunha',
  lattes: 'http://lattes.cnpq.br/8290492930803559',
  cv: `${import.meta.env.BASE_URL}cv/resume.pdf`,
};

export interface FocusArea {
  id: string;
  icon: 'eye' | 'scan' | 'brain' | 'network' | 'layers' | 'cpu' | 'workflow' | 'text';
  title: string;
  blurb: string;
  topics: string[];
  wide?: boolean;
}

export interface TermLine {
  kind: 'prompt' | 'user' | 'plan' | 'agent' | 'done' | 'final' | 'blank';
  text: string;
  agent?: number; // índice do subagente que esta linha ativa/conclui
}

export interface Paper {
  venue: string;
  year: string;
  title: string;
  summary: string;
  link?: string;
  linkLabel?: string;
  code?: string;
  status?: string;
}

export interface Role {
  period: string;
  role: string;
  org: string;
  line: string;
  current?: boolean;
}

const pt = {
  nav: { focus: 'Estudos', claude: 'Harness', research: 'Pesquisa', path: 'Trajetória', contact: 'Contato', cv: 'CV' },
  hero: {
    kicker: 'Machine Learning Engineer · Pesquisador em IA',
    name: 'Lucas Cunha',
    headline: ['Pesquiso e construo', 'sistemas de IA', 'do modelo ao produto.'],
    sub: 'ML Engineer na Datakie e mestrando no PPGIA/PUCPR. Visão computacional, modelos multimodais e agentes — com Claude Code para transformar ideias em POCs em horas.',
    ctaPrimary: 'Ver o que eu estudo',
    ctaSecondary: 'Baixar CV',
    stats: [
      { value: '2', label: 'artigos em 2026' },
      { value: 'SIBGRAPI', label: '+ IEEE SMC' },
      { value: 'ICDAR', label: 'desafio 2026' },
    ],
    location: 'Curitiba, BR',
  },
  focus: {
    eyebrow: '01 · Temas de estudo',
    title: 'O que eu estudo a fundo',
    intro: 'Oito frentes de machine learning que conecto entre si — da representação visual ao deploy de agentes.',
    areas: [
      {
        id: 'cv', icon: 'eye', title: 'Visão Computacional',
        blurb: 'Detectar, segmentar e classificar com robustez — do servidor ao edge.',
        topics: ['Detecção', 'Segmentação', 'Classificação', 'Metric learning', 'Edge models', 'Análise espectral'],
      },
      {
        id: 'vlm', icon: 'scan', title: 'Multimodal & Document Understanding',
        blurb: 'VLMs que leem documentos, figuras e tabelas e devolvem dados estruturados.',
        topics: ['VLMs', 'ColPali', 'OCR', 'Análise de layout', 'Extração estruturada'],
      },
      {
        id: 'nlp', icon: 'text', title: 'NLP',
        blurb: 'Do baseline leve ao transformer: entender, identificar e classificar texto.',
        topics: ['TF-IDF', 'N-gramas · bigramas', 'BERT & variantes', 'Classificação de texto', 'Identificação'],
      },
      {
        id: 'llm', icon: 'brain', title: 'LLMs & SLMs',
        blurb: 'Adaptar, comprimir e servir modelos de linguagem com custo baixo.',
        topics: ['LoRA · QLoRA', 'Quantização', 'VLMs', 'RAG & embeddings', 'LLMOps'],
      },
      {
        id: 'agents', icon: 'network', title: 'Agentes & Orquestração',
        blurb: 'Sistemas multiagente com ferramentas, memória e contexto bem delimitado.',
        topics: ['Tool use', 'MCP', 'Multiagentes', 'Prompt & context engineering', 'LLMOps'],
      },
      {
        id: 'repr', icon: 'layers', title: 'Aprendizado de Representação',
        blurb: 'Aprender bem com poucos rótulos e generalizar entre domínios.',
        topics: ['Self-supervised', 'Autoencoders', 'Self-taught learning', 'Adaptação de domínio', 'Few-shot', 'Ensembles', 'Clusterização'],
      },
      {
        id: 'scale', icon: 'cpu', title: 'Treino & Inferência em Escala',
        blurb: 'Do cluster ao edge: treinar rápido e servir leve.',
        topics: ['HPC · Slurm', 'Multi-GPU (DDP · Accelerate)', 'Federated learning', 'ONNX · TensorRT', 'FastAPI', 'W&B', 'Docker · Podman'],
      },
      {
        id: 'mlops', icon: 'workflow', title: 'MLOps', wide: true,
        blurb: 'O que faço no dia a dia: levar modelos do experimento à produção e mantê-los saudáveis.',
        topics: ['Pipelines treino → deploy', 'MLflow · Model Registry', 'Versionamento de dados & modelos', 'CI/CD para ML', 'Monitoramento & drift', 'Databricks', 'Docker · Podman'],
      },
    ] as FocusArea[],
    marquee: [
      'Transformers', 'Atenção', 'Contrastive learning', 'Self-supervised', 'Transfer learning', 'PEFT', 'Quantização',
      'Segmentação', 'Detecção', 'OCR', 'VLMs', 'RAG', 'Embeddings', 'Agentes', 'Domain shift', 'Robustez', 'Few-shot',
      'Autoencoders', 'Metric learning', 'Distributed training', 'Edge AI', 'MLOps', 'Avaliação',
    ],
  },
  claude: {
    eyebrow: '02 · Harness em uso',
    title: 'Um harness que amplifica o que eu consigo construir.',
    intro: 'Uso o Claude Code como harness de engenharia: ele amplia minhas capacidades e me deixa focado na pergunta de pesquisa e em bolar ideias, enquanto construo sistemas com mais rapidez e solidez. Eu defino o problema, a arquitetura e os critérios de aceite; agentes em paralelo exploram, implementam, testam e revisam.',
    points: [
      { title: 'POCs relâmpago', text: 'De uma ideia para um protótipo funcional — modelo, API e interface — no mesmo dia, pronto para validar com o time.' },
      { title: 'Orquestração de agentes', text: 'Subagentes com contexto isolado trabalhando em paralelo: pesquisa, backend, frontend, avaliação e code review.' },
      { title: 'Ferramental sob medida', text: 'CLAUDE.md, skills, slash commands, hooks e servidores MCP que conectam dados, repositórios e ferramentas internas.' },
      { title: 'Ciclo de experimentos', text: 'Agentes que preparam experimentos, acompanham logs e resumem resultados para eu decidir o próximo passo.' },
    ],
    graph: { orchestrator: 'orquestrador', agents: ['pesquisa', 'backend', 'frontend', 'avaliação'] },
    script: [
      { kind: 'prompt', text: 'claude' },
      { kind: 'user', text: 'POC: extrair tabelas de figuras científicas com Qwen2.5-VL, API + demo web + benchmark' },
      { kind: 'plan', text: 'Planejando · 4 tarefas independentes → disparando subagentes em paralelo' },
      { kind: 'agent', agent: 0, text: 'Task(pesquisa)   revisando papers e baselines do ICDAR' },
      { kind: 'agent', agent: 1, text: 'Task(backend)    FastAPI + inferência com vLLM' },
      { kind: 'agent', agent: 2, text: 'Task(frontend)   demo com upload de figura' },
      { kind: 'agent', agent: 3, text: 'Task(avaliação)  benchmark em 50 figuras' },
      { kind: 'blank', text: '' },
      { kind: 'done', agent: 0, text: 'pesquisa   3 baselines resumidos em notes/refs.md' },
      { kind: 'done', agent: 1, text: 'backend    /extract pronto · testes passando' },
      { kind: 'done', agent: 2, text: 'frontend   demo em localhost:5173' },
      { kind: 'done', agent: 3, text: 'avaliação  métricas em results/eval.md' },
      { kind: 'final', text: 'POC pronta para revisão.' },
    ] as TermLine[],
    disclaimer: 'Sessão ilustrativa',
  },
  research: {
    eyebrow: '03 · Pesquisa',
    title: 'Pesquisa publicada e em andamento',
    intro: 'Mestrado no PPGIA/PUCPR, Liga Acadêmica de IA e duas iniciações científicas (CNPq · Lasin).',
    papers: [
      {
        venue: 'SIBGRAPI', year: '2026',
        title: 'Benchmarking Spatial, Spectral, and Self-Supervised Cues for Face Forgery Detection under Realistic Degradation',
        summary: 'Desempenho em dados limpos não garante robustez: DINOv3 congelado com cabeça linear lidera sob compressão, redimensionamento e blur.',
        link: 'https://arxiv.org/abs/2609.01511', code: 'https://github.com/lucasdocunha/FaceForgery-Benchmark',
      },
      {
        venue: 'IEEE SMC', year: '2026',
        title: 'An Ensemble-Based Self-Taught Learning Approach for Parking Space Classification Under Limited Data',
        summary: 'Comitê de autoencoders como extratores não supervisionados: 93–96% de acurácia cross-dataset com poucos rótulos.',
        link: 'https://arxiv.org/abs/2609.03258', code: 'https://github.com/lucasdocunha/PKLot-Ensemble-STL',
      },
      {
        venue: 'CEAP', year: '2026', status: 'Em andamento',
        title: 'Pesquisa de mestrado: VLLMs para documentos fiscais brasileiros',
        summary: 'Vision LLMs para entender e extrair informações estruturadas de documentos fiscais brasileiros.',
      },
      {
        venue: 'Kaggle', year: '2026', status: 'Em andamento',
        title: 'Name That LLM',
        summary: 'Competição no Kaggle com a equipe da Liga de IA da PUCPR: identificar qual LLM está por trás de cada texto.',
        link: 'https://www.kaggle.com/competitions/name-that-llm', linkLabel: 'Kaggle', code: 'https://github.com/Liga-de-IA-PUCPR/Name-That-LLM',
      },
      {
        venue: 'ICDAR', year: '2026', status: 'Em andamento',
        title: 'Sci-Image: figuras científicas → tabelas em Markdown',
        summary: 'Fine-tuning de Qwen2.5-VL com QLoRA para extrair dados de gráficos e figuras, na Liga de IA da PUCPR.',
        code: 'https://github.com/lucasdocunha/sci-image-markdown',
      },
    ] as Paper[],
    paper: 'Artigo', code: 'Código',
  },
  path: {
    eyebrow: '04 · Trajetória',
    title: 'Onde isso vira prática',
    roles: [
      { period: '2026 —', role: 'Machine Learning Engineer', org: 'Datakie', line: 'Liderança técnica de pipelines de IA generativa e OCR para documentos fiscais (FINEP · SUFRAMA).', current: true },
      { period: '2025 — 2026', role: 'Cientista de Dados', org: 'MBRF · COEIA', line: 'Agente LLM no Teams sobre Databricks Genie (−80% no tempo de busca) e visão computacional para SKUs (+40% na auditoria).' },
      { period: '2024 —', role: 'Pesquisador em IA', org: 'PUCPR · PPGIA · Lasin', line: 'Mestrado, Liga de IA e duas iniciações científicas em adaptação de domínio.', current: true },
    ] as Role[],
    education: 'Ciência da Computação (PUCPR, 2023 — dez/2026) · Mestrado em Informática (PPGIA/PUCPR, 2026 —)',
  },
  contact: {
    eyebrow: '05 · Contato',
    title: 'Vamos construir algo?',
    text: 'Aberto a conversas sobre pesquisa, ML aplicado e sistemas com agentes.',
    copy: 'Copiar e-mail', copied: 'Copiado!',
  },
  footer: 'Feito com React, Framer Motion e Claude Code.',
};

type Content = typeof pt;

const en: Content = {
  nav: { focus: 'Focus', claude: 'Harness', research: 'Research', path: 'Path', contact: 'Contact', cv: 'CV' },
  hero: {
    kicker: 'Machine Learning Engineer · AI Researcher',
    name: 'Lucas Cunha',
    headline: ['I research and build', 'AI systems', 'from model to product.'],
    sub: 'ML Engineer at Datakie and MSc student at PPGIA/PUCPR. Computer vision, multimodal models and agents — using Claude Code to turn ideas into POCs in hours.',
    ctaPrimary: 'See what I study',
    ctaSecondary: 'Download CV',
    stats: [
      { value: '2', label: 'papers in 2026' },
      { value: 'SIBGRAPI', label: '+ IEEE SMC' },
      { value: 'ICDAR', label: '2026 challenge' },
    ],
    location: 'Curitiba, BR',
  },
  focus: {
    eyebrow: '01 · Study focus',
    title: 'What I study in depth',
    intro: 'Eight machine learning fronts that I connect — from visual representations to deployed agents.',
    areas: [
      { id: 'cv', icon: 'eye', title: 'Computer Vision', blurb: 'Robust detection, segmentation and classification — from server to edge.',
        topics: ['Detection', 'Segmentation', 'Classification', 'Metric learning', 'Edge models', 'Spectral analysis'] },
      { id: 'vlm', icon: 'scan', title: 'Multimodal & Document Understanding', blurb: 'VLMs that read documents, figures and tables and return structured data.',
        topics: ['VLMs', 'ColPali', 'OCR', 'Layout analysis', 'Structured extraction'] },
      { id: 'nlp', icon: 'text', title: 'NLP', blurb: 'From lightweight baselines to transformers: understanding, identifying and classifying text.',
        topics: ['TF-IDF', 'N-grams · bigrams', 'BERT & variants', 'Text classification', 'Identification'] },
      { id: 'llm', icon: 'brain', title: 'LLMs & SLMs', blurb: 'Adapting, compressing and serving language models cheaply.',
        topics: ['LoRA · QLoRA', 'Quantization', 'VLMs', 'RAG & embeddings', 'LLMOps'] },
      { id: 'agents', icon: 'network', title: 'Agents & Orchestration', blurb: 'Multi-agent systems with tools, memory and well-scoped context.',
        topics: ['Tool use', 'MCP', 'Multi-agent', 'Prompt & context engineering', 'LLMOps'] },
      { id: 'repr', icon: 'layers', title: 'Representation Learning', blurb: 'Learning well from few labels and generalizing across domains.',
        topics: ['Self-supervised', 'Autoencoders', 'Self-taught learning', 'Domain adaptation', 'Few-shot', 'Ensembles', 'Clustering'] },
      { id: 'scale', icon: 'cpu', title: 'Training & Inference at Scale', blurb: 'From cluster to edge: train fast, serve light.',
        topics: ['HPC · Slurm', 'Multi-GPU (DDP · Accelerate)', 'Federated learning', 'ONNX · TensorRT', 'FastAPI', 'W&B', 'Docker · Podman'] },
      { id: 'mlops', icon: 'workflow', title: 'MLOps', wide: true, blurb: 'My day-to-day: taking models from experiment to production and keeping them healthy.',
        topics: ['Training → deploy pipelines', 'MLflow · Model Registry', 'Data & model versioning', 'CI/CD for ML', 'Monitoring & drift', 'Databricks', 'Docker · Podman'] },
    ],
    marquee: [
      'Transformers', 'Attention', 'Contrastive learning', 'Self-supervised', 'Transfer learning', 'PEFT', 'Quantization',
      'Segmentation', 'Detection', 'OCR', 'VLMs', 'RAG', 'Embeddings', 'Agents', 'Domain shift', 'Robustness', 'Few-shot',
      'Autoencoders', 'Metric learning', 'Distributed training', 'Edge AI', 'MLOps', 'Evaluation',
    ],
  },
  claude: {
    eyebrow: '02 · Harness in use',
    title: 'A harness that amplifies what I can build.',
    intro: 'I use Claude Code as my engineering harness: it amplifies my capabilities and keeps me focused on the research question and on coming up with ideas, while I build systems faster and more solidly. I set the problem, the architecture and the acceptance criteria; parallel agents explore, implement, test and review.',
    points: [
      { title: 'Rapid POCs', text: 'From an idea to a working prototype — model, API and UI — the same day, ready to validate with the team.' },
      { title: 'Agent orchestration', text: 'Subagents with isolated context working in parallel: research, backend, frontend, evaluation and code review.' },
      { title: 'Custom tooling', text: 'CLAUDE.md, skills, slash commands, hooks and MCP servers wiring up data, repos and internal tools.' },
      { title: 'Experiment loop', text: 'Agents that set up experiments, follow logs and summarize results so I can decide the next step.' },
    ],
    graph: { orchestrator: 'orchestrator', agents: ['research', 'backend', 'frontend', 'eval'] },
    script: [
      { kind: 'prompt', text: 'claude' },
      { kind: 'user', text: 'POC: extract tables from scientific figures with Qwen2.5-VL, API + web demo + benchmark' },
      { kind: 'plan', text: 'Planning · 4 independent tasks → launching subagents in parallel' },
      { kind: 'agent', agent: 0, text: 'Task(research)   reviewing ICDAR papers and baselines' },
      { kind: 'agent', agent: 1, text: 'Task(backend)    FastAPI + vLLM inference' },
      { kind: 'agent', agent: 2, text: 'Task(frontend)   figure-upload demo' },
      { kind: 'agent', agent: 3, text: 'Task(eval)       benchmark on 50 figures' },
      { kind: 'blank', text: '' },
      { kind: 'done', agent: 0, text: 'research   3 baselines summarized in notes/refs.md' },
      { kind: 'done', agent: 1, text: 'backend    /extract ready · tests passing' },
      { kind: 'done', agent: 2, text: 'frontend   demo on localhost:5173' },
      { kind: 'done', agent: 3, text: 'eval       metrics in results/eval.md' },
      { kind: 'final', text: 'POC ready for review.' },
    ],
    disclaimer: 'Illustrative session',
  },
  research: {
    eyebrow: '03 · Research',
    title: 'Published and ongoing research',
    intro: 'MSc at PPGIA/PUCPR, the PUCPR AI League and two undergraduate research grants (CNPq · Lasin).',
    papers: [
      { venue: 'SIBGRAPI', year: '2026',
        title: 'Benchmarking Spatial, Spectral, and Self-Supervised Cues for Face Forgery Detection under Realistic Degradation',
        summary: 'Clean-set accuracy does not imply robustness: a frozen DINOv3 with a linear head leads under compression, resizing and blur.',
        link: 'https://arxiv.org/abs/2609.01511', code: 'https://github.com/lucasdocunha/FaceForgery-Benchmark' },
      { venue: 'IEEE SMC', year: '2026',
        title: 'An Ensemble-Based Self-Taught Learning Approach for Parking Space Classification Under Limited Data',
        summary: 'An ensemble of autoencoders as unsupervised feature extractors: 93–96% cross-dataset accuracy with few labels.',
        link: 'https://arxiv.org/abs/2609.03258', code: 'https://github.com/lucasdocunha/PKLot-Ensemble-STL' },
      { venue: 'CEAP', year: '2026', status: 'Ongoing',
        title: 'Master research: VLLMs for Brazilian tax documents',
        summary: 'Vision LLMs to understand and extract structured information from Brazilian tax documents.' },
      { venue: 'Kaggle', year: '2026', status: 'Ongoing',
        title: 'Name That LLM',
        summary: 'Kaggle competition with the PUCPR AI League team: identifying which LLM is behind each text.',
        link: 'https://www.kaggle.com/competitions/name-that-llm', linkLabel: 'Kaggle', code: 'https://github.com/Liga-de-IA-PUCPR/Name-That-LLM' },
      { venue: 'ICDAR', year: '2026', status: 'Ongoing',
        title: 'Sci-Image: scientific figures → Markdown tables',
        summary: 'QLoRA fine-tuning of Qwen2.5-VL to extract data from charts and figures, at the PUCPR AI League.',
        code: 'https://github.com/lucasdocunha/sci-image-markdown' },
    ],
    paper: 'Paper', code: 'Code',
  },
  path: {
    eyebrow: '04 · Path',
    title: 'Where it becomes practice',
    roles: [
      { period: '2026 —', role: 'Machine Learning Engineer', org: 'Datakie', line: 'Technical lead for generative AI and OCR pipelines for tax documents (FINEP · SUFRAMA).', current: true },
      { period: '2025 — 2026', role: 'Data Scientist', org: 'MBRF · COEIA', line: 'LLM agent in Teams over Databricks Genie (−80% search time) and computer vision for SKUs (+40% audit efficiency).' },
      { period: '2024 —', role: 'AI Researcher', org: 'PUCPR · PPGIA · Lasin', line: 'MSc, AI League and two research grants on domain adaptation.', current: true },
    ],
    education: 'BSc Computer Science (PUCPR, 2023 — Dec 2026) · MSc Informatics (PPGIA/PUCPR, 2026 —)',
  },
  contact: {
    eyebrow: '05 · Contact',
    title: "Let's build something?",
    text: 'Open to conversations about research, applied ML and agentic systems.',
    copy: 'Copy email', copied: 'Copied!',
  },
  footer: 'Built with React, Framer Motion and Claude Code.',
};

export const content: Record<Lang, Content> = { pt, en };
export type { Content };
