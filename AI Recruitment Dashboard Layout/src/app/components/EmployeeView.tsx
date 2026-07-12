import { useState, useRef, useEffect } from "react";
import {
  ShieldCheck, Compass, FolderOpen, MessageSquare, DollarSign,
  GitBranch, CheckCircle2, Sparkles, ChevronRight, TrendingUp,
  Github, FileCode2, Star, ArrowUpRight, Bell, CircleDot, Zap,
  X, ExternalLink, Award, Send, ArrowLeft, ChevronDown,
  Search, Building2, MapPin, Paperclip, FileText, BadgeCheck,
} from "lucide-react";

type Tab = "navigator" | "portfolio" | "coach" | "pay";

/* ─── Timeline data ─── */
const timelineMilestones = [
  { id: "past-1", type: "past" as const, title: "Data Engineer", org: "Confluent · 2019–2021", verified: true, skills: ["Kafka", "Spark", "Scala"], note: "Built real-time ingestion pipelines processing 4B events/day." },
  { id: "past-2", type: "past" as const, title: "Senior Data Engineer", org: "Stripe · 2021–2023", verified: true, skills: ["Flink", "dbt", "Airflow"], note: "Led migration of legacy batch jobs to streaming architecture." },
  { id: "current", type: "current" as const, title: "Sr. Portfolio Optimization Specialist", org: "Independent · 2023–Present", verified: true, skills: ["LangChain", "Delta Lake", "Rust"], note: "Compiling verifiable output across open-source and client work." },
  { id: "pred-1", type: "predicted" as const, route: "A", title: "Staff Data Infrastructure Eng.", confidence: 87, orgs: ["Databricks", "Snowflake", "Cloudflare"], rationale: "Natural depth progression — IC track at infra-first companies." },
  { id: "pred-2", type: "predicted" as const, route: "B", title: "AI Platform Lead", confidence: 74, orgs: ["Cohere", "Mistral", "Anyscale"], rationale: "LLM tooling skills accelerating — pivot window is 6–9 months." },
  { id: "pred-3", type: "predicted" as const, route: "C", title: "Founding Engineer", confidence: 61, orgs: ["YC W25", "a16z Seed Stage", "Sequoia Arc"], rationale: "OSS reputation + generalist breadth suit early-stage founding roles." },
];

/* ─── Portfolio data ─── */
interface PortfolioSample {
  id: string;
  icon: "github" | "code" | "star" | "branch";
  tag: string;
  tagColor: string;
  title: string;
  subtitle: string;
  summary: string;
  achievement: string;
  metrics: { label: string; value: string }[];
  tech: string[];
  link?: string;
  verified: boolean;
  age: string;
}

const portfolioSamples: PortfolioSample[] = [
  {
    id: "p1",
    icon: "github",
    tag: "Systems",
    tagColor: "#7C3AED",
    title: "low-latency-cpp-infra",
    subtitle: "GitHub · Open Source · C++",
    summary: "A high-performance C++ infrastructure layer for low-latency event processing, designed for sub-millisecond p99 response times in high-throughput environments.",
    achievement: "Reduced average message round-trip time by 38% vs. baseline Boost.Asio implementation across 10M concurrent connections in load testing. Adopted by 3 fintech teams.",
    metrics: [
      { label: "Stars", value: "2.1k" },
      { label: "Forks", value: "314" },
      { label: "p99 Latency", value: "0.4ms" },
    ],
    tech: ["C++20", "io_uring", "DPDK", "CMake"],
    verified: true,
    age: "2 days ago",
  },
  {
    id: "p2",
    icon: "code",
    tag: "Streaming",
    tagColor: "#0891B2",
    title: "kafka-lag-exporter",
    subtitle: "Open-source tool · Rust",
    summary: "A Prometheus-compatible Kafka consumer lag exporter written in Rust. Replaces the JVM-based Confluent exporter with a 12× smaller binary footprint and native async runtime.",
    achievement: "Reduced memory overhead from 512MB to 42MB per instance in production at Stripe's analytics cluster, saving ~$18k/yr in EC2 costs. Merged into Strimzi ecosystem.",
    metrics: [
      { label: "Stars", value: "1.2k" },
      { label: "Memory", value: "42MB" },
      { label: "Latency", value: "-62%" },
    ],
    tech: ["Rust", "Tokio", "rdkafka", "Prometheus"],
    verified: true,
    age: "1 week ago",
  },
  {
    id: "p3",
    icon: "star",
    tag: "Recognition",
    tagColor: "#D97706",
    title: "Stripe Infrastructure Award",
    subtitle: "Peer-recognized · Internal · Q4 2022",
    summary: "Awarded the Stripe Infrastructure Excellence Award for designing and shipping the streaming-first pipeline migration that cut data freshness SLA from T+4h to T+90s.",
    achievement: "Nominated by 11 peers and 2 engineering leads. Migration impacted 34 downstream analytics products and unblocked the Radar fraud model re-training pipeline.",
    metrics: [
      { label: "Nominees", value: "2 of 320" },
      { label: "Data Freshness", value: "T+90s" },
      { label: "Downstream Impact", value: "34 products" },
    ],
    tech: ["Apache Flink", "Kafka", "Terraform", "Datadog"],
    verified: true,
    age: "2023",
  },
  {
    id: "p4",
    icon: "branch",
    tag: "OSS",
    tagColor: "#059669",
    title: "delta-lake-compaction-patch",
    subtitle: "OSS contribution · Apache Delta · Merged",
    summary: "Contributed a Z-order compaction optimization patch to the Apache Delta Lake project that reduces small-file overhead during high-frequency incremental writes.",
    achievement: "Patch merged to main after 3 rounds of review. Benchmarks show 2.4× faster Spark read scans on compacted partitions in production workloads with >100k files.",
    metrics: [
      { label: "Read Speed", value: "+2.4×" },
      { label: "File Reduction", value: "68%" },
      { label: "PR Reviews", value: "3 rounds" },
    ],
    tech: ["Scala", "Apache Spark", "Delta Lake", "Github Actions"],
    verified: true,
    age: "3 weeks ago",
  },
];

/* ─── Coach chat data ─── */
interface ChatMsg { id: string; role: "user" | "coach"; text: string; time: string; }

const initialMessages: ChatMsg[] = [
  { id: "m1", role: "coach", text: "Hey Jordan 👋 I've been reviewing your momentum signals this week. Your Kafka lag exporter crossed 1.2k stars — that's a strong market signal for infrastructure credibility.", time: "Mon 9:12 AM" },
  { id: "m2", role: "user", text: "Yeah I noticed. Do you think I should start applying for Staff roles now or wait until I have more OSS traction?", time: "Mon 9:14 AM" },
  { id: "m3", role: "coach", text: "Good question. Based on your trajectory, you're in the top 8% of the data infra cohort I'm tracking. Staff roles at Databricks and Cloudflare typically want 2–3 public artifacts plus system design credibility — you're at 2 strong ones. I'd say start quietly testing the market now while building artifact #3.", time: "Mon 9:15 AM" },
  { id: "m4", role: "user", text: "What should artifact #3 look like?", time: "Mon 9:17 AM" },
  { id: "m5", role: "coach", text: "Given your C++ infrastructure work, a technical deep-dive post or a talk at a Kafka Summit / Flink Forward would pair well. It shifts perception from contributor to thought leader — that's the Staff-level signal hiring managers look for beyond the code.", time: "Mon 9:18 AM" },
];

const promptShortcuts = [
  "Model my compensation gap",
  "What roles fit my arc?",
  "Review my GitHub signals",
  "Am I ready for Staff?",
];

const routeColors: Record<string, { dot: string; bg: string; text: string }> = {
  A: { dot: "#A3E635", bg: "rgba(163,230,53,0.08)", text: "#A3E635" },
  B: { dot: "#38BDF8", bg: "rgba(56,189,248,0.08)", text: "#38BDF8" },
  C: { dot: "#F472B6", bg: "rgba(244,114,182,0.08)", text: "#F472B6" },
};

function PortfolioIcon({ type, size = 14 }: { type: "github" | "code" | "star" | "branch"; size?: number }) {
  const props = { size, strokeWidth: 1.8, color: "#A1A1AA" };
  if (type === "github") return <Github {...props} />;
  if (type === "code") return <FileCode2 {...props} />;
  if (type === "star") return <Star {...props} />;
  return <GitBranch {...props} />;
}

/* ─── Portfolio Detail Overlay ─── */
function PortfolioDetail({ sample, onClose }: { sample: PortfolioSample; onClose: () => void }) {
  return (
    <div
      className="absolute inset-0 flex flex-col z-20"
      style={{ background: "#0A0A0A", borderRadius: "inherit" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-14 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <button onClick={onClose} className="flex items-center justify-center w-8 h-8 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
          <ArrowLeft size={15} color="#A1A1AA" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span style={{ fontSize: 14, fontWeight: 700, color: "#F5F5F5", letterSpacing: "-0.01em" }}>{sample.title}</span>
            {sample.verified && <CheckCircle2 size={12} style={{ color: "#A3E635" }} strokeWidth={2.5} />}
          </div>
          <p style={{ fontSize: 11, color: "#71717A", marginTop: 1 }}>{sample.subtitle}</p>
        </div>
        <span className="rounded-md px-2 py-1" style={{ fontSize: 9, fontWeight: 700, background: `${sample.tagColor}18`, color: sample.tagColor, fontFamily: "var(--font-mono)" }}>
          {sample.tag}
        </span>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5" style={{ scrollbarWidth: "none" }}>
        {/* Summary */}
        <section>
          <p style={{ fontSize: 10, fontWeight: 600, color: "#52525B", letterSpacing: "0.1em", fontFamily: "var(--font-mono)", textTransform: "uppercase", marginBottom: 8 }}>
            Overview
          </p>
          <p style={{ fontSize: 13, color: "#D4D4D8", lineHeight: 1.65 }}>{sample.summary}</p>
        </section>

        {/* Achievement */}
        <section>
          <p style={{ fontSize: 10, fontWeight: 600, color: "#52525B", letterSpacing: "0.1em", fontFamily: "var(--font-mono)", textTransform: "uppercase", marginBottom: 8 }}>
            Key Achievement
          </p>
          <div className="rounded-xl p-4" style={{ background: "rgba(163,230,53,0.05)", border: "1px solid rgba(163,230,53,0.15)" }}>
            <div className="flex gap-2">
              <Award size={15} style={{ color: "#A3E635", marginTop: 1, flexShrink: 0 }} strokeWidth={2} />
              <p style={{ fontSize: 13, color: "#D4D4D8", lineHeight: 1.65 }}>{sample.achievement}</p>
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section>
          <p style={{ fontSize: 10, fontWeight: 600, color: "#52525B", letterSpacing: "0.1em", fontFamily: "var(--font-mono)", textTransform: "uppercase", marginBottom: 8 }}>
            Impact Metrics
          </p>
          <div className="grid grid-cols-3 gap-2">
            {sample.metrics.map((m) => (
              <div key={m.label} className="rounded-xl p-3 flex flex-col gap-1" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: "#F5F5F5", fontFamily: "var(--font-mono)", letterSpacing: "-0.02em" }}>{m.value}</span>
                <span style={{ fontSize: 10, color: "#71717A" }}>{m.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Tech stack */}
        <section>
          <p style={{ fontSize: 10, fontWeight: 600, color: "#52525B", letterSpacing: "0.1em", fontFamily: "var(--font-mono)", textTransform: "uppercase", marginBottom: 8 }}>
            Tech Stack
          </p>
          <div className="flex flex-wrap gap-1.5">
            {sample.tech.map((t) => (
              <span key={t} className="rounded-md px-2 py-1" style={{ fontSize: 11, background: "rgba(255,255,255,0.05)", color: "#A1A1AA", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "var(--font-mono)" }}>
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* Verification */}
        <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: "rgba(163,230,53,0.04)", border: "1px solid rgba(163,230,53,0.12)" }}>
          <ShieldCheck size={15} style={{ color: "#A3E635", flexShrink: 0 }} strokeWidth={2} />
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#A3E635" }}>Career OS Verified</p>
            <p style={{ fontSize: 10, color: "#52525B", marginTop: 1 }}>Verified {sample.age} · Cryptographic proof of work on file</p>
          </div>
        </div>

        {sample.link && (
          <button className="w-full flex items-center justify-center gap-2 rounded-xl py-3" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}>
            <ExternalLink size={13} style={{ color: "#A1A1AA" }} />
            <span style={{ fontSize: 12, color: "#A1A1AA" }}>View source</span>
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Employer data ─── */
interface Employer {
  id: string;
  name: string;
  logo: string; // initials fallback
  logoBg: string;
  industry: string;
  location: string;
  openRole: string;
  trajectoryFit: number;
  fitLabel: string;
  hiring: boolean;
  description: string;
  whyYou: string;
  perks: string[];
  teamSize: string;
  stage: string;
}

const employers: Employer[] = [
  {
    id: "e1", name: "Databricks", logo: "DB", logoBg: "#C2410C",
    industry: "Data & AI", location: "Remote (US)", openRole: "Staff Data Infrastructure Engineer",
    trajectoryFit: 94, fitLabel: "Exceptional fit",
    hiring: true,
    description: "Building the world's most adopted lakehouse platform. Known for deeply technical ICs with strong OSS credibility.",
    whyYou: "Your Kafka lag exporter and Delta Lake patch put you in the top 3% of applicants for this role. The team lead tracks OSS contributors explicitly.",
    perks: ["Remote-first", "Top-tier equity", "Conference budget", "Open-source encouraged"],
    teamSize: "3,400 employees", stage: "Public",
  },
  {
    id: "e2", name: "Cohere", logo: "CO", logoBg: "#7C3AED",
    industry: "AI / LLMs", location: "Hybrid — Toronto",
    openRole: "AI Platform Lead",
    trajectoryFit: 87, fitLabel: "Strong fit",
    hiring: true,
    description: "Enterprise LLM platform building production-grade NLP for the Fortune 500. Fast-moving, research-adjacent culture.",
    whyYou: "Your LangChain and Rust systems work signals both applied AI breadth and low-level performance intuition — a rare pairing on their hiring rubric.",
    perks: ["Research days", "Unlimited PTO", "Equity-heavy comp", "Visa support"],
    teamSize: "~800 employees", stage: "Series C",
  },
  {
    id: "e3", name: "Cloudflare", logo: "CF", logoBg: "#1D4E89",
    industry: "Infrastructure", location: "Remote (Global)",
    openRole: "Staff Systems Engineer",
    trajectoryFit: 82, fitLabel: "Good fit",
    hiring: true,
    description: "The network that powers and protects the internet. Engineering culture values low-level performance work and global-scale thinking.",
    whyYou: "Your C++ infra work and io_uring usage are exactly the signal their Workers runtime team looks for. They actively recruit from OSS contributors.",
    perks: ["Global remote", "Mission-driven", "Strong eng brand", "L&D stipend"],
    teamSize: "3,200 employees", stage: "Public",
  },
  {
    id: "e4", name: "Anyscale", logo: "AY", logoBg: "#065F46",
    industry: "ML Infrastructure", location: "San Francisco / Remote",
    openRole: "AI Infrastructure Engineer",
    trajectoryFit: 76, fitLabel: "Potential fit",
    hiring: true,
    description: "Building Ray — the open-source framework for scaling AI workloads. Deep OSS culture, researcher-practitioner hybrid team.",
    whyYou: "Your distributed systems background combined with growing ML pipeline exposure tracks well for their infra team's next hiring cohort.",
    perks: ["OSS-first culture", "Flexible hours", "Comp above market", "Annual offsite"],
    teamSize: "~200 employees", stage: "Series C",
  },
  {
    id: "e5", name: "Mistral AI", logo: "MI", logoBg: "#92400E",
    industry: "Foundation Models", location: "Paris / Remote",
    openRole: "Platform Engineer",
    trajectoryFit: 71, fitLabel: "Emerging fit",
    hiring: false,
    description: "European frontier AI lab building open-weight foundation models. Lean, high-trust team — no bloat, high ownership.",
    whyYou: "Not actively hiring for your exact trajectory now, but your profile has been flagged by their talent team for future pipeline consideration.",
    perks: ["High ownership", "Frontier research access", "Europe-first culture"],
    teamSize: "~150 employees", stage: "Series B",
  },
];

const fitColors = (score: number) => {
  if (score >= 90) return { text: "#A3E635", bg: "rgba(163,230,53,0.10)" };
  if (score >= 80) return { text: "#38BDF8", bg: "rgba(56,189,248,0.08)" };
  if (score >= 70) return { text: "#F472B6", bg: "rgba(244,114,182,0.08)" };
  return { text: "#71717A", bg: "rgba(113,113,122,0.08)" };
};

/* ─── Employer DM + Resume overlay ─── */
interface EmployerOverlayProps {
  employer: Employer;
  onClose: () => void;
}

function EmployerOverlay({ employer, onClose }: EmployerOverlayProps) {
  const [tab, setTab] = useState<"message" | "resume">("message");
  const [message, setMessage] = useState(
    `Hi ${employer.name} team,\n\nI came across the ${employer.openRole} role and wanted to reach out directly. My background in distributed systems and data infrastructure — including open-source work on Kafka tooling and Delta Lake — maps closely to what you're building.\n\nI'd love to connect and learn more about the team. Happy to share more context on my recent work.\n\n— Jordan Park`
  );
  const [sent, setSent] = useState(false);
  const [resumeAttached, setResumeAttached] = useState(false);
  const fit = fitColors(employer.trajectoryFit);

  const handleSend = () => {
    setSent(true);
    setTimeout(() => { onClose(); }, 1600);
  };

  return (
    <div className="absolute inset-0 flex flex-col z-30" style={{ background: "#0A0A0A", borderRadius: "inherit" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-14 pb-4 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.06)" }}>
          <ArrowLeft size={15} color="#A1A1AA" />
        </button>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: employer.logoBg }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", fontFamily: "var(--font-mono)" }}>{employer.logo}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p style={{ fontSize: 14, fontWeight: 700, color: "#F5F5F5", letterSpacing: "-0.01em" }}>{employer.name}</p>
          <p style={{ fontSize: 11, color: "#71717A", marginTop: 1 }} className="truncate">{employer.openRole}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-5 pt-4 gap-2 shrink-0">
        {(["message", "resume"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className="flex items-center gap-1.5 rounded-lg px-4 py-2 flex-1 justify-center transition-colors"
            style={{ background: tab === t ? "rgba(163,230,53,0.12)" : "rgba(255,255,255,0.04)", border: tab === t ? "1px solid rgba(163,230,53,0.3)" : "1px solid rgba(255,255,255,0.06)", fontSize: 12, fontWeight: tab === t ? 600 : 400, color: tab === t ? "#A3E635" : "#71717A" }}>
            {t === "message" ? <MessageSquare size={13} strokeWidth={2} /> : <FileText size={13} strokeWidth={2} />}
            {t === "message" ? "Direct Message" : "Send Resume"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-4 space-y-4" style={{ scrollbarWidth: "none" }}>
        {tab === "message" && (
          <>
            {/* Context card */}
            <div className="rounded-xl p-3" style={{ background: "rgba(163,230,53,0.05)", border: "1px solid rgba(163,230,53,0.15)" }}>
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles size={11} style={{ color: "#A3E635" }} strokeWidth={2.5} />
                <span style={{ fontSize: 10, fontWeight: 600, color: "#A3E635", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em" }}>AI-drafted · Trajectory-aware</span>
              </div>
              <p style={{ fontSize: 11, color: "#A1A1AA", lineHeight: 1.55 }}>{employer.whyYou}</p>
            </div>

            {/* Message editor */}
            <div>
              <p style={{ fontSize: 10, color: "#52525B", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Your Message</p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={10}
                className="w-full rounded-xl px-4 py-3 outline-none resize-none"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontSize: 13, color: "#E4E4E7", lineHeight: 1.65, fontFamily: "var(--font-sans)" }}
              />
            </div>

            {/* Attach resume toggle */}
            <button onClick={() => setResumeAttached((p) => !p)}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 w-full"
              style={{ background: resumeAttached ? "rgba(163,230,53,0.08)" : "rgba(255,255,255,0.04)", border: resumeAttached ? "1px solid rgba(163,230,53,0.25)" : "1px solid rgba(255,255,255,0.07)" }}>
              <Paperclip size={13} style={{ color: resumeAttached ? "#A3E635" : "#71717A" }} strokeWidth={2} />
              <span style={{ fontSize: 12, color: resumeAttached ? "#A3E635" : "#71717A", fontWeight: resumeAttached ? 600 : 400 }}>
                {resumeAttached ? "Living Resume attached ✓" : "Attach Living Resume"}
              </span>
            </button>
          </>
        )}

        {tab === "resume" && (
          <>
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
              {/* Resume header */}
              <div className="px-4 py-4" style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: "#F5F5F5", letterSpacing: "-0.01em" }}>Jordan Park</p>
                    <p style={{ fontSize: 11, color: "#71717A", marginTop: 1 }}>Sr. Portfolio Optimization Specialist</p>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1" style={{ background: "rgba(163,230,53,0.10)", border: "1px solid rgba(163,230,53,0.25)" }}>
                    <BadgeCheck size={11} style={{ color: "#A3E635" }} strokeWidth={2.5} />
                    <span style={{ fontSize: 9, color: "#A3E635", fontWeight: 600, fontFamily: "var(--font-mono)" }}>VERIFIED</span>
                  </div>
                </div>
              </div>

              {/* Sections */}
              {[
                {
                  title: "Key Skills",
                  content: (
                    <div className="flex flex-wrap gap-1.5">
                      {["Apache Kafka", "Rust", "C++20", "Delta Lake", "LangChain", "Apache Flink", "dbt", "Airflow"].map((s) => (
                        <span key={s} className="rounded-md px-2 py-0.5" style={{ fontSize: 10, background: "rgba(255,255,255,0.06)", color: "#A1A1AA", border: "1px solid rgba(255,255,255,0.08)", fontFamily: "var(--font-mono)" }}>{s}</span>
                      ))}
                    </div>
                  ),
                },
                {
                  title: "Experience",
                  content: (
                    <div className="space-y-2.5">
                      {[
                        { role: "Senior Data Engineer", org: "Stripe", period: "2021–2023", note: "Streaming pipeline migration, T+90s data freshness" },
                        { role: "Data Engineer", org: "Confluent", period: "2019–2021", note: "4B events/day ingestion, real-time infra" },
                      ].map((e) => (
                        <div key={e.org}>
                          <div className="flex items-center justify-between">
                            <span style={{ fontSize: 12, fontWeight: 600, color: "#E4E4E7" }}>{e.role}</span>
                            <span style={{ fontSize: 10, color: "#52525B", fontFamily: "var(--font-mono)" }}>{e.period}</span>
                          </div>
                          <p style={{ fontSize: 11, color: "#71717A", marginTop: 1 }}>{e.org} · {e.note}</p>
                        </div>
                      ))}
                    </div>
                  ),
                },
                {
                  title: "Verified Portfolio",
                  content: (
                    <div className="space-y-1.5">
                      {["low-latency-cpp-infra · 2.1k ⭐", "kafka-lag-exporter · 1.2k ⭐ · Rust", "delta-lake-compaction-patch · merged to Apache Delta"].map((p) => (
                        <div key={p} className="flex items-center gap-2">
                          <CheckCircle2 size={10} style={{ color: "#A3E635" }} strokeWidth={2.5} />
                          <span style={{ fontSize: 11, color: "#A1A1AA", fontFamily: "var(--font-mono)" }}>{p}</span>
                        </div>
                      ))}
                    </div>
                  ),
                },
              ].map(({ title, content }) => (
                <div key={title} className="px-4 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <p style={{ fontSize: 10, color: "#52525B", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>{title}</p>
                  {content}
                </div>
              ))}
            </div>

            {/* Cover note */}
            <div>
              <p style={{ fontSize: 10, color: "#52525B", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Cover Note (optional)</p>
              <textarea rows={4} placeholder="Add a short note to accompany your resume…"
                className="w-full rounded-xl px-4 py-3 outline-none resize-none"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", fontSize: 13, color: "#E4E4E7", lineHeight: 1.65, fontFamily: "var(--font-sans)" }} />
            </div>
          </>
        )}
      </div>

      {/* Send CTA */}
      <div className="px-5 pb-8 pt-3 shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        {sent ? (
          <div className="flex items-center justify-center gap-2 rounded-xl py-3" style={{ background: "rgba(163,230,53,0.12)", border: "1px solid rgba(163,230,53,0.3)" }}>
            <CheckCircle2 size={15} style={{ color: "#A3E635" }} strokeWidth={2.5} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#A3E635" }}>
              {tab === "message" ? "Message sent!" : "Resume sent!"}
            </span>
          </div>
        ) : (
          <button onClick={handleSend}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3 transition-opacity"
            style={{ background: "#A3E635", fontSize: 13, fontWeight: 700, color: "#0A0A0A" }}>
            <Send size={14} strokeWidth={2.5} />
            {tab === "message" ? `Send to ${employer.name}` : `Send Resume to ${employer.name}`}
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Employer Discovery Section ─── */
function EmployerDiscovery() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Employer | null>(null);

  const filtered = employers.filter(
    (e) =>
      e.name.toLowerCase().includes(query.toLowerCase()) ||
      e.openRole.toLowerCase().includes(query.toLowerCase()) ||
      e.industry.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative">
      {selected && <EmployerOverlay employer={selected} onClose={() => setSelected(null)} />}

      {/* Section label + search */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span style={{ fontSize: 10, fontWeight: 600, color: "#52525B", letterSpacing: "0.12em", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>
              Reach Out
            </span>
            <p style={{ fontSize: 11, color: "#52525B", marginTop: 2 }}>Employers matched to your arc</p>
          </div>
          <span className="rounded-full px-2.5 py-1" style={{ fontSize: 9, fontWeight: 600, background: "rgba(163,230,53,0.08)", color: "#A3E635", border: "1px solid rgba(163,230,53,0.2)", fontFamily: "var(--font-mono)" }}>
            {employers.filter((e) => e.hiring).length} HIRING
          </span>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 rounded-xl px-3" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", height: 38 }}>
          <Search size={13} style={{ color: "#52525B" }} strokeWidth={2} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search companies, roles, industries…"
            className="flex-1 bg-transparent outline-none"
            style={{ fontSize: 12, color: "#E4E4E7" }}
          />
          {query && (
            <button onClick={() => setQuery("")}>
              <X size={12} style={{ color: "#52525B" }} />
            </button>
          )}
        </div>
      </div>

      {/* Employer cards */}
      <div className="px-5 pb-2 space-y-2.5">
        {filtered.map((employer) => {
          const fit = fitColors(employer.trajectoryFit);
          return (
            <button
              key={employer.id}
              onClick={() => setSelected(employer)}
              className="w-full text-left rounded-2xl overflow-hidden transition-all duration-150"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-start gap-3 px-4 py-3.5">
                {/* Logo */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: employer.logoBg }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", fontFamily: "var(--font-mono)" }}>{employer.logo}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#F5F5F5", letterSpacing: "-0.01em" }}>{employer.name}</span>
                      {employer.hiring && (
                        <span className="rounded-full px-1.5 py-0.5" style={{ fontSize: 8, fontWeight: 700, background: "rgba(163,230,53,0.10)", color: "#A3E635", fontFamily: "var(--font-mono)" }}>HIRING</span>
                      )}
                    </div>
                    <span className="rounded-md px-2 py-0.5 shrink-0" style={{ fontSize: 10, fontWeight: 700, background: fit.bg, color: fit.text, fontFamily: "var(--font-mono)" }}>
                      {employer.trajectoryFit}%
                    </span>
                  </div>

                  <p style={{ fontSize: 11, color: "#71717A", marginTop: 2 }} className="truncate">{employer.openRole}</p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="flex items-center gap-1" style={{ fontSize: 10, color: "#52525B" }}>
                      <Building2 size={9} strokeWidth={2} />{employer.industry}
                    </span>
                    <span style={{ color: "#3F3F46", fontSize: 10 }}>·</span>
                    <span className="flex items-center gap-1" style={{ fontSize: 10, color: "#52525B" }}>
                      <MapPin size={9} strokeWidth={2} />{employer.location}
                    </span>
                  </div>
                </div>

                <ChevronRight size={14} style={{ color: "#3F3F46", marginTop: 2, flexShrink: 0 }} />
              </div>

              {/* Fit label strip */}
              <div className="px-4 pb-3 flex items-center gap-1.5">
                <TrendingUp size={10} style={{ color: fit.text }} strokeWidth={2.5} />
                <span style={{ fontSize: 10, color: fit.text, fontWeight: 500 }}>{employer.fitLabel}</span>
                <span style={{ fontSize: 10, color: "#3F3F46" }}>·</span>
                <span style={{ fontSize: 10, color: "#52525B" }}>{employer.stage} · {employer.teamSize}</span>
              </div>
            </button>
          );
        })}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8">
            <Search size={20} style={{ color: "#3F3F46", marginBottom: 8 }} />
            <p style={{ fontSize: 12, color: "#52525B" }}>No matches for "{query}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Navigator Tab ─── */
function NavigatorTab() {
  const [expandedRoute, setExpandedRoute] = useState<string | null>("pred-1");
  const [coachDismissed, setCoachDismissed] = useState(false);

  return (
    <>
      {/* Employer Discovery */}
      <EmployerDiscovery />

      {/* Divider */}
      <div className="mx-5 my-1" style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

      <div className="px-5 pt-4 pb-1 flex items-center justify-between">
        <span style={{ fontSize: 10, fontWeight: 600, color: "#52525B", letterSpacing: "0.12em", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>
          Career Arc · Timeline
        </span>
        <span style={{ fontSize: 10, color: "#52525B", fontFamily: "var(--font-mono)" }}>5 nodes</span>
      </div>

      <div className="px-5 pb-2">
        <div className="relative">
          <div className="absolute" style={{ left: 11, top: 12, bottom: 12, width: 1, background: "linear-gradient(to bottom, #3F3F46, #27272A 60%, transparent)" }} />
          <div className="space-y-0">
            {timelineMilestones.map((m, i) => {
              const isPredicted = m.type === "predicted";
              const isCurrent = m.type === "current";
              const isExpanded = expandedRoute === m.id;
              return (
                <div key={m.id} className="relative flex gap-3">
                  <div className="flex flex-col items-center shrink-0" style={{ width: 23 }}>
                    <div className="rounded-full flex items-center justify-center shrink-0" style={{ width: 23, height: 23, background: isCurrent ? "#A3E635" : isPredicted ? routeColors[(m as any).route].bg : "rgba(255,255,255,0.06)", border: isCurrent ? "2px solid #A3E635" : isPredicted ? `1.5px solid ${routeColors[(m as any).route].dot}` : "1.5px solid #3F3F46", zIndex: 1 }}>
                      {isCurrent ? <CircleDot size={10} color="#0A0A0A" strokeWidth={3} /> : isPredicted ? <span style={{ fontSize: 8, fontWeight: 700, color: routeColors[(m as any).route].text, fontFamily: "var(--font-mono)" }}>{(m as any).route}</span> : <CheckCircle2 size={10} color="#52525B" strokeWidth={2.5} />}
                    </div>
                  </div>
                  <div className="flex-1 mb-3 rounded-xl overflow-hidden" style={{ background: isCurrent ? "rgba(163,230,53,0.04)" : isPredicted ? routeColors[(m as any).route].bg : "rgba(255,255,255,0.03)", border: isCurrent ? "1px solid rgba(163,230,53,0.20)" : isPredicted ? `1px solid ${routeColors[(m as any).route].dot}22` : "1px solid rgba(255,255,255,0.05)" }}>
                    <button className="w-full text-left p-3" onClick={() => isPredicted && setExpandedRoute(isExpanded ? null : m.id)}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {isPredicted && <span style={{ fontSize: 9, fontWeight: 600, color: routeColors[(m as any).route].text, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Route {(m as any).route}</span>}
                            {isCurrent && <span style={{ fontSize: 9, fontWeight: 600, color: "#A3E635", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Current</span>}
                            {m.type === "past" && <span style={{ fontSize: 9, fontWeight: 500, color: "#52525B", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Past · Verified</span>}
                          </div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "#F5F5F5", marginTop: 2, letterSpacing: "-0.01em" }}>{m.title}</p>
                          {!isPredicted && <p style={{ fontSize: 11, color: "#71717A", marginTop: 1 }}>{(m as any).org}</p>}
                          {isPredicted && <p style={{ fontSize: 11, color: "#71717A", marginTop: 1 }}>{(m as any).orgs?.join(" · ")}</p>}
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {isPredicted && <span style={{ fontSize: 11, fontWeight: 700, color: routeColors[(m as any).route].text, fontFamily: "var(--font-mono)" }}>{(m as any).confidence}%</span>}
                          {isPredicted && <ChevronRight size={13} style={{ color: "#52525B", transform: isExpanded ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />}
                        </div>
                      </div>
                      {!isPredicted && (m as any).skills && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {(m as any).skills.map((s: string) => (
                            <span key={s} style={{ fontSize: 9, background: "rgba(255,255,255,0.06)", color: "#A1A1AA", borderRadius: 4, padding: "2px 6px", fontFamily: "var(--font-mono)" }}>{s}</span>
                          ))}
                        </div>
                      )}
                    </button>
                    {isPredicted && isExpanded && (
                      <div style={{ borderTop: `1px solid ${routeColors[(m as any).route].dot}18`, padding: "10px 12px 12px" }}>
                        <p style={{ fontSize: 12, color: "#A1A1AA", lineHeight: 1.55 }}>{(m as any).rationale}</p>
                        <button className="flex items-center gap-1.5 mt-2.5 rounded-lg px-3 py-1.5" style={{ background: routeColors[(m as any).route].bg, border: `1px solid ${routeColors[(m as any).route].dot}33` }}>
                          <TrendingUp size={11} style={{ color: routeColors[(m as any).route].text }} strokeWidth={2.5} />
                          <span style={{ fontSize: 11, color: routeColors[(m as any).route].text, fontWeight: 600 }}>Explore this path</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Living Portfolio card */}
      <div className="px-5 pt-1 pb-2">
        <div className="flex items-center justify-between mb-3">
          <span style={{ fontSize: 10, fontWeight: 600, color: "#52525B", letterSpacing: "0.12em", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>Living Portfolio · Real-time</span>
          <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full" style={{ background: "#A3E635" }} /><span style={{ fontSize: 10, color: "#52525B", fontFamily: "var(--font-mono)" }}>Syncing</span></div>
        </div>
        <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-2"><Zap size={13} style={{ color: "#A3E635" }} strokeWidth={2.5} /><span style={{ fontSize: 12, fontWeight: 600, color: "#F5F5F5" }}>Proof of Capability Feed</span></div>
            <span style={{ fontSize: 10, color: "#52525B", fontFamily: "var(--font-mono)" }}>4 verified</span>
          </div>
          {portfolioSamples.slice(0, 3).map((item, i) => (
            <div key={item.id} className="flex items-center gap-3 px-4 py-3" style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <PortfolioIcon type={item.icon} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5"><span style={{ fontSize: 12, fontWeight: 600, color: "#E4E4E7" }}>{item.title}</span><CheckCircle2 size={10} style={{ color: "#A3E635" }} strokeWidth={2.5} /></div>
                <p style={{ fontSize: 11, color: "#71717A", marginTop: 1 }} className="truncate">{item.subtitle}</p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="rounded-md px-1.5 py-0.5" style={{ fontSize: 9, fontWeight: 600, background: `${item.tagColor}18`, color: item.tagColor, fontFamily: "var(--font-mono)" }}>{item.tag}</span>
                <span style={{ fontSize: 10, color: "#52525B", fontFamily: "var(--font-mono)" }}>{item.age}</span>
              </div>
            </div>
          ))}
          <button className="w-full flex items-center justify-center gap-1.5 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <span style={{ fontSize: 11, color: "#52525B", fontWeight: 500 }}>View full portfolio</span>
            <ArrowUpRight size={11} style={{ color: "#52525B" }} />
          </button>
        </div>
      </div>

      {/* AI Coach Banner */}
      {!coachDismissed && (
        <div className="px-5 pt-1 pb-4">
          <div className="rounded-2xl p-4" style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.22)" }}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)" }}>
                <Sparkles size={14} style={{ color: "#A78BFA" }} strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <span style={{ fontSize: 10, fontWeight: 700, color: "#A78BFA", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em" }}>AI Coach · Market Signal</span>
                <p style={{ fontSize: 12, color: "#D4D4D8", lineHeight: 1.6, marginTop: 4 }}>
                  Market tracking shows your specialized skill bracket is currently <span style={{ color: "#F472B6", fontWeight: 600 }}>underpaid by 12%</span>. Tap to model a compensation conversation.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5" style={{ background: "#7C3AED", fontSize: 11, fontWeight: 600, color: "#fff" }}>
                    <TrendingUp size={11} strokeWidth={2.5} />
                    Model conversation
                  </button>
                  <button onClick={() => setCoachDismissed(true)} style={{ fontSize: 11, color: "#52525B" }}>Dismiss</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Portfolio Tab ─── */
function PortfolioTab() {
  const [selected, setSelected] = useState<PortfolioSample | null>(null);

  return (
    <div className="relative flex-1">
      {selected && <PortfolioDetail sample={selected} onClose={() => setSelected(null)} />}

      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <div>
          <span style={{ fontSize: 10, fontWeight: 600, color: "#52525B", letterSpacing: "0.12em", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>My Portfolio</span>
          <div className="flex items-center gap-1 mt-0.5"><span className="w-1.5 h-1.5 rounded-full" style={{ background: "#A3E635" }} /><span style={{ fontSize: 10, color: "#52525B", fontFamily: "var(--font-mono)" }}>4 items · All verified</span></div>
        </div>
        <span className="rounded-full px-2.5 py-1" style={{ fontSize: 10, fontWeight: 600, background: "rgba(163,230,53,0.08)", color: "#A3E635", border: "1px solid rgba(163,230,53,0.2)", fontFamily: "var(--font-mono)" }}>LIVE</span>
      </div>

      <div className="px-5 pb-4 space-y-3">
        {portfolioSamples.map((sample) => (
          <button
            key={sample.id}
            onClick={() => setSelected(sample)}
            className="w-full text-left rounded-2xl overflow-hidden transition-all duration-150"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            {/* Card header */}
            <div className="flex items-start gap-3 p-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${sample.tagColor}14`, border: `1px solid ${sample.tagColor}28` }}>
                <PortfolioIcon type={sample.icon} size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#F5F5F5", letterSpacing: "-0.01em" }}>{sample.title}</span>
                  {sample.verified && <CheckCircle2 size={11} style={{ color: "#A3E635" }} strokeWidth={2.5} />}
                </div>
                <p style={{ fontSize: 11, color: "#71717A", marginTop: 1 }}>{sample.subtitle}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="rounded-md px-2 py-0.5" style={{ fontSize: 9, fontWeight: 700, background: `${sample.tagColor}18`, color: sample.tagColor, fontFamily: "var(--font-mono)" }}>{sample.tag}</span>
                <ChevronRight size={13} style={{ color: "#52525B" }} />
              </div>
            </div>

            {/* Summary */}
            <div className="px-4 py-3">
              <p style={{ fontSize: 12, color: "#A1A1AA", lineHeight: 1.55 }} className="line-clamp-2">{sample.summary}</p>
            </div>

            {/* Metrics row */}
            <div className="flex px-4 pb-3 gap-3">
              {sample.metrics.map((m) => (
                <div key={m.label} className="flex flex-col gap-0.5">
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#E4E4E7", fontFamily: "var(--font-mono)", letterSpacing: "-0.02em" }}>{m.value}</span>
                  <span style={{ fontSize: 9, color: "#52525B" }}>{m.label}</span>
                </div>
              ))}
              <div className="ml-auto flex items-end">
                <span style={{ fontSize: 10, color: "#52525B", fontFamily: "var(--font-mono)" }}>{sample.age}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Coach Tab ─── */
function CoachTab() {
  const [messages, setMessages] = useState<ChatMsg[]>(initialMessages);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMsg = { id: `u${Date.now()}`, role: "user", text: text.trim(), time: "Just now" };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTimeout(() => {
      const reply: ChatMsg = { id: `c${Date.now()}`, role: "coach", text: "Great question. Give me a moment to pull your latest trajectory data and market comps for that. I'll have a detailed breakdown ready shortly.", time: "Just now" };
      setMessages((m) => [...m, reply]);
    }, 900);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="px-5 pt-4 pb-3 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)" }}>
          <Sparkles size={14} style={{ color: "#A78BFA" }} strokeWidth={2} />
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#F5F5F5" }}>Senior AI Career Coach</p>
          <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full" style={{ background: "#A3E635" }} /><span style={{ fontSize: 10, color: "#52525B", fontFamily: "var(--font-mono)" }}>Online · Monitoring your signals</span></div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ scrollbarWidth: "none" }}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            {msg.role === "coach" && (
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(124,58,237,0.18)", border: "1px solid rgba(124,58,237,0.3)" }}>
                <Sparkles size={12} style={{ color: "#A78BFA" }} strokeWidth={2} />
              </div>
            )}
            <div className="flex flex-col gap-1 max-w-[80%]">
              <div
                className="rounded-2xl px-3.5 py-2.5"
                style={{
                  background: msg.role === "user" ? "#7C3AED" : "rgba(255,255,255,0.06)",
                  borderTopRightRadius: msg.role === "user" ? 6 : undefined,
                  borderTopLeftRadius: msg.role === "coach" ? 6 : undefined,
                }}
              >
                <p style={{ fontSize: 13, color: msg.role === "user" ? "#fff" : "#D4D4D8", lineHeight: 1.55 }}>{msg.text}</p>
              </div>
              <span style={{ fontSize: 10, color: "#52525B", textAlign: msg.role === "user" ? "right" : "left", fontFamily: "var(--font-mono)" }}>{msg.time}</span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Prompt shortcuts */}
      <div className="px-4 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {promptShortcuts.map((p) => (
            <button
              key={p}
              onClick={() => send(p)}
              className="rounded-full px-3 py-1.5 shrink-0 transition-colors"
              style={{ background: "rgba(124,58,237,0.10)", border: "1px solid rgba(124,58,237,0.25)", fontSize: 11, color: "#A78BFA", fontWeight: 500, whiteSpace: "nowrap" }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="px-4 pb-5">
        <div className="flex items-center gap-2 rounded-2xl px-4" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", height: 48 }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Ask your coach anything…"
            className="flex-1 bg-transparent outline-none"
            style={{ fontSize: 13, color: "#E4E4E7" }}
          />
          <button
            onClick={() => send(input)}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-opacity"
            style={{ background: input.trim() ? "#7C3AED" : "rgba(255,255,255,0.06)", opacity: input.trim() ? 1 : 0.5 }}
          >
            <Send size={14} color="#fff" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Pay Tab ─── */
function PayTab() {
  return (
    <div className="px-5 pt-5 flex flex-col gap-4">
      <div>
        <span style={{ fontSize: 10, fontWeight: 600, color: "#52525B", letterSpacing: "0.12em", fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>Pay Engine</span>
      </div>
      <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <p style={{ fontSize: 12, color: "#71717A" }}>Coming soon — real-time comp modeling, bracket analysis, and negotiation scripts tailored to your trajectory.</p>
      </div>
    </div>
  );
}

/* ─── Main EmployeeView ─── */
const tabItems: { id: Tab; icon: React.ReactNode; label: string }[] = [
  { id: "navigator", icon: <Compass size={20} strokeWidth={1.8} />, label: "Navigator" },
  { id: "portfolio", icon: <FolderOpen size={20} strokeWidth={1.8} />, label: "My Portfolio" },
  { id: "coach", icon: <MessageSquare size={20} strokeWidth={1.8} />, label: "Coach" },
  { id: "pay", icon: <DollarSign size={20} strokeWidth={1.8} />, label: "Pay Engine" },
];

export function EmployeeView() {
  const [activeTab, setActiveTab] = useState<Tab>("navigator");

  const isCoach = activeTab === "coach";

  return (
    <div className="relative mx-auto flex flex-col overflow-hidden" style={{ width: 393, height: 852, background: "#0A0A0A", borderRadius: 48, border: "1px solid rgba(255,255,255,0.10)", boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset", fontFamily: "var(--font-sans)" }}>
      {/* Status bar */}
      <div className="flex items-center justify-between px-8 shrink-0" style={{ height: 54, paddingTop: 14 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#F5F5F5", letterSpacing: "-0.01em" }}>9:41</span>
        <div className="rounded-full flex items-center justify-center" style={{ width: 120, height: 34, background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.08)" }} />
        <div className="flex items-center gap-1.5">
          <div style={{ width: 16, height: 11, borderRadius: 3, border: "1.5px solid #F5F5F5", position: "relative" }}>
            <div style={{ position: "absolute", top: 2, left: 2, right: 3, bottom: 2, background: "#F5F5F5", borderRadius: 1 }} />
          </div>
        </div>
      </div>

      {/* Top Nav */}
      <div className="flex items-center justify-between px-5 shrink-0" style={{ height: 60, borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(10,10,10,0.95)" }}>
        <div>
          <div className="flex items-center gap-1.5">
            <span style={{ fontSize: 15, fontWeight: 700, color: "#F5F5F5", letterSpacing: "-0.02em" }}>Jordan Park</span>
            <ShieldCheck size={13} style={{ color: "#A3E635" }} strokeWidth={2.5} />
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="flex items-center gap-1 rounded-full px-2 py-0.5" style={{ background: "rgba(163,230,53,0.10)", fontSize: 10, color: "#A3E635", fontWeight: 500, fontFamily: "var(--font-mono)" }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#A3E635" }} />
              LIVING PORTFOLIO · ACTIVE
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative flex items-center justify-center rounded-full" style={{ width: 36, height: 36, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <Bell size={15} style={{ color: "#A1A1AA" }} strokeWidth={1.8} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "#A3E635", border: "1.5px solid #0A0A0A" }} />
          </button>
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #3730A3, #7C3AED)", fontSize: 12, fontWeight: 700, color: "#fff", fontFamily: "var(--font-mono)" }}>JP</div>
        </div>
      </div>

      {/* Body */}
      <div className={`flex-1 overflow-y-auto ${isCoach ? "flex flex-col overflow-hidden" : ""}`} style={{ scrollbarWidth: "none", paddingBottom: isCoach ? 0 : 80 }}>
        {activeTab === "navigator" && <NavigatorTab />}
        {activeTab === "portfolio" && <PortfolioTab />}
        {activeTab === "coach" && <CoachTab />}
        {activeTab === "pay" && <PayTab />}
      </div>

      {/* Bottom Tab Bar */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-around shrink-0" style={{ height: 80, paddingBottom: 16, background: "rgba(10,10,10,0.96)", borderTop: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}>
        {tabItems.map(({ id, icon, label }) => {
          const active = activeTab === id;
          return (
            <button key={id} onClick={() => setActiveTab(id)} className="flex flex-col items-center gap-1 transition-all duration-150" style={{ minWidth: 60 }}>
              <div style={{ color: active ? "#A3E635" : "#52525B", transform: active ? "scale(1.05)" : "scale(1)", transition: "all 0.15s" }}>{icon}</div>
              <span style={{ fontSize: 10, fontWeight: active ? 600 : 400, color: active ? "#A3E635" : "#52525B", letterSpacing: "-0.01em" }}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
