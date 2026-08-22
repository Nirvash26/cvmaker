import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  TabStopType, TabStopPosition,
} from "docx";
import { CVData } from "./types";

export async function generateDOCX(cv: CVData): Promise<Blob> {
  const children: Paragraph[] = [];

  // Header
  children.push(new Paragraph({
    children: [new TextRun({ text: cv.personal.fullName || "Your Name", bold: true, size: 36 })],
    spacing: { after: 80 },
  }));
  if (cv.personal.title) {
    children.push(new Paragraph({
      children: [new TextRun({ text: cv.personal.title, size: 22, color: "116466" })],
      spacing: { after: 80 },
    }));
  }
  // Contact line
  const contactParts = [cv.personal.email, cv.personal.phone, cv.personal.location, cv.personal.website, cv.personal.linkedin].filter(Boolean);
  if (contactParts.length > 0) {
    children.push(new Paragraph({
      children: [new TextRun({ text: contactParts.join("  ·  "), size: 18, color: "888888" })],
      spacing: { after: 240 },
      border: { bottom: { color: "116466", size: 6, space: 6, style: "single" as any } },
    }));
  }

  // Summary
  if (cv.summary) {
    children.push(new Paragraph({
      children: [new TextRun({ text: "SUMMARY", bold: true, size: 22, color: "116466" })],
      spacing: { before: 240, after: 80 },
    }));
    children.push(new Paragraph({
      children: [new TextRun({ text: cv.summary, size: 20 })],
      spacing: { after: 120 },
    }));
  }

  // Experience
  if (cv.experience.length > 0) {
    children.push(new Paragraph({
      children: [new TextRun({ text: "EXPERIENCE", bold: true, size: 22, color: "116466" })],
      spacing: { before: 240, after: 80 },
    }));
    for (const e of cv.experience) {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: e.jobTitle || "", bold: true, size: 22 }),
          new TextRun({ text: `\t${e.startDate || ""}${e.endDate ? ` — ${e.endDate}` : ""}`, size: 18, color: "888888" }),
        ],
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        spacing: { after: 40 },
      }));
      children.push(new Paragraph({
        children: [new TextRun({ text: `${e.company || ""}${e.location ? ` · ${e.location}` : ""}`, italics: true, size: 20, color: "116466" })],
        spacing: { after: 60 },
      }));
      if (e.responsibilities) {
        for (const line of e.responsibilities.split("\n").filter(Boolean)) {
          children.push(new Paragraph({
            children: [new TextRun({ text: `• ${line}`, size: 20 })],
            spacing: { after: 40 },
            indent: { left: 200 },
          }));
        }
      }
      if (e.achievements) {
        for (const line of e.achievements.split("\n").filter(Boolean)) {
          children.push(new Paragraph({
            children: [new TextRun({ text: `★ ${line}`, size: 20 })],
            spacing: { after: 40 },
            indent: { left: 200 },
          }));
        }
      }
      children.push(new Paragraph({ children: [new TextRun({ text: "" })], spacing: { after: 80 } }));
    }
  }

  // Education
  if (cv.education.length > 0) {
    children.push(new Paragraph({
      children: [new TextRun({ text: "EDUCATION", bold: true, size: 22, color: "116466" })],
      spacing: { before: 240, after: 80 },
    }));
    for (const e of cv.education) {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: e.degree || "", bold: true, size: 20 }),
          new TextRun({ text: `\t${e.startDate || ""}${e.endDate ? ` — ${e.endDate}` : ""}`, size: 18, color: "888888" }),
        ],
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        spacing: { after: 40 },
      }));
      children.push(new Paragraph({
        children: [new TextRun({ text: `${e.institution || ""}${e.field ? ` · ${e.field}` : ""}`, italics: true, size: 20, color: "116466" })],
        spacing: { after: 80 },
      }));
    }
  }

  // Skills
  if (cv.skills.length > 0) {
    children.push(new Paragraph({
      children: [new TextRun({ text: "SKILLS", bold: true, size: 22, color: "116466" })],
      spacing: { before: 240, after: 80 },
    }));
    children.push(new Paragraph({
      children: [new TextRun({ text: cv.skills.join("  ·  "), size: 20 })],
      spacing: { after: 120 },
    }));
  }

  // Projects
  if (cv.projects.length > 0) {
    children.push(new Paragraph({
      children: [new TextRun({ text: "PROJECTS", bold: true, size: 22, color: "116466" })],
      spacing: { before: 240, after: 80 },
    }));
    for (const p of cv.projects) {
      children.push(new Paragraph({
        children: [new TextRun({ text: p.name || "", bold: true, size: 20 })],
        spacing: { after: 40 },
      }));
      if (p.description) {
        children.push(new Paragraph({
          children: [new TextRun({ text: p.description, size: 20 })],
          spacing: { after: 40 },
        }));
      }
      if (p.technologies) {
        children.push(new Paragraph({
          children: [new TextRun({ text: `Tech: ${p.technologies}`, size: 18, color: "888888" })],
          spacing: { after: 80 },
        }));
      }
    }
  }

  // Certifications
  if (cv.certifications.length > 0) {
    children.push(new Paragraph({
      children: [new TextRun({ text: "CERTIFICATIONS", bold: true, size: 22, color: "116466" })],
      spacing: { before: 240, after: 80 },
    }));
    for (const c of cv.certifications) {
      children.push(new Paragraph({
        children: [new TextRun({ text: `${c.name}`, bold: true, size: 20 }), new TextRun({ text: ` — ${c.issuer}${c.date ? `, ${c.date}` : ""}`, size: 18, color: "888888" })],
        spacing: { after: 60 },
      }));
    }
  }

  // Languages
  if (cv.languages.length > 0) {
    children.push(new Paragraph({
      children: [new TextRun({ text: "LANGUAGES", bold: true, size: 22, color: "116466" })],
      spacing: { before: 240, after: 80 },
    }));
    children.push(new Paragraph({
      children: [new TextRun({ text: cv.languages.map((l) => `${l.name} (${l.proficiency})`).join("  ·  "), size: 20 })],
      spacing: { after: 120 },
    }));
  }

  const doc = new Document({
    sections: [{ children }],
    styles: {
      default: {
        document: { run: { font: "Calibri", size: 20 } },
      },
    },
  });

  return await Packer.toBlob(doc);
}
