import { useState } from "react";
import {
  Brain, Bell, ChevronDown, ChevronRight, Settings,
  Compass, FolderOpen, MessageSquare, DollarSign,
  LogOut, ShieldCheck, Sparkles, X, User, TrendingUp,
} from "lucide-react";
import { NavigatorTab, PortfolioTab, CoachTab, PayTab } from "./EmployeeView";

type EmployeeViewTab = "navigator" | "portfolio" | "coach" | "pay";

const sidebarNav: { id: EmployeeViewTab; icon: typeof Compass; label: string }[] = [
  { id: "navigator", icon: Compass, label: "Career Navigator" },
  { id: "portfolio", icon: FolderOpen, label: "My Portfolio" },
  { id: "coach", icon: MessageSquare, label: "AI Coach" },
  { id: "pay", icon: DollarSign, label: "Pay Engine" },
];

const breadcrumbs: Record<EmployeeViewTab, string> = {
  navigator: "Career Navigator",
  portfolio: "My Portfolio",
  coach: "AI Coach",
  pay: "Pay Engine",
};

const employeeNotifications = [
  { id: "en1", dot: "#A3E635", text: "New employer match: Databricks at 94% trajectory fit", time: "1h ago" },
  { id: "en2", dot: "#A78BFA", text: "AI Coach: Market signal — your bracket is underpaid by 12%", time: "3h ago" },
  { id: "en3", dot: "#38BDF8", text: "Cloudflare has flagged your profile for their talent pipeline", time: "Yesterday" },
  { id: "en4", dot: "#F472B6", text: "kafka-lag-exporter crossed 1.2k GitHub stars", time: "2 days ago" },
];

interface Props {
  onSignOut: () => void;
}

export function EmployeeShell({ onSignOut }: Props) {
  const [activeView, setActiveView] = useState<EmployeeViewTab>("navigator");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const [mobileNotifOpen, setMobileNotifOpen] = useState(false);
  const [readNotifs, setReadNotifs] = useState<Set<string>>(new Set());

  const unreadCount = employeeNotifications.filter((n) => !readNotifs.has(n.id)).length;
  const isCoach = activeView === "coach";

  const markAllRead = () => setReadNotifs(new Set(employeeNotifications.map((n) => n.id)));

  /* ─── Notification dropdown (shared markup) ─── */
  const NotifDropdown = ({ onClose }: { onClose: () => void }) => (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        width: 300,
        background: "#111",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 16px 48px rgba(0,0,0,0.7)",
      }}
    >
      <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#F5F5F5" }}>Notifications</p>
        <p style={{ fontSize: 10, color: "#52525B", marginTop: 1 }}>4 recent alerts</p>
      </div>
      {employeeNotifications.map((n) => (
        <div
          key={n.id}
          className="flex items-start gap-3 px-4 py-3"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
          <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: n.dot }} />
          <div className="flex-1">
            <p style={{ fontSize: 12, color: "#D4D4D8", lineHeight: 1.5 }}>{n.text}</p>
            <p style={{ fontSize: 10, color: "#52525B", fontFamily: "var(--font-mono)", marginTop: 2 }}>{n.time}</p>
          </div>
        </div>
      ))}
      <button
        onClick={() => { markAllRead(); onClose(); }}
        className="w-full py-2.5 text-center"
        style={{ fontSize: 11, color: "#A3E635", fontWeight: 500 }}
      >
        Dismiss all
      </button>
    </div>
  );

  /* ─── Profile dropdown (shared markup) ─── */
  const ProfileDropdown = ({ onClose }: { onClose: () => void }) => (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        width: 210,
        background: "#111",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.7)",
      }}
    >
      <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-2">
          <p style={{ fontSize: 13, fontWeight: 600, color: "#F5F5F5" }}>Jordan Park</p>
          <ShieldCheck size={12} style={{ color: "#A3E635" }} strokeWidth={2.5} />
        </div>
        <p style={{ fontSize: 10, color: "#52525B" }}>jordan@nexusos.io</p>
      </div>
      <button
        className="w-full text-left px-4 py-2.5 flex items-center gap-2 transition-colors"
        style={{ fontSize: 12, color: "#A1A1AA" }}
        onClick={onClose}
      >
        <Settings size={13} strokeWidth={1.8} style={{ color: "#52525B" }} />
        Account Settings
      </button>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <button
          onClick={() => { onClose(); onSignOut(); }}
          className="w-full text-left px-4 py-2.5 flex items-center gap-2 transition-colors"
          style={{ fontSize: 12, color: "#EF4444" }}
        >
          <LogOut size={12} strokeWidth={2} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#080806", fontFamily: "var(--font-sans)" }}
    >
      {/* ════════════════════════════════════════════
          DESKTOP LAYOUT (lg and above)
      ════════════════════════════════════════════ */}

      {/* ── Desktop Sidebar ── */}
      <aside
        className="hidden lg:flex fixed left-0 top-0 h-screen w-16 flex-col items-center py-5 z-40"
        style={{ background: "#0A0A0A", borderRight: "1px solid rgba(255,255,255,0.07)" }}
      >
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-1">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(163,230,53,0.12)", border: "1px solid rgba(163,230,53,0.25)" }}
          >
            <Brain size={16} style={{ color: "#A3E635" }} strokeWidth={2} />
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col items-center gap-1 flex-1">
          {sidebarNav.map(({ id, icon: Icon, label }) => {
            const active = activeView === id;
            return (
              <button
                key={id}
                title={label}
                onClick={() => setActiveView(id)}
                className="group relative w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-150"
                style={{
                  background: active ? "rgba(163,230,53,0.10)" : "transparent",
                  color: active ? "#A3E635" : "#52525B",
                }}
              >
                <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                {active && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r"
                    style={{ background: "#A3E635" }}
                  />
                )}
                <span
                  className="pointer-events-none absolute left-14 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50"
                  style={{ background: "#111", color: "#A1A1AA", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {label}
                  <ChevronRight size={10} className="inline ml-0.5 opacity-40" />
                </span>
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="flex flex-col items-center gap-2">
          <button
            title="Settings"
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ color: "#3F3F46" }}
          >
            <Settings size={17} strokeWidth={1.8} />
          </button>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
            style={{ background: "linear-gradient(135deg, #3730A3, #7C3AED)", color: "#fff", fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 10 }}
            title="Jordan Park"
          >
            JP
          </div>
        </div>
      </aside>

      {/* ── Desktop Main Content ── */}
      <div className="hidden lg:flex flex-col flex-1 min-w-0 ml-16">

        {/* Desktop Top Header */}
        <header
          className="flex items-center gap-4 px-6 shrink-0 relative"
          style={{
            background: "rgba(10,10,10,0.97)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            height: "52px",
            zIndex: 30,
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="flex items-center gap-2 mr-4 shrink-0">
            <Sparkles size={14} style={{ color: "#A3E635" }} />
            <span style={{ fontWeight: 600, fontSize: "13px", color: "#F5F5F5", letterSpacing: "-0.01em" }}>
              Nexus OS
            </span>
            <span className="rounded px-1.5 py-0.5" style={{ background: "rgba(163,230,53,0.08)", color: "#52525B", fontSize: "9px", fontFamily: "var(--font-mono)", fontWeight: 500 }}>
              BETA
            </span>
          </div>

          <div className="flex items-center gap-1.5" style={{ fontSize: "12px", color: "#52525B" }}>
            <span>Workspace</span>
            <span>/</span>
            <span style={{ color: "#A1A1AA" }}>{breadcrumbs[activeView]}</span>
          </div>

          {/* Profile identity strip */}
          <div className="hidden xl:flex items-center gap-2 ml-6">
            <span className="flex items-center gap-1 rounded-full px-2.5 py-1" style={{ background: "rgba(163,230,53,0.08)", border: "1px solid rgba(163,230,53,0.15)", fontSize: 10, color: "#A3E635", fontWeight: 500, fontFamily: "var(--font-mono)" }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#A3E635" }} />
              LIVING PORTFOLIO · ACTIVE
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto shrink-0">
            {/* Bell */}
            <button
              onClick={() => { setNotifOpen((p) => !p); setProfileOpen(false); markAllRead(); }}
              className="relative w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
              style={{ color: "#A1A1AA" }}
            >
              <Bell size={15} strokeWidth={1.8} />
              {unreadCount > 0 && (
                <span
                  className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                  style={{ background: "#A3E635", fontSize: "8px", fontFamily: "var(--font-mono)", color: "#000", fontWeight: 700 }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-36 top-12 z-50">
                <NotifDropdown onClose={() => setNotifOpen(false)} />
              </div>
            )}

            {/* Profile */}
            <div
              className="relative flex items-center gap-2 rounded-lg px-2.5 cursor-pointer select-none"
              style={{ border: "1px solid rgba(255,255,255,0.08)", height: "32px", background: "rgba(255,255,255,0.03)" }}
              onClick={() => { setProfileOpen((p) => !p); setNotifOpen(false); }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #3730A3, #7C3AED)", fontFamily: "var(--font-mono)", fontSize: "9px", fontWeight: 700, color: "#fff" }}
              >
                JP
              </div>
              <span style={{ fontSize: "12px", color: "#E4E4E7", fontWeight: 500 }}>Jordan P.</span>
              <ChevronDown
                size={11}
                style={{ color: "#52525B", transform: profileOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
              />
              {profileOpen && (
                <div className="absolute right-0 top-9 z-50">
                  <ProfileDropdown onClose={() => setProfileOpen(false)} />
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Desktop Content — fills the full remaining space */}
        <div
          className="flex-1 overflow-hidden"
          style={{
            background: "#080806",
            backgroundImage: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(163,230,53,0.025) 0%, transparent 60%)",
          }}
        >
          {isCoach ? (
            /* Coach: flex column fills full height */
            <div className="h-full flex flex-col" style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px 32px" }}>
              {/* Profile strip above chat */}
              <div
                className="flex items-center justify-between px-5 py-3 rounded-t-2xl shrink-0"
                style={{ background: "#0F0F0F", border: "1px solid rgba(255,255,255,0.07)", borderBottom: "none" }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #3730A3, #7C3AED)", fontSize: 11, fontWeight: 700, color: "#fff", fontFamily: "var(--font-mono)" }}>JP</div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#F5F5F5" }}>Jordan Park</span>
                      <ShieldCheck size={12} style={{ color: "#A3E635" }} strokeWidth={2.5} />
                    </div>
                    <span style={{ fontSize: 10, color: "#52525B", fontFamily: "var(--font-mono)" }}>Senior AI Career Coach · Private session</span>
                  </div>
                </div>
                <span className="flex items-center gap-1 rounded-full px-2.5 py-1" style={{ background: "rgba(163,230,53,0.08)", border: "1px solid rgba(163,230,53,0.15)", fontSize: 10, color: "#A3E635", fontWeight: 600, fontFamily: "var(--font-mono)" }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#A3E635" }} />
                  LIVE
                </span>
              </div>
              <div
                className="flex-1 overflow-hidden rounded-b-2xl"
                style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.07)", borderTop: "none" }}
              >
                <CoachTab />
              </div>
            </div>
          ) : (
            /* Other tabs: centered column with max-width, scrollable */
            <div className="h-full overflow-y-auto" style={{ scrollbarWidth: "none" }}>
              <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px 40px" }}>
                {/* Desktop profile banner */}
                <div
                  className="flex items-center justify-between px-5 py-3 rounded-2xl mb-4"
                  style={{ background: "#0F0F0F", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #3730A3, #7C3AED)", fontSize: 12, fontWeight: 700, color: "#fff", fontFamily: "var(--font-mono)" }}>JP</div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#F5F5F5", letterSpacing: "-0.01em" }}>Jordan Park</span>
                        <ShieldCheck size={13} style={{ color: "#A3E635" }} strokeWidth={2.5} />
                      </div>
                      <span style={{ fontSize: 11, color: "#52525B" }}>Sr. Portfolio Optimization Specialist · Independent</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={13} style={{ color: "#A3E635" }} strokeWidth={2} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#A3E635", fontFamily: "var(--font-mono)" }}>94% trajectory score</span>
                    </div>
                    <span className="flex items-center gap-1 rounded-full px-2.5 py-1" style={{ background: "rgba(163,230,53,0.08)", border: "1px solid rgba(163,230,53,0.18)", fontSize: 10, color: "#A3E635", fontWeight: 600, fontFamily: "var(--font-mono)" }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#A3E635" }} />
                      PORTFOLIO ACTIVE
                    </span>
                  </div>
                </div>

                {/* Tab content — full width */}
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  {activeView === "navigator" && <NavigatorTab />}
                  {activeView === "portfolio" && <PortfolioTab />}
                  {activeView === "pay" && <PayTab />}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════════
          MOBILE LAYOUT (below lg)
      ════════════════════════════════════════════ */}
      <div
        className="flex lg:hidden flex-col flex-1 min-w-0"
        style={{
          background: "#080806",
          backgroundImage: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(163,230,53,0.04) 0%, transparent 70%)",
        }}
      >
        {/* Mobile: scrollable centered phone card */}
        <div className="flex-1 overflow-y-auto flex justify-center py-6" style={{ scrollbarWidth: "none", paddingBottom: 100 }}>
          <div
            className="relative flex flex-col overflow-hidden"
            style={{
              width: 393,
              minHeight: "fit-content",
              background: "#0A0A0A",
              borderRadius: 40,
              border: "1px solid rgba(255,255,255,0.09)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
            }}
          >
            {/* Mobile status bar mock */}
            <div className="flex items-center justify-between px-8 shrink-0" style={{ height: 54, paddingTop: 14 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#F5F5F5", letterSpacing: "-0.01em" }}>9:41</span>
              <div className="rounded-full flex items-center justify-center" style={{ width: 120, height: 34, background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.08)" }} />
              <div style={{ width: 16, height: 11, borderRadius: 3, border: "1.5px solid #F5F5F5", position: "relative" }}>
                <div style={{ position: "absolute", top: 2, left: 2, right: 3, bottom: 2, background: "#F5F5F5", borderRadius: 1 }} />
              </div>
            </div>

            {/* Mobile top nav */}
            <div
              className="flex items-center justify-between px-5 shrink-0"
              style={{ height: 60, borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(10,10,10,0.95)" }}
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#F5F5F5", letterSpacing: "-0.02em" }}>Jordan Park</span>
                  <ShieldCheck size={13} style={{ color: "#A3E635" }} strokeWidth={2.5} />
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className="flex items-center gap-1 rounded-full px-2 py-0.5"
                    style={{ background: "rgba(163,230,53,0.10)", fontSize: 10, color: "#A3E635", fontWeight: 500, fontFamily: "var(--font-mono)" }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#A3E635" }} />
                    LIVING PORTFOLIO · ACTIVE
                  </span>
                </div>
              </div>
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #3730A3, #7C3AED)", fontSize: 12, fontWeight: 700, color: "#fff", fontFamily: "var(--font-mono)" }}>
                JP
              </div>
            </div>

            {/* Mobile content body */}
            <div
              className={isCoach ? "flex flex-col overflow-hidden" : ""}
              style={isCoach ? { height: 620 } : { paddingBottom: 24 }}
            >
              {activeView === "navigator" && <NavigatorTab />}
              {activeView === "portfolio" && <PortfolioTab />}
              {activeView === "coach" && <CoachTab />}
              {activeView === "pay" && <PayTab />}
            </div>
          </div>
        </div>

        {/* ── Mobile Floating Bottom Nav ── */}
        <div
          className="fixed left-1/2 z-50"
          style={{ bottom: 24, transform: "translateX(-50%)" }}
        >
          <div
            className="flex items-center gap-1 px-3 py-2"
            style={{
              background: "rgba(12,12,12,0.95)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 999,
              backdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04) inset",
              gap: 4,
            }}
          >
            {/* 4 tab icons */}
            {sidebarNav.map(({ id, icon: Icon, label }) => {
              const active = activeView === id;
              return (
                <button
                  key={id}
                  onClick={() => { setActiveView(id); setMobileNotifOpen(false); setMobileProfileOpen(false); }}
                  title={label}
                  className="flex flex-col items-center justify-center transition-all duration-150"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 999,
                    background: active ? "rgba(163,230,53,0.12)" : "transparent",
                    color: active ? "#A3E635" : "#52525B",
                  }}
                >
                  <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
                </button>
              );
            })}

            {/* Divider */}
            <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.08)", margin: "0 4px" }} />

            {/* Bell */}
            <button
              onClick={() => { setMobileNotifOpen((p) => !p); setMobileProfileOpen(false); markAllRead(); }}
              className="flex flex-col items-center justify-center relative transition-all duration-150"
              style={{
                width: 48,
                height: 48,
                borderRadius: 999,
                background: mobileNotifOpen ? "rgba(163,230,53,0.10)" : "transparent",
                color: mobileNotifOpen ? "#A3E635" : "#52525B",
              }}
            >
              <Bell size={20} strokeWidth={1.8} />
              {unreadCount > 0 && (
                <span
                  className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                  style={{ background: "#A3E635", fontSize: "8px", fontFamily: "var(--font-mono)", color: "#000", fontWeight: 700 }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Profile */}
            <button
              onClick={() => { setMobileProfileOpen((p) => !p); setMobileNotifOpen(false); }}
              className="flex flex-col items-center justify-center transition-all duration-150"
              style={{
                width: 48,
                height: 48,
                borderRadius: 999,
                background: mobileProfileOpen ? "rgba(124,58,237,0.15)" : "transparent",
                padding: 0,
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #3730A3, #7C3AED)", fontSize: 11, fontWeight: 700, color: "#fff", fontFamily: "var(--font-mono)" }}
              >
                JP
              </div>
            </button>
          </div>

          {/* Mobile notification panel — floats above nav */}
          {mobileNotifOpen && (
            <div
              className="absolute left-1/2 rounded-2xl overflow-hidden"
              style={{
                bottom: 72,
                transform: "translateX(-50%)",
                width: 320,
                background: "#111",
                border: "1px solid rgba(255,255,255,0.10)",
                boxShadow: "0 -8px 40px rgba(0,0,0,0.8)",
              }}
            >
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#F5F5F5" }}>Notifications</p>
                <button onClick={() => setMobileNotifOpen(false)}>
                  <X size={14} style={{ color: "#52525B" }} />
                </button>
              </div>
              {employeeNotifications.map((n) => (
                <div
                  key={n.id}
                  className="flex items-start gap-3 px-4 py-3"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: n.dot }} />
                  <div className="flex-1">
                    <p style={{ fontSize: 12, color: "#D4D4D8", lineHeight: 1.5 }}>{n.text}</p>
                    <p style={{ fontSize: 10, color: "#52525B", fontFamily: "var(--font-mono)", marginTop: 2 }}>{n.time}</p>
                  </div>
                </div>
              ))}
              <button
                onClick={() => { markAllRead(); setMobileNotifOpen(false); }}
                className="w-full py-2.5 text-center"
                style={{ fontSize: 11, color: "#A3E635", fontWeight: 500 }}
              >
                Dismiss all
              </button>
            </div>
          )}

          {/* Mobile profile panel — floats above nav */}
          {mobileProfileOpen && (
            <div
              className="absolute left-1/2 rounded-2xl overflow-hidden"
              style={{
                bottom: 72,
                transform: "translateX(-50%)",
                width: 240,
                background: "#111",
                border: "1px solid rgba(255,255,255,0.10)",
                boxShadow: "0 -8px 40px rgba(0,0,0,0.8)",
              }}
            >
              <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center gap-2 mb-0.5">
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#F5F5F5" }}>Jordan Park</p>
                  <ShieldCheck size={12} style={{ color: "#A3E635" }} strokeWidth={2.5} />
                </div>
                <p style={{ fontSize: 10, color: "#52525B" }}>jordan@nexusos.io</p>
              </div>
              <button
                className="w-full text-left px-4 py-3 flex items-center gap-2"
                style={{ fontSize: 12, color: "#A1A1AA" }}
                onClick={() => setMobileProfileOpen(false)}
              >
                <Settings size={13} style={{ color: "#52525B" }} strokeWidth={1.8} />
                Account Settings
              </button>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <button
                  onClick={() => { setMobileProfileOpen(false); onSignOut(); }}
                  className="w-full text-left px-4 py-3 flex items-center gap-2"
                  style={{ fontSize: 12, color: "#EF4444" }}
                >
                  <LogOut size={12} strokeWidth={2} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
