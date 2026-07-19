export enum CandidatePhase {
    READY_FOR_PIVOT = "Ready for Pivot",
    ACCELERATING = "Accelerating",
    EXPLORING = "Exploring",
    DEEP_SPECIALIZING = "Deep Specializing"
}

export enum MatchStage {
    NEW_MATCH = "New Match",
    REVIEWING = "Reviewing",
    INTRODUCED = "Introduced",
    OFFER_SENT = "Offer Sent",
    SCHEDULED = "Scheduled",
    INTERVIEW = "Interview",
    ONBOARDING = "Onboarding"
}

// --- Navigation Shell ---

/** All primary sidebar tabs in the Collapsible Navigation Shell (PRD §1). */
export enum NavigationShellTab {
    PROFILE = "Profile",
    SEARCH = "Search",
    SAVED_COMPANIES = "Saved Companies",
    FEED = "Feed",
    WORK = "Work",       // Trajectory Space
    CHAT = "Chat",
    SETTINGS = "Settings"
}

// --- Community Verification ---

/** Identity trust tags appended to Signal Stream comments (PRD §3). */
export enum IdentityTrustTag {
    WORKING_HERE = "#WorkingHere",
    PAST_WORKER = "#PastWorker"
}

/** Intent-based hashtags that bucket interactions in the Signal Stream (PRD §3). */
export enum IntentHashtag {
    ASKING = "#Asking",
    TECH_STACK_QUERY = "#TechStackQuery",
    COMMENT_AFTER_WORKING = "#CommentAfterWorking"
}

// --- Shared Interfaces ---

export interface SkillTag {
    name: string;
    isVerified: boolean;
}

export interface GrowthTradeOff {
    skillAcquired: string;
    potentialPlateau: string;
}

/** A near-term capability gap flagged by the AI Trajectory Justification module (PRD §2). */
export interface SkillGap {
    name: string;
    severity: "Low" | "Medium" | "High";
    mentorshipRequired: boolean;
}

/** A time window used by the scheduling engine for Google Calendar overlap analysis (PRD §4). */
export interface AvailabilitySlot {
    startTime: Date;
    endTime: Date;
    isAvailable: boolean;
}
