import type { CVTemplateMeta } from "./types";

// Original 12 templates
export const ORIGINAL_TEMPLATES: CVTemplateMeta[] = [
  { id: "minimal", name: "Nirvash Minimal", category: "Minimal", atsFriendly: true, description: "Centered, minimal, content-first layout.", onePage: true, hasPhoto: false, featured: "popular", recommendedFor: ["Business / Corporate", "Other"] },
  { id: "vertex", name: "Vertex", category: "Tech", atsFriendly: true, description: "Sidebar layout designed for tech professionals.", onePage: false, hasPhoto: true, featured: "tech", recommendedFor: ["Software / Tech"] },
  { id: "aurora", name: "Aurora", category: "Modern", atsFriendly: true, description: "Clean modern layout with subtle accent line.", onePage: false, hasPhoto: false, recommendedFor: ["Business / Corporate"] },
  { id: "slate", name: "Slate", category: "Minimal", atsFriendly: true, description: "Mono-inspired, structured, calm.", onePage: true, hasPhoto: false, recommendedFor: ["Software / Tech"] },
  { id: "nova", name: "Nova", category: "Creative", atsFriendly: false, description: "Bold and creative with circular accents.", onePage: false, hasPhoto: false, recommendedFor: ["Design / Creative"] },
  { id: "executive", name: "Executive", category: "Executive", atsFriendly: true, description: "Dark, sophisticated, leadership-ready.", onePage: false, hasPhoto: false, featured: "editors", recommendedFor: ["Business / Corporate", "Finance"] },
  { id: "horizon", name: "Horizon", category: "Professional", atsFriendly: false, description: "Two-column professional layout.", onePage: false, hasPhoto: false, recommendedFor: ["Business / Corporate"] },
  { id: "focus", name: "Focus", category: "ATS Friendly", atsFriendly: true, description: "Pure ATS-optimized single column.", onePage: true, hasPhoto: false, recommendedFor: ["Business / Corporate", "Other"] },
  { id: "studio", name: "Studio", category: "Creative", atsFriendly: false, description: "Designer portfolio with photo accent.", onePage: false, hasPhoto: true, recommendedFor: ["Design / Creative"] },
  { id: "classic", name: "Classic", category: "Professional", atsFriendly: true, description: "Timeless serif-based classic format.", onePage: false, hasPhoto: false, recommendedFor: ["Business / Corporate", "Education"] },
  { id: "academic", name: "Academic", category: "Academic", atsFriendly: true, description: "Publication-friendly academic format.", onePage: false, hasPhoto: false, recommendedFor: ["Education", "Academic"] },
  { id: "modern-edge", name: "Modern Edge", category: "Modern", atsFriendly: true, description: "Asymmetric layout with sharp edges.", onePage: false, hasPhoto: false, recommendedFor: ["Software / Tech", "Design / Creative"] },
];

// 50 new templates — each with unique structural identity
export const NEW_TEMPLATES: CVTemplateMeta[] = [
  // === PREMIUM MINIMAL ===
  { id: "apex", name: "Apex", category: "Minimal", atsFriendly: true, description: "Clean, confident and distraction-free.", onePage: true, hasPhoto: false, featured: "editors", recommendedFor: ["Business / Corporate", "Finance"] },
  { id: "blank-space", name: "Blank Space", category: "Minimal", atsFriendly: true, description: "Extremely spacious design with large margins.", onePage: true, hasPhoto: false, recommendedFor: ["Business / Corporate", "Design / Creative"] },
  { id: "paper", name: "Paper", category: "Minimal", atsFriendly: true, description: "Editorial typography with subtle hierarchy.", onePage: false, hasPhoto: false, recommendedFor: ["Education", "Marketing"] },
  { id: "outline", name: "Outline", category: "Minimal", atsFriendly: true, description: "Sections separated by thin elegant lines.", onePage: true, hasPhoto: false, recommendedFor: ["Business / Corporate"] },
  { id: "calm", name: "Calm", category: "Minimal", atsFriendly: true, description: "Soft typography and balanced whitespace.", onePage: false, hasPhoto: false, recommendedFor: ["Healthcare", "Education"] },
  { id: "one", name: "One", category: "One Page", atsFriendly: true, description: "A highly optimized single-page CV.", onePage: true, hasPhoto: false, recommendedFor: ["Business / Corporate", "Student / Internship"] },

  // === MODERN & FUTURISTIC ===
  { id: "orbit", name: "Orbit", category: "Modern", atsFriendly: false, description: "Circular accent elements and modern blocks.", onePage: false, hasPhoto: true, recommendedFor: ["Design / Creative"] },
  { id: "prism", name: "Prism", category: "Modern", atsFriendly: false, description: "Geometric section layouts with color accents.", onePage: false, hasPhoto: false, recommendedFor: ["Design / Creative"] },
  { id: "flux", name: "Flux", category: "Modern", atsFriendly: true, description: "Flowing section transitions and strong typography.", onePage: false, hasPhoto: false, recommendedFor: ["Software / Tech"] },
  { id: "vector", name: "Vector", category: "Modern", atsFriendly: true, description: "Grid-based modern professional layout.", onePage: false, hasPhoto: false, recommendedFor: ["Software / Tech"] },
  { id: "quantum", name: "Quantum", category: "Modern", atsFriendly: false, description: "Futuristic but clean structure.", onePage: false, hasPhoto: false, featured: "new", recommendedFor: ["Software / Tech"] },
  { id: "signal", name: "Signal", category: "Tech", atsFriendly: true, description: "Hierarchy inspired by modern tech interfaces.", onePage: false, hasPhoto: false, featured: "tech", recommendedFor: ["Software / Tech"] },

  // === BOLD & COLORFUL ===
  { id: "vivid", name: "Vivid", category: "Colorful", atsFriendly: false, description: "Strong color sidebar with clean content area.", onePage: false, hasPhoto: true, recommendedFor: ["Design / Creative", "Marketing"] },
  { id: "coral-tpl", name: "Coral", category: "Colorful", atsFriendly: false, description: "Warm coral accents with modern typography.", onePage: false, hasPhoto: false, recommendedFor: ["Marketing", "Design / Creative"] },
  { id: "electric", name: "Electric", category: "Colorful", atsFriendly: false, description: "Blue and purple visual accents.", onePage: false, hasPhoto: false, recommendedFor: ["Software / Tech", "Design / Creative"] },
  { id: "spectrum", name: "Spectrum", category: "Colorful", atsFriendly: false, description: "Controlled multi-color accent system.", onePage: false, hasPhoto: false, recommendedFor: ["Design / Creative", "Marketing"] },
  { id: "pop", name: "Pop", category: "Creative", atsFriendly: false, description: "Bright but professional creative layout.", onePage: false, hasPhoto: true, recommendedFor: ["Design / Creative", "Marketing"] },
  { id: "ember", name: "Ember", category: "Colorful", atsFriendly: false, description: "Deep orange and warm red accent system.", onePage: false, hasPhoto: false, recommendedFor: ["Marketing", "Business / Corporate"] },

  // === CREATIVE PROFESSIONAL ===
  { id: "canvas-pro", name: "Canvas Pro", category: "Designer", atsFriendly: false, description: "Large creative header with structured sections.", onePage: false, hasPhoto: true, recommendedFor: ["Design / Creative"] },
  { id: "gallery", name: "Gallery", category: "Designer", atsFriendly: false, description: "Portfolio-inspired CV with project highlights.", onePage: false, hasPhoto: true, recommendedFor: ["Design / Creative"] },
  { id: "frame", name: "Frame", category: "Creative", atsFriendly: false, description: "Box-based visual organization.", onePage: false, hasPhoto: false, recommendedFor: ["Design / Creative", "Marketing"] },
  { id: "studio-pro", name: "Studio Pro", category: "Designer", atsFriendly: false, description: "Modern designer-style composition.", onePage: false, hasPhoto: true, recommendedFor: ["Design / Creative"] },
  { id: "muse-modern", name: "Muse Modern", category: "Designer", atsFriendly: false, description: "Elegant creative layout with refined typography.", onePage: false, hasPhoto: false, recommendedFor: ["Design / Creative", "Marketing"] },
  { id: "story", name: "Story", category: "Creative", atsFriendly: false, description: "A timeline-inspired CV that tells your journey.", onePage: false, hasPhoto: false, recommendedFor: ["Marketing", "Design / Creative"] },

  // === EXECUTIVE & CORPORATE ===
  { id: "chairman", name: "Chairman", category: "Executive", atsFriendly: true, description: "Elegant executive layout with premium typography.", onePage: false, hasPhoto: false, featured: "editors", recommendedFor: ["Business / Corporate", "Finance"] },
  { id: "boardroom", name: "Boardroom", category: "Executive", atsFriendly: true, description: "Classic corporate CV with strong hierarchy.", onePage: false, hasPhoto: false, recommendedFor: ["Business / Corporate"] },
  { id: "legacy", name: "Legacy", category: "Executive", atsFriendly: true, description: "Traditional but modernized executive style.", onePage: false, hasPhoto: false, recommendedFor: ["Business / Corporate", "Finance"] },
  { id: "summit-pro", name: "Summit Pro", category: "Executive", atsFriendly: true, description: "High-end professional layout.", onePage: false, hasPhoto: false, recommendedFor: ["Business / Corporate", "Finance"] },
  { id: "capital", name: "Capital", category: "Executive", atsFriendly: true, description: "Finance and consulting inspired design.", onePage: false, hasPhoto: false, recommendedFor: ["Finance", "Business / Corporate"] },
  { id: "director", name: "Director", category: "Executive", atsFriendly: true, description: "Minimal executive with emphasis on achievements.", onePage: true, hasPhoto: false, recommendedFor: ["Business / Corporate"] },

  // === TECHNOLOGY ===
  { id: "devgrid", name: "DevGrid", category: "Tech", atsFriendly: true, description: "Grid-based layout designed for developers.", onePage: false, hasPhoto: false, featured: "tech", recommendedFor: ["Software / Tech"] },
  { id: "stack", name: "Stack", category: "Tech", atsFriendly: true, description: "Skills and technologies visually prioritized.", onePage: false, hasPhoto: false, recommendedFor: ["Software / Tech"] },
  { id: "byte", name: "Byte", category: "Tech", atsFriendly: true, description: "Compact one-page tech CV.", onePage: true, hasPhoto: false, recommendedFor: ["Software / Tech"] },
  { id: "system", name: "System", category: "Tech", atsFriendly: true, description: "Structured technical experience layout.", onePage: false, hasPhoto: false, recommendedFor: ["Software / Tech"] },
  { id: "build", name: "Build", category: "Tech", atsFriendly: false, description: "Project-focused template.", onePage: false, hasPhoto: false, recommendedFor: ["Software / Tech"] },
  { id: "cloud", name: "Cloud", category: "Tech", atsFriendly: false, description: "Modern tech layout with soft visual accents.", onePage: false, hasPhoto: false, recommendedFor: ["Software / Tech"] },

  // === STUDENT & FRESHER ===
  { id: "first-step", name: "First Step", category: "Student", atsFriendly: true, description: "Prioritizes education and skills.", onePage: true, hasPhoto: false, featured: "students", recommendedFor: ["Student / Internship"] },
  { id: "momentum", name: "Momentum", category: "Student", atsFriendly: true, description: "Projects and certifications appear prominently.", onePage: false, hasPhoto: false, recommendedFor: ["Student / Internship"] },
  { id: "scholar", name: "Scholar", category: "Academic", atsFriendly: true, description: "Academic and achievement-focused.", onePage: false, hasPhoto: false, recommendedFor: ["Education", "Student / Internship"] },
  { id: "intern", name: "Intern", category: "Student", atsFriendly: true, description: "Designed specifically for internship applications.", onePage: true, hasPhoto: false, recommendedFor: ["Student / Internship"] },
  { id: "future", name: "Future", category: "Student", atsFriendly: true, description: "Modern fresh graduate layout.", onePage: false, hasPhoto: false, recommendedFor: ["Student / Internship"] },
  { id: "spark", name: "Spark", category: "Student", atsFriendly: false, description: "Colorful but professional student CV.", onePage: true, hasPhoto: false, featured: "students", recommendedFor: ["Student / Internship"] },

  // === UNIQUE LAYOUTS ===
  { id: "timeline-tpl", name: "Timeline", category: "Creative", atsFriendly: false, description: "Vertical career timeline.", onePage: false, hasPhoto: false, recommendedFor: ["Marketing", "Design / Creative"] },
  { id: "split", name: "Split", category: "Two Column", atsFriendly: true, description: "Strong two-column asymmetric layout.", onePage: false, hasPhoto: false, recommendedFor: ["Business / Corporate", "Software / Tech"] },
  { id: "sidebar-tpl", name: "Sidebar", category: "Two Column", atsFriendly: true, description: "Modern information sidebar.", onePage: false, hasPhoto: true, recommendedFor: ["Design / Creative", "Software / Tech"] },
  { id: "magazine", name: "Magazine", category: "Creative", atsFriendly: false, description: "Editorial magazine-inspired structure.", onePage: false, hasPhoto: true, recommendedFor: ["Marketing", "Design / Creative"] },
  { id: "card-tpl", name: "Card", category: "Creative", atsFriendly: false, description: "Information organized into elegant cards.", onePage: false, hasPhoto: false, recommendedFor: ["Design / Creative", "Marketing"] },
  { id: "gridline", name: "Gridline", category: "Modern", atsFriendly: true, description: "Structured grid system.", onePage: false, hasPhoto: false, recommendedFor: ["Software / Tech", "Business / Corporate"] },
  { id: "profile-tpl", name: "Profile", category: "With Photo", atsFriendly: false, description: "Large personal branding header.", onePage: false, hasPhoto: true, recommendedFor: ["Design / Creative", "Marketing"] },
  { id: "impact", name: "Impact", category: "Professional", atsFriendly: false, description: "Achievement-focused with highlighted results.", onePage: false, hasPhoto: false, recommendedFor: ["Business / Corporate", "Finance"] },
];

export const TEMPLATES: CVTemplateMeta[] = [...ORIGINAL_TEMPLATES, ...NEW_TEMPLATES];

// Smart recommendation labels
export const RECOMMENDATION_LABELS: Record<string, string> = {
  experience: "✨ Great for your experience level",
  trending: "🔥 Trending",
  students: "🎓 Popular with students",
  corporate: "💼 Best for corporate roles",
  developers: "⚡ Best for developers",
  creative: "🎨 Creative favorite",
};

// Featured labels
export const FEATURED_LABELS: Record<string, string> = {
  editors: "Editor's Pick",
  popular: "Most Popular",
  students: "Best for Students",
  tech: "Best for Tech",
  new: "New",
};

// Role options for the recommendation engine
export const ROLE_OPTIONS = [
  "Software / Tech",
  "Business / Corporate",
  "Design / Creative",
  "Student / Internship",
  "Marketing",
  "Finance",
  "Healthcare",
  "Education",
  "Other",
];

// Updated categories for filtering
export const TEMPLATE_CATEGORIES = [
  "All",
  "Recommended",
  "Minimal",
  "Modern",
  "Professional",
  "Creative",
  "Colorful",
  "Executive",
  "Tech",
  "Student",
  "Academic",
  "Designer",
  "ATS Friendly",
  "One Page",
  "Two Column",
  "With Photo",
  "Without Photo",
];
