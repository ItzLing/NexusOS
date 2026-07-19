import { OnboardingRecord } from "../domain/OnboardingRecord";

/**
 * State manager for the Success Onboarding Micro-Stage (PRD §4).
 *
 * Activated the moment a candidate transitions to a successful application
 * status. Provides a dedicated workspace structured around the trajectory
 * gaps identified during the AI matching phase to minimize early friction
 * and reinforce long-term operational resilience.
 */
export class OnboardingWorkspaceManager {
    private sessions: OnboardingRecord[] = [];

    /**
     * Start an onboarding session for a newly matched candidate.
     * Called immediately when `MatchStage` transitions to `ONBOARDING`.
     */
    public startOnboarding(record: OnboardingRecord): void {
        const existing = this.sessions.find(
            s => s.candidateId === record.candidateId && s.roleId === record.roleId
        );
        if (!existing) {
            this.sessions.push(record);
        }
    }

    /** Returns the onboarding record for a specific candidate, if active. */
    public getOnboardingForCandidate(candidateId: string): OnboardingRecord | null {
        return this.sessions.find(s => s.candidateId === candidateId) ?? null;
    }

    /**
     * Marks an early milestone as achieved for a candidate's onboarding plan.
     * Updates the milestone's `isVerified` flag and records the achievement timestamp.
     */
    public updateMilestoneProgress(candidateId: string, milestoneId: string): void {
        const session = this.getOnboardingForCandidate(candidateId);
        if (session) {
            const milestone = session.earlyMilestones.find(m => m.id === milestoneId);
            if (milestone) {
                milestone.isVerified = true;
                milestone.timestampAchieved = new Date();
            }
        }
    }

    /** Returns all active onboarding sessions. */
    public getAllSessions(): OnboardingRecord[] {
        return this.sessions;
    }

    /** Returns all candidates currently in the onboarding stage. */
    public getActiveCandidateIds(): string[] {
        return this.sessions.map(s => s.candidateId);
    }
}
