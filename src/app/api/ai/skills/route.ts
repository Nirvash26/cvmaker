import { NextRequest, NextResponse } from "next/server";
import { aiChat } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobTitle, experience, education } = body;

    if (!jobTitle) {
      return NextResponse.json(
        { error: "jobTitle is required" },
        { status: 400 }
      );
    }

    const systemPrompt =
      "You are an expert technical recruiter. Suggest 8-12 relevant skills for the user's profession. Output as a comma-separated list of skill names only, no numbering, no extra commentary, no markdown.";

    const userPrompt = `Suggest 10 relevant skills for someone who is:
- Job title: ${jobTitle}
- Experience: ${experience || "any"}
- Education: ${education || "any"}

Return ONLY a comma-separated list of skill names (e.g. "JavaScript, React, TypeScript, ...").`;

    const aiResult = await aiChat(systemPrompt, userPrompt);

    if (aiResult) {
      const skills = aiResult
        .split(/[,\n]/)
        .map((s) => s.trim().replace(/^[•\-*\d.\s]+/, ""))
        .filter((s) => s.length > 1 && s.length < 40)
        .slice(0, 12);
      if (skills.length > 0) {
        return NextResponse.json({ skills });
      }
    }

    const fallback = localFallback(jobTitle);
    return NextResponse.json({ skills: fallback });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

function localFallback(jobTitle: string): string[] {
  const t = jobTitle.toLowerCase();
  if (/engineer|developer|software|web|frontend|backend|full ?stack/.test(t)) {
    return ["JavaScript", "TypeScript", "React", "Node.js", "Git", "SQL", "REST APIs", "Testing", "Docker", "CI/CD"];
  }
  if (/design|ui|ux|graphic/.test(t)) {
    return ["Figma", "Adobe Illustrator", "Photoshop", "Typography", "Wireframing", "Prototyping", "Design Systems", "User Research", "Sketch", "Motion Design"];
  }
  if (/market/.test(t)) {
    return ["SEO", "Content Strategy", "Google Analytics", "Copywriting", "Social Media", "Email Marketing", "PPC", "Brand Management", "CRM", "A/B Testing"];
  }
  if (/data|analyst|scientist/.test(t)) {
    return ["Python", "SQL", "Pandas", "NumPy", "Machine Learning", "Tableau", "Power BI", "Statistics", "Excel", "Data Visualization"];
  }
  if (/product|manager/.test(t)) {
    return ["Roadmapping", "Agile", "Scrum", "Stakeholder Management", "User Stories", "JIRA", "Analytics", "A/B Testing", "Prioritization", "Strategy"];
  }
  return ["Communication", "Leadership", "Problem Solving", "Teamwork", "Project Management", "Time Management", "Critical Thinking", "Adaptability", "Collaboration", "Organization"];
}
