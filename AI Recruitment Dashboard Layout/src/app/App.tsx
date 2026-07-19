import { useState } from "react";
import {
  Search, Bell, ChevronDown, SlidersHorizontal, ArrowUpDown,
  Filter, Sparkles, Building2, User, LayoutList, Zap, Briefcase,
  Settings, Brain, MessageSquareMore, ChevronRight,
} from "lucide-react";
import { CandidateCard, type Candidate } from "./components/CandidateCard";
import { InsightPanel } from "./components/InsightPanel";
import { EmployeeView } from "./components/EmployeeView";
import { EmployerChatbox } from "./components/EmployerChatbox";
import { OpenRolesView } from "./components/OpenRolesView";
import { ActiveMatchesView } from "./components/ActiveMatchesView";

type AppMode = "employer" | "employee";
type EmployerView = "pipeline" | "matches" | "roles" | "messages";

const candidates: Candidate[] = [
  {
    id: "c1", initials: "PS", avatarBg: "#7C5C4A", name: "Priya Sharma",
    currentTitle: "Senior Frontend Engineer",
    trajectoryScore: 94,
    trajectoryLabel: "Moving toward product architecture & distributed systems",
    momentum: "rising", phase: "Ready for Pivot",
    skills: ["React Ecosystem", "API Design", "Systems Thinking", "TypeScript", "GraphQL"],
    location: "Remote — Bangalore", yearsExp: 7,
  },
  {
    id: "c2", initials: "MW", avatarBg: "#4A6741", name: "Marcus Webb",
    currentTitle: "Full-Stack Generalist",
    trajectoryScore: 88,
    trajectoryLabel: "High-velocity growth through consecutive early-stage environments",
    momentum: "rising", phase: "Accelerating",
    skills: ["Node.js", "ML Pipelines", "Product Sense", "Python", "AWS"],
    location: "London, UK", yearsExp: 5,
  },
  {
    id: "c3", initials: "NO", avatarBg: "#4A5568", name: "Nneka Okonkwo",
    currentTitle: "UX Researcher",
    trajectoryScore: 91,
    trajectoryLabel: "Bridging cognitive science with AI product interaction design",
    momentum: "pivoting", phase: "Ready for Pivot",
    skills: ["Cognitive UX", "Research Methods", "AI Explainability", "Figma", "Mixed Methods"],
    location: "Lagos, NG", yearsExp: 6,
  },
  {
    id: "c4", initials: "DL", avatarBg: "#6B4F6B", name: "David Lin",
    currentTitle: "Data Engineer",
    trajectoryScore: 82,
    trajectoryLabel: "Ops-to-data transition with rare business context fluency",
    momentum: "stable", phase: "Deep Specializing",
    skills: ["dbt", "Airflow", "Snowflake", "SQL", "Business Analysis"],
    location: "Austin, TX", yearsExp: 8,
  },
  {
    id: "c5", initials: "SR", avatarBg: "#7A4545", name: "Sofia Reyes",
    currentTitle: "Product Manager",
    trajectoryScore: 86,
    trajectoryLabel: "Behavioral economics background yielding evidence-first PM instincts",
    momentum: "rising", phase: "Exploring",
    skills: ["Behavioral Econ", "Roadmap Strategy", "A/B Testing", "SQL", "Storytelling"],
    location: "Mexico City, MX", yearsExp: 5,
  },
];

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

/* ─── Employer Sidebar ─── */
function Sidebar({ activeView, onNav }: { activeView: EmployerView; onNav: (v: EmployerView) => void }) {
  return (
    <aside className="fixed left-0 top-0 h-screen w-16 flex flex-col items-center py-5 z-40"
      style={{ background: "var(--sidebar)", borderRight: "1px solid var(--sidebar-border)" }}>
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
        <button title="Settings" className="group relative w-10 h-10 rounded flex items-center justify-center transition-colors duration-150"
          style={{ color: "var(--sidebar-foreground)" }}>
          <Settings size={18} strokeWidth={1.8} />
        </button>
        <div className="w-8 h-8 rounded-full flex items-center justify-center mt-3 text-xs"
          style={{ background: "#3D342F", color: "var(--sidebar-foreground)", fontFamily: "var(--font-mono)" }}>
          AK
        </div>
      </div>
    </aside>
  );
}

/* ─── Pipeline view (candidate list + insight panel) ─── */
interface PipelineProps {
  onInitiateIntro: (name: string) => void;
}

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

  const filtered = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.currentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  ).filter((c) => activePhaseFilter === "All" || c.phase === activePhaseFilter)
   .filter((c) => activeMomentumFilter === "All" || c.momentum === activeMomentumFilter);

  const sorted = sortCandidates(filtered, sortBy);

  const phaseOptions = ["All", "Ready for Pivot", "Accelerating", "Exploring", "Deep Specializing"];
  const momentumOptions = ["All", "rising", "pivoting", "stable"];

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left Column — 60% */}
      <div className="flex flex-col overflow-hidden" style={{ width: "60%", borderRight: "1px solid var(--border)" }}>
        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 shrink-0"
          style={{ borderBottom: "1px solid var(--border)", background: "var(--card)", height: "48px" }}>
          <div className="flex items-baseline gap-3">
            <h2 style={{ fontWeight: 600, color: "var(--foreground)", fontSize: "13px" }}>Talent Pipeline</h2>
            <span style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>{sorted.length} candidates</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => { setFilterOpen((p) => !p); }}
              className="flex items-center gap-1 rounded-md px-2.5 transition-colors hover:bg-accent"
              style={{ border: `1px solid ${filterOpen ? "var(--primary)" : "var(--border)"}`, color: filterOpen ? "var(--primary)" : "var(--muted-foreground)", height: "28px", fontSize: "11px", background: filterOpen ? "rgba(194,98,42,0.06)" : "transparent" }}
            >
              <Filter size={10} strokeWidth={2} />{filterOpen ? "Filters ✓" : "Filter"}
            </button>
            <div className="relative">
              <button onClick={() => setShowSortDropdown((p) => !p)}
                className="flex items-center gap-1 rounded-md px-2.5 transition-colors hover:bg-accent"
                style={{ border: "1px solid var(--border)", color: "var(--muted-foreground)", height: "28px", fontSize: "11px" }}>
                <ArrowUpDown size={10} strokeWidth={2} />
                {sortBy}
                <ChevronDown size={9} />
              </button>
              {showSortDropdown && (
                <div className="absolute right-0 top-8 rounded-lg py-1 z-50"
                  style={{ background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", minWidth: "190px" }}>
                  {sortOptions.map((opt) => (
                    <button key={opt} className="w-full text-left px-3 py-2 transition-colors hover:bg-accent"
                      style={{ fontSize: "12px", color: opt === sortBy ? "var(--primary)" : "var(--foreground)", fontWeight: opt === sortBy ? 500 : 400 }}
                      onClick={() => { setSortBy(opt); setShowSortDropdown(false); }}>
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => setViewMode((p) => p === "card" ? "compact" : "card")}
              className="flex items-center gap-1 rounded-md px-2.5 transition-colors hover:bg-accent"
              style={{ border: "1px solid var(--border)", color: "var(--muted-foreground)", height: "28px", fontSize: "11px", background: viewMode === "compact" ? "var(--accent)" : "transparent" }}
            >
              <SlidersHorizontal size={10} strokeWidth={2} />{viewMode === "compact" ? "Cards" : "Compact"}
            </button>
          </div>
        </div>

        {/* Inline search within pipeline */}
        <div className="px-3 py-2 shrink-0" style={{ background: "var(--card)", borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 rounded-md px-3" style={{ background: "var(--input-background)", height: "30px" }}>
            <Search size={11} style={{ color: "var(--muted-foreground)" }} strokeWidth={2} />
            <input type="text" placeholder="Filter by name, skill, title…" value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none" style={{ fontSize: "11px", color: "var(--foreground)" }} />
          </div>
        </div>

        {/* Filter panel */}
        {filterOpen && (
          <div className="px-4 py-3 shrink-0 space-y-2.5" style={{ background: "var(--card)", borderBottom: "1px solid var(--border)" }}>
            <div>
              <p style={{ fontSize: 9, color: "var(--muted-foreground)", fontFamily: "var(--font-mono)", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em" }}>Phase</p>
              <div className="flex gap-1 flex-wrap">
                {phaseOptions.map((p) => (
                  <button key={p} onClick={() => setActivePhaseFilter(p)}
                    className="rounded-full px-2.5 py-0.5 transition-colors"
                    style={{ fontSize: 10, fontWeight: activePhaseFilter === p ? 600 : 400, background: activePhaseFilter === p ? "var(--primary)" : "var(--secondary)", color: activePhaseFilter === p ? "#fff" : "var(--muted-foreground)", border: activePhaseFilter === p ? "none" : "1px solid var(--border)" }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize: 9, color: "var(--muted-foreground)", fontFamily: "var(--font-mono)", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em" }}>Momentum</p>
              <div className="flex gap-1 flex-wrap">
                {momentumOptions.map((m) => (
                  <button key={m} onClick={() => setActiveMomentumFilter(m)}
                    className="rounded-full px-2.5 py-0.5 transition-colors"
                    style={{ fontSize: 10, fontWeight: activeMomentumFilter === m ? 600 : 400, background: activeMomentumFilter === m ? "var(--primary)" : "var(--secondary)", color: activeMomentumFilter === m ? "#fff" : "var(--muted-foreground)", border: activeMomentumFilter === m ? "none" : "1px solid var(--border)" }}>
                    {m === "All" ? "All" : m.charAt(0).toUpperCase() + m.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Candidate list */}
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

        {/* Footer phase summary */}
        <div className="flex items-center gap-5 px-5 shrink-0"
          style={{ borderTop: "1px solid var(--border)", background: "var(--card)", height: "40px" }}>
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

      {/* Right Column — 40% */}
      <div className="flex flex-col overflow-hidden" style={{ width: "40%", background: "var(--card)" }}>
        <InsightPanel candidate={selectedCandidate} onInitiateIntro={onInitiateIntro} />
      </div>
    </div>
  );
}

/* ─── Root App ─── */
export default function App() {
  /* MARKER-MAKE-KIT-INVOKED */
  const [appMode, setAppMode] = useState<AppMode>("employer");
  const [employerView, setEmployerView] = useState<EmployerView>("pipeline");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [chatIntroName, setChatIntroName] = useState<string | undefined>();
  const [chatPrefilledMsg, setChatPrefilledMsg] = useState<string | undefined>();

  const notifications = [
    { id: "n1", dot: "#C2622A", text: "Jordan Park matches Staff Data Infrastructure Eng. at 94%", time: "2h ago" },
    { id: "n2", dot: "#1D4E89", text: "Nneka Okonkwo replied to your message", time: "4h ago" },
    { id: "n3", dot: "#065F46", text: "Marcus Webb moved to Offer stage", time: "Yesterday" },
    { id: "n4", dot: "#7E22CE", text: "Sofia Reyes matches Product Manager, Data Experience at 86%", time: "2 days ago" },
  ];
  const [readNotifs, setReadNotifs] = useState<Set<string>>(new Set());

  const handleInitiateIntro = (candidateName: string) => {
    setChatIntroName(candidateName);
    setChatPrefilledMsg(
      `Hi ${candidateName}, I came across your profile on Career OS and was genuinely impressed by your trajectory — particularly your work on distributed systems and the direction your skills are heading. I think there's a strong fit between your arc and a role we're building toward. Would you be open to a brief conversation this week?`
    );
    setEmployerView("messages");
    setNotifOpen(false);
    setProfileOpen(false);
  };

  const handleCloseChat = () => {
    setChatIntroName(undefined);
    setChatPrefilledMsg(undefined);
  };

  const unreadCount = notifications.filter((n) => !readNotifs.has(n.id)).length;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--background)", fontFamily: "var(--font-sans)" }}>
      {appMode === "employer" && (
        <Sidebar activeView={employerView} onNav={(v) => { setEmployerView(v); handleCloseChat(); }} />
      )}

      <div className={`flex flex-col flex-1 min-w-0 ${appMode === "employer" ? "ml-16" : ""}`}>
        {/* Top Header */}
        <header className="flex items-center gap-4 px-6 shrink-0"
          style={{ background: "var(--card)", borderBottom: "1px solid var(--border)", height: "52px", zIndex: 30 }}>
          <div className="flex items-center gap-2 mr-4 shrink-0">
            <Sparkles size={14} style={{ color: "var(--primary)" }} />
            <span style={{ fontWeight: 600, fontSize: "13px", color: "var(--foreground)", letterSpacing: "-0.01em" }}>Career OS</span>
            <span className="rounded px-1.5 py-0.5" style={{ background: "var(--accent)", color: "var(--muted-foreground)", fontSize: "9px", fontFamily: "var(--font-mono)", fontWeight: 500 }}>BETA</span>
          </div>

          {appMode === "employer" && (
            <div className="hidden md:flex items-center gap-1.5" style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
              <span>Workspace</span>
              <span>/</span>
              <span style={{ color: "var(--foreground)" }}>
                {employerView === "pipeline" && "Talent Pipeline"}
                {employerView === "matches" && "Active Matches"}
                {employerView === "roles" && "Open Roles"}
                {employerView === "messages" && "Direct Introductions"}
              </span>
            </div>
          )}

          {appMode === "employer" && employerView === "pipeline" && (
            <div className="flex-1 flex justify-center px-8">
              <div className="flex items-center gap-2 w-full max-w-md rounded-lg px-3"
                style={{ background: "var(--input-background)", height: "32px", border: "1px solid transparent" }}>
                <Search size={13} style={{ color: "var(--muted-foreground)" }} strokeWidth={2} />
                <input type="text" placeholder="Search candidates, skills, trajectories…"
                  className="flex-1 bg-transparent outline-none" style={{ color: "var(--foreground)", fontSize: "12px" }} />
                <kbd className="rounded px-1.5 py-0.5" style={{ background: "var(--card)", color: "var(--muted-foreground)", fontFamily: "var(--font-mono)", fontSize: "9px", border: "1px solid var(--border)" }}>⌘K</kbd>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 ml-auto shrink-0">
            {/* Mode switcher */}
            <div className="flex items-center rounded-full p-0.5" style={{ background: "var(--input-background)", border: "1px solid var(--border)" }}>
              <button onClick={() => setAppMode("employer")}
                className="flex items-center gap-1.5 rounded-full px-3 transition-all duration-200"
                style={{ height: "26px", fontSize: "11px", fontWeight: appMode === "employer" ? 600 : 400, background: appMode === "employer" ? "var(--card)" : "transparent", color: appMode === "employer" ? "var(--foreground)" : "var(--muted-foreground)", boxShadow: appMode === "employer" ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
                <Building2 size={10} strokeWidth={2} />Employer
              </button>
              <button onClick={() => setAppMode("employee")}
                className="flex items-center gap-1.5 rounded-full px-3 transition-all duration-200"
                style={{ height: "26px", fontSize: "11px", fontWeight: appMode === "employee" ? 600 : 400, background: appMode === "employee" ? "#111" : "transparent", color: appMode === "employee" ? "#E4E4E7" : "var(--muted-foreground)", boxShadow: appMode === "employee" ? "0 1px 4px rgba(0,0,0,0.22)" : "none" }}>
                <User size={10} strokeWidth={2} />Employee
              </button>
            </div>

            <button
              id="bell-btn"
              onClick={() => { setNotifOpen((p) => !p); setProfileOpen(false); setReadNotifs(new Set(notifications.map((n) => n.id))); }}
              className="relative w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-accent"
            >
              <Bell size={15} style={{ color: "var(--muted-foreground)" }} strokeWidth={1.8} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-white"
                  style={{ background: "var(--primary)", fontSize: "8px", fontFamily: "var(--font-mono)" }}>
                  {unreadCount}
                </span>
              )}
            </button>
            {/* Notification dropdown */}
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
            <div
              className="relative flex items-center gap-2 rounded-lg px-2.5 cursor-pointer hover:bg-accent transition-colors"
              style={{ border: "1px solid var(--border)", height: "32px" }}
              onClick={() => { setProfileOpen((p) => !p); setNotifOpen(false); }}
            >
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white"
                style={{ background: "#7C5C4A", fontFamily: "var(--font-mono)", fontSize: "9px", fontWeight: 500 }}>AK</div>
              <span style={{ fontSize: "12px", color: "var(--foreground)", fontWeight: 500 }}>Arjun K.</span>
              <ChevronDown size={11} style={{ color: "var(--muted-foreground)", transform: profileOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              {/* Profile dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-9 rounded-xl z-50 overflow-hidden" style={{ width: 200, background: "var(--card)", border: "1px solid var(--border)", boxShadow: "0 12px 40px rgba(0,0,0,0.12)" }}>
                  <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)" }}>Arjun Kumar</p>
                    <p style={{ fontSize: 10, color: "var(--muted-foreground)" }}>arjun@company.io</p>
                  </div>
                  {[
                    { label: "Account Settings", action: () => setProfileOpen(false) },
                    { label: "Switch to Employee View", action: () => { setAppMode("employee"); setProfileOpen(false); } },
                  ].map(({ label, action }) => (
                    <button key={label} onClick={action} className="w-full text-left px-4 py-2.5 hover:bg-accent transition-colors" style={{ fontSize: 12, color: "var(--foreground)" }}>
                      {label}
                    </button>
                  ))}
                  <div style={{ borderTop: "1px solid var(--border)" }}>
                    <button onClick={() => setProfileOpen(false)} className="w-full text-left px-4 py-2.5 hover:bg-accent transition-colors" style={{ fontSize: 12, color: "#DC2626" }}>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── Employee mode ── */}
        {appMode === "employee" && (
          <div className="flex-1 flex items-center justify-center overflow-auto"
            style={{ background: "#080806", padding: "40px 0", backgroundImage: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(163,230,53,0.04) 0%, transparent 70%)" }}>
            <EmployeeView />
          </div>
        )}

        {/* ── Employer views ── */}
        {appMode === "employer" && (
          <div className="flex flex-1 overflow-hidden">
            {employerView === "pipeline" && <PipelineView onInitiateIntro={handleInitiateIntro} />}
            {employerView === "matches" && <ActiveMatchesView onFastTrack={handleInitiateIntro} />}
            {employerView === "roles" && <OpenRolesView />}
            {employerView === "messages" && (
              <EmployerChatbox
                candidateName={chatIntroName}
                prefilledMessage={chatPrefilledMsg}
                onClose={() => setEmployerView("pipeline")}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
