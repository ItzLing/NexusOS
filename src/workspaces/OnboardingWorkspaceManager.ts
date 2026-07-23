import { OnboardingRecord } from "../domain/OnboardingRecord";
import { Candidate } from "../domain/Candidate";
import { RoleListing } from "../domain/RoleListing";
import { AIJustification } from "../domain/AIJustification";
import { Milestone } from "../domain/Milestone";
import { SkillGap } from "../domain/shared";

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

    /**
     * Automatically sets up a structured onboarding session mapping dependencies
     * and targeted mentorship milestones based on identified skill gaps.
     */
    public setupOnboarding(
        candidate: Candidate,
        role: RoleListing,
        justification: AIJustification
    ): OnboardingRecord {
        // Map dependencies based on role department and skills
        const teamDependencies = ["Core Engineering Group"];
        if (role.department.toLowerCase().includes("data") || role.department.toLowerCase().includes("infra")) {
            teamDependencies.push("Data Platform Team", "Infrastructure Operations");
        } else if (role.department.toLowerCase().includes("product") || role.department.toLowerCase().includes("ux")) {
            teamDependencies.push("UI/UX Design Studio", "Product Analytics");
        } else {
            teamDependencies.push("Frontend Engineering Team", "Product Operations");
        }

        // Map early milestones based on skill gaps
        const earlyMilestones: Milestone[] = [];
        let index = 1;

        // Base general milestone
        earlyMilestones.push(new Milestone(
            `onb-ms-${candidate.id}-base`,
            "1-on-1 Architecture Walkthrough",
            "Pairing with team architect to review current architecture and service boundaries.",
            "Technical Buddy Review",
            false,
            new Date(),
            []
        ));

        // Skill-gap specific milestones
        for (const gap of justification.skillGaps) {
            earlyMilestones.push(new Milestone(
                `onb-ms-${candidate.id}-gap-${index++}`,
                `Bridge Gap: ${gap.name} Mentorship`,
                `Targeted milestone to resolve early operational risk. Mentorship requirement: ${gap.mentorshipRequired ? "Required (High/Medium Severity)" : "Recommended (Self-paced)"}.`,
                "Hiring Manager Endorsement",
                false,
                new Date(),
                [{ name: gap.name, isVerified: false }]
            ));
        }

        // Technical resources links
        const technicalResources = [
            "https://internal-docs.talentbank.network/architecture-overview",
            "https://internal-docs.talentbank.network/ci-cd-pipelines"
        ];

        const record = new OnboardingRecord(
            candidate.id,
            role.id,
            teamDependencies,
            earlyMilestones,
            technicalResources,
            justification.skillGaps
        );

        this.startOnboarding(record);
        return record;
    }
}

