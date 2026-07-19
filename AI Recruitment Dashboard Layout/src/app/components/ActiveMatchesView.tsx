import { useState } from "react";
import { TrendingUp, Zap, CheckCircle2, ArrowUpRight, Filter, X } from "lucide-react";

interface Match {
  id: string;
  candidateInitials: string;
  candidateAvatarBg: string;
  candidateName: string;
  candidateCurrentTitle: string;
  roleTitle: string;
  team: string;
  trajectoryScore: number;
  momentumSignal: string;
  phase: string;
  phaseColor: string;
  phaseBg: string;
  sharedSkills: string[];
  aiRationale: string;
  matchedAt: string;
  status: "new" | "reviewing" | "introduced";
}

const initialMatches: Match[] = [
  {
    id: "m1",
    candidateInitials: "JP",
    candidateAvatarBg: "#4A5568",
    candidateName: "Jordan Park",
    candidateCurrentTitle: "Sr. Portfolio Optimization Specialist",
    roleTitle: "Staff Data Infrastructure Eng.",
    team: "Platform · Infrastructure",
    trajectoryScore: 94,
    momentumSignal: "OSS traction accelerating — 2 artifacts in 90 days",
    phase: "Ready for Pivot",
    phaseColor: "#C2622A",
    phaseBg: "#FFF3E8",
    sharedSkills: ["Apache Kafka", "Delta Lake", "Rust", "Distributed Systems"],
    aiRationale: "Jordan's open-source output maps directly to the reliability scope of this role. Their C++ infra work and Kafka lag exporter demonstrate production-grade systems thinking — not just familiarity.",
    matchedAt: "2 hours ago",
    status: "new",
  },
  {
    id: "m2",
    candidateInitials: "PS",
    candidateAvatarBg: "#7C5C4A",
    candidateName: "Priya Sharma",
    candidateCurrentTitle: "Senior Frontend Engineer",
    roleTitle: "AI Platform Lead",
    team: "AI · Applied Research",
    trajectoryScore: 88,
    momentumSignal: "API design pattern shift detected — 3 consecutive projects",
    phase: "Accelerating",
    phaseColor: "#065F46",
    phaseBg: "#ECFDF5",
    sharedSkills: ["GraphQL Federation", "Systems Design", "TypeScript", "LLM APIs"],
    aiRationale: "Priya's arc shows a consistent pull toward orchestration and cross-service contracts. Her recent API governance work is a direct precursor to the platform design mandate of this role.",
    matchedAt: "Yesterday",
    status: "reviewing",
  },
  {
    id: "m3",
    candidateInitials: "MW",
    candidateAvatarBg: "#4A6741",
    candidateName: "Marcus Webb",
    candidateCurrentTitle: "Full-Stack Generalist",
    roleTitle: "AI Platform Lead",
    team: "AI · Applied Research",
    trajectoryScore: 82,
    momentumSignal: "LLM tooling commits up 340% over 60 days",
    phase: "Accelerating",
    phaseColor: "#065F46",
    phaseBg: "#ECFDF5",
    sharedSkills: ["LangChain", "FastAPI", "Hugging Face", "Python"],
    aiRationale: "Marcus is building LLM tooling at an unusual pace for a generalist. The breadth of his stack combined with his 0→1 history makes him a rare fit for a greenfield AI platform.",
    matchedAt: "3 days ago",
    status: "introduced",
  },
  {
    id: "m4",
    candidateInitials: "SR",
    candidateAvatarBg: "#7A4545",
    candidateName: "Sofia Reyes",
    candidateCurrentTitle: "Product Manager",
    roleTitle: "Product Manager, Data Experience",
    team: "Product · Data",
    trajectoryScore: 86,
    momentumSignal: "Behavioral research methods converging with data product context",
    phase: "Exploring",
    phaseColor: "#7E22CE",
    phaseBg: "#FDF4FF",
    sharedSkills: ["SQL Analytics", "A/B Testing", "Amplitude", "Quantitative Research"],
    aiRationale: "Sofia's behavioral economics foundation gives her a structural advantage in data product intuition. She understands why users misread data — not just what to build.",
    matchedAt: "4 days ago",
    status: "new",
  },
];

const statusConfig = {
  new: { label: "New Match", color: "#C2622A", bg: "#FFF3E8" },
  reviewing: { label: "Reviewing", color: "#1D4E89", bg: "#EFF6FF" },
  introduced: { label: "Introduced", color: "#065F46", bg: "#ECFDF5" },
};

interface Props {
  onFastTrack?: (candidateName: string) => void;
}

export function ActiveMatchesView({ onFastTrack }: Props) {
  const [matchData, setMatchData] = useState<Match[]>(initialMatches);
  const [selected, setSelected] = useState<Match>(matchData[0]);
  const [filterPhase, setFilterPhase] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterOpen, setFilterOpen] = useState(false);

  const phases = ["All", "Ready for Pivot", "Accelerating", "Exploring"];
  const statusOptions: Array<"All" | "new" | "reviewing" | "introduced"> = ["All", "new", "reviewing", "introduced"];

  const filtered = matchData
    .filter((m) => filterPhase === "All" || m.phase === filterPhase)
    .filter((m) => filterStatus === "All" || m.status === filterStatus);

  const updateMatchStatus = (id: string, status: Match["status"]) => {
    setMatchData((prev) => prev.map((m) => m.id === id ? { ...m, status } : m));
    setSelected((prev) => prev.id === id ? { ...prev, status } : prev);
  };

  const handleFastTrack = () => {
    onFastTrack?.(selected.candidateName);
    updateMatchStatus(selected.id, "introduced");
  };

  const handleViewProfile = () => {
    if (selected.status === "new") {
      updateMatchStatus(selected.id, "reviewing");
    }
  };

  // Keep selected in sync with matchData
  const liveSelected = matchData.find((m) => m.id === selected.id) ?? selected;

  return (
    <div className="flex h-full overflow-hidden" style={{ fontFamily: "var(--font-sans)" }}>
      {/* Left: match list */}
      <div className="flex flex-col overflow-hidden" style={{ width: "42%", borderRight: "1px solid var(--border)" }}>
        {/* Toolbar */}
        <div className="px-4 py-3 shrink-0" style={{ borderBottom: "1px solid var(--border)", background: "var(--card)" }}>
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <h3 style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)" }}>Active Matches</h3>
              <p style={{ fontSize: 10, color: "var(--muted-foreground)", marginTop: 1 }}>{filtered.length} live pairings</p>
            </div>
            <button
              onClick={() => setFilterOpen((p) => !p)}
              className="flex items-center gap-1 rounded-md px-2 py-1 transition-colors"
              style={{
                border: `1px solid ${filterOpen ? "var(--primary)" : "var(--border)"}`,
                fontSize: 10,
                color: filterOpen ? "var(--primary)" : "var(--muted-foreground)",
                background: filterOpen ? "rgba(194,98,42,0.06)" : "transparent",
              }}
            >
              {filterOpen ? <X size={9} strokeWidth={2.5} /> : <Filter size={9} strokeWidth={2} />}
              {filterOpen ? "Close" : "Filter"}
            </button>
          </div>

          {/* Status filter row (toggle) */}
          {filterOpen && (
            <div className="mb-2.5 p-2 rounded-lg" style={{ background: "var(--background)", border: "1px solid var(--border)" }}>
              <p style={{ fontSize: 9, color: "var(--muted-foreground)", fontFamily: "var(--font-mono)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Status</p>
              <div className="flex gap-1 flex-wrap">
                {statusOptions.map((s) => {
                  const cfg = s === "All" ? null : statusConfig[s];
                  return (
                    <button
                      key={s}
                      onClick={() => setFilterStatus(s)}
                      className="rounded-full px-2.5 py-0.5 transition-colors"
                      style={{
                        fontSize: 9,
                        fontWeight: filterStatus === s ? 600 : 400,
                        background: filterStatus === s ? (cfg?.bg ?? "var(--primary)") : "var(--secondary)",
                        color: filterStatus === s ? (cfg?.color ?? "#fff") : "var(--muted-foreground)",
                        border: filterStatus === s ? `1px solid ${cfg?.color ?? "var(--primary)"}` : "1px solid var(--border)",
                      }}
                    >
                      {s === "All" ? "All" : cfg!.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Phase pills */}
          <div className="flex gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {phases.map((p) => (
              <button
                key={p}
                onClick={() => setFilterPhase(p)}
                className="rounded-full px-2.5 py-0.5 shrink-0 transition-colors"
                style={{
                  fontSize: 10,
                  fontWeight: filterPhase === p ? 600 : 400,
                  background: filterPhase === p ? "var(--primary)" : "var(--secondary)",
                  color: filterPhase === p ? "#fff" : "var(--muted-foreground)",
                  border: filterPhase === p ? "none" : "1px solid var(--border)",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-2">
              <Filter size={18} style={{ color: "var(--muted-foreground)" }} strokeWidth={1.5} />
              <p style={{ fontSize: 11, color: "var(--muted-foreground)" }}>No matches for current filters</p>
            </div>
          ) : filtered.map((match) => {
            const active = match.id === liveSelected.id;
            const status = statusConfig[match.status];
            return (
              <button
                key={match.id}
                onClick={() => setSelected(match)}
                className="w-full text-left px-4 py-3.5 transition-colors"
                style={{
                  borderBottom: "1px solid var(--border)",
                  background: active ? "var(--background)" : "var(--card)",
                  borderLeft: active ? "2px solid var(--primary)" : "2px solid transparent",
                }}
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs text-white" style={{ background: match.candidateAvatarBg, fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600 }}>
                    {match.candidateInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)" }}>{match.candidateName}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, color: "var(--primary)", fontFamily: "var(--font-mono)" }}>{match.trajectoryScore}%</span>
                    </div>
                    <p style={{ fontSize: 10, color: "var(--muted-foreground)", marginTop: 1 }} className="truncate">{match.roleTitle}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="rounded px-1.5 py-0.5" style={{ fontSize: 9, fontWeight: 500, background: status.bg, color: status.color }}>
                        {status.label}
                      </span>
                      <span style={{ fontSize: 9, color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>{match.matchedAt}</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: match detail */}
      <div className="flex flex-col flex-1 overflow-hidden" style={{ background: "var(--background)" }}>
        {/* Header */}
        <div className="px-5 py-4 shrink-0" style={{ background: "var(--card)", borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ background: liveSelected.candidateAvatarBg, fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600 }}>
              {liveSelected.candidateInitials}
            </div>
            <div className="flex-1">
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.01em" }}>{liveSelected.candidateName}</p>
              <p style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 1 }}>{liveSelected.candidateCurrentTitle}</p>
            </div>
            <div className="text-right">
              <p style={{ fontSize: 16, fontWeight: 800, color: "var(--primary)", fontFamily: "var(--font-mono)" }}>{liveSelected.trajectoryScore}%</p>
              <p style={{ fontSize: 9, color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>Trajectory Match</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <span className="rounded px-2 py-0.5" style={{ fontSize: 10, background: liveSelected.phaseBg, color: liveSelected.phaseColor, fontWeight: 500 }}>
              Phase: {liveSelected.phase}
            </span>
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>→</span>
            <span style={{ fontSize: 10, color: "var(--muted-foreground)" }}>{liveSelected.roleTitle}</span>
            <span className="ml-auto rounded px-2 py-0.5" style={{ fontSize: 9, fontWeight: 600, background: statusConfig[liveSelected.status].bg, color: statusConfig[liveSelected.status].color }}>
              {statusConfig[liveSelected.status].label}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4" style={{ scrollbarWidth: "none" }}>
          {/* Momentum signal */}
          <div className="rounded-lg p-3 flex items-center gap-2.5" style={{ background: "rgba(194,98,42,0.05)", border: "1px solid rgba(194,98,42,0.15)" }}>
            <TrendingUp size={13} style={{ color: "var(--primary)" }} strokeWidth={2.2} />
            <p style={{ fontSize: 12, color: "var(--foreground)", lineHeight: 1.5 }}>
              <span style={{ fontWeight: 600 }}>Momentum: </span>{liveSelected.momentumSignal}
            </p>
          </div>

          {/* AI rationale */}
          <section>
            <p style={{ fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: 8 }}>
              Why This Pairing
            </p>
            <div className="rounded-lg p-4" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
              <p style={{ fontSize: 12, color: "var(--foreground)", lineHeight: 1.65 }}>{liveSelected.aiRationale}</p>
            </div>
          </section>

          {/* Shared skills */}
          <section>
            <p style={{ fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: 8 }}>
              Trajectory Overlap
            </p>
            <div className="flex flex-wrap gap-1.5">
              {liveSelected.sharedSkills.map((s) => (
                <span key={s} className="flex items-center gap-1 rounded px-2.5 py-1" style={{ fontSize: 11, background: "#ECFDF5", color: "#065F46", border: "1px solid rgba(45,106,79,0.2)" }}>
                  <CheckCircle2 size={9} style={{ color: "#059669" }} strokeWidth={2.5} />
                  {s}
                </span>
              ))}
            </div>
          </section>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleFastTrack}
              disabled={liveSelected.status === "introduced"}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2.5 transition-all"
              style={{
                background: liveSelected.status === "introduced" ? "#ECFDF5" : "var(--primary)",
                fontSize: 12,
                fontWeight: 500,
                color: liveSelected.status === "introduced" ? "#065F46" : "#fff",
                border: liveSelected.status === "introduced" ? "1px solid #A7F3D0" : "none",
                cursor: liveSelected.status === "introduced" ? "default" : "pointer",
              }}
            >
              {liveSelected.status === "introduced" ? (
                <><CheckCircle2 size={12} strokeWidth={2.5} /> Introduced</>
              ) : (
                <><Zap size={12} strokeWidth={2.5} /> Fast-track Introduction</>
              )}
            </button>
            <button
              onClick={handleViewProfile}
              className="flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 transition-colors hover:bg-accent"
              style={{
                background: liveSelected.status === "reviewing" ? "rgba(29,78,137,0.08)" : "var(--secondary)",
                border: `1px solid ${liveSelected.status === "reviewing" ? "#93C5FD" : "var(--border)"}`,
                fontSize: 12,
                color: liveSelected.status === "reviewing" ? "#1D4E89" : "var(--muted-foreground)",
              }}
            >
              <ArrowUpRight size={12} strokeWidth={2} />
              {liveSelected.status === "reviewing" ? "In Review" : "View Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
