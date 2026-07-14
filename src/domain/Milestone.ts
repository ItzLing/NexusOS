import { SkillTag } from "./shared";

/**
 * Represents a single active milestone on the candidate's developmental
 * timeline in the Trajectory Command Center (PRD §1).
 *
 * Milestones can be backed by real-time capability verifications such as
 * live codebase commits, system architecture submissions, or certification records.
 */
export class Milestone {
    constructor(
        public readonly id: string,

        /** Short, human-readable title of the milestone. */
        public title: string,

        /** Longer description of what was achieved at this milestone. */
        public description: string,

        /**
         * The source that backs the verification, e.g. "GitHub Commit",
         * "System Architecture Diagram", "Certification Body".
         */
        public verificationSource: string,

        /** Whether the milestone has been verified against the source record. */
        public isVerified: boolean,

        /** The date and time at which this milestone was achieved. */
        public timestampAchieved: Date,

        /** Skills that were demonstrated or unlocked by this milestone. */
        public linkedSkills: SkillTag[]
    ) {}
}
