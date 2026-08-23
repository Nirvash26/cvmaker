"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, Save, Undo2, Redo2, Download, Eye, Settings2,
  ZoomIn, ZoomOut, Maximize2, Check, Sparkles, AlertCircle,
  User, Briefcase, GraduationCap, Award, FolderGit2, BadgeCheck,
  Languages as LangIcon, Plus, X, RotateCcw, GripVertical,
} from "lucide-react";
import { useAppStore, useCurrentCV } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { COLOR_SCHEMES, FONT_FAMILIES } from "@/lib/types";
import { TemplatePreview } from "./TemplatePreview";
import { QualityCheck } from "@/components/quality/QualityCheck";
import { DownloadModal } from "@/components/common/DownloadModal";
import { AISummaryButton } from "@/components/ai/AISummaryButton";
import { AIImproveButton } from "@/components/ai/AIImproveButton";
import { AIProjectImprover } from "@/components/ai/AIProjectImprover";
import { AISkillsSuggestions } from "@/components/ai/AISkillsSuggestions";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const EDIT_SECTIONS = [
  { id: "personal", label: "Personal", icon: User },
  { id: "summary", label: "Summary", icon: Sparkles },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Award },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "certifications", label: "Certs", icon: BadgeCheck },
  { id: "languages", label: "Languages", icon: LangIcon },
];

export function CVEditor() {
  const cv = useCurrentCV();
  const setView = useAppStore((s) => s.setView);
  const editorTab = useAppStore((s) => s.editorTab);
  const setEditorTab = useAppStore((s) => s.setEditorTab);
  const editorActiveSection = useAppStore((s) => s.editorActiveSection);
  const setEditorActiveSection = useAppStore((s) => s.setEditorActiveSection);
  const previewZoom = useAppStore((s) => s.previewZoom);
  const setPreviewZoom = useAppStore((s) => s.setPreviewZoom);
  const savingStatus = useAppStore((s) => s.savingStatus);
  const setSavingStatus = useAppStore((s) => s.setSavingStatus);

  const [downloadOpen, setDownloadOpen] = useState(false);
  const [qualityOpen, setQualityOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Autosave simulation
  useEffect(() => {
    if (!cv) return;
    setSavingStatus("saving");
    const t = setTimeout(() => setSavingStatus("saved"), 800);
    return () => clearTimeout(t);
  }, [cv, setSavingStatus]);

  if (!cv) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-[#9DB5B0] mx-auto mb-3" />
          <p className="text-[#9DB5B0]">No CV selected.</p>
          <Button onClick={() => setView("dashboard")} className="mt-4 bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2]">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Top toolbar */}
      <div className="sticky top-16 z-30 bg-[#2C3531]/80 backdrop-blur-xl border-b border-[#D1E8E2]/5">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 gap-3">
            {/* Left */}
            <div className="flex items-center gap-3 flex-1">
              <button onClick={() => setView("dashboard")} className="inline-flex items-center gap-1 text-sm text-[#9DB5B0] hover:text-[#D1E8E2] transition-colors">
                <ChevronLeft className="w-4 h-4" /> <span className="hidden sm:inline">My CVs</span>
              </button>
            </div>

            {/* Center: editable CV name */}
            <div className="flex-1 flex justify-center">
              <CVNameEditor cv={cv} />
            </div>

            {/* Right */}
            <div className="flex items-center gap-2 flex-1 justify-end">
              {/* Saving status */}
              <span className="text-xs text-[#9DB5B0] hidden md:flex items-center gap-1.5">
                {savingStatus === "saving" ? (
                  <><span className="w-1.5 h-1.5 rounded-full bg-[#FFCB9A] animate-pulse" /> Saving...</>
                ) : (
                  <><Check className="w-3.5 h-3.5 text-[#FFCB9A]" /> Saved</>
                )}
              </span>

              {/* Undo/Redo (visual only) */}
              <button className="hidden sm:inline-flex p-2 text-[#9DB5B0] hover:text-[#D1E8E2] transition-colors" title="Undo">
                <Undo2 className="w-4 h-4" />
              </button>
              <button className="hidden sm:inline-flex p-2 text-[#9DB5B0] hover:text-[#D1E8E2] transition-colors" title="Redo">
                <Redo2 className="w-4 h-4" />
              </button>

              {/* CV Score */}
              <Button variant="ghost" size="sm" onClick={() => setQualityOpen(true)} className="text-[#9DB5B0] hover:text-[#FFCB9A] hidden md:inline-flex">
                <Award className="w-4 h-4" /> CV Score
              </Button>

              {/* Preview button */}
              <Button variant="ghost" size="sm" onClick={() => window.print()} className="text-[#9DB5B0] hover:text-[#D1E8E2]">
                <Eye className="w-4 h-4" /> <span className="hidden sm:inline">Preview</span>
              </Button>

              {/* Download (primary) */}
              <Button size="sm" onClick={() => setDownloadOpen(true)} className="bg-[#FFCB9A] hover:bg-[#FFCB9A]/90 text-[#2C3531]">
                <Download className="w-4 h-4 mr-1.5" /> Download
              </Button>
            </div>
          </div>

          {/* Mobile tabs */}
          {isMobile && (
            <Tabs value={editorTab} onValueChange={(v) => setEditorTab(v as any)} className="pb-2">
              <TabsList className="grid grid-cols-3 w-full bg-[#3D4944]">
                <TabsTrigger value="edit" className="data-[state=active]:bg-[#116466] data-[state=active]:text-[#D1E8E2] text-[#9DB5B0] text-xs">Edit</TabsTrigger>
                <TabsTrigger value="preview" className="data-[state=active]:bg-[#116466] data-[state=active]:text-[#D1E8E2] text-[#9DB5B0] text-xs">Preview</TabsTrigger>
                <TabsTrigger value="customize" className="data-[state=active]:bg-[#116466] data-[state=active]:text-[#D1E8E2] text-[#9DB5B0] text-xs">Customize</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid md:grid-cols-[40%_60%] gap-4">
          {/* LEFT: Editor (hidden on mobile preview/customize) */}
          <div className={cn("space-y-3", isMobile && editorTab !== "edit" && "hidden")}>
            <EditorSections cv={cv} activeSection={editorActiveSection} setActiveSection={setEditorActiveSection} />
          </div>

          {/* RIGHT: Live preview (hidden on mobile edit) */}
          <div className={cn(isMobile && editorTab !== "preview" && "hidden")}>
            <PreviewPanel cv={cv} zoom={previewZoom} setZoom={setPreviewZoom} />
          </div>

          {/* Customize panel (mobile) */}
          {isMobile && editorTab === "customize" && (
            <CustomizePanel cv={cv} />
          )}
        </div>

        {/* Desktop customize panel as full-width below */}
        {!isMobile && (
          <div className="mt-6">
            <CustomizePanel cv={cv} />
          </div>
        )}
      </div>

      {/* Modals */}
      <DownloadModal open={downloadOpen} onOpenChange={setDownloadOpen} cv={cv} />
      <QualityCheck open={qualityOpen} onOpenChange={setQualityOpen} cv={cv} />
    </div>
  );
}

// ============ Editor Sections ============

function EditorSections({ cv, activeSection, setActiveSection }: { cv: any; activeSection: string; setActiveSection: (s: string) => void }) {
  const updatePersonal = useAppStore((s) => s.updatePersonal);
  const updateCV = useAppStore((s) => s.updateCV);
  const addSkill = useAppStore((s) => s.addSkill);
  const removeSkill = useAppStore((s) => s.removeSkill);
  const addExperience = useAppStore((s) => s.addExperience);
  const updateExperience = useAppStore((s) => s.updateExperience);
  const removeExperience = useAppStore((s) => s.removeExperience);
  const addEducation = useAppStore((s) => s.addEducation);
  const updateEducation = useAppStore((s) => s.updateEducation);
  const removeEducation = useAppStore((s) => s.removeEducation);
  const addProject = useAppStore((s) => s.addProject);
  const updateProject = useAppStore((s) => s.updateProject);
  const removeProject = useAppStore((s) => s.removeProject);
  const addCertification = useAppStore((s) => s.addCertification);
  const updateCertification = useAppStore((s) => s.updateCertification);
  const removeCertification = useAppStore((s) => s.removeCertification);
  const addLanguage = useAppStore((s) => s.addLanguage);
  const updateLanguage = useAppStore((s) => s.updateLanguage);
  const removeLanguage = useAppStore((s) => s.removeLanguage);
  const [skillInput, setSkillInput] = useState("");

  return (
    <div>
      {/* Section nav */}
      <div className="flex flex-wrap gap-1 mb-3">
        {EDIT_SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all",
              activeSection === s.id
                ? "bg-[#116466] text-[#D1E8E2]"
                : "text-[#9DB5B0] hover:bg-[#3D4944]/50 hover:text-[#D1E8E2]"
            )}
          >
            <s.icon className="w-3.5 h-3.5" />
            {s.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeSection === "personal" && (
            <div className="p-4 rounded-xl glass-card space-y-3">
              <h3 className="text-sm font-semibold text-[#FFCB9A]">Personal Information</h3>
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Full Name" value={cv.personal.fullName} onChange={(e) => updatePersonal(cv.id, { fullName: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] col-span-2" />
                <Input placeholder="Title" value={cv.personal.title} onChange={(e) => updatePersonal(cv.id, { title: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] col-span-2" />
                <Input placeholder="Email" value={cv.personal.email} onChange={(e) => updatePersonal(cv.id, { email: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
                <Input placeholder="Phone" value={cv.personal.phone} onChange={(e) => updatePersonal(cv.id, { phone: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
                <Input placeholder="Location" value={cv.personal.location} onChange={(e) => updatePersonal(cv.id, { location: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
                <Input placeholder="Website" value={cv.personal.website} onChange={(e) => updatePersonal(cv.id, { website: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
                <Input placeholder="LinkedIn" value={cv.personal.linkedin} onChange={(e) => updatePersonal(cv.id, { linkedin: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] col-span-2" />
              </div>
            </div>
          )}

          {activeSection === "summary" && (
            <div className="p-4 rounded-xl glass-card space-y-3">
              <h3 className="text-sm font-semibold text-[#FFCB9A]">Professional Summary</h3>
              <Textarea value={cv.summary} onChange={(e) => updateCV(cv.id, { summary: e.target.value })} placeholder="Write your professional summary..." className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] min-h-[140px]" />
              <AISummaryInline cv={cv} />
            </div>
          )}

          {activeSection === "experience" && (
            <div className="space-y-3">
              {cv.experience.map((e: any, i: number) => (
                <div key={e.id} className="p-4 rounded-xl glass-card space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-[#FFCB9A]">Position {i + 1}</h3>
                    <button onClick={() => removeExperience(cv.id, e.id)} className="text-[#9DB5B0] hover:text-[#FFCB9A]"><X className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Job Title" value={e.jobTitle} onChange={(ev) => updateExperience(cv.id, e.id, { jobTitle: ev.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
                    <Input placeholder="Company" value={e.company} onChange={(ev) => updateExperience(cv.id, e.id, { company: ev.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
                    <Input placeholder="Start" value={e.startDate} onChange={(ev) => updateExperience(cv.id, e.id, { startDate: ev.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
                    <Input placeholder="End" value={e.endDate} onChange={(ev) => updateExperience(cv.id, e.id, { endDate: ev.target.value })} disabled={e.current} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] disabled:opacity-50" />
                  </div>
                  <Textarea placeholder="Responsibilities" value={e.responsibilities} onChange={(ev) => updateExperience(cv.id, e.id, { responsibilities: ev.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] min-h-[60px] text-xs" />
                  {e.responsibilities && (
                    <div className="flex justify-end -mt-1">
                      <AIImproveButton
                        jobTitle={e.jobTitle}
                        description={e.responsibilities}
                        type="responsibilities"
                        onApply={(text) => updateExperience(cv.id, e.id, { responsibilities: text })}
                      />
                    </div>
                  )}
                  <Textarea placeholder="Achievements" value={e.achievements} onChange={(ev) => updateExperience(cv.id, e.id, { achievements: ev.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] min-h-[60px] text-xs" />
                </div>
              ))}
              <button onClick={() => addExperience(cv.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-[#D1E8E2]/20 text-[#9DB5B0] hover:text-[#D1E8E2] hover:border-[#116466] text-xs transition-all">
                <Plus className="w-3.5 h-3.5" /> Add Position
              </button>
            </div>
          )}

          {activeSection === "education" && (
            <div className="space-y-3">
              {cv.education.map((e: any, i: number) => (
                <div key={e.id} className="p-4 rounded-xl glass-card space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-[#FFCB9A]">Education {i + 1}</h3>
                    <button onClick={() => removeEducation(cv.id, e.id)} className="text-[#9DB5B0] hover:text-[#FFCB9A]"><X className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Degree" value={e.degree} onChange={(ev) => updateEducation(cv.id, e.id, { degree: ev.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
                    <Input placeholder="Institution" value={e.institution} onChange={(ev) => updateEducation(cv.id, e.id, { institution: ev.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
                    <Input placeholder="Start" value={e.startDate} onChange={(ev) => updateEducation(cv.id, e.id, { startDate: ev.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
                    <Input placeholder="End" value={e.endDate} onChange={(ev) => updateEducation(cv.id, e.id, { endDate: ev.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
                  </div>
                </div>
              ))}
              <button onClick={() => addEducation(cv.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-[#D1E8E2]/20 text-[#9DB5B0] hover:text-[#D1E8E2] hover:border-[#116466] text-xs transition-all">
                <Plus className="w-3.5 h-3.5" /> Add Education
              </button>
            </div>
          )}

          {activeSection === "skills" && (
            <div className="p-4 rounded-xl glass-card space-y-3">
              <h3 className="text-sm font-semibold text-[#FFCB9A]">Skills</h3>
              <div className="flex gap-2">
                <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && skillInput.trim()) { addSkill(cv.id, skillInput.trim()); setSkillInput(""); } }} placeholder="Add skill..." className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] h-9" />
                <Button size="sm" onClick={() => { if (skillInput.trim()) { addSkill(cv.id, skillInput.trim()); setSkillInput(""); } }} className="bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2]"><Plus className="w-4 h-4" /></Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cv.skills.map((s: string) => (
                  <span key={s} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#116466]/30 border border-[#116466]/40 text-[#D1E8E2] text-xs">
                    {s}
                    <button onClick={() => removeSkill(cv.id, s)} className="text-[#9DB5B0] hover:text-[#FFCB9A]"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
              <div className="pt-3 border-t border-[#D1E8E2]/5">
                <AISkillsSuggestions
                  jobTitle={cv.personal.title}
                  experience={cv.experience[0]?.jobTitle}
                  education={cv.education[0]?.field}
                  existingSkills={cv.skills}
                  onAddSkill={(skill) => addSkill(cv.id, skill)}
                />
              </div>
            </div>
          )}

          {activeSection === "projects" && (
            <div className="space-y-3">
              {cv.projects.map((p: any, i: number) => (
                <div key={p.id} className="p-4 rounded-xl glass-card space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-[#FFCB9A]">Project {i + 1}</h3>
                    <button onClick={() => removeProject(cv.id, p.id)} className="text-[#9DB5B0] hover:text-[#FFCB9A]"><X className="w-3.5 h-3.5" /></button>
                  </div>
                  <Input placeholder="Name" value={p.name} onChange={(e) => updateProject(cv.id, p.id, { name: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
                  <Textarea placeholder="Description" value={p.description} onChange={(e) => updateProject(cv.id, p.id, { description: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] min-h-[60px] text-xs" />
                  {p.description && (
                    <div className="flex justify-end -mt-1">
                      <AIProjectImprover
                        projectName={p.name}
                        description={p.description}
                        technologies={Array.isArray(p.technologies) ? p.technologies : []}
                        onApply={(text) => updateProject(cv.id, p.id, { description: text })}
                      />
                    </div>
                  )}
                  <Input placeholder="Tech (comma separated)" value={Array.isArray(p.technologies) ? p.technologies.join(", ") : p.technologies || ""} onChange={(e) => updateProject(cv.id, p.id, { technologies: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
                </div>
              ))}
              <button onClick={() => addProject(cv.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-[#D1E8E2]/20 text-[#9DB5B0] hover:text-[#D1E8E2] hover:border-[#116466] text-xs transition-all">
                <Plus className="w-3.5 h-3.5" /> Add Project
              </button>
            </div>
          )}

          {activeSection === "certifications" && (
            <div className="space-y-3">
              {cv.certifications.map((c: any, i: number) => (
                <div key={c.id} className="p-3 rounded-xl glass-card space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-[#FFCB9A]">Cert {i + 1}</h3>
                    <button onClick={() => removeCertification(cv.id, c.id)} className="text-[#9DB5B0] hover:text-[#FFCB9A]"><X className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Name" value={c.name} onChange={(e) => updateCertification(cv.id, c.id, { name: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
                    <Input placeholder="Issuer" value={c.issuer} onChange={(e) => updateCertification(cv.id, c.id, { issuer: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
                  </div>
                </div>
              ))}
              <button onClick={() => addCertification(cv.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-[#D1E8E2]/20 text-[#9DB5B0] hover:text-[#D1E8E2] hover:border-[#116466] text-xs transition-all">
                <Plus className="w-3.5 h-3.5" /> Add Cert
              </button>
            </div>
          )}

          {activeSection === "languages" && (
            <div className="space-y-3">
              {cv.languages.map((l: any) => (
                <div key={l.id} className="flex gap-2 p-2 rounded-xl glass-card">
                  <Input placeholder="Language" value={l.name} onChange={(e) => updateLanguage(cv.id, l.id, { name: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] flex-1 h-9" />
                  <select value={l.proficiency} onChange={(e) => updateLanguage(cv.id, l.id, { proficiency: e.target.value })} className="bg-[#3D4944] border border-[#D1E8E2]/10 text-[#D1E8E2] rounded-md px-2 text-xs">
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Fluent</option>
                    <option>Native</option>
                  </select>
                  <button onClick={() => removeLanguage(cv.id, l.id)} className="text-[#9DB5B0] hover:text-[#FFCB9A] p-2"><X className="w-4 h-4" /></button>
                </div>
              ))}
              <button onClick={() => addLanguage(cv.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-[#D1E8E2]/20 text-[#9DB5B0] hover:text-[#D1E8E2] hover:border-[#116466] text-xs transition-all">
                <Plus className="w-3.5 h-3.5" /> Add Language
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function AISummaryInline({ cv }: { cv: any }) {
  const updateCV = useAppStore((s) => s.updateCV);
  return (
    <AISummaryButton
      context={{ jobTitle: cv.personal.title, skills: cv.skills, summary: cv.summary }}
      onApply={(text) => updateCV(cv.id, { summary: text })}
    />
  );
}

// ============ Preview Panel ============

function PreviewPanel({ cv, zoom, setZoom }: { cv: any; zoom: number; setZoom: (z: number) => void }) {
  return (
    <div className="sticky top-32">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-[#9DB5B0]">Live Preview</div>
        <div className="flex items-center gap-1">
          <button onClick={() => setZoom(zoom - 0.1)} className="p-1.5 text-[#9DB5B0] hover:text-[#D1E8E2] transition-colors"><ZoomOut className="w-4 h-4" /></button>
          <span className="text-xs text-[#9DB5B0] w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(zoom + 0.1)} className="p-1.5 text-[#9DB5B0] hover:text-[#D1E8E2] transition-colors"><ZoomIn className="w-4 h-4" /></button>
          <button onClick={() => setZoom(0.7)} className="p-1.5 text-[#9DB5B0] hover:text-[#D1E8E2] transition-colors" title="Fit"><Maximize2 className="w-4 h-4" /></button>
          <button onClick={() => window.print()} className="p-1.5 text-[#9DB5B0] hover:text-[#D1E8E2] transition-colors" title="Fullscreen / Print"><Eye className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="bg-[#1a1a1a] rounded-xl p-4 overflow-auto max-h-[calc(100vh-12rem)] no-scrollbar">
        <div className="mx-auto" style={{ width: `${zoom * 794}px` }}>
          <div className="printable-cv shadow-2xl rounded-md overflow-hidden" style={{ aspectRatio: "1 / 1.414", width: "100%" }}>
            <TemplatePreview templateId={cv.template} cv={cv} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ Customize Panel ============

function CustomizePanel({ cv }: { cv: any }) {
  const updateDesign = useAppStore((s) => s.updateDesign);
  const updateCV = useAppStore((s) => s.updateCV);
  const setView = useAppStore((s) => s.setView);
  const design = cv.design;

  const densityPresets = [
    { id: "compact", label: "Compact", fontSize: 12, spacing: 10, margins: 20 },
    { id: "balanced", label: "Balanced", fontSize: 14, spacing: 16, margins: 32 },
    { id: "spacious", label: "Spacious", fontSize: 16, spacing: 24, margins: 48 },
  ];

  const currentDensity = densityPresets.find(
    (p) => p.fontSize === design.fontSize && p.spacing === design.sectionSpacing
  )?.id || "custom";

  return (
    <div className="p-5 rounded-xl glass-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#FFCB9A] flex items-center gap-2">
          <Settings2 className="w-4 h-4" /> Customize Design
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("template-gallery")}
            className="text-xs text-[#9DB5B0] hover:text-[#D1E8E2] underline"
          >
            Change Template
          </button>
          <button
            onClick={() => {
              if (confirm("Reset all design changes to defaults? Your CV content will be preserved.")) {
                updateDesign(cv.id, {
                  fontFamily: "inter", fontSize: 14, sectionSpacing: 16, margins: 32,
                  colorScheme: "nirvash", showPhoto: false, showIcons: true, showDividers: true,
                  sectionOrder: ["personal", "summary", "experience", "education", "skills", "projects", "certifications", "languages"],
                });
                toast.success("Design reset to defaults");
              }
            }}
            className="text-xs text-[#9DB5B0] hover:text-[#D1E8E2] inline-flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Reset Changes
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Typography */}
        <div>
          <h4 className="text-xs text-[#9DB5B0] uppercase tracking-wider mb-2">Typography</h4>
          <div className="space-y-2">
            <select
              value={design.fontFamily}
              onChange={(e) => updateDesign(cv.id, { fontFamily: e.target.value })}
              className="w-full bg-[#3D4944] border border-[#D1E8E2]/10 text-[#D1E8E2] rounded-md px-3 py-1.5 text-sm"
            >
              {Object.entries(FONT_FAMILIES).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
            </select>
            <div>
              <Label className="text-xs text-[#9DB5B0]">Font Size: {design.fontSize}px</Label>
              <Slider value={[design.fontSize]} min={10} max={20} step={1} onValueChange={(v) => updateDesign(cv.id, { fontSize: v[0] })} className="mt-1" />
            </div>
          </div>
        </div>

        {/* Layout density */}
        <div>
          <h4 className="text-xs text-[#9DB5B0] uppercase tracking-wider mb-2">Layout Density</h4>
          <div className="grid grid-cols-3 gap-1.5 mb-3">
            {densityPresets.map((p) => (
              <button
                key={p.id}
                onClick={() => updateDesign(cv.id, { fontSize: p.fontSize, sectionSpacing: p.spacing, margins: p.margins })}
                className={cn(
                  "py-1.5 px-1 rounded-md text-xs font-medium border transition-all",
                  currentDensity === p.id
                    ? "bg-[#116466] border-[#116466] text-[#D1E8E2]"
                    : "bg-[#3D4944] border-[#D1E8E2]/10 text-[#9DB5B0] hover:text-[#D1E8E2]"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            <div>
              <Label className="text-xs text-[#9DB5B0]">Section spacing: {design.sectionSpacing}px</Label>
              <Slider value={[design.sectionSpacing]} min={8} max={32} step={2} onValueChange={(v) => updateDesign(cv.id, { sectionSpacing: v[0] })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs text-[#9DB5B0]">Page margins: {design.margins}px</Label>
              <Slider value={[design.margins]} min={16} max={64} step={4} onValueChange={(v) => updateDesign(cv.id, { margins: v[0] })} className="mt-1" />
            </div>
          </div>
        </div>

        {/* Colors */}
        <div>
          <h4 className="text-xs text-[#9DB5B0] uppercase tracking-wider mb-2">Color Scheme ({Object.keys(COLOR_SCHEMES).length} themes)</h4>
          <div className="grid grid-cols-4 gap-1.5 max-h-44 overflow-y-auto no-scrollbar pr-1">
            {Object.entries(COLOR_SCHEMES).map(([k, v]) => (
              <button
                key={k}
                onClick={() => updateDesign(cv.id, { colorScheme: k })}
                title={v.subtitle ? `${v.name} — ${v.subtitle}` : v.name}
                className={cn(
                  "p-1.5 rounded-md border-2 transition-all flex flex-col gap-0.5 relative",
                  design.colorScheme === k ? "border-[#FFCB9A]" : "border-transparent hover:border-[#D1E8E2]/20"
                )}
                style={{ background: v.bg }}
              >
                {v.premium && (
                  <span className="absolute -top-1 -right-1 px-1 py-0 rounded bg-[#FFCB9A] text-[7px] font-bold text-[#2C3531] leading-tight">PRO</span>
                )}
                <div className="w-full h-2.5 rounded-sm" style={{ background: v.accent }} />
                <div className="w-full h-1.5 rounded-sm" style={{ background: v.text }} />
                <span className="text-[8px] text-center leading-tight truncate" style={{ color: v.text }}>{v.name}</span>
              </button>
            ))}
          </div>
          {(() => {
            const active = COLOR_SCHEMES[design.colorScheme];
            return active?.subtitle ? (
              <p className="text-[10px] text-[#FFCB9A] mt-1.5 italic">{active.subtitle}</p>
            ) : null;
          })()}
        </div>

        {/* Optional elements */}
        <div>
          <h4 className="text-xs text-[#9DB5B0] uppercase tracking-wider mb-2">Elements</h4>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-[#9DB5B0]">Profile Photo</Label>
              <Switch checked={design.showPhoto} onCheckedChange={(v) => updateDesign(cv.id, { showPhoto: v })} />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs text-[#9DB5B0]">Icons</Label>
              <Switch checked={design.showIcons} onCheckedChange={(v) => updateDesign(cv.id, { showIcons: v })} />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs text-[#9DB5B0]">Section dividers</Label>
              <Switch checked={design.showDividers} onCheckedChange={(v) => updateDesign(cv.id, { showDividers: v })} />
            </div>
          </div>
        </div>
      </div>

      {/* Section Order (drag and drop) */}
      <SectionOrderEditor cv={cv} />

      {/* Template name display */}
      <div className="mt-4 pt-4 border-t border-[#D1E8E2]/5 flex items-center justify-between">
        <div className="text-xs text-[#9DB5B0]">Current template: <span className="text-[#D1E8E2] font-medium">{cv.template}</span></div>
        <button onClick={() => setView("template-gallery")} className="text-xs text-[#FFCB9A] hover:underline">Switch template →</button>
      </div>
    </div>
  );
}

// ============ Section Order Editor (drag and drop) ============

const SECTION_LABELS: Record<string, string> = {
  personal: "Personal",
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
  languages: "Languages",
  additional: "Additional",
};

function SectionOrderEditor({ cv }: { cv: any }) {
  const updateDesign = useAppStore((s) => s.updateDesign);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const order = cv.design.sectionOrder || ["personal", "summary", "experience", "education", "skills", "projects", "certifications", "languages"];

  const move = (from: number, to: number) => {
    if (from === to) return;
    const arr = [...order];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    updateDesign(cv.id, { sectionOrder: arr });
  };

  return (
    <div className="mt-5 pt-4 border-t border-[#D1E8E2]/5">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs text-[#9DB5B0] uppercase tracking-wider">Section Order</h4>
        <span className="text-[10px] text-[#9DB5B0]">Drag to reorder</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {order.map((secId: string, idx: number) => (
          <div
            key={secId}
            draggable
            onDragStart={() => setDraggedIdx(idx)}
            onDragEnd={() => { setDraggedIdx(null); setDragOverIdx(null); }}
            onDragOver={(e) => { e.preventDefault(); setDragOverIdx(idx); }}
            onDrop={(e) => {
              e.preventDefault();
              if (draggedIdx !== null && draggedIdx !== idx) {
                move(draggedIdx, idx);
              }
              setDraggedIdx(null);
              setDragOverIdx(null);
            }}
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border cursor-move transition-all",
              draggedIdx === idx
                ? "opacity-40 bg-[#116466]/20 border-[#116466]"
                : dragOverIdx === idx
                  ? "bg-[#FFCB9A]/15 border-[#FFCB9A] text-[#FFCB9A]"
                  : "bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]"
            )}
          >
            <GripVertical className="w-3 h-3 text-[#9DB5B0]" />
            <span className="text-[10px] text-[#9DB5B0]">{idx + 1}.</span>
            {SECTION_LABELS[secId] || secId}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ CV Name Editor (center of header) ============

function CVNameEditor({ cv }: { cv: any }) {
  const updateCV = useAppStore((s) => s.updateCV);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(cv.name);

  // Reset value when not editing (sync with external name changes)
  if (!editing && value !== cv.name) {
    setValue(cv.name);
  }

  return (
    <div className="flex items-center">
      {editing ? (
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => {
            updateCV(cv.id, { name: value || "Untitled CV" });
            setEditing(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateCV(cv.id, { name: value || "Untitled CV" });
              setEditing(false);
            } else if (e.key === "Escape") {
              setValue(cv.name);
              setEditing(false);
            }
          }}
          className="bg-[#3D4944] border border-[#FFCB9A]/40 text-[#D1E8E2] rounded-md px-3 py-1 text-sm font-medium text-center min-w-[160px] max-w-[280px]"
        />
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="group inline-flex items-center gap-1.5 px-3 py-1 rounded-md hover:bg-[#3D4944]/50 text-[#D1E8E2] font-medium text-sm transition-colors max-w-[280px] truncate"
          title="Click to rename"
        >
          <span className="truncate">{cv.name || "Untitled CV"}</span>
          <PencilIcon className="w-3 h-3 text-[#9DB5B0] opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      )}
    </div>
  );
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}
