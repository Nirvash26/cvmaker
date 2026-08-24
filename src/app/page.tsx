"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LandingPage } from "@/components/landing/LandingPage";
import { MethodSelect } from "@/components/method/MethodSelect";
import { QuestionWizard } from "@/components/wizard/QuestionWizard";
import { FormBuilder } from "@/components/form/FormBuilder";
import { TemplateGallery } from "@/components/templates/TemplateGallery";
import { CVEditor } from "@/components/editor/CVEditor";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { Settings } from "@/components/settings/Settings";
import { SuccessScreen } from "@/components/success/SuccessScreen";
import { PreparingTransition } from "@/components/templates/PreparingTransition";
import { ThemesPage } from "@/components/themes/ThemesPage";
import { CommandPalette } from "@/components/cmdk/CommandPalette";
import { MobileBottomNav } from "@/components/mobile/MobileBottomNav";
import { AnimatedBackground } from "@/components/background/AnimatedBackground";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const view = useAppStore((s) => s.view);

  // Hide navbar on editor, wizard, and preparing screens (those have their own chrome)
  const showNavbar = !["question-wizard", "form-builder", "editor", "preparing"].includes(view);
  const showFooter = ["landing", "dashboard", "settings", "success", "themes"].includes(view);
  // Hide footer on template gallery and method select (more app-like)
  const showFooterFinal = showFooter && !["template-gallery", "method-select"].includes(view);

  // Warn before unload if CV is being edited
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (["question-wizard", "form-builder", "editor", "preparing"].includes(useAppStore.getState().view)) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative">
      {/* Cache-busting auto-reload: if this version marker doesn't match, force reload */}
      <script dangerouslySetInnerHTML={{ __html: `
        if (window.location.search.indexOf('v=3') === -1 && !window.__nv3reloading) {
          window.__nv3reloading = true;
          window.location.href = window.location.pathname + '?v=3' + window.location.hash;
        }
      `}} />

      {/* Premium animated background — aurora orbs + floating particles + grid */}
      <AnimatedBackground />

      {showNavbar && <Navbar />}

      <main className="flex-1 pb-16 md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {view === "landing" && <LandingPage />}
            {view === "method-select" && <MethodSelect />}
            {view === "question-wizard" && <QuestionWizard />}
            {view === "form-builder" && <FormBuilder />}
            {view === "template-gallery" && <TemplateGallery />}
            {view === "themes" && <ThemesPage />}
            {view === "preparing" && <PreparingTransition />}
            {view === "editor" && <CVEditor />}
            {view === "dashboard" && <Dashboard />}
            {view === "settings" && <Settings />}
            {view === "success" && <SuccessScreen />}
          </motion.div>
        </AnimatePresence>
      </main>

      {showFooterFinal && <Footer />}

      {/* Global: Command Palette (Ctrl+K) */}
      <CommandPalette />

      {/* Mobile bottom navigation */}
      <MobileBottomNav />
    </div>
  );
}
