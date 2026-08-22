import { NextRequest, NextResponse } from "next/server";
import { aiChat } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobTitle, description, type } = body;

    if (!description) {
      return NextResponse.json(
        { error: "description is required" },
        { status: 400 }
      );
    }

    const systemPrompt =
      "You are an expert resume writer who transforms informal job descriptions into polished, professional bullet points. Each bullet starts with a strong action verb (Developed, Led, Implemented, Optimized, Collaborated, etc.) and is 12-22 words. Output 3-5 bullets, one per line, no numbering, no markdown symbols, no extra commentary.";

    const userPrompt = `Transform this into professional CV bullet points:
- Job title: ${jobTitle || "professional"}
- Description: "${description}"
- Type: ${type || "responsibilities"}

Return 3-5 polished bullet points, one per line.`;

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
    const fallback = localFallback(jobTitle, description);
    return NextResponse.json({ bullets: fallback });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

function localFallback(jobTitle: string, desc: string): string[] {
  const title = jobTitle || "professional";
  const d = desc.toLowerCase();
  const bullets: string[] = [];
  if (/build|develop|creat|implement/.test(d)) {
    bullets.push(`Developed and maintained ${title} deliverables to improve overall quality and consistency.`);
  }
  if (/team|collaborat|work with/.test(d)) {
    bullets.push(`Collaborated with cross-functional teams to deliver projects on time and within scope.`);
  }
  if (/improv|optimi|enhanc/.test(d)) {
    bullets.push(`Optimized key processes resulting in measurable improvements in performance and user experience.`);
  }
  if (/lead|manag|supervis/.test(d)) {
    bullets.push(`Led initiatives and mentored peers to foster a culture of continuous improvement.`);
  }
  bullets.push(`Contributed to documentation, code reviews, and knowledge sharing across the team.`);
  return bullets.slice(0, 4);
}
