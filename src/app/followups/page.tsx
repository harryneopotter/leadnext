import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { ArrowLeft, Calendar } from "lucide-react";

export default async function FollowupsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const user = session.user;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--surface)" }}>
      <Sidebar
        userRole={user.role}
        userName={user.name ?? undefined}
        userEmail={user.email ?? undefined}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Header */}
        <header style={{
          background: "var(--surface-card)",
          borderBottom: "1px solid var(--outline-ghost)",
          padding: "0 1.5rem",
          height: "56px",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}>
          <Link href="/dashboard" style={{ color: "var(--text-muted)" }}>
            <ArrowLeft size={18} />
          </Link>
          <h1 style={{ fontSize: "0.9375rem", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>
            Follow-ups
          </h1>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: "1.5rem" }}>
          <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
            <Calendar size={48} style={{ color: "var(--emerald)", marginBottom: "1rem" }} />
            <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
              Follow-up management coming soon.
            </p>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              Schedule, track, and manage all your follow-up tasks in one place.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
