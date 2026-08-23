"use client";

import { CVData, ColorScheme } from "@/lib/types";

// Shared props for all new templates
export interface NewTemplateProps {
  cv: CVData;
  scheme: ColorScheme;
  fontStack: string;
  fontSize: number;
  compact?: boolean;
}

// ============ SHARED HELPERS ============

function Contacts({ cv, scheme, fontSize, layout = "row" }: { cv: CVData; scheme: ColorScheme; fontSize: number; layout?: "row" | "col" | "comma" }) {
  const items = [
    cv.personal.email,
    cv.personal.phone,
    cv.personal.location,
    cv.personal.website,
    cv.personal.linkedin,
    cv.personal.github,
  ].filter(Boolean);

  if (items.length === 0) return null;

  if (layout === "comma") {
    return <div style={{ fontSize: fontSize * 0.7, color: scheme.muted }}>{items.join(" · ")}</div>;
  }
  if (layout === "col") {
    return (
      <div style={{ fontSize: fontSize * 0.7, color: scheme.muted }} className="space-y-0.5">
        {items.map((c, i) => <div key={i}>{c}</div>)}
      </div>
    );
  }
  return (
    <div style={{ fontSize: fontSize * 0.7, color: scheme.muted }} className="flex flex-wrap gap-x-3 gap-y-1">
      {items.map((c, i) => <span key={i}>{c}</span>)}
    </div>
  );
}

function SkillsList({ skills, scheme, fontSize, layout = "dot" }: { skills: string[]; scheme: ColorScheme; fontSize: number; layout?: "dot" | "tag" | "comma" | "bar" }) {
  if (!skills.length) return null;
  if (layout === "comma") {
    return <div style={{ fontSize: fontSize * 0.85, color: scheme.muted }}>{skills.join(" · ")}</div>;
  }
  if (layout === "tag") {
    return (
      <div className="flex flex-wrap gap-1">
        {skills.slice(0, 12).map((s, i) => (
          <span key={i} style={{ fontSize: fontSize * 0.7, background: scheme.accent, color: scheme.bg, padding: "1px 6px", borderRadius: 3 }}>{s}</span>
        ))}
      </div>
    );
  }
  if (layout === "bar") {
    return (
      <div className="space-y-1">
        {skills.slice(0, 8).map((s, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span style={{ fontSize: fontSize * 0.75, color: scheme.text, minWidth: "60px" }}>{s}</span>
            <div className="flex-1 h-1 rounded-full" style={{ background: `${scheme.accent}20` }}>
              <div className="h-full rounded-full" style={{ background: scheme.accent, width: `${70 + (i * 5) % 30}%` }} />
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-0.5">
      {skills.slice(0, 10).map((s, i) => (
        <div key={i} style={{ fontSize: fontSize * 0.8, color: scheme.muted }}>· {s}</div>
      ))}
    </div>
  );
}

function ExperienceList({ cv, scheme, fontSize, showBullets = true }: { cv: CVData; scheme: ColorScheme; fontSize: number; showBullets?: boolean }) {
  if (!cv.experience.length) return null;
  return (
    <div className="space-y-2">
      {cv.experience.slice(0, 3).map((e, i) => (
        <div key={i}>
          <div className="flex justify-between items-baseline">
            <strong style={{ color: scheme.text, fontSize: fontSize * 0.95 }}>{e.jobTitle || "Job Title"}</strong>
            <span style={{ color: scheme.muted, fontSize: fontSize * 0.7 }}>{e.startDate} {e.endDate && `— ${e.endDate}`}</span>
          </div>
          <div style={{ color: scheme.accent, fontSize: fontSize * 0.85 }}>{e.company}{e.location && ` · ${e.location}`}</div>
          {e.responsibilities && (
            <div style={{ color: scheme.muted, marginTop: 2, lineHeight: 1.4, fontSize: fontSize * 0.78, whiteSpace: "pre-wrap" }}>
              {showBullets ? e.responsibilities.split("\n").filter(Boolean).slice(0, 3).map((line, j) => <div key={j}>• {line}</div>) : e.responsibilities}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function EducationList({ cv, scheme, fontSize }: { cv: CVData; scheme: ColorScheme; fontSize: number }) {
  if (!cv.education.length) return null;
  return (
    <div className="space-y-1">
      {cv.education.slice(0, 2).map((e, i) => (
        <div key={i}>
          <div className="flex justify-between">
            <strong style={{ color: scheme.text, fontSize: fontSize * 0.9 }}>{e.degree || "Degree"}</strong>
            <span style={{ color: scheme.muted, fontSize: fontSize * 0.7 }}>{e.startDate} {e.endDate && `— ${e.endDate}`}</span>
          </div>
          <div style={{ color: scheme.accent, fontSize: fontSize * 0.8 }}>{e.institution}</div>
        </div>
      ))}
    </div>
  );
}

function ProjectsList({ cv, scheme, fontSize }: { cv: CVData; scheme: ColorScheme; fontSize: number }) {
  if (!cv.projects.length) return null;
  return (
    <div className="space-y-1.5">
      {cv.projects.slice(0, 3).map((p, i) => (
        <div key={i}>
          <strong style={{ color: scheme.text, fontSize: fontSize * 0.9 }}>{p.name}</strong>
          {p.description && <div style={{ color: scheme.muted, fontSize: fontSize * 0.75, lineHeight: 1.4 }}>{p.description}</div>}
          {Array.isArray(p.technologies) && p.technologies.length > 0 && (
            <div style={{ fontSize: fontSize * 0.7, color: scheme.accent }}>Tech: {p.technologies.join(", ")}</div>
          )}
        </div>
      ))}
    </div>
  );
}

function SectionTitle({ title, scheme, fontSize, align = "left", underline = "accent" }: { title: string; scheme: ColorScheme; fontSize: number; align?: "left" | "center"; underline?: "accent" | "full" | "none" }) {
  return (
    <div className="mb-1.5">
      <h3 style={{ fontSize: fontSize * 0.95, fontWeight: 700, color: scheme.accent, textTransform: "uppercase", letterSpacing: "0.05em", textAlign: align }}>{title}</h3>
      {underline === "accent" && <div style={{ width: "20%", height: 1, background: scheme.accent, marginTop: 2, marginLeft: align === "center" ? "auto" : 0, marginRight: align === "center" ? "auto" : 0 }} />}
      {underline === "full" && <div style={{ width: "100%", height: 1, background: `${scheme.accent}50`, marginTop: 2 }} />}
    </div>
  );
}

// ============ 50 NEW TEMPLATE COMPONENTS ============

// === PREMIUM MINIMAL ===

export function ApexTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[7%] overflow-hidden">
      <header className="pb-2 mb-3" style={{ borderBottom: `1px solid ${scheme.accent}` }}>
        <h1 style={{ fontSize: fontSize * 2.4, fontWeight: 700, color: scheme.text, letterSpacing: "-0.02em", lineHeight: 1 }}>{cv.personal.fullName || "Your Name"}</h1>
        <div className="flex justify-between items-end mt-1">
          <p style={{ fontSize: fontSize * 0.95, color: scheme.accent }}>{cv.personal.title || "Title"}</p>
          <Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="comma" />
        </div>
      </header>
      {cv.summary && (<div className="mb-3"><SectionTitle title="Profile" scheme={scheme} fontSize={fontSize} /><p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.5 }}>{cv.summary}</p></div>)}
      <div className="mb-3"><SectionTitle title="Experience" scheme={scheme} fontSize={fontSize} /><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><SectionTitle title="Education" scheme={scheme} fontSize={fontSize} /><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        <div><SectionTitle title="Skills" scheme={scheme} fontSize={fontSize} /><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="dot" /></div>
      </div>
    </div>
  );
}

export function BlankSpaceTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[10%] overflow-hidden">
      <header className="mb-8 text-center">
        <h1 style={{ fontSize: fontSize * 2.2, fontWeight: 300, color: scheme.text, letterSpacing: "0.05em" }}>{cv.personal.fullName || "Your Name"}</h1>
        <p style={{ fontSize: fontSize * 0.95, color: scheme.accent, marginTop: 4, letterSpacing: "0.1em" }}>{(cv.personal.title || "Title").toUpperCase()}</p>
        <div className="mt-4"><Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="comma" /></div>
      </header>
      <div className="space-y-6">
        {cv.summary && (<div><SectionTitle title="Summary" scheme={scheme} fontSize={fontSize} align="center" /><p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.6, textAlign: "center" }}>{cv.summary}</p></div>)}
        <div><SectionTitle title="Experience" scheme={scheme} fontSize={fontSize} align="center" /><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        <div className="grid grid-cols-2 gap-6">
          <div><SectionTitle title="Education" scheme={scheme} fontSize={fontSize} align="center" /><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
          <div><SectionTitle title="Skills" scheme={scheme} fontSize={fontSize} align="center" /><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="dot" /></div>
        </div>
      </div>
    </div>
  );
}

export function PaperTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  const serif = "Georgia, 'Times New Roman', serif";
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: serif, fontSize }} className="w-full h-full p-[8%] overflow-hidden">
      <header className="mb-4">
        <h1 style={{ fontSize: fontSize * 2.6, fontWeight: 700, color: scheme.text, lineHeight: 1, fontStyle: "italic" }}>{cv.personal.fullName || "Your Name"}</h1>
        <div className="mt-2" style={{ fontSize: fontSize * 0.8, color: scheme.muted, fontStyle: "italic" }}>
          <Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="comma" />
        </div>
        <div style={{ borderTop: `3px solid ${scheme.accent}`, marginTop: 8 }} />
      </header>
      {cv.summary && (<div className="mb-3"><h3 style={{ fontSize: fontSize * 0.95, fontWeight: 700, color: scheme.accent, fontStyle: "italic", marginBottom: 4 }}>Profile</h3><p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.6, textAlign: "justify" }}>{cv.summary}</p></div>)}
      <div className="mb-3"><h3 style={{ fontSize: fontSize * 0.95, fontWeight: 700, color: scheme.accent, fontStyle: "italic", marginBottom: 4 }}>Experience</h3><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><h3 style={{ fontSize: fontSize * 0.95, fontWeight: 700, color: scheme.accent, fontStyle: "italic", marginBottom: 4 }}>Education</h3><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        <div><h3 style={{ fontSize: fontSize * 0.95, fontWeight: 700, color: scheme.accent, fontStyle: "italic", marginBottom: 4 }}>Skills</h3><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="dot" /></div>
      </div>
    </div>
  );
}

export function OutlineTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[7%] overflow-hidden">
      <header className="text-center pb-3 mb-3" style={{ borderBottom: `1px solid ${scheme.text}30` }}>
        <h1 style={{ fontSize: fontSize * 2.0, fontWeight: 700, color: scheme.text, letterSpacing: "-0.01em" }}>{cv.personal.fullName || "Your Name"}</h1>
        <p style={{ fontSize: fontSize * 0.9, color: scheme.accent, marginTop: 2 }}>{cv.personal.title || "Title"}</p>
        <div className="mt-2"><Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="comma" /></div>
      </header>
      <div className="space-y-3 divide-y" style={{ borderColor: `${scheme.text}15` }}>
        {cv.summary && (<div className="pb-2"><SectionTitle title="Summary" scheme={scheme} fontSize={fontSize} /><p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.5 }}>{cv.summary}</p></div>)}
        <div className="pt-2"><SectionTitle title="Experience" scheme={scheme} fontSize={fontSize} /><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        <div className="pt-2 grid grid-cols-2 gap-3">
          <div><SectionTitle title="Education" scheme={scheme} fontSize={fontSize} /><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
          <div><SectionTitle title="Skills" scheme={scheme} fontSize={fontSize} /><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="dot" /></div>
        </div>
      </div>
    </div>
  );
}

export function CalmTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[8%] overflow-hidden">
      <header className="mb-4">
        <h1 style={{ fontSize: fontSize * 2.0, fontWeight: 400, color: scheme.text, letterSpacing: "0.02em" }}>{cv.personal.fullName || "Your Name"}</h1>
        <p style={{ fontSize: fontSize * 0.95, color: scheme.accent, marginTop: 2, fontWeight: 300 }}>{cv.personal.title || "Title"}</p>
        <div className="mt-3"><Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="row" /></div>
      </header>
      {cv.summary && (<div className="mb-3"><h3 style={{ fontSize: fontSize * 0.85, fontWeight: 600, color: scheme.accent, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4 }}>About</h3><p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.6 }}>{cv.summary}</p></div>)}
      <div className="mb-3"><h3 style={{ fontSize: fontSize * 0.85, fontWeight: 600, color: scheme.accent, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4 }}>Experience</h3><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><h3 style={{ fontSize: fontSize * 0.85, fontWeight: 600, color: scheme.accent, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4 }}>Education</h3><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        <div><h3 style={{ fontSize: fontSize * 0.85, fontWeight: 600, color: scheme.accent, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4 }}>Skills</h3><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="dot" /></div>
      </div>
    </div>
  );
}

export function OneTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[6%] overflow-hidden">
      <header className="flex justify-between items-end pb-2 mb-3" style={{ borderBottom: `2px solid ${scheme.accent}` }}>
        <div>
          <h1 style={{ fontSize: fontSize * 1.8, fontWeight: 800, color: scheme.text, lineHeight: 1 }}>{cv.personal.fullName || "Your Name"}</h1>
          <p style={{ fontSize: fontSize * 0.85, color: scheme.accent, marginTop: 2 }}>{cv.personal.title || "Title"}</p>
        </div>
        <Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="col" />
      </header>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 space-y-3">
          {cv.summary && (<div><SectionTitle title="Profile" scheme={scheme} fontSize={fontSize} /><p style={{ color: scheme.muted, fontSize: fontSize * 0.8, lineHeight: 1.5 }}>{cv.summary}</p></div>)}
          <div><SectionTitle title="Experience" scheme={scheme} fontSize={fontSize} /><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
        <div className="space-y-3">
          <div><SectionTitle title="Skills" scheme={scheme} fontSize={fontSize} /><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="dot" /></div>
          <div><SectionTitle title="Education" scheme={scheme} fontSize={fontSize} /><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
      </div>
    </div>
  );
}

// === MODERN & FUTURISTIC ===

export function OrbitTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[6%] overflow-hidden">
      <header className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${scheme.accent}, ${scheme.muted})`, color: scheme.bg }}>
          <span style={{ fontSize: fontSize * 1.6, fontWeight: 700 }}>{(cv.personal.fullName || "Y")[0]}</span>
        </div>
        <div className="flex-1">
          <h1 style={{ fontSize: fontSize * 1.8, fontWeight: 700, color: scheme.text, lineHeight: 1 }}>{cv.personal.fullName || "Your Name"}</h1>
          <p style={{ fontSize: fontSize * 0.95, color: scheme.accent, marginTop: 2 }}>{cv.personal.title || "Title"}</p>
        </div>
        <div className="text-right"><Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="col" /></div>
      </header>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 space-y-3">
          {cv.summary && (<div><SectionTitle title="About" scheme={scheme} fontSize={fontSize} /><p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.5 }}>{cv.summary}</p></div>)}
          <div><SectionTitle title="Experience" scheme={scheme} fontSize={fontSize} /><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
        <div className="space-y-3">
          <div><SectionTitle title="Skills" scheme={scheme} fontSize={fontSize} /><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="bar" /></div>
          <div><SectionTitle title="Education" scheme={scheme} fontSize={fontSize} /><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
      </div>
    </div>
  );
}

export function PrismTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full overflow-hidden">
      <div className="grid grid-cols-4">
        <div style={{ background: scheme.accent, color: scheme.bg === "#FFFFFF" ? "#FFFFFF" : scheme.text }} className="p-4 col-span-1">
          <h1 style={{ fontSize: fontSize * 1.4, fontWeight: 700 }}>{cv.personal.fullName || "Your Name"}</h1>
          <p style={{ fontSize: fontSize * 0.85, opacity: 0.85, marginTop: 2 }}>{cv.personal.title || "Title"}</p>
          <div className="mt-4 space-y-2">
            <div><h3 style={{ fontSize: fontSize * 0.7, fontWeight: 700, opacity: 0.7, textTransform: "uppercase" }}>Contact</h3><Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="col" /></div>
            <div><h3 style={{ fontSize: fontSize * 0.7, fontWeight: 700, opacity: 0.7, textTransform: "uppercase", marginTop: 6 }}>Skills</h3><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="dot" /></div>
          </div>
        </div>
        <div className="col-span-3 p-5">
          {cv.summary && (<div className="mb-3"><SectionTitle title="Profile" scheme={scheme} fontSize={fontSize} /><p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.5 }}>{cv.summary}</p></div>)}
          <div className="mb-3"><SectionTitle title="Experience" scheme={scheme} fontSize={fontSize} /><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
          <div><SectionTitle title="Education" scheme={scheme} fontSize={fontSize} /><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
      </div>
    </div>
  );
}

export function FluxTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[6%] overflow-hidden">
      <header className="mb-4" style={{ background: `linear-gradient(135deg, ${scheme.accent}10, transparent)`, padding: "12px", borderRadius: 8 }}>
        <h1 style={{ fontSize: fontSize * 2.2, fontWeight: 800, color: scheme.text, lineHeight: 1.1 }}>{cv.personal.fullName || "Your Name"}</h1>
        <p style={{ fontSize: fontSize * 1.0, color: scheme.accent, marginTop: 2 }}>{cv.personal.title || "Title"}</p>
        <div className="mt-2"><Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="row" /></div>
      </header>
      <div className="space-y-3">
        {cv.summary && (<div><h3 style={{ fontSize: fontSize * 0.95, fontWeight: 700, color: scheme.accent, marginBottom: 2, textTransform: "uppercase" }}>Profile</h3><p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.5 }}>{cv.summary}</p></div>)}
        <div><h3 style={{ fontSize: fontSize * 0.95, fontWeight: 700, color: scheme.accent, marginBottom: 2, textTransform: "uppercase" }}>Experience</h3><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><h3 style={{ fontSize: fontSize * 0.95, fontWeight: 700, color: scheme.accent, marginBottom: 2, textTransform: "uppercase" }}>Skills</h3><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="tag" /></div>
          <div><h3 style={{ fontSize: fontSize * 0.95, fontWeight: 700, color: scheme.accent, marginBottom: 2, textTransform: "uppercase" }}>Education</h3><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
      </div>
    </div>
  );
}

export function VectorTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[6%] overflow-hidden">
      <header className="mb-3 pb-2" style={{ borderBottom: `1px solid ${scheme.accent}40` }}>
        <div className="grid grid-cols-3 items-end">
          <div className="col-span-2">
            <h1 style={{ fontSize: fontSize * 2.0, fontWeight: 700, color: scheme.text, lineHeight: 1 }}>{cv.personal.fullName || "Your Name"}</h1>
            <p style={{ fontSize: fontSize * 0.9, color: scheme.accent, marginTop: 2 }}>{cv.personal.title || "Title"}</p>
          </div>
          <div className="text-right"><Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="col" /></div>
        </div>
      </header>
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-8 space-y-3">
          {cv.summary && (<div><SectionTitle title="Profile" scheme={scheme} fontSize={fontSize} /><p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.5 }}>{cv.summary}</p></div>)}
          <div><SectionTitle title="Experience" scheme={scheme} fontSize={fontSize} /><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
        <div className="col-span-4 space-y-3">
          <div><SectionTitle title="Skills" scheme={scheme} fontSize={fontSize} /><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="bar" /></div>
          <div><SectionTitle title="Education" scheme={scheme} fontSize={fontSize} /><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
      </div>
    </div>
  );
}

export function QuantumTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[6%] overflow-hidden">
      <header className="mb-3 flex items-center gap-3">
        <div className="w-1 h-12 rounded" style={{ background: `linear-gradient(to bottom, ${scheme.accent}, ${scheme.muted})` }} />
        <div>
          <h1 style={{ fontSize: fontSize * 1.8, fontWeight: 700, color: scheme.text, lineHeight: 1 }}>{cv.personal.fullName || "Your Name"}</h1>
          <p style={{ fontSize: fontSize * 0.9, color: scheme.accent, marginTop: 2 }}>{cv.personal.title || "Title"}</p>
        </div>
      </header>
      <div className="mt-2"><Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="comma" /></div>
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="col-span-2 space-y-3">
          {cv.summary && (<div><SectionTitle title="Profile" scheme={scheme} fontSize={fontSize} /><p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.5 }}>{cv.summary}</p></div>)}
          <div><SectionTitle title="Experience" scheme={scheme} fontSize={fontSize} /><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
        <div className="space-y-3">
          <div><SectionTitle title="Skills" scheme={scheme} fontSize={fontSize} /><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="bar" /></div>
          <div><SectionTitle title="Education" scheme={scheme} fontSize={fontSize} /><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
      </div>
    </div>
  );
}

export function SignalTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  const mono = "'JetBrains Mono', 'Courier New', monospace";
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: mono, fontSize }} className="w-full h-full p-[6%] overflow-hidden">
      <header className="pb-2 mb-3" style={{ borderBottom: `2px solid ${scheme.accent}` }}>
        <div style={{ color: scheme.muted, fontSize: fontSize * 0.7 }}>{"// resume.v1"}</div>
        <h1 style={{ fontSize: fontSize * 1.8, fontWeight: 700, color: scheme.text, lineHeight: 1, marginTop: 2 }}>{cv.personal.fullName || "your_name"}</h1>
        <p style={{ fontSize: fontSize * 0.9, color: scheme.accent, marginTop: 2 }}>{cv.personal.title || "title"}</p>
        <div className="mt-1"><Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="comma" /></div>
      </header>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 space-y-3">
          {cv.summary && (<div><h3 style={{ fontSize: fontSize * 0.85, fontWeight: 700, color: scheme.accent }}>{"// profile"}</h3><p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.5, marginTop: 2 }}>{cv.summary}</p></div>)}
          <div><h3 style={{ fontSize: fontSize * 0.85, fontWeight: 700, color: scheme.accent }}>{"// experience"}</h3><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
        <div className="space-y-3">
          <div><h3 style={{ fontSize: fontSize * 0.85, fontWeight: 700, color: scheme.accent }}>{"// skills"}</h3><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="tag" /></div>
          <div><h3 style={{ fontSize: fontSize * 0.85, fontWeight: 700, color: scheme.accent }}>{"// education"}</h3><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
      </div>
    </div>
  );
}

// === BOLD & COLORFUL ===

export function VividTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full overflow-hidden flex">
      <div style={{ background: scheme.accent, color: scheme.bg === "#FFFFFF" ? "#FFFFFF" : scheme.text }} className="w-1/3 p-4 space-y-3">
        <h1 style={{ fontSize: fontSize * 1.6, fontWeight: 800, lineHeight: 1.1 }}>{cv.personal.fullName || "Your Name"}</h1>
        <p style={{ fontSize: fontSize * 0.85, opacity: 0.85 }}>{cv.personal.title || "Title"}</p>
        <div className="mt-4 space-y-2">
          <div><h3 style={{ fontSize: fontSize * 0.7, fontWeight: 700, opacity: 0.7, textTransform: "uppercase" }}>Contact</h3><Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="col" /></div>
          <div><h3 style={{ fontSize: fontSize * 0.7, fontWeight: 700, opacity: 0.7, textTransform: "uppercase", marginTop: 6 }}>Skills</h3><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="dot" /></div>
          <div><h3 style={{ fontSize: fontSize * 0.7, fontWeight: 700, opacity: 0.7, textTransform: "uppercase", marginTop: 6 }}>Languages</h3>
            {cv.languages.slice(0, 3).map((l, i) => <div key={i} style={{ fontSize: fontSize * 0.75 }}>{l.name} — {l.proficiency}</div>)}
          </div>
        </div>
      </div>
      <div className="flex-1 p-4 space-y-3">
        {cv.summary && (<div><SectionTitle title="Profile" scheme={scheme} fontSize={fontSize} /><p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.5 }}>{cv.summary}</p></div>)}
        <div><SectionTitle title="Experience" scheme={scheme} fontSize={fontSize} /><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        <div><SectionTitle title="Education" scheme={scheme} fontSize={fontSize} /><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
      </div>
    </div>
  );
}

export function CoralTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[6%] overflow-hidden">
      <header className="mb-3 p-4 rounded-lg" style={{ background: `linear-gradient(135deg, ${scheme.accent}20, ${scheme.accent}05)` }}>
        <h1 style={{ fontSize: fontSize * 2.0, fontWeight: 700, color: scheme.text, lineHeight: 1 }}>{cv.personal.fullName || "Your Name"}</h1>
        <p style={{ fontSize: fontSize * 0.95, color: scheme.accent, marginTop: 2 }}>{cv.personal.title || "Title"}</p>
        <div className="mt-2"><Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="row" /></div>
      </header>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 space-y-3">
          {cv.summary && (<div><SectionTitle title="Profile" scheme={scheme} fontSize={fontSize} /><p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.5 }}>{cv.summary}</p></div>)}
          <div><SectionTitle title="Experience" scheme={scheme} fontSize={fontSize} /><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
        <div className="space-y-3">
          <div><SectionTitle title="Skills" scheme={scheme} fontSize={fontSize} /><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="tag" /></div>
          <div><SectionTitle title="Education" scheme={scheme} fontSize={fontSize} /><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
      </div>
    </div>
  );
}

export function ElectricTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[6%] overflow-hidden">
      <header className="mb-3 flex items-end justify-between" style={{ borderBottom: `2px solid ${scheme.accent}`, paddingBottom: 8 }}>
        <div>
          <h1 style={{ fontSize: fontSize * 2.2, fontWeight: 800, color: scheme.text, lineHeight: 1, background: `linear-gradient(135deg, ${scheme.accent}, ${scheme.muted})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{cv.personal.fullName || "Your Name"}</h1>
          <p style={{ fontSize: fontSize * 0.95, color: scheme.muted, marginTop: 2 }}>{cv.personal.title || "Title"}</p>
        </div>
        <Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="col" />
      </header>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          {cv.summary && (<div><SectionTitle title="Profile" scheme={scheme} fontSize={fontSize} /><p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.5 }}>{cv.summary}</p></div>)}
          <div><SectionTitle title="Experience" scheme={scheme} fontSize={fontSize} /><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
        <div className="space-y-3">
          <div><SectionTitle title="Skills" scheme={scheme} fontSize={fontSize} /><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="bar" /></div>
          <div><SectionTitle title="Projects" scheme={scheme} fontSize={fontSize} /><ProjectsList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
      </div>
    </div>
  );
}

export function SpectrumTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  const colors = [scheme.accent, scheme.muted, scheme.text];
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[6%] overflow-hidden">
      <header className="mb-3">
        <h1 style={{ fontSize: fontSize * 2.2, fontWeight: 700, color: scheme.text, lineHeight: 1 }}>{cv.personal.fullName || "Your Name"}</h1>
        <p style={{ fontSize: fontSize * 0.95, color: scheme.accent, marginTop: 2 }}>{cv.personal.title || "Title"}</p>
        <div className="mt-2 flex gap-1">
          {colors.map((c, i) => <div key={i} style={{ background: c, height: 3, flex: 1 }} />)}
        </div>
        <div className="mt-2"><Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="comma" /></div>
      </header>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-3">
          {cv.summary && (<div><SectionTitle title="Profile" scheme={scheme} fontSize={fontSize} /><p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.5 }}>{cv.summary}</p></div>)}
          <div><SectionTitle title="Experience" scheme={scheme} fontSize={fontSize} /><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
        <div className="space-y-3">
          <div><SectionTitle title="Skills" scheme={scheme} fontSize={fontSize} /><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="tag" /></div>
          <div><SectionTitle title="Education" scheme={scheme} fontSize={fontSize} /><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
      </div>
    </div>
  );
}

export function PopTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[6%] overflow-hidden">
      <header className="mb-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: scheme.accent }}>
          <span style={{ color: scheme.bg === "#FFFFFF" ? "#FFFFFF" : scheme.text, fontSize: fontSize * 1.6, fontWeight: 800 }}>{(cv.personal.fullName || "Y")[0]}</span>
        </div>
        <div>
          <h1 style={{ fontSize: fontSize * 1.8, fontWeight: 800, color: scheme.text, lineHeight: 1 }}>{cv.personal.fullName || "Your Name"}</h1>
          <p style={{ fontSize: fontSize * 0.95, color: scheme.accent, marginTop: 2 }}>{cv.personal.title || "Title"}</p>
        </div>
      </header>
      <div className="mt-2"><Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="comma" /></div>
      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="space-y-3">
          {cv.summary && (<div><SectionTitle title="About" scheme={scheme} fontSize={fontSize} /><p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.5 }}>{cv.summary}</p></div>)}
          <div><SectionTitle title="Experience" scheme={scheme} fontSize={fontSize} /><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
        <div className="space-y-3">
          <div><SectionTitle title="Skills" scheme={scheme} fontSize={fontSize} /><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="tag" /></div>
          <div><SectionTitle title="Projects" scheme={scheme} fontSize={fontSize} /><ProjectsList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
      </div>
    </div>
  );
}

export function EmberTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[6%] overflow-hidden">
      <header className="mb-3 pb-2" style={{ borderBottom: `1px solid ${scheme.accent}30` }}>
        <div className="flex items-baseline gap-2">
          <h1 style={{ fontSize: fontSize * 2.0, fontWeight: 700, color: scheme.text, lineHeight: 1 }}>{cv.personal.fullName || "Your Name"}</h1>
          <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${scheme.accent}, transparent)` }} />
        </div>
        <p style={{ fontSize: fontSize * 0.95, color: scheme.accent, marginTop: 2 }}>{cv.personal.title || "Title"}</p>
        <div className="mt-2"><Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="row" /></div>
      </header>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 space-y-3">
          {cv.summary && (<div><SectionTitle title="Profile" scheme={scheme} fontSize={fontSize} /><p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.5 }}>{cv.summary}</p></div>)}
          <div><SectionTitle title="Experience" scheme={scheme} fontSize={fontSize} /><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
        <div className="space-y-3">
          <div><SectionTitle title="Skills" scheme={scheme} fontSize={fontSize} /><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="dot" /></div>
          <div><SectionTitle title="Education" scheme={scheme} fontSize={fontSize} /><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
      </div>
    </div>
  );
}

// === CREATIVE PROFESSIONAL ===

export function CanvasProTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full overflow-hidden">
      <div style={{ background: `linear-gradient(135deg, ${scheme.accent}, ${scheme.muted})`, color: scheme.bg === "#FFFFFF" ? "#FFFFFF" : scheme.text }} className="p-5">
        <h1 style={{ fontSize: fontSize * 2.4, fontWeight: 800, lineHeight: 1 }}>{cv.personal.fullName || "Your Name"}</h1>
        <p style={{ fontSize: fontSize * 1.1, opacity: 0.9, marginTop: 4 }}>{cv.personal.title || "Title"}</p>
        <div className="mt-3"><Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="row" /></div>
      </div>
      <div className="p-5 space-y-3">
        {cv.summary && (<div><SectionTitle title="About" scheme={scheme} fontSize={fontSize} /><p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.5 }}>{cv.summary}</p></div>)}
        <div className="grid grid-cols-2 gap-3">
          <div><SectionTitle title="Experience" scheme={scheme} fontSize={fontSize} /><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
          <div><SectionTitle title="Projects" scheme={scheme} fontSize={fontSize} /><ProjectsList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><SectionTitle title="Skills" scheme={scheme} fontSize={fontSize} /><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="tag" /></div>
          <div><SectionTitle title="Education" scheme={scheme} fontSize={fontSize} /><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
      </div>
    </div>
  );
}

export function GalleryTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[6%] overflow-hidden">
      <header className="mb-4 flex items-center gap-4">
        <div className="w-16 h-16 rounded-lg overflow-hidden" style={{ background: `linear-gradient(135deg, ${scheme.accent}, ${scheme.muted})` }}>
          {cv.design.showPhoto && cv.personal.photo ? <img src={cv.personal.photo} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><span style={{ color: scheme.bg === "#FFFFFF" ? "#FFFFFF" : scheme.text, fontSize: fontSize * 1.6, fontWeight: 700 }}>{(cv.personal.fullName || "Y")[0]}</span></div>}
        </div>
        <div>
          <h1 style={{ fontSize: fontSize * 1.8, fontWeight: 700, color: scheme.text, lineHeight: 1 }}>{cv.personal.fullName || "Your Name"}</h1>
          <p style={{ fontSize: fontSize * 0.95, color: scheme.accent, marginTop: 2 }}>{cv.personal.title || "Title"}</p>
        </div>
      </header>
      <div className="mt-2"><Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="comma" /></div>
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="col-span-2 space-y-3">
          {cv.summary && (<div><SectionTitle title="About" scheme={scheme} fontSize={fontSize} /><p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.5 }}>{cv.summary}</p></div>)}
          <div><SectionTitle title="Experience" scheme={scheme} fontSize={fontSize} /><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
        <div className="space-y-3">
          <div><SectionTitle title="Featured Work" scheme={scheme} fontSize={fontSize} /><ProjectsList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
          <div><SectionTitle title="Skills" scheme={scheme} fontSize={fontSize} /><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="tag" /></div>
        </div>
      </div>
    </div>
  );
}

export function FrameTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[5%] overflow-hidden">
      <header className="text-center mb-3 p-3 rounded-lg border" style={{ borderColor: `${scheme.accent}40` }}>
        <h1 style={{ fontSize: fontSize * 2.0, fontWeight: 700, color: scheme.text, lineHeight: 1 }}>{cv.personal.fullName || "Your Name"}</h1>
        <p style={{ fontSize: fontSize * 0.9, color: scheme.accent, marginTop: 2 }}>{cv.personal.title || "Title"}</p>
        <div className="mt-2"><Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="comma" /></div>
      </header>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg border space-y-2" style={{ borderColor: `${scheme.text}15` }}>
          {cv.summary && (<><SectionTitle title="About" scheme={scheme} fontSize={fontSize} /><p style={{ color: scheme.muted, fontSize: fontSize * 0.8, lineHeight: 1.5 }}>{cv.summary}</p></>)}
        </div>
        <div className="p-3 rounded-lg border space-y-2" style={{ borderColor: `${scheme.text}15` }}>
          <SectionTitle title="Skills" scheme={scheme} fontSize={fontSize} />
          <SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="tag" />
        </div>
        <div className="p-3 rounded-lg border space-y-2 col-span-2" style={{ borderColor: `${scheme.text}15` }}>
          <SectionTitle title="Experience" scheme={scheme} fontSize={fontSize} />
          <ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} />
        </div>
      </div>
    </div>
  );
}

export function StudioProTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[6%] overflow-hidden">
      <header className="mb-4 flex items-end justify-between" style={{ borderBottom: `3px solid ${scheme.accent}`, paddingBottom: 6 }}>
        <div>
          <h1 style={{ fontSize: fontSize * 2.2, fontWeight: 800, color: scheme.text, lineHeight: 1, letterSpacing: "-0.02em" }}>{cv.personal.fullName || "Your Name"}</h1>
          <p style={{ fontSize: fontSize * 1.0, color: scheme.accent, marginTop: 2, fontStyle: "italic" }}>{cv.personal.title || "Title"}</p>
        </div>
        {cv.design.showPhoto && cv.personal.photo && (
          <div className="w-14 h-14 rounded-full overflow-hidden border-2" style={{ borderColor: scheme.accent }}>
            <img src={cv.personal.photo} alt="" className="w-full h-full object-cover" />
          </div>
        )}
      </header>
      <div className="mt-2"><Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="row" /></div>
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="col-span-2 space-y-3">
          {cv.summary && (<div><SectionTitle title="Profile" scheme={scheme} fontSize={fontSize} /><p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.5 }}>{cv.summary}</p></div>)}
          <div><SectionTitle title="Experience" scheme={scheme} fontSize={fontSize} /><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
        <div className="space-y-3">
          <div><SectionTitle title="Skills" scheme={scheme} fontSize={fontSize} /><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="bar" /></div>
          <div><SectionTitle title="Education" scheme={scheme} fontSize={fontSize} /><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
      </div>
    </div>
  );
}

export function MuseModernTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  const serif = "Georgia, serif";
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: serif, fontSize }} className="w-full h-full p-[7%] overflow-hidden">
      <header className="mb-4 text-center">
        <h1 style={{ fontSize: fontSize * 2.4, fontWeight: 400, color: scheme.text, fontStyle: "italic", letterSpacing: "0.02em" }}>{cv.personal.fullName || "Your Name"}</h1>
        <div className="flex items-center justify-center gap-2 mt-1">
          <div className="h-px w-12" style={{ background: scheme.accent }} />
          <p style={{ fontSize: fontSize * 0.85, color: scheme.accent, textTransform: "uppercase", letterSpacing: "0.2em" }}>{cv.personal.title || "Title"}</p>
          <div className="h-px w-12" style={{ background: scheme.accent }} />
        </div>
        <div className="mt-2"><Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="comma" /></div>
      </header>
      <div className="space-y-3">
        {cv.summary && (<div><h3 style={{ fontSize: fontSize * 0.95, fontWeight: 700, color: scheme.accent, fontStyle: "italic", textAlign: "center", marginBottom: 4 }}>Summary</h3><p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.6, textAlign: "center" }}>{cv.summary}</p></div>)}
        <div><h3 style={{ fontSize: fontSize * 0.95, fontWeight: 700, color: scheme.accent, fontStyle: "italic", textAlign: "center", marginBottom: 4 }}>Experience</h3><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><h3 style={{ fontSize: fontSize * 0.95, fontWeight: 700, color: scheme.accent, fontStyle: "italic", textAlign: "center", marginBottom: 4 }}>Education</h3><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
          <div><h3 style={{ fontSize: fontSize * 0.95, fontWeight: 700, color: scheme.accent, fontStyle: "italic", textAlign: "center", marginBottom: 4 }}>Skills</h3><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="dot" /></div>
        </div>
      </div>
    </div>
  );
}

export function StoryTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[6%] overflow-hidden">
      <header className="mb-4">
        <h1 style={{ fontSize: fontSize * 2.0, fontWeight: 700, color: scheme.text, lineHeight: 1 }}>{cv.personal.fullName || "Your Name"}</h1>
        <p style={{ fontSize: fontSize * 0.95, color: scheme.accent, marginTop: 2, fontStyle: "italic" }}>{cv.personal.title || "Title"}</p>
        <div className="mt-2"><Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="comma" /></div>
      </header>
      <div className="relative pl-4" style={{ borderLeft: `2px solid ${scheme.accent}` }}>
        {cv.summary && (
          <div className="mb-3">
            <div className="absolute -left-1.5 w-3 h-3 rounded-full" style={{ background: scheme.accent, marginTop: 4 }} />
            <h3 style={{ fontSize: fontSize * 0.95, fontWeight: 700, color: scheme.accent }}>Beginning</h3>
            <p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.5 }}>{cv.summary}</p>
          </div>
        )}
        {cv.experience.slice(0, 3).map((e, i) => (
          <div key={i} className="mb-3 relative">
            <div className="absolute -left-[21px] w-3 h-3 rounded-full" style={{ background: scheme.accent, marginTop: 4 }} />
            <div className="flex justify-between">
              <strong style={{ color: scheme.text, fontSize: fontSize * 0.95 }}>{e.jobTitle}</strong>
              <span style={{ color: scheme.muted, fontSize: fontSize * 0.75 }}>{e.startDate} {e.endDate && `— ${e.endDate}`}</span>
            </div>
            <div style={{ color: scheme.accent, fontSize: fontSize * 0.85 }}>{e.company}</div>
            {e.responsibilities && <p style={{ color: scheme.muted, fontSize: fontSize * 0.8, lineHeight: 1.4, marginTop: 2 }}>{e.responsibilities.split("\n")[0]}</p>}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 mt-3">
        <div><SectionTitle title="Education" scheme={scheme} fontSize={fontSize} /><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        <div><SectionTitle title="Skills" scheme={scheme} fontSize={fontSize} /><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="dot" /></div>
      </div>
    </div>
  );
}

// === EXECUTIVE & CORPORATE ===

export function ChairmanTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  const serif = "Georgia, 'Times New Roman', serif";
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: serif, fontSize }} className="w-full h-full p-[7%] overflow-hidden">
      <header className="text-center pb-3 mb-3" style={{ borderBottom: `2px solid ${scheme.accent}` }}>
        <h1 style={{ fontSize: fontSize * 2.4, fontWeight: 700, color: scheme.text, letterSpacing: "0.04em" }}>{cv.personal.fullName || "Your Name"}</h1>
        <p style={{ fontSize: fontSize * 0.95, color: scheme.accent, marginTop: 2, letterSpacing: "0.15em", textTransform: "uppercase" }}>{cv.personal.title || "Title"}</p>
        <div className="mt-2"><Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="comma" /></div>
      </header>
      {cv.summary && (<div className="mb-3"><h3 style={{ fontSize: fontSize * 1.0, fontWeight: 700, color: scheme.accent, fontStyle: "italic", marginBottom: 4, textAlign: "center" }}>Executive Summary</h3><p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.6, textAlign: "justify", fontStyle: "italic" }}>{cv.summary}</p></div>)}
      <div className="mb-3"><h3 style={{ fontSize: fontSize * 1.0, fontWeight: 700, color: scheme.accent, fontStyle: "italic", marginBottom: 4, textAlign: "center" }}>Professional Experience</h3><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><h3 style={{ fontSize: fontSize * 1.0, fontWeight: 700, color: scheme.accent, fontStyle: "italic", marginBottom: 4, textAlign: "center" }}>Education</h3><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        <div><h3 style={{ fontSize: fontSize * 1.0, fontWeight: 700, color: scheme.accent, fontStyle: "italic", marginBottom: 4, textAlign: "center" }}>Core Skills</h3><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="comma" /></div>
      </div>
    </div>
  );
}

export function BoardroomTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[6%] overflow-hidden">
      <header className="mb-3 pb-2 flex items-end justify-between" style={{ borderBottom: `3px solid ${scheme.text}` }}>
        <div>
          <h1 style={{ fontSize: fontSize * 2.0, fontWeight: 800, color: scheme.text, textTransform: "uppercase", letterSpacing: "0.04em" }}>{cv.personal.fullName || "Your Name"}</h1>
          <p style={{ fontSize: fontSize * 0.85, color: scheme.accent, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.1em" }}>{cv.personal.title || "Title"}</p>
        </div>
        <Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="col" />
      </header>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 space-y-3">
          {cv.summary && (<div><SectionTitle title="Executive Profile" scheme={scheme} fontSize={fontSize} /><p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.5 }}>{cv.summary}</p></div>)}
          <div><SectionTitle title="Professional Experience" scheme={scheme} fontSize={fontSize} /><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
        <div className="space-y-3">
          <div><SectionTitle title="Core Competencies" scheme={scheme} fontSize={fontSize} /><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="dot" /></div>
          <div><SectionTitle title="Education" scheme={scheme} fontSize={fontSize} /><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
      </div>
    </div>
  );
}

export function LegacyTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  const serif = "Georgia, serif";
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: serif, fontSize }} className="w-full h-full p-[7%] overflow-hidden">
      <header className="mb-4 text-center">
        <h1 style={{ fontSize: fontSize * 2.6, fontWeight: 700, color: scheme.text, letterSpacing: "0.04em" }}>{cv.personal.fullName || "Your Name"}</h1>
        <div className="flex items-center justify-center gap-3 mt-1">
          <div className="h-px w-16" style={{ background: scheme.accent }} />
          <p style={{ fontSize: fontSize * 0.85, color: scheme.accent, fontStyle: "italic" }}>{cv.personal.title || "Title"}</p>
          <div className="h-px w-16" style={{ background: scheme.accent }} />
        </div>
        <div className="mt-2"><Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="comma" /></div>
      </header>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 space-y-3">
          {cv.summary && (<div><h3 style={{ fontSize: fontSize * 0.95, fontWeight: 700, color: scheme.accent, fontStyle: "italic", marginBottom: 4 }}>Profile</h3><p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.6, textAlign: "justify" }}>{cv.summary}</p></div>)}
          <div><h3 style={{ fontSize: fontSize * 0.95, fontWeight: 700, color: scheme.accent, fontStyle: "italic", marginBottom: 4 }}>Experience</h3><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
        <div className="space-y-3">
          <div><h3 style={{ fontSize: fontSize * 0.95, fontWeight: 700, color: scheme.accent, fontStyle: "italic", marginBottom: 4 }}>Education</h3><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
          <div><h3 style={{ fontSize: fontSize * 0.95, fontWeight: 700, color: scheme.accent, fontStyle: "italic", marginBottom: 4 }}>Skills</h3><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="dot" /></div>
        </div>
      </div>
    </div>
  );
}

export function SummitProTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[6%] overflow-hidden">
      <header className="mb-3 flex items-end justify-between" style={{ borderBottom: `2px solid ${scheme.accent}` }}>
        <div>
          <div style={{ fontSize: fontSize * 0.7, color: scheme.muted, textTransform: "uppercase", letterSpacing: "0.15em" }}>Curriculum Vitae</div>
          <h1 style={{ fontSize: fontSize * 2.2, fontWeight: 700, color: scheme.text, lineHeight: 1.1 }}>{cv.personal.fullName || "Your Name"}</h1>
          <p style={{ fontSize: fontSize * 0.95, color: scheme.accent, marginTop: 2 }}>{cv.personal.title || "Title"}</p>
        </div>
        <Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="col" />
      </header>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 space-y-3">
          {cv.summary && (<div><SectionTitle title="Profile" scheme={scheme} fontSize={fontSize} /><p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.5 }}>{cv.summary}</p></div>)}
          <div><SectionTitle title="Experience" scheme={scheme} fontSize={fontSize} /><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
        <div className="space-y-3">
          <div><SectionTitle title="Skills" scheme={scheme} fontSize={fontSize} /><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="bar" /></div>
          <div><SectionTitle title="Education" scheme={scheme} fontSize={fontSize} /><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
      </div>
    </div>
  );
}

export function CapitalTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[6%] overflow-hidden">
      <header className="mb-3 pb-2" style={{ borderBottom: `1px solid ${scheme.accent}` }}>
        <h1 style={{ fontSize: fontSize * 2.0, fontWeight: 700, color: scheme.text, textTransform: "uppercase", letterSpacing: "0.05em" }}>{cv.personal.fullName || "Your Name"}</h1>
        <div className="flex justify-between items-end mt-1">
          <p style={{ fontSize: fontSize * 0.85, color: scheme.accent }}>{cv.personal.title || "Title"}</p>
          <Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="comma" />
        </div>
      </header>
      {cv.summary && (<div className="mb-3"><SectionTitle title="Profile" scheme={scheme} fontSize={fontSize} /><p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.5 }}>{cv.summary}</p></div>)}
      <div className="mb-3"><SectionTitle title="Professional Experience" scheme={scheme} fontSize={fontSize} /><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><SectionTitle title="Education" scheme={scheme} fontSize={fontSize} /><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        <div><SectionTitle title="Technical Skills" scheme={scheme} fontSize={fontSize} /><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="comma" /></div>
      </div>
    </div>
  );
}

export function DirectorTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[7%] overflow-hidden">
      <header className="mb-3">
        <h1 style={{ fontSize: fontSize * 2.4, fontWeight: 300, color: scheme.text, letterSpacing: "0.02em" }}>{cv.personal.fullName || "Your Name"}</h1>
        <p style={{ fontSize: fontSize * 0.95, color: scheme.accent, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.15em" }}>{cv.personal.title || "Title"}</p>
        <div className="mt-2"><Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="comma" /></div>
      </header>
      <div className="space-y-3">
        {cv.summary && (<div><SectionTitle title="Profile" scheme={scheme} fontSize={fontSize} /><p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.5 }}>{cv.summary}</p></div>)}
        <div><SectionTitle title="Key Achievements" scheme={scheme} fontSize={fontSize} />
          {cv.experience.slice(0, 3).map((e, i) => (
            <div key={i} className="mb-1">
              <div className="flex justify-between">
                <strong style={{ color: scheme.text, fontSize: fontSize * 0.9 }}>{e.jobTitle}</strong>
                <span style={{ color: scheme.muted, fontSize: fontSize * 0.7 }}>{e.company}</span>
              </div>
              {e.achievements && <p style={{ color: scheme.muted, fontSize: fontSize * 0.8, marginTop: 1, lineHeight: 1.4 }}>★ {e.achievements.split("\n")[0]}</p>}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><SectionTitle title="Education" scheme={scheme} fontSize={fontSize} /><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
          <div><SectionTitle title="Skills" scheme={scheme} fontSize={fontSize} /><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="dot" /></div>
        </div>
      </div>
    </div>
  );
}

// === TECHNOLOGY ===

export function DevGridTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[6%] overflow-hidden">
      <header className="mb-3 flex items-end justify-between" style={{ borderBottom: `1px dashed ${scheme.accent}` }}>
        <div>
          <h1 style={{ fontSize: fontSize * 1.8, fontWeight: 700, color: scheme.text, lineHeight: 1, fontFamily: "'JetBrains Mono', monospace" }}>{cv.personal.fullName || "your_name"}</h1>
          <p style={{ fontSize: fontSize * 0.85, color: scheme.accent, marginTop: 2 }}>{cv.personal.title || "title"}</p>
        </div>
        <Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="col" />
      </header>
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-3">
          <div className="p-2 rounded border" style={{ borderColor: `${scheme.accent}30` }}>
            <h3 style={{ fontSize: fontSize * 0.7, fontWeight: 700, color: scheme.accent, textTransform: "uppercase" }}>Stack</h3>
            <SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="tag" />
          </div>
        </div>
        <div className="col-span-9 space-y-2">
          {cv.summary && (<div><h3 style={{ fontSize: fontSize * 0.85, fontWeight: 700, color: scheme.accent }}>{"// profile"}</h3><p style={{ color: scheme.muted, fontSize: fontSize * 0.8, lineHeight: 1.5 }}>{cv.summary}</p></div>)}
          <div><h3 style={{ fontSize: fontSize * 0.85, fontWeight: 700, color: scheme.accent }}>{"// experience"}</h3><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
        <div className="col-span-12"><h3 style={{ fontSize: fontSize * 0.85, fontWeight: 700, color: scheme.accent }}>{"// education"}</h3><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
      </div>
    </div>
  );
}

export function StackTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[6%] overflow-hidden">
      <header className="mb-3 pb-2" style={{ borderBottom: `2px solid ${scheme.accent}` }}>
        <h1 style={{ fontSize: fontSize * 1.8, fontWeight: 700, color: scheme.text, lineHeight: 1 }}>{cv.personal.fullName || "Your Name"}</h1>
        <p style={{ fontSize: fontSize * 0.85, color: scheme.accent, marginTop: 2 }}>{cv.personal.title || "Title"}</p>
        <div className="mt-2"><Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="comma" /></div>
      </header>
      <div className="mb-3">
        <SectionTitle title="Tech Stack" scheme={scheme} fontSize={fontSize} />
        <div className="grid grid-cols-2 gap-1.5">
          {cv.skills.slice(0, 8).map((s, i) => (
            <div key={i} className="flex items-center gap-2 p-1.5 rounded" style={{ background: `${scheme.accent}10` }}>
              <div className="w-2 h-2 rounded-sm" style={{ background: scheme.accent }} />
              <span style={{ fontSize: fontSize * 0.75, color: scheme.text }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-3"><SectionTitle title="Experience" scheme={scheme} fontSize={fontSize} /><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
      <div><SectionTitle title="Education" scheme={scheme} fontSize={fontSize} /><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
    </div>
  );
}

export function ByteTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  const mono = "'JetBrains Mono', monospace";
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: mono, fontSize }} className="w-full h-full p-[6%] overflow-hidden">
      <header className="mb-3">
        <h1 style={{ fontSize: fontSize * 1.6, fontWeight: 700, color: scheme.text }}>{">"} {cv.personal.fullName || "your_name"}</h1>
        <p style={{ fontSize: fontSize * 0.85, color: scheme.accent, marginTop: 1 }}>{cv.personal.title || "title"}</p>
        <div style={{ fontSize: fontSize * 0.7, color: scheme.muted, marginTop: 2 }} className="flex flex-wrap gap-x-2">
          {cv.personal.email && <span>{`{ email: "${cv.personal.email}" }`}</span>}
          {cv.personal.github && <span>{`{ github: "${cv.personal.github}" }`}</span>}
        </div>
      </header>
      <div className="space-y-2">
        {cv.summary && (<div><h3 style={{ fontSize: fontSize * 0.8, fontWeight: 700, color: scheme.accent }}>{"// summary"}</h3><p style={{ color: scheme.muted, fontSize: fontSize * 0.8, lineHeight: 1.5 }}>{cv.summary}</p></div>)}
        <div><h3 style={{ fontSize: fontSize * 0.8, fontWeight: 700, color: scheme.accent }}>{"// experience"}</h3><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        <div className="grid grid-cols-2 gap-2">
          <div><h3 style={{ fontSize: fontSize * 0.8, fontWeight: 700, color: scheme.accent }}>{"// skills"}</h3><div style={{ fontSize: fontSize * 0.75, color: scheme.muted }}>[{cv.skills.join(", ")}]</div></div>
          <div><h3 style={{ fontSize: fontSize * 0.8, fontWeight: 700, color: scheme.accent }}>{"// education"}</h3><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
      </div>
    </div>
  );
}

export function SystemTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[6%] overflow-hidden">
      <header className="mb-3 pb-2 flex items-end justify-between" style={{ borderBottom: `1px solid ${scheme.text}30` }}>
        <div>
          <h1 style={{ fontSize: fontSize * 2.0, fontWeight: 700, color: scheme.text, lineHeight: 1 }}>{cv.personal.fullName || "Your Name"}</h1>
          <p style={{ fontSize: fontSize * 0.9, color: scheme.accent, marginTop: 2, fontFamily: "'JetBrains Mono', monospace" }}>{cv.personal.title || "Title"}</p>
        </div>
        <div style={{ fontSize: fontSize * 0.7, color: scheme.muted, fontFamily: "'JetBrains Mono', monospace" }}>
          {cv.personal.email && <div>{`> ${cv.personal.email}`}</div>}
          {cv.personal.github && <div>{`> ${cv.personal.github}`}</div>}
        </div>
      </header>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-3">
          {cv.summary && (<div><SectionTitle title="Profile" scheme={scheme} fontSize={fontSize} /><p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.5 }}>{cv.summary}</p></div>)}
          <div><SectionTitle title="Experience" scheme={scheme} fontSize={fontSize} /><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
        <div className="space-y-3">
          <div><SectionTitle title="Skills" scheme={scheme} fontSize={fontSize} />
            <div className="space-y-1">
              {cv.skills.slice(0, 8).map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span style={{ fontSize: fontSize * 0.7, color: scheme.accent, fontFamily: "monospace" }}>{`[ ${String(i).padStart(2, "0")} ]`}</span>
                  <span style={{ fontSize: fontSize * 0.8, color: scheme.text }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
          <div><SectionTitle title="Education" scheme={scheme} fontSize={fontSize} /><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
      </div>
    </div>
  );
}

export function BuildTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[6%] overflow-hidden">
      <header className="mb-3">
        <h1 style={{ fontSize: fontSize * 2.0, fontWeight: 700, color: scheme.text, lineHeight: 1 }}>{cv.personal.fullName || "Your Name"}</h1>
        <p style={{ fontSize: fontSize * 0.95, color: scheme.accent, marginTop: 2 }}>{cv.personal.title || "Title"}</p>
        <div className="mt-2"><Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="comma" /></div>
      </header>
      <div className="mb-3"><SectionTitle title="Projects" scheme={scheme} fontSize={fontSize} />
        <div className="grid grid-cols-2 gap-2">
          {cv.projects.slice(0, 4).map((p, i) => (
            <div key={i} className="p-2 rounded" style={{ background: `${scheme.accent}10`, borderLeft: `2px solid ${scheme.accent}` }}>
              <div style={{ color: scheme.text, fontWeight: 600, fontSize: fontSize * 0.85 }}>{p.name}</div>
              <div style={{ color: scheme.muted, fontSize: fontSize * 0.7, marginTop: 1 }}>{Array.isArray(p.technologies) ? p.technologies.join(", ") : p.technologies}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><SectionTitle title="Experience" scheme={scheme} fontSize={fontSize} /><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        <div><SectionTitle title="Skills" scheme={scheme} fontSize={fontSize} /><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="tag" /></div>
      </div>
    </div>
  );
}

export function CloudTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[6%] overflow-hidden">
      <header className="mb-3 p-3 rounded-lg" style={{ background: `linear-gradient(135deg, ${scheme.accent}10, transparent)`, border: `1px solid ${scheme.accent}30` }}>
        <h1 style={{ fontSize: fontSize * 1.8, fontWeight: 700, color: scheme.text, lineHeight: 1 }}>{cv.personal.fullName || "Your Name"}</h1>
        <p style={{ fontSize: fontSize * 0.9, color: scheme.accent, marginTop: 2 }}>{cv.personal.title || "Title"}</p>
        <div className="mt-2"><Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="row" /></div>
      </header>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 space-y-3">
          {cv.summary && (<div><SectionTitle title="Profile" scheme={scheme} fontSize={fontSize} /><p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.5 }}>{cv.summary}</p></div>)}
          <div><SectionTitle title="Experience" scheme={scheme} fontSize={fontSize} /><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
        <div className="space-y-3">
          <div><SectionTitle title="Skills" scheme={scheme} fontSize={fontSize} /><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="bar" /></div>
          <div><SectionTitle title="Education" scheme={scheme} fontSize={fontSize} /><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
      </div>
    </div>
  );
}

// === STUDENT & FRESHER ===

export function FirstStepTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[6%] overflow-hidden">
      <header className="mb-3 text-center">
        <h1 style={{ fontSize: fontSize * 2.2, fontWeight: 700, color: scheme.text, lineHeight: 1 }}>{cv.personal.fullName || "Your Name"}</h1>
        <p style={{ fontSize: fontSize * 0.95, color: scheme.accent, marginTop: 2 }}>{cv.personal.title || "Title"}</p>
        <div className="mt-2"><Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="comma" /></div>
      </header>
      <div className="grid grid-cols-2 gap-3">
        <div><SectionTitle title="Education" scheme={scheme} fontSize={fontSize} /><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        <div><SectionTitle title="Skills" scheme={scheme} fontSize={fontSize} /><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="tag" /></div>
      </div>
      {cv.summary && (<div className="mt-3"><SectionTitle title="Objective" scheme={scheme} fontSize={fontSize} /><p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.5 }}>{cv.summary}</p></div>)}
      <div className="mt-3"><SectionTitle title="Experience" scheme={scheme} fontSize={fontSize} /><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
    </div>
  );
}

export function MomentumTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[6%] overflow-hidden">
      <header className="mb-3 pb-2" style={{ borderBottom: `2px solid ${scheme.accent}` }}>
        <h1 style={{ fontSize: fontSize * 2.0, fontWeight: 700, color: scheme.text, lineHeight: 1 }}>{cv.personal.fullName || "Your Name"}</h1>
        <p style={{ fontSize: fontSize * 0.9, color: scheme.accent, marginTop: 2 }}>{cv.personal.title || "Title"}</p>
        <div className="mt-2"><Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="comma" /></div>
      </header>
      <div className="grid grid-cols-2 gap-3">
        <div><SectionTitle title="Projects" scheme={scheme} fontSize={fontSize} /><ProjectsList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        <div><SectionTitle title="Certifications" scheme={scheme} fontSize={fontSize} />
          {cv.certifications.slice(0, 3).map((c, i) => (
            <div key={i} className="mb-1 p-1.5 rounded" style={{ background: `${scheme.accent}10` }}>
              <div style={{ color: scheme.text, fontWeight: 600, fontSize: fontSize * 0.85 }}>{c.name}</div>
              <div style={{ color: scheme.muted, fontSize: fontSize * 0.7 }}>{c.issuer} · {c.date}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div><SectionTitle title="Education" scheme={scheme} fontSize={fontSize} /><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        <div><SectionTitle title="Skills" scheme={scheme} fontSize={fontSize} /><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="tag" /></div>
      </div>
    </div>
  );
}

export function ScholarTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  const serif = "Georgia, serif";
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: serif, fontSize }} className="w-full h-full p-[7%] overflow-hidden">
      <header className="mb-3 text-center pb-2" style={{ borderBottom: `1px solid ${scheme.accent}` }}>
        <h1 style={{ fontSize: fontSize * 2.0, fontWeight: 700, color: scheme.text }}>{cv.personal.fullName || "Your Name"}</h1>
        <p style={{ fontSize: fontSize * 0.85, color: scheme.accent, marginTop: 2, fontStyle: "italic" }}>{cv.personal.title || "Title"}</p>
        <div className="mt-2"><Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="comma" /></div>
      </header>
      <div className="space-y-3">
        {cv.summary && (<div><h3 style={{ fontSize: fontSize * 0.95, fontWeight: 700, color: scheme.accent, fontStyle: "italic", marginBottom: 4 }}>Research Statement</h3><p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.6, textAlign: "justify" }}>{cv.summary}</p></div>)}
        <div><h3 style={{ fontSize: fontSize * 0.95, fontWeight: 700, color: scheme.accent, fontStyle: "italic", marginBottom: 4 }}>Education</h3><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        <div><h3 style={{ fontSize: fontSize * 0.95, fontWeight: 700, color: scheme.accent, fontStyle: "italic", marginBottom: 4 }}>Awards & Honors</h3>
          {cv.awards.slice(0, 3).map((a, i) => (
            <div key={i} style={{ color: scheme.muted, fontSize: fontSize * 0.85, marginBottom: 2 }}>
              <strong style={{ color: scheme.text }}>{a.title}</strong> — {a.issuer}, {a.date}
            </div>
          ))}
        </div>
        <div><h3 style={{ fontSize: fontSize * 0.95, fontWeight: 700, color: scheme.accent, fontStyle: "italic", marginBottom: 4 }}>Skills</h3><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="comma" /></div>
      </div>
    </div>
  );
}

export function InternTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[7%] overflow-hidden">
      <header className="mb-3">
        <h1 style={{ fontSize: fontSize * 2.2, fontWeight: 700, color: scheme.text, lineHeight: 1 }}>{cv.personal.fullName || "Your Name"}</h1>
        <p style={{ fontSize: fontSize * 0.95, color: scheme.accent, marginTop: 2 }}>{cv.personal.title || "Title"}</p>
        <div className="mt-2"><Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="comma" /></div>
      </header>
      {cv.summary && (<div className="mb-3 p-3 rounded" style={{ background: `${scheme.accent}08`, borderLeft: `3px solid ${scheme.accent}` }}><p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.5, fontStyle: "italic" }}>{cv.summary}</p></div>)}
      <div className="grid grid-cols-2 gap-3">
        <div><SectionTitle title="Education" scheme={scheme} fontSize={fontSize} /><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        <div><SectionTitle title="Skills" scheme={scheme} fontSize={fontSize} /><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="tag" /></div>
      </div>
      <div className="mt-3"><SectionTitle title="Projects" scheme={scheme} fontSize={fontSize} /><ProjectsList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
    </div>
  );
}

export function FutureTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[6%] overflow-hidden">
      <header className="mb-3 p-3 rounded-xl" style={{ background: `linear-gradient(135deg, ${scheme.accent}, ${scheme.muted})`, color: scheme.bg === "#FFFFFF" ? "#FFFFFF" : scheme.text }}>
        <h1 style={{ fontSize: fontSize * 1.8, fontWeight: 800, lineHeight: 1 }}>{cv.personal.fullName || "Your Name"}</h1>
        <p style={{ fontSize: fontSize * 0.95, opacity: 0.9, marginTop: 2 }}>{cv.personal.title || "Title"}</p>
      </header>
      <div className="mt-2"><Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="row" /></div>
      <div className="grid grid-cols-3 gap-3 mt-3">
        <div className="col-span-2 space-y-3">
          {cv.summary && (<div><SectionTitle title="About" scheme={scheme} fontSize={fontSize} /><p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.5 }}>{cv.summary}</p></div>)}
          <div><SectionTitle title="Experience" scheme={scheme} fontSize={fontSize} /><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
        <div className="space-y-3">
          <div><SectionTitle title="Education" scheme={scheme} fontSize={fontSize} /><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
          <div><SectionTitle title="Skills" scheme={scheme} fontSize={fontSize} /><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="bar" /></div>
        </div>
      </div>
    </div>
  );
}

export function SparkTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[6%] overflow-hidden">
      <header className="mb-3 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${scheme.accent}, ${scheme.muted})` }}>
          <span style={{ color: scheme.bg === "#FFFFFF" ? "#FFFFFF" : scheme.text, fontSize: fontSize * 1.4, fontWeight: 800 }}>{(cv.personal.fullName || "Y")[0]}</span>
        </div>
        <div>
          <h1 style={{ fontSize: fontSize * 1.6, fontWeight: 700, color: scheme.text, lineHeight: 1 }}>{cv.personal.fullName || "Your Name"}</h1>
          <p style={{ fontSize: fontSize * 0.85, color: scheme.accent, marginTop: 1 }}>{cv.personal.title || "Title"}</p>
        </div>
      </header>
      <div className="mt-2"><Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="comma" /></div>
      <div className="grid grid-cols-2 gap-3 mt-3">
        <div><SectionTitle title="Education" scheme={scheme} fontSize={fontSize} /><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        <div><SectionTitle title="Skills" scheme={scheme} fontSize={fontSize} /><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="tag" /></div>
      </div>
      <div className="mt-3"><SectionTitle title="Experience" scheme={scheme} fontSize={fontSize} /><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
    </div>
  );
}

// === UNIQUE LAYOUTS ===

export function TimelineTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[6%] overflow-hidden">
      <header className="mb-4">
        <h1 style={{ fontSize: fontSize * 2.0, fontWeight: 700, color: scheme.text, lineHeight: 1 }}>{cv.personal.fullName || "Your Name"}</h1>
        <p style={{ fontSize: fontSize * 0.95, color: scheme.accent, marginTop: 2 }}>{cv.personal.title || "Title"}</p>
        <div className="mt-2"><Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="comma" /></div>
      </header>
      <div className="relative pl-4" style={{ borderLeft: `2px solid ${scheme.accent}` }}>
        {cv.experience.slice(0, 4).map((e, i) => (
          <div key={i} className="mb-3 relative">
            <div className="absolute -left-[21px] w-3 h-3 rounded-full" style={{ background: scheme.accent, marginTop: 4, border: `2px solid ${scheme.bg}` }} />
            <div style={{ fontSize: fontSize * 0.7, color: scheme.accent, fontWeight: 700 }}>{e.startDate} {e.endDate && `— ${e.endDate}`}</div>
            <strong style={{ color: scheme.text, fontSize: fontSize * 0.95 }}>{e.jobTitle}</strong>
            <div style={{ color: scheme.muted, fontSize: fontSize * 0.85 }}>{e.company}{e.location && ` · ${e.location}`}</div>
            {e.responsibilities && <p style={{ color: scheme.muted, fontSize: fontSize * 0.8, lineHeight: 1.4, marginTop: 2 }}>{e.responsibilities.split("\n")[0]}</p>}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 mt-3">
        <div><SectionTitle title="Education" scheme={scheme} fontSize={fontSize} /><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        <div><SectionTitle title="Skills" scheme={scheme} fontSize={fontSize} /><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="dot" /></div>
      </div>
    </div>
  );
}

export function SplitTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full overflow-hidden">
      <div className="grid grid-cols-5">
        <div className="col-span-2 p-4" style={{ background: `${scheme.accent}10`, borderRight: `2px solid ${scheme.accent}` }}>
          <h1 style={{ fontSize: fontSize * 1.6, fontWeight: 700, color: scheme.text, lineHeight: 1 }}>{cv.personal.fullName || "Your Name"}</h1>
          <p style={{ fontSize: fontSize * 0.85, color: scheme.accent, marginTop: 2 }}>{cv.personal.title || "Title"}</p>
          <div className="mt-4 space-y-3">
            <div><h3 style={{ fontSize: fontSize * 0.7, fontWeight: 700, color: scheme.accent, textTransform: "uppercase" }}>Contact</h3><Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="col" /></div>
            <div><h3 style={{ fontSize: fontSize * 0.7, fontWeight: 700, color: scheme.accent, textTransform: "uppercase", marginTop: 6 }}>Skills</h3><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="bar" /></div>
            <div><h3 style={{ fontSize: fontSize * 0.7, fontWeight: 700, color: scheme.accent, textTransform: "uppercase", marginTop: 6 }}>Education</h3><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
          </div>
        </div>
        <div className="col-span-3 p-4 space-y-3">
          {cv.summary && (<div><SectionTitle title="Profile" scheme={scheme} fontSize={fontSize} /><p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.5 }}>{cv.summary}</p></div>)}
          <div><SectionTitle title="Experience" scheme={scheme} fontSize={fontSize} /><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
      </div>
    </div>
  );
}

export function SidebarTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full overflow-hidden flex">
      <div className="w-1/3 p-4" style={{ background: scheme.accent, color: scheme.bg === "#FFFFFF" ? "#FFFFFF" : scheme.text }}>
        {cv.design.showPhoto && cv.personal.photo && (
          <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-3 border-2" style={{ borderColor: scheme.bg }}>
            <img src={cv.personal.photo} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <h1 style={{ fontSize: fontSize * 1.4, fontWeight: 700, lineHeight: 1.1 }}>{cv.personal.fullName || "Your Name"}</h1>
        <p style={{ fontSize: fontSize * 0.85, opacity: 0.85, marginTop: 2 }}>{cv.personal.title || "Title"}</p>
        <div className="mt-4 space-y-3">
          <div><h3 style={{ fontSize: fontSize * 0.65, fontWeight: 700, opacity: 0.7, textTransform: "uppercase" }}>Contact</h3><Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="col" /></div>
          <div><h3 style={{ fontSize: fontSize * 0.65, fontWeight: 700, opacity: 0.7, textTransform: "uppercase", marginTop: 6 }}>Skills</h3><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="dot" /></div>
          <div><h3 style={{ fontSize: fontSize * 0.65, fontWeight: 700, opacity: 0.7, textTransform: "uppercase", marginTop: 6 }}>Languages</h3>
            {cv.languages.slice(0, 3).map((l, i) => <div key={i} style={{ fontSize: fontSize * 0.7 }}>{l.name} — {l.proficiency}</div>)}
          </div>
        </div>
      </div>
      <div className="flex-1 p-4 space-y-3">
        {cv.summary && (<div><SectionTitle title="Profile" scheme={scheme} fontSize={fontSize} /><p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.5 }}>{cv.summary}</p></div>)}
        <div><SectionTitle title="Experience" scheme={scheme} fontSize={fontSize} /><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        <div><SectionTitle title="Education" scheme={scheme} fontSize={fontSize} /><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
      </div>
    </div>
  );
}

export function MagazineTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  const serif = "Georgia, serif";
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: serif, fontSize }} className="w-full h-full p-[6%] overflow-hidden">
      <header className="mb-3 flex items-end gap-4 pb-2" style={{ borderBottom: `2px solid ${scheme.text}` }}>
        {cv.design.showPhoto && cv.personal.photo && (
          <div className="w-14 h-14 rounded-full overflow-hidden"><img src={cv.personal.photo} alt="" className="w-full h-full object-cover" /></div>
        )}
        <div className="flex-1">
          <div style={{ fontSize: fontSize * 0.65, color: scheme.muted, textTransform: "uppercase", letterSpacing: "0.2em" }}>Feature · Profile</div>
          <h1 style={{ fontSize: fontSize * 2.2, fontWeight: 700, color: scheme.text, lineHeight: 1, fontStyle: "italic" }}>{cv.personal.fullName || "Your Name"}</h1>
          <p style={{ fontSize: fontSize * 0.85, color: scheme.accent, marginTop: 2 }}>{cv.personal.title || "Title"}</p>
        </div>
      </header>
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-3" style={{ borderRight: `1px solid ${scheme.text}20`, paddingRight: 12 }}>
          <div className="text-xs uppercase tracking-wider mb-2" style={{ color: scheme.accent, fontWeight: 700, fontSize: fontSize * 0.7 }}>Contact</div>
          <Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="col" />
          <div className="text-xs uppercase tracking-wider mb-2 mt-3" style={{ color: scheme.accent, fontWeight: 700, fontSize: fontSize * 0.7 }}>Skills</div>
          <SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="dot" />
        </div>
        <div className="col-span-9 space-y-3">
          {cv.summary && (<div><h3 style={{ fontSize: fontSize * 1.0, fontWeight: 700, color: scheme.accent, fontStyle: "italic" }}>Introduction</h3><p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.6, textAlign: "justify" }}>{cv.summary}</p></div>)}
          <div><h3 style={{ fontSize: fontSize * 1.0, fontWeight: 700, color: scheme.accent, fontStyle: "italic" }}>Career</h3><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
      </div>
    </div>
  );
}

export function CardTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[5%] overflow-hidden">
      <header className="mb-3 text-center p-3 rounded-xl" style={{ background: `linear-gradient(135deg, ${scheme.accent}15, ${scheme.accent}05)`, border: `1px solid ${scheme.accent}30` }}>
        <h1 style={{ fontSize: fontSize * 1.8, fontWeight: 700, color: scheme.text, lineHeight: 1 }}>{cv.personal.fullName || "Your Name"}</h1>
        <p style={{ fontSize: fontSize * 0.85, color: scheme.accent, marginTop: 2 }}>{cv.personal.title || "Title"}</p>
        <div className="mt-2"><Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="comma" /></div>
      </header>
      <div className="grid grid-cols-2 gap-2">
        {cv.summary && (<div className="p-2 rounded-lg border" style={{ borderColor: `${scheme.text}15`, background: `${scheme.bg}50` }}><SectionTitle title="About" scheme={scheme} fontSize={fontSize} /><p style={{ color: scheme.muted, fontSize: fontSize * 0.75, lineHeight: 1.4 }}>{cv.summary}</p></div>)}
        <div className="p-2 rounded-lg border" style={{ borderColor: `${scheme.text}15`, background: `${scheme.bg}50` }}><SectionTitle title="Skills" scheme={scheme} fontSize={fontSize} /><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="tag" /></div>
        <div className="p-2 rounded-lg border col-span-2" style={{ borderColor: `${scheme.text}15`, background: `${scheme.bg}50` }}><SectionTitle title="Experience" scheme={scheme} fontSize={fontSize} /><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        <div className="p-2 rounded-lg border" style={{ borderColor: `${scheme.text}15`, background: `${scheme.bg}50` }}><SectionTitle title="Education" scheme={scheme} fontSize={fontSize} /><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        <div className="p-2 rounded-lg border" style={{ borderColor: `${scheme.text}15`, background: `${scheme.bg}50` }}><SectionTitle title="Projects" scheme={scheme} fontSize={fontSize} /><ProjectsList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
      </div>
    </div>
  );
}

export function GridlineTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize, backgroundImage: `linear-gradient(${scheme.text}08 1px, transparent 1px), linear-gradient(90deg, ${scheme.text}08 1px, transparent 1px)`, backgroundSize: "20px 20px" }} className="w-full h-full p-[6%] overflow-hidden">
      <header className="mb-3 pb-2" style={{ borderBottom: `2px solid ${scheme.accent}` }}>
        <h1 style={{ fontSize: fontSize * 2.0, fontWeight: 700, color: scheme.text, lineHeight: 1 }}>{cv.personal.fullName || "Your Name"}</h1>
        <p style={{ fontSize: fontSize * 0.9, color: scheme.accent, marginTop: 2 }}>{cv.personal.title || "Title"}</p>
        <div className="mt-2"><Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="comma" /></div>
      </header>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-3">
          {cv.summary && (<div><SectionTitle title="Profile" scheme={scheme} fontSize={fontSize} /><p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.5 }}>{cv.summary}</p></div>)}
          <div><SectionTitle title="Experience" scheme={scheme} fontSize={fontSize} /><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
        <div className="space-y-3">
          <div><SectionTitle title="Skills" scheme={scheme} fontSize={fontSize} /><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="bar" /></div>
          <div><SectionTitle title="Education" scheme={scheme} fontSize={fontSize} /><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        </div>
      </div>
    </div>
  );
}

export function ProfileTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full overflow-hidden">
      <div style={{ background: `linear-gradient(135deg, ${scheme.accent}, ${scheme.muted})`, color: scheme.bg === "#FFFFFF" ? "#FFFFFF" : scheme.text }} className="p-6 flex items-center gap-4">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 flex items-center justify-center" style={{ borderColor: scheme.bg === "#FFFFFF" ? "#FFFFFF" : scheme.text }}>
          {cv.design.showPhoto && cv.personal.photo ? <img src={cv.personal.photo} alt="" className="w-full h-full object-cover" /> : <span style={{ fontSize: fontSize * 2, fontWeight: 700 }}>{(cv.personal.fullName || "Y")[0]}</span>}
        </div>
        <div>
          <h1 style={{ fontSize: fontSize * 2.0, fontWeight: 800, lineHeight: 1 }}>{cv.personal.fullName || "Your Name"}</h1>
          <p style={{ fontSize: fontSize * 1.0, opacity: 0.9, marginTop: 4 }}>{cv.personal.title || "Title"}</p>
        </div>
      </div>
      <div className="p-5">
        <Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="row" />
        <div className="grid grid-cols-3 gap-3 mt-3">
          <div className="col-span-2 space-y-3">
            {cv.summary && (<div><SectionTitle title="About" scheme={scheme} fontSize={fontSize} /><p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.5 }}>{cv.summary}</p></div>)}
            <div><SectionTitle title="Experience" scheme={scheme} fontSize={fontSize} /><ExperienceList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
          </div>
          <div className="space-y-3">
            <div><SectionTitle title="Skills" scheme={scheme} fontSize={fontSize} /><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="bar" /></div>
            <div><SectionTitle title="Education" scheme={scheme} fontSize={fontSize} /><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ImpactTemplate({ cv, scheme, fontStack, fontSize }: NewTemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[6%] overflow-hidden">
      <header className="mb-3 pb-2" style={{ borderBottom: `2px solid ${scheme.accent}` }}>
        <h1 style={{ fontSize: fontSize * 2.0, fontWeight: 700, color: scheme.text, lineHeight: 1 }}>{cv.personal.fullName || "Your Name"}</h1>
        <p style={{ fontSize: fontSize * 0.95, color: scheme.accent, marginTop: 2 }}>{cv.personal.title || "Title"}</p>
        <div className="mt-2"><Contacts cv={cv} scheme={scheme} fontSize={fontSize} layout="comma" /></div>
      </header>
      {cv.summary && (<div className="mb-3"><SectionTitle title="Profile" scheme={scheme} fontSize={fontSize} /><p style={{ color: scheme.muted, fontSize: fontSize * 0.85, lineHeight: 1.5 }}>{cv.summary}</p></div>)}
      <div className="mb-3"><SectionTitle title="Key Impact" scheme={scheme} fontSize={fontSize} />
        <div className="grid grid-cols-3 gap-2">
          {cv.experience.slice(0, 3).map((e, i) => (
            <div key={i} className="p-2 rounded-lg" style={{ background: `${scheme.accent}10`, borderLeft: `3px solid ${scheme.accent}` }}>
              <div style={{ fontSize: fontSize * 0.7, color: scheme.accent, fontWeight: 700 }}>{e.startDate} {e.endDate && `— ${e.endDate}`}</div>
              <div style={{ color: scheme.text, fontWeight: 600, fontSize: fontSize * 0.85 }}>{e.jobTitle}</div>
              <div style={{ color: scheme.muted, fontSize: fontSize * 0.7 }}>{e.company}</div>
              {e.achievements && <div style={{ color: scheme.muted, fontSize: fontSize * 0.7, marginTop: 1, lineHeight: 1.3 }}>★ {e.achievements.split("\n")[0]}</div>}
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><SectionTitle title="Education" scheme={scheme} fontSize={fontSize} /><EducationList cv={cv} scheme={scheme} fontSize={fontSize} /></div>
        <div><SectionTitle title="Skills" scheme={scheme} fontSize={fontSize} /><SkillsList skills={cv.skills} scheme={scheme} fontSize={fontSize} layout="tag" /></div>
      </div>
    </div>
  );
}

// Map of all 50 new template IDs to their components
export const NEW_TEMPLATE_MAP: Record<string, React.FC<NewTemplateProps>> = {
  // Premium Minimal
  apex: ApexTemplate,
  "blank-space": BlankSpaceTemplate,
  paper: PaperTemplate,
  outline: OutlineTemplate,
  calm: CalmTemplate,
  one: OneTemplate,
  // Modern & Futuristic
  orbit: OrbitTemplate,
  prism: PrismTemplate,
  flux: FluxTemplate,
  vector: VectorTemplate,
  quantum: QuantumTemplate,
  signal: SignalTemplate,
  // Bold & Colorful
  vivid: VividTemplate,
  "coral-tpl": CoralTemplate,
  electric: ElectricTemplate,
  spectrum: SpectrumTemplate,
  pop: PopTemplate,
  ember: EmberTemplate,
  // Creative Professional
  "canvas-pro": CanvasProTemplate,
  gallery: GalleryTemplate,
  frame: FrameTemplate,
  "studio-pro": StudioProTemplate,
  "muse-modern": MuseModernTemplate,
  story: StoryTemplate,
  // Executive & Corporate
  chairman: ChairmanTemplate,
  boardroom: BoardroomTemplate,
  legacy: LegacyTemplate,
  "summit-pro": SummitProTemplate,
  capital: CapitalTemplate,
  director: DirectorTemplate,
  // Technology
  devgrid: DevGridTemplate,
  stack: StackTemplate,
  byte: ByteTemplate,
  system: SystemTemplate,
  build: BuildTemplate,
  cloud: CloudTemplate,
  // Student & Fresher
  "first-step": FirstStepTemplate,
  momentum: MomentumTemplate,
  scholar: ScholarTemplate,
  intern: InternTemplate,
  future: FutureTemplate,
  spark: SparkTemplate,
  // Unique Layouts
  "timeline-tpl": TimelineTemplate,
  split: SplitTemplate,
  "sidebar-tpl": SidebarTemplate,
  magazine: MagazineTemplate,
  "card-tpl": CardTemplate,
  gridline: GridlineTemplate,
  "profile-tpl": ProfileTemplate,
  impact: ImpactTemplate,
};
