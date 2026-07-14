import { Milestone } from "../domain/Milestone";

/**
 * State manager for the Trajectory Command Center (PRD §1).
 *
 * Tracks the candidate's developmental milestones across their continuous
 * timeline, including real-time verifications such as live codebase commits
 * and system architecture submissions.
 */
export class TrajectoryWorkspace {
    private milestones: Milestone[] = [];

    /** Add a new milestone to the developmental timeline. */
    public addMilestone(milestone: Milestone): void {
        this.milestones.push(milestone);
    }

    /**
     * Mark a milestone as verified after its source record is confirmed
     * (e.g., GitHub commit validated, certification body confirmed).
     */
    public verifyMilestone(id: string): void {
        const milestone = this.milestones.find(m => m.id === id);
        if (milestone) {
            milestone.isVerified = true;
        }
    }

    /** Returns all milestones on the timeline, ordered as added. */
    public getMilestones(): Milestone[] {
        return this.milestones;
    }

    /**
     * Returns only verified milestones — suitable for display in the
     * Trajectory Command Center's main timeline view.
     */
    public getVerifiedMilestones(): Milestone[] {
        return this.milestones.filter(m => m.isVerified);
    }

    /** Returns the total count of milestones for summary panels. */
    public getMilestoneCount(): number {
        return this.milestones.length;
    }
}
