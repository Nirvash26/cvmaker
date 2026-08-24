"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

// useSyncExternalStore is the React 18+ pattern for detecting client-side
// mount without triggering setState-in-effect warnings.
function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useIsClient();

  if (!mounted) {
    return <div className="w-9 h-9" aria-hidden />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all overflow-hidden"
      title={isDark ? "Switch to Light mode" : "Switch to Dark mode"}
      aria-label="Toggle theme"
    >
      <motion.div
        key={isDark ? "moon" : "sun"}
        initial={{ rotate: -90, opacity: 0, scale: 0.5, y: -8 }}
        animate={{ rotate: 0, opacity: 1, scale: 1, y: 0 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.5, y: 8 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      </motion.div>
    </button>
  );
}
