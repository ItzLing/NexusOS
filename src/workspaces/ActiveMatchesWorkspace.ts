import { Candidate } from "../domain/Candidate";
import { MatchStage } from "../domain/shared";

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
