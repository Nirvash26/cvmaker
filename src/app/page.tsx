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

export default function Home() {
  const view = useAppStore((s) => s.view);

  // Hide navbar on editor, wizard, and preparing screens (those have their own chrome)
  const showNavbar = !["question-wizard", "form-builder", "editor", "preparing"].includes(view);
  const showFooter = ["landing", "dashboard", "settings", "success"].includes(view);

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
    <div className="min-h-screen flex flex-col bg-[#2C3531]">
      {showNavbar && <Navbar />}
      <main className="flex-1">
        {view === "landing" && <LandingPage />}
        {view === "method-select" && <MethodSelect />}
        {view === "question-wizard" && <QuestionWizard />}
        {view === "form-builder" && <FormBuilder />}
        {view === "template-gallery" && <TemplateGallery />}
        {view === "preparing" && <PreparingTransition />}
        {view === "editor" && <CVEditor />}
        {view === "dashboard" && <Dashboard />}
        {view === "settings" && <Settings />}
        {view === "success" && <SuccessScreen />}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
