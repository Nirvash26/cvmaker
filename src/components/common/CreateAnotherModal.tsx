"use client";

import { motion } from "framer-motion";
import { Plus, Copy, LayoutTemplate, X, ArrowRight } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { TEMPLATES } from "@/lib/templates";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export function CreateAnotherModal({ open, onOpenChange }: Props) {
  const setView = useAppStore((s) => s.setView);
  const createCV = useAppStore((s) => s.createCV);
  const duplicateCV = useAppStore((s) => s.duplicateCV);
  const cvs = useAppStore((s) => s.cvs);

  const handleStartFresh = () => {
    onOpenChange(false);
    setView("method-select");
  };

  const handleDuplicate = (id: string) => {
    duplicateCV(id);
    onOpenChange(false);
    setView("dashboard");
  };

  const handleStartWithTemplate = (templateId: string) => {
    const id = createCV("form");
    useAppStore.getState().updateCV(id, { template: templateId });
    onOpenChange(false);
    setView("editor");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#34403B] border-[#D1E8E2]/10 text-[#D1E8E2] max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-[#D1E8E2]">
            <span>How would you like to start?</span>
            <button onClick={() => onOpenChange(false)} className="text-[#9DB5B0] hover:text-[#D1E8E2]">
              <X className="w-5 h-5" />
            </button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Option 1: Start fresh */}
          <button
            onClick={handleStartFresh}
            className="group w-full flex items-center gap-4 p-4 rounded-xl glass-card hover:border-[#116466] transition-all text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#116466] to-[#0d4d4f] flex items-center justify-center teal-glow">
              <Plus className="w-6 h-6 text-[#FFCB9A]" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-[#D1E8E2]">Start from scratch</h3>
              <p className="text-xs text-[#9DB5B0] mt-0.5">A blank CV — answer questions or fill out a form.</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[#9DB5B0] group-hover:text-[#FFCB9A] group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Option 2: Duplicate existing */}
          {cvs.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Copy className="w-4 h-4 text-[#FFCB9A]" />
                <h3 className="text-sm font-semibold text-[#D1E8E2]">Duplicate an existing CV</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto no-scrollbar">
                {cvs.map((cv) => (
                  <button
                    key={cv.id}
                    onClick={() => handleDuplicate(cv.id)}
                    className="p-3 rounded-lg bg-[#3D4944] hover:bg-[#3D4944]/80 border border-[#D1E8E2]/10 hover:border-[#116466] transition-all text-left"
                  >
                    <div className="text-sm font-medium text-[#D1E8E2] truncate">{cv.name}</div>
                    <div className="text-xs text-[#9DB5B0]">{cv.template}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Option 3: Start with template */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <LayoutTemplate className="w-4 h-4 text-[#FFCB9A]" />
              <h3 className="text-sm font-semibold text-[#D1E8E2]">Start with a template</h3>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-44 overflow-y-auto no-scrollbar">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleStartWithTemplate(t.id)}
                  className="p-2 rounded-lg bg-[#3D4944] hover:bg-[#3D4944]/80 border border-[#D1E8E2]/10 hover:border-[#116466] transition-all text-center"
                >
                  <div className="text-xs font-medium text-[#D1E8E2]">{t.name}</div>
                  <div className="text-[10px] text-[#9DB5B0]">{t.category}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
