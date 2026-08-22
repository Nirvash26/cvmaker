"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const MESSAGES = [
  "Improving your experience...",
  "Finding relevant skills...",
  "Reviewing your CV...",
  "Preparing your professional summary...",
  "Polishing your bullet points...",
  "Analyzing your content...",
];

interface AILoadingStateProps {
  message?: string;
  messageIndex?: number;
}

/**
 * Branded AI loading state — animated sparkle + rotating message.
 * Use `messageIndex` to cycle through messages, or pass a fixed `message`.
 */
export function AILoadingState({ message, messageIndex }: AILoadingStateProps) {
  const text = message || (typeof messageIndex === "number" ? MESSAGES[messageIndex % MESSAGES.length] : MESSAGES[0]);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          rotate: [0, 8, -8, 0],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#116466] to-[#0d4d4f] flex items-center justify-center teal-glow mb-4"
      >
        <Sparkles className="w-6 h-6 text-[#FFCB9A]" />
        {/* Orbiting dot */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#FFCB9A]" />
        </motion.div>
      </motion.div>

      <motion.p
        key={text}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-sm text-[#D1E8E2] font-medium"
      >
        {text}
      </motion.p>
      <p className="text-xs text-[#9DB5B0] mt-1">Nirvash AI is working its magic</p>
    </div>
  );
}

export { MESSAGES as AI_LOADING_MESSAGES };
