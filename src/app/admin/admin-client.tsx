"use client";

import { useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { ArrowLeft, Shield, Users, Plus, MessageCircle, Mail, Facebook, Save, Loader2 } from "lucide-react";

interface AdminPageProps {
  user: any;
  settings: any;
}

export function AdminPageClient({ user, settings }: AdminPageProps) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    whatsappToken: settings?.whatsappToken || "",
    whatsappPhoneId: settings?.whatsappPhoneNumberId || "",
    whatsappNumber: settings?.whatsappNumber || "", // Actual phone number like 919876543210
    whatsappWebhookSecret: settings?.whatsappWebhookSecret || "",
    smtpHost: settings?.smtpHost || "",
    smtpPort: settings?.smtpPort || "587",
    smtpUser: settings?.smtpUser || "",
    smtpPassword: settings?.smtpPass || "",
    senderEmail: settings?.emailFrom || "",
    senderName: settings?.senderName || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        alert("Settings saved successfully");
      } else {
        alert("Failed to save settings");
      }
    } catch (error) {
      alert("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--surface)" }}>
      {/* ── Sidebar ── */}
      <Sidebar
        userRole={user.role}
        userName={user.name ?? undefined}
        userEmail={user.email ?? undefined}
      />

      {/* ── Main area ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, marginLeft: "240px" }}>
        {/* Top bar */}
        <header style={{
          background: "var(--surface-card)",
          borderBottom: "1px solid var(--outline-ghost)",
          padding: "0 1.5rem",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}>
          <div>
            <h1 style={{ fontSize: "0.9375rem", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>
              Admin Settings
            </h1>
            <p style={{ fontSize: "0.6875rem", color: "var(--text-muted)", margin: 0 }}>
              Configure your integrations and preferences
            </p>
          </div>
          <Link href="/dashboard">
            <button className="btn-outline" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <ArrowLeft size={16} />
              Back to Dashboard
            </button>
          </Link>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* WhatsApp Business API Settings */}
            <section className="card" style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <MessageCircle size={20} style={{ color: "var(--emerald)" }} />
                <h2 style={{ fontSize: "0.875rem", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>
                  WhatsApp Business API
                </h2>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label className="field-label">Access Token</label>
                  <input
                    type="password"
                    value={formData.whatsappToken}
                    onChange={(e) => setFormData({ ...formData, whatsappToken: e.target.value })}
                    className="field-input"
                    placeholder="EAAZ..."
                  />
                </div>
                <div>
                  <label className="field-label">Phone Number ID</label>
                  <input
                    type="text"
                    value={formData.whatsappPhoneId}
                    onChange={(e) => setFormData({ ...formData, whatsappPhoneId: e.target.value })}
                    className="field-input"
                    placeholder="1234567890123456"
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label className="field-label">Business Phone Number</label>
                  <input
                    type="text"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    className="field-input"
                    placeholder="919876543210"
                  />
                </div>
                <div>
                  <label className="field-label">Webhook Secret</label>
                  <input
                    type="password"
                    value={formData.whatsappWebhookSecret}
                    onChange={(e) => setFormData({ ...formData, whatsappWebhookSecret: e.target.value })}
                    className="field-input"
                    placeholder="Optional webhook verify token"
                  />
                </div>
              </div>

              <div style={{ 
                padding: "1rem", 
                background: "var(--surface-low)", 
                borderRadius: "0.5rem",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                lineHeight: 1.6
              }}>
                <strong>Webhook URLs:</strong><br />
                • WhatsApp: <code style={{ background: "var(--surface)", padding: "0.125rem 0.25rem", borderRadius: "0.25rem" }}>{`https://your-domain.com/api/webhooks/whatsapp/${user.id}`}</code><br />
                • Facebook: <code style={{ background: "var(--surface)", padding: "0.125rem 0.25rem", borderRadius: "0.25rem" }}>{`https://your-domain.com/api/webhooks/facebook/${user.id}`}</code><br />
                • Lead Ingest: <code style={{ background: "var(--surface)", padding: "0.125rem 0.25rem", borderRadius: "0.25rem" }}>{`https://your-domain.com/api/leads/ingest/${user.id}`}</code>
              </div>
            </section>

            {/* SMTP Email Settings */}
            <section className="card" style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <Mail size={20} style={{ color: "var(--emerald)" }} />
                <h2 style={{ fontSize: "0.875rem", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>
                  SMTP Email Settings
                </h2>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label className="field-label">SMTP Host</label>
                  <input
                    type="text"
                    value={formData.smtpHost}
                    onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
                    className="field-input"
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <label className="field-label">Port</label>
                  <input
                    type="text"
                    value={formData.smtpPort}
                    onChange={(e) => setFormData({ ...formData, smtpPort: e.target.value })}
                    className="field-input"
                    placeholder="587"
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label className="field-label">Username</label>
                  <input
                    type="text"
                    value={formData.smtpUser}
                    onChange={(e) => setFormData({ ...formData, smtpUser: e.target.value })}
                    className="field-input"
                    placeholder="your-email@gmail.com"
                  />
                </div>
                <div>
                  <label className="field-label">Password</label>
                  <input
                    type="password"
                    value={formData.smtpPassword}
                    onChange={(e) => setFormData({ ...formData, smtpPassword: e.target.value })}
                    className="field-input"
                    placeholder="App password"
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
                <div>
                  <label className="field-label">Sender Email</label>
                  <input
                    type="text"
                    value={formData.senderEmail}
                    onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                    className="field-input"
                    placeholder="noreply@yourdomain.com"
                  />
                </div>
                <div>
                  <label className="field-label">Sender Name</label>
                  <input
                    type="text"
                    value={formData.senderName}
                    onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                    className="field-input"
                    placeholder="Your Company"
                  />
                </div>
              </div>
            </section>

            {/* Facebook Lead Ads */}
            <section className="card" style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <Facebook size={20} style={{ color: "var(--emerald)" }} />
                <h2 style={{ fontSize: "0.875rem", fontWeight: "700", color: "var(--text-primary)", margin: 0 }}>
                  Facebook Lead Ads Integration
                </h2>
              </div>

              <div style={{ 
                padding: "1rem", 
                background: "var(--surface-low)", 
                borderRadius: "0.5rem",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                lineHeight: 1.6
              }}>
                <strong>Setup Instructions:</strong><br />
                1. Go to Facebook Business Settings → Webhooks<br />
                2. Add webhook URL: <code style={{ background: "var(--surface)", padding: "0.125rem 0.25rem", borderRadius: "0.25rem" }}>{`https://your-domain.com/api/webhooks/facebook/${user.id}`}</code><br />
                3. Subscribe to "leadgen" events<br />
                4. Test with a test lead from your Facebook Page
              </div>
            </section>

            {/* Save Button */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                className="btn-emerald"
                disabled={saving}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", minWidth: "120px", justifyContent: "center" }}
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
