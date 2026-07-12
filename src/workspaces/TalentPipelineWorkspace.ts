import { Candidate } from "../domain/Candidate";
import { AIJustification } from "../domain/AIJustification";
import { CandidatePhase } from "../domain/shared";

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
