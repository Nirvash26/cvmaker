"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Save, ChevronRight, Plus, X, Sparkles, GraduationCap, Briefcase, User, Award, Languages as LangIcon, FolderGit2, CheckCircle2 } from "lucide-react";
import { useAppStore, useCurrentCV } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { AISummaryButton } from "@/components/ai/AISummaryButton";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Personal", icon: User },
  { id: 2, label: "Summary", icon: Sparkles },
  { id: 3, label: "Experience", icon: Briefcase },
  { id: 4, label: "Education", icon: GraduationCap },
  { id: 5, label: "Skills", icon: Award },
  { id: 6, label: "Projects", icon: FolderGit2 },
  { id: 7, label: "More", icon: LangIcon },
  { id: 8, label: "Done", icon: CheckCircle2 },
];

const POPULAR_SKILLS = [
  "JavaScript", "React", "Node.js", "Python", "TypeScript", "Java",
  "Communication", "Leadership", "Problem Solving", "Teamwork",
  "Project Management", "SQL", "Git", "CSS", "HTML", "Figma",
  "Marketing", "Sales", "Data Analysis", "Public Speaking",
];

export function QuestionWizard() {
  const cv = useCurrentCV();
  const step = useAppStore((s) => s.wizardStep);
  const total = useAppStore((s) => s.totalWizardSteps);
  const next = useAppStore((s) => s.nextWizardStep);
  const prev = useAppStore((s) => s.prevWizardStep);
  const setView = useAppStore((s) => s.setView);
  const setWizardStep = useAppStore((s) => s.setWizardStep);

  if (!cv) return null;

  const progress = (step / total) * 100;

  return (
    <div className="min-h-screen pt-20 pb-32">
      {/* Top bar */}
      <div className="sticky top-16 z-30 bg-[#2C3531]/80 backdrop-blur-xl border-b border-[#D1E8E2]/5">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <button
              onClick={() => setView("dashboard")}
              className="inline-flex items-center gap-1 text-sm text-[#9DB5B0] hover:text-[#D1E8E2] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <div className="text-sm text-[#D1E8E2]/80">
              Step <span className="text-[#FFCB9A] font-semibold">{step}</span> of {total}
            </div>
            <button
              onClick={() => setView("dashboard")}
              className="inline-flex items-center gap-1.5 text-sm text-[#9DB5B0] hover:text-[#D1E8E2] transition-colors"
            >
              <Save className="w-4 h-4" /> Save &amp; Exit
            </button>
          </div>
          {/* Progress bar */}
          <div className="pb-3">
            <Progress value={progress} className="h-1.5 bg-[#3D4944]" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-10">
        {/* Step indicators */}
        <div className="hidden md:flex items-center justify-between mb-12 max-w-3xl mx-auto">
          {STEPS.map((s, i) => {
            const isComplete = step > s.id;
            const isCurrent = step === s.id;
            return (
              <div key={s.id} className="flex items-center flex-1 last:flex-none">
                <button
                  onClick={() => s.id < step && setWizardStep(s.id)}
                  disabled={s.id > step}
                  className={cn(
                    "flex flex-col items-center gap-1.5 transition-opacity",
                    isCurrent ? "opacity-100" : isComplete ? "opacity-70 hover:opacity-100" : "opacity-40"
                  )}
                >
                  <div className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center border transition-all",
                    isCurrent && "bg-[#116466] border-[#116466] teal-glow",
                    isComplete && "bg-[#116466]/30 border-[#116466] text-[#FFCB9A]",
                    !isCurrent && !isComplete && "border-[#D1E8E2]/15 text-[#9DB5B0]"
                  )}>
                    {isComplete ? <CheckCircle2 className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                  </div>
                  <span className={cn("text-[10px] font-medium", isCurrent ? "text-[#FFCB9A]" : "text-[#9DB5B0]")}>
                    {s.label}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-px bg-[#D1E8E2]/10 mx-2 relative">
                    {step > s.id && (
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        className="absolute inset-0 bg-[#116466] origin-left"
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {step === 1 && <StepPersonal cv={cv} />}
            {step === 2 && <StepSummary cv={cv} />}
            {step === 3 && <StepExperience cv={cv} />}
            {step === 4 && <StepEducation cv={cv} />}
            {step === 5 && <StepSkills cv={cv} />}
            {step === 6 && <StepProjects cv={cv} />}
            {step === 7 && <StepAdditional cv={cv} />}
            {step === 8 && <StepComplete cv={cv} />}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {step < 8 && (
          <div className="mt-12 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={prev}
              disabled={step === 1}
              className="text-[#9DB5B0] hover:text-[#D1E8E2] disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            <Button
              onClick={next}
              className="bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2]"
            >
              Continue
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============= STEP COMPONENTS =============

function StepHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#D1E8E2]">{title}</h1>
      <p className="mt-2 text-[#9DB5B0]">{subtitle}</p>
    </div>
  );
}

function StepPersonal({ cv }: { cv: any }) {
  const updatePersonal = useAppStore((s) => s.updatePersonal);
  const p = cv.personal;

  return (
    <div>
      <StepHeader
        title="Let's start with your name."
        subtitle="Basic information that appears at the top of your CV."
      />
      <div className="space-y-6 max-w-2xl">
        <div>
          <Label className="text-[#9DB5B0] text-xs uppercase tracking-wider mb-2 block">Full Name</Label>
          <Input
            value={p.fullName}
            onChange={(e) => updatePersonal(cv.id, { fullName: e.target.value })}
            placeholder="Alex Johnson"
            className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] h-12 text-lg"
          />
        </div>

        <div>
          <Label className="text-[#9DB5B0] text-xs uppercase tracking-wider mb-2 block">
            What should appear below your name?
          </Label>
          <Input
            value={p.title}
            onChange={(e) => updatePersonal(cv.id, { title: e.target.value })}
            placeholder="Software Engineer · Graphic Designer · Marketing Specialist"
            className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] h-11"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-[#9DB5B0] text-xs uppercase tracking-wider mb-2 block">Email</Label>
            <Input
              type="email"
              value={p.email}
              onChange={(e) => updatePersonal(cv.id, { email: e.target.value })}
              placeholder="alex@example.com"
              className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]"
            />
          </div>
          <div>
            <Label className="text-[#9DB5B0] text-xs uppercase tracking-wider mb-2 block">Phone</Label>
            <Input
              value={p.phone}
              onChange={(e) => updatePersonal(cv.id, { phone: e.target.value })}
              placeholder="+1 555 000 0000"
              className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]"
            />
          </div>
          <div>
            <Label className="text-[#9DB5B0] text-xs uppercase tracking-wider mb-2 block">Location</Label>
            <Input
              value={p.location}
              onChange={(e) => updatePersonal(cv.id, { location: e.target.value })}
              placeholder="San Francisco, CA"
              className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]"
            />
          </div>
          <div>
            <Label className="text-[#9DB5B0] text-xs uppercase tracking-wider mb-2 block">Website (optional)</Label>
            <Input
              value={p.website}
              onChange={(e) => updatePersonal(cv.id, { website: e.target.value })}
              placeholder="alex.dev"
              className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]"
            />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-[#9DB5B0] text-xs uppercase tracking-wider mb-2 block">LinkedIn (optional)</Label>
            <Input
              value={p.linkedin}
              onChange={(e) => updatePersonal(cv.id, { linkedin: e.target.value })}
              placeholder="linkedin.com/in/alex"
              className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StepSummary({ cv }: { cv: any }) {
  const updateCV = useAppStore((s) => s.updateCV);
  const [value, setValue] = useState(cv.summary);

  return (
    <div>
      <StepHeader
        title="Tell us a little about yourself."
        subtitle="Don't worry about making it perfect. You can improve it later."
      />
      <div className="max-w-2xl">
        <Textarea
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            updateCV(cv.id, { summary: e.target.value });
          }}
          placeholder="I am a passionate software developer with experience building modern web applications..."
          className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] min-h-[180px] text-base leading-relaxed resize-none"
        />
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs text-[#9DB5B0]">{value.length} characters · ~{Math.ceil(value.split(/\s+/).filter(Boolean).length)} words</p>
          <AISummaryButton
            context={{ jobTitle: cv.personal.title, skills: cv.skills, summary: value }}
            onApply={(generated) => {
              setValue(generated);
              updateCV(cv.id, { summary: generated });
            }}
          />
        </div>
      </div>
    </div>
  );
}

function StepExperience({ cv }: { cv: any }) {
  const addExperience = useAppStore((s) => s.addExperience);
  const updateExperience = useAppStore((s) => s.updateExperience);
  const removeExperience = useAppStore((s) => s.removeExperience);
  const [experienceType, setExperienceType] = useState<string | null>(
    cv.experience.length > 0 ? "yes" : null
  );

  const options = [
    { value: "yes", label: "Yes, I have work experience" },
    { value: "student", label: "I'm a student" },
    { value: "fresher", label: "I'm a fresher" },
    { value: "freelance", label: "I have freelance experience" },
    { value: "skip", label: "Skip for now" },
  ];

  return (
    <div>
      <StepHeader
        title="Have you worked before?"
        subtitle="Tell us about your work experience — even informal or freelance counts."
      />
      <div className="max-w-2xl space-y-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => {
              setExperienceType(opt.value);
              if (opt.value === "yes" && cv.experience.length === 0) {
                addExperience(cv.id);
              }
            }}
            className={cn(
              "w-full text-left p-4 rounded-xl border transition-all",
              experienceType === opt.value
                ? "bg-[#116466]/20 border-[#116466] text-[#D1E8E2]"
                : "bg-[#3D4944]/50 border-[#D1E8E2]/10 text-[#9DB5B0] hover:border-[#D1E8E2]/30"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-4 h-4 rounded-full border-2",
                experienceType === opt.value ? "border-[#FFCB9A] bg-[#FFCB9A]" : "border-[#9DB5B0]"
              )} />
              <span className="text-sm font-medium">{opt.label}</span>
            </div>
          </button>
        ))}
      </div>

      {experienceType === "yes" && (
        <div className="mt-8 space-y-5">
          {cv.experience.map((exp: any, i: number) => (
            <ExperienceCard
              key={exp.id}
              index={i + 1}
              experience={exp}
              onChange={(u) => updateExperience(cv.id, exp.id, u)}
              onRemove={() => removeExperience(cv.id, exp.id)}
            />
          ))}
          <button
            onClick={() => addExperience(cv.id)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-[#D1E8E2]/20 text-[#9DB5B0] hover:text-[#D1E8E2] hover:border-[#116466] transition-all"
          >
            <Plus className="w-4 h-4" /> Add Another Position
          </button>
        </div>
      )}
    </div>
  );
}

function ExperienceCard({ index, experience, onChange, onRemove }: any) {
  return (
    <div className="p-5 rounded-xl glass-card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#FFCB9A]">Position {index}</h3>
        <button onClick={onRemove} className="text-[#9DB5B0] hover:text-[#FFCB9A]">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Input placeholder="Job Title" value={experience.jobTitle} onChange={(e) => onChange({ jobTitle: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
        <Input placeholder="Company" value={experience.company} onChange={(e) => onChange({ company: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
        <Input placeholder="Location" value={experience.location} onChange={(e) => onChange({ location: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
        <div className="grid grid-cols-2 gap-2">
          <Input placeholder="Start (e.g. Jan 2023)" value={experience.startDate} onChange={(e) => onChange({ startDate: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
          <Input placeholder="End" value={experience.endDate} onChange={(e) => onChange({ endDate: e.target.value })} disabled={experience.current} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] disabled:opacity-50" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Switch checked={experience.current} onCheckedChange={(v) => onChange({ current: v, endDate: v ? "" : experience.endDate })} />
        <Label className="text-sm text-[#9DB5B0]">I currently work here</Label>
      </div>
      <Textarea placeholder="Responsibilities — what did you do day to day?" value={experience.responsibilities} onChange={(e) => onChange({ responsibilities: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] min-h-[80px]" />
      <Textarea placeholder="Achievements — what were you proud of?" value={experience.achievements} onChange={(e) => onChange({ achievements: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] min-h-[80px]" />
    </div>
  );
}

function StepEducation({ cv }: { cv: any }) {
  const addEducation = useAppStore((s) => s.addEducation);
  const updateEducation = useAppStore((s) => s.updateEducation);
  const removeEducation = useAppStore((s) => s.removeEducation);

  return (
    <div>
      <StepHeader
        title="Tell us about your education."
        subtitle="Add your degrees, certifications, or relevant training."
      />
      <div className="space-y-5 max-w-2xl">
        {cv.education.length === 0 && (
          <div className="p-8 text-center rounded-xl border border-dashed border-[#D1E8E2]/15 text-[#9DB5B0]">
            No education added yet.
          </div>
        )}
        {cv.education.map((edu: any, i: number) => (
          <div key={edu.id} className="p-5 rounded-xl glass-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#FFCB9A]">Education {i + 1}</h3>
              <button onClick={() => removeEducation(cv.id, edu.id)} className="text-[#9DB5B0] hover:text-[#FFCB9A]">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <Input placeholder="Degree (e.g. B.Sc. Computer Science)" value={edu.degree} onChange={(e) => updateEducation(cv.id, edu.id, { degree: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
              <Input placeholder="Institution" value={edu.institution} onChange={(e) => updateEducation(cv.id, edu.id, { institution: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
              <Input placeholder="Field of Study" value={edu.field} onChange={(e) => updateEducation(cv.id, edu.id, { field: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
              <Input placeholder="Location" value={edu.location} onChange={(e) => updateEducation(cv.id, edu.id, { location: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
              <Input placeholder="Start Date" value={edu.startDate} onChange={(e) => updateEducation(cv.id, edu.id, { startDate: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
              <Input placeholder="End Date" value={edu.endDate} onChange={(e) => updateEducation(cv.id, edu.id, { endDate: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
            </div>
          </div>
        ))}
        <button
          onClick={() => addEducation(cv.id)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-[#D1E8E2]/20 text-[#9DB5B0] hover:text-[#D1E8E2] hover:border-[#116466] transition-all"
        >
          <Plus className="w-4 h-4" /> Add Another Education
        </button>
      </div>
    </div>
  );
}

function StepSkills({ cv }: { cv: any }) {
  const addSkill = useAppStore((s) => s.addSkill);
  const removeSkill = useAppStore((s) => s.removeSkill);
  const [input, setInput] = useState("");

  const add = () => {
    if (input.trim()) {
      addSkill(cv.id, input.trim());
      setInput("");
    }
  };

  // Suggest based on job title keywords
  const titleLower = (cv.personal.title || "").toLowerCase();
  let suggestions: string[] = [];
  if (/engineer|developer|software|web|frontend|backend|full ?stack/.test(titleLower)) {
    suggestions = ["JavaScript", "React", "TypeScript", "Node.js", "Git", "SQL", "REST APIs", "Docker"];
  } else if (/design|ui|ux|graphic/.test(titleLower)) {
    suggestions = ["Figma", "Adobe Illustrator", "Photoshop", "Typography", "Wireframing", "Prototyping"];
  } else if (/market/.test(titleLower)) {
    suggestions = ["SEO", "Content Strategy", "Analytics", "Copywriting", "Social Media", "Email Marketing"];
  } else if (/data|analyst|scientist/.test(titleLower)) {
    suggestions = ["Python", "SQL", "Pandas", "Machine Learning", "Statistics", "Tableau"];
  } else {
    suggestions = POPULAR_SKILLS.slice(0, 8);
  }

  const filteredSuggestions = suggestions.filter((s) => !cv.skills.includes(s));

  return (
    <div>
      <StepHeader
        title="What are you good at?"
        subtitle="Add your skills as tags. Type and press Enter."
      />
      <div className="max-w-2xl">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
            placeholder="Type a skill and press Enter..."
            className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] h-11"
          />
          <Button onClick={add} className="bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2]">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {cv.skills.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {cv.skills.map((s: string) => (
              <motion.span
                key={s}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#116466]/30 border border-[#116466]/50 text-[#D1E8E2] text-sm"
              >
                {s}
                <button onClick={() => removeSkill(cv.id, s)} className="text-[#9DB5B0] hover:text-[#FFCB9A]">
                  <X className="w-3 h-3" />
                </button>
              </motion.span>
            ))}
          </div>
        )}

        {filteredSuggestions.length > 0 && (
          <div className="mt-8">
            <p className="text-xs text-[#9DB5B0] uppercase tracking-wider mb-3">
              Suggested for {cv.personal.title || "your role"}
            </p>
            <div className="flex flex-wrap gap-2">
              {filteredSuggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => addSkill(cv.id, s)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-dashed border-[#D1E8E2]/20 text-[#9DB5B0] hover:text-[#FFCB9A] hover:border-[#FFCB9A]/50 transition-all text-sm"
                >
                  <Plus className="w-3 h-3" /> {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StepProjects({ cv }: { cv: any }) {
  const addProject = useAppStore((s) => s.addProject);
  const updateProject = useAppStore((s) => s.updateProject);
  const removeProject = useAppStore((s) => s.removeProject);
  const [enabled, setEnabled] = useState(cv.projects.length > 0);

  return (
    <div>
      <StepHeader
        title="Do you have any projects you're proud of?"
        subtitle="Optional — but a great way to show what you can do."
      />
      <div className="max-w-2xl">
        {!enabled ? (
          <div className="space-y-3">
            <button
              onClick={() => { setEnabled(true); addProject(cv.id); }}
              className="w-full p-6 rounded-xl border border-dashed border-[#D1E8E2]/20 text-[#9DB5B0] hover:text-[#D1E8E2] hover:border-[#116466] transition-all"
            >
              <Plus className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm">Add a project</span>
            </button>
            <button
              onClick={() => useAppStore.getState().nextWizardStep()}
              className="block w-full text-center text-sm text-[#9DB5B0] hover:text-[#D1E8E2] py-2"
            >
              Skip this step →
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {cv.projects.map((p: any, i: number) => (
              <div key={p.id} className="p-5 rounded-xl glass-card space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#FFCB9A]">Project {i + 1}</h3>
                  <button onClick={() => removeProject(cv.id, p.id)} className="text-[#9DB5B0] hover:text-[#FFCB9A]">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <Input placeholder="Project Name" value={p.name} onChange={(e) => updateProject(cv.id, p.id, { name: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
                <Textarea placeholder="What did it do? What problem did it solve?" value={p.description} onChange={(e) => updateProject(cv.id, p.id, { description: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] min-h-[80px]" />
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input placeholder="Technologies (e.g. React, Node)" value={p.technologies} onChange={(e) => updateProject(cv.id, p.id, { technologies: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
                  <Input placeholder="Project URL (optional)" value={p.url} onChange={(e) => updateProject(cv.id, p.id, { url: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
                </div>
              </div>
            ))}
            <button
              onClick={() => addProject(cv.id)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-[#D1E8E2]/20 text-[#9DB5B0] hover:text-[#D1E8E2] hover:border-[#116466] transition-all"
            >
              <Plus className="w-4 h-4" /> Add Another Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StepAdditional({ cv }: { cv: any }) {
  const addCertification = useAppStore((s) => s.addCertification);
  const updateCertification = useAppStore((s) => s.updateCertification);
  const removeCertification = useAppStore((s) => s.removeCertification);
  const addLanguage = useAppStore((s) => s.addLanguage);
  const updateLanguage = useAppStore((s) => s.updateLanguage);
  const removeLanguage = useAppStore((s) => s.removeLanguage);
  const addInterest = useAppStore((s) => s.addInterest);
  const removeInterest = useAppStore((s) => s.removeInterest);
  const [interestInput, setInterestInput] = useState("");

  return (
    <div>
      <StepHeader
        title="Anything else to add?"
        subtitle="All optional. Skip what doesn't apply to you."
      />
      <div className="space-y-6 max-w-2xl">
        {/* Certifications */}
        <Section title="Certifications">
          {cv.certifications.map((c: any) => (
            <div key={c.id} className="flex gap-2 mb-2">
              <Input placeholder="Certification name" value={c.name} onChange={(e) => updateCertification(cv.id, c.id, { name: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] flex-1" />
              <Input placeholder="Issuer" value={c.issuer} onChange={(e) => updateCertification(cv.id, c.id, { issuer: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] flex-1" />
              <button onClick={() => removeCertification(cv.id, c.id)} className="text-[#9DB5B0] hover:text-[#FFCB9A] p-2"><X className="w-4 h-4" /></button>
            </div>
          ))}
          <AddButton onClick={() => addCertification(cv.id)} label="Add Certification" />
        </Section>

        {/* Languages */}
        <Section title="Languages">
          {cv.languages.map((l: any) => (
            <div key={l.id} className="flex gap-2 mb-2">
              <Input placeholder="Language" value={l.name} onChange={(e) => updateLanguage(cv.id, l.id, { name: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] flex-1" />
              <select
                value={l.proficiency}
                onChange={(e) => updateLanguage(cv.id, l.id, { proficiency: e.target.value })}
                className="bg-[#3D4944] border border-[#D1E8E2]/10 text-[#D1E8E2] rounded-md px-3 text-sm"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Fluent</option>
                <option>Native</option>
              </select>
              <button onClick={() => removeLanguage(cv.id, l.id)} className="text-[#9DB5B0] hover:text-[#FFCB9A] p-2"><X className="w-4 h-4" /></button>
            </div>
          ))}
          <AddButton onClick={() => addLanguage(cv.id)} label="Add Language" />
        </Section>

        {/* Interests */}
        <Section title="Interests">
          <div className="flex gap-2 mb-3">
            <Input
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && interestInput.trim()) {
                  addInterest(cv.id, interestInput.trim());
                  setInterestInput("");
                }
              }}
              placeholder="Type an interest and press Enter"
              className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] flex-1"
            />
          </div>
          {cv.interests.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {cv.interests.map((int: string, i: number) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3D4944] border border-[#D1E8E2]/10 text-[#D1E8E2] text-sm">
                  {int}
                  <button onClick={() => removeInterest(cv.id, i)} className="text-[#9DB5B0] hover:text-[#FFCB9A]">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-5 rounded-xl glass-card">
      <h3 className="text-sm font-semibold text-[#FFCB9A] mb-3">{title}</h3>
      {children}
    </div>
  );
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-[#D1E8E2]/20 text-[#9DB5B0] hover:text-[#D1E8E2] hover:border-[#116466] text-sm transition-all"
    >
      <Plus className="w-3.5 h-3.5" /> {label}
    </button>
  );
}

function StepComplete({ cv }: { cv: any }) {
  const setView = useAppStore((s) => s.setView);

  return (
    <div className="text-center max-w-2xl mx-auto py-10">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#116466] to-[#0d4d4f] teal-glow mb-6"
      >
        <CheckCircle2 className="w-12 h-12 text-[#FFCB9A]" />
      </motion.div>
      <h1 className="text-3xl sm:text-4xl font-bold text-[#D1E8E2]">
        Your CV information is ready! 🎉
      </h1>
      <p className="mt-3 text-[#9DB5B0] text-lg">
        Now let&apos;s make it look amazing.
      </p>

      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto">
        {[
          { label: "Personal", value: cv.personal.fullName ? "✓" : "—" },
          { label: "Experience", value: `${cv.experience.length}` },
          { label: "Skills", value: `${cv.skills.length}` },
          { label: "Education", value: `${cv.education.length}` },
        ].map((s) => (
          <div key={s.label} className="p-3 rounded-lg glass-card">
            <div className="text-xl font-bold text-[#FFCB9A]">{s.value}</div>
            <div className="text-xs text-[#9DB5B0]">{s.label}</div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setView("template-gallery")}
        className="mt-10 inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2] font-medium transition-all teal-glow"
      >
        Choose a Template
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
