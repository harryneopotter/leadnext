"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { ArrowLeft, Plus, Filter, Search, X, Users, Bell, Settings, UserPlus } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  city: string | null;
  status: string;
  source: string;
  createdAt: Date;
}

export function LeadsPageClient({ leads, user }: { leads: Lead[]; user: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  
  const statusFilter = searchParams.get("status") || "";
  const searchQuery = searchParams.get("q") || "";

  const filteredLeads = leads.filter((lead) => {
    const matchesStatus = !statusFilter || lead.status === statusFilter;
    const matchesSearch = !searchQuery || 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      (lead.email && lead.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (lead.city && lead.city.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/leads?${params.toString()}`);
  };

  const statusColors: Record<string, { bg: string; text: string }> = {
    NEW: { bg: "#dbeafe", text: "#1e40af" },
    HOT: { bg: "#fee2e2", text: "#991b1b" },
    CONVERTED: { bg: "#d1fae5", text: "#065f46" },
    INTERESTED: { bg: "#fef9c3", text: "#713f12" },
    FOLLOW_UP: { bg: "#ede9fe", text: "#5b21b6" },
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f6fafe" }}>
      {/* ── Sidebar ── */}
      <Sidebar
        userRole={user.role}
        userName={user.name ?? undefined}
        userEmail={user.email ?? undefined}
      />

      {/* ── Main area ── */}
      <div className="main-content" style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, marginLeft: "240px" }}>
        {/* Top bar */}
        <header style={{
          background: "rgba(246, 250, 254, 0.8)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          padding: "0 1.5rem",
          height: "80px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          position: "sticky",
          top: 0,
          zIndex: 40,
          boxShadow: "0 24px 48px rgba(23,28,31,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link href="/dashboard">
              <button style={{
                background: "none",
                border: "none",
                color: "#171c1f",
                cursor: "pointer",
                padding: "0.5rem",
                borderRadius: "0.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "600",
              }}>
                <ArrowLeft size={20} />
                Back
              </button>
            </Link>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "900", color: "#171c1f", margin: 0 }}>
              Lead Management
            </h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", background: "#f0f4f8", borderRadius: "9999px", padding: "0.5rem 1rem", gap: "0.5rem" }}>
              <Search size={16} style={{ color: "#64748b" }} />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => updateFilter("q", e.target.value)}
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: "0.875rem",
                  width: "200px",
                }}
              />
            </div>
            <button style={{
              background: "none",
              border: "none",
              color: "#454d55",
              cursor: "pointer",
              padding: "0.5rem",
              borderRadius: "50%",
              transition: "all 0.2s",
            }}>
              <Bell size={20} />
            </button>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #10b981, #059669)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "0.75rem",
              fontWeight: "700",
              border: "2px solid #10b981",
            }}>
              {user.name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="main-content" style={{ 
          flex: 1, 
          padding: "2rem 1.5rem", 
          display: "flex", 
          flexDirection: "column", 
          gap: "2rem",
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          {/* Page Header */}
          <section>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "0.5rem 0.75rem",
              background: "rgba(16, 185, 129, 0.1)",
              color: "#059669",
              borderRadius: "9999px",
              fontSize: "0.75rem",
              fontWeight: "700",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "1rem"
            }}>
              Lead Pipeline
            </div>
            <h3 style={{ 
              fontSize: "2.5rem", 
              fontWeight: "800", 
              color: "#171c1f", 
              margin: "0 0 0.5rem",
              letterSpacing: "-0.025em"
            }}>
              All Leads
            </h3>
            <p style={{ 
              color: "#637381", 
              fontSize: "1.125rem", 
              maxWidth: "600px",
              lineHeight: 1.6
            }}>
              Manage and track your leads through the entire sales pipeline. Monitor status updates and follow-up activities.
            </p>
          </section>

          {/* Stats Bar */}
          <section style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            <div style={{
              background: "white",
              borderRadius: "0.75rem",
              padding: "1rem 1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              border: "1px solid rgba(0,0,0,0.02)",
            }}>
              <Users size={20} style={{ color: "#3b82f6" }} />
              <div>
                <p style={{ fontSize: "0.75rem", color: "#637381", margin: 0 }}>Total Leads</p>
                <p style={{ fontSize: "1.25rem", fontWeight: "700", color: "#171c1f", margin: 0 }}>{filteredLeads.length}</p>
              </div>
            </div>
            <div style={{
              background: "white",
              borderRadius: "0.75rem",
              padding: "1rem 1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              border: "1px solid rgba(0,0,0,0.02)",
            }}>
              <UserPlus size={20} style={{ color: "#10b981" }} />
              <div>
                <p style={{ fontSize: "0.75rem", color: "#637381", margin: 0 }}>New Today</p>
                <p style={{ fontSize: "1.25rem", fontWeight: "700", color: "#171c1f", margin: 0 }}>
                  {leads.filter(l => {
                    const today = new Date();
                    const leadDate = new Date(l.createdAt);
                    return leadDate.toDateString() === today.toDateString();
                  }).length}
                </p>
              </div>
            </div>
          </section>

          {/* Filters */}
          {showFilters && (
            <div style={{
              background: "white",
              borderRadius: "1rem",
              padding: "1.5rem",
              boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
              border: "1px solid rgba(0,0,0,0.02)",
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              flexWrap: "wrap",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1, minWidth: "200px" }}>
                <Search size={16} style={{ color: "#64748b" }} />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchQuery}
                  onChange={(e) => updateFilter("q", e.target.value)}
                  style={{
                    flex: 1,
                    background: "#f8fafc",
                    border: "none",
                    borderRadius: "0.5rem",
                    padding: "0.75rem 1rem",
                    fontSize: "0.875rem",
                  }}
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => updateFilter("status", e.target.value)}
                style={{
                  background: "#f8fafc",
                  border: "none",
                  borderRadius: "0.5rem",
                  padding: "0.75rem 1rem",
                  fontSize: "0.875rem",
                  minWidth: "150px",
                }}
              >
                <option value="">All Status</option>
                <option value="NEW">New</option>
                <option value="HOT">Hot</option>
                <option value="INTERESTED">Interested</option>
                <option value="FOLLOW_UP">Follow Up</option>
                <option value="CONVERTED">Converted</option>
              </select>
              {(statusFilter || searchQuery) && (
                <button
                  onClick={() => {
                    updateFilter("status", "");
                    updateFilter("q", "");
                  }}
                  style={{
                    background: "#ef4444",
                    color: "white",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <X size={16} />
                  Clear
                </button>
              )}
            </div>
          )}

          {/* Action Bar */}
          <section style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <h4 style={{ fontSize: "1.125rem", fontWeight: "700", color: "#171c1f", margin: 0 }}>
                Lead List
              </h4>
              <span style={{ fontSize: "0.875rem", color: "#637381" }}>
                {filteredLeads.length} lead{filteredLeads.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <button
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  background: showFilters ? "#10b981" : "#f8fafc",
                  color: showFilters ? "white" : "#171c1f",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  transition: "all 0.2s",
                }}
              >
                <Filter size={16} />
                Filters
              </button>
              <Link href="/leads/new">
                <button style={{
                  background: "#10b981",
                  color: "white",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  boxShadow: "0 4px 6px rgba(16, 185, 129, 0.2)",
                }}>
                  <Plus size={16} />
                  Add Lead
                </button>
              </Link>
            </div>
          </section>

          {/* Leads list */}
          {filteredLeads.length === 0 ? (
            <div style={{
              background: "white",
              borderRadius: "1rem",
              padding: "4rem 2rem",
              textAlign: "center",
              boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
              border: "1px solid rgba(0,0,0,0.02)",
            }}>
              <Users size={48} style={{ margin: "0 auto 1.5rem", opacity: 0.3 }} />
              <h3 style={{ fontSize: "1.25rem", fontWeight: "700", color: "#171c1f", marginBottom: "0.5rem" }}>
                {leads.length === 0 ? "No leads yet" : "No leads match your filters"}
              </h3>
              <p style={{ fontSize: "0.875rem", color: "#637381", marginBottom: "2rem", maxWidth: "400px", margin: "0 auto 2rem" }}>
                {leads.length === 0 
                  ? "Start building your lead pipeline by adding your first lead."
                  : "Try adjusting your search or filter criteria to find the leads you're looking for."
                }
              </p>
              {leads.length === 0 && (
                <Link href="/leads/new">
                  <button style={{
                    background: "#10b981",
                    color: "white",
                    padding: "0.75rem 2rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    border: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}>
                    <Plus size={16} />
                    Add Your First Lead
                  </button>
                </Link>
              )}
            </div>
          ) : (
            <div style={{
              background: "white",
              borderRadius: "1rem",
              padding: "1rem",
              boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
              border: "1px solid rgba(0,0,0,0.02)",
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {filteredLeads.map((lead) => {
                  const colors = statusColors[lead.status] || statusColors.NEW;
                  return (
                    <Link
                      key={lead.id}
                      href={`/leads/${lead.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1rem",
                          padding: "1rem",
                          borderRadius: "0.75rem",
                          background: "#f8fafc",
                          transition: "all 0.2s",
                          cursor: "pointer",
                          border: "1px solid transparent",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#f1f5f9";
                          e.currentTarget.style.borderColor = "rgba(0,0,0,0.05)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#f8fafc";
                          e.currentTarget.style.borderColor = "transparent";
                        }}
                      >
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #1e293b, #334155)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.875rem",
                            fontWeight: "700",
                            color: "#10b981",
                            flexShrink: 0,
                          }}
                        >
                          {lead.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ 
                            fontSize: "1rem", 
                            fontWeight: "600", 
                            color: "#171c1f", 
                            whiteSpace: "nowrap", 
                            overflow: "hidden", 
                            textOverflow: "ellipsis",
                            marginBottom: "0.25rem"
                          }}>
                            {lead.name}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                            <span style={{ fontSize: "0.875rem", color: "#637381" }}>{lead.phone}</span>
                            {lead.email && (
                              <span style={{ fontSize: "0.875rem", color: "#637381" }}>{lead.email}</span>
                            )}
                            {lead.city && (
                              <span style={{ fontSize: "0.875rem", color: "#637381" }}>{lead.city}</span>
                            )}
                          </div>
                        </div>
                        <div style={{
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          background: colors.bg,
                          color: colors.text,
                          padding: "0.25rem 0.75rem",
                          borderRadius: "9999px",
                          whiteSpace: "nowrap",
                        }}>
                          {lead.status.replace("_", " ")}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
