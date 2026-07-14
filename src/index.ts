// --- Shared Types & Enums ---
export * from "./domain/shared";

// --- Core Domain Entities ---
export * from "./domain/Candidate";
export * from "./domain/RoleListing";
export * from "./domain/AIJustification";

// --- PRD Domain Models ---
export * from "./domain/Milestone";
export * from "./domain/SignalPost";
export * from "./domain/CompanyReview";
export * from "./domain/ScheduledInterview";
export * from "./domain/OnboardingRecord";

// --- Original Workspaces ---
export * from "./workspaces/TalentPipelineWorkspace";
export * from "./workspaces/ActiveMatchesWorkspace";
export * from "./workspaces/OpenRolesWorkspace";
export * from "./workspaces/DirectIntroductionsWorkspace";

// --- PRD Workspaces ---
export * from "./workspaces/TrajectoryWorkspace";
export * from "./workspaces/SignalStreamWorkspace";
export * from "./workspaces/CommunityVerificationWorkspace";
export * from "./workspaces/SchedulingWorkspace";
export * from "./workspaces/OnboardingWorkspaceManager";

// --- Application Shell ---
export * from "./shell/CareerOSApplicationShell";
