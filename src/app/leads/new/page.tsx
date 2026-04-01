import { auth } from "@/auth";
import { redirect } from "next/navigation";
import NewLeadClient from "./new-lead-client";
import { prisma } from "@/lib/prisma";

export default async function NewLeadPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const user = session.user;

  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const settings = await prisma.adminSettings.findUnique({
    where: { adminId: user.id },
    select: { initialLeadQuestions: true },
  });

  const initialLeadQuestions = Array.isArray(settings?.initialLeadQuestions)
    ? settings.initialLeadQuestions
        .map((item) => {
          if (!item || typeof item !== "object") return null;
          const id = "id" in item && typeof item.id === "string" ? item.id : null;
          const question = "question" in item && typeof item.question === "string" ? item.question : null;
          if (!id || !question) return null;
          return { id, question };
        })
        .filter((item): item is { id: string; question: string } => Boolean(item))
        .slice(0, 6)
    : [];

  return <NewLeadClient user={user} initialLeadQuestions={initialLeadQuestions} />;
}
