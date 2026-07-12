import { useState } from "react";
import { ChevronRight, MapPin, Zap, TrendingUp, Clock, Users, Briefcase, ArrowUpRight } from "lucide-react";

type RoleTab = "foundation" | "signal";

interface Role {
  id: string;
  title: string;
  team: string;
  location: string;
  type: string;
  posted: string;
  applicants: number;
  destination: {
    nextRole: string;
    timeline: string;
    pathways: string[];
    skills: string[];
    rationale: string;
  };
  requirements: string[];
  salary: string;
}

const roles: Role[] = [
  {
    id: "r1",
    title: "Senior Data Infrastructure Engineer",
    team: "Platform · Infrastructure",
    location: "Remote (US)",
    type: "Full-time",
    posted: "3 days ago",
    applicants: 41,
    salary: "$185k–$230k",
    destination: {
      nextRole: "Staff Engineer, Data Systems",
      timeline: "12–18 months",
      pathways: ["Staff Engineer", "Principal Architect", "Engineering Lead"],
      skills: ["Distributed consensus protocols", "Cost-aware system design", "Cross-org technical influence"],
      rationale: "This role sits at the intersection of data reliability and platform evolution. The incumbent will own decisions that shape how 9 product teams access and trust data — the exposure naturally accelerates progression to Staff-level scope.",
    },
    requirements: ["5+ yrs data engineering", "Apache Kafka or Flink", "Distributed systems design", "Python or Scala"],
  },
  {
    id: "r2",
    title: "AI Platform Lead",
    team: "AI · Applied Research",
    location: "Hybrid — NYC",
    type: "Full-time",
    posted: "1 week ago",
    applicants: 27,
    salary: "$210k–$260k",
    destination: {
      nextRole: "Director of AI Engineering",
      timeline: "18–24 months",
      pathways: ["Director of AI Eng.", "VP of Engineering", "Founding CTO track"],
      skills: ["LLM evaluation frameworks", "ML systems at scale", "Executive stakeholder alignment"],
      rationale: "This is a greenfield build with explicit organizational mandate. The platform built here will serve as the foundation for three product lines. Candidates who deliver this role historically move into Director-level positions or founding engineer seats.",
    },
    requirements: ["LangChain or LlamaIndex", "LLMOps", "Team leadership", "RAG architecture"],
  },
  {
    id: "r3",
    title: "Product Manager, Data Experience",
    team: "Product · Data",
    location: "Remote (Global)",
    type: "Full-time",
    posted: "5 days ago",
    applicants: 88,
    salary: "$150k–$190k",
    destination: {
      nextRole: "Group Product Manager",
      timeline: "14–20 months",
      pathways: ["Group PM", "VP of Product", "Head of Data Product"],
      skills: ["Data democratization strategy", "Quantitative roadmap framing", "Org-wide alignment"],
      rationale: "The role owns the internal data experience for 1,200+ users. The mandate includes a full data discoverability platform re-launch in H2. The PM who ships this will have both the evidence and the sponsorship to step into Group PM scope.",
    },
    requirements: ["PM experience in data tooling", "SQL proficiency", "Stakeholder management", "B2B product instincts"],
  },
];

function FoundationTab({ role }: { role: Role }) {
  return (
    <div className="space-y-4">
      {/* Meta */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { icon: <MapPin size={11} />, label: role.location },
          { icon: <Clock size={11} />, label: role.posted },
          { icon: <Users size={11} />, label: `${role.applicants} applicants` },
          { icon: <Briefcase size={11} />, label: role.type },
        ].map(({ icon, label }) => (
          <div key={label} className="flex items-center gap-1.5 rounded-lg px-3 py-2" style={{ background: "var(--accent)", fontSize: 11, color: "var(--muted-foreground)" }}>
            <span style={{ color: "var(--primary)" }}>{icon}</span>
            {label}
          </div>
        ))}
      </div>

      {/* Salary */}
      <div className="flex items-center justify-between rounded-lg px-4 py-3" style={{ background: "rgba(45,106,79,0.08)", border: "1px solid rgba(45,106,79,0.2)" }}>
        <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>Compensation range</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#065F46", fontFamily: "var(--font-mono)" }}>{role.salary}</span>
      </div>

      {/* Requirements */}
      <div>
        <p style={{ fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: 8 }}>Core Requirements</p>
        <div className="flex flex-wrap gap-2">
          {role.requirements.map((r) => (
            <span key={r} className="rounded-md px-2.5 py-1" style={{ fontSize: 11, background: "var(--secondary)", color: "var(--foreground)", border: "1px solid var(--border)" }}>{r}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function SignalTab({ role }: { role: Role }) {
  return (
    <div className="space-y-4">
      {/* Destination */}
      <div className="rounded-xl p-4" style={{ background: "rgba(194,98,42,0.05)", border: "1px solid rgba(194,98,42,0.18)" }}>
        <p style={{ fontSize: 10, fontWeight: 600, color: "var(--primary)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: 10 }}>
          Where This Role Leads
        </p>
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={14} style={{ color: "var(--primary)" }} strokeWidth={2} />
          <span style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)" }}>{role.destination.nextRole}</span>
        </div>
        <p style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 10 }}>Typical timeline: {role.destination.timeline}</p>
        <p style={{ fontSize: 12, color: "var(--foreground)", lineHeight: 1.65 }}>{role.destination.rationale}</p>
      </div>

      {/* Pathway branches */}
      <div>
        <p style={{ fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: 8 }}>
          Arc Pathways
        </p>
        <div className="flex flex-col gap-1.5">
          {role.destination.pathways.map((p, i) => (
            <div key={p} className="flex items-center gap-2.5 rounded-lg px-3 py-2" style={{ background: "var(--accent)", border: "1px solid var(--border)" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "var(--primary)", fontFamily: "var(--font-mono)", width: 14 }}>{i + 1}</span>
              <span style={{ fontSize: 12, color: "var(--foreground)", fontWeight: 500 }}>{p}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Skills unlocked */}
      <div>
        <p style={{ fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: 8 }}>
          Skills Unlocked In This Role
        </p>
        <div className="flex flex-wrap gap-1.5">
          {role.destination.skills.map((s) => (
            <span key={s} className="flex items-center gap-1 rounded-md px-2.5 py-1" style={{ fontSize: 11, background: "rgba(45,106,79,0.08)", color: "#065F46", border: "1px solid rgba(45,106,79,0.2)" }}>
              <Zap size={9} style={{ color: "#059669" }} strokeWidth={2.5} />
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function OpenRolesView() {
  const [selectedRole, setSelectedRole] = useState<Role>(roles[0]);
  const [roleTab, setRoleTab] = useState<RoleTab>("signal");

  return (
    <div className="flex h-full overflow-hidden" style={{ fontFamily: "var(--font-sans)" }}>
      {/* Role list */}
      <div className="flex flex-col overflow-hidden" style={{ width: "38%", borderRight: "1px solid var(--border)" }}>
        <div className="px-4 py-3 shrink-0" style={{ borderBottom: "1px solid var(--border)", background: "var(--card)" }}>
          <h3 style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)" }}>Open Roles</h3>
          <p style={{ fontSize: 10, color: "var(--muted-foreground)", marginTop: 1 }}>{roles.length} active listings</p>
        </div>
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          {roles.map((role) => {
            const active = role.id === selectedRole.id;
            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role)}
                className="w-full text-left px-4 py-3.5 transition-colors"
                style={{
                  borderBottom: "1px solid var(--border)",
                  background: active ? "var(--background)" : "var(--card)",
                  borderLeft: active ? "2px solid var(--primary)" : "2px solid transparent",
                }}
              >
                <p style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", lineHeight: 1.35 }}>{role.title}</p>
                <p style={{ fontSize: 10, color: "var(--muted-foreground)", marginTop: 2 }}>{role.team}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span style={{ fontSize: 9, color: "var(--primary)", fontFamily: "var(--font-mono)", fontWeight: 500 }}>{role.applicants} apps</span>
                  <span style={{ fontSize: 9, color: "var(--muted-foreground)" }}>·</span>
                  <span style={{ fontSize: 9, color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>{role.posted}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Role detail */}
      <div className="flex flex-col flex-1 overflow-hidden" style={{ background: "var(--background)" }}>
        {/* Detail header */}
        <div className="px-5 py-4 shrink-0" style={{ background: "var(--card)", borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.01em", lineHeight: 1.3 }}>{selectedRole.title}</h2>
              <p style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 2 }}>{selectedRole.team} · {selectedRole.location}</p>
            </div>
            <button className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 shrink-0" style={{ background: "var(--primary)", fontSize: 11, color: "#fff", fontWeight: 500 }}>
              Edit Role
              <ArrowUpRight size={10} strokeWidth={2.5} />
            </button>
          </div>

          {/* Sub-tabs */}
          <div className="flex gap-1 mt-3">
            {([["signal", "Dynamic Demand Signal"], ["foundation", "Foundation"]] as [RoleTab, string][]).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setRoleTab(id)}
                className="rounded-md px-3 py-1.5 transition-colors"
                style={{
                  fontSize: 11,
                  fontWeight: roleTab === id ? 600 : 400,
                  background: roleTab === id ? "var(--primary)" : "var(--secondary)",
                  color: roleTab === id ? "#fff" : "var(--muted-foreground)",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4" style={{ scrollbarWidth: "none" }}>
          {roleTab === "foundation" ? <FoundationTab role={selectedRole} /> : <SignalTab role={selectedRole} />}
        </div>
      </div>
    </div>
  );
}
