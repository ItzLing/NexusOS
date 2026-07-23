import { useState, useEffect } from "react";
import {
  Search, Bell, ChevronDown, SlidersHorizontal, ArrowUpDown,
  Filter, Sparkles, Building2, LayoutList, Zap, Briefcase,
  Settings, Brain, MessageSquareMore, ChevronRight, LogOut,
  X, User, Shield, CreditCard, HelpCircle, ArrowLeft,
  Moon, Sun
} from "lucide-react";
import { CandidateCard, type Candidate } from "./components/CandidateCard";
import { InsightPanel } from "./components/InsightPanel";
import { EmployerChatbox } from "./components/EmployerChatbox";
import { OpenRolesView } from "./components/OpenRolesView";
import { ActiveMatchesView } from "./components/ActiveMatchesView";
import { LoginPage } from "./components/LoginPage";
import { EmployeeShell } from "./components/EmployeeShell";

import { CareerOSApplicationShell, MockInitializer } from "../../../src";

export const shell = new CareerOSApplicationShell();
export let initError: string | null = null;
let candidates: Candidate[] = [];

try {
  const initResult = MockInitializer.initializeDemoState(shell);
  candidates = initResult.candidatesList;
} catch (e: any) {
  initError = e.stack || e.message || String(e);
  console.error("Initialization Error:", e);
}

type AuthRole = "employer" | "employee";
type EmployerView = "pipeline" | "matches" | "roles" | "messages" | "notifications";


type SortKey = "Trajectory Alignment" | "Career Momentum" | "Skills Match" | "Experience Depth";
const momentumOrder = { rising: 0, pivoting: 1, stable: 2 };

function sortCandidates(list: Candidate[], key: SortKey): Candidate[] {
  return [...list].sort((a, b) => {
    if (key === "Trajectory Alignment") return b.trajectoryScore - a.trajectoryScore;
    if (key === "Career Momentum") return momentumOrder[a.momentum] - momentumOrder[b.momentum];
    if (key === "Skills Match") return b.skills.length - a.skills.length;
    if (key === "Experience Depth") return b.yearsExp - a.yearsExp;
    return 0;
  });
}

const sortOptions: SortKey[] = ["Trajectory Alignment", "Career Momentum", "Skills Match", "Experience Depth"];

const sidebarNav = [
  { id: "pipeline" as EmployerView, icon: LayoutList, label: "Talent Pipeline" },
  { id: "matches" as EmployerView, icon: Zap, label: "Active Matches" },
  { id: "roles" as EmployerView, icon: Briefcase, label: "Open Roles" },
  { id: "messages" as EmployerView, icon: MessageSquareMore, label: "Direct Introductions" },
];

/* ─── Employer Settings Panel (slide-in drawer) ─── */
function EmployerSettingsPanel({ open, onClose, onSignOut }: { open: boolean; onClose: () => void; onSignOut: () => void }) {
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [matchAlerts, setMatchAlerts] = useState(true);

  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.25)", backdropFilter: "blur(2px)" }} onClick={onClose} />
      <div
        className="fixed right-0 top-0 h-screen z-50 flex flex-col overflow-hidden"
        style={{ width: 340, background: "var(--card)", borderLeft: "1px solid var(--border)", boxShadow: "-16px 0 48px rgba(0,0,0,0.12)", animation: "slideInRight 0.22s ease" }}
      >
        <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2">
            <Settings size={15} style={{ color: "var(--primary)" }} strokeWidth={2} />
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)" }}>Settings</span>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-accent transition-colors">
            <X size={14} style={{ color: "var(--muted-foreground)" }} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "var(--font-mono)", marginBottom: 12 }}>Account</p>
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "var(--accent)" }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ background: "#7C5C4A", fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 13 }}>AK</div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>Arjun Kumar</p>
                <p style={{ fontSize: 11, color: "var(--muted-foreground)" }}>arjun@nexusos.io · Employer</p>
              </div>
            </div>
            <button className="w-full mt-2 flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors" style={{ fontSize: 12, color: "var(--foreground)" }}>
              <User size={13} style={{ color: "var(--muted-foreground)" }} strokeWidth={1.8} />
              Edit Profile
            </button>
          </div>
          <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "var(--font-mono)", marginBottom: 12 }}>Notifications</p>
            {[
              { label: "Push notifications", sub: "Browser alerts for matches & messages", state: notifEnabled, toggle: setNotifEnabled },
              { label: "Match alerts", sub: "Notify when new trajectory matches appear", state: matchAlerts, toggle: setMatchAlerts },
            ].map(({ label, sub, state, toggle }) => (
              <div key={label} className="flex items-center justify-between py-2.5">
                <div>
                  <p style={{ fontSize: 12, color: "var(--foreground)", fontWeight: 500 }}>{label}</p>
                  <p style={{ fontSize: 10, color: "var(--muted-foreground)", marginTop: 1 }}>{sub}</p>
                </div>
                <button
                  onClick={() => toggle((p) => !p)}
                  className="rounded-full transition-colors shrink-0"
                  style={{ width: 36, height: 20, background: state ? "var(--primary)" : "var(--border)", position: "relative" }}
                >
                  <span className="absolute top-1 rounded-full transition-all" style={{ width: 12, height: 12, background: "#fff", left: state ? 21 : 3 }} />
                </button>
              </div>
            ))}
          </div>
          <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "var(--font-mono)", marginBottom: 12 }}>Workspace</p>
            {[
              { icon: Building2, label: "Company profile", sub: "Nexus Corp · 120 employees" },
              { icon: CreditCard, label: "Billing & plan", sub: "Growth plan · Renews Aug 1" },
              { icon: Shield, label: "Security", sub: "SSO · 2FA enabled" },
            ].map(({ icon: Icon, label, sub }) => (
              <button key={label} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-left">
                <Icon size={14} style={{ color: "var(--muted-foreground)" }} strokeWidth={1.8} />
                <div>
                  <p style={{ fontSize: 12, color: "var(--foreground)", fontWeight: 500 }}>{label}</p>
                  <p style={{ fontSize: 10, color: "var(--muted-foreground)" }}>{sub}</p>
                </div>
                <ChevronRight size={12} className="ml-auto" style={{ color: "var(--muted-foreground)" }} />
              </button>
            ))}
          </div>
          <div className="px-5 py-4">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors text-left">
              <HelpCircle size={14} style={{ color: "var(--muted-foreground)" }} strokeWidth={1.8} />
              <span style={{ fontSize: 12, color: "var(--foreground)", fontWeight: 500 }}>Help & support</span>
              <ChevronRight size={12} className="ml-auto" style={{ color: "var(--muted-foreground)" }} />
            </button>
          </div>
        </div>
        <div className="px-5 py-4 shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            onClick={() => { onClose(); onSignOut(); }}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors"
            style={{ fontSize: 12, color: "#DC2626" }}
          >
            <LogOut size={13} strokeWidth={2} />
            Sign out
          </button>
        </div>
      </div>
      <style>{`@keyframes slideInRight { from { transform: translateX(100%); opacity:0 } to { transform: translateX(0); opacity:1 } }`}</style>
    </>
  );
}

/* ─── Employer Sidebar (desktop only) ─── */
function Sidebar({
  activeView, onNav, onSettings, onProfile,
}: {
  activeView: EmployerView;
  onNav: (v: EmployerView) => void;
  onSettings: () => void;
  onProfile: () => void;
}) {
  return (
    <aside
      className="hidden lg:flex fixed left-0 top-0 h-screen w-16 flex-col items-center py-5 z-40"
      style={{ background: "var(--sidebar)", borderRight: "1px solid var(--sidebar-border)" }}
    >
      <div className="mb-8 flex flex-col items-center gap-1">
        <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: "var(--sidebar-primary)" }}>
          <Brain size={16} color="#fff" strokeWidth={2} />
        </div>
      </div>
      <nav className="flex flex-col items-center gap-1 flex-1">
        {sidebarNav.map(({ id, icon: Icon, label }) => {
          const active = activeView === id;
          return (
            <button key={id} title={label} onClick={() => onNav(id)}
              className="group relative w-10 h-10 rounded flex items-center justify-center transition-colors duration-150"
              style={{ background: active ? "var(--sidebar-accent)" : "transparent", color: active ? "var(--sidebar-primary)" : "var(--sidebar-foreground)" }}>
              <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
              {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r" style={{ background: "var(--sidebar-primary)" }} />}
              <span className="pointer-events-none absolute left-14 whitespace-nowrap rounded px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50"
                style={{ background: "var(--sidebar-accent)", color: "var(--sidebar-accent-foreground)", fontFamily: "var(--font-sans)" }}>
                {label}
                <ChevronRight size={10} className="inline ml-0.5 opacity-50" />
              </span>
            </button>
          );
        })}
      </nav>
      <div className="flex flex-col items-center gap-1">
        <button
          title="Settings"
          onClick={onSettings}
          className="group relative w-10 h-10 rounded flex items-center justify-center transition-colors duration-150 hover:bg-accent"
          style={{ color: "var(--sidebar-foreground)" }}
        >
          <Settings size={18} strokeWidth={1.8} />
        </button>
        <button
          title="Arjun Kumar"
          onClick={onProfile}
          className="w-8 h-8 rounded-full flex items-center justify-center mt-3 text-xs transition-opacity hover:opacity-75"
          style={{ background: "#7C5C4A", color: "#fff", fontFamily: "var(--font-mono)", fontWeight: 700 }}
        >
          AK
        </button>
      </div>
    </aside>
  );
}

/* ─── Desktop Pipeline View ─── */
interface PipelineProps { onInitiateIntro: (name: string) => void; }
type ViewMode = "card" | "compact";

function PipelineView({ onInitiateIntro }: PipelineProps) {
  const [selectedId, setSelectedId] = useState("c1");
  const [sortBy, setSortBy] = useState<SortKey>("Trajectory Alignment");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [activePhaseFilter, setActivePhaseFilter] = useState<string>("All");
  const [activeMomentumFilter, setActiveMomentumFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<ViewMode>("card");

  const selectedCandidate = candidates.find((c) => c.id === selectedId) ?? candidates[0];
  const filtered = candidates
    .filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.currentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter((c) => activePhaseFilter === "All" || c.phase === activePhaseFilter)
    .filter((c) => activeMomentumFilter === "All" || c.momentum === activeMomentumFilter);
  const sorted = sortCandidates(filtered, sortBy);
  const phaseOptions = ["All", "Ready for Pivot", "Accelerating", "Exploring", "Deep Specializing"];
  const momentumOptions = ["All", "rising", "pivoting", "stable"];

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex flex-col overflow-hidden flex-[3]" style={{ borderRight: "1px solid var(--border)", minWidth: 0 }}>
        <div className="flex items-center justify-between px-5 shrink-0" style={{ borderBottom: "1px solid var(--border)", background: "var(--card)", height: "48px" }}>
          <div className="flex items-baseline gap-3">
            <h2 style={{ fontWeight: 600, color: "var(--foreground)", fontSize: "13px" }}>Talent Pipeline</h2>
            <span style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>{sorted.length} candidates</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setFilterOpen((p) => !p)}
              className="flex items-center gap-1 rounded-md px-2.5 transition-colors hover:bg-accent"
              style={{ border: `1px solid ${filterOpen ? "var(--primary)" : "var(--border)"}`, color: filterOpen ? "var(--primary)" : "var(--muted-foreground)", height: "28px", fontSize: "11px", background: filterOpen ? "rgba(194,98,42,0.06)" : "transparent" }}>
              <Filter size={10} strokeWidth={2} />{filterOpen ? "Filters ✓" : "Filter"}
            </button>
            <div className="relative">
              <button onClick={() => setShowSortDropdown((p) => !p)}
                className="flex items-center gap-1 rounded-md px-2.5 transition-colors hover:bg-accent"
                style={{ border: "1px solid var(--border)", color: "var(--muted-foreground)", height: "28px", fontSize: "11px" }}>
                <ArrowUpDown size={10} strokeWidth={2} />{sortBy}<ChevronDown size={9} />
              </button>
              {showSortDropdown && (
                <div className="absolute right-0 top-8 rounded-lg py-1 z-50" style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", minWidth: "190px" }}>
                  {sortOptions.map((opt) => (
                    <button key={opt} className="w-full text-left px-3 py-2 transition-colors hover:bg-accent"
                      style={{ fontSize: "12px", color: opt === sortBy ? "var(--primary)" : "var(--foreground)", fontWeight: opt === sortBy ? 500 : 400 }}
                      onClick={() => { setSortBy(opt); setShowSortDropdown(false); }}>{opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => setViewMode((p) => p === "card" ? "compact" : "card")}
              className="flex items-center gap-1 rounded-md px-2.5 transition-colors hover:bg-accent"
              style={{ border: "1px solid var(--border)", color: "var(--muted-foreground)", height: "28px", fontSize: "11px", background: viewMode === "compact" ? "var(--accent)" : "transparent" }}>
              <SlidersHorizontal size={10} strokeWidth={2} />{viewMode === "compact" ? "Cards" : "Compact"}
            </button>
          </div>
        </div>
        <div className="px-3 py-2 shrink-0" style={{ background: "var(--card)", borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 rounded-md px-3" style={{ background: "var(--input-background)", height: "30px" }}>
            <Search size={11} style={{ color: "var(--muted-foreground)" }} strokeWidth={2} />
            <input type="text" placeholder="Filter by name, skill, title…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none" style={{ fontSize: "11px", color: "var(--foreground)" }} />
          </div>
        </div>
        {filterOpen && (
          <div className="px-4 py-3 shrink-0 space-y-2.5" style={{ background: "var(--card)", borderBottom: "1px solid var(--border)" }}>
            <div>
              <p style={{ fontSize: 9, color: "var(--muted-foreground)", fontFamily: "var(--font-mono)", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em" }}>Phase</p>
              <div className="flex gap-1 flex-wrap">
                {phaseOptions.map((p) => (
                  <button key={p} onClick={() => setActivePhaseFilter(p)} className="rounded-full px-2.5 py-0.5 transition-colors"
                    style={{ fontSize: 10, fontWeight: activePhaseFilter === p ? 600 : 400, background: activePhaseFilter === p ? "var(--primary)" : "var(--secondary)", color: activePhaseFilter === p ? "#fff" : "var(--muted-foreground)", border: activePhaseFilter === p ? "none" : "1px solid var(--border)" }}>{p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize: 9, color: "var(--muted-foreground)", fontFamily: "var(--font-mono)", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em" }}>Momentum</p>
              <div className="flex gap-1 flex-wrap">
                {momentumOptions.map((m) => (
                  <button key={m} onClick={() => setActiveMomentumFilter(m)} className="rounded-full px-2.5 py-0.5 transition-colors"
                    style={{ fontSize: 10, fontWeight: activeMomentumFilter === m ? 600 : 400, background: activeMomentumFilter === m ? "var(--primary)" : "var(--secondary)", color: activeMomentumFilter === m ? "#fff" : "var(--muted-foreground)", border: activeMomentumFilter === m ? "none" : "1px solid var(--border)" }}>
                    {m === "All" ? "All" : m.charAt(0).toUpperCase() + m.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1" style={{ scrollbarWidth: "none" }}>
          {sorted.length > 0 ? sorted.map((c) => viewMode === "card" ? (
            <CandidateCard key={c.id} candidate={c} selected={c.id === selectedId} onClick={() => setSelectedId(c.id)} />
          ) : (
            <button key={c.id} onClick={() => setSelectedId(c.id)}
              className="w-full flex items-center gap-3 rounded-lg px-4 py-2.5 text-left transition-all"
              style={{ background: c.id === selectedId ? "#fff" : "transparent", border: c.id === selectedId ? "1.5px solid var(--primary)" : "1.5px solid transparent" }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white" style={{ background: c.avatarBg, fontSize: 9, fontFamily: "var(--font-mono)", fontWeight: 600 }}>{c.initials}</div>
              <span style={{ fontSize: 12, fontWeight: 500, color: "var(--foreground)", flex: 1 }}>{c.name}</span>
              <span style={{ fontSize: 10, color: "var(--muted-foreground)" }}>{c.currentTitle}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: "var(--primary)", fontFamily: "var(--font-mono)" }}>{c.trajectoryScore}%</span>
            </button>
          )) : (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <Search size={22} style={{ color: "var(--muted-foreground)", marginBottom: 8 }} />
              <p style={{ fontSize: "13px", color: "var(--muted-foreground)" }}>No candidates match</p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-5 px-5 shrink-0" style={{ borderTop: "1px solid var(--border)", background: "var(--card)", height: "40px" }}>
          {[
            { label: "Ready for Pivot", value: "2", color: "#C2622A" },
            { label: "Accelerating", value: "1", color: "#065F46" },
            { label: "Exploring", value: "1", color: "#7E22CE" },
            { label: "Deep Specializing", value: "1", color: "#1D4E89" },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
              <span style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>
                <span style={{ color: "var(--foreground)", fontWeight: 500 }}>{value}</span> {label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col overflow-hidden flex-[2]" style={{ background: "var(--card)", minWidth: 0 }}>
        <InsightPanel candidate={selectedCandidate} justification={(selectedCandidate as any).justification} onInitiateIntro={onInitiateIntro} />
      </div>
    </div>
  );
}

/* ─── Mobile Pipeline View ─── */
function MobilePipelineView({ onInitiateIntro }: PipelineProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedCandidate = selectedId ? candidates.find((c) => c.id === selectedId) : null;
  const filtered = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.currentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const momentumStyle = (m: string) => ({
    background: m === "rising" ? "rgba(6,95,70,0.10)" : m === "pivoting" ? "rgba(126,34,206,0.10)" : "rgba(30,58,138,0.10)",
    border: `1px solid ${m === "rising" ? "rgba(6,95,70,0.2)" : m === "pivoting" ? "rgba(126,34,206,0.2)" : "rgba(30,58,138,0.2)"}`,
    color: m === "rising" ? "#065F46" : m === "pivoting" ? "#7E22CE" : "#1E3A8A",
  });

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      {/* Toolbar */}
      <div className="px-4 py-3 shrink-0" style={{ borderBottom: "1px solid var(--border)", background: "var(--card)" }}>
        <div className="flex items-center gap-2 rounded-xl px-3 mb-2" style={{ background: "var(--input-background)", height: 40 }}>
          <Search size={13} style={{ color: "var(--muted-foreground)" }} />
          <input
            type="text"
            placeholder="Search candidates, skills…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none"
            style={{ fontSize: 13, color: "var(--foreground)" }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{filtered.length} candidates in pipeline</span>
          <div className="flex gap-2">
            {[{ label: "Ready", count: 2, color: "#C2622A" }, { label: "Rising", count: 3, color: "#065F46" }].map(({ label, count, color }) => (
              <span key={label} className="flex items-center gap-1 rounded-full px-2 py-0.5" style={{ background: "var(--accent)", fontSize: 10, color: "var(--muted-foreground)" }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />{count} {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Candidate list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ scrollbarWidth: "none", paddingBottom: 96 }}>
        {filtered.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedId(c.id)}
            className="w-full text-left rounded-2xl p-4 transition-all"
            style={{ background: "var(--card)", border: "1.5px solid var(--border)", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-white" style={{ background: c.avatarBg, fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700 }}>
                {c.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.01em" }}>{c.name}</p>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "var(--primary)", fontFamily: "var(--font-mono)" }}>{c.trajectoryScore}%</span>
                </div>
                <p style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 1 }}>{c.currentTitle} · {c.location}</p>
              </div>
            </div>
            <p style={{ fontSize: 11, color: "var(--muted-foreground)", lineHeight: 1.55, marginBottom: 10 }}>{c.trajectoryLabel}</p>
            <div className="flex items-center justify-between gap-2">
              <div className="flex gap-1.5 flex-wrap flex-1 min-w-0">
                {c.skills.slice(0, 3).map((s) => (
                  <span key={s} className="rounded-full px-2 py-0.5 shrink-0" style={{ background: "var(--accent)", fontSize: 10, color: "var(--muted-foreground)", border: "1px solid var(--border)" }}>{s}</span>
                ))}
                {c.skills.length > 3 && <span style={{ fontSize: 10, color: "var(--muted-foreground)" }}>+{c.skills.length - 3}</span>}
              </div>
              <span className="flex items-center gap-1 rounded-full px-2.5 py-0.5 shrink-0" style={{ fontSize: 10, fontWeight: 500, ...momentumStyle(c.momentum) }}>
                {c.momentum.charAt(0).toUpperCase() + c.momentum.slice(1)}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Candidate detail overlay */}
      {selectedCandidate && (
        <div className="absolute inset-0 z-30 flex flex-col overflow-hidden" style={{ background: "var(--background)" }}>
          <div
            className="flex items-center gap-3 px-4 shrink-0"
            style={{ height: 52, borderBottom: "1px solid var(--border)", background: "var(--card)" }}
          >
            <button
              onClick={() => setSelectedId(null)}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-accent transition-colors"
            >
              <ArrowLeft size={16} style={{ color: "var(--foreground)" }} />
            </button>
            <div className="flex-1">
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>{selectedCandidate.name}</p>
              <p style={{ fontSize: 10, color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>
                {selectedCandidate.trajectoryScore}% trajectory · {selectedCandidate.phase}
              </p>
            </div>
            <button
              onClick={() => { onInitiateIntro(selectedCandidate.name); setSelectedId(null); }}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 transition-colors"
              style={{ background: "var(--primary)", fontSize: 12, fontWeight: 600, color: "#fff" }}
            >
              <MessageSquareMore size={13} strokeWidth={2} />
              Intro
            </button>
          </div>
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none", paddingBottom: 96 }}>
            <InsightPanel
              candidate={selectedCandidate}
              justification={(selectedCandidate as any).justification}
              onInitiateIntro={(name) => { onInitiateIntro(name); setSelectedId(null); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Employer Shell ─── */
interface EmployerShellProps {
  onSignOut: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

function EmployerShell({ onSignOut, theme, onToggleTheme }: EmployerShellProps) {
  const [employerView, setEmployerView] = useState<EmployerView>("pipeline");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const [chatIntroName, setChatIntroName] = useState<string | undefined>();
  const [chatPrefilledMsg, setChatPrefilledMsg] = useState<string | undefined>();

  const notifications = [
    { id: "n1", dot: "#C2622A", text: "Jordan Park matches Staff Data Infrastructure Eng. at 94%", time: "2h ago" },
    { id: "n2", dot: "#1D4E89", text: "Nneka Okonkwo replied to your message", time: "4h ago" },
    { id: "n3", dot: "#065F46", text: "Marcus Webb moved to Offer stage", time: "Yesterday" },
    { id: "n4", dot: "#7E22CE", text: "Sofia Reyes matches Product Manager, Data Experience at 86%", time: "2 days ago" },
  ];
  const [readNotifs, setReadNotifs] = useState<Set<string>>(new Set());
  const unreadCount = notifications.filter((n) => !readNotifs.has(n.id)).length;
  const markAllRead = () => setReadNotifs(new Set(notifications.map((n) => n.id)));

  const handleInitiateIntro = (candidateName: string) => {
    setChatIntroName(candidateName);
    setChatPrefilledMsg(
      `Hi ${candidateName}, I came across your profile on Career OS and was genuinely impressed by your trajectory — particularly your work on distributed systems and the direction your skills are heading. I think there's a strong fit between your arc and a role we're building toward. Would you be open to a brief conversation this week?`
    );
    setEmployerView("messages");
    setNotifOpen(false);
    setProfileOpen(false);
    setMobileProfileOpen(false);
  };

  const handleCloseChat = () => {
    setChatIntroName(undefined);
    setChatPrefilledMsg(undefined);
  };

  const viewLabel: Record<EmployerView, string> = {
    pipeline: "Talent Pipeline",
    matches: "Active Matches",
    roles: "Open Roles",
    messages: "Introductions",
    notifications: "Notifications",
  };

  return (
    <div className="relative h-screen overflow-hidden" style={{ background: "var(--background)", fontFamily: "var(--font-sans)" }}>

      {/* Settings drawer */}
      <EmployerSettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} onSignOut={onSignOut} />

      {/* ════════════ DESKTOP LAYOUT (lg+) ════════════ */}
      <div className="hidden lg:flex h-screen overflow-hidden">
        <Sidebar
          activeView={employerView}
          onNav={(v) => { setEmployerView(v); handleCloseChat(); }}
          onSettings={() => { setSettingsOpen(true); setNotifOpen(false); setProfileOpen(false); }}
          onProfile={() => { setSettingsOpen(true); setNotifOpen(false); setProfileOpen(false); }}
        />

        <div className="flex flex-col flex-1 min-w-0 ml-16">
          {/* Desktop Top Header */}
          <header className="flex items-center gap-4 px-6 shrink-0 relative"
            style={{ background: "var(--card)", borderBottom: "1px solid var(--border)", height: "52px", zIndex: 30 }}>
            <div className="flex items-center gap-2 mr-4 shrink-0">
              <Sparkles size={14} style={{ color: "var(--primary)" }} />
              <span style={{ fontWeight: 600, fontSize: "13px", color: "var(--foreground)", letterSpacing: "-0.01em" }}>Nexus OS</span>
              <span className="rounded px-1.5 py-0.5" style={{ background: "var(--accent)", color: "var(--muted-foreground)", fontSize: "9px", fontFamily: "var(--font-mono)", fontWeight: 500 }}>BETA</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5" style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
              <span>Workspace</span><span>/</span>
              <span style={{ color: "var(--foreground)" }}>{viewLabel[employerView]}</span>
            </div>
            {employerView === "pipeline" && (
              <div className="flex-1 flex justify-center px-8">
                <div className="flex items-center gap-2 w-full max-w-md rounded-lg px-3" style={{ background: "var(--input-background)", height: "32px" }}>
                  <Search size={13} style={{ color: "var(--muted-foreground)" }} strokeWidth={2} />
                  <input type="text" placeholder="Search candidates, skills, trajectories…" className="flex-1 bg-transparent outline-none" style={{ color: "var(--foreground)", fontSize: "12px" }} />
                  <kbd className="rounded px-1.5 py-0.5" style={{ background: "var(--card)", color: "var(--muted-foreground)", fontFamily: "var(--font-mono)", fontSize: "9px", border: "1px solid var(--border)" }}>⌘K</kbd>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 ml-auto shrink-0">
              <button
                onClick={onToggleTheme}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-accent"
                style={{ color: "var(--muted-foreground)" }}
                title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {theme === "dark" ? <Sun size={15} strokeWidth={1.8} /> : <Moon size={15} strokeWidth={1.8} />}
              </button>
              <button id="bell-btn" onClick={() => { setNotifOpen((p) => !p); setProfileOpen(false); markAllRead(); }}
                className="relative w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-accent">
                <Bell size={15} style={{ color: "var(--muted-foreground)" }} strokeWidth={1.8} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-white"
                    style={{ background: "var(--primary)", fontSize: "8px", fontFamily: "var(--font-mono)" }}>{unreadCount}</span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-14 top-12 rounded-xl z-50 overflow-hidden" style={{ width: 320, background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 12px 40px rgba(0,0,0,0.12)" }}>
                  <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>Notifications</p>
                    <p style={{ fontSize: 10, color: "var(--muted-foreground)", marginTop: 1 }}>All caught up on 4 alerts</p>
                  </div>
                  {notifications.map((n) => (
                    <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-accent transition-colors" style={{ borderBottom: "1px solid var(--border)" }}>
                      <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: n.dot }} />
                      <div className="flex-1">
                        <p style={{ fontSize: 12, color: "var(--foreground)", lineHeight: 1.5 }}>{n.text}</p>
                        <p style={{ fontSize: 10, color: "var(--muted-foreground)", fontFamily: "var(--font-mono)", marginTop: 2 }}>{n.time}</p>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setNotifOpen(false)} className="w-full py-2.5 text-center hover:bg-accent transition-colors" style={{ fontSize: 11, color: "var(--primary)", fontWeight: 500 }}>
                    Mark all as read
                  </button>
                </div>
              )}
              <div className="relative flex items-center gap-2 rounded-lg px-2.5 cursor-pointer hover:bg-accent transition-colors"
                style={{ border: "1px solid var(--border)", height: "32px" }}
                onClick={() => { setProfileOpen((p) => !p); setNotifOpen(false); }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white"
                  style={{ background: "#7C5C4A", fontFamily: "var(--font-mono)", fontSize: "9px", fontWeight: 500 }}>AK</div>
                <span style={{ fontSize: "12px", color: "var(--foreground)", fontWeight: 500 }}>Arjun K.</span>
                <ChevronDown size={11} style={{ color: "var(--muted-foreground)", transform: profileOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                {profileOpen && (
                  <div className="absolute right-0 top-9 rounded-xl z-50 overflow-hidden" style={{ width: 200, background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 12px 40px rgba(0,0,0,0.12)" }}>
                    <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)" }}>Arjun Kumar</p>
                      <p style={{ fontSize: 10, color: "var(--muted-foreground)" }}>arjun@nexusos.io</p>
                    </div>
                    <button className="w-full text-left px-4 py-2.5 hover:bg-accent transition-colors" style={{ fontSize: 12, color: "var(--foreground)" }}
                      onClick={() => { setProfileOpen(false); setSettingsOpen(true); }}>
                      Account Settings
                    </button>
                    <div style={{ borderTop: "1px solid var(--border)" }}>
                      <button onClick={() => { setProfileOpen(false); onSignOut(); }}
                        className="w-full text-left px-4 py-2.5 hover:bg-accent transition-colors flex items-center gap-2"
                        style={{ fontSize: 12, color: "#DC2626" }}>
                        <LogOut size={12} strokeWidth={2} />Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Desktop views */}
          <div className="flex flex-1 overflow-hidden">
            {employerView === "pipeline" && <PipelineView onInitiateIntro={handleInitiateIntro} />}
            {employerView === "matches" && <ActiveMatchesView onFastTrack={handleInitiateIntro} />}
            {employerView === "roles" && <OpenRolesView />}
            {employerView === "messages" && (
              <EmployerChatbox candidateName={chatIntroName} prefilledMessage={chatPrefilledMsg} onClose={() => setEmployerView("pipeline")} />
            )}
          </div>
        </div>
      </div>

      {/* ════════════ MOBILE LAYOUT (below lg) ════════════ */}
      <div className="flex lg:hidden flex-col h-screen overflow-hidden" style={{ background: "var(--background)" }}>

        {/* Mobile top bar */}
        <header
          className="flex items-center gap-3 px-4 shrink-0"
          style={{ height: 52, background: "var(--card)", borderBottom: "1px solid var(--border)", zIndex: 20 }}
        >
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--primary)" }}>
            <Brain size={14} color="#fff" strokeWidth={2} />
          </div>
          <div className="flex items-center gap-1.5 flex-1" style={{ fontSize: 13 }}>
            <span style={{ fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.01em" }}>Nexus OS</span>
            <span style={{ color: "var(--muted-foreground)" }}>/</span>
            <span style={{ color: "var(--foreground)", fontWeight: 500 }}>{viewLabel[employerView]}</span>
          </div>
          {/* Mini profile chip */}
          <div
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 cursor-pointer"
            style={{ background: "var(--accent)", border: "1px solid var(--border)" }}
            onClick={() => setSettingsOpen(true)}
          >
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-white" style={{ background: "#7C5C4A", fontFamily: "var(--font-mono)", fontSize: 8, fontWeight: 700 }}>AK</div>
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--foreground)" }}>Arjun K.</span>
          </div>
        </header>

        {/* Mobile content area */}
        <div className="flex-1 overflow-hidden relative">
          {employerView === "pipeline" && <MobilePipelineView onInitiateIntro={handleInitiateIntro} />}
          {employerView === "matches" && (
            <div className="h-full overflow-y-auto" style={{ scrollbarWidth: "none", paddingBottom: 96 }}>
              <ActiveMatchesView onFastTrack={handleInitiateIntro} />
            </div>
          )}
          {employerView === "roles" && (
            <div className="h-full overflow-y-auto" style={{ scrollbarWidth: "none", paddingBottom: 96 }}>
              <OpenRolesView />
            </div>
          )}
          {employerView === "messages" && (
            <EmployerChatbox candidateName={chatIntroName} prefilledMessage={chatPrefilledMsg} onClose={() => setEmployerView("pipeline")} />
          )}
          {employerView === "notifications" && (
            <div className="flex flex-col h-full overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-4 shrink-0" style={{ borderBottom: "1px solid var(--border)", background: "var(--card)" }}>
                <div>
                  <p style={{ fontSize: 16, fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.01em" }}>Notifications</p>
                  <p style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 2 }}>{notifications.length} recent alerts</p>
                </div>
                <button onClick={markAllRead} style={{ fontSize: 11, color: "var(--primary)", fontWeight: 500 }}>Mark all read</button>
              </div>
              {/* List */}
              <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none", paddingBottom: 96 }}>
                {notifications.map((n) => (
                  <div key={n.id} className="flex items-start gap-4 px-4 py-4 hover:bg-accent transition-colors" style={{ borderBottom: "1px solid var(--border)" }}>
                    <span className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0" style={{ background: n.dot }} />
                    <div className="flex-1">
                      <p style={{ fontSize: 13, color: "var(--foreground)", lineHeight: 1.6 }}>{n.text}</p>
                      <p style={{ fontSize: 11, color: "var(--muted-foreground)", fontFamily: "var(--font-mono)", marginTop: 4 }}>{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Mobile Floating Bottom Nav ── */}
        <div className="fixed left-1/2 z-50" style={{ bottom: 24, transform: "translateX(-50%)" }}>
          <div
            className="flex items-center px-3 py-2"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 999,
              backdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.04) inset",
              gap: 4,
            }}
          >
            {/* 4 tab icons */}
            {sidebarNav.map(({ id, icon: Icon, label }) => {
              const active = employerView === id;
              return (
                <button
                  key={id}
                  onClick={() => { setEmployerView(id); handleCloseChat(); setMobileProfileOpen(false); }}
                  title={label}
                  className="flex items-center justify-center transition-all duration-150"
                  style={{
                    width: 48, height: 48, borderRadius: 999,
                    background: active ? "var(--sidebar-accent)" : "transparent",
                    color: active ? "var(--primary)" : "var(--muted-foreground)",
                  }}
                >
                  <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
                </button>
              );
            })}

            {/* Divider */}
            <div style={{ width: 1, height: 28, background: "var(--border)", margin: "0 4px" }} />

            {/* Bell — navigates to notifications tab */}
            <button
              onClick={() => { setEmployerView("notifications"); setMobileProfileOpen(false); markAllRead(); }}
              className="relative flex items-center justify-center transition-all duration-150"
              style={{
                width: 48, height: 48, borderRadius: 999,
                background: employerView === "notifications" ? "var(--sidebar-accent)" : "transparent",
                color: employerView === "notifications" ? "var(--primary)" : "var(--muted-foreground)",
              }}
            >
              <Bell size={20} strokeWidth={1.8} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                  style={{ background: "var(--primary)", fontSize: "8px", fontFamily: "var(--font-mono)", color: "#fff", fontWeight: 700 }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Profile */}
            <button
              onClick={() => { setMobileProfileOpen((p) => !p); }}
              className="flex items-center justify-center transition-all duration-150"
              style={{ width: 48, height: 48, borderRadius: 999, background: mobileProfileOpen ? "var(--sidebar-accent)" : "transparent" }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                style={{ background: "#7C5C4A", fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700 }}>
                AK
              </div>
            </button>
          </div>

          {/* Mobile profile panel */}
          {mobileProfileOpen && (
            <div
              className="absolute left-1/2 rounded-2xl overflow-hidden"
              style={{ bottom: 72, transform: "translateX(-50%)", width: 240, background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 -8px 40px rgba(0,0,0,0.18)" }}
            >
              <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>Arjun Kumar</p>
                <p style={{ fontSize: 10, color: "var(--muted-foreground)" }}>arjun@nexusos.io · Employer</p>
              </div>
              <button
                className="w-full text-left px-4 py-3 flex items-center gap-2 hover:bg-accent transition-colors"
                style={{ fontSize: 12, color: "var(--foreground)" }}
                onClick={() => { setMobileProfileOpen(false); setSettingsOpen(true); }}
              >
                <Settings size={13} style={{ color: "var(--muted-foreground)" }} strokeWidth={1.8} />
                Account Settings
              </button>
              <div style={{ borderTop: "1px solid var(--border)" }}>
                <button
                  onClick={() => { setMobileProfileOpen(false); onSignOut(); }}
                  className="w-full text-left px-4 py-3 flex items-center gap-2"
                  style={{ fontSize: 12, color: "#DC2626" }}
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

import React from "react";

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, color: "#DC2626", background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 8, margin: 24, fontFamily: "monospace" }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>React Render Crash</h3>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, lineHeight: 1.5 }}>{this.state.error?.stack || this.state.error?.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ─── Root App — auth router ─── */
export default function App() {
  const [authRole, setAuthRole] = useState<AuthRole | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  if (initError) {
    return (
      <div style={{ padding: 24, color: "#DC2626", background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 8, margin: 24, fontFamily: "monospace" }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>NexusOS Startup Error</h3>
        <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, lineHeight: 1.5 }}>{initError}</pre>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      {authRole === null && <LoginPage onLogin={(role) => setAuthRole(role)} />}
      {authRole === "employee" && (
        <EmployeeShell
          onSignOut={() => setAuthRole(null)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
      {authRole === "employer" && (
        <EmployerShell
          onSignOut={() => setAuthRole(null)}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
    </ErrorBoundary>
  );
}
