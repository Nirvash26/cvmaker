"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles, FileText, Briefcase, Award, Eye, CheckCircle2, ArrowRight,
} from "lucide-react";
import { useAppStore, useCurrentCV } from "@/lib/store";
import { AISummaryButton } from "@/components/ai/AISummaryButton";
import { AIImproveButton } from "@/components/ai/AIImproveButton";
import { AISkillsSuggestions } from "@/components/ai/AISkillsSuggestions";
import { AIAchievementsButton } from "@/components/ai/AIAchievementsButton";
import { QualityCheck } from "@/components/quality/QualityCheck";
import { Button } from "@/components/ui/button";

interface ActionCardProps {
  icon: any;
  title: string;
  description: string;
  badge?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

function ActionCard({ icon: Icon, title, description, badge, children, onClick }: ActionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl glass-card hover:border-[#116466]/50 transition-all duration-300"
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#116466] to-[#0d4d4f] flex items-center justify-center teal-glow-soft flex-shrink-0">
          <Icon className="w-5 h-5 text-[#FFCB9A]" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-[#D1E8E2] flex items-center gap-2">
            {title}
            {badge && <span className="px-1.5 py-0.5 rounded bg-[#FFCB9A]/15 text-[10px] text-[#FFCB9A] font-medium">{badge}</span>}
          </h3>
          <p className="text-xs text-[#9DB5B0] mt-0.5">{description}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

export function AIWorkspace() {
  const cv = useCurrentCV();
  const setView = useAppStore((s) => s.setView);
  const updateCV = useAppStore((s) => s.updateCV);
  const addSkill = useAppStore((s) => s.addSkill);
  const updateExperience = useAppStore((s) => s.updateExperience);
  const [qualityOpen, setQualityOpen] = useState(false);

  if (!cv) return null;

  const firstExperience = cv.experience[0];

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFCB9A]/10 border border-[#FFCB9A]/30 text-[#FFCB9A] text-xs mb-3">
          <Sparkles className="w-3 h-3" />
          AI Workspace
        </div>
        <h2 className="text-2xl font-bold text-[#D1E8E2]">How can Nirvash help?</h2>
        <p className="text-sm text-[#9DB5B0] mt-1">Pick an action below. You stay in control — review every suggestion before applying.</p>
      </div>

      {/* Action cards */}
      <div className="grid sm:grid-cols-2 gap-3">
        {/* Improve summary */}
        <ActionCard
          icon={FileText}
          title="Improve summary"
          description="Generate or rewrite your professional summary"
          badge="Popular"
        >
          <AISummaryButton
            context={{ jobTitle: cv.personal.title, skills: cv.skills, summary: cv.summary }}
            onApply={(text) => updateCV(cv.id, { summary: text })}
            variant="inline"
            label="Write with AI"
          />
        </ActionCard>

        {/* Rewrite experience */}
        <ActionCard
          icon={Briefcase}
          title="Rewrite experience"
          description="Turn simple tasks into polished bullet points"
        >
          {firstExperience ? (
            <AIImproveButton
              jobTitle={firstExperience.jobTitle}
              description={firstExperience.responsibilities}
              type="responsibilities"
              onApply={(text) => updateExperience(cv.id, firstExperience.id, { responsibilities: text })}
              label="Improve latest role"
            />
          ) : (
            <p className="text-xs text-[#9DB5B0]">Add an experience entry first.</p>
          )}
        </ActionCard>

        {/* Suggest skills */}
        <ActionCard
          icon={Award}
          title="Suggest skills"
          description="Get relevant skills based on your role"
        >
          <AISkillsSuggestions
            jobTitle={cv.personal.title}
            experience={cv.experience[0]?.jobTitle}
            education={cv.education[0]?.field}
            existingSkills={cv.skills}
            onAddSkill={(skill) => addSkill(cv.id, skill)}
          />
        </ActionCard>

        {/* Achievements */}
        <ActionCard
          icon={Sparkles}
          title="Generate achievements"
          description="Create measurable achievement ideas"
        >
          {firstExperience ? (
            <AIAchievementsButton
              jobTitle={firstExperience.jobTitle || cv.personal.title}
              context={firstExperience.achievements || firstExperience.responsibilities}
              onApply={(text) => updateExperience(cv.id, firstExperience.id, { achievements: text })}
            />
          ) : (
            <p className="text-xs text-[#9DB5B0]">Add an experience entry first.</p>
          )}
        </ActionCard>
      </div>

      {/* CV Score big card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-2xl bg-gradient-to-br from-[#116466]/20 to-[#FFCB9A]/5 border border-[#116466]/30 mt-4"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFCB9A] to-[#D9B08C] flex items-center justify-center peach-glow flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-[#2C3531]" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-[#D1E8E2]">Check my CV</h3>
            <p className="text-xs text-[#9DB5B0] mt-0.5">Get instant feedback on content, readability, completeness, and ATS readiness.</p>
            <Button
              size="sm"
              onClick={() => setQualityOpen(true)}
              className="mt-3 bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2]"
            >
              <Eye className="w-3.5 h-3.5 mr-1.5" /> Analyze CV
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Quality check modal */}
      <QualityCheck open={qualityOpen} onOpenChange={setQualityOpen} cv={cv} />
    </div>
  );
}
