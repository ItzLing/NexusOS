import {
  LayoutList,
  Zap,
  Briefcase,
  Settings,
  Brain,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { icon: LayoutList, label: "Talent Pipeline", active: true },
  { icon: Zap, label: "Active Matches" },
  { icon: Briefcase, label: "Open Roles" },
];

const bottomItems = [
  { icon: Settings, label: "Settings" },
];

export function Sidebar() {
  return (
    <aside
      className="fixed left-0 top-0 h-screen w-16 flex flex-col items-center py-5 z-40"
      style={{ background: "var(--sidebar)", borderRight: "1px solid var(--sidebar-border)" }}
    >
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center gap-1">
        <div
          className="w-8 h-8 rounded flex items-center justify-center"
          style={{ background: "var(--sidebar-primary)" }}
        >
          <Brain size={16} color="#fff" strokeWidth={2} />
        </div>
      </div>

      {/* Primary Nav */}
      <nav className="flex flex-col items-center gap-1 flex-1">
        {navItems.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            title={label}
            className="group relative w-10 h-10 rounded flex items-center justify-center transition-colors duration-150"
            style={{
              background: active ? "var(--sidebar-accent)" : "transparent",
              color: active ? "var(--sidebar-primary)" : "var(--sidebar-foreground)",
            }}
          >
            <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
            {active && (
              <span
                className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r"
                style={{ background: "var(--sidebar-primary)" }}
              />
            )}
            {/* Tooltip */}
            <span
              className="pointer-events-none absolute left-14 whitespace-nowrap rounded px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50"
              style={{
                background: "var(--sidebar-accent)",
                color: "var(--sidebar-accent-foreground)",
                fontFamily: "var(--font-sans)",
              }}
            >
              {label}
              <ChevronRight size={10} className="inline ml-0.5 opacity-50" />
            </span>
          </button>
        ))}
      </nav>

      {/* Bottom Nav */}
      <div className="flex flex-col items-center gap-1">
        {bottomItems.map(({ icon: Icon, label }) => (
          <button
            key={label}
            title={label}
            className="group relative w-10 h-10 rounded flex items-center justify-center transition-colors duration-150"
            style={{ color: "var(--sidebar-foreground)" }}
          >
            <Icon size={18} strokeWidth={1.8} />
          </button>
        ))}
        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center mt-3 text-xs"
          style={{ background: "#3D342F", color: "var(--sidebar-foreground)", fontFamily: "var(--font-mono)" }}
        >
          AK
        </div>
      </div>
    </aside>
  );
}
