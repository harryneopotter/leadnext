import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { ArrowLeft, Users, Plus } from "lucide-react";

export default async function ClientsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const user = session.user;

  // Only SUPER_ADMIN can access
  if (user.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

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
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Link href="/dashboard" style={{ color: "var(--text-muted)" }}>
              <ArrowLeft size={18} />
            </Link>
            <h1 style={{ fontSize: "0.9375rem", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>
              All Clients
            </h1>
          </div>
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
            Add Client
          </button>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: "1.5rem" }}>
          <div className="card" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                { name: "Acme Corp", email: "contact@acme.com", leads: 24, admin: "Admin User" },
                { name: "TechStart Inc", email: "info@techstart.io", leads: 18, admin: "Sales Team Lead" },
                { name: "Global Solutions", email: "hello@global.com", leads: 32, admin: "Admin User" },
                { name: "Local Business", email: "owner@local.biz", leads: 8, admin: "Support Admin" },
              ].map((client, i) => (
                <Link 
                  key={i} 
                  href={`/clients/${i + 1}`}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.75rem",
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    background: "var(--surface-low)",
                    textDecoration: "none",
                    color: "inherit",
                    transition: "background 0.15s",
                  }}
                >
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "50%",
                    background: "linear-gradient(135deg, #1e293b, #334155)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.875rem", fontWeight: "700", color: "#3b82f6",
                  }}>
                    {client.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.9375rem", fontWeight: "600", color: "var(--text-primary)" }}>
                      {client.name}
                    </div>
                    <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>{client.email}</div>
                  </div>
                  <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)", textAlign: "right" }}>
                    <div>{client.leads} leads</div>
                    <div style={{ fontSize: "0.75rem" }}>via {client.admin}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
