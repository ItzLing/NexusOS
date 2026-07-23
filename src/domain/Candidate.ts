import { CandidatePhase, SkillTag } from "./shared";
import { Milestone } from "./Milestone";

export class Candidate {
    public developerLogs: string[] = [];
    public gitHubCommitSignals: string[] = [];
    public rawResumeText: string = "";

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

    /**
     * Calculates the developmental velocity based on GitHub commits and developer logs.
     * Returns a multiplier representing velocity (higher means faster trajectory).
     */
    public getDevelopmentalVelocity(): number {
        const commitWeight = this.gitHubCommitSignals.length * 0.15;
        const logWeight = this.developerLogs.length * 0.1;
        const baseVelocity = 1.0;
        return baseVelocity + commitWeight + logWeight;
    }

    /**
     * Projects a 40-year trajectory of milestones based on the candidate's current skills
     * and active developmental velocity.
     */
    public project40YearTrajectory(): Milestone[] {
        const velocity = this.getDevelopmentalVelocity();
        const projections: Milestone[] = [];
        
        // Define future milestones over a 40-year horizon
        const futureMilestoneTemplates = [
            { years: 2, title: "Lead Systems Architect", desc: "Orchestrate large-scale federated API gateways and multi-region service meshes." },
            { years: 5, title: "Principal Platform Architect", desc: "Design globally distributed, zero-trust data pipeline infrastructures." },
            { years: 10, title: "VP of Engineering / Tech Fellow", desc: "Direct engineering strategy and architecture governance across enterprise portfolios." },
            { years: 20, title: "Chief Technology Officer (CTO)", desc: "Drive global product roadmap, technological innovation, and R&D strategies." },
            { years: 40, title: "Eminent Technology Advisor / Fellow", desc: "Advise boards on next-generation computing frameworks and quantum computing architecture." }
        ];

        const baseTime = new Date();

        for (const template of futureMilestoneTemplates) {
            // Adjust the actual time projection based on velocity. High velocity shortens the time to achieve the milestone!
            const adjustedYears = template.years / velocity;
            const projectedDate = new Date(baseTime);
            projectedDate.setFullYear(baseTime.getFullYear() + adjustedYears);

            projections.push(new Milestone(
                `proj-${this.id}-${template.years}`,
                `${template.title} (Projected)`,
                `${template.desc} (Accelerated due to developmental velocity of ${velocity.toFixed(2)}x)`,
                "AI Trajectory Projection Engine",
                false, // Projected, not verified yet
                projectedDate,
                this.verifiedSkills.slice(0, 2)
            ));
        }

        return projections;
    }
}

