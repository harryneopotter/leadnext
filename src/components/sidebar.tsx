"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  Settings,
  Shield,
  ChevronRight,
  LogOut,
  ChevronUp,
  Menu,
  X,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

const adminNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
  { label: "Leads",     href: "/leads",     icon: <Users size={18} /> },
  { label: "Follow-ups",href: "/followups", icon: <CalendarClock size={18} /> },
  { label: "Settings",  href: "/settings",  icon: <Settings size={18} /> },
  { label: "Admin",     href: "/admin",     icon: <Shield size={18} /> },
];

const superAdminNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
  { label: "Admins",    href: "/admins",    icon: <Users size={18} /> },
  { label: "All Leads", href: "/all-leads", icon: <LayoutDashboard size={18} /> },
  { label: "Settings",  href: "/settings",  icon: <Settings size={18} /> },
];

interface SidebarProps {
  userRole?: string;
  userName?: string;
  userEmail?: string;
}

export function Sidebar({ userRole, userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = userRole === "SUPER_ADMIN" ? superAdminNavItems : adminNavItems;

  const initials = userName
    ? userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <>
      {/* Mobile Header */}
      <div className="mobile-header">
        <div className="mobile-brand">
          <div className="mobile-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span className="mobile-title">LeadCRM</span>
        </div>
        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar - Desktop fixed, Mobile overlay */}
      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div className="sidebar-title">
            <div className="sidebar-title-main">LeadCRM</div>
            <div className="sidebar-title-sub">Precision Ledger</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <span className={`sidebar-icon ${isActive ? 'active' : ''}`}>
                  {item.icon}
                </span>
                {item.label}
                {isActive && (
                  <ChevronRight size={14} className="sidebar-chevron" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="sidebar-footer">
          <button
            className="sidebar-user-btn"
            onClick={() => setShowMenu(!showMenu)}
          >
            <div className="sidebar-avatar">
              {initials}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{userName || "User"}</div>
              <div className="sidebar-user-role">
                {userRole ? userRole.toLowerCase().replace("_", " ") : "user"}
              </div>
            </div>
            <ChevronUp 
              size={16} 
              className={`sidebar-chevron-up ${showMenu ? 'rotated' : ''}`} 
            />
          </button>

          {/* Dropdown menu */}
          {showMenu && (
            <div className="sidebar-dropdown">
              <button
                className="sidebar-logout-btn"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <style jsx>{`
        .sidebar {
          width: 240px;
          min-width: 240px;
          background: var(--sidebar-bg);
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 100;
        }

        .sidebar-brand {
          padding: 1.5rem 1.25rem 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          gap: 0.625rem;
        }

        .sidebar-logo {
          width: 32px;
          height: 32px;
          background: linear-gradient(145deg, #10b981, #059669);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(16,185,129,0.4);
        }

        .sidebar-title-main {
          font-size: 0.9375rem;
          font-weight: 700;
          color: #f8fafc;
          letter-spacing: -0.01em;
        }

        .sidebar-title-sub {
          font-size: 0.625rem;
          color: var(--emerald);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 600;
        }

        .sidebar-nav {
          flex: 1;
          padding: 0.75rem 0.625rem;
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0.75rem;
          border-radius: 0.375rem;
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--text-on-sidebar);
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
          border-left: 3px solid transparent;
        }

        .sidebar-link:hover {
          background: rgba(255,255,255,0.05);
        }

        .sidebar-link.active {
          font-weight: 600;
          color: #10b981;
          background: rgba(16,185,129,0.1);
          border-left-color: #10b981;
        }

        .sidebar-icon {
          color: #64748b;
          flex-shrink: 0;
        }

        .sidebar-icon.active {
          color: #10b981;
        }

        .sidebar-chevron {
          margin-left: auto;
          opacity: 0.6;
        }

        .sidebar-footer {
          position: relative;
        }

        .sidebar-user-btn {
          width: 100%;
          padding: 1rem 1.25rem;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: transparent;
          border: none;
          cursor: pointer;
          color: inherit;
        }

        .sidebar-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1e293b, #334155);
          border: 2px solid rgba(16,185,129,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.6875rem;
          font-weight: 700;
          color: #10b981;
          flex-shrink: 0;
        }

        .sidebar-user-info {
          overflow: hidden;
          flex: 1;
          min-width: 0;
          text-align: left;
        }

        .sidebar-user-name {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #f8fafc;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebar-user-role {
          font-size: 0.6875rem;
          color: #64748b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebar-chevron-up {
          color: #64748b;
          transition: transform 0.2s;
        }

        .sidebar-chevron-up.rotated {
          transform: rotate(180deg);
        }

        .sidebar-dropdown {
          position: absolute;
          bottom: 100%;
          left: 1rem;
          right: 1rem;
          margin-bottom: 0.5rem;
          background: var(--surface-card);
          border: 1px solid var(--outline-ghost);
          border-radius: 0.5rem;
          padding: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3);
          z-index: 50;
        }

        .sidebar-logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.625rem 0.75rem;
          border-radius: 0.375rem;
          background: transparent;
          border: none;
          color: #ef4444;
          font-size: 0.8125rem;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s;
        }

        .sidebar-logout-btn:hover {
          background: rgba(239,68,68,0.1);
        }

        .mobile-header {
          display: none;
        }

        .mobile-overlay {
          display: none;
        }

        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            width: 280px;
          }

          .sidebar.mobile-open {
            transform: translateX(0);
          }

          .mobile-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.75rem 1rem;
            background: var(--sidebar-bg);
            border-bottom: 1px solid rgba(255,255,255,0.06);
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 90;
            height: 56px;
          }

          .mobile-brand {
            display: flex;
            align-items: center;
            gap: 0.75rem;
          }

          .mobile-logo {
            width: 36px;
            height: 36px;
            background: linear-gradient(145deg, #10b981, #059669);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(16,185,129,0.4);
          }

          .mobile-title {
            font-size: 1rem;
            font-weight: 700;
            color: #f8fafc;
          }

          .mobile-menu-btn {
            background: transparent;
            border: none;
            color: var(--text-on-sidebar);
            cursor: pointer;
            padding: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .mobile-overlay {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 99;
          }
        }
      `}</style>
    </>
  );
}
