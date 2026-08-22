"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAppStore, useCurrentCV } from "@/lib/store";
import { TemplatePreview } from "@/components/editor/TemplatePreview";

export function PreparingTransition() {
  const cv = useCurrentCV();
  const setView = useAppStore((s) => s.setView);
  const [stage, setStage] = useState(0);

  const messages = [
    "Preparing your CV...",
    "Applying template...",
    "Almost there...",
  ];

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 700);
    const t2 = setTimeout(() => setStage(2), 1400);
    const t3 = setTimeout(() => setView("editor"), 2100);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [setView]);

  if (!cv) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2C3531] overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#116466]/30 rounded-full blur-3xl"
        />
        <div className="absolute inset-0 grid-bg radial-fade opacity-20" />
      </div>

      <div className="relative flex flex-col items-center">
        {/* Enlarging CV preview */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative mb-10"
        >
          {/* Glow ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-8 rounded-full"
            style={{
              background: "conic-gradient(from 0deg, transparent 0%, #FFCB9A 25%, transparent 50%, #116466 75%, transparent 100%)",
              opacity: 0.3,
              filter: "blur(20px)",
            }}
          />
          <div className="relative w-56 sm:w-64 rounded-xl overflow-hidden glass-card-strong p-1.5">
            <div style={{ aspectRatio: "1 / 1.414" }} className="rounded-md overflow-hidden">
              <TemplatePreview templateId={cv.template} cv={cv} compact />
            </div>
          </div>
        </motion.div>

        {/* Status text */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 rounded-full border-2 border-[#FFCB9A] border-t-transparent"
            />
            <span className="text-lg font-medium text-[#D1E8E2]">{messages[stage]}</span>
          </div>
          <p className="text-sm text-[#9DB5B0]">Setting up your live editor</p>
        </motion.div>

        {/* Progress steps */}
        <div className="mt-6 flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                backgroundColor: i <= stage ? "#FFCB9A" : "#3D4944",
                scale: i === stage ? 1.2 : 1,
              }}
              transition={{ duration: 0.3 }}
              className="w-2 h-2 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
