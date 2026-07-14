import { useState, useRef, useEffect } from "react";
import {
  Send, Sparkles, X, Calendar, UserCheck, ChevronRight,
  Clock, Video, MapPin, CheckCircle2, Circle, ChevronDown,
  FileText, Package, Briefcase, AlertCircle, ArrowRight,
  MessageSquareMore, Users, Plus, Search,
} from "lucide-react";

/* ────────────────────────────────────────────────
   Types
──────────────────────────────────────────────── */
type PanelView = "thread" | "schedule" | "hiring";
type HiringStage = "shortlisted" | "interview" | "offer" | "onboarding" | "hired";

interface ChatMsg {
  id: string;
  role: "employer" | "candidate" | "system";
  text: string;
  time: string;
  attachment?: { type: "meeting" | "offer" | "task"; label: string };
}

interface Conversation {
  id: string;
  candidateName: string;
  candidateInitials: string;
  avatarBg: string;
  role: string;
  stage: HiringStage;
  unread: number;
  lastMsg: string;
  lastTime: string;
  messages: ChatMsg[];
}

interface MeetingSlot {
  id: string;
  label: string;
  date: string;
  time: string;
  type: "video" | "in-person";
}

interface OnboardingTask {
  id: string;
  label: string;
  owner: "candidate" | "employer";
  done: boolean;
  dueDate: string;
}

/* ────────────────────────────────────────────────
   Static data
──────────────────────────────────────────────── */
const stageConfig: Record<HiringStage, { label: string; color: string; bg: string }> = {
  shortlisted: { label: "Shortlisted", color: "#1D4E89", bg: "#EFF6FF" },
  interview: { label: "Interview", color: "#92400E", bg: "#FFFBEB" },
  offer: { label: "Offer Sent", color: "#7C3AED", bg: "#F5F3FF" },
  onboarding: { label: "Onboarding", color: "#065F46", bg: "#ECFDF5" },
  hired: { label: "Hired ✓", color: "#166534", bg: "#DCFCE7" },
};

const meetingSlots: MeetingSlot[] = [
  { id: "s1", label: "Intro Call", date: "Thu 17 Jul", time: "10:00 AM", type: "video" },
  { id: "s2", label: "Technical Screen", date: "Fri 18 Jul", time: "2:00 PM", type: "video" },
  { id: "s3", label: "Team Interview", date: "Mon 21 Jul", time: "11:00 AM", type: "in-person" },
  { id: "s4", label: "Final Round", date: "Wed 23 Jul", time: "3:30 PM", type: "video" },
];

const onboardingTasks: OnboardingTask[] = [
  { id: "t1", label: "Sign offer letter", owner: "candidate", done: false, dueDate: "Jul 20" },
  { id: "t2", label: "Background check consent", owner: "candidate", done: false, dueDate: "Jul 21" },
  { id: "t3", label: "Equipment preference form", owner: "candidate", done: false, dueDate: "Jul 22" },
  { id: "t4", label: "Provision laptop & accounts", owner: "employer", done: false, dueDate: "Jul 24" },
  { id: "t5", label: "Send benefits enrollment link", owner: "employer", done: false, dueDate: "Jul 24" },
  { id: "t6", label: "Schedule Day 1 onboarding session", owner: "employer", done: false, dueDate: "Jul 25" },
  { id: "t7", label: "Complete I-9 / right-to-work docs", owner: "candidate", done: false, dueDate: "Jul 28" },
  { id: "t8", label: "Assign buddy / peer mentor", owner: "employer", done: true, dueDate: "Jul 15" },
];

const hiringStages: { id: HiringStage; label: string; icon: React.ReactNode }[] = [
  { id: "shortlisted", label: "Shortlisted", icon: <Users size={12} /> },
  { id: "interview", label: "Interview", icon: <Video size={12} /> },
  { id: "offer", label: "Offer", icon: <FileText size={12} /> },
  { id: "onboarding", label: "Onboarding", icon: <Package size={12} /> },
  { id: "hired", label: "Hired", icon: <CheckCircle2 size={12} /> },
];

const makeConversation = (
  id: string,
  name: string,
  initials: string,
  bg: string,
  role: string,
  stage: HiringStage,
  unread: number,
  prefill?: string
): Conversation => ({
  id, candidateName: name, candidateInitials: initials, avatarBg: bg, role, stage, unread,
  lastMsg: prefill ?? "No messages yet",
  lastTime: "Just now",
  messages: prefill
    ? [
        {
          id: "sys1", role: "system",
          text: `Conversation started with ${name} for ${role}.`,
          time: "Just now",
        },
        {
          id: "pre1", role: "employer",
          text: prefill,
          time: "Just now",
        },
        {
          id: "pre2", role: "candidate",
          text: "Thanks for reaching out! I'd love to learn more about this opportunity and the team culture. Would it be possible to set up a brief intro call?",
          time: "Just now",
        },
      ]
    : [
        {
          id: "sys1", role: "system",
          text: `Conversation started with ${name} for ${role}.`,
          time: "Today",
        },
      ],
});

const shortcuts = ["Draft a follow-up", "Suggest an opener", "What's their strongest signal?", "Schedule an intro call"];

/* ────────────────────────────────────────────────
   Sub-components
──────────────────────────────────────────────── */

/* Stage progress bar */
function StageTrack({ stage, onChange }: { stage: HiringStage; onChange: (s: HiringStage) => void }) {
  const order: HiringStage[] = ["shortlisted", "interview", "offer", "onboarding", "hired"];
  const currentIdx = order.indexOf(stage);

  return (
    <div className="flex items-center gap-0">
      {hiringStages.map(({ id, label, icon }, i) => {
        const passed = order.indexOf(id) <= currentIdx;
        const active = id === stage;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className="flex flex-col items-center gap-1 flex-1 relative group"
          >
            {/* Connector line */}
            {i > 0 && (
              <div
                className="absolute left-0 top-3.5 w-1/2 h-px -translate-x-1/2"
                style={{ background: order.indexOf(id) <= currentIdx ? "var(--primary)" : "var(--border)" }}
              />
            )}
            {i < hiringStages.length - 1 && (
              <div
                className="absolute right-0 top-3.5 w-1/2 h-px translate-x-1/2"
                style={{ background: order.indexOf(hiringStages[i + 1].id) <= currentIdx ? "var(--primary)" : "var(--border)" }}
              />
            )}
            {/* Dot */}
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center z-10 transition-all"
              style={{
                background: active ? "var(--primary)" : passed ? "rgba(194,98,42,0.15)" : "var(--accent)",
                border: active ? "2px solid var(--primary)" : passed ? "1.5px solid rgba(194,98,42,0.4)" : "1.5px solid var(--border)",
                color: active ? "#fff" : passed ? "var(--primary)" : "var(--muted-foreground)",
              }}
            >
              {icon}
            </div>
            <span style={{ fontSize: 9, color: active ? "var(--primary)" : "var(--muted-foreground)", fontWeight: active ? 600 : 400, fontFamily: "var(--font-mono)" }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* Schedule panel */
function SchedulePanel({
  conv,
  onSendMeeting,
  onNavigateToThread,
}: {
  conv: Conversation;
  onSendMeeting: (slot: MeetingSlot, eventId: string) => void;
  onNavigateToThread: () => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const [meetingType, setMeetingType] = useState<"video" | "in-person">("video");
  const [isDispatching, setIsDispatching] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleDispatch = () => {
    if (!picked) return;
    setIsDispatching(true);
    // Simulate Google Calendar API latency
    setTimeout(() => {
      setIsDispatching(false);
      const slot = meetingSlots.find((s) => s.id === picked)!;
      const eventId = `GCAL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      // Update the chat thread
      onSendMeeting(slot, eventId);
      // Show toast, then navigate to thread after 1 second
      setShowToast(true);
      setTimeout(() => {
        onNavigateToThread();
      }, 1000);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full relative" style={{ background: "var(--background)" }}>

      {/* ── 1-second green success toast overlay ── */}
      {showToast && (
        <div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-3 pointer-events-none"
          style={{ background: "rgba(236,253,245,0.97)", backdropFilter: "blur(4px)" }}
        >
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "#D1FAE5", border: "2px solid #6EE7B7" }}>
            <CheckCircle2 size={28} color="#059669" strokeWidth={2.5} />
          </div>
          <div className="text-center">
            <p style={{ fontSize: 15, fontWeight: 700, color: "#065F46" }}>Invite Sent!</p>
            <p style={{ fontSize: 11, color: "#047857", marginTop: 4 }}>Google Calendar invite dispatched successfully.</p>
            <p style={{ fontSize: 10, color: "#6EE7B7", marginTop: 6, fontFamily: "var(--font-mono)" }}>Returning to chat…</p>
          </div>
        </div>
      )}

      <div className="px-5 py-4 shrink-0" style={{ borderBottom: "1px solid var(--border)", background: "var(--card)" }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>Schedule a Meeting</h3>
        <p style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 2 }}>With {conv.candidateName} · {conv.role}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5" style={{ scrollbarWidth: "none" }}>
        {/* Meeting type */}
        <section>
          <p style={{ fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "var(--font-mono)", marginBottom: 8 }}>
            Meeting Type
          </p>
          <div className="flex gap-2">
            {(["video", "in-person"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setMeetingType(t)}
                disabled={isDispatching}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 flex-1 justify-center transition-colors"
                style={{
                  background: meetingType === t ? "var(--primary)" : "var(--secondary)",
                  color: meetingType === t ? "#fff" : "var(--muted-foreground)",
                  border: meetingType === t ? "none" : "1px solid var(--border)",
                  fontSize: 12, fontWeight: meetingType === t ? 600 : 400,
                }}
              >
                {t === "video" ? <Video size={13} strokeWidth={2} /> : <MapPin size={13} strokeWidth={2} />}
                {t === "video" ? "Video call" : "In person"}
              </button>
            ))}
          </div>
        </section>

        {/* Available slots */}
        <section>
          <p style={{ fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "var(--font-mono)", marginBottom: 8 }}>
            Available Slots
          </p>
          <div className="space-y-2">
            {meetingSlots.map((slot) => {
              const active = picked === slot.id;
              return (
                <button
                  key={slot.id}
                  onClick={() => { if (!isDispatching) setPicked(slot.id); }}
                  disabled={isDispatching}
                  className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all"
                  style={{
                    background: active ? "rgba(194,98,42,0.06)" : "var(--card)",
                    border: active ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                  }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: active ? "rgba(194,98,42,0.10)" : "var(--accent)" }}>
                    {slot.type === "video"
                      ? <Video size={15} style={{ color: active ? "var(--primary)" : "var(--muted-foreground)" }} strokeWidth={1.8} />
                      : <MapPin size={15} style={{ color: active ? "var(--primary)" : "var(--muted-foreground)" }} strokeWidth={1.8} />}
                  </div>
                  <div className="flex-1">
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>{slot.label}</p>
                    <p style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 1 }}>{slot.date} · {slot.time}</p>
                  </div>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ border: `1.5px solid ${active ? "var(--primary)" : "var(--border)"}`, background: active ? "var(--primary)" : "transparent" }}>
                    {active && <CheckCircle2 size={11} color="#fff" strokeWidth={3} />}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <div className="px-5 py-4 shrink-0" style={{ borderTop: "1px solid var(--border)", background: "var(--card)" }}>
        <button
          onClick={handleDispatch}
          disabled={!picked || isDispatching}
          className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 transition-all"
          style={{
            background: "var(--primary)",
            color: "#fff",
            fontSize: 13,
            fontWeight: 500,
            opacity: picked && !isDispatching ? 1 : 0.45,
            cursor: picked && !isDispatching ? "pointer" : "not-allowed",
          }}
        >
          {isDispatching ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin"><Sparkles size={14} /></span>
              Dispatching to Google Calendar...
            </span>
          ) : (
            <span className="flex items-center gap-2"><Calendar size={14} strokeWidth={2} /> Send Meeting Invite</span>
          )}
        </button>
      </div>
    </div>
  );
}

/* Hiring & Onboarding panel */
function HiringPanel({ conv, onStageChange }: { conv: Conversation; onStageChange: (s: HiringStage) => void }) {
  const [tasks, setTasks] = useState<OnboardingTask[]>(onboardingTasks);
  const [showOffer, setShowOffer] = useState(false);

  const toggleTask = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const candidateTasks = tasks.filter((t) => t.owner === "candidate");
  const employerTasks = tasks.filter((t) => t.owner === "employer");
  const doneCount = tasks.filter((t) => t.done).length;
  const pct = Math.round((doneCount / tasks.length) * 100);

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--background)" }}>
      <div className="px-5 py-4 shrink-0" style={{ borderBottom: "1px solid var(--border)", background: "var(--card)" }}>
        <h3 style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>Hiring & Onboarding</h3>
        <p style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 2 }}>{conv.candidateName} · {conv.role}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5" style={{ scrollbarWidth: "none" }}>
        {/* Stage tracker */}
        <section>
          <p style={{ fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "var(--font-mono)", marginBottom: 12 }}>
            Hiring Stage
          </p>
          <StageTrack stage={conv.stage} onChange={onStageChange} />
        </section>

        {/* Offer card */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <p style={{ fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "var(--font-mono)" }}>Offer Details</p>
            <button onClick={() => setShowOffer((p) => !p)} className="flex items-center gap-1" style={{ fontSize: 10, color: "var(--primary)", fontWeight: 500 }}>
              {showOffer ? "Collapse" : "Expand"}
              <ChevronDown size={11} style={{ transform: showOffer ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
            </button>
          </div>
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            <div className="flex items-center justify-between px-4 py-3" style={{ background: "var(--card)" }}>
              <div className="flex items-center gap-2">
                <FileText size={13} style={{ color: "var(--primary)" }} strokeWidth={2} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)" }}>Offer Letter Draft</span>
              </div>
              <span className="rounded px-2 py-0.5" style={{ fontSize: 9, fontWeight: 600, background: "#FFF3E8", color: "var(--primary)" }}>DRAFT</span>
            </div>
            {showOffer && (
              <div className="px-4 pb-4 pt-3 space-y-3" style={{ borderTop: "1px solid var(--border)", background: "var(--card)" }}>
                {[
                  { label: "Role", value: conv.role },
                  { label: "Base Salary", value: "$185,000 / yr" },
                  { label: "Equity", value: "0.12% (4yr vest, 1yr cliff)" },
                  { label: "Start Date", value: "Aug 4, 2025" },
                  { label: "Location", value: "Remote (US)" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{label}</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "var(--foreground)", fontFamily: label === "Base Salary" || label === "Equity" ? "var(--font-mono)" : "inherit" }}>{value}</span>
                  </div>
                ))}
                <button className="w-full flex items-center justify-center gap-2 rounded-lg py-2 mt-2" style={{ background: "var(--primary)", fontSize: 12, fontWeight: 500, color: "#fff" }}>
                  <Send size={12} strokeWidth={2} />
                  Send Offer to Candidate
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Onboarding checklist */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <p style={{ fontSize: 10, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "var(--font-mono)" }}>
              Onboarding Checklist
            </p>
            <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--primary)", fontWeight: 600 }}>{doneCount}/{tasks.length}</span>
          </div>

          {/* Progress bar */}
          <div className="rounded-full overflow-hidden mb-4" style={{ height: 4, background: "var(--accent)" }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: "var(--primary)" }} />
          </div>

          {/* Candidate tasks */}
          <p style={{ fontSize: 10, color: "var(--muted-foreground)", fontFamily: "var(--font-mono)", marginBottom: 6 }}>CANDIDATE ACTIONS</p>
          <div className="space-y-1.5 mb-4">
            {candidateTasks.map((task) => (
              <button key={task.id} onClick={() => toggleTask(task.id)}
                className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-accent"
                style={{ background: task.done ? "rgba(45,106,79,0.04)" : "var(--card)", border: "1px solid var(--border)" }}>
                {task.done
                  ? <CheckCircle2 size={15} style={{ color: "#2D6A4F", flexShrink: 0 }} strokeWidth={2.5} />
                  : <Circle size={15} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} strokeWidth={1.8} />}
                <span style={{ fontSize: 12, color: task.done ? "var(--muted-foreground)" : "var(--foreground)", textDecoration: task.done ? "line-through" : "none", flex: 1 }}>{task.label}</span>
                <span style={{ fontSize: 10, color: "var(--muted-foreground)", fontFamily: "var(--font-mono)", flexShrink: 0 }}>Due {task.dueDate}</span>
              </button>
            ))}
          </div>

          {/* Employer tasks */}
          <p style={{ fontSize: 10, color: "var(--muted-foreground)", fontFamily: "var(--font-mono)", marginBottom: 6 }}>YOUR ACTIONS</p>
          <div className="space-y-1.5">
            {employerTasks.map((task) => (
              <button key={task.id} onClick={() => toggleTask(task.id)}
                className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-accent"
                style={{ background: task.done ? "rgba(45,106,79,0.04)" : "var(--card)", border: "1px solid var(--border)" }}>
                {task.done
                  ? <CheckCircle2 size={15} style={{ color: "#2D6A4F", flexShrink: 0 }} strokeWidth={2.5} />
                  : <Circle size={15} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} strokeWidth={1.8} />}
                <span style={{ fontSize: 12, color: task.done ? "var(--muted-foreground)" : "var(--foreground)", textDecoration: task.done ? "line-through" : "none", flex: 1 }}>{task.label}</span>
                <span style={{ fontSize: 10, color: "var(--muted-foreground)", fontFamily: "var(--font-mono)", flexShrink: 0 }}>Due {task.dueDate}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/* Thread view */
function ThreadView({
  conv,
  onSend,
  onSchedule,
  onHiring,
}: {
  conv: Conversation;
  onSend: (text: string) => void;
  onSchedule: () => void;
  onHiring: () => void;
}) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [conv.messages]);

  const status = stageConfig[conv.stage];

  return (
    <div className="flex flex-col h-full">
      {/* Stage badge */}
      <div className="flex items-center justify-between px-4 py-2 shrink-0" style={{ background: "var(--accent)", borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-1.5">
          <span style={{ fontSize: 10, color: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}>STAGE:</span>
          <span className="rounded px-2 py-0.5" style={{ fontSize: 10, fontWeight: 600, background: status.bg, color: status.color }}>{status.label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={onSchedule} className="flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-colors hover:bg-card" style={{ fontSize: 11, color: "var(--primary)", fontWeight: 500, border: "1px solid var(--border)", background: "var(--card)" }}>
            <Calendar size={11} strokeWidth={2} />Schedule
          </button>
          <button onClick={onHiring} className="flex items-center gap-1.5 rounded-md px-2.5 py-1 transition-colors hover:bg-card" style={{ fontSize: 11, color: "var(--primary)", fontWeight: 500, border: "1px solid var(--border)", background: "var(--card)" }}>
            <UserCheck size={11} strokeWidth={2} />Hiring
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ scrollbarWidth: "none", background: "var(--background)" }}>
        {conv.messages.map((msg) => {
          if (msg.role === "system") {
            return (
              <div key={msg.id} className="flex justify-center">
                <span className="rounded-full px-3 py-1" style={{ fontSize: 10, color: "var(--muted-foreground)", background: "var(--accent)", fontFamily: "var(--font-mono)" }}>{msg.text}</span>
              </div>
            );
          }
          const isEmployer = msg.role === "employer";
          return (
            <div key={msg.id} className={`flex gap-2.5 ${isEmployer ? "flex-row-reverse" : ""}`}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-white"
                style={{ background: isEmployer ? "#7C5C4A" : conv.avatarBg, fontSize: 9, fontFamily: "var(--font-mono)", fontWeight: 600 }}>
                {isEmployer ? "AK" : conv.candidateInitials}
              </div>
              <div className="flex flex-col gap-1 max-w-[76%]">
                {msg.attachment && (
                  <div className="rounded-xl px-4 py-3 mb-1" style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}>
                    <div className="flex items-center gap-2">
                      {msg.attachment.type === "meeting" && <Calendar size={13} style={{ color: "var(--primary)" }} strokeWidth={2} />}
                      {msg.attachment.type === "offer" && <FileText size={13} style={{ color: "var(--primary)" }} strokeWidth={2} />}
                      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)" }}>{msg.attachment.label}</span>
                    </div>
                  </div>
                )}
                <div className="rounded-2xl px-4 py-2.5"
                  style={{
                    background: isEmployer ? "var(--primary)" : "var(--card)",
                    border: isEmployer ? "none" : "1px solid var(--border)",
                    borderTopRightRadius: isEmployer ? 6 : undefined,
                    borderTopLeftRadius: !isEmployer ? 6 : undefined,
                  }}>
                  <p style={{ fontSize: 13, color: isEmployer ? "#fff" : "var(--foreground)", lineHeight: 1.6 }}>{msg.text}</p>
                </div>
                <span style={{ fontSize: 10, color: "var(--muted-foreground)", textAlign: isEmployer ? "right" : "left", fontFamily: "var(--font-mono)" }}>{msg.time}</span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Shortcuts */}
      <div className="px-4 pt-2 pb-1.5 shrink-0" style={{ borderTop: "1px solid var(--border)", background: "var(--card)" }}>
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {shortcuts.map((s) => (
            <button key={s} onClick={() => onSend(s)}
              className="rounded-full px-3 py-1.5 shrink-0 transition-colors hover:bg-accent"
              style={{ background: "var(--secondary)", border: "1px solid var(--border)", fontSize: 11, color: "var(--muted-foreground)", fontWeight: 500, whiteSpace: "nowrap" }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="px-4 py-3 shrink-0" style={{ background: "var(--card)" }}>
        <div className="flex items-center gap-2 rounded-lg px-4" style={{ background: "var(--input-background)", border: "1px solid var(--border)", height: 42 }}>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { onSend(input); setInput(""); } }}
            placeholder={`Message ${conv.candidateName}…`}
            className="flex-1 bg-transparent outline-none" style={{ fontSize: 13, color: "var(--foreground)" }} />
          <button onClick={() => { onSend(input); setInput(""); }}
            className="w-7 h-7 rounded-md flex items-center justify-center transition-all"
            style={{ background: input.trim() ? "var(--primary)" : "var(--muted)", opacity: input.trim() ? 1 : 0.45 }}>
            <Send size={12} color="#fff" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   Main EmployerChatbox
──────────────────────────────────────────────── */
interface Props {
  prefilledMessage?: string;
  candidateName?: string;
  onClose: () => void;
}

export function EmployerChatbox({ prefilledMessage, candidateName, onClose }: Props) {
  /* Build initial conversations list */
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const list: Conversation[] = [
      makeConversation("c3", "Nneka Okonkwo", "NO", "#4A5568", "Principal UX Researcher", "interview", 2),
      makeConversation("c2", "Marcus Webb", "MW", "#4A6741", "Growth Engineering Lead", "offer", 0),
      makeConversation("c4", "David Lin", "DL", "#6B4F6B", "Data Platform Engineer", "onboarding", 1),
    ];
    if (candidateName && prefilledMessage) {
      list.unshift(makeConversation("c1", candidateName, candidateName.split(" ").map((w) => w[0]).join("").slice(0, 2), "#7C5C4A", "Senior Product Architect", "shortlisted", 0, prefilledMessage));
    }
    return list;
  });

  const [activeConvId, setActiveConvId] = useState<string>(
    candidateName ? "c1" : "c3"
  );
  const [panel, setPanel] = useState<PanelView>("thread");
  const [search, setSearch] = useState("");

  const activeConv = conversations.find((c) => c.id === activeConvId)!;

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const msg: ChatMsg = { id: `m${Date.now()}`, role: "employer", text: text.trim(), time: "Just now" };
    setConversations((prev) =>
      prev.map((c) => c.id === activeConvId ? { ...c, messages: [...c.messages, msg], lastMsg: text.trim(), lastTime: "Just now", unread: 0 } : c)
    );
    setTimeout(() => {
      const reply: ChatMsg = { id: `r${Date.now()}`, role: "candidate", text: "Thanks for the update! Looking forward to hearing more.", time: "Just now" };
      setConversations((prev) =>
        prev.map((c) => c.id === activeConvId ? { ...c, messages: [...c.messages, reply] } : c)
      );
    }, 900);
  };

  const sendMeeting = (slot: MeetingSlot, eventId: string) => {
    const msg: ChatMsg = {
      id: `meet${Date.now()}`, role: "employer",
      text: `I've sent a calendar invite for our ${slot.label} on ${slot.date} at ${slot.time}. Looking forward to it!`,
      time: "Just now",
      attachment: { type: "meeting", label: `📅 ${slot.label} · Google Calendar: ${eventId}` },
    };
    const sysMsg: ChatMsg = {
      id: `sys${Date.now()}`, role: "system",
      text: `Meeting confirmed. AI Summary Brief automatically attached to Calendar Event ${eventId}.`,
      time: "Just now",
    };
    
    setConversations((prev) =>
      prev.map((c) => c.id === activeConvId ? { ...c, messages: [...c.messages, msg, sysMsg], lastMsg: `Meeting invite: ${slot.label}`, lastTime: "Just now" } : c)
    );
    setPanel("thread");
  };

  const changeStage = (stage: HiringStage) => {
    setConversations((prev) =>
      prev.map((c) => c.id === activeConvId ? { ...c, stage } : c)
    );
  };

  const filteredConvs = conversations.filter((c) =>
    c.candidateName.toLowerCase().includes(search.toLowerCase()) ||
    c.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-1 overflow-hidden" style={{ fontFamily: "var(--font-sans)" }}>

      {/* ── Conversations sidebar ── */}
      <div className="flex flex-col overflow-hidden shrink-0" style={{ width: 260, borderRight: "1px solid var(--border)", background: "var(--card)" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2">
            <MessageSquareMore size={14} style={{ color: "var(--primary)" }} strokeWidth={2} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>Introductions</span>
          </div>
          <button className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-accent transition-colors" style={{ border: "1px solid var(--border)" }}>
            <Plus size={12} style={{ color: "var(--muted-foreground)" }} strokeWidth={2.5} />
          </button>
        </div>

        {/* Search */}
        <div className="px-3 py-2 shrink-0" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-1.5 rounded-md px-2.5" style={{ background: "var(--input-background)", height: 30 }}>
            <Search size={11} style={{ color: "var(--muted-foreground)" }} strokeWidth={2} />
            <input type="text" placeholder="Search conversations…" value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none" style={{ fontSize: 11, color: "var(--foreground)" }} />
          </div>
        </div>

        {/* Conv list */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          {filteredConvs.map((conv) => {
            const active = conv.id === activeConvId;
            const stage = stageConfig[conv.stage];
            return (
              <button key={conv.id} onClick={() => { setActiveConvId(conv.id); setPanel("thread"); }}
                className="w-full flex items-start gap-2.5 px-4 py-3 text-left transition-colors"
                style={{ background: active ? "var(--background)" : "transparent", borderBottom: "1px solid var(--border)", borderLeft: active ? "2px solid var(--primary)" : "2px solid transparent" }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white mt-0.5" style={{ background: conv.avatarBg, fontSize: 9, fontFamily: "var(--font-mono)", fontWeight: 600 }}>
                  {conv.candidateInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)" }}>{conv.candidateName}</span>
                    {conv.unread > 0 && (
                      <span className="w-4 h-4 rounded-full flex items-center justify-center text-white shrink-0" style={{ background: "var(--primary)", fontSize: 9, fontFamily: "var(--font-mono)" }}>
                        {conv.unread}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="rounded px-1.5 py-0.5" style={{ fontSize: 8, fontWeight: 600, background: stage.bg, color: stage.color }}>{stage.label}</span>
                  </div>
                  <p className="truncate mt-1" style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{conv.lastMsg}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Thread + panel area ── */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Candidate header */}
        <div className="flex items-center gap-3 px-5 py-3 shrink-0" style={{ borderBottom: "1px solid var(--border)", background: "var(--card)" }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white" style={{ background: activeConv.avatarBg, fontSize: 10, fontFamily: "var(--font-mono)", fontWeight: 600 }}>
            {activeConv.candidateInitials}
          </div>
          <div className="flex-1">
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>{activeConv.candidateName}</p>
            <p style={{ fontSize: 11, color: "var(--muted-foreground)", marginTop: 1 }}>{activeConv.role}</p>
          </div>
          {/* Panel tabs */}
          <div className="flex items-center gap-1">
            {([
              ["thread", MessageSquareMore, "Thread"],
              ["schedule", Calendar, "Schedule"],
              ["hiring", UserCheck, "Hiring"],
            ] as [PanelView, React.ComponentType<any>, string][]).map(([id, Icon, label]) => (
              <button key={id} onClick={() => setPanel(id)}
                className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 transition-colors"
                style={{ fontSize: 11, fontWeight: panel === id ? 600 : 400, background: panel === id ? "var(--primary)" : "var(--secondary)", color: panel === id ? "#fff" : "var(--muted-foreground)", border: panel === id ? "none" : "1px solid var(--border)" }}>
                <Icon size={11} strokeWidth={2} />
                {label}
              </button>
            ))}
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-accent transition-colors">
            <X size={13} style={{ color: "var(--muted-foreground)" }} />
          </button>
        </div>

        {/* Panel content */}
        <div className="flex-1 overflow-hidden">
          {panel === "thread" && (
            <ThreadView
              conv={activeConv}
              onSend={sendMessage}
              onSchedule={() => setPanel("schedule")}
              onHiring={() => setPanel("hiring")}
            />
          )}
          {panel === "schedule" && (
            <SchedulePanel
              conv={activeConv}
              onSendMeeting={sendMeeting}
              onNavigateToThread={() => setPanel("thread")}
            />
          )}
          {panel === "hiring" && (
            <HiringPanel conv={activeConv} onStageChange={changeStage} />
          )}
        </div>
      </div>
    </div>
  );
}
