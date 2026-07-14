import { TalentPipelineWorkspace } from "../workspaces/TalentPipelineWorkspace";
import { ActiveMatchesWorkspace } from "../workspaces/ActiveMatchesWorkspace";
import { OpenRolesWorkspace } from "../workspaces/OpenRolesWorkspace";
import { DirectIntroductionsWorkspace } from "../workspaces/DirectIntroductionsWorkspace";
import { TrajectoryWorkspace } from "../workspaces/TrajectoryWorkspace";
import { SignalStreamWorkspace } from "../workspaces/SignalStreamWorkspace";
import { CommunityVerificationWorkspace } from "../workspaces/CommunityVerificationWorkspace";
import { SchedulingWorkspace } from "../workspaces/SchedulingWorkspace";
import { OnboardingWorkspaceManager } from "../workspaces/OnboardingWorkspaceManager";
import { NavigationShellTab } from "../domain/shared";

/**
 * Top-level application shell orchestrating all workspaces and navigation
 * state for NexusOS (PRD §1).
 *
 * Manages the Collapsible Navigation Shell's sidebar collapse state and
 * provides a unified entry point for all workspace managers.
 */
export class CareerOSApplicationShell {
    // --- Original Workspaces ---
    public pipeline = new TalentPipelineWorkspace();
    public activeMatches = new ActiveMatchesWorkspace();
    public openRoles = new OpenRolesWorkspace();
    public introductions = new DirectIntroductionsWorkspace();

    // --- New PRD Workspaces ---

    /** Trajectory Command Center: developmental milestone timeline (PRD §1). */
    public trajectory = new TrajectoryWorkspace();

    /** Signal Stream: community feed with trust tags and intent hashtags (PRD §1, §3). */
    public signalStream = new SignalStreamWorkspace();

    /** Ground-Truth Review Framework: verified company reviews (PRD §3). */
    public communityVerification = new CommunityVerificationWorkspace();

    /** Google Calendar Integration: interview scheduling dispatcher (PRD §4). */
    public scheduling = new SchedulingWorkspace();

    /** Success Onboarding Micro-Stage: post-match onboarding manager (PRD §4). */
    public onboarding = new OnboardingWorkspaceManager();

    constructor(
        /** The currently active tab in the Collapsible Navigation Shell (PRD §1). */
        public currentTab: NavigationShellTab = NavigationShellTab.WORK,

        /** The display name of the currently authenticated user. */
        public currentUser: string = "Arjun K.",

        /** True when operating in employer/recruiter context; false for candidate view. */
        public isEmployerContext: boolean = true,

        /**
         * Whether the sidebar navigation shell is collapsed (PRD §1).
         * The shell collapses during active vertical scrolling and
         * restores on cursor interaction.
         */
        public sidebarCollapsed: boolean = false
    ) {}

    /** Switch the active tab in the Collapsible Navigation Shell. */
    public switchTab(tab: NavigationShellTab): void {
        this.currentTab = tab;
    }

    /**
     * Toggle sidebar visibility — called by the scroll/cursor interaction
     * listener in the UI layer (PRD §1).
     */
    public setSidebarCollapsed(collapsed: boolean): void {
        this.sidebarCollapsed = collapsed;
    }
}
