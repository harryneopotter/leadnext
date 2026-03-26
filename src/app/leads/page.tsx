import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { ArrowLeft, Plus } from "lucide-react";

export default async function LeadsPage() {
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
          justifyContent: "space-between",
          gap: "1rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Link href="/dashboard" style={{ color: "var(--text-muted)" }}>
              <ArrowLeft size={18} />
            </Link>
            <h1 style={{ fontSize: "0.9375rem", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>
              All Leads
            </h1>
          </div>
          <Link href="/leads/new">
            <button style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.5rem 1rem",
              background: "var(--emerald)",
              color: "white",
              border: "none",
              borderRadius: "0.375rem",
              fontSize: "0.8125rem",
              fontWeight: "600",
              cursor: "pointer",
            }}>
              <Plus size={16} />
              Add Lead
            </button>
          </Link>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: "1.5rem" }}>
          <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
            <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
              Lead management interface coming soon.
            </p>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              This page will show all leads with filters, search, and bulk actions.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
