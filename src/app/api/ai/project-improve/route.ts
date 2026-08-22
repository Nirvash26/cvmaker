import { NextRequest, NextResponse } from "next/server";
import { aiChat } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectName, description, technologies } = body;

    if (!description) {
      return NextResponse.json(
        { error: "description is required" },
        { status: 400 }
      );
    }

    const systemPrompt =
      "You are an expert technical writer who improves project descriptions for resumes. Transform vague or casual descriptions into clear, professional, impact-focused explanations. Keep the description to 1-2 sentences (max 35 words). Do NOT invent metrics, numbers, or achievements the user did not provide. Output ONLY the improved description, no markdown, no extra commentary.";

    const userPrompt = `Improve this project description for a CV:
- Project name: ${projectName || "the project"}
- Current description: "${description}"
- Technologies: ${technologies || "various"}

Rewrite as a clear, professional 1-2 sentence description that explains what the project does and its value. Output ONLY the rewritten description.`;

    const aiResult = await aiChat(systemPrompt, userPrompt);

    if (aiResult) {
      const cleaned = aiResult.replace(/^["']|["']$/g, "").trim();
      if (cleaned.length > 10) {
        return NextResponse.json({ description: cleaned });
      }
    }

    // Fallback
    const fallback = localFallback(projectName, description);
    return NextResponse.json({ description: fallback });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

function localFallback(name: string, desc: string): string {
  const projectName = name || "the project";
  const cleanDesc = (desc || "").trim().toLowerCase().replace(/[.!?]+$/, "");
  if (!cleanDesc) {
    return `Built ${projectName} to deliver value through clean implementation and a user-focused approach.`;
  }
  // Capitalize first letter
  const cap = cleanDesc.charAt(0).toUpperCase() + cleanDesc.slice(1);
  return `Developed ${projectName}, ${cap}. Designed to deliver practical value and a clean, maintainable implementation.`;
}
