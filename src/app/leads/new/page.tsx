import { auth } from "@/auth";
import { redirect } from "next/navigation";
import NewLeadClient from "./new-lead-client";

export default async function NewLeadPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const user = session.user;

  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return <NewLeadClient user={user} />;
}
