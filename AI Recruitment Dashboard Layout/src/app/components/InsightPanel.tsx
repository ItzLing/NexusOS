import { useState } from "react";
import { TrendingUp, BookOpen, Send, Bookmark, BadgeCheck, Star, AlertCircle, ArrowRight } from "lucide-react";
import type { Candidate } from "./CandidateCard";

interface TradeOffRow {
  skill: string;
  plateau: string;
}

interface InsightData {
  justificationPoints: { label: string; text: string }[];
  roleAlignment: string;
  tradeOffs: TradeOffRow[];
  matchedStrengths: string[];
}

const insightMap: Record<string, InsightData> = {
  c1: {
    roleAlignment: "Senior Product Architect",
    justificationPoints: [
      { label: "Arc pattern", text: "Deliberate shift from implementation toward systems thinking — moved into product architecture without formal title changes." },
      { label: "Role overlap", text: "Distributed systems work maps directly to the infrastructure scaling challenges this role faces in Q3." },
      { label: "Forward signal", text: "Trajectory is accelerating, not plateauing — the next 12 months are the inflection window." },
    ],
    tradeOffs: [
      { skill: "gRPC · Protocol Buffers · Kafka", plateau: "Enterprise Sales Cycle Awareness" },
      { skill: "GraphQL Federation · Apollo Studio", plateau: "Domain Depth in FinTech Regulation" },
      { skill: "Kubernetes · Istio · Service Mesh", plateau: "Legacy System Migration Patterns" },
    ],
    matchedStrengths: ["Systems Thinking", "Technical Communication", "Stakeholder Alignment"],
  },
  c2: {
    roleAlignment: "Growth Engineering Lead",
    justificationPoints: [
      { label: "Compression rate", text: "Compresses a decade of experience into five years across two early-stage high-growth companies." },
      { label: "Rare quality", text: "Rapid context switching and ambiguity tolerance are built, not trained — rare in enterprise backgrounds." },
      { label: "The gap", text: "Structured process gaps are real but learnable. The adaptive intelligence he's built is not." },
    ],
    tradeOffs: [
      { skill: "LangChain · LlamaIndex · RAG", plateau: "Compliance & Audit Trail Processes" },
      { skill: "FastAPI · Redis · Celery", plateau: "Long-cycle Enterprise Procurement" },
      { skill: "Hugging Face · PEFT · LoRA", plateau: "Formal Documentation Culture" },
    ],
    matchedStrengths: ["Ambiguity Navigation", "Rapid Prototyping", "Technical Depth"],
  },
  c3: {
    roleAlignment: "Principal UX Researcher",
    justificationPoints: [
      { label: "Second-order edge", text: "Doesn't just solve UX problems — systematically understands why they recur using cognitive load theory." },
      { label: "Academic grounding", text: "Research training surfaces directly in interaction outputs, not just as background framing." },
      { label: "Inflection point", text: "Translating complex AI behaviors into intuitive interfaces is exactly her current pivot zone." },
    ],
    tradeOffs: [
      { skill: "LIME · SHAP · Attention Viz", plateau: "Agile Sprint Cadence Adaptability" },
      { skill: "Figma Prototyping · ProtoPie", plateau: "B2B Enterprise Client Management" },
      { skill: "Dovetail · Maze · Lookback", plateau: "Sales-Led Growth Context" },
    ],
    matchedStrengths: ["Research Rigor", "Systems Empathy", "AI Interaction Design"],
  },
  c4: {
    roleAlignment: "Data Platform Engineer",
    justificationPoints: [
      { label: "Non-linear arc", text: "Operations → data engineering reveals curiosity-driven upskilling, not credential-chasing." },
      { label: "Unique hybrid", text: "Operational context means pipelines non-technical stakeholders can actually use — rare in pure-eng profiles." },
      { label: "Market gap", text: "Most teams fail to hire this combination. It doesn't show up on a traditional resume screen." },
    ],
    tradeOffs: [
      { skill: "Apache Spark · PySpark · Delta Lake", plateau: "Deep Database Internals Expertise" },
      { skill: "Airflow · Prefect · dbt Core", plateau: "Cloud Cost Optimization at Scale" },
      { skill: "Kafka · Flink · Kinesis", plateau: "Real-Time Streaming Architecture" },
    ],
    matchedStrengths: ["Ops-to-Data Bridge", "Pragmatic Engineering", "Business Context"],
  },
  c5: {
    roleAlignment: "Senior Product Manager",
    justificationPoints: [
      { label: "Structural edge", text: "Behavioral economics background gives product instincts grounded in testable theory, not anecdote." },
      { label: "Decision quality", text: "Internalised frameworks for irrational user behavior at a scientific level — not surface-level UX empathy." },
      { label: "Board credibility", text: "Can justify roadmap decisions with rigorous evidence — critical for skeptical technical leadership." },
    ],
    tradeOffs: [
      { skill: "Amplitude · Mixpanel · SQL Analytics", plateau: "Technical Architecture Trade-offs" },
      { skill: "Statsig · LaunchDarkly · A/B Frameworks", plateau: "Deep Engineering Team Collaboration" },
      { skill: "Notion AI · Linear · Coda", plateau: "Mobile Platform Constraints" },
    ],
    matchedStrengths: ["Evidence-Based PM", "User Psychology", "Strategic Narrative"],
  },
};

function getInsight(id: string): InsightData {
  return insightMap[id] ?? insightMap["c1"];
}

interface Props {
  candidate: Candidate;
  justification?: any;
  onInitiateIntro?: (candidateName: string) => void;
}

export function InsightPanel({ candidate, justification, onInitiateIntro }: Props) {
  const defaultInsight = getInsight(candidate.id);
  const [saved, setSaved] = useState(false);

  // If a live justification is provided, map its properties to the InsightData structure
  const insight = justification ? {
    roleAlignment: candidate.currentTitle,
    justificationPoints: [
      { label: "Capability Synthesis", text: justification.capabilitySynthesisText },
      { label: "Probation Risk Summary", text: justification.probationRiskSummary }
    ],
    tradeOffs: justification.skillGaps.map((gap: any) => ({
      skill: `${gap.name} (Severity: ${gap.severity})`,
      plateau: gap.mentorshipRequired ? "Requires deliberate mentorship" : "Self-paced adaptation"
    })),
    matchedStrengths: justification.forwardStrengths && justification.forwardStrengths.length > 0
      ? justification.forwardStrengths
      : candidate.skills.slice(0, 3)
  } : defaultInsight;

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: "var(--font-sans)" }}>
      {/* Panel Header */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-start gap-3">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-sm"
            style={{ background: candidate.avatarBg, color: "#fff", fontFamily: "var(--font-mono)", fontWeight: 500 }}
          >
            {candidate.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span style={{ fontWeight: 600, color: "var(--foreground)", fontSize: "15px" }}>{candidate.name}</span>
              <BadgeCheck size={15} style={{ color: "var(--primary)" }} />
            </div>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              {candidate.currentTitle}
            </p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs" style={{ background: "var(--secondary)", color: "var(--foreground)", fontWeight: 500, fontSize: "10px" }}>
                <TrendingUp size={9} style={{ color: "var(--primary)" }} />
                Trajectory Match — {candidate.trajectoryScore}%
              </span>
              <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs" style={{ background: "var(--accent)", color: "var(--muted-foreground)", fontSize: "10px" }}>
                {insight.roleAlignment}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5" style={{ scrollbarWidth: "none" }}>

        {/* AI Trajectory Justification */}
        <section>
          <div className="flex items-center gap-2 mb-2.5">
            <BookOpen size={13} style={{ color: "var(--primary)" }} strokeWidth={2.2} />
            <span className="text-xs uppercase tracking-widest" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>
              AI Trajectory Justification
            </span>
          </div>
          <div className="rounded-lg overflow-hidden" style={{ background: "var(--accent)", border: "1px solid var(--border)" }}>

            {insight.justificationPoints.map((point, i) => (
              <div
                key={point.label}
                className="flex gap-3 px-4 py-3"
                style={{ borderTop: i > 0 ? "1px solid rgba(194,98,42,0.08)" : "none" }}
              >
                <ArrowRight size={12} style={{ color: "var(--primary)", marginTop: 2, flexShrink: 0 }} strokeWidth={2.5} />
                <div>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--primary)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {point.label}
                  </span>
                  <p style={{ fontSize: "12px", color: "var(--foreground)", lineHeight: 1.6, marginTop: 2 }}>
                    {point.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Matched Strengths */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <Star size={13} style={{ color: "#2D6A4F" }} strokeWidth={2.2} />
            <span className="text-xs uppercase tracking-widest" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>
              Forward Strengths
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {insight.matchedStrengths.map((s) => (
              <span key={s} className="rounded px-2.5 py-1 text-xs" style={{ background: "#ECFDF5", color: "#065F46", fontWeight: 500, fontSize: "11px" }}>
                {s}
              </span>
            ))}
          </div>
        </section>

        {/* Growth Trade-offs Table */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={13} style={{ color: "#78716C" }} strokeWidth={2} />
            <span className="text-xs uppercase tracking-widest" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>
              Growth Trade-offs
            </span>
          </div>
          <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: "var(--accent)" }}>
                  <th className="text-left px-3 py-2" style={{ color: "var(--muted-foreground)", fontWeight: 500, fontSize: "10px", letterSpacing: "0.05em", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>
                    Skills Acquired
                  </th>
                  <th className="text-left px-3 py-2" style={{ color: "var(--muted-foreground)", fontWeight: 500, fontSize: "10px", letterSpacing: "0.05em", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>
                    Potential Plateaus
                  </th>
                </tr>
              </thead>
              <tbody>
                {insight.tradeOffs.map((row, i) => (
                  <tr key={i} style={{ borderTop: "1px solid var(--border)", background: i % 2 === 0 ? "var(--card)" : "var(--background)" }}>
                    <td className="px-3 py-2.5" style={{ color: "var(--foreground)" }}>
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#2D6A4F" }} />
                        {row.skill}
                      </span>
                    </td>
                    <td className="px-3 py-2.5" style={{ color: "var(--muted-foreground)" }}>
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#D97706" }} />
                        {row.plateau}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Action Buttons */}
      <div className="px-5 py-4 space-y-2.5" style={{ borderTop: "1px solid var(--border)" }}>
        <button
          onClick={() => onInitiateIntro?.(candidate.name)}
          className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm transition-all duration-150 hover:opacity-90 active:scale-[0.99]"
          style={{ background: "var(--primary)", color: "#fff", fontWeight: 500 }}
        >
          <Send size={14} strokeWidth={2} />
          Initiate Direct Introduction
        </button>
        <button
          onClick={() => setSaved((p) => !p)}
          className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm transition-all duration-200"
          style={{
            background: saved ? "#ECFDF5" : "var(--accent)",
            color: saved ? "#065F46" : "var(--foreground)",
            fontWeight: 500,
            border: `1px solid ${saved ? "#A7F3D0" : "var(--border)"}`,
          }}
        >
          <Bookmark
            size={14}
            strokeWidth={1.8}
            fill={saved ? "#065F46" : "none"}
            color={saved ? "#065F46" : "currentColor"}
          />
          {saved ? "Saved to Pipeline ✓" : "Save to Long-term Pipeline"}
        </button>
      </div>
    </div>
  );
}
