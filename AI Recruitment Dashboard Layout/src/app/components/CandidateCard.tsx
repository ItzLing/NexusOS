import { TrendingUp, TrendingDown, Minus, CheckCircle2, ChevronRight } from "lucide-react";

export type MomentumType = "rising" | "stable" | "pivoting";
export type PhaseType = "Ready for Pivot" | "Accelerating" | "Deep Specializing" | "Exploring";

export interface Candidate {
  id: string;
  initials: string;
  avatarBg: string;
  name: string;
  currentTitle: string;
  trajectoryScore: number;
  trajectoryLabel: string;
  momentum: MomentumType;
  phase: PhaseType;
  skills: string[];
  location: string;
  yearsExp: number;
}

const MomentumIcon = ({ type }: { type: MomentumType }) => {
  if (type === "rising") return <TrendingUp size={13} style={{ color: "#2D6A4F" }} strokeWidth={2.2} />;
  if (type === "pivoting") return <TrendingUp size={13} style={{ color: "var(--primary)" }} strokeWidth={2.2} className="-rotate-12" />;
  return <Minus size={13} style={{ color: "#78716C" }} strokeWidth={2.2} />;
};

const phaseColors: Record<PhaseType, { bg: string; text: string }> = {
  "Ready for Pivot": { bg: "#FFF3E8", text: "#C2622A" },
  "Accelerating": { bg: "#ECFDF5", text: "#065F46" },
  "Deep Specializing": { bg: "#EFF6FF", text: "#1D4E89" },
  "Exploring": { bg: "#FDF4FF", text: "#7E22CE" },
};

interface Props {
  candidate: Candidate;
  selected: boolean;
  onClick: () => void;
}

export function CandidateCard({ candidate, selected, onClick }: Props) {
  const phase = phaseColors[candidate.phase];

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-lg transition-all duration-150 group relative"
      style={{
        background: selected ? "#FFFFFF" : "transparent",
        border: selected ? "1.5px solid var(--primary)" : "1.5px solid transparent",
        padding: "14px 16px",
        boxShadow: selected ? "0 1px 8px rgba(194,98,42,0.10)" : "none",
      }}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs"
          style={{ background: candidate.avatarBg, color: "#fff", fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: "11px" }}
        >
          {candidate.initials}
        </div>

        <div className="flex-1 min-w-0">
          {/* Name row */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm" style={{ color: "var(--foreground)", fontWeight: 500 }}>
              {candidate.name}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <MomentumIcon type={candidate.momentum} />
              <span
                className="text-xs tabular-nums"
                style={{ fontFamily: "var(--font-mono)", color: "var(--primary)", fontWeight: 500 }}
              >
                {candidate.trajectoryScore}%
              </span>
            </div>
          </div>

          {/* Current title */}
          <p className="text-xs mt-0.5 truncate" style={{ color: "var(--muted-foreground)" }}>
            {candidate.currentTitle} · {candidate.location}
          </p>

          {/* Trajectory label */}
          <p className="text-xs mt-1" style={{ color: "var(--foreground)", opacity: 0.65 }}>
            {candidate.trajectoryLabel}
          </p>

          {/* Skills row */}
          <div className="flex flex-wrap gap-1 mt-2">
            {candidate.skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="flex items-center gap-0.5 rounded px-1.5 py-0.5 text-xs"
                style={{ background: "var(--accent)", color: "var(--foreground)", fontSize: "10px" }}
              >
                <CheckCircle2 size={9} style={{ color: "#2D6A4F" }} strokeWidth={2.5} />
                {skill}
              </span>
            ))}
            {candidate.skills.length > 4 && (
              <span className="text-xs" style={{ color: "var(--muted-foreground)", fontSize: "10px" }}>
                +{candidate.skills.length - 4}
              </span>
            )}
          </div>

          {/* Phase tag */}
          <div className="mt-2">
            <span
              className="inline-flex items-center rounded px-2 py-0.5 text-xs"
              style={{ background: phase.bg, color: phase.text, fontSize: "10px", fontWeight: 500 }}
            >
              Current Phase: {candidate.phase}
            </span>
          </div>
        </div>

        <ChevronRight
          size={14}
          className="shrink-0 mt-0.5 transition-opacity"
          style={{ color: selected ? "var(--primary)" : "transparent", opacity: selected ? 1 : 0 }}
        />
      </div>
    </button>
  );
}
