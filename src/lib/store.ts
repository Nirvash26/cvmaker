"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  CVData,
  View,
  createEmptyCV,
  createEmptyExperience,
  createEmptyEducation,
  createEmptyProject,
  createEmptyCertification,
  createEmptyLanguage,
  createEmptyAward,
  createEmptyPublication,
  ExperienceEntry,
  EducationEntry,
  ProjectEntry,
  CertificationEntry,
  LanguageEntry,
  AwardEntry,
  PublicationEntry,
} from "./types";

interface AppState {
  // Navigation
  view: View;
  setView: (v: View) => void;

  // CV collection
  cvs: CVData[];
  currentCVId: string | null;

  // Creation flow state
  creationMethod: "questions" | "form" | null;
  wizardStep: number;
  totalWizardSteps: number;

  // Editor UI state
  editorTab: "edit" | "preview" | "customize";
  editorActiveSection: string;
  previewZoom: number;

  // Toast / saving status
  savingStatus: "idle" | "saving" | "saved";

  // Actions
  createCV: (method: "questions" | "form") => string;
  deleteCV: (id: string) => void;
  duplicateCV: (id: string) => void;
  renameCV: (id: string, name: string) => void;
  setCurrentCV: (id: string) => void;
  updateCV: (id: string, updates: Partial<CVData>) => void;
  updatePersonal: (id: string, updates: Partial<CVData["personal"]>) => void;
  updateDesign: (id: string, updates: Partial<CVData["design"]>) => void;

  // Experience
  addExperience: (cvId: string) => void;
  updateExperience: (cvId: string, id: string, updates: Partial<ExperienceEntry>) => void;
  removeExperience: (cvId: string, id: string) => void;

  // Education
  addEducation: (cvId: string) => void;
  updateEducation: (cvId: string, id: string, updates: Partial<EducationEntry>) => void;
  removeEducation: (cvId: string, id: string) => void;

  // Projects
  addProject: (cvId: string) => void;
  updateProject: (cvId: string, id: string, updates: Partial<ProjectEntry>) => void;
  removeProject: (cvId: string, id: string) => void;
  addProjectTech: (cvId: string, projectId: string, tech: string) => void;
  removeProjectTech: (cvId: string, projectId: string, tech: string) => void;

  // Certifications
  addCertification: (cvId: string) => void;
  updateCertification: (cvId: string, id: string, updates: Partial<CertificationEntry>) => void;
  removeCertification: (cvId: string, id: string) => void;

  // Languages
  addLanguage: (cvId: string) => void;
  updateLanguage: (cvId: string, id: string, updates: Partial<LanguageEntry>) => void;
  removeLanguage: (cvId: string, id: string) => void;

  // Awards
  addAward: (cvId: string) => void;
  updateAward: (cvId: string, id: string, updates: Partial<AwardEntry>) => void;
  removeAward: (cvId: string, id: string) => void;

  // Publications
  addPublication: (cvId: string) => void;
  updatePublication: (cvId: string, id: string, updates: Partial<PublicationEntry>) => void;
  removePublication: (cvId: string, id: string) => void;

  // Reordering entries (drag and drop)
  moveExperience: (cvId: string, from: number, to: number) => void;
  moveEducation: (cvId: string, from: number, to: number) => void;
  moveProject: (cvId: string, from: number, to: number) => void;
  duplicateExperience: (cvId: string, id: string) => void;
  duplicateEducation: (cvId: string, id: string) => void;

  // Skills + simple arrays
  addSkill: (cvId: string, skill: string) => void;
  removeSkill: (cvId: string, skill: string) => void;
  addAchievement: (cvId: string, item: string) => void;
  removeAchievement: (cvId: string, index: number) => void;
  addInterest: (cvId: string, item: string) => void;
  removeInterest: (cvId: string, index: number) => void;
  addVolunteer: (cvId: string, item: string) => void;
  removeVolunteer: (cvId: string, index: number) => void;

  // Wizard
  setWizardStep: (n: number) => void;
  nextWizardStep: () => void;
  prevWizardStep: () => void;

  // Editor UI
  setEditorTab: (t: "edit" | "preview" | "customize") => void;
  setEditorActiveSection: (s: string) => void;
  setPreviewZoom: (z: number) => void;

  setSavingStatus: (s: "idle" | "saving" | "saved") => void;
}

const updateCVInList = (cvs: CVData[], id: string, updater: (cv: CVData) => CVData): CVData[] =>
  cvs.map((cv) => (cv.id === id ? { ...updater(cv), updatedAt: Date.now() } : cv));

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      view: "landing",
      setView: (v) => {
        set({ view: v });
        if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "auto" });
      },

      cvs: [],
      currentCVId: null,

      creationMethod: null,
      wizardStep: 1,
      totalWizardSteps: 8,

      editorTab: "edit",
      editorActiveSection: "personal",
      previewZoom: 0.7,

      savingStatus: "idle",

      createCV: (method) => {
        const cv = createEmptyCV();
        set((state) => ({
          cvs: [...state.cvs, cv],
          currentCVId: cv.id,
          creationMethod: method,
          wizardStep: 1,
        }));
        return cv.id;
      },

      deleteCV: (id) =>
        set((state) => ({
          cvs: state.cvs.filter((c) => c.id !== id),
          currentCVId: state.currentCVId === id ? null : state.currentCVId,
        })),

      duplicateCV: (id) => {
        const cv = get().cvs.find((c) => c.id === id);
        if (!cv) return;
        const copy: CVData = {
          ...cv,
          id: `cv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          name: `${cv.name} (Copy)`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({ cvs: [...state.cvs, copy] }));
      },

      renameCV: (id, name) =>
        set((state) => ({
          cvs: state.cvs.map((c) => (c.id === id ? { ...c, name, updatedAt: Date.now() } : c)),
        })),

      setCurrentCV: (id) => set({ currentCVId: id }),

      updateCV: (id, updates) =>
        set((state) => ({
          cvs: updateCVInList(state.cvs, id, (cv) => ({ ...cv, ...updates })),
        })),

      updatePersonal: (id, updates) =>
        set((state) => ({
          cvs: updateCVInList(state.cvs, id, (cv) => ({
            ...cv,
            personal: { ...cv.personal, ...updates },
          })),
        })),

      updateDesign: (id, updates) =>
        set((state) => ({
          cvs: updateCVInList(state.cvs, id, (cv) => ({
            ...cv,
            design: { ...cv.design, ...updates },
          })),
        })),

      addExperience: (cvId) =>
        set((state) => ({
          cvs: updateCVInList(state.cvs, cvId, (cv) => ({
            ...cv,
            experience: [...cv.experience, createEmptyExperience()],
          })),
        })),

      updateExperience: (cvId, id, updates) =>
        set((state) => ({
          cvs: updateCVInList(state.cvs, cvId, (cv) => ({
            ...cv,
            experience: cv.experience.map((e) => (e.id === id ? { ...e, ...updates } : e)),
          })),
        })),

      removeExperience: (cvId, id) =>
        set((state) => ({
          cvs: updateCVInList(state.cvs, cvId, (cv) => ({
            ...cv,
            experience: cv.experience.filter((e) => e.id !== id),
          })),
        })),

      addEducation: (cvId) =>
        set((state) => ({
          cvs: updateCVInList(state.cvs, cvId, (cv) => ({
            ...cv,
            education: [...cv.education, createEmptyEducation()],
          })),
        })),

      updateEducation: (cvId, id, updates) =>
        set((state) => ({
          cvs: updateCVInList(state.cvs, cvId, (cv) => ({
            ...cv,
            education: cv.education.map((e) => (e.id === id ? { ...e, ...updates } : e)),
          })),
        })),

      removeEducation: (cvId, id) =>
        set((state) => ({
          cvs: updateCVInList(state.cvs, cvId, (cv) => ({
            ...cv,
            education: cv.education.filter((e) => e.id !== id),
          })),
        })),

      addProject: (cvId) =>
        set((state) => ({
          cvs: updateCVInList(state.cvs, cvId, (cv) => ({
            ...cv,
            projects: [...cv.projects, createEmptyProject()],
          })),
        })),

      updateProject: (cvId, id, updates) =>
        set((state) => ({
          cvs: updateCVInList(state.cvs, cvId, (cv) => ({
            ...cv,
            projects: cv.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
          })),
        })),

      removeProject: (cvId, id) =>
        set((state) => ({
          cvs: updateCVInList(state.cvs, cvId, (cv) => ({
            ...cv,
            projects: cv.projects.filter((p) => p.id !== id),
          })),
        })),

      addProjectTech: (cvId, projectId, tech) =>
        set((state) => ({
          cvs: updateCVInList(state.cvs, cvId, (cv) => ({
            ...cv,
            projects: cv.projects.map((p) => {
              if (p.id !== projectId) return p;
              const trimmed = tech.trim();
              if (!trimmed || p.technologies.includes(trimmed)) return p;
              return { ...p, technologies: [...p.technologies, trimmed] };
            }),
          })),
        })),

      removeProjectTech: (cvId, projectId, tech) =>
        set((state) => ({
          cvs: updateCVInList(state.cvs, cvId, (cv) => ({
            ...cv,
            projects: cv.projects.map((p) =>
              p.id === projectId
                ? { ...p, technologies: p.technologies.filter((t) => t !== tech) }
                : p
            ),
          })),
        })),

      addCertification: (cvId) =>
        set((state) => ({
          cvs: updateCVInList(state.cvs, cvId, (cv) => ({
            ...cv,
            certifications: [...cv.certifications, createEmptyCertification()],
          })),
        })),

      updateCertification: (cvId, id, updates) =>
        set((state) => ({
          cvs: updateCVInList(state.cvs, cvId, (cv) => ({
            ...cv,
            certifications: cv.certifications.map((c) => (c.id === id ? { ...c, ...updates } : c)),
          })),
        })),

      removeCertification: (cvId, id) =>
        set((state) => ({
          cvs: updateCVInList(state.cvs, cvId, (cv) => ({
            ...cv,
            certifications: cv.certifications.filter((c) => c.id !== id),
          })),
        })),

      addLanguage: (cvId) =>
        set((state) => ({
          cvs: updateCVInList(state.cvs, cvId, (cv) => ({
            ...cv,
            languages: [...cv.languages, createEmptyLanguage()],
          })),
        })),

      updateLanguage: (cvId, id, updates) =>
        set((state) => ({
          cvs: updateCVInList(state.cvs, cvId, (cv) => ({
            ...cv,
            languages: cv.languages.map((l) => (l.id === id ? { ...l, ...updates } : l)),
          })),
        })),

      removeLanguage: (cvId, id) =>
        set((state) => ({
          cvs: updateCVInList(state.cvs, cvId, (cv) => ({
            ...cv,
            languages: cv.languages.filter((l) => l.id !== id),
          })),
        })),

      addAward: (cvId) =>
        set((state) => ({
          cvs: updateCVInList(state.cvs, cvId, (cv) => ({
            ...cv,
            awards: [...cv.awards, createEmptyAward()],
          })),
        })),

      updateAward: (cvId, id, updates) =>
        set((state) => ({
          cvs: updateCVInList(state.cvs, cvId, (cv) => ({
            ...cv,
            awards: cv.awards.map((a) => (a.id === id ? { ...a, ...updates } : a)),
          })),
        })),

      removeAward: (cvId, id) =>
        set((state) => ({
          cvs: updateCVInList(state.cvs, cvId, (cv) => ({
            ...cv,
            awards: cv.awards.filter((a) => a.id !== id),
          })),
        })),

      addPublication: (cvId) =>
        set((state) => ({
          cvs: updateCVInList(state.cvs, cvId, (cv) => ({
            ...cv,
            publications: [...cv.publications, createEmptyPublication()],
          })),
        })),

      updatePublication: (cvId, id, updates) =>
        set((state) => ({
          cvs: updateCVInList(state.cvs, cvId, (cv) => ({
            ...cv,
            publications: cv.publications.map((p) => (p.id === id ? { ...p, ...updates } : p)),
          })),
        })),

      removePublication: (cvId, id) =>
        set((state) => ({
          cvs: updateCVInList(state.cvs, cvId, (cv) => ({
            ...cv,
            publications: cv.publications.filter((p) => p.id !== id),
          })),
        })),

      moveExperience: (cvId, from, to) =>
        set((state) => ({
          cvs: updateCVInList(state.cvs, cvId, (cv) => {
            const arr = [...cv.experience];
            if (from < 0 || to < 0 || from >= arr.length || to >= arr.length) return cv;
            const [moved] = arr.splice(from, 1);
            arr.splice(to, 0, moved);
            return { ...cv, experience: arr };
          }),
        })),

      moveEducation: (cvId, from, to) =>
        set((state) => ({
          cvs: updateCVInList(state.cvs, cvId, (cv) => {
            const arr = [...cv.education];
            if (from < 0 || to < 0 || from >= arr.length || to >= arr.length) return cv;
            const [moved] = arr.splice(from, 1);
            arr.splice(to, 0, moved);
            return { ...cv, education: arr };
          }),
        })),

      moveProject: (cvId, from, to) =>
        set((state) => ({
          cvs: updateCVInList(state.cvs, cvId, (cv) => {
            const arr = [...cv.projects];
            if (from < 0 || to < 0 || from >= arr.length || to >= arr.length) return cv;
            const [moved] = arr.splice(from, 1);
            arr.splice(to, 0, moved);
            return { ...cv, projects: arr };
          }),
        })),

      duplicateExperience: (cvId, id) =>
        set((state) => ({
          cvs: updateCVInList(state.cvs, cvId, (cv) => {
            const orig = cv.experience.find((e) => e.id === id);
            if (!orig) return cv;
            const copy: ExperienceEntry = {
              ...orig,
              id: `exp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            };
            const idx = cv.experience.findIndex((e) => e.id === id);
            const arr = [...cv.experience];
            arr.splice(idx + 1, 0, copy);
            return { ...cv, experience: arr };
          }),
        })),

      duplicateEducation: (cvId, id) =>
        set((state) => ({
          cvs: updateCVInList(state.cvs, cvId, (cv) => {
            const orig = cv.education.find((e) => e.id === id);
            if (!orig) return cv;
            const copy: EducationEntry = {
              ...orig,
              id: `edu_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            };
            const idx = cv.education.findIndex((e) => e.id === id);
            const arr = [...cv.education];
            arr.splice(idx + 1, 0, copy);
            return { ...cv, education: arr };
          }),
        })),

      addSkill: (cvId, skill) =>
        set((state) => {
          const trimmed = skill.trim();
          if (!trimmed) return state;
          return {
            cvs: updateCVInList(state.cvs, cvId, (cv) => ({
              ...cv,
              skills: cv.skills.includes(trimmed) ? cv.skills : [...cv.skills, trimmed],
            })),
          };
        }),

      removeSkill: (cvId, skill) =>
        set((state) => ({
          cvs: updateCVInList(state.cvs, cvId, (cv) => ({
            ...cv,
            skills: cv.skills.filter((s) => s !== skill),
          })),
        })),

      addAchievement: (cvId, item) =>
        set((state) => {
          const trimmed = item.trim();
          if (!trimmed) return state;
          return {
            cvs: updateCVInList(state.cvs, cvId, (cv) => ({
              ...cv,
              achievements: [...cv.achievements, trimmed],
            })),
          };
        }),

      removeAchievement: (cvId, index) =>
        set((state) => ({
          cvs: updateCVInList(state.cvs, cvId, (cv) => ({
            ...cv,
            achievements: cv.achievements.filter((_, i) => i !== index),
          })),
        })),

      addInterest: (cvId, item) =>
        set((state) => {
          const trimmed = item.trim();
          if (!trimmed) return state;
          return {
            cvs: updateCVInList(state.cvs, cvId, (cv) => ({
              ...cv,
              interests: [...cv.interests, trimmed],
            })),
          };
        }),

      removeInterest: (cvId, index) =>
        set((state) => ({
          cvs: updateCVInList(state.cvs, cvId, (cv) => ({
            ...cv,
            interests: cv.interests.filter((_, i) => i !== index),
          })),
        })),

      addVolunteer: (cvId, item) =>
        set((state) => {
          const trimmed = item.trim();
          if (!trimmed) return state;
          return {
            cvs: updateCVInList(state.cvs, cvId, (cv) => ({
              ...cv,
              volunteer: [...cv.volunteer, trimmed],
            })),
          };
        }),

      removeVolunteer: (cvId, index) =>
        set((state) => ({
          cvs: updateCVInList(state.cvs, cvId, (cv) => ({
            ...cv,
            volunteer: cv.volunteer.filter((_, i) => i !== index),
          })),
        })),

      setWizardStep: (n) => set({ wizardStep: n }),
      nextWizardStep: () => set((state) => ({ wizardStep: Math.min(state.wizardStep + 1, state.totalWizardSteps) })),
      prevWizardStep: () => set((state) => ({ wizardStep: Math.max(state.wizardStep - 1, 1) })),

      setEditorTab: (t) => set({ editorTab: t }),
      setEditorActiveSection: (s) => set({ editorActiveSection: s }),
      setPreviewZoom: (z) => set({ previewZoom: Math.max(0.3, Math.min(1.5, z)) }),

      setSavingStatus: (s) => set({ savingStatus: s }),
    }),
    {
      name: "nirvash-cv-maker",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cvs: state.cvs,
        currentCVId: state.currentCVId,
      }),
      migrate: (persisted: any, _version) => {
        // Ensure new fields exist on loaded CVs
        if (persisted?.cvs) {
          persisted.cvs = persisted.cvs.map((cv: any) => ({
            ...cv,
            personal: {
              github: "",
              ...cv.personal,
            },
            awards: cv.awards || [],
            publications: cv.publications || [],
            education: (cv.education || []).map((e: any) => ({ ...e, description: e.description || "" })),
            projects: (cv.projects || []).map((p: any) => ({
              ...p,
              technologies: Array.isArray(p.technologies) ? p.technologies : (p.technologies ? String(p.technologies).split(",").map((s: string) => s.trim()).filter(Boolean) : []),
            })),
          }));
        }
        return persisted;
      },
      version: 2,
    }
  )
);

// Convenience selector hook
export function useCurrentCV(): CVData | null {
  return useAppStore((s) => s.cvs.find((c) => c.id === s.currentCVId) ?? null);
}
