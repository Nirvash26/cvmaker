// Nirvash CV Maker — Core Type Definitions

export type View =
  | "landing"
  | "method-select"
  | "question-wizard"
  | "form-builder"
  | "template-gallery"
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
}

export interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  technologies: string;
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

export const COLOR_SCHEMES: Record<
  string,
  { name: string; bg: string; text: string; accent: string; muted: string }
> = {
  nirvash: {
    name: "Nirvash",
    bg: "#FFFFFF",
    text: "#2C3531",
    accent: "#116466",
    muted: "#5C6B66",
  },
  midnight: {
    name: "Midnight",
    bg: "#1A1F2E",
    text: "#E8ECF4",
    accent: "#7C9CB8",
    muted: "#A0A8B8",
  },
  rose: {
    name: "Rose Gold",
    bg: "#FFF8F5",
    text: "#3D2C2E",
    accent: "#C77B6B",
    muted: "#8A6F6B",
  },
  forest: {
    name: "Forest",
    bg: "#F4F7F5",
    text: "#1F3329",
    accent: "#2D6A4F",
    muted: "#52735F",
  },
  slate: {
    name: "Slate",
    bg: "#FFFFFF",
    text: "#1E293B",
    accent: "#475569",
    muted: "#64748B",
  },
  sunburst: {
    name: "Sunburst",
    bg: "#FFFCF5",
    text: "#3D2F1F",
    accent: "#D97706",
    muted: "#8A7355",
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
  };
}

export function createEmptyProject(): ProjectEntry {
  return {
    id: `prj_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: "",
    description: "",
    technologies: "",
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
