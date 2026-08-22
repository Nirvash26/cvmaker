"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, ChevronDown, Plus, X, Save,
  User, Sparkles, Briefcase, GraduationCap, Award,
  FolderGit2, BadgeCheck, Languages as LangIcon, MoreHorizontal,
  CheckCircle2, Copy, BookOpen, HandHeart,
} from "lucide-react";
import { useAppStore, useCurrentCV } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { AISummaryButton } from "@/components/ai/AISummaryButton";
import { AIImproveButton } from "@/components/ai/AIImproveButton";
import { AIAchievementsButton } from "@/components/ai/AIAchievementsButton";
import { AISkillsSuggestions } from "@/components/ai/AISkillsSuggestions";
import { AIProjectImprover } from "@/components/ai/AIProjectImprover";
import { AIBulletPoints } from "@/components/ai/AIBulletPoints";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "personal", label: "Personal Information", icon: User },
  { id: "summary", label: "Professional Summary", icon: Sparkles },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Award },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "certifications", label: "Certifications", icon: BadgeCheck },
  { id: "languages", label: "Languages", icon: LangIcon },
  { id: "additional", label: "Additional Information", icon: MoreHorizontal },
];

export function FormBuilder() {
  const cv = useCurrentCV();
  const setView = useAppStore((s) => s.setView);
  const [active, setActive] = useState("personal");

  if (!cv) return null;

  const completedSections = countCompleted(cv);
  const completionPct = Math.round((completedSections / SECTIONS.length) * 100);

  return (
    <div className="min-h-screen pt-20">
      {/* Top bar */}
      <div className="sticky top-16 z-30 bg-[#2C3531]/80 backdrop-blur-xl border-b border-[#D1E8E2]/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={() => setView("dashboard")}
              className="inline-flex items-center gap-1 text-sm text-[#9DB5B0] hover:text-[#D1E8E2] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <div className="text-sm text-[#D1E8E2]/80 hidden sm:block">
              <span className="text-[#FFCB9A] font-semibold">{completedSections}</span> / {SECTIONS.length} sections filled
            </div>
            <Button
              onClick={() => setView("template-gallery")}
              className="bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2]"
            >
              Continue to Templates <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-16 grid lg:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-32 lg:self-start space-y-1 lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto no-scrollbar">
          {SECTIONS.map((s) => {
            const isComplete = isSectionComplete(cv, s.id);
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                  isActive
                    ? "bg-[#116466]/30 border border-[#116466]/50 text-[#D1E8E2]"
                    : "text-[#9DB5B0] hover:bg-[#3D4944]/50 hover:text-[#D1E8E2] border border-transparent"
                )}
              >
                <s.icon className={cn("w-4 h-4 shrink-0", isActive && "text-[#FFCB9A]")} />
                <span className="flex-1 text-left font-medium">{s.label}</span>
                {isComplete ? (
                  <CheckCircle2 className="w-4 h-4 text-[#FFCB9A]" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-[#D1E8E2]/20" />
                )}
              </button>
            );
          })}

          {/* Completion progress */}
          <div className="mt-5 p-4 rounded-xl glass-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#9DB5B0] uppercase tracking-wider">CV Completion</span>
              <span className="text-sm font-semibold text-[#FFCB9A]">{completionPct}%</span>
            </div>
            <Progress value={completionPct} className="h-2 bg-[#3D4944]" />
            <p className="mt-2 text-xs text-[#9DB5B0]">
              {completionPct === 100 ? "Looking great! Ready to choose a template." : "Fill in more sections to complete your CV."}
            </p>
          </div>
        </aside>

        {/* Active section */}
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {active === "personal" && <PersonalSection cv={cv} />}
              {active === "summary" && <SummarySection cv={cv} />}
              {active === "experience" && <ExperienceSection cv={cv} />}
              {active === "education" && <EducationSection cv={cv} />}
              {active === "skills" && <SkillsSection cv={cv} />}
              {active === "projects" && <ProjectsSection cv={cv} />}
              {active === "certifications" && <CertificationsSection cv={cv} />}
              {active === "languages" && <LanguagesSection cv={cv} />}
              {active === "additional" && <AdditionalSection cv={cv} />}
            </motion.div>
          </AnimatePresence>

          {/* Footer actions */}
          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => {
                const idx = SECTIONS.findIndex((s) => s.id === active);
                if (idx > 0) setActive(SECTIONS[idx - 1].id);
              }}
              className="text-[#9DB5B0] disabled:opacity-30"
              disabled={SECTIONS[0].id === active}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>
            <Button
              onClick={() => {
                const idx = SECTIONS.findIndex((s) => s.id === active);
                if (idx < SECTIONS.length - 1) setActive(SECTIONS[idx + 1].id);
                else setView("template-gallery");
              }}
              className="bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2]"
            >
              {SECTIONS[SECTIONS.length - 1].id === active ? "Continue to Templates" : "Next Section"}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============= Section Components =============

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-[#D1E8E2]">{title}</h1>
      <p className="mt-1 text-sm text-[#9DB5B0]">{subtitle}</p>
    </div>
  );
}

function Card({ children, title, onRemove, onDuplicate }: { children: React.ReactNode; title?: string; onRemove?: () => void; onDuplicate?: () => void }) {
  return (
    <div className="p-5 rounded-xl glass-card space-y-3 relative">
      {title && (
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-[#FFCB9A] uppercase tracking-wider">{title}</h3>
          <div className="flex items-center gap-1">
            {onDuplicate && (
              <button onClick={onDuplicate} title="Duplicate" className="text-[#9DB5B0] hover:text-[#FFCB9A] p-1">
                <Copy className="w-3.5 h-3.5" />
              </button>
            )}
            {onRemove && (
              <button onClick={onRemove} title="Remove" className="text-[#9DB5B0] hover:text-[#FFCB9A] p-1">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

function PersonalSection({ cv }: { cv: any }) {
  const updatePersonal = useAppStore((s) => s.updatePersonal);
  const updateCV = useAppStore((s) => s.updateCV);
  const p = cv.personal;

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updatePersonal(cv.id, { photo: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <SectionHeader title="Personal Information" subtitle="Basic contact details shown at the top of your CV." />
      <div className="space-y-5">
        <div className="flex items-center gap-4 p-4 glass-card rounded-xl">
          <div className="w-16 h-16 rounded-full bg-[#3D4944] border border-[#D1E8E2]/15 flex items-center justify-center overflow-hidden">
            {p.photo ? <img src={p.photo} alt="" className="w-full h-full object-cover" /> : <User className="w-6 h-6 text-[#9DB5B0]" />}
          </div>
          <div className="flex-1">
            <input id="photo" type="file" accept="image/*" onChange={onPhoto} className="hidden" />
            <Label htmlFor="photo" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#3D4944] hover:bg-[#3D4944]/80 cursor-pointer text-sm text-[#D1E8E2]">
              <Plus className="w-4 h-4" /> {p.photo ? "Change Photo" : "Upload Photo"}
            </Label>
            {p.photo && (
              <button onClick={() => updatePersonal(cv.id, { photo: "" })} className="ml-2 text-sm text-[#9DB5B0] hover:text-[#FFCB9A]">
                Remove
              </button>
            )}
            <p className="text-xs text-[#9DB5B0] mt-1">Profile photo is completely optional.</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-[#9DB5B0] text-xs uppercase tracking-wider mb-1.5 block">Full Name</Label>
            <Input value={p.fullName} onChange={(e) => updatePersonal(cv.id, { fullName: e.target.value })} placeholder="Alex Johnson" className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
          </div>
          <div>
            <Label className="text-[#9DB5B0] text-xs uppercase tracking-wider mb-1.5 block">Professional Title</Label>
            <Input value={p.title} onChange={(e) => updatePersonal(cv.id, { title: e.target.value })} placeholder="Software Engineer" className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
          </div>
          <div>
            <Label className="text-[#9DB5B0] text-xs uppercase tracking-wider mb-1.5 block">Email</Label>
            <Input type="email" value={p.email} onChange={(e) => updatePersonal(cv.id, { email: e.target.value })} placeholder="alex@example.com" className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
          </div>
          <div>
            <Label className="text-[#9DB5B0] text-xs uppercase tracking-wider mb-1.5 block">Phone</Label>
            <Input value={p.phone} onChange={(e) => updatePersonal(cv.id, { phone: e.target.value })} placeholder="+1 555 000 0000" className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
          </div>
          <div>
            <Label className="text-[#9DB5B0] text-xs uppercase tracking-wider mb-1.5 block">Location</Label>
            <Input value={p.location} onChange={(e) => updatePersonal(cv.id, { location: e.target.value })} placeholder="San Francisco, CA" className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
          </div>
          <div>
            <Label className="text-[#9DB5B0] text-xs uppercase tracking-wider mb-1.5 block">Website</Label>
            <Input value={p.website} onChange={(e) => updatePersonal(cv.id, { website: e.target.value })} placeholder="alex.dev" className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
          </div>
          <div>
            <Label className="text-[#9DB5B0] text-xs uppercase tracking-wider mb-1.5 block">LinkedIn</Label>
            <Input value={p.linkedin} onChange={(e) => updatePersonal(cv.id, { linkedin: e.target.value })} placeholder="linkedin.com/in/alex" className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
          </div>
          <div>
            <Label className="text-[#9DB5B0] text-xs uppercase tracking-wider mb-1.5 block">GitHub</Label>
            <Input value={p.github} onChange={(e) => updatePersonal(cv.id, { github: e.target.value })} placeholder="github.com/alex" className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
          </div>
        </div>
        <div>
          <Label className="text-[#9DB5B0] text-xs uppercase tracking-wider mb-1.5 block">CV Name (internal)</Label>
          <Input value={cv.name} onChange={(e) => updateCV(cv.id, { name: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
        </div>
      </div>
    </div>
  );
}

function SummarySection({ cv }: { cv: any }) {
  const updateCV = useAppStore((s) => s.updateCV);
  return (
    <div>
      <SectionHeader title="Professional Summary" subtitle="A short paragraph that introduces who you are." />
      <Textarea
        value={cv.summary}
        onChange={(e) => updateCV(cv.id, { summary: e.target.value })}
        placeholder="I am a passionate software developer with experience building modern web applications..."
        className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] min-h-[160px] text-base leading-relaxed"
      />
      <div className="mt-3 flex justify-end">
        <AISummaryButton
          context={{ jobTitle: cv.personal.title, skills: cv.skills, summary: cv.summary }}
          onApply={(text) => updateCV(cv.id, { summary: text })}
        />
      </div>
    </div>
  );
}

function ExperienceSection({ cv }: { cv: any }) {
  const add = useAppStore((s) => s.addExperience);
  const update = useAppStore((s) => s.updateExperience);
  const remove = useAppStore((s) => s.removeExperience);
  const duplicate = useAppStore((s) => s.duplicateExperience);
  const [openId, setOpenId] = useState<string | null>(cv.experience[0]?.id ?? null);

  return (
    <div>
      <SectionHeader title="Experience" subtitle="Your work history, internships, and freelance work." />
      <div className="space-y-3">
        {cv.experience.map((exp: any, i: number) => {
          const open = openId === exp.id;
          return (
            <div key={exp.id} className="rounded-xl glass-card overflow-hidden">
              <div className="flex items-center">
                <button
                  onClick={() => setOpenId(open ? null : exp.id)}
                  className="flex-1 flex items-center justify-between p-4 text-left"
                >
                  <div>
                    <div className="text-sm font-medium text-[#D1E8E2]">
                      {exp.jobTitle || `Experience ${i + 1}`}
                      {exp.company && <span className="text-[#9DB5B0]"> — {exp.company}</span>}
                    </div>
                    <div className="text-xs text-[#9DB5B0] mt-0.5">
                      {exp.location || "—"} {exp.startDate && `· ${exp.startDate}`} {exp.endDate && `— ${exp.endDate}`}
                    </div>
                  </div>
                  <ChevronDown className={cn("w-4 h-4 text-[#9DB5B0] transition-transform", open && "rotate-180")} />
                </button>
                <div className="flex items-center gap-1 pr-2">
                  <button
                    onClick={() => duplicate(cv.id, exp.id)}
                    title="Duplicate"
                    className="p-2 text-[#9DB5B0] hover:text-[#FFCB9A]"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => remove(cv.id, exp.id)}
                    title="Remove"
                    className="p-2 text-[#9DB5B0] hover:text-[#FFCB9A]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 space-y-3 border-t border-[#D1E8E2]/5">
                      <div className="grid sm:grid-cols-2 gap-3 pt-3">
                        <Input placeholder="Job Title" value={exp.jobTitle} onChange={(e) => update(cv.id, exp.id, { jobTitle: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
                        <Input placeholder="Company" value={exp.company} onChange={(e) => update(cv.id, exp.id, { company: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
                        <Input placeholder="Location" value={exp.location} onChange={(e) => update(cv.id, exp.id, { location: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
                        <div className="grid grid-cols-2 gap-2">
                          <Input placeholder="Start (Jan 2023)" value={exp.startDate} onChange={(e) => update(cv.id, exp.id, { startDate: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
                          <Input placeholder="End" value={exp.endDate} onChange={(e) => update(cv.id, exp.id, { endDate: e.target.value })} disabled={exp.current} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] disabled:opacity-50" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={exp.current} onCheckedChange={(v) => update(cv.id, exp.id, { current: v, endDate: v ? "" : exp.endDate })} />
                        <span className="text-sm text-[#9DB5B0]">I currently work here</span>
                      </div>
                      <div>
                        <Label className="text-[#9DB5B0] text-xs uppercase tracking-wider mb-1.5 block">Responsibilities</Label>
                        <Textarea placeholder="What did you do day to day?" value={exp.responsibilities} onChange={(e) => update(cv.id, exp.id, { responsibilities: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] min-h-[80px]" />
                        <div className="mt-2 flex justify-end">
                          <AIImproveButton
                            jobTitle={exp.jobTitle}
                            description={exp.responsibilities}
                            type="responsibilities"
                            onApply={(text) => update(cv.id, exp.id, { responsibilities: text })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-[#9DB5B0] text-xs uppercase tracking-wider mb-1.5 block">Achievements</Label>
                        <Textarea placeholder="What did you accomplish?" value={exp.achievements} onChange={(e) => update(cv.id, exp.id, { achievements: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] min-h-[80px]" />
                        <div className="mt-2 flex justify-end">
                          <AIAchievementsButton
                            jobTitle={exp.jobTitle || cv.personal.title}
                            context={exp.achievements || exp.responsibilities}
                            onApply={(text) => update(cv.id, exp.id, { achievements: text })}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      <button
        onClick={() => {
          add(cv.id);
          setTimeout(() => {
            const newId = useAppStore.getState().cvs.find((c) => c.id === cv.id)?.experience.slice(-1)[0]?.id;
            if (newId) setOpenId(newId);
          }, 50);
        }}
        className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-[#D1E8E2]/20 text-[#9DB5B0] hover:text-[#D1E8E2] hover:border-[#116466] transition-all"
      >
        <Plus className="w-4 h-4" /> Add Another Experience
      </button>
    </div>
  );
}

function EducationSection({ cv }: { cv: any }) {
  const add = useAppStore((s) => s.addEducation);
  const update = useAppStore((s) => s.updateEducation);
  const remove = useAppStore((s) => s.removeEducation);
  const duplicate = useAppStore((s) => s.duplicateEducation);
  const [openId, setOpenId] = useState<string | null>(cv.education[0]?.id ?? null);

  return (
    <div>
      <SectionHeader title="Education" subtitle="Your degrees, certifications, and academic background." />
      <div className="space-y-3">
        {cv.education.length === 0 && (
          <div className="p-8 text-center rounded-xl border border-dashed border-[#D1E8E2]/15 text-[#9DB5B0]">No education added yet.</div>
        )}
        {cv.education.map((edu: any, i: number) => {
          const open = openId === edu.id;
          return (
            <div key={edu.id} className="rounded-xl glass-card overflow-hidden">
              <div className="flex items-center">
                <button
                  onClick={() => setOpenId(open ? null : edu.id)}
                  className="flex-1 flex items-center justify-between p-4 text-left"
                >
                  <div>
                    <div className="text-sm font-medium text-[#D1E8E2]">
                      {edu.degree || `Education ${i + 1}`}
                    </div>
                    <div className="text-xs text-[#9DB5B0] mt-0.5">
                      {edu.institution || "—"} {(edu.startDate || edu.endDate) && `· ${edu.startDate} ${edu.endDate ? `— ${edu.endDate}` : ""}`}
                    </div>
                  </div>
                  <ChevronDown className={cn("w-4 h-4 text-[#9DB5B0] transition-transform", open && "rotate-180")} />
                </button>
                <div className="flex items-center gap-1 pr-2">
                  <button onClick={() => duplicate(cv.id, edu.id)} title="Duplicate" className="p-2 text-[#9DB5B0] hover:text-[#FFCB9A]"><Copy className="w-3.5 h-3.5" /></button>
                  <button onClick={() => remove(cv.id, edu.id)} title="Remove" className="p-2 text-[#9DB5B0] hover:text-[#FFCB9A]"><X className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 space-y-3 border-t border-[#D1E8E2]/5">
                      <div className="grid sm:grid-cols-2 gap-3 pt-3">
                        <Input placeholder="Degree" value={edu.degree} onChange={(e) => update(cv.id, edu.id, { degree: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
                        <Input placeholder="Institution" value={edu.institution} onChange={(e) => update(cv.id, edu.id, { institution: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
                        <Input placeholder="Field of Study" value={edu.field} onChange={(e) => update(cv.id, edu.id, { field: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
                        <Input placeholder="Location" value={edu.location} onChange={(e) => update(cv.id, edu.id, { location: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
                        <Input placeholder="Start Date" value={edu.startDate} onChange={(e) => update(cv.id, edu.id, { startDate: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
                        <Input placeholder="End Date" value={edu.endDate} onChange={(e) => update(cv.id, edu.id, { endDate: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
                      </div>
                      <div>
                        <Label className="text-[#9DB5B0] text-xs uppercase tracking-wider mb-1.5 block">Description or achievements (optional)</Label>
                        <Textarea placeholder="e.g. Graduated with honors. Relevant coursework: Data Structures, Algorithms." value={edu.description} onChange={(e) => update(cv.id, edu.id, { description: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] min-h-[60px]" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      <button onClick={() => add(cv.id)} className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-[#D1E8E2]/20 text-[#9DB5B0] hover:text-[#D1E8E2] hover:border-[#116466] transition-all">
        <Plus className="w-4 h-4" /> Add Another Education
      </button>
    </div>
  );
}

function SkillsSection({ cv }: { cv: any }) {
  const addSkill = useAppStore((s) => s.addSkill);
  const removeSkill = useAppStore((s) => s.removeSkill);
  const [input, setInput] = useState("");

  const add = () => {
    if (input.trim()) { addSkill(cv.id, input.trim()); setInput(""); }
  };

  return (
    <div>
      <SectionHeader title="Skills" subtitle="Your key technical and soft skills shown as tags." />
      <div className="flex gap-2">
        <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} placeholder="Type a skill and press Enter..." className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] h-11" />
        <Button onClick={add} className="bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2]"><Plus className="w-4 h-4" /></Button>
      </div>
      {cv.skills.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {cv.skills.map((s: string) => (
            <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#116466]/30 border border-[#116466]/50 text-[#D1E8E2] text-sm">
              {s}
              <button onClick={() => removeSkill(cv.id, s)} className="text-[#9DB5B0] hover:text-[#FFCB9A]"><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
      )}
      <div className="mt-5 pt-4 border-t border-[#D1E8E2]/5">
        <AISkillsSuggestions
          jobTitle={cv.personal.title}
          experience={cv.experience[0]?.jobTitle}
          education={cv.education[0]?.field}
          existingSkills={cv.skills}
          onAddSkill={(skill) => addSkill(cv.id, skill)}
        />
      </div>
    </div>
  );
}

function ProjectsSection({ cv }: { cv: any }) {
  const add = useAppStore((s) => s.addProject);
  const update = useAppStore((s) => s.updateProject);
  const remove = useAppStore((s) => s.removeProject);
  const addProjectTech = useAppStore((s) => s.addProjectTech);
  const removeProjectTech = useAppStore((s) => s.removeProjectTech);
  const [techInput, setTechInput] = useState<Record<string, string>>({});

  return (
    <div>
      <SectionHeader title="Projects" subtitle="Showcase work you're proud of." />
      <div className="space-y-4">
        {cv.projects.map((p: any, i: number) => (
          <Card key={p.id} title={`Project ${i + 1}`} onRemove={() => remove(cv.id, p.id)}>
            <Input placeholder="Project Name" value={p.name} onChange={(e) => update(cv.id, p.id, { name: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
            <Textarea placeholder="Description" value={p.description} onChange={(e) => update(cv.id, p.id, { description: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] min-h-[80px]" />
            {p.description && (
              <div className="flex justify-end -mt-1">
                <AIProjectImprover
                  projectName={p.name}
                  description={p.description}
                  technologies={p.technologies || []}
                  onApply={(text) => update(cv.id, p.id, { description: text })}
                />
              </div>
            )}
            <div>
              <Label className="text-[#9DB5B0] text-xs uppercase tracking-wider mb-1.5 block">Technologies Used</Label>
              <div className="flex gap-2">
                <Input
                  value={techInput[p.id] || ""}
                  onChange={(e) => setTechInput({ ...techInput, [p.id]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (techInput[p.id] || "").trim()) {
                      e.preventDefault();
                      addProjectTech(cv.id, p.id, techInput[p.id]);
                      setTechInput({ ...techInput, [p.id]: "" });
                    }
                  }}
                  placeholder="Type a technology and press Enter..."
                  className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]"
                />
                <Button size="sm" onClick={() => { if ((techInput[p.id] || "").trim()) { addProjectTech(cv.id, p.id, techInput[p.id]); setTechInput({ ...techInput, [p.id]: "" }); } }} className="bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2]">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {p.technologies?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {p.technologies.map((t: string) => (
                    <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#116466]/30 border border-[#116466]/40 text-[#D1E8E2] text-xs">
                      {t}
                      <button onClick={() => removeProjectTech(cv.id, p.id, t)} className="text-[#9DB5B0] hover:text-[#FFCB9A]"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <Input placeholder="Project URL (optional)" value={p.url} onChange={(e) => update(cv.id, p.id, { url: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
          </Card>
        ))}
      </div>
      <button onClick={() => add(cv.id)} className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-[#D1E8E2]/20 text-[#9DB5B0] hover:text-[#D1E8E2] hover:border-[#116466] transition-all">
        <Plus className="w-4 h-4" /> Add Another Project
      </button>
    </div>
  );
}

function CertificationsSection({ cv }: { cv: any }) {
  const add = useAppStore((s) => s.addCertification);
  const update = useAppStore((s) => s.updateCertification);
  const remove = useAppStore((s) => s.removeCertification);

  return (
    <div>
      <SectionHeader title="Certifications" subtitle="Professional certifications and licenses." />
      <div className="space-y-4">
        {cv.certifications.map((c: any, i: number) => (
          <Card key={c.id} title={`Certification ${i + 1}`} onRemove={() => remove(cv.id, c.id)}>
            <div className="grid sm:grid-cols-3 gap-3">
              <Input placeholder="Name" value={c.name} onChange={(e) => update(cv.id, c.id, { name: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
              <Input placeholder="Issuer" value={c.issuer} onChange={(e) => update(cv.id, c.id, { issuer: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
              <Input placeholder="Date" value={c.date} onChange={(e) => update(cv.id, c.id, { date: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
            </div>
          </Card>
        ))}
      </div>
      <button onClick={() => add(cv.id)} className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-[#D1E8E2]/20 text-[#9DB5B0] hover:text-[#D1E8E2] hover:border-[#116466] transition-all">
        <Plus className="w-4 h-4" /> Add Certification
      </button>
    </div>
  );
}

function LanguagesSection({ cv }: { cv: any }) {
  const add = useAppStore((s) => s.addLanguage);
  const update = useAppStore((s) => s.updateLanguage);
  const remove = useAppStore((s) => s.removeLanguage);

  return (
    <div>
      <SectionHeader title="Languages" subtitle="Languages you speak and your proficiency." />
      <div className="space-y-3">
        {cv.languages.map((l: any) => (
          <div key={l.id} className="flex gap-2 items-center p-3 glass-card rounded-lg">
            <Input placeholder="Language" value={l.name} onChange={(e) => update(cv.id, l.id, { name: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] flex-1" />
            <select value={l.proficiency} onChange={(e) => update(cv.id, l.id, { proficiency: e.target.value })} className="bg-[#3D4944] border border-[#D1E8E2]/10 text-[#D1E8E2] rounded-md px-3 text-sm h-10">
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Fluent</option>
              <option>Native</option>
            </select>
            <button onClick={() => remove(cv.id, l.id)} className="text-[#9DB5B0] hover:text-[#FFCB9A] p-2"><X className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
      <button onClick={() => add(cv.id)} className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-[#D1E8E2]/20 text-[#9DB5B0] hover:text-[#D1E8E2] hover:border-[#116466] transition-all">
        <Plus className="w-4 h-4" /> Add Language
      </button>
    </div>
  );
}

function AdditionalSection({ cv }: { cv: any }) {
  const addAward = useAppStore((s) => s.addAward);
  const updateAward = useAppStore((s) => s.updateAward);
  const removeAward = useAppStore((s) => s.removeAward);
  const addPublication = useAppStore((s) => s.addPublication);
  const updatePublication = useAppStore((s) => s.updatePublication);
  const removePublication = useAppStore((s) => s.removePublication);
  const addInterest = useAppStore((s) => s.addInterest);
  const removeInterest = useAppStore((s) => s.removeInterest);
  const addVolunteer = useAppStore((s) => s.addVolunteer);
  const removeVolunteer = useAppStore((s) => s.removeVolunteer);
  const [interestInput, setInterestInput] = useState("");
  const [volunteerInput, setVolunteerInput] = useState("");

  return (
    <div>
      <SectionHeader title="Additional Information" subtitle="Optional sections to round out your CV." />
      <div className="space-y-6">
        {/* Awards */}
        <div>
          <h3 className="text-sm font-semibold text-[#FFCB9A] mb-2 flex items-center gap-1.5"><Award className="w-4 h-4" /> Awards & Achievements</h3>
          <div className="space-y-3">
            {cv.awards.map((a: any, i: number) => (
              <Card key={a.id} title={`Award ${i + 1}`} onRemove={() => removeAward(cv.id, a.id)}>
                <div className="grid sm:grid-cols-3 gap-3">
                  <Input placeholder="Title" value={a.title} onChange={(e) => updateAward(cv.id, a.id, { title: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
                  <Input placeholder="Issuer" value={a.issuer} onChange={(e) => updateAward(cv.id, a.id, { issuer: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
                  <Input placeholder="Date" value={a.date} onChange={(e) => updateAward(cv.id, a.id, { date: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
                </div>
                <Input placeholder="Description (optional)" value={a.description} onChange={(e) => updateAward(cv.id, a.id, { description: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
              </Card>
            ))}
          </div>
          <button onClick={() => addAward(cv.id)} className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-[#D1E8E2]/20 text-[#9DB5B0] hover:text-[#D1E8E2] hover:border-[#116466] text-sm transition-all">
            <Plus className="w-3.5 h-3.5" /> Add Award
          </button>
        </div>

        {/* Publications */}
        <div>
          <h3 className="text-sm font-semibold text-[#FFCB9A] mb-2 flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> Publications</h3>
          <div className="space-y-3">
            {cv.publications.map((p: any, i: number) => (
              <Card key={p.id} title={`Publication ${i + 1}`} onRemove={() => removePublication(cv.id, p.id)}>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input placeholder="Title" value={p.title} onChange={(e) => updatePublication(cv.id, p.id, { title: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
                  <Input placeholder="Publisher" value={p.publisher} onChange={(e) => updatePublication(cv.id, p.id, { publisher: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
                  <Input placeholder="Date" value={p.date} onChange={(e) => updatePublication(cv.id, p.id, { date: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
                  <Input placeholder="URL (optional)" value={p.url} onChange={(e) => updatePublication(cv.id, p.id, { url: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
                </div>
              </Card>
            ))}
          </div>
          <button onClick={() => addPublication(cv.id)} className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-[#D1E8E2]/20 text-[#9DB5B0] hover:text-[#D1E8E2] hover:border-[#116466] text-sm transition-all">
            <Plus className="w-3.5 h-3.5" /> Add Publication
          </button>
        </div>

        {/* Volunteer */}
        <div>
          <h3 className="text-sm font-semibold text-[#FFCB9A] mb-2 flex items-center gap-1.5"><HandHeart className="w-4 h-4" /> Volunteer Experience</h3>
          <div className="flex gap-2 mb-2">
            <Input value={volunteerInput} onChange={(e) => setVolunteerInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && volunteerInput.trim()) { addVolunteer(cv.id, volunteerInput.trim()); setVolunteerInput(""); } }} placeholder="Add volunteer experience" className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
          </div>
          {cv.volunteer.length > 0 && (
            <ul className="space-y-1.5">
              {cv.volunteer.map((v: string, i: number) => (
                <li key={i} className="flex items-start gap-2 p-2 glass-card rounded-md text-sm text-[#D1E8E2]">
                  <span className="flex-1">{v}</span>
                  <button onClick={() => removeVolunteer(cv.id, i)} className="text-[#9DB5B0] hover:text-[#FFCB9A]"><X className="w-3.5 h-3.5" /></button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Interests */}
        <div>
          <h3 className="text-sm font-semibold text-[#FFCB9A] mb-2 flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> Interests</h3>
          <div className="flex gap-2 mb-3">
            <Input value={interestInput} onChange={(e) => setInterestInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && interestInput.trim()) { addInterest(cv.id, interestInput.trim()); setInterestInput(""); } }} placeholder="Add an interest" className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
          </div>
          {cv.interests.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {cv.interests.map((int: string, i: number) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3D4944] border border-[#D1E8E2]/10 text-[#D1E8E2] text-sm">
                  {int}
                  <button onClick={() => removeInterest(cv.id, i)} className="text-[#9DB5B0] hover:text-[#FFCB9A]"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helpers
function isSectionComplete(cv: any, sectionId: string): boolean {
  switch (sectionId) {
    case "personal": return !!(cv.personal.fullName && cv.personal.email);
    case "summary": return cv.summary.length > 30;
    case "experience": return cv.experience.length > 0 && cv.experience.some((e: any) => e.jobTitle);
    case "education": return cv.education.length > 0;
    case "skills": return cv.skills.length > 0;
    case "projects": return cv.projects.length > 0;
    case "certifications": return cv.certifications.length > 0;
    case "languages": return cv.languages.length > 0;
    case "additional": return cv.awards.length > 0 || cv.publications.length > 0 || cv.volunteer.length > 0 || cv.interests.length > 0;
    default: return false;
  }
}

function countCompleted(cv: any): number {
  return SECTIONS.filter((s) => isSectionComplete(cv, s.id)).length;
}
