import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { ArrowLeft, Shield, Users, Plus } from "lucide-react";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const user = session.user;

  // Only SUPER_ADMIN and ADMIN can access
  if (user.role !== "SUPER_ADMIN" && user.role !== "ADMIN") {
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
              {user.role === "SUPER_ADMIN" ? "System Admin" : "Admin Panel"}
            </h1>
          </div>
          {user.role === "SUPER_ADMIN" && (
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
              Add Admin
            </button>
          )}
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: "1.5rem" }}>
          {user.role === "SUPER_ADMIN" ? (
            <SuperAdminContent />
          ) : (
            <AdminContent />
          )}
        </main>
      </div>
    </div>
  );
}

function SuperAdminContent() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
      <div className="card" style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
          <Shield size={24} style={{ color: "var(--emerald)" }} />
          <h2 style={{ fontSize: "1rem", fontWeight: "700" }}>Admins</h2>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
          Manage admin users and their permissions.
        </p>
      </div>

      <div className="card" style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
          <Users size={24} style={{ color: "var(--emerald)" }} />
          <h2 style={{ fontSize: "1rem", fontWeight: "700" }}>Clients</h2>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
          View and manage client accounts.
        </p>
      </div>
    </div>
  );
}

function AdminContent() {
  return (
    <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
      <Users size={48} style={{ color: "var(--emerald)", marginBottom: "1rem" }} />
      <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
        Manage your clients and their leads.
      </p>
      <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
        Client management features coming soon.
      </p>
    </div>
  );
}
