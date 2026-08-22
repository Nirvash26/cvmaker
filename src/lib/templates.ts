import type { CVTemplateMeta } from "./types";

export const TEMPLATES: CVTemplateMeta[] = [
  { id: "minimal", name: "Nirvash Minimal", category: "Minimal", atsFriendly: true, description: "Centered, minimal, content-first layout." },
  { id: "vertex", name: "Vertex", category: "Tech", atsFriendly: true, description: "Sidebar layout designed for tech professionals." },
  { id: "aurora", name: "Aurora", category: "Modern", atsFriendly: true, description: "Clean modern layout with subtle accent line." },
  { id: "slate", name: "Slate", category: "Minimal", atsFriendly: true, description: "Mono-inspired, structured, calm." },
  { id: "nova", name: "Nova", category: "Creative", atsFriendly: false, description: "Bold and creative with circular accents." },
  { id: "executive", name: "Executive", category: "Executive", atsFriendly: true, description: "Dark, sophisticated, leadership-ready." },
  { id: "horizon", name: "Horizon", category: "Professional", atsFriendly: false, description: "Two-column professional layout." },
  { id: "focus", name: "Focus", category: "ATS Friendly", atsFriendly: true, description: "Pure ATS-optimized single column." },
  { id: "studio", name: "Studio", category: "Creative", atsFriendly: false, description: "Designer portfolio with photo accent." },
  { id: "classic", name: "Classic", category: "Professional", atsFriendly: true, description: "Timeless serif-based classic format." },
  { id: "academic", name: "Academic", category: "Academic", atsFriendly: true, description: "Publication-friendly academic format." },
  { id: "modern-edge", name: "Modern Edge", category: "Modern", atsFriendly: true, description: "Asymmetric layout with sharp edges." },
];

export const TEMPLATE_CATEGORIES = [
  "All",
  "Minimal",
  "Modern",
  "Professional",
  "Creative",
  "Corporate",
  "Student",
  "Academic",
  "Tech",
  "Executive",
  "ATS Friendly",
];
