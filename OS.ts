// ==========================================
// 1. SHARED DOMAIN VALUES & ENUMS
// ==========================================

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

// ==========================================
// 2. CORE DOMAIN ENTITIES
// ==========================================

export class Candidate {
    constructor(
        public readonly id: string,
        public name: string,
        public initials: string,
        public currentTitle: string,
        public location: string,
        public biographicSignal: string,
        public phase: CandidatePhase,
        public verifiedSkills: SkillTag[]
    ) {}
}

export class RoleListing {
    constructor(
        public readonly id: string,
        public title: string,
        public department: string,
        public locationType: string, // e.g., "Remote (US)"
        public totalApplications: number,
        public postAgeDescription: string, // e.g., "3 days ago"
        public tags: string[], // e.g., ["Dynamic Demand Signal", "Foundation"]
        public leadRoleTarget: string, // e.g., "Staff Engineer, Data Systems"
        public timelineDescription: string, // e.g., "12–18 months"
        public intersectionSummary: string,
        public arcPathways: string[], // ["Staff Engineer", "Principal Architect", ...]
        public unlockedSkills: string[]
    ) {}
}

export class AIJustification {
    constructor(
        public arcPatternText: string,
        public roleOverlapText: string,
        public forwardSignalText: string,
        public forwardStrengths: string[],
        public tradeOffs: GrowthTradeOff[]
    ) {}
}

// ==========================================
// 3. SCREEN & WORKSPACE STATE ENGINES
// ==========================================

/**
 * Screen 1: Talent Pipeline View Engine
 */
export class TalentPipelineWorkspace {
    private candidates: Map<string, { candidate: Candidate; matchPercentage: number }> = new Map();
    private justifications: Map<string, AIJustification> = new Map();
    private selectedCandidateId: string | null = null;

    public addCandidate(candidate: Candidate, matchPercentage: number, justification: AIJustification): void {
        this.candidates.set(candidate.id, { candidate, matchPercentage });
        this.justifications.set(candidate.id, justification);
        if (!this.selectedCandidateId) {
            this.selectedCandidateId = candidate.id; // Default selection like 'Priya Sharma'
        }
    }

    public selectCandidate(candidateId: string): void {
        if (this.candidates.has(candidateId)) {
            this.selectedCandidateId = candidateId;
        }
    }

    public getSelectedCandidateDetails() {
        if (!this.selectedCandidateId) return null;
        return {
            ...this.candidates.get(this.selectedCandidateId)!,
            justification: this.justifications.get(this.selectedCandidateId)!
        };
    }

    public getPipelineSummary() {
        const list = Array.from(this.candidates.values()).map(c => c.candidate);
        return {
            total: list.length,
            readyForPivotCount: list.filter(c => c.phase === CandidatePhase.READY_FOR_PIVOT).length,
            acceleratingCount: list.filter(c => c.phase === CandidatePhase.ACCELERATING).length,
            exploringCount: list.filter(c => c.phase === CandidatePhase.EXPLORING).length,
            deepSpecializingCount: list.filter(c => c.phase === CandidatePhase.DEEP_SPECIALIZING).length
        };
    }
}

/**
 * Screen 2: Active Matches Engine
 */
export interface PairingSession {
    candidate: Candidate;
    targetRoleTitle: string;
    matchPercentage: number;
    stage: MatchStage;
    timeLabel: string; // e.g., "2 hours ago"
    momentumAlert: string;
    pairingReasoning: string;
    overlapTags: string[];
}

export class ActiveMatchesWorkspace {
    private pairings: PairingSession[] = [];
    private selectedPairingIndex: number = 0;

    public registerPairing(pairing: PairingSession): void {
        this.pairings.push(pairing);
    }

    public selectPairing(index: number): void {
        if (index >= 0 && index < this.pairings.length) {
            this.selectedPairingIndex = index;
        }
    }

    public getActivePairings(): PairingSession[] {
        return this.pairings;
    }

    public getSelectedPairing(): PairingSession | null {
        return this.pairings[this.selectedPairingIndex] || null;
    }
}

/**
 * Screen 3: Open Roles Engine
 */
export class OpenRolesWorkspace {
    private roles: RoleListing[] = [];
    private selectedRoleId: string | null = null;

    public addRole(role: RoleListing): void {
        this.roles.push(role);
        if (!this.selectedRoleId) this.selectedRoleId = role.id;
    }

    public selectRole(roleId: string): void {
        this.selectedRoleId = roleId;
    }

    public getRolesList(): RoleListing[] {
        return this.roles;
    }

    public getSelectedRole(): RoleListing | null {
        return this.roles.find(r => r.id === this.selectedRoleId) || null;
    }
}

/**
 * Screen 4: Direct Introductions & Chat Engine
 */
export interface ChatMessage {
    senderName: string;
    text: string;
    timestamp: Date;
}

export interface ConversationThread {
    candidate: Candidate;
    stage: MatchStage;
    unreadCount: number;
    messages: ChatMessage[];
    suggestedAIPromptChips: string[];
}

export class DirectIntroductionsWorkspace {
    private threads: ConversationThread[] = [];
    private activeThreadIndex: number = 0;

    public addThread(thread: ConversationThread): void {
        this.threads.push(thread);
    }

    public selectThread(index: number): void {
        if (index >= 0 && index < this.threads.length) {
            this.activeThreadIndex = index;
        }
    }

    public getThreads(): ConversationThread[] {
        return this.threads;
    }

    public getActiveThread(): ConversationThread | null {
        return this.threads[this.activeThreadIndex] || null;
    }

    public appendMessage(text: string, sender: string): void {
        const activeThread = this.getActiveThread();
        if (activeThread) {
            activeThread.messages.push({
                senderName: sender,
                text,
                timestamp: new Date()
            });
        }
    }
}

// ==========================================
// 4. GLOBAL SHELL ROUTER
// ==========================================

export enum NavigationTab {
    TALENT_PIPELINE,
    ACTIVE_MATCHES,
    OPEN_ROLES,
    DIRECT_INTRODUCTIONS
}

export class CareerOSApplicationShell {
    public pipeline = new TalentPipelineWorkspace();
    public activeMatches = new ActiveMatchesWorkspace();
    public openRoles = new OpenRolesWorkspace();
    public introductions = new DirectIntroductionsWorkspace();
    
    constructor(
        public currentTab: NavigationTab = NavigationTab.TALENT_PIPELINE,
        public currentUser: string = "Arjun K.",
        public isEmployerContext: boolean = true
    ) {}

    public switchTab(tab: NavigationTab): void {
        this.currentTab = tab;
    }
}