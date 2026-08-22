"use client";

import { Hero } from "./Hero";
import { CreationOptions } from "./CreationOptions";
import { HowItWorks } from "./HowItWorks";
import { TemplatePreview } from "./TemplatePreview";
import { WhyNirvash } from "./WhyNirvash";
import { FinalCTA } from "./FinalCTA";

export function LandingPage() {
  return (
    <div className="relative">
      <Hero />
      <CreationOptions />
      <HowItWorks />
      <TemplatePreview />
      <WhyNirvash />
      <FinalCTA />
    </div>
  );
}
