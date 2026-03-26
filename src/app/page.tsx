import Link from "next/link";
import { Layers, GitBranch, Zap, ArrowRight } from "lucide-react";

const features = [
  {
    icon: <Layers size={22} />,
    title: "All Your Leads in One Place",
    description:
      "Capture leads from WhatsApp, forms, or manual entry. View, filter, and manage your entire pipeline from a single dashboard.",
    color: "#3b82f6",
  },
  {
    icon: <GitBranch size={22} />,
    title: "Track Lead Progress",
    description:
      "Move leads through stages: New → Interested → Hot → Converted. Never lose track of a potential customer again.",
    color: "#10b981",
  },
  {
    icon: <Zap size={22} />,
    title: "Automated Follow-ups",
    description:
      "Schedule reminders and send WhatsApp/email follow-ups automatically. Stay on top of every conversation.",
    color: "#f59e0b",
  },
];

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--sidebar-bg)", color: "var(--text-on-dark)" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "4rem 1.5rem" }}>

        {/* Hero */}
        <header style={{ marginBottom: "4rem" }}>
          <p style={{
            fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.5em",
            color: "var(--emerald)", fontWeight: "700", marginBottom: "1.25rem"
          }}>
            LeadCRM
          </p>
          <h1 style={{
            fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: "800", lineHeight: 1.15,
            letterSpacing: "-0.03em", color: "#f8fafc",
            maxWidth: "720px", marginBottom: "1.25rem"
          }}>
            Manage Your Leads. Close More Deals.
          </h1>
          <p style={{
            fontSize: "1rem", color: "#94a3b8", lineHeight: 1.7, maxWidth: "620px",
            marginBottom: "2rem"
          }}>
            A complete CRM solution with WhatsApp integration. Track leads, 
            schedule follow-ups, and convert conversations into customers.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link href="/login">
              <button className="btn-emerald" style={{ padding: "0.75rem 1.5rem", fontSize: "0.875rem" }}>
                Sign In to Dashboard <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </header>

        {/* Feature cards */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "4rem" }}>
          {features.map((f) => (
            <article key={f.title} style={{
              background: "#1e293b",
              borderRadius: "0.5rem",
              padding: "1.5rem",
              border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "0.5rem",
                background: f.color + "1a",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: f.color, marginBottom: "1rem",
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: "0.9375rem", fontWeight: "700", color: "#f8fafc", marginBottom: "0.5rem" }}>
                {f.title}
              </h3>
              <p style={{ fontSize: "0.8125rem", color: "#94a3b8", lineHeight: 1.6 }}>
                {f.description}
              </p>
            </article>
          ))}
        </section>

        {/* Overview */}
        <section style={{
          background: "#1e293b",
          borderRadius: "0.5rem",
          padding: "2rem",
          border: "1px solid rgba(255,255,255,0.06)",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "center"
        }}>
          <div>
            <p style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.4em", color: "var(--emerald)", fontWeight: "700", marginBottom: "0.75rem" }}>
              How It Works
            </p>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#f8fafc", lineHeight: 1.3, letterSpacing: "-0.02em" }}>
              Leads come in from WhatsApp. You manage them here.
            </h2>
          </div>
          <p style={{ fontSize: "0.875rem", color: "#94a3b8", lineHeight: 1.75 }}>
            Connect your WhatsApp Business account and incoming messages automatically 
            become leads in your dashboard. Add notes, set follow-up reminders, 
            and track every conversation until you close the deal.
          </p>
        </section>

        {/* Footer */}
        <footer style={{ marginTop: "3rem", textAlign: "center" }}>
          <p style={{ fontSize: "0.6875rem", color: "#475569" }}>
            © 2025 LeadCRM · Precise Ledger Architecture
          </p>
        </footer>
      </div>
    </div>
  );
}
