// Nirvash CV Maker — Core Type Definitions

export type View =
  | "landing"
  | "method-select"
  | "question-wizard"
  | "form-builder"
  | "template-gallery"
  | "preparing"
  | "editor"
  | "dashboard"
  | "settings"
  | "success";

export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  photo: string; // data URL
}

export interface ExperienceEntry {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities: string;
  achievements: string;
}

export interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url: string;
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface LanguageEntry {
  id: string;
  name: string;
  proficiency: string;
}

export interface AwardEntry {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface PublicationEntry {
  id: string;
  title: string;
  publisher: string;
  date: string;
  url: string;
}

export interface DesignConfig {
  fontFamily: string;
  fontSize: number; // base px
  sectionSpacing: number;
  margins: number;
  sectionOrder: string[];
  colorScheme: string;
  showPhoto: boolean;
  showIcons: boolean;
  showDividers: boolean;
}

export interface CVData {
  id: string;
  name: string;
  personal: PersonalInfo;
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: string[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  languages: LanguageEntry[];
  achievements: string[];
  awards: AwardEntry[];
  publications: PublicationEntry[];
  volunteer: string[];
  interests: string[];
  template: string;
  design: DesignConfig;
  createdAt: number;
  updatedAt: number;
}

export interface CVTemplateMeta {
  id: string;
  name: string;
  category: string;
  atsFriendly: boolean;
  description: string;
  onePage?: boolean;
  hasPhoto?: boolean;
  featured?: "editors" | "popular" | "students" | "tech" | "new";
  recommendation?: string;
  recommendedFor?: string[];
}

export interface QualityScore {
  overall: number;
  content: number;
  readability: number;
  completeness: number;
  ats: number;
}

export interface QualitySuggestion {
  id: string;
  type: "success" | "warning";
  text: string;
  section?: string;
}

export interface ColorScheme {
  name: string;
  bg: string;
  text: string;
  accent: string;
  muted: string;
  subtitle?: string;
  premium?: boolean;
  swatches?: string[];
}

export const COLOR_SCHEMES: Record<string, ColorScheme> = {
  nirvash: {
    name: "Nirvash",
    bg: "#FFFFFF",
    text: "#2C3531",
    accent: "#116466",
    muted: "#5C6B66",
    swatches: ["#FFFFFF", "#116466", "#2C3531"],
  },
  rubyNoir: {
    name: "Ruby Noir",
    subtitle: "Bold. Refined. Unforgettable.",
    bg: "#FFF7F5",
    text: "#0B0B0D",
    accent: "#B11226",
    muted: "#2A0E13",
    premium: true,
    swatches: ["#0B0B0D", "#2A0E13", "#B11226", "#E63946", "#FFF7F5"],
  },
  midnight: {
    name: "Midnight",
    bg: "#1A1F2E",
    text: "#E8ECF4",
    accent: "#7C9CB8",
    muted: "#A0A8B8",
    swatches: ["#1A1F2E", "#7C9CB8", "#E8ECF4"],
  },
  rose: {
    name: "Rose Gold",
    bg: "#FFF8F5",
    text: "#3D2C2E",
    accent: "#C77B6B",
    muted: "#8A6F6B",
    swatches: ["#FFF8F5", "#C77B6B", "#3D2C2E"],
  },
  forest: {
    name: "Forest",
    bg: "#F4F7F5",
    text: "#1F3329",
    accent: "#2D6A4F",
    muted: "#52735F",
    swatches: ["#F4F7F5", "#2D6A4F", "#1F3329"],
  },
  slate: {
    name: "Slate",
    bg: "#FFFFFF",
    text: "#1E293B",
    accent: "#475569",
    muted: "#64748B",
    swatches: ["#FFFFFF", "#475569", "#1E293B"],
  },
  sunburst: {
    name: "Sunburst",
    bg: "#FFFCF5",
    text: "#3D2F1F",
    accent: "#D97706",
    muted: "#8A7355",
    swatches: ["#FFFCF5", "#D97706", "#3D2F1F"],
  },
  charcoal: {
    name: "Charcoal",
    bg: "#FAFAFA",
    text: "#18181B",
    accent: "#27272A",
    muted: "#52525B",
    swatches: ["#FAFAFA", "#27272A", "#18181B"],
  },
  navy: {
    name: "Deep Navy",
    bg: "#FFFFFF",
    text: "#0F172A",
    accent: "#1E3A8A",
    muted: "#475569",
    swatches: ["#FFFFFF", "#1E3A8A", "#0F172A"],
  },
  burgundy: {
    name: "Burgundy",
    bg: "#FDF8F8",
    text: "#1F0A0E",
    accent: "#6B1F2C",
    muted: "#5C4046",
    swatches: ["#FDF8F8", "#6B1F2C", "#1F0A0E"],
  },
  sand: {
    name: "Sand",
    bg: "#FBF7F0",
    text: "#2A2520",
    accent: "#A0866B",
    muted: "#6B5D4F",
    swatches: ["#FBF7F0", "#A0866B", "#2A2520"],
  },
  graphite: {
    name: "Graphite",
    bg: "#F4F4F5",
    text: "#1C1C1F",
    accent: "#3F3F46",
    muted: "#52525B",
    swatches: ["#F4F4F5", "#3F3F46", "#1C1C1F"],
  },
  emerald: {
    name: "Emerald",
    bg: "#F2F8F5",
    text: "#0F2A1F",
    accent: "#047857",
    muted: "#3F6B58",
    swatches: ["#F2F8F5", "#047857", "#0F2A1F"],
  },
  cobalt: {
    name: "Cobalt",
    bg: "#F5F7FA",
    text: "#0B1B3A",
    accent: "#1D4ED8",
    muted: "#4B5B7A",
    swatches: ["#F5F7FA", "#1D4ED8", "#0B1B3A"],
  },
  amber: {
    name: "Amber Glow",
    bg: "#FFFCF2",
    text: "#2A1F0A",
    accent: "#B45309",
    muted: "#7A5C3A",
    swatches: ["#FFFCF2", "#B45309", "#2A1F0A"],
  },
  plum: {
    name: "Plum",
    bg: "#FAF5FA",
    text: "#1F0A1F",
    accent: "#7E22CE",
    muted: "#5C405C",
    swatches: ["#FAF5FA", "#7E22CE", "#1F0A1F"],
  },
  ocean: {
    name: "Ocean",
    bg: "#F0F7FA",
    text: "#0A1F2A",
    accent: "#0369A1",
    muted: "#3F5C6B",
    swatches: ["#F0F7FA", "#0369A1", "#0A1F2A"],
  },
  copper: {
    name: "Copper",
    bg: "#FAF6F2",
    text: "#2A1F1A",
    accent: "#9A3412",
    muted: "#6B4A3F",
    swatches: ["#FAF6F2", "#9A3412", "#2A1F1A"],
  },
  ink: {
    name: "Ink",
    bg: "#FFFFFF",
    text: "#0A0A0A",
    accent: "#171717",
    muted: "#404040",
    swatches: ["#FFFFFF", "#171717", "#0A0A0A"],
  },
  coral: {
    name: "Coral",
    bg: "#FFF8F5",
    text: "#2A1A1A",
    accent: "#FB7185",
    muted: "#7A4A4A",
    swatches: ["#FFF8F5", "#FB7185", "#2A1A1A"],
  },
  obsidian: {
    name: "Obsidian",
    bg: "#FAFAFA",
    text: "#0B0B0D",
    accent: "#1F1F23",
    muted: "#3F3F46",
    swatches: ["#FAFAFA", "#1F1F23", "#0B0B0D"],
  },
};

export const FONT_FAMILIES: Record<string, { name: string; stack: string }> = {
  inter: { name: "Inter", stack: "Inter, system-ui, sans-serif" },
  geist: { name: "Geist", stack: "Inter, system-ui, sans-serif" },
  serif: { name: "Serif", stack: "Georgia, 'Times New Roman', serif" },
  mono: { name: "Mono", stack: "'JetBrains Mono', 'Courier New', monospace" },
};

export function createEmptyCV(): CVData {
  return {
    id: `cv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: "Untitled CV",
    personal: {
      fullName: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      github: "",
      photo: "",
    },
    summary: "",
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    achievements: [],
    awards: [],
    publications: [],
    volunteer: [],
    interests: [],
    template: "aurora",
    design: {
      fontFamily: "inter",
      fontSize: 14,
      sectionSpacing: 16,
      margins: 32,
      sectionOrder: [
        "personal",
        "summary",
        "experience",
        "education",
        "skills",
        "projects",
        "certifications",
        "languages",
      ],
      colorScheme: "nirvash",
      showPhoto: false,
      showIcons: true,
      showDividers: true,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function createEmptyExperience(): ExperienceEntry {
  return {
    id: `exp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    jobTitle: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    responsibilities: "",
    achievements: "",
  };
}

export function createEmptyEducation(): EducationEntry {
  return {
    id: `edu_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    degree: "",
    institution: "",
    field: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
  };
}

export function createEmptyProject(): ProjectEntry {
  return {
    id: `prj_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: "",
    description: "",
    technologies: [],
    url: "",
  };
}

export function createEmptyCertification(): CertificationEntry {
  return {
    id: `cert_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: "",
    issuer: "",
    date: "",
  };
}

export function createEmptyLanguage(): LanguageEntry {
  return {
    id: `lang_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: "",
    proficiency: "Fluent",
  };
}

export function createEmptyAward(): AwardEntry {
  return {
    id: `award_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    title: "",
    issuer: "",
    date: "",
    description: "",
  };
}

export function createEmptyPublication(): PublicationEntry {
  return {
    id: `pub_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    title: "",
    publisher: "",
    date: "",
    url: "",
  };
}
