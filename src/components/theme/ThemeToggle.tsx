"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // Track mount state to avoid hydration mismatch
  // Using useState with an initializer that checks if we're in browser
  const [mounted, setMounted] = useState(false);
  if (!mounted && typeof window !== "undefined") {
    // Schedule the state update outside of render
    queueMicrotask(() => setMounted(true));
  }

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
      title={isDark ? "Switch to Light mode" : "Switch to Dark mode"}
      aria-label="Toggle theme"
    >
      <motion.div
        key={isDark ? "moon" : "sun"}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      </motion.div>
    </button>
  );
}
