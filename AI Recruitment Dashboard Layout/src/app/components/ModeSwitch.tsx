import { Building2, User } from "lucide-react";

type Mode = "employer" | "employee";

interface Props {
  mode: Mode;
  onChange: (mode: Mode) => void;
}

export function ModeSwitch({ mode, onChange }: Props) {
  return (
    <div
      className="flex items-center rounded-full p-0.5 shrink-0"
      style={{ background: "var(--input-background)", border: "1px solid var(--border)" }}
    >
      <button
        onClick={() => onChange("employer")}
        className="flex items-center gap-1.5 rounded-full px-3 transition-all duration-200"
        style={{
          height: "28px",
          fontSize: "11px",
          fontWeight: mode === "employer" ? 600 : 400,
          background: mode === "employer" ? "var(--card)" : "transparent",
          color: mode === "employer" ? "var(--foreground)" : "var(--muted-foreground)",
          boxShadow: mode === "employer" ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
        }}
      >
        <Building2 size={11} strokeWidth={2} />
        Employer
      </button>
      <button
        onClick={() => onChange("employee")}
        className="flex items-center gap-1.5 rounded-full px-3 transition-all duration-200"
        style={{
          height: "28px",
          fontSize: "11px",
          fontWeight: mode === "employee" ? 600 : 400,
          background: mode === "employee" ? "#0F0F0F" : "transparent",
          color: mode === "employee" ? "#F5F5F5" : "var(--muted-foreground)",
          boxShadow: mode === "employee" ? "0 1px 4px rgba(0,0,0,0.18)" : "none",
        }}
      >
        <User size={11} strokeWidth={2} />
        Employee
      </button>
    </div>
  );
}
