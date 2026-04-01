import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/crypto";

type InitialLeadQuestion = {
  id: string;
  question: string;
};

function parseInitialLeadQuestions(value: unknown): InitialLeadQuestion[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const id = "id" in item && typeof item.id === "string" ? item.id.trim() : "";
      const question = "question" in item && typeof item.question === "string" ? item.question.trim() : "";
      if (!id || !question) return null;
      return { id, question };
    })
    .filter((item): item is InitialLeadQuestion => Boolean(item))
    .slice(0, 6);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminId = session.user.id;
  const data = await req.json();
  const initialLeadQuestions = parseInitialLeadQuestions(data.initialLeadQuestions);
  if (initialLeadQuestions.length > 0 && (initialLeadQuestions.length < 5 || initialLeadQuestions.length > 6)) {
    return NextResponse.json({ error: "Initial lead questions must be between 5 and 6 items" }, { status: 400 });
  }

  try {
    // Upsert admin settings with encrypted sensitive fields
    const settings = await prisma.adminSettings.upsert({
      where: { adminId },
      update: {
        whatsappToken: data.whatsappToken ? encrypt(data.whatsappToken) : undefined,
        whatsappPhoneNumberId: data.whatsappPhoneId || null,
        whatsappWebhookSecret: data.whatsappWebhookSecret ? encrypt(data.whatsappWebhookSecret) : undefined,
        smtpHost: data.smtpHost || null,
        smtpPort: data.smtpPort ? parseInt(data.smtpPort) : null,
        smtpUser: data.smtpUser || null,
        smtpPass: data.smtpPassword ? encrypt(data.smtpPassword) : undefined,
        emailFrom: data.senderEmail || null,
        initialLeadQuestions: initialLeadQuestions.length ? initialLeadQuestions : null,
      },
      create: {
        adminId,
        whatsappToken: data.whatsappToken ? encrypt(data.whatsappToken) : null,
        whatsappPhoneNumberId: data.whatsappPhoneId || null,
        whatsappWebhookSecret: data.whatsappWebhookSecret ? encrypt(data.whatsappWebhookSecret) : null,
        smtpHost: data.smtpHost || null,
        smtpPort: data.smtpPort ? parseInt(data.smtpPort) : null,
        smtpUser: data.smtpUser || null,
        smtpPass: data.smtpPassword ? encrypt(data.smtpPassword) : null,
        emailFrom: data.senderEmail || null,
        initialLeadQuestions: initialLeadQuestions.length ? initialLeadQuestions : null,
      },
    });

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Settings save error:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
