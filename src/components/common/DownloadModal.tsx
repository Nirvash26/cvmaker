"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, FileType, Printer, Loader2, X, Check, FileDown, AlertCircle } from "lucide-react";
import { CVData } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  cv: CVData;
}

type Status = "idle" | "preparing" | "ready" | "error";

const PREPARING_MESSAGES = [
  "Preparing your CV...",
  "Rendering template...",
  "Generating document...",
  "Almost there...",
];

export function DownloadModal({ open, onOpenChange, cv }: Props) {
  const setView = useAppStore((s) => s.setView);
  const [status, setStatus] = useState<Status>("idle");
  const [format, setFormat] = useState<"pdf" | "docx" | null>(null);
  const [messageIdx, setMessageIdx] = useState(0);

  const startPreparing = (fmt: "pdf" | "docx") => {
    setFormat(fmt);
    setStatus("preparing");
    setMessageIdx(0);

    // Cycle messages
    const interval = setInterval(() => {
      setMessageIdx((i) => Math.min(i + 1, PREPARING_MESSAGES.length - 1));
    }, 600);

    setTimeout(async () => {
      clearInterval(interval);
      try {
        if (fmt === "pdf") {
          // Use browser print-to-PDF flow
          window.print();
          setStatus("ready");
        } else {
          const { generateDOCX } = await import("@/lib/docx-export");
          const blob = await generateDOCX(cv);
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${cv.name || "cv"}.docx`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          setStatus("ready");
        }
      } catch (e) {
        console.error(e);
        setStatus("error");
        toast.error("Failed to generate document.");
      }
    }, 1800);
  };

  const handlePrint = () => {
    window.print();
    toast.success("Print dialog opened.");
    onOpenChange(false);
  };

  const handleClose = () => {
    setStatus("idle");
    setFormat(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="bg-[#34403B] border-[#D1E8E2]/10 text-[#D1E8E2] max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Download Your CV</span>
            <button onClick={handleClose} className="text-[#9DB5B0] hover:text-[#D1E8E2]">
              <X className="w-5 h-5" />
            </button>
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <p className="text-sm text-[#9DB5B0]">Choose your preferred format.</p>

              {/* PDF */}
              <button
                onClick={() => startPreparing("pdf")}
                className="w-full flex items-center gap-3 p-4 rounded-lg bg-[#3D4944] hover:bg-[#3D4944]/80 hover:border-[#116466] border border-transparent transition-all text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-red-500/15 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-red-400" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-[#D1E8E2]">PDF</div>
                  <div className="text-xs text-[#9DB5B0]">Best for job applications and professional sharing.</div>
                </div>
              </button>

              {/* DOCX */}
              <button
                onClick={() => startPreparing("docx")}
                className="w-full flex items-center gap-3 p-4 rounded-lg bg-[#3D4944] hover:bg-[#3D4944]/80 hover:border-[#116466] border border-transparent transition-all text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-500/15 flex items-center justify-center">
                  <FileType className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-[#D1E8E2]">DOCX</div>
                  <div className="text-xs text-[#9DB5B0]">Best for further editing in Word.</div>
                </div>
              </button>

              {/* Print */}
              <button
                onClick={handlePrint}
                className="w-full flex items-center gap-3 p-4 rounded-lg bg-[#3D4944] hover:bg-[#3D4944]/80 hover:border-[#116466] border border-transparent transition-all text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-[#FFCB9A]/15 flex items-center justify-center">
                  <Printer className="w-5 h-5 text-[#FFCB9A]" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-[#D1E8E2]">Print</div>
                  <div className="text-xs text-[#9DB5B0]">Print your CV directly from your browser.</div>
                </div>
              </button>

              <div className="pt-3 border-t border-[#D1E8E2]/5">
                <Button
                  onClick={() => { handleClose(); setView("success"); }}
                  className="w-full bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2]"
                >
                  <Check className="w-4 h-4 mr-1.5" /> I'm Done — Show Success Screen
                </Button>
              </div>
            </motion.div>
          )}

          {status === "preparing" && (
            <motion.div
              key="preparing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-8 flex flex-col items-center text-center"
            >
              {/* Animated document icon */}
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, -2, 0],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-16 h-20 rounded-lg bg-gradient-to-br from-[#116466] to-[#0d4d4f] flex items-center justify-center mb-4 teal-glow"
              >
                <FileDown className="w-7 h-7 text-[#FFCB9A]" />
                {/* Animated scan line */}
                <motion.div
                  animate={{ y: [-30, 30, -30] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-x-2 h-px bg-[#FFCB9A]/60"
                  style={{ filter: "blur(0.5px)" }}
                />
              </motion.div>

              <motion.p
                key={messageIdx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-base font-medium text-[#D1E8E2]"
              >
                {PREPARING_MESSAGES[messageIdx]}
              </motion.p>
              <p className="text-xs text-[#9DB5B0] mt-1">
                Generating {format?.toUpperCase()} document
              </p>

              {/* Progress dots */}
              <div className="mt-4 flex items-center gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      backgroundColor: i <= messageIdx ? "#FFCB9A" : "#3D4944",
                      scale: i === messageIdx ? 1.3 : 1,
                    }}
                    className="w-1.5 h-1.5 rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          )}

          {status === "ready" && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-6 flex flex-col items-center text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFCB9A] to-[#D9B08C] flex items-center justify-center mb-4 peach-glow"
              >
                <Check className="w-8 h-8 text-[#2C3531]" />
              </motion.div>
              <h3 className="text-lg font-bold text-[#D1E8E2]">Your Download Is Ready!</h3>
              <p className="text-sm text-[#9DB5B0] mt-1 max-w-xs">
                {format === "pdf"
                  ? "Your print dialog has opened. Choose 'Save as PDF' to download."
                  : `Your ${cv.name || "CV"}.docx file has been downloaded.`}
              </p>
              <Button onClick={handleClose} className="mt-5 bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2]">
                Done
              </Button>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-6 flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 rounded-full bg-red-500/15 flex items-center justify-center mb-3">
                <AlertCircle className="w-7 h-7 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-[#D1E8E2]">Something went wrong</h3>
              <p className="text-sm text-[#9DB5B0] mt-1 max-w-xs">
                Don&apos;t worry — your CV is safe. Please try again.
              </p>
              <Button onClick={() => setStatus("idle")} className="mt-5 bg-[#116466] hover:bg-[#0d4d4f] text-[#D1E8E2]">
                Try Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
