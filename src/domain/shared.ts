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
    ONBOARDING = "Onboarding",
    INTERVIEW = "Interview"
}

export interface SkillTag {
    name: string;
    isVerified: boolean;
}

export interface GrowthTradeOff {
    skillAcquired: string;
    potentialPlateau: string;
}
