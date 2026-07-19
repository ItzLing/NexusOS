import { useState } from "react";
import { ChevronRight, MapPin, Zap, TrendingUp, Clock, Users, Briefcase, ArrowUpRight, X, Plus, CheckCircle2 } from "lucide-react";

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

const initialRoles: Role[] = [
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

interface EditDraft {
  title: string;
  salary: string;
  location: string;
  requirements: string[];
  newReq: string;
}

export function OpenRolesView() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [selectedRole, setSelectedRole] = useState<Role>(roles[0]);
  const [roleTab, setRoleTab] = useState<RoleTab>("signal");
  const [editOpen, setEditOpen] = useState(false);
  const [editDraft, setEditDraft] = useState<EditDraft>({
    title: "",
    salary: "",
    location: "",
    requirements: [],
    newReq: "",
  });

  const openEdit = () => {
    setEditDraft({
      title: selectedRole.title,
      salary: selectedRole.salary,
      location: selectedRole.location,
      requirements: [...selectedRole.requirements],
      newReq: "",
    });
    setEditOpen(true);
  };

  const saveEdit = () => {
    const updated = {
      ...selectedRole,
      title: editDraft.title,
      salary: editDraft.salary,
      location: editDraft.location,
      requirements: editDraft.requirements,
    };
    setRoles((prev) => prev.map((r) => r.id === selectedRole.id ? updated : r));
    setSelectedRole(updated);
    setEditOpen(false);
  };

  const removeReq = (index: number) => {
    setEditDraft((d) => ({ ...d, requirements: d.requirements.filter((_, i) => i !== index) }));
  };

  const addReq = () => {
    if (!editDraft.newReq.trim()) return;
    setEditDraft((d) => ({ ...d, requirements: [...d.requirements, d.newReq.trim()], newReq: "" }));
  };

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
                onClick={() => { setSelectedRole(role); setEditOpen(false); }}
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
            <button
              onClick={openEdit}
              className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 shrink-0 transition-colors hover:opacity-90"
              style={{ background: editOpen ? "var(--secondary)" : "var(--primary)", fontSize: 11, color: editOpen ? "var(--foreground)" : "#fff", fontWeight: 500, border: editOpen ? "1px solid var(--border)" : "none" }}
            >
              {editOpen ? "Cancel" : "Edit Role"}
              {!editOpen && <ArrowUpRight size={10} strokeWidth={2.5} />}
            </button>
          </div>

          {/* Sub-tabs */}
          {!editOpen && (
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
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4" style={{ scrollbarWidth: "none" }}>
          {editOpen ? (
            /* ── Edit Drawer ── */
            <div className="space-y-4">
              <p style={{ fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
                Editing Role
              </p>

              {[
                { label: "Title", key: "title" as const },
                { label: "Salary Range", key: "salary" as const },
                { label: "Location", key: "location" as const },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label style={{ fontSize: 11, color: "var(--muted-foreground)", fontWeight: 500, display: "block", marginBottom: 4 }}>{label}</label>
                  <input
                    value={editDraft[key]}
                    onChange={(e) => setEditDraft((d) => ({ ...d, [key]: e.target.value }))}
                    className="w-full rounded-lg px-3 outline-none"
                    style={{ background: "var(--card)", border: "1px solid var(--border)", height: 36, fontSize: 12, color: "var(--foreground)" }}
                  />
                </div>
              ))}

              {/* Requirements editor */}
              <div>
                <label style={{ fontSize: 11, color: "var(--muted-foreground)", fontWeight: 500, display: "block", marginBottom: 4 }}>Requirements</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {editDraft.requirements.map((req, i) => (
                    <span key={i} className="flex items-center gap-1 rounded-md px-2.5 py-1" style={{ fontSize: 11, background: "var(--secondary)", color: "var(--foreground)", border: "1px solid var(--border)" }}>
                      {req}
                      <button onClick={() => removeReq(i)} className="ml-1 hover:text-red-500 transition-colors">
                        <X size={9} strokeWidth={2.5} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={editDraft.newReq}
                    onChange={(e) => setEditDraft((d) => ({ ...d, newReq: e.target.value }))}
                    onKeyDown={(e) => { if (e.key === "Enter") addReq(); }}
                    placeholder="Add requirement…"
                    className="flex-1 rounded-lg px-3 outline-none"
                    style={{ background: "var(--card)", border: "1px solid var(--border)", height: 32, fontSize: 11, color: "var(--foreground)" }}
                  />
                  <button onClick={addReq} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--primary)" }}>
                    <Plus size={12} color="#fff" strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Save */}
              <button
                onClick={saveEdit}
                className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 transition-all hover:opacity-90"
                style={{ background: "var(--primary)", color: "#fff", fontSize: 13, fontWeight: 500 }}
              >
                <CheckCircle2 size={14} strokeWidth={2} />
                Save Changes
              </button>
            </div>
          ) : (
            roleTab === "foundation" ? <FoundationTab role={selectedRole} /> : <SignalTab role={selectedRole} />
          )}
        </div>
      </div>
    </div>
  );
}
