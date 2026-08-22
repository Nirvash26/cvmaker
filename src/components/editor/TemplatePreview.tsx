"use client";

import { CVData } from "@/lib/types";
import { COLOR_SCHEMES, FONT_FAMILIES } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TemplatePreviewProps {
  templateId: string;
  cv: CVData | null;
  compact?: boolean;
  className?: string;
}

export function TemplatePreview({ templateId, cv, compact, className }: TemplatePreviewProps) {
  const safeCV = cv || createFallbackCV();
  const scheme = COLOR_SCHEMES[safeCV.design.colorScheme] || COLOR_SCHEMES.nirvash;
  const fontStack = FONT_FAMILIES[safeCV.design.fontFamily]?.stack || "Inter, sans-serif";
  const fontSize = compact ? Math.max(8, safeCV.design.fontSize - 4) : safeCV.design.fontSize;

  const props = { cv: safeCV, scheme, fontStack, fontSize, compact };

  const TemplateComp = TEMPLATE_MAP[templateId] || AuroraTemplate;
  return <TemplateComp {...props} />;
}

interface TemplateProps {
  cv: CVData;
  scheme: typeof COLOR_SCHEMES.nirvash;
  fontStack: string;
  fontSize: number;
  compact?: boolean;
}

const TEMPLATE_MAP: Record<string, React.FC<TemplateProps>> = {
  aurora: AuroraTemplate,
  minimal: MinimalTemplate,
  vertex: VertexTemplate,
  horizon: HorizonTemplate,
  executive: ExecutiveTemplate,
  nova: NovaTemplate,
  classic: ClassicTemplate,
  slate: SlateTemplate,
  "modern-edge": ModernEdgeTemplate,
  academic: AcademicTemplate,
  focus: FocusTemplate,
  studio: StudioTemplate,
};

// ============== TEMPLATE IMPLEMENTATIONS ==============

function AuroraTemplate({ cv, scheme, fontStack, fontSize, compact }: TemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[6%] overflow-hidden">
      <header className="pb-3 mb-3" style={{ borderBottom: `2px solid ${scheme.accent}` }}>
        <h1 style={{ fontSize: fontSize * 2.2, fontWeight: 800, color: scheme.accent, lineHeight: 1.1 }}>{cv.personal.fullName || "Your Name"}</h1>
        <p style={{ fontSize: fontSize * 1.1, color: scheme.muted, marginTop: 4 }}>{cv.personal.title || "Your Professional Title"}</p>
        <div style={{ fontSize: fontSize * 0.75, color: scheme.muted, marginTop: 6 }} className="flex flex-wrap gap-x-3 gap-y-1">
          {cv.personal.email && <span>{cv.personal.email}</span>}
          {cv.personal.phone && <span>· {cv.personal.phone}</span>}
          {cv.personal.location && <span>· {cv.personal.location}</span>}
          {cv.personal.website && <span>· {cv.personal.website}</span>}
        </div>
      </header>

      {cv.summary && (
        <Section title="Summary" scheme={scheme} fontSize={fontSize} compact={compact}>
          <p style={{ color: scheme.muted, lineHeight: 1.5 }}>{cv.summary}</p>
        </Section>
      )}

      {cv.experience.length > 0 && (
        <Section title="Experience" scheme={scheme} fontSize={fontSize} compact={compact}>
          {cv.experience.map((e, i) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between items-baseline">
                <strong style={{ color: scheme.text, fontSize: fontSize * 1.05 }}>{e.jobTitle || "Job Title"}</strong>
                <span style={{ color: scheme.muted, fontSize: fontSize * 0.8 }}>{e.startDate} {e.endDate && `— ${e.endDate}`}</span>
              </div>
              <div style={{ color: scheme.accent, fontSize: fontSize * 0.9 }}>{e.company}{e.location && ` · ${e.location}`}</div>
              {e.responsibilities && <p style={{ color: scheme.muted, marginTop: 4, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{e.responsibilities}</p>}
              {e.achievements && <p style={{ color: scheme.muted, marginTop: 4, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{e.achievements}</p>}
            </div>
          ))}
        </Section>
      )}

      <TwoColRow cv={cv} scheme={scheme} fontSize={fontSize} compact={compact} />
    </div>
  );
}

function MinimalTemplate({ cv, scheme, fontStack, fontSize, compact }: TemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[8%] overflow-hidden text-center">
      <header className="mb-4">
        <h1 style={{ fontSize: fontSize * 2.5, fontWeight: 700, letterSpacing: "0.05em", color: scheme.text }}>{cv.personal.fullName?.toUpperCase() || "YOUR NAME"}</h1>
        <div style={{ height: 1, background: scheme.accent, width: "60%", margin: "8px auto" }} />
        <p style={{ fontSize: fontSize * 1.1, color: scheme.muted, marginTop: 4 }}>{cv.personal.title || "Your Title"}</p>
        <div style={{ fontSize: fontSize * 0.7, color: scheme.muted, marginTop: 8 }} className="flex justify-center flex-wrap gap-x-3">
          {cv.personal.email && <span>{cv.personal.email}</span>}
          {cv.personal.phone && <span>· {cv.personal.phone}</span>}
          {cv.personal.location && <span>· {cv.personal.location}</span>}
        </div>
      </header>

      {cv.summary && (
        <div className="mb-4 text-left">
          <SectionTitle center scheme={scheme} fontSize={fontSize}>About</SectionTitle>
          <p style={{ color: scheme.muted, lineHeight: 1.6 }}>{cv.summary}</p>
        </div>
      )}

      {cv.experience.length > 0 && (
        <div className="mb-4 text-left">
          <SectionTitle center scheme={scheme} fontSize={fontSize}>Experience</SectionTitle>
          {cv.experience.map((e, i) => (
            <div key={i} className="mb-2">
              <div style={{ color: scheme.text, fontWeight: 600 }}>{e.jobTitle}</div>
              <div style={{ color: scheme.accent, fontSize: fontSize * 0.85 }}>{e.company} · {e.startDate} {e.endDate && `— ${e.endDate}`}</div>
              {e.responsibilities && <p style={{ color: scheme.muted, marginTop: 2, lineHeight: 1.4 }}>{e.responsibilities}</p>}
            </div>
          ))}
        </div>
      )}

      <div className="text-left">
        <SectionTitle center scheme={scheme} fontSize={fontSize}>Education</SectionTitle>
        {cv.education.map((e, i) => (
          <div key={i}>
            <span style={{ color: scheme.text, fontWeight: 600 }}>{e.degree}</span>
            <span style={{ color: scheme.muted }}> · {e.institution}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function VertexTemplate({ cv, scheme, fontStack, fontSize, compact }: TemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full flex overflow-hidden">
      {/* Sidebar */}
      <aside style={{ background: scheme.accent, color: scheme.bg === "#FFFFFF" ? "#FFFFFF" : scheme.text, width: "32%", padding: "5%" }} className="overflow-hidden">
        {cv.design.showPhoto && cv.personal.photo && (
          <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-3 border-2" style={{ borderColor: scheme.bg }}>
            <img src={cv.personal.photo} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <h2 style={{ fontSize: fontSize * 1.4, fontWeight: 800 }}>{cv.personal.fullName || "Your Name"}</h2>
        <p style={{ fontSize: fontSize * 0.9, opacity: 0.85, marginTop: 2 }}>{cv.personal.title || "Title"}</p>

        <div className="mt-4 space-y-1" style={{ fontSize: fontSize * 0.75 }}>
          {cv.personal.email && <div className="break-all">{cv.personal.email}</div>}
          {cv.personal.phone && <div>{cv.personal.phone}</div>}
          {cv.personal.location && <div>{cv.personal.location}</div>}
          {cv.personal.website && <div className="break-all">{cv.personal.website}</div>}
          {cv.personal.linkedin && <div className="break-all">{cv.personal.linkedin}</div>}
        </div>

        {cv.skills.length > 0 && (
          <div className="mt-5">
            <h3 style={{ fontSize: fontSize * 0.85, fontWeight: 700, borderBottom: "1px solid rgba(255,255,255,0.3)", paddingBottom: 2, marginBottom: 6 }}>SKILLS</h3>
            <div style={{ fontSize: fontSize * 0.75 }} className="space-y-1">
              {cv.skills.slice(0, 10).map((s, i) => <div key={i}>· {s}</div>)}
            </div>
          </div>
        )}

        {cv.languages.length > 0 && (
          <div className="mt-4">
            <h3 style={{ fontSize: fontSize * 0.85, fontWeight: 700, borderBottom: "1px solid rgba(255,255,255,0.3)", paddingBottom: 2, marginBottom: 6 }}>LANGUAGES</h3>
            {cv.languages.map((l, i) => (
              <div key={i} style={{ fontSize: fontSize * 0.75 }}>{l.name} — {l.proficiency}</div>
            ))}
          </div>
        )}
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: "5%" }} className="overflow-hidden">
        {cv.summary && (
          <Section title="Profile" scheme={scheme} fontSize={fontSize} compact={compact}>
            <p style={{ color: scheme.muted, lineHeight: 1.5 }}>{cv.summary}</p>
          </Section>
        )}
        {cv.experience.length > 0 && (
          <Section title="Experience" scheme={scheme} fontSize={fontSize} compact={compact}>
            {cv.experience.map((e, i) => (
              <div key={i} className="mb-2">
                <div style={{ color: scheme.text, fontWeight: 600 }}>{e.jobTitle}</div>
                <div style={{ color: scheme.accent, fontSize: fontSize * 0.85 }}>{e.company} · {e.startDate} {e.endDate && `— ${e.endDate}`}</div>
                {e.responsibilities && <p style={{ color: scheme.muted, marginTop: 2, lineHeight: 1.4 }}>{e.responsibilities}</p>}
              </div>
            ))}
          </Section>
        )}
        {cv.education.length > 0 && (
          <Section title="Education" scheme={scheme} fontSize={fontSize} compact={compact}>
            {cv.education.map((e, i) => (
              <div key={i} className="mb-1">
                <div style={{ color: scheme.text, fontWeight: 600 }}>{e.degree}</div>
                <div style={{ color: scheme.muted, fontSize: fontSize * 0.85 }}>{e.institution} · {e.startDate} {e.endDate && `— ${e.endDate}`}</div>
              </div>
            ))}
          </Section>
        )}
      </main>
    </div>
  );
}

function HorizonTemplate({ cv, scheme, fontStack, fontSize, compact }: TemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[6%] overflow-hidden">
      <header className="flex items-end justify-between pb-3 mb-3" style={{ borderBottom: `3px solid ${scheme.accent}` }}>
        <div>
          <h1 style={{ fontSize: fontSize * 2.2, fontWeight: 800, color: scheme.text, lineHeight: 1.1 }}>{cv.personal.fullName || "Your Name"}</h1>
          <p style={{ fontSize: fontSize * 1.05, color: scheme.accent, marginTop: 4 }}>{cv.personal.title || "Title"}</p>
        </div>
        <div style={{ fontSize: fontSize * 0.75, color: scheme.muted, textAlign: "right" }} className="space-y-0.5">
          {cv.personal.email && <div>{cv.personal.email}</div>}
          {cv.personal.phone && <div>{cv.personal.phone}</div>}
          {cv.personal.location && <div>{cv.personal.location}</div>}
        </div>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div>
          {cv.summary && (
            <Section title="Summary" scheme={scheme} fontSize={fontSize} compact={compact}>
              <p style={{ color: scheme.muted, lineHeight: 1.5 }}>{cv.summary}</p>
            </Section>
          )}
          {cv.experience.length > 0 && (
            <Section title="Experience" scheme={scheme} fontSize={fontSize} compact={compact}>
              {cv.experience.map((e, i) => (
                <div key={i} className="mb-2">
                  <div style={{ color: scheme.text, fontWeight: 600 }}>{e.jobTitle}</div>
                  <div style={{ color: scheme.accent, fontSize: fontSize * 0.85 }}>{e.company}</div>
                  <div style={{ color: scheme.muted, fontSize: fontSize * 0.75 }}>{e.startDate} {e.endDate && `— ${e.endDate}`}</div>
                  {e.responsibilities && <p style={{ color: scheme.muted, marginTop: 2, lineHeight: 1.4 }}>{e.responsibilities}</p>}
                </div>
              ))}
            </Section>
          )}
        </div>
        <div>
          {cv.education.length > 0 && (
            <Section title="Education" scheme={scheme} fontSize={fontSize} compact={compact}>
              {cv.education.map((e, i) => (
                <div key={i} className="mb-1">
                  <div style={{ color: scheme.text, fontWeight: 600 }}>{e.degree}</div>
                  <div style={{ color: scheme.muted, fontSize: fontSize * 0.85 }}>{e.institution}</div>
                </div>
              ))}
            </Section>
          )}
          {cv.skills.length > 0 && (
            <Section title="Skills" scheme={scheme} fontSize={fontSize} compact={compact}>
              <div className="flex flex-wrap gap-1">
                {cv.skills.map((s, i) => (
                  <span key={i} style={{ fontSize: fontSize * 0.75, background: scheme.accent, color: scheme.bg, padding: "1px 6px", borderRadius: 3 }}>{s}</span>
                ))}
              </div>
            </Section>
          )}
          {cv.languages.length > 0 && (
            <Section title="Languages" scheme={scheme} fontSize={fontSize} compact={compact}>
              {cv.languages.map((l, i) => <div key={i} style={{ fontSize: fontSize * 0.85, color: scheme.muted }}>{l.name} — {l.proficiency}</div>)}
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

function ExecutiveTemplate({ cv, scheme, fontStack, fontSize, compact }: TemplateProps) {
  const dark = { bg: "#1A1A1A", text: "#E8ECF4", accent: "#FFCB9A", muted: "#A0A8B8" };
  return (
    <div style={{ background: dark.bg, color: dark.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[7%] overflow-hidden">
      <header className="text-center pb-3 mb-3" style={{ borderBottom: `1px solid ${dark.accent}` }}>
        <h1 style={{ fontSize: fontSize * 2.4, fontWeight: 800, color: dark.text, letterSpacing: "0.08em" }}>{cv.personal.fullName?.toUpperCase() || "YOUR NAME"}</h1>
        <p style={{ fontSize: fontSize * 1.0, color: dark.accent, marginTop: 4, letterSpacing: "0.15em" }}>{cv.personal.title?.toUpperCase() || "TITLE"}</p>
        <div style={{ fontSize: fontSize * 0.7, color: dark.muted, marginTop: 6 }} className="flex justify-center flex-wrap gap-x-3">
          {cv.personal.email && <span>{cv.personal.email}</span>}
          {cv.personal.phone && <span>· {cv.personal.phone}</span>}
          {cv.personal.location && <span>· {cv.personal.location}</span>}
        </div>
      </header>

      {cv.summary && (
        <Section title="Executive Summary" scheme={dark} fontSize={fontSize} compact={compact}>
          <p style={{ color: dark.muted, lineHeight: 1.6, fontStyle: "italic" }}>{cv.summary}</p>
        </Section>
      )}

      {cv.experience.length > 0 && (
        <Section title="Professional Experience" scheme={dark} fontSize={fontSize} compact={compact}>
          {cv.experience.map((e, i) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between items-baseline">
                <strong style={{ color: dark.accent }}>{e.jobTitle}</strong>
                <span style={{ color: dark.muted, fontSize: fontSize * 0.8 }}>{e.startDate} {e.endDate && `— ${e.endDate}`}</span>
              </div>
              <div style={{ color: dark.text, fontSize: fontSize * 0.9, marginBottom: 2 }}>{e.company}{e.location && ` · ${e.location}`}</div>
              {e.responsibilities && <p style={{ color: dark.muted, marginTop: 2, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{e.responsibilities}</p>}
            </div>
          ))}
        </Section>
      )}

      <div className="grid grid-cols-2 gap-3">
        {cv.education.length > 0 && (
          <Section title="Education" scheme={dark} fontSize={fontSize} compact={compact}>
            {cv.education.map((e, i) => (
              <div key={i}>
                <div style={{ color: dark.accent, fontWeight: 600 }}>{e.degree}</div>
                <div style={{ color: dark.muted, fontSize: fontSize * 0.85 }}>{e.institution}</div>
              </div>
            ))}
          </Section>
        )}
        {cv.skills.length > 0 && (
          <Section title="Core Skills" scheme={dark} fontSize={fontSize} compact={compact}>
            <div style={{ color: dark.muted, fontSize: fontSize * 0.85 }}>{cv.skills.join(" · ")}</div>
          </Section>
        )}
      </div>
    </div>
  );
}

function NovaTemplate({ cv, scheme, fontStack, fontSize, compact }: TemplateProps) {
  return (
    <div style={{ background: `linear-gradient(135deg, ${scheme.bg} 0%, ${scheme.accent}11 100%)`, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[6%] overflow-hidden">
      <header className="flex items-center gap-3 mb-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${scheme.accent}, ${scheme.muted})` }}>
          <span style={{ color: scheme.bg, fontWeight: 800, fontSize: fontSize * 1.6 }}>{(cv.personal.fullName || "Y")[0]}</span>
        </div>
        <div>
          <h1 style={{ fontSize: fontSize * 1.8, fontWeight: 800, color: scheme.text, lineHeight: 1 }}>{cv.personal.fullName || "Your Name"}</h1>
          <p style={{ fontSize: fontSize * 1.0, color: scheme.accent, marginTop: 2 }}>{cv.personal.title || "Title"}</p>
        </div>
      </header>

      <div style={{ fontSize: fontSize * 0.75, color: scheme.muted }} className="flex flex-wrap gap-x-3 mb-4 pb-3" >
        {cv.personal.email && <span>{cv.personal.email}</span>}
        {cv.personal.phone && <span>· {cv.personal.phone}</span>}
        {cv.personal.location && <span>· {cv.personal.location}</span>}
        {cv.personal.website && <span>· {cv.personal.website}</span>}
      </div>

      {cv.summary && (
        <Section title="About" scheme={scheme} fontSize={fontSize} compact={compact}>
          <p style={{ color: scheme.muted, lineHeight: 1.5 }}>{cv.summary}</p>
        </Section>
      )}

      {cv.experience.length > 0 && (
        <Section title="Experience" scheme={scheme} fontSize={fontSize} compact={compact}>
          {cv.experience.map((e, i) => (
            <div key={i} className="mb-2 pl-3" style={{ borderLeft: `2px solid ${scheme.accent}` }}>
              <div style={{ color: scheme.text, fontWeight: 600 }}>{e.jobTitle}</div>
              <div style={{ color: scheme.accent, fontSize: fontSize * 0.85 }}>{e.company} · {e.startDate} {e.endDate && `— ${e.endDate}`}</div>
              {e.responsibilities && <p style={{ color: scheme.muted, marginTop: 2, lineHeight: 1.4 }}>{e.responsibilities}</p>}
            </div>
          ))}
        </Section>
      )}

      {cv.skills.length > 0 && (
        <Section title="Skills" scheme={scheme} fontSize={fontSize} compact={compact}>
          <div className="grid grid-cols-3 gap-1.5">
            {cv.skills.map((s, i) => (
              <div key={i} className="text-center py-1 rounded" style={{ background: `${scheme.accent}20`, color: scheme.text, fontSize: fontSize * 0.8 }}>{s}</div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function ClassicTemplate({ cv, scheme, fontStack, fontSize, compact }: TemplateProps) {
  const serifStack = "Georgia, 'Times New Roman', serif";
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: serifStack, fontSize }} className="w-full h-full p-[7%] overflow-hidden">
      <header className="text-center pb-3 mb-3">
        <h1 style={{ fontSize: fontSize * 2.4, fontWeight: 700, color: scheme.text, letterSpacing: "0.04em" }}>{cv.personal.fullName || "Your Name"}</h1>
        <div style={{ width: "30%", height: 1, background: scheme.text, margin: "8px auto" }} />
        <p style={{ fontSize: fontSize * 1.0, color: scheme.muted, fontStyle: "italic" }}>{cv.personal.title || "Title"}</p>
        <div style={{ fontSize: fontSize * 0.75, color: scheme.muted, marginTop: 6 }} className="flex justify-center flex-wrap gap-x-3">
          {cv.personal.email && <span>{cv.personal.email}</span>}
          {cv.personal.phone && <span>· {cv.personal.phone}</span>}
          {cv.personal.location && <span>· {cv.personal.location}</span>}
        </div>
      </header>

      {cv.summary && (
        <Section title="Summary" scheme={scheme} fontSize={fontSize} compact={compact}>
          <p style={{ color: scheme.muted, lineHeight: 1.6, textAlign: "justify" }}>{cv.summary}</p>
        </Section>
      )}

      {cv.experience.length > 0 && (
        <Section title="Professional Experience" scheme={scheme} fontSize={fontSize} compact={compact}>
          {cv.experience.map((e, i) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between items-baseline">
                <strong style={{ color: scheme.text, fontStyle: "italic" }}>{e.jobTitle}</strong>
                <span style={{ color: scheme.muted, fontSize: fontSize * 0.8 }}>{e.startDate} {e.endDate && `— ${e.endDate}`}</span>
              </div>
              <div style={{ color: scheme.accent, fontSize: fontSize * 0.9 }}>{e.company}{e.location && `, ${e.location}`}</div>
              {e.responsibilities && <p style={{ color: scheme.muted, marginTop: 2, lineHeight: 1.5 }}>{e.responsibilities}</p>}
            </div>
          ))}
        </Section>
      )}

      <TwoColRow cv={cv} scheme={scheme} fontSize={fontSize} compact={compact} />
    </div>
  );
}

function SlateTemplate({ cv, scheme, fontStack, fontSize, compact }: TemplateProps) {
  const monoStack = "'JetBrains Mono', 'Courier New', monospace";
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: monoStack, fontSize }} className="w-full h-full p-[6%] overflow-hidden">
      <header className="pb-2 mb-3" style={{ borderBottom: `1px dashed ${scheme.accent}` }}>
        <div style={{ color: scheme.muted, fontSize: fontSize * 0.7 }}>{"// resume"}</div>
        <h1 style={{ fontSize: fontSize * 1.8, fontWeight: 700, color: scheme.text, lineHeight: 1.1, marginTop: 4 }}>{cv.personal.fullName || "your_name"}</h1>
        <p style={{ fontSize: fontSize * 0.9, color: scheme.accent }}>{cv.personal.title || "title"}</p>
        <div style={{ fontSize: fontSize * 0.7, color: scheme.muted, marginTop: 4 }}>
          {cv.personal.email && <span>{`{ email: "${cv.personal.email}" }`}</span>}
        </div>
      </header>

      {cv.summary && (
        <Section title="01_summary" scheme={scheme} fontSize={fontSize} compact={compact}>
          <p style={{ color: scheme.muted, lineHeight: 1.5 }}>{cv.summary}</p>
        </Section>
      )}

      {cv.experience.length > 0 && (
        <Section title="02_experience" scheme={scheme} fontSize={fontSize} compact={compact}>
          {cv.experience.map((e, i) => (
            <div key={i} className="mb-2">
              <div style={{ color: scheme.text, fontWeight: 600 }}>{`> ${e.jobTitle}`}</div>
              <div style={{ color: scheme.accent, fontSize: fontSize * 0.85 }}>{`  ${e.company} · ${e.startDate} ${e.endDate ? `— ${e.endDate}` : ""}`}</div>
              {e.responsibilities && <p style={{ color: scheme.muted, marginTop: 2, lineHeight: 1.4, paddingLeft: 8 }}>{e.responsibilities}</p>}
            </div>
          ))}
        </Section>
      )}

      {cv.skills.length > 0 && (
        <Section title="03_skills" scheme={scheme} fontSize={fontSize} compact={compact}>
          <div style={{ color: scheme.muted, fontSize: fontSize * 0.85 }}>[{cv.skills.join(", ")}]</div>
        </Section>
      )}
    </div>
  );
}

function ModernEdgeTemplate({ cv, scheme, fontStack, fontSize, compact }: TemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full overflow-hidden">
      <div className="grid grid-cols-3">
        <div style={{ background: scheme.accent, padding: "6%", gridColumn: "span 1" }} className="text-white">
          <h1 style={{ fontSize: fontSize * 1.6, fontWeight: 800, lineHeight: 1.1, color: scheme.bg === "#FFFFFF" ? "#FFFFFF" : scheme.text }}>{cv.personal.fullName || "Your Name"}</h1>
          <p style={{ fontSize: fontSize * 0.85, opacity: 0.85, marginTop: 4 }}>{cv.personal.title || "Title"}</p>

          <div className="mt-4 space-y-0.5" style={{ fontSize: fontSize * 0.7 }}>
            {cv.personal.email && <div className="break-all">{cv.personal.email}</div>}
            {cv.personal.phone && <div>{cv.personal.phone}</div>}
            {cv.personal.location && <div>{cv.personal.location}</div>}
            {cv.personal.website && <div className="break-all">{cv.personal.website}</div>}
          </div>

          {cv.skills.length > 0 && (
            <div className="mt-4">
              <div style={{ fontSize: fontSize * 0.75, fontWeight: 700, marginBottom: 4, opacity: 0.8 }}>SKILLS</div>
              <div style={{ fontSize: fontSize * 0.7 }} className="space-y-0.5">
                {cv.skills.slice(0, 8).map((s, i) => <div key={i}>· {s}</div>)}
              </div>
            </div>
          )}
        </div>
        <div style={{ padding: "6%", gridColumn: "span 2" }}>
          {cv.summary && (
            <Section title="Profile" scheme={scheme} fontSize={fontSize} compact={compact}>
              <p style={{ color: scheme.muted, lineHeight: 1.5 }}>{cv.summary}</p>
            </Section>
          )}
          {cv.experience.length > 0 && (
            <Section title="Experience" scheme={scheme} fontSize={fontSize} compact={compact}>
              {cv.experience.map((e, i) => (
                <div key={i} className="mb-2">
                  <div style={{ color: scheme.text, fontWeight: 600 }}>{e.jobTitle}</div>
                  <div style={{ color: scheme.accent, fontSize: fontSize * 0.85 }}>{e.company} · {e.startDate} {e.endDate && `— ${e.endDate}`}</div>
                  {e.responsibilities && <p style={{ color: scheme.muted, marginTop: 2, lineHeight: 1.4 }}>{e.responsibilities}</p>}
                </div>
              ))}
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

function AcademicTemplate({ cv, scheme, fontStack, fontSize, compact }: TemplateProps) {
  const serifStack = "Georgia, 'Times New Roman', serif";
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: serifStack, fontSize }} className="w-full h-full p-[7%] overflow-hidden">
      <header className="text-center pb-3 mb-3">
        <h1 style={{ fontSize: fontSize * 2.0, fontWeight: 700, color: scheme.text }}>{cv.personal.fullName || "Your Name"}</h1>
        <p style={{ fontSize: fontSize * 0.95, color: scheme.muted, marginTop: 2 }}>{cv.personal.title || "Title"}</p>
        <div style={{ fontSize: fontSize * 0.75, color: scheme.muted, marginTop: 4 }} className="flex justify-center flex-wrap gap-x-3">
          {cv.personal.email && <span>{cv.personal.email}</span>}
          {cv.personal.location && <span>· {cv.personal.location}</span>}
        </div>
      </header>

      {cv.summary && (
        <Section title="Research Statement" scheme={scheme} fontSize={fontSize} compact={compact}>
          <p style={{ color: scheme.muted, lineHeight: 1.6, textAlign: "justify" }}>{cv.summary}</p>
        </Section>
      )}

      {cv.education.length > 0 && (
        <Section title="Education" scheme={scheme} fontSize={fontSize} compact={compact}>
          {cv.education.map((e, i) => (
            <div key={i} className="mb-1">
              <div className="flex justify-between">
                <strong style={{ color: scheme.text }}>{e.degree}</strong>
                <span style={{ color: scheme.muted, fontSize: fontSize * 0.8 }}>{e.startDate} {e.endDate && `— ${e.endDate}`}</span>
              </div>
              <div style={{ color: scheme.accent, fontSize: fontSize * 0.9, fontStyle: "italic" }}>{e.institution}{e.field && ` · ${e.field}`}</div>
            </div>
          ))}
        </Section>
      )}

      {cv.experience.length > 0 && (
        <Section title="Academic Experience" scheme={scheme} fontSize={fontSize} compact={compact}>
          {cv.experience.map((e, i) => (
            <div key={i} className="mb-1.5">
              <div className="flex justify-between">
                <strong style={{ color: scheme.text }}>{e.jobTitle}</strong>
                <span style={{ color: scheme.muted, fontSize: fontSize * 0.8 }}>{e.startDate} {e.endDate && `— ${e.endDate}`}</span>
              </div>
              <div style={{ color: scheme.accent, fontSize: fontSize * 0.9, fontStyle: "italic" }}>{e.company}</div>
              {e.responsibilities && <p style={{ color: scheme.muted, marginTop: 2, lineHeight: 1.4 }}>{e.responsibilities}</p>}
            </div>
          ))}
        </Section>
      )}

      {cv.certifications.length > 0 && (
        <Section title="Publications & Certifications" scheme={scheme} fontSize={fontSize} compact={compact}>
          {cv.certifications.map((c, i) => (
            <div key={i} style={{ color: scheme.muted, fontSize: fontSize * 0.9, marginBottom: 2 }}>
              {c.name}. {c.issuer}. {c.date}
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}

function FocusTemplate({ cv, scheme, fontStack, fontSize, compact }: TemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[8%] overflow-hidden">
      <header className="mb-4">
        <h1 style={{ fontSize: fontSize * 2.0, fontWeight: 700, color: scheme.text }}>{cv.personal.fullName || "Your Name"}</h1>
        <p style={{ fontSize: fontSize * 1.0, color: scheme.muted, marginTop: 2 }}>{cv.personal.title || "Title"}</p>
        <div style={{ fontSize: fontSize * 0.75, color: scheme.muted, marginTop: 4 }}>
          {[cv.personal.email, cv.personal.phone, cv.personal.location].filter(Boolean).join(" | ")}
        </div>
      </header>

      {cv.summary && (
        <Section title="Summary" scheme={scheme} fontSize={fontSize} compact={compact}>
          <p style={{ color: scheme.muted, lineHeight: 1.5 }}>{cv.summary}</p>
        </Section>
      )}

      {cv.experience.length > 0 && (
        <Section title="Work Experience" scheme={scheme} fontSize={fontSize} compact={compact}>
          {cv.experience.map((e, i) => (
            <div key={i} className="mb-2">
              <div style={{ color: scheme.text, fontWeight: 600 }}>{e.jobTitle} — {e.company}</div>
              <div style={{ color: scheme.muted, fontSize: fontSize * 0.8 }}>{e.startDate} {e.endDate && `— ${e.endDate}`}{e.location && ` · ${e.location}`}</div>
              {e.responsibilities && <p style={{ color: scheme.muted, marginTop: 2, lineHeight: 1.4 }}>{e.responsibilities}</p>}
            </div>
          ))}
        </Section>
      )}

      <TwoColRow cv={cv} scheme={scheme} fontSize={fontSize} compact={compact} />
    </div>
  );
}

function StudioTemplate({ cv, scheme, fontStack, fontSize, compact }: TemplateProps) {
  return (
    <div style={{ background: scheme.bg, color: scheme.text, fontFamily: fontStack, fontSize }} className="w-full h-full p-[6%] overflow-hidden">
      <header className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden" style={{ background: `linear-gradient(135deg, ${scheme.accent}, ${scheme.muted})` }}>
          {cv.design.showPhoto && cv.personal.photo ? (
            <img src={cv.personal.photo} alt="" className="w-full h-full object-cover" />
          ) : (
            <span style={{ color: scheme.bg, fontWeight: 800, fontSize: fontSize * 1.8 }}>{(cv.personal.fullName || "Y")[0]}</span>
          )}
        </div>
        <div className="flex-1">
          <h1 style={{ fontSize: fontSize * 1.8, fontWeight: 800, color: scheme.text, lineHeight: 1.1 }}>{cv.personal.fullName || "Your Name"}</h1>
          <p style={{ fontSize: fontSize * 1.0, color: scheme.accent }}>{cv.personal.title || "Title"}</p>
          <div style={{ fontSize: fontSize * 0.7, color: scheme.muted, marginTop: 2 }} className="flex flex-wrap gap-x-3">
            {cv.personal.email && <span>{cv.personal.email}</span>}
            {cv.personal.phone && <span>· {cv.personal.phone}</span>}
            {cv.personal.website && <span>· {cv.personal.website}</span>}
          </div>
        </div>
      </header>

      {cv.summary && (
        <Section title="About Me" scheme={scheme} fontSize={fontSize} compact={compact}>
          <p style={{ color: scheme.muted, lineHeight: 1.5 }}>{cv.summary}</p>
        </Section>
      )}

      {cv.projects.length > 0 && (
        <Section title="Projects" scheme={scheme} fontSize={fontSize} compact={compact}>
          <div className="grid grid-cols-2 gap-2">
            {cv.projects.slice(0, 4).map((p, i) => (
              <div key={i} className="p-2 rounded" style={{ background: `${scheme.accent}10` }}>
                <div style={{ color: scheme.text, fontWeight: 600, fontSize: fontSize * 0.9 }}>{p.name}</div>
                <div style={{ color: scheme.muted, fontSize: fontSize * 0.75, marginTop: 1 }}>{Array.isArray(p.technologies) ? p.technologies.join(", ") : p.technologies}</div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {cv.experience.length > 0 && (
        <Section title="Experience" scheme={scheme} fontSize={fontSize} compact={compact}>
          {cv.experience.map((e, i) => (
            <div key={i} className="mb-1.5">
              <div style={{ color: scheme.text, fontWeight: 600 }}>{e.jobTitle}</div>
              <div style={{ color: scheme.accent, fontSize: fontSize * 0.85 }}>{e.company} · {e.startDate} {e.endDate && `— ${e.endDate}`}</div>
            </div>
          ))}
        </Section>
      )}

      {cv.skills.length > 0 && (
        <Section title="Toolkit" scheme={scheme} fontSize={fontSize} compact={compact}>
          <div className="flex flex-wrap gap-1">
            {cv.skills.map((s, i) => (
              <span key={i} style={{ fontSize: fontSize * 0.7, background: scheme.accent, color: scheme.bg, padding: "1px 6px", borderRadius: 4 }}>{s}</span>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

// ============== Shared sub-components ==============

function Section({ title, scheme, fontSize, compact, children }: { title: string; scheme: any; fontSize: number; compact?: boolean; children: React.ReactNode }) {
  return (
    <section className="mb-3">
      <h2 style={{ fontSize: fontSize * 1.05, fontWeight: 700, color: scheme.accent, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</h2>
      {children}
    </section>
  );
}

function SectionTitle({ children, scheme, fontSize, center }: { children: React.ReactNode; scheme: any; fontSize: number; center?: boolean }) {
  return (
    <h2 style={{ fontSize: fontSize * 1.0, fontWeight: 700, color: scheme.accent, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em", textAlign: center ? "center" : "left" }} className="relative">
      {children}
      {center && <div style={{ width: "20%", height: 1, background: scheme.accent, margin: "4px auto 0" }} />}
    </h2>
  );
}

function TwoColRow({ cv, scheme, fontSize, compact }: { cv: CVData; scheme: any; fontSize: number; compact?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {cv.education.length > 0 && (
        <Section title="Education" scheme={scheme} fontSize={fontSize} compact={compact}>
          {cv.education.map((e, i) => (
            <div key={i} className="mb-1">
              <div style={{ color: scheme.text, fontWeight: 600, fontSize: fontSize * 0.95 }}>{e.degree}</div>
              <div style={{ color: scheme.muted, fontSize: fontSize * 0.8 }}>{e.institution}</div>
            </div>
          ))}
        </Section>
      )}
      {cv.skills.length > 0 && (
        <Section title="Skills" scheme={scheme} fontSize={fontSize} compact={compact}>
          <div className="flex flex-wrap gap-1">
            {cv.skills.slice(0, 12).map((s, i) => (
              <span key={i} style={{ fontSize: fontSize * 0.75, color: scheme.muted }}>· {s}</span>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function createFallbackCV(): CVData {
  return {
    id: "fallback",
    name: "Sample CV",
    personal: {
      fullName: "Alex Johnson",
      title: "Senior Software Engineer",
      email: "alex@example.com",
      phone: "+1 555 000 0000",
      location: "San Francisco, CA",
      website: "alex.dev",
      linkedin: "linkedin.com/in/alex",
      photo: "",
    },
    summary: "Senior software engineer with 8+ years of experience building scalable web applications and leading cross-functional teams. Passionate about clean architecture, performance, and mentorship.",
    experience: [
      {
        id: "e1", jobTitle: "Senior Software Engineer", company: "Acme Corp", location: "San Francisco, CA",
        startDate: "Jan 2022", endDate: "Present", current: true,
        responsibilities: "Led the migration of legacy services to a modern microservices architecture, improving scalability and reducing deploy time by 60%.\nMentored 4 junior engineers and established the team's code review culture.",
        achievements: "",
      },
      {
        id: "e2", jobTitle: "Software Engineer", company: "TechCo", location: "Remote",
        startDate: "Jun 2018", endDate: "Dec 2021", current: false,
        responsibilities: "Built and maintained core product features serving 100k+ daily active users.\nCollaborated with product and design teams to ship new features end-to-end.",
        achievements: "",
      },
    ],
    education: [
      { id: "ed1", degree: "B.Sc. Computer Science", institution: "Stanford University", field: "Computer Science", location: "Stanford, CA", startDate: "2014", endDate: "2018", description: "Graduated with honors. GPA 3.9/4.0." },
    ],
    skills: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL", "Docker", "AWS", "Leadership", "Mentorship"],
    projects: [
      { id: "p1", name: "OpenSource Dashboard", description: "An open-source analytics dashboard built with React and D3.", technologies: ["React", "D3", "TypeScript"], url: "" },
    ],
    certifications: [{ id: "c1", name: "AWS Solutions Architect", issuer: "Amazon", date: "2023" }],
    languages: [{ id: "l1", name: "English", proficiency: "Native" }, { id: "l2", name: "Spanish", proficiency: "Fluent" }],
    achievements: [],
    awards: [],
    publications: [],
    volunteer: [],
    interests: ["Open Source", "Hiking", "Photography"],
    template: "aurora",
    design: {
      fontFamily: "inter", fontSize: 14, sectionSpacing: 16, margins: 32,
      sectionOrder: ["personal", "summary", "experience", "education", "skills", "projects", "certifications", "languages"],
      colorScheme: "nirvash", showPhoto: false, showIcons: true, showDividers: true,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}
