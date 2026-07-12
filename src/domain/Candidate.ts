import { CandidatePhase, SkillTag } from "./shared";

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
