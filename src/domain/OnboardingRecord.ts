import { Milestone } from "./Milestone";
import { SkillGap } from "./shared";

/**
 * Models the data powering the Success Onboarding Micro-Stage (PRD §4).
 *
 * This record is created the moment a candidate transitions to a successful
 * application status. It structures early onboarding around the trajectory
 * gaps identified during the matching phase to reinforce long-term
 * operational resilience and reduce early turnover.
 */
export class OnboardingRecord {
    constructor(
        /** The successfully matched candidate. */
        public candidateId: string,

        /** The role listing the candidate has been matched to. */
        public roleId: string,

        /**
         * Key people, teams, or systems the candidate must engage with
         * during their initial onboarding period.
         */
        public teamDependencies: string[],

        /**
         * Initial milestones the candidate is expected to reach during
         * their onboarding and probation phase.
         */
        public earlyMilestones: Milestone[],

        /**
         * Links to technical documentation, tooling guides, and
         * infrastructure resources relevant to the candidate's role.
         */
        public technicalResources: string[],

        /**
         * The skill gaps (identified by the AI Trajectory Justification module)
         * that this onboarding plan is specifically structured to bridge.
         * Directly linked from the corresponding `AIJustification.skillGaps` (PRD §2).
         */
        public trajectoryGapsBridged: SkillGap[]
    ) {}
}
