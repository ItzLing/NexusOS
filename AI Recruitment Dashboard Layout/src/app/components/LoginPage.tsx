import { useState, useEffect } from "react";
import { Brain, ArrowRight, Building2, User, Sparkles, ShieldCheck, TrendingUp, Zap } from "lucide-react";

interface Props {
  onLogin: (role: "employer" | "employee") => void;
}

const employerFeatures = [
  "AI trajectory-matched talent pipeline",
  "Direct introduction to top candidates",
  "Predictive hiring intelligence",
  "Automated Google Calendar scheduling",
];

const employeeFeatures = [
  "Verified living portfolio & arc",
  "Predictive career trajectory mapping",
  "AI senior career coach",
  "Employer match discovery",
];

export function LoginPage({ onLogin }: Props) {
  const [hovered, setHovered] = useState<"employer" | "employee" | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ fontFamily: "var(--font-sans)", background: "#07060A" }}
    >
      {/* ── Left panel — ambient art ── */}
      <div
        className="hidden lg:flex flex-col justify-center relative overflow-hidden"
        style={{ width: "44%", background: "linear-gradient(145deg, #0E0C14 0%, #140F1E 50%, #0C1018 100%)" }}
      >
        {/* Radial glows */}
        <div className="absolute" style={{ inset: 0, background: "radial-gradient(ellipse 70% 60% at 30% 20%, rgba(194,98,42,0.13) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div className="absolute" style={{ inset: 0, background: "radial-gradient(ellipse 60% 55% at 80% 75%, rgba(163,230,53,0.06) 0%, transparent 55%)", pointerEvents: "none" }} />
        <div className="absolute" style={{ inset: 0, background: "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(124,58,237,0.05) 0%, transparent 60%)", pointerEvents: "none" }} />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />

        {/* Logo — absolute so it doesn't shift centered content */}
        <div className="absolute top-10 left-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(194,98,42,0.15)", border: "1px solid rgba(194,98,42,0.3)" }}>
            <Brain size={18} style={{ color: "#C2622A" }} strokeWidth={2} />
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#F5F5F5", letterSpacing: "-0.02em" }}>Nexus OS</p>
            <p style={{ fontSize: 10, color: "#52525B", fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }}>BETA · v0.4</p>
          </div>
        </div>

        {/* Hero text — vertically centered, 70% of panel width */}
        <div className="relative mx-auto" style={{ width: "70%" }}>
          <p style={{ fontSize: 12, color: "#C2622A", fontFamily: "var(--font-mono)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 24 }}>
            The Career Navigation Platform
          </p>
          <h1 style={{ fontSize: 64, fontWeight: 800, color: "#F5F5F5", lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: 24 }}>
            Navigate<br />work like a<br />trajectory,<br />not a<br />transaction.
          </h1>
          <p style={{ fontSize: 20, color: "#71717A", lineHeight: 1.75, marginBottom: 40 }}>
            Nexus OS replaces the transactional job market with a continuous navigation framework — connecting real-time candidate velocity to employers who think in systems, not snapshots.
          </p>

          {/* Stat pills — stretch to fill 70% column */}
          <div className="flex gap-3">
            {[
              { value: "94%", label: "Match accuracy" },
              { value: "12k+", label: "Trajectories mapped" },
              { value: "3.2×", label: "Faster hiring cycle" },
            ].map(({ value, label }) => (
              <div key={label} className="flex-1 rounded-xl px-4 py-3" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <p style={{ fontSize: 30, fontWeight: 800, color: "#F5F5F5", fontFamily: "var(--font-mono)", letterSpacing: "-0.02em" }}>{value}</p>
                <p style={{ fontSize: 15, color: "#52525B", marginTop: 3 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <p style={{ fontSize: 10, color: "#27272A", fontFamily: "var(--font-mono)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Nexus OS · Career Navigation Platform · Beta
          </p>
        </div>
      </div>

      {/* ── Right panel — login cards ── */}
      <div
        className="flex flex-col items-center justify-center flex-1 px-6 relative"
        style={{ background: "var(--background)" }}
      >
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--primary)" }}>
            <Brain size={16} color="#fff" strokeWidth={2} />
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: "var(--foreground)" }}>Nexus OS</span>
        </div>

        <div
          className="w-full max-w-md"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.45s ease, transform 0.45s ease",
          }}
        >
          <div className="mb-8 text-center">
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.02em" }}>
              Sign in to Nexus OS
            </h2>
            <p style={{ fontSize: 13, color: "var(--muted-foreground)", marginTop: 6 }}>
              Choose your role to enter your workspace
            </p>
          </div>

          {/* Role cards */}
          <div className="space-y-3">
            {/* Employer card */}
            <button
              onMouseEnter={() => setHovered("employer")}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onLogin("employer")}
              className="w-full rounded-2xl p-5 text-left transition-all duration-200"
              style={{
                background: hovered === "employer" ? "rgba(194,98,42,0.06)" : "var(--card)",
                border: `1.5px solid ${hovered === "employer" ? "rgba(194,98,42,0.4)" : "var(--border)"}`,
                boxShadow: hovered === "employer" ? "0 8px 32px rgba(194,98,42,0.08)" : "none",
                transform: hovered === "employer" ? "translateY(-1px)" : "translateY(0)",
              }}
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: hovered === "employer" ? "rgba(194,98,42,0.12)" : "var(--accent)", border: "1px solid rgba(194,98,42,0.2)" }}>
                  <Building2 size={20} style={{ color: "#C2622A" }} strokeWidth={1.8} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.01em" }}>Employer</p>
                    <ArrowRight size={15} style={{ color: hovered === "employer" ? "#C2622A" : "var(--muted-foreground)", transition: "color 0.2s, transform 0.2s", transform: hovered === "employer" ? "translateX(3px)" : "none" }} />
                  </div>
                  <p style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 12 }}>
                    Hire for trajectory · Access the talent pipeline
                  </p>
                  <div className="space-y-1.5">
                    {employerFeatures.map((f) => (
                      <div key={f} className="flex items-center gap-2">
                        <Zap size={10} style={{ color: "#C2622A", flexShrink: 0 }} strokeWidth={2.5} />
                        <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#7C5C4A", fontSize: 7, fontFamily: "var(--font-mono)", color: "#fff", fontWeight: 700 }}>AK</div>
                <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Demo: Arjun Kumar · <span style={{ fontFamily: "var(--font-mono)" }}>arjun@nexusos.io</span></span>
              </div>
            </button>

            {/* Employee card */}
            <button
              onMouseEnter={() => setHovered("employee")}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onLogin("employee")}
              className="w-full rounded-2xl p-5 text-left transition-all duration-200"
              style={{
                background: hovered === "employee" ? "rgba(163,230,53,0.04)" : "var(--card)",
                border: `1.5px solid ${hovered === "employee" ? "rgba(163,230,53,0.3)" : "var(--border)"}`,
                boxShadow: hovered === "employee" ? "0 8px 32px rgba(163,230,53,0.06)" : "none",
                transform: hovered === "employee" ? "translateY(-1px)" : "translateY(0)",
              }}
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: hovered === "employee" ? "rgba(163,230,53,0.08)" : "var(--accent)", border: "1px solid rgba(163,230,53,0.18)" }}>
                  <User size={20} style={{ color: "#A3E635" }} strokeWidth={1.8} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)", letterSpacing: "-0.01em" }}>Employee / Candidate</p>
                    <ArrowRight size={15} style={{ color: hovered === "employee" ? "#A3E635" : "var(--muted-foreground)", transition: "color 0.2s, transform 0.2s", transform: hovered === "employee" ? "translateX(3px)" : "none" }} />
                  </div>
                  <p style={{ fontSize: 12, color: "var(--muted-foreground)", marginBottom: 12 }}>
                    Navigate your career arc · Build verified proof-of-work
                  </p>
                  <div className="space-y-1.5">
                    {employeeFeatures.map((f) => (
                      <div key={f} className="flex items-center gap-2">
                        <TrendingUp size={10} style={{ color: "#A3E635", flexShrink: 0 }} strokeWidth={2.5} />
                        <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #3730A3, #7C3AED)", fontSize: 7, fontFamily: "var(--font-mono)", color: "#fff", fontWeight: 700 }}>JP</div>
                <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Demo: Jordan Park · <span style={{ fontFamily: "var(--font-mono)" }}>jordan@nexusos.io</span></span>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <ShieldCheck size={12} style={{ color: "var(--muted-foreground)" }} strokeWidth={2} />
            <p style={{ fontSize: 11, color: "var(--muted-foreground)" }}>
              Demo environment · No real data · No auth required
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
