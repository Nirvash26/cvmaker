"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Download, Edit3, Plus, PartyPopper } from "lucide-react";
import { useAppStore, useCurrentCV } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { DownloadModal } from "@/components/common/DownloadModal";
import { TemplatePreview } from "@/components/editor/TemplatePreview";

export function SuccessScreen() {
  const cv = useCurrentCV();
  const setView = useAppStore((s) => s.setView);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    const t = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(t);
  }, []);

  if (!cv) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Button onClick={() => setView("dashboard")} className="bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2]">
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-20 overflow-hidden">
      {/* Glow background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-bg radial-fade opacity-30" />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#116466]/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#FFCB9A]/20 rounded-full blur-3xl"
        />
      </div>

      {/* Confetti */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => {
            const colors = ["#FFCB9A", "#116466", "#D9B08C", "#D1E8E2"];
            const color = colors[i % colors.length];
            const left = Math.random() * 100;
            const delay = Math.random() * 0.5;
            const duration = 2 + Math.random() * 2;
            return (
              <motion.div
                key={i}
                initial={{ y: -50, x: 0, opacity: 1, rotate: 0 }}
                animate={{ y: window.innerHeight + 50, x: (Math.random() - 0.5) * 200, opacity: [1, 1, 0], rotate: Math.random() * 720 }}
                transition={{ duration, delay, ease: "easeIn" }}
                style={{
                  position: "absolute",
                  left: `${left}%`,
                  width: 8,
                  height: 12,
                  background: color,
                  borderRadius: 2,
                }}
              />
            );
          })}
        </div>
      )}

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16 text-center relative">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.9 }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#116466] to-[#0d4d4f] teal-glow mb-6 mx-auto"
        >
          <CheckCircle2 className="w-12 h-12 text-[#FFCB9A]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-[#D1E8E2]">
            Your CV Is Ready! 🎉
          </h1>
          <p className="mt-4 text-[#9DB5B0] text-lg max-w-md mx-auto">
            You&apos;ve turned your experience into a professional CV. Now go get that opportunity.
          </p>
        </motion.div>

        {/* CV preview thumbnail */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 mx-auto max-w-xs"
        >
          <div className="rounded-xl overflow-hidden glass-card p-2">
            <div style={{ aspectRatio: "1 / 1.414" }} className="rounded-md overflow-hidden">
              {/* Lightweight preview using the same component */}
              <MiniPreview cv={cv} />
            </div>
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Button onClick={() => setDownloadOpen(true)} className="bg-[#FFCB9A] hover:bg-[#FFCB9A]/90 text-[#2C3531] w-full sm:w-auto">
            <Download className="w-4 h-4 mr-1.5" /> Download PDF
          </Button>
          <Button onClick={() => setView("editor")} className="bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2] w-full sm:w-auto">
            <Edit3 className="w-4 h-4 mr-1.5" /> Edit CV
          </Button>
          <Button onClick={() => setView("method-select")} variant="outline" className="bg-transparent border border-[#D1E8E2]/20 text-[#D1E8E2] hover:bg-[#3D4944] w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-1.5" /> Create Another CV
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFCB9A]/10 border border-[#FFCB9A]/20 text-[#FFCB9A] text-sm"
        >
          <PartyPopper className="w-4 h-4" />
          From a blank page to a professional CV in minutes.
        </motion.div>
      </div>

      <DownloadModal open={downloadOpen} onOpenChange={setDownloadOpen} cv={cv} />
    </div>
  );
}

function MiniPreview({ cv }: { cv: any }) {
  return <TemplatePreview templateId={cv.template} cv={cv} compact />;
}
