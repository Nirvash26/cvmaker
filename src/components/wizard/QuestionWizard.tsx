"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, ChevronDown, Plus, X, Sparkles, GraduationCap,
  Briefcase, User, Award, Languages as LangIcon, FolderGit2, CheckCircle2,
  BadgeCheck, BookOpen, Heart, HandHeart, Eye,
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
import { AISkillsSuggestions } from "@/components/ai/AISkillsSuggestions";
import { AIProjectImprover } from "@/components/ai/AIProjectImprover";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "About You", icon: User },
  { id: 2, label: "Summary", icon: Sparkles },
  { id: 3, label: "Experience", icon: Briefcase },
  { id: 4, label: "Education", icon: GraduationCap },
  { id: 5, label: "Skills", icon: Award },
  { id: 6, label: "Projects", icon: FolderGit2 },
  { id: 7, label: "More", icon: LangIcon },
  { id: 8, label: "Ready", icon: CheckCircle2 },
];

const POPULAR_SKILLS = [
  "JavaScript", "React", "Node.js", "Python", "TypeScript", "Java",
  "Communication", "Leadership", "Problem Solving", "Teamwork",
  "Project Management", "SQL", "Git", "CSS", "HTML", "Figma",
  "Marketing", "Sales", "Data Analysis", "Public Speaking",
];

const PROFILE_TYPES = [
  { id: "student", label: "Student", example: "I am a motivated student currently pursuing a degree in [Field], eager to apply my academic knowledge to real-world challenges and gain hands-on experience." },
  { id: "fresher", label: "Fresher", example: "I am a recent graduate in [Field] with foundational knowledge and a strong passion for learning. Seeking an entry-level role to grow and contribute." },
  { id: "experienced", label: "Experienced Professional", example: "I am an experienced [role] with [X]+ years of proven expertise in [key area], delivering measurable impact through [strength]. Skilled in leading initiatives and collaborating across teams." },
  { id: "career-changer", label: "Career Changer", example: "I am a [new role] transitioning from a background in [previous field]. Bringing transferable skills in [skill 1, skill 2] and a fresh perspective to [industry]." },
  { id: "freelancer", label: "Freelancer", example: "I am a freelance [role] with [X]+ years of independent experience helping clients achieve [outcome]. Specialized in [skill 1, skill 2] and committed to delivering high-quality work." },
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
              <ChevronLeft className="w-4 h-4 rotate-180" /> Save &amp; Exit
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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (v: string) => {
    if (!v) return "";
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Please enter a valid email address.";
  };

  return (
    <div>
      <StepHeader
        title="Let's start with you."
        subtitle="This information will appear at the top of your CV."
      />
      <div className="space-y-5 max-w-2xl">
        {/* Required fields */}
        <div>
          <Label className="text-[#9DB5B0] text-xs uppercase tracking-wider mb-2 block">Full Name *</Label>
          <Input
            value={p.fullName}
            onChange={(e) => updatePersonal(cv.id, { fullName: e.target.value })}
            placeholder="e.g. John Smith"
            className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] h-11"
          />
        </div>

        <div>
          <Label className="text-[#9DB5B0] text-xs uppercase tracking-wider mb-2 block">Professional Title *</Label>
          <Input
            value={p.title}
            onChange={(e) => updatePersonal(cv.id, { title: e.target.value })}
            placeholder="e.g. Frontend Developer"
            className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] h-11"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-[#9DB5B0] text-xs uppercase tracking-wider mb-2 block">Email *</Label>
            <Input
              type="email"
              value={p.email}
              onChange={(e) => {
                updatePersonal(cv.id, { email: e.target.value });
                setErrors({ ...errors, email: validateEmail(e.target.value) });
              }}
              onBlur={(e) => setErrors({ ...errors, email: validateEmail(e.target.value) })}
              placeholder="you@example.com"
              className={cn(
                "bg-[#3D4944] text-[#D1E8E2]",
                errors.email ? "border-red-400/60" : "border-[#D1E8E2]/10"
              )}
            />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
          </div>
          <div>
            <Label className="text-[#9DB5B0] text-xs uppercase tracking-wider mb-2 block">Phone Number</Label>
            <Input
              value={p.phone}
              onChange={(e) => updatePersonal(cv.id, { phone: e.target.value })}
              placeholder="+1 555 000 0000"
              className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] h-11"
            />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-[#9DB5B0] text-xs uppercase tracking-wider mb-2 block">Location *</Label>
            <Input
              value={p.location}
              onChange={(e) => updatePersonal(cv.id, { location: e.target.value })}
              placeholder="City, Country"
              className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] h-11"
            />
          </div>
        </div>

        {/* Optional section divider */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dashed border-[#D1E8E2]/15" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-[#2C3531] px-3 text-xs text-[#9DB5B0] uppercase tracking-wider">Optional</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-[#9DB5B0] text-xs uppercase tracking-wider mb-2 block">LinkedIn</Label>
            <Input
              value={p.linkedin}
              onChange={(e) => updatePersonal(cv.id, { linkedin: e.target.value })}
              placeholder="linkedin.com/in/username"
              className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] h-11"
            />
          </div>
          <div>
            <Label className="text-[#9DB5B0] text-xs uppercase tracking-wider mb-2 block">Portfolio Website</Label>
            <Input
              value={p.website}
              onChange={(e) => updatePersonal(cv.id, { website: e.target.value })}
              placeholder="yoursite.com"
              className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] h-11"
            />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-[#9DB5B0] text-xs uppercase tracking-wider mb-2 block">GitHub</Label>
            <Input
              value={p.github}
              onChange={(e) => updatePersonal(cv.id, { github: e.target.value })}
              placeholder="github.com/username"
              className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] h-11"
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
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

  const handleChipClick = (profileId: string, example: string) => {
    setSelectedProfile(profileId);
    if (!value.trim()) {
      setValue(example);
      updateCV(cv.id, { summary: example });
    }
  };

  return (
    <div>
      <StepHeader
        title="Tell us a little about yourself."
        subtitle="Don't worry about making it perfect. Write naturally, and you can improve it later."
      />
      <div className="max-w-2xl">
        <Textarea
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            updateCV(cv.id, { summary: e.target.value });
          }}
          placeholder="I am a passionate and motivated professional with experience in..."
          className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] min-h-[160px] text-base leading-relaxed resize-none"
        />

        {/* Suggestion chips */}
        <div className="mt-4">
          <p className="text-xs text-[#9DB5B0] uppercase tracking-wider mb-2">Not sure where to start? Pick a profile:</p>
          <div className="flex flex-wrap gap-2">
            {PROFILE_TYPES.map((p) => (
              <button
                key={p.id}
                onClick={() => handleChipClick(p.id, p.example)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm border transition-all",
                  selectedProfile === p.id
                    ? "bg-[#116466] border-[#116466] text-[#D1E8E2]"
                    : "bg-[#3D4944]/50 border-[#D1E8E2]/15 text-[#9DB5B0] hover:border-[#D1E8E2]/30 hover:text-[#D1E8E2]"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
          {selectedProfile && (
            <div className="mt-3 p-3 rounded-lg bg-[#3D4944]/50 border border-[#116466]/30 text-sm text-[#D1E8E2]/80">
              <span className="text-[#FFCB9A] font-medium">Tip:</span> Edit the example above to make it yours. Replace placeholders like [Field] or [X] with your details.
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
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
    { value: "yes", label: "I have professional work experience", example: "e.g. Software Engineer at Nirvash" },
    { value: "student", label: "I am a student", example: "e.g. Internship or part-time role" },
    { value: "fresher", label: "I am a fresher", example: "e.g. Internship, training, or academic project" },
    { value: "freelance", label: "I have freelance experience", example: "e.g. Freelance Web Developer" },
    { value: "internship", label: "I have internship experience", example: "e.g. Marketing Intern" },
  ];

  return (
    <div>
      <StepHeader
        title="Tell us about your experience."
        subtitle="Even informal or freelance work counts. You can add as many roles as you want."
      />

      <div className="max-w-2xl space-y-3 mb-6">
        <p className="text-sm font-medium text-[#D1E8E2]">What best describes you?</p>
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => {
              setExperienceType(opt.value);
              if (opt.value !== "yes" && cv.experience.length === 0) {
                addExperience(cv.id);
              } else if (opt.value === "yes" && cv.experience.length === 0) {
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
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{opt.label}</span>
              <span className="text-xs text-[#9DB5B0]">{opt.example}</span>
            </div>
          </button>
        ))}
      </div>

      {experienceType && (
        <div className="space-y-5 max-w-2xl">
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
            <Plus className="w-4 h-4" /> Add Another Experience
          </button>
          <p className="text-xs text-[#9DB5B0]">
            Tip: Students and freshers can skip this section if it doesn&apos;t apply.
          </p>
        </div>
      )}
    </div>
  );
}

function ExperienceCard({ index, experience, onChange, onRemove }: any) {
  return (
    <div className="p-5 rounded-xl glass-card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#FFCB9A]">Experience {index}</h3>
        <button onClick={onRemove} className="text-[#9DB5B0] hover:text-[#FFCB9A]">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Input placeholder="Job Title" value={experience.jobTitle} onChange={(e) => onChange({ jobTitle: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
        <Input placeholder="Company / Organization" value={experience.company} onChange={(e) => onChange({ company: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
        <Input placeholder="Location" value={experience.location} onChange={(e) => onChange({ location: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
        <div className="grid grid-cols-2 gap-2">
          <Input placeholder="Start (Jan 2023)" value={experience.startDate} onChange={(e) => onChange({ startDate: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
          <Input placeholder="End" value={experience.endDate} onChange={(e) => onChange({ endDate: e.target.value })} disabled={experience.current} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] disabled:opacity-50" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Switch checked={experience.current} onCheckedChange={(v) => onChange({ current: v, endDate: v ? "" : experience.endDate })} />
        <Label className="text-sm text-[#9DB5B0]">I currently work here</Label>
      </div>
      <div>
        <Label className="text-[#9DB5B0] text-xs uppercase tracking-wider mb-1.5 block">What did you do?</Label>
        <Textarea placeholder="Describe your day-to-day responsibilities. e.g. Built and maintained the company website using React and TypeScript." value={experience.responsibilities} onChange={(e) => onChange({ responsibilities: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] min-h-[80px]" />
        <div className="mt-2 flex justify-end">
          <AIImproveButton
            jobTitle={experience.jobTitle}
            description={experience.responsibilities}
            type="responsibilities"
            onApply={(text) => onChange({ responsibilities: text })}
          />
        </div>
      </div>
      <div>
        <Label className="text-[#9DB5B0] text-xs uppercase tracking-wider mb-1.5 block">Achievements (Optional)</Label>
        <Textarea placeholder="What did you accomplish? e.g. Improved page load time by 30%." value={experience.achievements} onChange={(e) => onChange({ achievements: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] min-h-[60px]" />
      </div>
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
        title="Where did you study?"
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
            <div>
              <Label className="text-[#9DB5B0] text-xs uppercase tracking-wider mb-1.5 block">Description or achievements (optional)</Label>
              <Textarea
                placeholder="e.g. Graduated with honors. President of the Computer Science Club."
                value={edu.description}
                onChange={(e) => updateEducation(cv.id, edu.id, { description: e.target.value })}
                className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] min-h-[60px]"
              />
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

  const titleLower = (cv.personal.title || "").toLowerCase();
  let suggestions: string[] = [];
  if (/engineer|developer|software|web|frontend|backend|full ?stack/.test(titleLower)) {
    suggestions = ["JavaScript", "React", "TypeScript", "Node.js", "Git", "SQL", "REST APIs", "Docker", "Problem Solving"];
  } else if (/design|ui|ux|graphic/.test(titleLower)) {
    suggestions = ["Figma", "Adobe Illustrator", "Photoshop", "Typography", "Wireframing", "Prototyping", "Design Systems", "User Research"];
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
        subtitle="Add technical skills, professional skills, or anything relevant to your career."
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

        {/* AI-powered skill suggestions */}
        <div className="mt-8 pt-4 border-t border-[#D1E8E2]/5">
          <AISkillsSuggestions
            jobTitle={cv.personal.title}
            experience={cv.experience[0]?.jobTitle}
            education={cv.education[0]?.field}
            existingSkills={cv.skills}
            onAddSkill={(skill) => addSkill(cv.id, skill)}
          />
        </div>
      </div>
    </div>
  );
}

function StepProjects({ cv }: { cv: any }) {
  const addProject = useAppStore((s) => s.addProject);
  const updateProject = useAppStore((s) => s.updateProject);
  const removeProject = useAppStore((s) => s.removeProject);
  const addProjectTech = useAppStore((s) => s.addProjectTech);
  const removeProjectTech = useAppStore((s) => s.removeProjectTech);
  const [enabled, setEnabled] = useState(cv.projects.length > 0);
  const [techInput, setTechInput] = useState<Record<string, string>>({});

  return (
    <div>
      <StepHeader
        title="Have you worked on any projects?"
        subtitle="Projects can help show your skills, especially if you're a student or fresher."
      />
      <div className="max-w-2xl">
        {!enabled ? (
          <div className="space-y-3">
            <button
              onClick={() => { setEnabled(true); addProject(cv.id); }}
              className="w-full p-6 rounded-xl border border-dashed border-[#D1E8E2]/20 text-[#9DB5B0] hover:text-[#D1E8E2] hover:border-[#116466] transition-all"
            >
              <Plus className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm">Yes, add a project</span>
            </button>
            <button
              onClick={() => useAppStore.getState().nextWizardStep()}
              className="block w-full text-center text-sm text-[#9DB5B0] hover:text-[#D1E8E2] py-2"
            >
              Skip for now →
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
                {p.description && (
                  <div className="flex justify-end -mt-2">
                    <AIProjectImprover
                      projectName={p.name}
                      description={p.description}
                      technologies={p.technologies || []}
                      onApply={(text) => updateProject(cv.id, p.id, { description: text })}
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
                      className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] h-10"
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        if ((techInput[p.id] || "").trim()) {
                          addProjectTech(cv.id, p.id, techInput[p.id]);
                          setTechInput({ ...techInput, [p.id]: "" });
                        }
                      }}
                      className="bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2]"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {p.technologies?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {p.technologies.map((t: string) => (
                        <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#116466]/30 border border-[#116466]/40 text-[#D1E8E2] text-xs">
                          {t}
                          <button onClick={() => removeProjectTech(cv.id, p.id, t)} className="text-[#9DB5B0] hover:text-[#FFCB9A]">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <Input placeholder="Project Link (optional)" value={p.url} onChange={(e) => updateProject(cv.id, p.id, { url: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
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

  // Active optional sections
  const [active, setActive] = useState<string[]>(() => {
    const arr: string[] = [];
    if (cv.certifications.length) arr.push("certifications");
    if (cv.languages.length) arr.push("languages");
    if (cv.awards.length) arr.push("awards");
    if (cv.volunteer.length) arr.push("volunteer");
    if (cv.publications.length) arr.push("publications");
    if (cv.interests.length) arr.push("interests");
    return arr;
  });

  const toggle = (id: string) => {
    setActive((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const CARDS = [
    { id: "certifications", icon: BadgeCheck, emoji: "🎓", label: "Certifications" },
    { id: "languages", icon: LangIcon, emoji: "🌐", label: "Languages" },
    { id: "awards", icon: Award, emoji: "🏆", label: "Awards & Achievements" },
    { id: "volunteer", icon: HandHeart, emoji: "🤝", label: "Volunteer Experience" },
    { id: "publications", icon: BookOpen, emoji: "📚", label: "Publications" },
    { id: "interests", icon: Heart, emoji: "❤️", label: "Interests" },
  ];

  return (
    <div>
      <StepHeader
        title="Anything else you'd like to include?"
        subtitle="All optional. Tap a card to add that section — nothing here is mandatory."
      />

      <div className="max-w-2xl space-y-5">
        {/* Card grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {CARDS.map((c) => {
            const isActive = active.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggle(c.id)}
                className={cn(
                  "p-4 rounded-xl border text-left transition-all",
                  isActive
                    ? "bg-[#116466]/20 border-[#116466] text-[#D1E8E2]"
                    : "bg-[#3D4944]/50 border-[#D1E8E2]/10 text-[#9DB5B0] hover:border-[#D1E8E2]/30 hover:text-[#D1E8E2]"
                )}
              >
                <div className="text-2xl mb-1.5">{c.emoji}</div>
                <div className="text-sm font-medium">{c.label}</div>
                <div className="text-xs mt-0.5 opacity-70">
                  {isActive ? "Added ✓" : "Tap to add"}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active sections */}
        <div className="space-y-5">
          {active.includes("certifications") && (
            <OptionalSection title="Certifications" onRemove={() => toggle("certifications")}>
              {cv.certifications.map((c: any) => (
                <div key={c.id} className="flex gap-2 mb-2">
                  <Input placeholder="Certification name" value={c.name} onChange={(e) => updateCertification(cv.id, c.id, { name: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] flex-1" />
                  <Input placeholder="Issuer" value={c.issuer} onChange={(e) => updateCertification(cv.id, c.id, { issuer: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] flex-1" />
                  <button onClick={() => removeCertification(cv.id, c.id)} className="text-[#9DB5B0] hover:text-[#FFCB9A] p-2"><X className="w-4 h-4" /></button>
                </div>
              ))}
              <AddButton onClick={() => addCertification(cv.id)} label="Add Certification" />
            </OptionalSection>
          )}

          {active.includes("languages") && (
            <OptionalSection title="Languages" onRemove={() => toggle("languages")}>
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
            </OptionalSection>
          )}

          {active.includes("awards") && (
            <OptionalSection title="Awards & Achievements" onRemove={() => toggle("awards")}>
              {cv.awards.map((a: any) => (
                <div key={a.id} className="space-y-2 mb-3 p-3 rounded-lg bg-[#3D4944]/40">
                  <div className="flex gap-2">
                    <Input placeholder="Award title" value={a.title} onChange={(e) => updateAward(cv.id, a.id, { title: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] flex-1" />
                    <Input placeholder="Issuer" value={a.issuer} onChange={(e) => updateAward(cv.id, a.id, { issuer: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] flex-1" />
                    <Input placeholder="Date" value={a.date} onChange={(e) => updateAward(cv.id, a.id, { date: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] w-28" />
                    <button onClick={() => removeAward(cv.id, a.id)} className="text-[#9DB5B0] hover:text-[#FFCB9A] p-2"><X className="w-4 h-4" /></button>
                  </div>
                  <Input placeholder="Description (optional)" value={a.description} onChange={(e) => updateAward(cv.id, a.id, { description: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2]" />
                </div>
              ))}
              <AddButton onClick={() => addAward(cv.id)} label="Add Award" />
            </OptionalSection>
          )}

          {active.includes("volunteer") && (
            <OptionalSection title="Volunteer Experience" onRemove={() => toggle("volunteer")}>
              <div className="flex gap-2 mb-2">
                <Input
                  value={volunteerInput}
                  onChange={(e) => setVolunteerInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && volunteerInput.trim()) {
                      addVolunteer(cv.id, volunteerInput.trim());
                      setVolunteerInput("");
                    }
                  }}
                  placeholder="e.g. Volunteer Teacher at Local NGO (2023)"
                  className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] flex-1"
                />
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
            </OptionalSection>
          )}

          {active.includes("publications") && (
            <OptionalSection title="Publications" onRemove={() => toggle("publications")}>
              {cv.publications.map((p: any) => (
                <div key={p.id} className="space-y-2 mb-3 p-3 rounded-lg bg-[#3D4944]/40">
                  <div className="flex gap-2">
                    <Input placeholder="Publication title" value={p.title} onChange={(e) => updatePublication(cv.id, p.id, { title: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] flex-1" />
                    <Input placeholder="Publisher" value={p.publisher} onChange={(e) => updatePublication(cv.id, p.id, { publisher: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] flex-1" />
                    <button onClick={() => removePublication(cv.id, p.id)} className="text-[#9DB5B0] hover:text-[#FFCB9A] p-2"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder="Date" value={p.date} onChange={(e) => updatePublication(cv.id, p.id, { date: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] w-32" />
                    <Input placeholder="URL (optional)" value={p.url} onChange={(e) => updatePublication(cv.id, p.id, { url: e.target.value })} className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] flex-1" />
                  </div>
                </div>
              ))}
              <AddButton onClick={() => addPublication(cv.id)} label="Add Publication" />
            </OptionalSection>
          )}

          {active.includes("interests") && (
            <OptionalSection title="Interests" onRemove={() => toggle("interests")}>
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
                  placeholder="Add an interest and press Enter"
                  className="bg-[#3D4944] border-[#D1E8E2]/10 text-[#D1E8E2] flex-1"
                />
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
            </OptionalSection>
          )}
        </div>
      </div>
    </div>
  );
}

function OptionalSection({ title, onRemove, children }: { title: string; onRemove?: () => void; children: React.ReactNode }) {
  return (
    <div className="p-5 rounded-xl glass-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#FFCB9A]">{title}</h3>
        {onRemove && (
          <button onClick={onRemove} className="text-xs text-[#9DB5B0] hover:text-[#FFCB9A]">Remove section</button>
        )}
      </div>
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
  const setWizardStep = useAppStore((s) => s.setWizardStep);

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
        Your CV Information Is Ready! 🎉
      </h1>
      <p className="mt-3 text-[#9DB5B0] text-lg">
        Great work. Now let&apos;s choose a design that brings everything together.
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

      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={() => setView("template-gallery")}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2] font-medium transition-all teal-glow"
        >
          Choose a Template
          <ChevronRight className="w-5 h-5" />
        </button>
        <button
          onClick={() => setWizardStep(1)}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl glass-card hover:border-[#D1E8E2]/30 text-[#D1E8E2] font-medium transition-all"
        >
          <Eye className="w-4 h-4" />
          Review My Information
        </button>
      </div>
    </div>
  );
}
