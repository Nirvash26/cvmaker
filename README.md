# NIRVASH CV MAKER

> **Your CV. Made Effortlessly.**
>
> You bring the experience. We make it professional.

A premium, dark-themed CV builder with AI assistance, real-time preview, 12 beautiful templates, and one-click PDF/DOCX export. Built for complete beginners yet powerful enough for professionals.

---

## ✨ Features

### Phase 1 — Landing & Branding
- Premium dark UI with the Nirvash palette (Deep Dark Green, Dark Teal, Warm Beige, Soft Peach, Light Mint)
- Animated hero with floating CV previews, glow orbs, and SVG line art
- Two creation paths: **Answer Questions** (8-step wizard) or **Fill Out a Form**
- "How It Works" 3-step timeline
- Template preview grid with ATS badges
- Fully responsive (desktop / tablet / mobile with collapsible menu)

### Phase 2 — CV Creation System
- **Question-based wizard** — 8 steps with progress bar, adaptive experience options, profile-type suggestion chips, AI help at every step
- **Form-based builder** — sidebar with 9 sections, CV completion % indicator, collapsible cards, duplicate/rename/delete actions
- **12 unique CV templates** — Nirvash Minimal, Vertex, Aurora, Slate, Nova, Executive, Horizon, Focus, Studio, Classic, Academic, Modern Edge
- **"Preparing your CV..." cinematic transition** between template selection and the editor
- **Live split-screen editor** — 40/60 layout, A4 preview, zoom controls, drag-and-drop section reorder
- **Customize panel** — typography, layout density (Compact/Balanced/Spacious), 6 color schemes, photo/icons/dividers toggles
- **Autosave** — every change is persisted to localStorage with "Saving... / All changes saved" status

### Phase 3 — AI, Analysis & Polish
- **AI assistance** throughout: summary writer, experience improver, bullet point generator, project description improver, skill suggester — every result lets you Use / Edit / Regenerate / Cancel
- **CV Quality Analyzer** — animated circular score (Content / Readability / Completeness / ATS Readiness) + "Looking Great" + "Suggested Improvements" with "Fix This →" jump-to-section links
- **My CVs dashboard** — cards with score badges, thumbnail previews, Rename / Duplicate / Change Template / Delete actions
- **Refined download flow** — 4 animated states (idle → preparing with scan-line animation → "Your Download Is Ready!" → error fallback)
- **PDF export** via browser print-to-PDF (with print-optimized CSS)
- **DOCX export** via the `docx` library (preserves headings, bullet points, dates)
- **Success screen** with confetti, glow orbs, animated checkmark, and "Create Another CV" modal (Start fresh / Duplicate existing / Start with template)
- **Settings page** — default template, default export format, language, theme, interface preferences, sign out, delete account
- **Mobile-aware AI modals** — auto-switch between centered Dialog (desktop) and bottom-sheet Drawer (mobile)
- **Branded loading states** — animated sparkle with rotating messages ("Improving your experience...", "Finding relevant skills...", "Reviewing your CV...")
- **Skeleton loaders** for dashboard and template gallery

---

## 🎨 Design System

| Token | Hex | Usage |
|---|---|---|
| Deep Dark Green | `#2C3531` | Main background |
| Dark Teal | `#116466` | Primary UI and buttons |
| Warm Beige | `#D9B08C` | Secondary accents |
| Soft Peach | `#FFCB9A` | Highlights and CTA accents |
| Light Mint | `#D1E8E2` | Primary text and light elements |

Typography: Inter (sans) + JetBrains Mono (mono).

---

## 🛠 Tech Stack

- **Next.js 16** with App Router + Turbopack
- **TypeScript 5** (strict)
- **Tailwind CSS 4** with shadcn/ui (New York style)
- **Framer Motion** for animations
- **Zustand** for state management (with localStorage persistence)
- **z-ai-web-dev-sdk** for AI assistance (with offline fallbacks)
- **docx** for DOCX export
- **sharp** for image optimization (build-time)

---

## 🚀 Getting Started

```bash
# Install dependencies
bun install

# Run the dev server
bun run dev

# Open http://localhost:3000
```

### Build for production

```bash
bun run build
bun run start
```

### Optional: Re-optimize the logo

```bash
bun scripts/optimize-logo.js
```

This regenerates `public/nirvash-logo-nav.png` (256×256 navbar-optimized) and `public/nirvash-logo-full.png` (full quality) from `public/nirvash-logo.png`.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/ai/              # AI endpoints (summary, improve, bullet-points, achievements, skills, project-improve)
│   ├── globals.css          # Nirvash design system
│   ├── layout.tsx           # Root layout + metadata
│   └── page.tsx             # View router
├── components/
│   ├── ai/                  # AI buttons + branded loading + mobile-aware modal
│   ├── common/              # DownloadModal, DeleteConfirmationModal, RenameModal, CreateAnotherModal, Skeleton
│   ├── dashboard/           # My CVs dashboard
│   ├── editor/              # Live split-screen editor + TemplatePreview (12 templates)
│   ├── form/                # Form-based CV creator
│   ├── landing/             # Hero, CreationOptions, HowItWorks, TemplatePreview, WhyNirvash, FinalCTA
│   ├── layout/              # Navbar, Footer
│   ├── method/              # MethodSelect
│   ├── quality/             # CV Score analyzer
│   ├── settings/            # Settings page
│   ├── success/             # Success screen with confetti
│   ├── templates/           # Template gallery + PreparingTransition
│   └── wizard/              # Question-based wizard (8 steps)
└── lib/
    ├── ai.ts                # z-ai-web-dev-sdk wrapper
    ├── db.ts                # Prisma client
    ├── docx-export.ts        # DOCX generation
    ├── store.ts             # Zustand store (with migration)
    ├── templates.ts         # 12 template metadata
    ├── types.ts             # CV data model
    └── utils.ts             # cn() helper
```

---

## 🤖 AI Features

All AI endpoints use the `z-ai-web-dev-sdk` and gracefully fall back to local generation if the SDK is unavailable. AI never replaces user content without permission.

| Endpoint | Purpose |
|---|---|
| `POST /api/ai/summary` | Generate a professional summary (with Tone selector) |
| `POST /api/ai/improve` | Improve experience descriptions into bullet points |
| `POST /api/ai/bullet-points` | Generate 3–5 polished bullet points (never invents metrics) |
| `POST /api/ai/achievements` | Generate measurable achievement ideas |
| `POST /api/ai/skills` | Suggest skills based on professional title |
| `POST /api/ai/project-improve` | Improve project descriptions |

---

## 📋 CV Data Model

The CV data model is fully typed (see `src/lib/types.ts`). The Zustand store uses a `migrate` function (version 2) so existing localStorage data from earlier releases is automatically upgraded with new fields (`github`, `awards`, `publications`, `technologies` as array, etc.) — no data loss across versions.

---

## 🌐 Brand Identity

> **NIRVASH CV MAKER**
>
> Your CV. Made Effortlessly.
>
> You bring the experience. We make it professional.
>
> From a blank page to a professional CV in minutes.

---

## 📄 License

Private project. © Nirvash.
