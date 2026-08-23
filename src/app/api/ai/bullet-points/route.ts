import { NextRequest, NextResponse } from "next/server";
import { aiChat } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobTitle, companyType, responsibilities, skills } = body;

    if (!jobTitle && !responsibilities) {
      return NextResponse.json(
        { error: "jobTitle or responsibilities is required" },
        { status: 400 }
      );
    }

    const systemPrompt =
      "You are an expert resume writer who transforms basic job information into polished, achievement-oriented CV bullet points. Each bullet starts with a strong action verb (Developed, Led, Implemented, Optimized, Collaborated, Designed, Streamlined, etc.) and is 12-22 words. IMPORTANT: Never invent fake metrics, percentages, or numbers. Only include measurable numbers if the user provided them in their input. Output 3-5 bullets, one per line, no numbering, no markdown symbols, no extra commentary.";

    const userPrompt = `Generate 3-5 professional CV bullet points for:
- Job title: ${jobTitle || "professional"}
- Company type: ${companyType || "any"}
- Main responsibilities: ${responsibilities || "general duties"}
- Important skills: ${skills || "various"}

Return 3-5 polished bullet points, one per line. Do NOT invent metrics that the user did not provide.`;

    const aiResult = await aiChat(systemPrompt, userPrompt);

    if (aiResult) {
      const bullets = aiResult
        .split("\n")
        .map((line) => line.replace(/^[•\-*\d.\s]+/, "").trim())
        .filter((line) => line.length > 10)
        .slice(0, 5);
      if (bullets.length > 0) {
        return NextResponse.json({ bullets });
      }
    }

    // Fallback
    const fallback = localFallback(jobTitle, responsibilities, skills);
    return NextResponse.json({ bullets: fallback });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

function localFallback(jobTitle: string, desc: string, skills: string): string[] {
  const title = jobTitle || "professional";
  const d = (desc || "").toLowerCase();
  const skillList = skills ? skills.split(/[,\s]+/).filter(Boolean).slice(0, 3) : [];
  const skillText = skillList.length > 0 ? ` leveraging ${skillList.join(", ")}` : "";

  const bullets: string[] = [];
  bullets.push(`Delivered core ${title} responsibilities${skillText} to support key business objectives.`);
  bullets.push(`Collaborated with cross-functional teams to ensure consistent and high-quality outcomes.`);
  bullets.push(`Maintained and improved existing systems, identifying opportunities for optimization and clarity.`);
  bullets.push(`Contributed to documentation, knowledge sharing, and team best practices.`);
  return bullets.slice(0, 4);
}
