"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, FileText, Plus, LayoutTemplate, User } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { id: "landing", label: "Home", icon: Home },
  { id: "dashboard", label: "My CVs", icon: FileText },
  { id: "method-select", label: "Create", icon: Plus, isCreate: true },
  { id: "template-gallery", label: "Templates", icon: LayoutTemplate },
  { id: "settings", label: "Profile", icon: User },
];

export function MobileBottomNav() {
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);
  const [show, setShow] = useState(false);

  // Only show on mobile (viewport width < 768)
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setShow(mobile && !["question-wizard", "form-builder", "editor", "preparing"].includes(useAppStore.getState().view));
    };
    check();
    const onResize = () => check();
    const unsub = useAppStore.subscribe(() => check());
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      unsub();
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.nav
          initial={{ y: 60 }}
          animate={{ y: 0 }}
          exit={{ y: 60 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#2C3531]/95 backdrop-blur-xl border-t border-[#D1E8E2]/10"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          <div className="flex items-stretch justify-around h-14">
            {NAV_ITEMS.map((item) => {
              const isActive = view === item.id || (item.id === "dashboard" && view === "editor");
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id as any)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 flex-1 relative transition-colors",
                    isActive ? "text-[#FFCB9A]" : "text-[#9DB5B0] hover:text-[#D1E8E2]"
                  )}
                >
                  {item.isCreate ? (
                    <div className="w-8 h-8 -mt-3 rounded-xl bg-gradient-to-br from-[#116466] to-[#0d4d4f] flex items-center justify-center teal-glow-soft">
                      <Icon className="w-4 h-4 text-[#FFCB9A]" />
                    </div>
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                  <span className="text-[10px] font-medium">{item.label}</span>
                  {isActive && !item.isCreate && (
                    <motion.div
                      layoutId="mobile-nav-indicator"
                      className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-[#FFCB9A]"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
